import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex)

// import toastPlugin from '../pages/common/toastPlugin.js'
// Vue.use(toastPlugin)

import axios from 'axios'
axios.defaults.withCredentials = true

// let tooltip=(text)=>{
//   Vue.prototype.$toast({
//     message: text,
//     duration: 2,
//     position: 'middle',
//   })
// }

export default new vuex.Store({
  state: {
    userName: '',
    cookieValue: ''
  },
  mutations: {
    checkLoginCookie(state) {
      let checkLogin = function () {
        axios.post('http://localhost:3000/checklogin', {
            cookieValue: state.cookieValue
          })
          .then((response) => {
            let res = response.data
            if (res.code === 200) {
              state.userName = res.userName
              console.log('state.userName=res.userName+checkLogin: ' + state.userName)
            } else {
              state.userName=''
              // tooltip(res.message)
            }
          }).catch((error)=>{
            console.log(error)
          })
      }

      let getCookie = function () {
        let cookieStr, n = 1
        let timer = setInterval(() => {
          let cookieVal = document.cookie
          cookieStr = cookieVal.split('=')
          if (cookieStr.length > 1 && cookieStr[1] || n > 10) {
            state.cookieValue = cookieStr[1]
            console.log('document.cookie+store:index.js: ' + state.cookieValue,n)
            checkLogin()
            clearInterval(timer)
          }
          n++
        }, 50)
      }
      getCookie()
    },
  }
})
