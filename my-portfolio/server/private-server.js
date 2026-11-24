import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import {
  access,
  mkdir,
  readFile,
  rename,
  stat,
  writeFile,
} from "node:fs/promises";
import { createServer } from "node:http";
import { basename, extname, join, normalize, resolve, sep } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const projectDir = fileURLToPath(new URL("../", import.meta.url));
const distDir = resolve(projectDir, "dist");
const publicDir = resolve(projectDir, "public");
const contentFile = resolve(publicDir, "content/site-content.json");
const stagingDir = resolve(projectDir, ".staged-uploads");
const publishedImagesDir = resolve(publicDir, "content/images");
const host = "127.0.0.1";
const port = 7171;
const maxUploadBytes = 10 * 1024 * 1024;
const maxContentBytes = 1024 * 1024;
const allowedHosts = new Set([`localhost:${port}`, `${host}:${port}`]);
const mimeTypes = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};
const imageFilePattern =
  /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}\.(?:avif|gif|jpe?g|png|webp)$/;
const contentSections = new Set(["founder", "projects", "jashey", "skamara"]);

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function sendJson(response, statusCode, value) {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(JSON.stringify(value));
}

function isSameOriginRequest(request) {
  const origin = request.headers.origin;
  const requestHost = request.headers.host?.toLowerCase();

  if (!origin || !requestHost) {
    return false;
  }

  try {
    const parsedOrigin = new URL(origin);
    return (
      parsedOrigin.protocol === "http:" &&
      parsedOrigin.host.toLowerCase() === requestHost &&
      allowedHosts.has(requestHost)
    );
  } catch {
    return false;
  }
}

async function readRequestBody(request, maxBytes, tooLargeMessage) {
  const contentLength = Number(request.headers["content-length"] || 0);
  if (contentLength > maxBytes) {
    throw createHttpError(413, tooLargeMessage);
  }

  const chunks = [];
  let totalBytes = 0;
  let isTooLarge = false;

  for await (const chunk of request) {
    if (isTooLarge) {
      continue;
    }

    totalBytes += chunk.length;
    if (totalBytes > maxBytes) {
      isTooLarge = true;
      chunks.length = 0;
      continue;
    }

    chunks.push(chunk);
  }

  if (isTooLarge) {
    throw createHttpError(413, tooLargeMessage);
  }
  if (!totalBytes) {
    throw createHttpError(400, "The request body is empty.");
  }

  return Buffer.concat(chunks, totalBytes);
}

function requireObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw createHttpError(400, `${label} must be an object.`);
  }
  return value;
}

function requireText(value, label, { allowEmpty = false, max = 2000 } = {}) {
  if (typeof value !== "string" || value.length > max) {
    throw createHttpError(400, `${label} is invalid.`);
  }

  const trimmedValue = value.trim();
  if (!allowEmpty && !trimmedValue) {
    throw createHttpError(400, `${label} cannot be empty.`);
  }

  return trimmedValue;
}

function requireId(value, label) {
  const id = requireText(value, label, { max: 60 });
  if (!/^[a-z0-9-]+$/.test(id)) {
    throw createHttpError(400, `${label} is invalid.`);
  }
  return id;
}

function requireWebUrl(value, label, { required = false } = {}) {
  const url = requireText(value, label, {
    allowEmpty: !required,
    max: 1000,
  });

  if (!url) {
    return "";
  }

  if (url.startsWith("/") && !url.startsWith("//") && !url.includes("..")) {
    return url;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw createHttpError(400, `${label} must be a valid link.`);
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw createHttpError(400, `${label} must use HTTP or HTTPS.`);
  }

  return parsedUrl.href;
}

