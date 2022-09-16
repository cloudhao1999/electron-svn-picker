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
                component: () => import("@/views/HomePage.vue")
            },
            {
                path: "setting",
                name: "Setting",
                component: () => import("@/views/Setting.vue")
            },
            {
                path: "about",
                name: "About",
                component: () => import("@/views/About.vue")
            }
        ]
    },
] as RouteRecordRaw[];

const router = createRouter({
    history: createWebHashHistory(),
    routes: [...routes]
});

export default router
