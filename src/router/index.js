import Vue from 'vue'
import Router from 'vue-router'
import Register from '../pages/Register'
import Signin from '../pages/Signin'
import Homepage from '../pages/Homepage'
import Navbar from '../pages/common/Navbar.vue'
import Write from '../pages/Write.vue'
import Article from '../pages/Article.vue'
import User from '../pages/User.vue'
import Edit from '../pages/Edit.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Homepage',
      components: {
        main: Homepage,
        navbar: Navbar
      }
    },
    {
      path: '/signup',
      name: 'Register',
      components: {
        main: Register,
        navbar: Navbar
      }
    },
    {
      path: '/signin',
      name: 'Signin',
      components: {
        main: Signin,
        navbar: Navbar
      }
    },
    {
      path: '/write',
      name: 'Write',
      components: {
        main: Write,
        navbar: Navbar
      }
    },
    {
      path: '/article/:articleId',
      name: 'Article',
      components: {
        main: Article,
        navbar: Navbar
      }
    },
    {
      path: '/user/:userName',
      name: 'User',
      components: {
        main: User,
        navbar: Navbar
      }
    },
    {
      path: '/edit/:articleId',
      name: 'Edit',
      components: {
        main: Edit,
        navbar: Navbar
      }
    }
  ]
})
