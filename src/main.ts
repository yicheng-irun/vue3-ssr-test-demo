import { createSSRApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

async function main() {
  const app = createSSRApp(App);
  //   router.push(window.location.pathname);
  await router.isReady();
  app.use(router);

  app.use(store);

  app.mount("#app");
}
main().catch(console.error);
