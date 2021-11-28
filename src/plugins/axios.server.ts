import { App } from "vue";
import vuex from "vuex";
import axios from "axios";

export function axiosServertPlugin(app: App): void {
  const instance = axios.create({
    baseURL: "http://127.0.0.1:3000",
  });

  app.config.globalProperties.$axios = instance;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  vuex.Store.prototype.$axios = instance;
}
