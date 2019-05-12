<template>
  <header class="navbar-wrapper">
    <span class="navbar-user-name" v-if="userName">hello {{userName}}</span>
    <div class="navbar-content">
      <a target="__blank" href="https://github.com/qfstudy/koa2-blog">
        GitHub
      </a>							
      <router-link :to="{ name: 'Homepage'}">
        首页							
      </router-link>
      <span class="user-page" @click="navbarCheckPageLogin">
        <router-link 
          :to="{ name: 'User', params: { userName: userName ? userName : false}}">
          我的主页							
        </router-link>
      </span>
      <span class="user-page" @click="navbarCheckPageLogin">
        <router-link :to="{ name: 'Write'}">
          写文章							
        </router-link>
      </span>      
      <router-link :to="{ name: 'Signin'}" v-if="!userName">
        登录							
      </router-link>	
      <router-link :to="{ name: 'Register'}" v-if="!userName">
        注册						
      </router-link>	      				        
      <span class="signout" v-if="userName" @click="signoutClick">
        登出
      </span>
    </div>
	</header>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials=true

export default {
  name: 'Navbar',
  data(){
    return{
      // isLogin: false,
      cookieValue: '',
      userName: '',
      navHeight: '',
      n: 1
    }
  },
  methods: {
    navbarCheckPageLogin(){
      if(!this.userName){
        this.$root.tooltip('还没有登录，无法访问')
        let timer=setTimeout(()=>{
          this.$router.push({name: 'Signin'})
          clearTimeout(timer)
        },1000)
      }
    },
    setUserName(){
      let timer=setInterval(()=>{
        this.userName=this.$store.state.userName
        this.cookieValue=this.$store.state.cookieValue
        if((this.userName && this.cookieValue) || this.n>10){
          console.log('this.userNamennn: '+this.userName,this.n)
          this.n=1
          clearInterval(timer)
        }
        this.n++
      },50)
    },
    signoutClick(){
      axios.post('http://localhost:3000/signout',{
          userName: this.userName
        })
        .then((response)=>{
          let res=response.data
          if(res.code===200){
            this.$root.tooltip(res.message)
          }
          this.deleteUserName()
          let timer = setTimeout(() => {
            // window.location.reload()
            this.$router.push({name: 'Homepage'})
            clearTimeout(timer)
          }, 2000)
        })
    },

    deleteUserName(){
      this.userName=''
      this.cookieValue=''
    },

    getNavbarHeight(){
      let navbar=document.querySelector('.navbar-wrapper')
      let navbarHeight=navbar.getBoundingClientRect().height
      this.navHeight = navbarHeight
      // console.log("ssd: "+ navbarHeight)
      // console.log('navbar height: '+this.navHeight)
    },
    eventBusFn(){
      this.$root.bus.$on('emitSetUserName',(val)=>{
        this.$store.commit('checkLoginCookie')
        this.setUserName()
      })
    }
  },
  mounted(){
    this.$store.commit('checkLoginCookie')
    this.setUserName()

    this.eventBusFn()
    this.getNavbarHeight()
  }
}
</script>

<style lang="scss" scoped>
  .navbar-wrapper{
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    background: #fff;
    .navbar-user-name{
      margin-left: 30px;
      font-size: 20px;
    }
    .navbar-content{
      .signout{
        cursor: pointer;
        color: #666666;
        margin-right: 30px;
      }
      a{
        display: inline-block;
        padding: 12px 10px;
        color: #666666;
      }
    }
  }
</style>
