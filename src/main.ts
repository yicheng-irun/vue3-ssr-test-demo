import { createSSRApp } from "vue";
import App from "./App.vue";
import { axiosClientPlugin } from "./plugins/axios.client";
import { createPageRouter } from "./router";
import store from "./store";

async function main() {
  const app = createSSRApp(App);
  axiosClientPlugin(app);

  const router = createPageRouter();
  router.push(window.location.pathname);
  await router.isReady();
  app.use(router);
  app.use(store);

  app.mount("#app");
}
main().catch(console.error);
