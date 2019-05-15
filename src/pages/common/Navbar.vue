<template>
  <header class="navbar-wrapper">
    <div class="navbar-homepage">
      <router-link :to="{ name: 'Homepage'}">
        首页							
      </router-link>
    </div>
    <div class="navbar-content">
      <a target="__blank" href="https://github.com/qfstudy/vueblog-vue">
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
	</header>
</template>

<script>
import {signout, getUserInfo} from '../../API/fetchData.js'

export default {
  name: 'Navbar',
  data(){
    return{
      userName: '',
      avatar: '',
    }
  },
  methods: {
    async signoutClick(){
      await signout().then((res)=>{
        // let res=response.data
        if(res.code===200){
          this.$root.tooltip(res.message,1)
        }
        this.deleteUserName()
      }).catch((error)=>{
        console.log(error)
      })
    },
    deleteUserName(){
      this.userName=''
    },
    navbarCheckPageLogin(){
      if(!this.userName){
        this.$root.tooltip('还没有登录，无法访问',2)
        this.$router.push({name: 'Signin'})
      }
    },
    async checkUserInfo(){
      await getUserInfo().then((res)=>{
        // console.log(res)
        if(res.code===200){
          this.avatar=res.userInfo.avatar
          this.userName=res.userInfo.userName         
          return
        }
      }).catch((error)=>{
        console.log(error)
      })
    }
  },
  mounted(){
    this.$root.bus.$on('emitCheckLogin',()=>{
      this.checkUserInfo()
    })
    this.checkUserInfo()
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
