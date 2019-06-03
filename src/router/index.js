import Vue from 'vue'
import Router from 'vue-router'
import Signup from '../pages/Signup'
import Signin from '../pages/Signin'
import Homepage from '../pages/Homepage'
import Write from '../pages/Write.vue'
import Article from '../pages/Article.vue'
import User from '../pages/User.vue'
import Edit from '../pages/Edit.vue'
import Setting from '../pages/Setting.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: Homepage
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/write',
      name: 'Write',
      component: Write
    },
    {
      path: '/article/:articleId',
      name: 'Article',
      component: Article
    },
    {
      path: '/user/:userName',
      name: 'User',
      component: User
    },
    {
      path: '/edit/:articleId',
      name: 'Edit',
      component: Edit
    },
    {
      path: '/setting/:userName',
      name: 'Setting',
      component: Setting
    }
  ]
})
