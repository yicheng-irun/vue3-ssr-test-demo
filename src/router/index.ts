import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = createRouter({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  routes,
});

export default router;
