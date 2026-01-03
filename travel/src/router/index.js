import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Feed from '../views/Feed.vue'
import Entry from '../views/Entry.vue'

const routes = [
    { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/feed', component: Feed },
  { path: '/entry/:id', component: Entry }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router