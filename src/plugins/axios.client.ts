import { App } from "vue";
import vuex from "vuex";
import axios from "axios";

export function axiosClientPlugin(app: App): void {
  const instance = axios.create({
    baseURL: "/",
  });

  app.config.globalProperties.$axios = instance;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  vuex.Store.prototype.$axios = instance;
}
