import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { resolvePageMeta, injectMeta } from "./seo";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );

      // Inject dynamic meta tags in dev mode too
      const meta = await resolvePageMeta(url);
      if (meta) {
        template = injectMeta(template, meta);
      }

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Read the built index.html once at startup
  const indexHtml = fs.readFileSync(
    path.resolve(distPath, "index.html"),
    "utf-8",
  );

  app.use(express.static(distPath));

  // fall through to index.html with dynamic meta injection
  app.use("*", async (req, res) => {
    const url = req.originalUrl;

    try {
      const meta = await resolvePageMeta(url);
      if (meta) {
        res
          .status(200)
          .set({ "Content-Type": "text/html" })
          .end(injectMeta(indexHtml, meta));
      } else {
        // Unknown SPA route — serve default index.html
        res
          .status(200)
          .set({ "Content-Type": "text/html" })
          .end(indexHtml);
      }
    } catch {
      // If meta resolution fails, still serve the page
      res
        .status(200)
        .set({ "Content-Type": "text/html" })
        .end(indexHtml);
    }
  });
}
