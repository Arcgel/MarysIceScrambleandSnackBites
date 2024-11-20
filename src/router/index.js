import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import About from '../views/MenuView.vue'
import Products from '../views/ProductsMenu.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/Menu',
      name: 'menu',
      component: Products
    },
    {
      path: '/About',
      name: 'about',
      component: About
    }
  ],
})

export default router
