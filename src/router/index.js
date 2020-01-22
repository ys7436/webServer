import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import systemRouter from './system'
import deviceRouter from './device'
/* !!!: 懒加载 */
const Home = () => import(/* webpackChunkName: 'home' */ './../views/Home.vue')
const Login = () => import(/* webpackChunkName: 'login' */ './../views/login.vue')
const Catlog = () => import(/* webpackChunkName: 'catlog' */ '../views/common/catlog.vue')
const Table = () => import(/* webpackChunkName: 'table' */ '../components/data/table.vue')
const NotFound = () => import(/* webpackChunkName: 'is404' */ './../views/404.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    redirect: '/index/home',
    beforeEnter: (to, from, next) => {
      if (to.path === '/index/home') {
        localStorage.setItem('newHref', '')
        localStorage.setItem('onceBreadcrumbHtml', '1')
        localStorage.setItem('nowLinkList', '')
      }
      next()
    },
    children: [
      {
        path: '/index/:catlog',
        component: Catlog,
        children: [
          ...systemRouter,
          ...deviceRouter,
          {
            path: '/index/:catlog/:id',
            name: 'table',
            component: Table
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/404',
    name: 'is404',
    component: NotFound
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  mode: 'history',
  linkExactActiveClass: 'city-this',
  routes
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('isToken') || sessionStorage.getItem('isToken')
  const userInfo = JSON.parse((localStorage.getItem('userInfo')) || (sessionStorage.getItem('userInfo')))
  if (token !== '' && userInfo) {
    store.commit('setUserInfo', userInfo)
    store.commit('setToken', token)
    store.commit('setIslogin', true)
    next()
  } else {
    store.commit('setUserInfo', {})
    store.commit('setToken', '')
    store.commit('setIslogin', false)
    next('/login')
  }
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
