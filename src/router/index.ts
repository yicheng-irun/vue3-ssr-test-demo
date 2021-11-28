import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  Router,
  RouteRecordRaw,
} from "vue-router";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const pages = import.meta.glob("../views/**/*.page.vue");
const routes: RouteRecordRaw[] = [];
Object.keys(pages).forEach((path: string) => {
  const match = path.match(/\.\/views(.*)\.page\.vue$/);
  if (match) {
    const name = match[1].toLocaleLowerCase();
    let routerPath = name.replace(/\/index$/, "");
    if (routerPath === "/home") {
      routerPath = "/";
    }
    routes.push({
      path: routerPath,
      component: pages[path],
    });
  }
});

export function createPageRouter(): Router {
  return createRouter({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  });
}