function requireImagePath(value, label, allowStaged) {
  const imagePath = requireText(value, label, {
    allowEmpty: true,
    max: 300,
  });

  if (!imagePath) {
    return "";
  }

  const isFounderImage =
    imagePath.startsWith("/founder-media/") &&
    imagePath
      .slice("/founder-media/".length)
      .split("/")
      .every(
        (part) =>
          part &&
          part !== "." &&
          part !== ".." &&
          /^[a-zA-Z0-9._-]+(?:%20[a-zA-Z0-9._-]+)*$/.test(part)
      );
  const isPublishedImage = /^\/content\/images\/[a-f0-9-]{36}\.(?:avif|gif|jpe?g|png|webp)$/.test(
    imagePath
  );
  const isStagedImage =
    allowStaged &&
    imagePath.startsWith("/api/staged-images/") &&
    imageFilePattern.test(imagePath.slice("/api/staged-images/".length));

  if (!isFounderImage && !isPublishedImage && !isStagedImage) {
    throw createHttpError(400, `${label} must be a local image.`);
  }

  return imagePath;
}

function requireArray(value, label, transform, maxItems = 50) {
  if (!Array.isArray(value) || value.length > maxItems) {
    throw createHttpError(400, `${label} must be a list of at most ${maxItems}.`);
  }

  const items = value.map((item, index) => transform(item, `${label} ${index + 1}`));
  const ids = items.map((item) => item.id);
  if (new Set(ids).size !== ids.length) {
    throw createHttpError(400, `${label} contains duplicate IDs.`);
  }
  return items;
}

function validateContentSection(section, value, allowStaged) {
  const data = requireObject(value, "Page content");
  const image = (path, label) => requireImagePath(path, label, allowStaged);
  const text = (input, label, options) => requireText(input, label, options);

  if (section === "founder") {
    return {
      pageTitle: text(data.pageTitle, "Founder page title", { max: 120 }),
      name: text(data.name, "Founder name", { max: 120 }),
      description: text(data.description, "Founder description", {
        max: 1000,
      }),
      portrait: image(data.portrait, "Founder portrait"),
      highlightsTitle: text(data.highlightsTitle, "Highlights title", {
        max: 120,
      }),
      highlights: requireArray(data.highlights, "Highlights", (item, label) => {
        const record = requireObject(item, label);
        return {
          id: requireId(record.id, `${label} ID`),
          title: text(record.title, `${label} title`, { max: 160 }),
          category: text(record.category, `${label} category`, {
            allowEmpty: true,
            max: 80,
          }),
          date: text(record.date, `${label} date`, {
            allowEmpty: true,
            max: 40,
          }),
          image: image(record.image, `${label} image`),
          description: text(record.description, `${label} description`, {
            allowEmpty: true,
            max: 500,
          }),
        };
      }),
    };
  }

  if (section === "projects") {
    return {
      heroTitle: text(data.heroTitle, "Projects page title", { max: 120 }),
      heroAccent: text(data.heroAccent, "Projects title accent", {
        max: 120,
      }),
      heroDescription: text(data.heroDescription, "Projects description", {
        max: 1000,
      }),
      sectionTitle: text(data.sectionTitle, "Project list title", {
        max: 120,
      }),
      sectionDescription: text(
        data.sectionDescription,
        "Project list description",
        { max: 1000 }
      ),
      items: requireArray(data.items, "Projects", (item, label) => {
        const record = requireObject(item, label);
        return {
          id: requireId(record.id, `${label} ID`),
          name: text(record.name, `${label} title`, { max: 160 }),
          status: text(record.status, `${label} status`, {
            allowEmpty: true,
            max: 80,
          }),
          image: image(record.image, `${label} image`),
        };
      }),
    };
  }

  if (section === "jashey") {
    return {
      titleLine1: text(data.titleLine1, "JASHEY title line 1", { max: 120 }),
      titleLine2: text(data.titleLine2, "JASHEY title line 2", { max: 120 }),
      description: text(data.description, "JASHEY description", {
        max: 1000,
      }),
      heroImage: image(data.heroImage, "JASHEY page photo"),
      approachLine1: text(data.approachLine1, "Approach title line 1", {
        max: 120,
      }),
      approachLine2: text(data.approachLine2, "Approach title line 2", {
        max: 120,
      }),
      projectsTitle: text(data.projectsTitle, "JASHEY projects title", {
        max: 120,
      }),
      projects: requireArray(data.projects, "JASHEY projects", (item, label) => {
        const record = requireObject(item, label);
        return {
          id: requireId(record.id, `${label} ID`),
          title: text(record.title, `${label} title`, { max: 160 }),
          description: text(record.description, `${label} description`, {
            allowEmpty: true,
            max: 1000,
          }),
          url: requireWebUrl(record.url, `${label} link`),
          image: image(record.image, `${label} image`),
        };
      }),
      approaches: requireArray(data.approaches, "Approach cards", (item, label) => {
        const record = requireObject(item, label);
        return {
          id: requireId(record.id, `${label} ID`),
          number: text(record.number, `${label} number`, { max: 10 }),
          title: text(record.title, `${label} title`, { max: 160 }),
          description: text(record.description, `${label} description`, {
            max: 1000,
          }),
        };
      }),
    };
  }

  if (section === "skamara") {
    return {
      title: text(data.title, "SKAMARA page title", { max: 120 }),
      tagline: text(data.tagline, "SKAMARA tagline", { max: 300 }),
      heroImage: image(data.heroImage, "SKAMARA page photo"),
      announcementTitle: text(
        data.announcementTitle,
        "SKAMARA announcement title",
        { max: 120 }
      ),
      announcementDescription: text(
        data.announcementDescription,
        "SKAMARA announcement",
        { max: 1000 }
      ),
      announcementAccent: text(
        data.announcementAccent,
        "SKAMARA announcement accent",
        { max: 120 }
      ),
      articlesTitle: text(data.articlesTitle, "SKAMARA articles title", {
        max: 120,
      }),
      articles: requireArray(data.articles, "SKAMARA articles", (item, label) => {
        const record = requireObject(item, label);
        return {
          id: requireId(record.id, `${label} ID`),
          title: text(record.title, `${label} title`, { max: 160 }),
          description: text(record.description, `${label} description`, {
            allowEmpty: true,
            max: 1000,
          }),
          url: requireWebUrl(record.url, `${label} link`, { required: true }),
          image: image(record.image, `${label} image`),
        };
      }),
    };
  }

  throw createHttpError(404, "Page section not found.");
}

