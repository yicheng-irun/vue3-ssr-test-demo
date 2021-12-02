/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createSSRApp } from "vue";
import { Request } from "express";
import { renderToString } from "@vue/server-renderer";
import App from "./App.vue";
import { createPageRouter } from "./router";
import { createPageStore } from "./store";
import { axiosServertPlugin } from "./plugins/axios.server";
import { SSRContext } from "./vuex";

function renderPreloadLinks(
  modules: Set<string>,
  manifest: Record<string, string[]>
) {
  let links = "";
  const seen = new Set<string>();
  modules.forEach((id) => {
    const files = manifest[id];
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file);
          links += renderPreloadLink(file);
        }
      });
    }
  });
  return links;
}

function renderPreloadLink(file: string): string {
  if (file.endsWith(".js")) {
    return `<link rel="modulepreload" crossorigin href="${file}">`;
  } else if (file.endsWith(".css")) {
    return `<link rel="stylesheet" href="${file}">`;
  } else if (file.endsWith(".woff")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  } else if (file.endsWith(".woff2")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  } else if (file.endsWith(".gif")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
  } else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  } else if (file.endsWith(".png")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
  } else {
    // TODO
    return "";
  }
}

export async function serverRender({
  req,
  manifest,
}: {
  req: Request;
  manifest: Record<string, string[]>;
}): Promise<{
  serverRenderHtml: string;
  initState: unknown;
  preloadLinks: string;
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

  const ctx: {
    modules?: Set<string>;
  } = {};
  const serverRenderHtml = await renderToString(app, ctx);

  const preloadLinks = ctx.modules
    ? renderPreloadLinks(ctx.modules, manifest)
    : "";

  return {
    serverRenderHtml,
    initState,
    preloadLinks,
  };
}
