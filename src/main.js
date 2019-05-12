// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// import Axios from 'axios'
import toastPlugin from './pages/common/toastPlugin.js'
Vue.use(toastPlugin)
import store from './store/index.js'

Vue.config.productionTip = false

// Axios.defaults.withCredentials=true
// Vue.prototype.axios = Axios

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  data(){
    return{
      bus: new Vue()
    }
  },
  methods:{
    tooltip(text){
      this.$toast({
        message: text,
        duration: 2,
        position: 'middle',
      })
    }
  }
})
