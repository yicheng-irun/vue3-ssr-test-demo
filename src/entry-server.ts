import { createSSRApp } from "vue";
import { Request } from "express";
import { renderToString } from "@vue/server-renderer";
import App from "./App.vue";
import router from "./router";
import store from "./store";

export async function serverRender({ req }: { req: Request }): Promise<{
  serverRenderHtml: string;
}> {
  const app = createSSRApp(App);

  router.push(req.originalUrl);
  await router.isReady();
  app.use(router);
  app.use(store);

  const serverRenderHtml = await renderToString(app, {});

  return {
    serverRenderHtml,
  };
}