async function promoteImagePath(imagePath, promotedImages) {
  if (!imagePath.startsWith("/api/staged-images/")) {
    return imagePath;
  }

  if (promotedImages.has(imagePath)) {
    return promotedImages.get(imagePath);
  }

  const stagedFilename = imagePath.slice("/api/staged-images/".length);
  if (!imageFilePattern.test(stagedFilename)) {
    throw createHttpError(400, "Staged image path is invalid.");
  }

  const extension = extname(stagedFilename);
  const publishedFilename = `${randomUUID()}${extension}`;
  await mkdir(publishedImagesDir, { recursive: true });

  try {
    await rename(
      join(stagingDir, stagedFilename),
      join(publishedImagesDir, publishedFilename)
    );
  } catch (error) {
    if (error.code === "ENOENT") {
      throw createHttpError(400, "Please upload the selected image again.");
    }
    throw error;
  }

  const publishedPath = `/content/images/${publishedFilename}`;
  promotedImages.set(imagePath, publishedPath);
  return publishedPath;
}

async function promoteSectionImages(section, value) {
  const promotedImages = new Map();
  const promote = (imagePath) =>
    promoteImagePath(imagePath, promotedImages);

  if (section === "founder") {
    return {
      ...value,
      portrait: await promote(value.portrait),
      highlights: await Promise.all(
        value.highlights.map(async (item) => ({
          ...item,
          image: await promote(item.image),
        }))
      ),
    };
  }

  if (section === "projects") {
    return {
      ...value,
      items: await Promise.all(
        value.items.map(async (item) => ({
          ...item,
          image: await promote(item.image),
        }))
      ),
    };
  }

  if (section === "jashey") {
    return {
      ...value,
      heroImage: await promote(value.heroImage),
      projects: await Promise.all(
        value.projects.map(async (item) => ({
          ...item,
          image: await promote(item.image),
        }))
      ),
    };
  }

  if (section === "skamara") {
    return {
      ...value,
      heroImage: await promote(value.heroImage),
      articles: await Promise.all(
        value.articles.map(async (item) => ({
          ...item,
          image: await promote(item.image),
        }))
      ),
    };
  }

  return value;
}

