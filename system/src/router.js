import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Welcom from "./components/Welcom.vue";
Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/home",
      component: Home,
      redirect: "/welcom",
      children: [
        { path: "/welcom", component: Welcom },
        {
          path: "/users",
          component: () => import("./components/Home/user.vue")
        },
        {
          path: "/rights",
          component: () => import("./components/manage/permissions.vue")
        },
        {
          path: "/roles",
          component: () => import("./components/manage/RoleList.vue")
        },
        {
          path: "/categories",
          component: () => import("./components/goods/Cate.vue")
        },
        {
          path: "/params",
          component: () => import("./components/goods/Param.vue")
        },
        {
          path: "/orders",
          component: () => import("./components/order/Orders.vue")
        },
        {
          path: "/goods",
          redirect: "/goods/list"
        },
        {
          path: "/goods/list",
          component: () => import("./components/goods/List.vue")
        },
        {
          path: "/goods/add",
          component: () => import("./components/goods/GoodsAdd.vue")
        },
        {
          path: "/reports",
          component: () => import("./components/reports/Reports.vue")
        }
      ]
    },
    {
      path: "/login",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Login.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path == "/login") return next();
  const token = window.sessionStorage.getItem("token");
  if (!token) return next("/login");
  next();
});

export default router;
