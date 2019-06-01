import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/js/blogsvg.js'
import toastPlugin from './pages/common/toastPlugin.js'
Vue.use(toastPlugin)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data(){
    return{
      bus: new Vue()
    }
  },
  methods:{
    tooltip(text,time=2){
      this.$toast({
        message: text,
        duration: time,
        position: 'middle',
      })
    }
  }
})
