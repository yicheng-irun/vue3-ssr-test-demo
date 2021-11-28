import { createSSRApp } from "vue";
import { Request } from "express";
import { renderToString } from "@vue/server-renderer";
import App from "./App.vue";
import { createPageRouter } from "./router";
import store from "./store";
import { axiosServertPlugin } from "./plugins/axios.server";

export async function serverRender({ req }: { req: Request }): Promise<{
  serverRenderHtml: string;
}> {
  const app = createSSRApp(App);
  axiosServertPlugin(app);
  const router = createPageRouter();
  router.replace(req.originalUrl);
  await router.isReady();
  app.use(router);
  app.use(store);

  const serverRenderHtml = await renderToString(app, {});

  return {
    serverRenderHtml,
  };
}
