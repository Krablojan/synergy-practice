import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Post from '../views/Post.vue'
import Profile from '../views/Profile.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/post/:id', component: Post },
  { path: '/profile/:username', component: Profile }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router