/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createSSRApp } from "vue";
import App from "./App.vue";
import { axiosClientPlugin } from "./plugins/axios.client";
import { createPageRouter } from "./router";
import { createPageStore } from "./store";
import { SSRContext } from "./vuex";

// @ts-ignore
const initState = window.initState as {
  state: any;
};

async function main() {
  const app = createSSRApp(App);
  const store = createPageStore();
  axiosClientPlugin(app);

  const router = createPageRouter();
  router.push(window.location.pathname);
  await router.isReady();
  app.use(router);
  app.use(store);

  const ssrContext: SSRContext = {
    app,
    route: router.currentRoute.value,
    router,
    store,
  };

  // await new Promise((resolve) => {
  //   setTimeout(resolve, 1000);
  // });

  if (initState) {
    store.replaceState(initState.state);
  }

  // if (!ssrContext.route.matched.length) {
  //   throw new Error("404 Not Found");
  // }

  router.beforeResolve(async (to, from, next) => {
    const matchedRouter = to.matched[0];
    try {
      // @ts-ignore
      if (typeof matchedRouter.components.default.fetch === "function") {
        // @ts-ignore
        await matchedRouter.components.default.fetch(ssrContext);
      }
    } catch (e) {
      console.error(e);
    }
    next();
  });

  app.mount("#app");
}
main().catch(console.error);
