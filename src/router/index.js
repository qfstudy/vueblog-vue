import Vue from 'vue'
import Router from 'vue-router'
import Signup from '../pages/Signup'
import Signin from '../pages/Signin'
import Homepage from '../pages/Homepage'
// import Navbar from '../pages/common/Navbar.vue'
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
    // {
    //   path: '/article/:articleId',
    //   name: 'Article',
    //   components: {
    //     main: Article,
    //     navbar: Navbar
    //   }
    // },
    // {
    //   path: '/user/:userName',
    //   name: 'User',
    //   components: {
    //     main: User,
    //     navbar: Navbar
    //   }
    // },
    // {
    //   path: '/edit/:articleId',
    //   name: 'Edit',
    //   components: {
    //     main: Edit
    //   }
    // }
  ]
})