async function writeContentFile(value) {
  const temporaryPath = `${contentFile}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, {
    flag: "wx",
    mode: 0o644,
  });
  await rename(temporaryPath, contentFile);
}

async function handleUpload(request, response) {
  if (!isSameOriginRequest(request)) {
    return sendJson(response, 403, { error: "Upload request was not allowed." });
  }

  let originalName;
  try {
    originalName = decodeURIComponent(
      String(request.headers["x-file-name"] || "")
    );
  } catch {
    throw createHttpError(400, "Invalid photo filename.");
  }

  const sourceName = basename(originalName.replaceAll("\\", "/"));
  const extension = extname(sourceName).toLowerCase();
  const expectedType = mimeTypes[extension];
  const contentType = String(request.headers["content-type"] || "")
    .split(";")[0]
    .toLowerCase();

  if (!sourceName || sourceName.length > 255) {
    throw createHttpError(400, "Invalid photo filename.");
  }
  if (!expectedType || expectedType !== contentType) {
    throw createHttpError(
      415,
      "Use a JPEG, PNG, GIF, WebP, or AVIF image."
    );
  }

  const filename = `${randomUUID()}${extension}`;
  const contents = await readRequestBody(
    request,
    maxUploadBytes,
    "Each photo must be 10 MB or smaller."
  );
  await writeFile(join(stagingDir, filename), contents, {
    flag: "wx",
    mode: 0o600,
  });

  return sendJson(response, 201, {
    id: filename,
    name: sourceName,
    src: `/api/staged-images/${filename}`,
    type: expectedType,
  });
}

async function handleSaveContent(request, response, section) {
  if (!isSameOriginRequest(request)) {
    return sendJson(response, 403, {
      error: "Content update request was not allowed.",
    });
  }

  if (!contentSections.has(section)) {
    throw createHttpError(404, "Page section not found.");
  }

  const body = await readRequestBody(
    request,
    maxContentBytes,
    "Page content is too large."
  );

  let submittedContent;
  try {
    submittedContent = JSON.parse(body.toString("utf8"));
  } catch {
    throw createHttpError(400, "Page content must be valid JSON.");
  }

  const validatedContent = validateContentSection(
    section,
    submittedContent,
    true
  );
  const promotedContent = await promoteSectionImages(section, validatedContent);
  const safeContent = validateContentSection(section, promotedContent, false);

  let currentContent;
  try {
    currentContent = JSON.parse(await readFile(contentFile, "utf8"));
  } catch (error) {
    console.error("Could not read published site content:", error);
    throw createHttpError(500, "Published site content could not be read.");
  }

  const updatedContent = { ...currentContent, [section]: safeContent };
  await writeContentFile(updatedContent);

  return sendJson(response, 200, { content: safeContent });
}

async function serveFile(request, response, filePath) {
  let fileStat;
  try {
    fileStat = await stat(filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw createHttpError(404, "File not found.");
    }
    throw error;
  }

  if (!fileStat.isFile()) {
    throw createHttpError(404, "File not found.");
  }

  const contentTypes = {
    ".avif": "image/avif",
    ".css": "text/css; charset=utf-8",
    ".gif": "image/gif",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };
  const contentType =
    contentTypes[extname(filePath).toLowerCase()] ||
    "application/octet-stream";

  response.writeHead(200, {
    "Cache-Control": "no-cache",
    "Content-Length": fileStat.size,
    "Content-Type": contentType,
    "X-Content-Type-Options": "nosniff",
  });

  if (request.method === "HEAD") {
    return response.end();
  }

  const stream = createReadStream(filePath);
  stream.on("error", (error) => {
    console.error("Could not serve private preview file:", error);
    response.destroy(error);
  });
  stream.pipe(response);
}

async function serveStaticFile(request, response, pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    throw createHttpError(400, "Invalid request path.");
  }

  const servesPublicContent = decodedPath.startsWith("/content/");
  const rootDir = servesPublicContent ? publicDir : distDir;
  const relativePath = normalize(decodedPath).replace(/^[/\\]+/, "");
  let filePath = resolve(rootDir, relativePath);
  if (filePath !== rootDir && !filePath.startsWith(`${rootDir}${sep}`)) {
    throw createHttpError(403, "Path is not allowed.");
  }

  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      filePath = join(filePath, "index.html");
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    if (servesPublicContent || extname(filePath)) {
      throw createHttpError(404, "File not found.");
    }

    filePath = join(distDir, "index.html");
  }

  return serveFile(request, response, filePath);
}

async function handleApiRequest(request, response, url) {
  if (url.pathname === "/api/uploads" && request.method === "POST") {
    return handleUpload(request, response);
  }

  if (url.pathname.startsWith("/api/staged-images/")) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return sendJson(response, 405, { error: "Method not allowed." });
    }

    let filename;
    try {
      filename = decodeURIComponent(
        url.pathname.slice("/api/staged-images/".length)
      );
    } catch {
      throw createHttpError(400, "Invalid staged image path.");
    }
    if (!imageFilePattern.test(filename)) {
      throw createHttpError(404, "Staged image not found.");
    }

    return serveFile(request, response, join(stagingDir, filename));
  }

  if (url.pathname.startsWith("/api/content/") && request.method === "PUT") {
    let section;
    try {
      section = decodeURIComponent(
        url.pathname.slice("/api/content/".length)
      );
    } catch {
      throw createHttpError(400, "Invalid page section.");
    }
    return handleSaveContent(request, response, section);
  }

  return sendJson(response, 404, { error: "API route not found." });
}

async function handleRequest(request, response) {
  const requestHost = String(request.headers.host || "").toLowerCase();
  if (!allowedHosts.has(requestHost)) {
    return sendJson(response, 403, { error: "Host is not allowed." });
  }

  let url;
  try {
    url = new URL(request.url || "/", `http://${requestHost}`);
  } catch {
    throw createHttpError(400, "Invalid request URL.");
  }

  if (url.pathname.startsWith("/api/")) {
    return handleApiRequest(request, response, url);
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return sendJson(response, 405, { error: "Method not allowed." });
  }

  return serveStaticFile(request, response, url.pathname);
}

async function startServer() {
  await access(join(distDir, "index.html"));
  await mkdir(stagingDir, { recursive: true, mode: 0o700 });
  await mkdir(publishedImagesDir, { recursive: true });

  const server = createServer((request, response) => {
    handleRequest(request, response).catch((error) => {
      const statusCode = Number.isInteger(error.statusCode)
        ? error.statusCode
        : 500;

      if (statusCode >= 500) {
        console.error("Private preview request failed:", error);
      }

      if (!response.headersSent) {
        sendJson(response, statusCode, {
          error:
            statusCode === 500
              ? "The private server could not complete the request."
              : error.message,
        });
      } else {
        response.destroy(error);
      }
    });
  });

  server.requestTimeout = 30_000;
  server.headersTimeout = 10_000;

  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(port, host, () => {
      server.off("error", rejectListen);
      resolveListen();
    });
  });

  console.log(`Private content editor listening at http://localhost:${port}`);
}

startServer().catch((error) => {
  if (error.code === "ENOENT") {
    console.error("Build the portfolio with `npm run build` first.");
  } else {
    console.error("Could not start the private content editor:", error);
  }
  process.exitCode = 1;
});
