import { createRouter, createWebHistory } from 'vue-router'
import Units from '../moduls/units/view/units.vue'
import Login from '../moduls/login/view/login.vue'
import Dashboard from '../moduls/dashboard/view/dashboard.vue'
import Tags from "../moduls/tags/view/tags.vue"
import Addtags from "../moduls/tags/view/addTag.vue"
const routes = [
    {
        path: '/',
        name: 'home',
        component: Units,
        meta: { requiresAuth: true }
    },
    {
        path: '/units',
        name: 'units',
        component: Units,
        meta: { requiresAuth: true, title: 'Units' }
    },
    {
        path: '/tags',
        name: 'tags',
        component: Tags,
        meta: { requiresAuth: true, title: 'Tags' }
    },
    {
        path: '/add-tags',
        name: 'addtags',
        component: Addtags,
        meta: { requiresAuth: true, title: 'Addtags' }
    },

    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { hideLayout: true }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, title: 'Dashboard' }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");

    if (to.meta.requiresAuth && !token) {
        return next({ name: "login" });
    }

    if (token && to.name === "login") {
        return next({ name: "units" });
    }

    return next();
});

export default router