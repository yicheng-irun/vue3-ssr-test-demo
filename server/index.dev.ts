import express from "express";
import { createServer } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";
import { apiRouter } from "./router.api";

const app = express();

async function start() {
  const vite = await createServer({
    root: resolve(__dirname, "../"),
    server: {
      middlewareMode: "ssr",
      watch: {
        usePolling: false,
        interval: 100,
      },
    },
  });
  app.use(vite.middlewares);

  app.use("/api", apiRouter);

  app.get("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      const templateFile = readFileSync(
        resolve(__dirname, "../index.html")
      ).toString();
      const template = await vite.transformIndexHtml(url, templateFile);

      const entryServer = await vite.ssrLoadModule(
        resolve(__dirname, "../src/entry-server.ts")
      );

      const { serverRenderHtml, initState } = (await entryServer.serverRender({
        req,
      })) as {
        serverRenderHtml: string;
        initState: unknown;
      };

      const html = template
        .replace("<!--app-html-->", serverRenderHtml)
        .replace(
          "<!--init-state-->",
          `<script>window.initState=${JSON.stringify(initState)}</script>`
        );

      res.send(html);
    } catch (e) {
      if (e instanceof Error) {
        vite.ssrFixStacktrace(e);
        console.error(e);
        res.status(500);
        res.send(e.message);
      } else {
        res.send(e);
      }
    }
  });

  app.listen(3000, "0.0.0.0", () => {
    console.log("dev server running at port 3000");
  });
}

start().catch(console.error);
