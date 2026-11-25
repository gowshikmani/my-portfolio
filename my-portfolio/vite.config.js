
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {
  existsSync,
  readdirSync,
  rmSync,
  statSync,
  createReadStream,
} from "node:fs";
import { resolve, relative, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";

const frontendDir = fileURLToPath(new URL(".", import.meta.url));
const mediaDir = resolve(frontendDir, "dist/founder-media");
const outputDir = resolve(frontendDir, "dist");

const mimeTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

function founderMediaPlugin() {
  return {
    name: "founder-media-library",

    buildStart() {
      if (!existsSync(outputDir)) {
        return;
      }

      for (const entry of readdirSync(outputDir)) {
        if (entry !== "founder-media") {
          rmSync(resolve(outputDir, entry), { recursive: true, force: true });
        }
      }
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/founder-media/")) {
          return next();
        }

        let requestedPath;

        try {
          requestedPath = decodeURIComponent(
            new URL(req.url, "http://localhost").pathname
          );
        } catch {
          res.statusCode = 400;
          return res.end("Invalid media path");
        }

        const filePath = resolve(
          mediaDir,
          `.${requestedPath.slice("/founder-media".length)}`
        );

        const relativePath = relative(mediaDir, filePath);

        if (
          relativePath.startsWith("..") ||
          relativePath.startsWith(sep) ||
          !existsSync(filePath) ||
          !statSync(filePath).isFile()
        ) {
          res.statusCode = 404;
          return res.end("Media not found");
        }

        res.setHeader(
          "Content-Type",
          mimeTypes[extname(filePath).toLowerCase()] ||
            "application/octet-stream"
        );

        res.setHeader("Cache-Control", "no-cache");

        if (req.method === "HEAD") {
          return res.end();
        }

        createReadStream(filePath).pipe(res);
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    founderMediaPlugin(),
  ],
  build: {
    emptyOutDir: false,
  },
});
