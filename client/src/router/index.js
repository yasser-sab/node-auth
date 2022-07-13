import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path:'/login',
    name:'login',
    component:Login
  }
]

const router = new VueRouter({
  routes
})

export default router