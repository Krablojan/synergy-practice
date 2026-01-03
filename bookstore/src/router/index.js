import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Admin.vue'
import Login from '../views/Login.vue'
import Books from '../views/Books.vue'
import Admin from '../views/Admin.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/books', component: Books },
  { path: '/admin', component: Admin }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router