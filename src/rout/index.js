import { createRouter, createWebHistory } from 'vue-router'
import Units from '../moduls/units/view/units.vue'
import Login from '../moduls/login/view/login.vue'

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
