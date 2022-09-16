import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes = [
    {
        path: "/",
        name: "HomePage",
        redirect: { name: "Dashboard" },
        component: () => import("@/layouts/common-page.vue"),
        children: [
            {
                path: "dashboard",
                name: "Dashboard",
                meta: { menu: { title: "router.dashboard" } },
                component: () => import("@/views/HomePage.vue")
            }
        ]
    },
] as RouteRecordRaw[];

const router = createRouter({
    history: createWebHashHistory(),
    routes: [...routes]
});

export default router
