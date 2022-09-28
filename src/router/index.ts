import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import CommonPage from "@/layouts/common-page.vue";
import Dashboard from "@/views/HomePage.vue";
import Setting from "@/views/Setting.vue";
import About from "@/views/About.vue";

const routes = [
    {
        path: "/",
        name: "HomePage",
        redirect: { name: "Dashboard" },
        component: CommonPage,
        children: [
            {
                path: "dashboard",
                name: "Dashboard",
                component: Dashboard
            },
            {
                path: "setting",
                name: "Setting",
                component: Setting
            },
            {
                path: "about",
                name: "About",
                component: About
            }
        ]
    },
] as RouteRecordRaw[];

const router = createRouter({
    history: createWebHashHistory(),
    routes: [...routes]
});

export default router
