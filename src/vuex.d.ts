import { App } from "vue";
import { AxiosInstance } from "axios";
import { Router, RouteLocationNormalizedLoaded } from "vue-router";
import { Store } from "vuex";

interface SSRContext {
  app: App<Element>;
  store: Store<S>;
  router: Router;
  route: RouteLocationNormalizedLoaded;
}

declare module "@vue/runtime-core" {
  // eslint-disable-next-line no-unused-vars
  interface ComponentCustomProperties {
    $store: Store<unknown>;
    $axios: AxiosInstance;
  }
  interface ComponentOptionsBase {
    fetch?(ctx: SSRContext): Promise<void>;
  }
}

declare module "vuex" {
  // eslint-disable-next-line no-unused-vars
  interface Store<S> {
    $axios: AxiosInstance;
  }
}
