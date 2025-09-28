import { createRouter, createWebHistory } from 'vue-router'
import Units from '../moduls/units/view/units.vue'
import Login from '../moduls/login/view/login.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Units,
        // meta: { requiresAuth: true }
    },
    {
        path: '/units',
        name: 'units',
        component: Units,
        meta: { requiresAuth: true }
    },

    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { hideLayout: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    console.log("to",to.name);
    const token = localStorage.getItem("token");
console.log();


    if (to.meta.requiresAuth && !token) {
        next("/login"); // إذا مافي توكن يرجعو لوج ان
    } else if(token && to.name=="login") {
        next("/units");
    }else{
        next();

    }
});
export default router
