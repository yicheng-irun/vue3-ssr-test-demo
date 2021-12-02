/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createSSRApp } from "vue";
import App from "./App.vue";
import { axiosClientPlugin } from "./plugins/axios.client";
import { createPageRouter } from "./router";
import store from "./store";
import { SSRContext } from "./vuex";

// @ts-ignore
const initState = window.initState as {
  state: any;
};

async function main() {
  const app = createSSRApp(App);
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

  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  if (initState) {
    store.replaceState(initState.state);
  }

  // if (!ssrContext.route.matched.length) {
  //   throw new Error("404 Not Found");
  // }
  // const matchedRouter = ssrContext.route.matched[0];
  // // @ts-ignore
  // if (typeof matchedRouter.components.default.fetch === "function") {
  //   // @ts-ignore
  //   await matchedRouter.components.default.fetch(ssrContext);
  // }

  app.mount("#app");
}
main().catch(console.error);
