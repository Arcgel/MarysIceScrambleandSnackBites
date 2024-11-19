import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import About from '../views/MenuView.vue'
import ProductsMenu from '../views/ProductsMenu.vue'

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
      component: About
    },
    {
      path: '/Menu/Products',
      name: 'products',
      component: ProductsMenu
    },
  ],
})

export default router
