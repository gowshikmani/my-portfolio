import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import {
  access,
  mkdir,
  readFile,
  readdir,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const projectDir = fileURLToPath(new URL("../", import.meta.url));
const distDir = resolve(projectDir, "dist");
const uploadsDir = resolve(projectDir, ".private-uploads");
const host = "127.0.0.1";
const port = 7171;
const maxUploadBytes = 10 * 1024 * 1024;
const allowedHosts = new Set([`localhost:${port}`, `${host}:${port}`]);
const mimeTypes = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};
const storedFilenamePattern =
  /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}_[a-z0-9_-]{1,80}\.(?:avif|gif|jpe?g|png|webp)$/;

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

function getStoredUploadName(urlPath) {
  let filename;
  try {
    filename = decodeURIComponent(urlPath);
  } catch {
    throw createHttpError(400, "Invalid photo path.");
  }

  if (!storedFilenamePattern.test(filename)) {
    throw createHttpError(404, "Private photo not found.");
  }

  return filename;
}

async function getUploadList() {
  const entries = await readdir(uploadsDir, { withFileTypes: true });

  return entries
    .filter(
      (entry) => entry.isFile() && storedFilenamePattern.test(entry.name)
    )
    .map((entry) => {
      const extension = extname(entry.name);
      const name = entry.name
        .replace(/^[a-f0-9-]{36}_/, "")
        .replace(/_/g, " ");

      return {
        id: entry.name,
        name,
        src: `/api/uploads/${encodeURIComponent(entry.name)}`,
        type: mimeTypes[extension],
      };
    });
}

async function readUploadBody(request) {
  const contentLength = Number(request.headers["content-length"] || 0);
  if (contentLength > maxUploadBytes) {
    throw createHttpError(413, "Each photo must be 10 MB or smaller.");
  }

  const chunks = [];
  let totalBytes = 0;
  let isTooLarge = false;

  for await (const chunk of request) {
    if (isTooLarge) {
      continue;
    }

    totalBytes += chunk.length;
    if (totalBytes > maxUploadBytes) {
      isTooLarge = true;
      chunks.length = 0;
      continue;
    }

    chunks.push(chunk);
  }

  if (isTooLarge) {
    throw createHttpError(413, "Each photo must be 10 MB or smaller.");
  }
  if (!totalBytes) {
    throw createHttpError(400, "The uploaded photo is empty.");
  }

  return Buffer.concat(chunks, totalBytes);
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

  const extension = extname(originalName.replaceAll("\\", "/").split("/").at(-1))
    .toLowerCase();
  const expectedType = mimeTypes[extension];
  const contentType = String(request.headers["content-type"] || "")
    .split(";")[0]
    .toLowerCase();

  if (!expectedType || expectedType !== contentType) {
    throw createHttpError(
      415,
      "Use a JPEG, PNG, GIF, WebP, or AVIF image."
    );
  }

  const sourceName = originalName
    .replaceAll("\\", "/")
    .split("/")
    .at(-1);
  if (!sourceName || sourceName.length > 255) {
    throw createHttpError(400, "Invalid photo filename.");
  }

  const safeBaseName =
    sourceName
      .slice(0, -extension.length)
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "photo";
  const filename = `${randomUUID()}_${safeBaseName}${extension}`;
  const contents = await readUploadBody(request);

  await writeFile(join(uploadsDir, filename), contents, {
    flag: "wx",
    mode: 0o600,
  });

  return sendJson(response, 201, {
    id: filename,
    name: `${safeBaseName}${extension}`,
    src: `/api/uploads/${encodeURIComponent(filename)}`,
    type: expectedType,
  });
}

async function handleApiRequest(request, response, url) {
  if (url.pathname === "/api/uploads" && request.method === "GET") {
    return sendJson(response, 200, await getUploadList());
  }

  if (url.pathname === "/api/uploads" && request.method === "POST") {
    return handleUpload(request, response);
  }

  if (url.pathname.startsWith("/api/uploads/")) {
    const filename = getStoredUploadName(
      url.pathname.slice("/api/uploads/".length)
    );
    const filePath = join(uploadsDir, filename);

    if (request.method === "GET" || request.method === "HEAD") {
      let contents;
      try {
        contents = await readFile(filePath);
      } catch (error) {
        if (error.code === "ENOENT") {
          throw createHttpError(404, "Private photo not found.");
        }
        throw error;
      }

      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Length": contents.length,
        "Content-Type": mimeTypes[extname(filename)],
        "X-Content-Type-Options": "nosniff",
      });
      return response.end(request.method === "HEAD" ? undefined : contents);
    }

    if (request.method === "DELETE") {
      if (!isSameOriginRequest(request)) {
        return sendJson(response, 403, {
          error: "Delete request was not allowed.",
        });
      }

      try {
        await unlink(filePath);
      } catch (error) {
        if (error.code === "ENOENT") {
          throw createHttpError(404, "Private photo not found.");
        }
        throw error;
      }

      return sendJson(response, 200, { deleted: true });
    }
  }

  return sendJson(response, 405, { error: "Method not allowed." });
}

async function serveStaticFile(request, response, pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    throw createHttpError(400, "Invalid request path.");
  }

  const relativePath = normalize(decodedPath).replace(/^[/\\]+/, "");
  let filePath = resolve(distDir, relativePath);
  if (filePath !== distDir && !filePath.startsWith(`${distDir}${sep}`)) {
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

    if (extname(filePath)) {
      throw createHttpError(404, "Page not found.");
    }

    filePath = join(distDir, "index.html");
  }

  let fileStat;
  try {
    fileStat = await stat(filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw createHttpError(404, "Page not found.");
    }
    throw error;
  }

  const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
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
  await mkdir(uploadsDir, { recursive: true, mode: 0o700 });

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

  console.log(`Private founder gallery listening at http://localhost:${port}`);
}

startServer().catch((error) => {
  if (error.code === "ENOENT") {
    console.error("Build the portfolio with `npm run build` first.");
  } else {
    console.error("Could not start the private founder gallery:", error);
  }
  process.exitCode = 1;
});
