import express from "express";
import { resolve } from "path";
import { readFileSync } from "fs";
import { apiRouter } from "./router.api";
import { serverRender } from "../dist/server/entry-server";
import manifest from "../dist/client/ssr-manifest.json";

const app = express();

async function start() {
  app.use(express.static(resolve(__dirname, "../dist/client")));

  app.use("/api", apiRouter);

  app.get("*", async (req, res) => {
    try {
      const template = readFileSync(
        resolve(__dirname, "../dist/client/index.html")
      ).toString();

      const { serverRenderHtml, initState, preloadLinks } = (await serverRender(
        {
          req,
          manifest,
        }
      )) as {
        serverRenderHtml: string;
        initState: unknown;
        preloadLinks: string;
      };

      const html = template
        .replace("<!--app-html-->", serverRenderHtml)
        .replace(
          "<!--init-state-->",
          `<script>window.initState=${JSON.stringify(initState)}</script>`
        )
        .replace(`<!--preload-links-->`, preloadLinks);

      res.send(html);
    } catch (e) {
      if (e instanceof Error) {
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
