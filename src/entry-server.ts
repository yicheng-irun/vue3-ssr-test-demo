/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createSSRApp } from "vue";
import { Request } from "express";
import { renderToString } from "@vue/server-renderer";
import App from "./App.vue";
import { createPageRouter } from "./router";
import { createPageStore } from "./store";
import { axiosServertPlugin } from "./plugins/axios.server";
import { SSRContext } from "./vuex";

export async function serverRender({ req }: { req: Request }): Promise<{
  serverRenderHtml: string;
  initState: unknown;
}> {
  const app = createSSRApp(App);
  const store = createPageStore();
  axiosServertPlugin(app);
  const router = createPageRouter();
  router.replace(req.originalUrl);
  await router.isReady();
  app.use(router);
  app.use(store);

  const ssrContext: SSRContext = {
    app,
    route: router.currentRoute.value,
    router,
    store,
  };

  if (!ssrContext.route.matched.length) {
    throw new Error("404 Not Found");
  }
  const matchedRouter = ssrContext.route.matched[0];
  // @ts-ignore
  if (typeof matchedRouter.components.default.fetch === "function") {
    // @ts-ignore
    await matchedRouter.components.default.fetch(ssrContext);
  }

  const initState = {
    state: store.state,
  };

  const serverRenderHtml = await renderToString(app, {});

  return {
    serverRenderHtml,
    initState,
  };
}
