<template>
  <header class="navbar-wrapper">
    <div class="navbar-github">
      <a class="github-icon-wrap" target="__blank" href="https://github.com/qfstudy/vueblog-vue">
        <svg class="icon-github" aria-hidden="true">
          <use xlink:href="#icon-github"></use>
        </svg>
      </a>	
    </div>
    <div class="search-wraper">
      <router-link :to="{ name: 'Search'}">      
        <input 
          v-model="inputSearch" 
          type="text" 
          v-focus
          placeholder="搜索" 
          class="search-input" 
          @input="searchArticle"
        >
      </router-link>
      <svg class="icon-search" aria-hidden="true">
        <use xlink:href="#icon-search"></use>
      </svg>      
    </div>
    <div class="navbar-content">
      <router-link :to="{ name: 'Homepage'}" class="homepage-text">
        首页							
      </router-link>				 
      <span v-if="!userName">
        <router-link :to="{ name: 'Signin'}">
          登录							
        </router-link>	
      </span>
      <span v-if="!userName">
        <router-link :to="{ name: 'Signup'}">
          注册						
        </router-link>	      
      </span>				        
      
      <vi-select :avatar="avatar" :userName="userName" v-if="userName"></vi-select>
      <span class="write-page" @click="checkWritePageLogin">
        <svg class="icon-xieboke" aria-hidden="true">
          <use xlink:href="#icon-xiezi"></use>
        </svg>
        写文章
      </span>  
    </div>
	</header>
</template>

<script>
import {mapActions} from 'vuex'
import {url,signout, getUserInfo, searcharticle} from '../../API/fetchData.js'
import viSelect from './viSelect.vue'

export default {
  name: 'Navbar',
  data(){
    return{
      userName: '',
      avatar: '',
      baseUrl: '',
      inputSearch: '',
      searchResult: ''
    }
  },
  components:{
    viSelect
  },
  methods: {
    searchArticle(){
      if (this.inputSearch !== ''){
        searcharticle(this.inputSearch).then(res=>{
          // console.log(res.data)
          this.searchResult = res.data
          this.$root.bus.$emit('emitSearchValue',this.searchResult)
        })
      }else{
        this.searchResult = ''
        this.$root.bus.$emit('emitSearchValue',this.searchResult)
      }
    },
    clickSignout(){
      signout().then((res)=>{ 
        if(res.code===200){
          this.$root.tooltip(res.message,1)
          this.userName=''
          this.avatar=''
        }        
      }).catch((error)=>{
        console.log(error)
      })
    },
    checkWritePageLogin(){
      if(!this.userName){
        this.$root.tooltip('还没有登录，无法操作',2)
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
    // 通过向后端发送请求，后端中间件接收cookie验证session
    // 验证通过就会返回用户信息
    async checkUserSignin(){
      await getUserInfo().then((res)=>{
        // console.log(res.data)
        if(res.code===200){
          this.userName=res.data.userName
          this.avatar=res.data.avatar 
          this.addUserInfo({
            userName: this.userName,
            avatar: this.avatar
          }) 
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    getHeaderHeight(){
      let bHeaderHeight = document.querySelector('.navbar-wrapper').getBoundingClientRect().height
      this.addbHeaderHeight(bHeaderHeight)
    },
    eventBus(){
      this.$root.bus.$on('emitSetting',()=>{
        this.$router.push({name: 'Setting',params: { userName: this.userName}})
      })
      this.$root.bus.$on('emitUser',()=>{
        this.userpageCheckLogin()      
      })
      this.$root.bus.$on('emitSignout',()=>{
        this.clickSignout()
      })
    },
    ...mapActions(['addUserInfo','addbHeaderHeight'])
  },
  directives: {
    focus: {
      inserted: function (el) {
        // 聚焦元素
        el.focus()
      }
    }
  },
  mounted(){   
    this.baseUrl=url 
    this.checkUserSignin()
    this.eventBus()
    this.getHeaderHeight()
  }
}
</script>

<style lang="scss" scoped>
  .navbar-wrapper{
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    height: 56px;
    .navbar-github{
      margin-left: 10px;
      .github-icon-wrap{
        .icon-github{
          width: 42px;
          height: 42px;
          fill: #bbb;
        }
      }
    }
    .search-wraper{
      display: flex;
      align-items: center;
      position: relative;
      .search-input{
        padding: 7px;
        border: 1px solid #bbb;
        border-radius: 16px;
        font-size: 16px;
      }
      ::placeholder{
        font-size: 14px;
        color: #bbb;
      }
      .search-input:focus{
        outline: none;
      }
      .icon-search{
        width: 22px;
        height: 22px;
        fill: #bbb;
        position: absolute;
        right: 6px;
      }
    }
    .navbar-content{
      display: flex;
      align-items: center;
      .homepage-text{
        margin-right: 28px;
      }
      a{
        display: inline-block;
        color: #007fff;
        padding: 0 8px;
      }
      .write-page{
        display: flex;
        align-items: center;
        color: #007fff;
        padding:0 20px;
        cursor: pointer;
        .icon-xieboke{
          width: 30px;
          height: 30px;
          fill: #007fff;
        }
      }
    }
  }
</style>
