<template>
  <header class="navbar-wrapper">
    <div class="navbar-homepage">
      <router-link :to="{ name: 'Homepage'}">
        首页							
      </router-link>
    </div>
    <div class="navbar-content">
      <span>
        <a target="__blank" href="https://github.com/qfstudy/vueblog-vue">
          GitHub
        </a>	
      </span>						
      <span class="user-page" @click="userpageCheckLogin">个人主页</span>
      <span class="write-page" @click="writeCheckPageLogin">写文章</span>      
      <span v-if="!userName">
        <router-link :to="{ name: 'Signin'}">
          登录							
        </router-link>	
      </span>
      <span v-if="!userName">
        <router-link :to="{ name: 'Register'}">
          注册						
        </router-link>	      
      </span>				        
      <span class="signout" v-if="userName" @click="signoutClick">
        登出
      </span>
      <span @click="userpageCheckLogin">
        <img :src="avatar" class="navbar-avatar" v-if="userName">        
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
    writeCheckPageLogin(){
      if(!this.userName){
        this.$root.tooltip('还没有登录，无法访问',2)
        this.$router.push({name: 'Signin'})
        return
      }
      if(this.userName){
        this.$router.push({name: 'Write'})
      }
    },
    userpageCheckLogin(){
      if(!this.userName){
        this.$router.push({name: 'Homepage'})
        return
      }
      if(this.userName){
        this.$router.push({name: 'User',params:{userName: this.userName}})
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
      span{
        color: #666666;
        padding: 5px;
      }
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
