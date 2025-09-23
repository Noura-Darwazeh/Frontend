import { createRouter, createWebHistory } from 'vue-router'
import Units from '../moduls/units/view/units.vue'
import Login from '../moduls/login/view/login.vue'

const routes = [
    { path: '/units', name: 'Units', component: Units },
    {
        path: '/',
        name: 'Login',
        component: Login,
        meta: { hideLayout: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
