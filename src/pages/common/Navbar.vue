<template>
  <header class="navbar-wrapper">
    <div class="navbar-homepage">
      <router-link :to="{ name: 'Homepage'}">
        首页							
      </router-link>
    </div>
    <div class="navbar-content">
      <a target="__blank" href="https://github.com/qfstudy/koa2-blog">
        GitHub
      </a>							
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
      <span>
        <router-link 
          :to="{ name: 'User', params: { userName: userName ? userName : false}}"
        >
          <img :src="avatar" class="navbar-avatar" v-if="userName">			
        </router-link>
      </span>
    </div>
    <!-- <div class="avatar-username">
      
    </div> -->
	</header>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials=true

export default {
  name: 'Navbar',
  data(){
    return{
      cookieValue: '',
      userName: '',
      avatar: '',
      n: 1
    }
  },
  methods: {
    navbarCheckPageLogin(){
      if(!this.userName){
        this.$root.tooltip('还没有登录，无法访问',1)
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
          if(this.userName && this.cookieValue){
            this.getUserInfo()
          }
          clearInterval(timer)
        }
        this.n++
      },50)
    },
    getUserInfo(){
      axios.get('http://localhost:3000/signout',{
        params:{
          userName: this.userName
        }
      })
      .then((response)=>{
        let res=response.data
        console.log(response)
        if(res.code===200 && res.userInfo.length>0){
          this.avatar=res.userInfo[0].avatar
          // console.log(this.avatar)
          return
        }
      })
    },
    signoutClick(){
      axios.post('http://localhost:3000/signout',{
          userName: this.userName
        })
        .then((response)=>{
          let res=response.data
          if(res.code===200){
            this.$root.tooltip(res.message,1)
            // this.$store.commit('checkLoginCookie')
          }
          this.deleteUserName()
        })
    },

    deleteUserName(){
      this.userName=''
      this.cookieValue=''
    },

    eventBusFn(){
      this.$root.bus.$on('emitSetUserName',(val)=>{
        this.$store.commit('checkLoginCookie')
        this.setUserName()
      })
    }
  },
  mounted(){
    // console.log('navbar munted')
    this.$store.commit('checkLoginCookie')
    this.setUserName()
    this.eventBusFn()
  },
  updated(){
    // console.log('navbar update')
    this.$store.commit('checkLoginCookie')
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
    height: 56px;
    .navbar-homepage{
      margin-left: 10px;
    }
    .navbar-content{
      display: flex;
      align-items: center;
      .signout{
        cursor: pointer;
        color: #666666;
      }
      .navbar-avatar{
        width: 42px;
        height: 42px;
        border: 1px solid #eee;
        border-radius: 50%;
        margin-right: 10px;
      }
      a{
        display: inline-block;
        padding: 12px 10px;
        color: #666666;
      }
    }
  }
</style>
