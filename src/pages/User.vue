<template>
  <div class="mypage-wrapper"> 
    <b-header></b-header>
    <div class="main-wrapper">
      <section class="main-left">
        <div class="no-upload-avatar" >
          <img src="../assets/images/avatar-placeholder.svg"  v-if="!avatar">
          <img :src="avatar" v-else>
        </div>
        <div class="user-info-wrapper" >
          <section class="user-info">
            <div class="user-name">
              <span>userName</span>
            </div> 
            <div class="github">
              <span>Github:</span>
              <a :href="userData.github" target="_black" v-if="userData.github">
                {{userData.github}}
              </a>
              <router-link v-else to="/setting">     
                <input type="text" placeholder="添加Github链接">   
              </router-link>   
            </div>
            <div class="blog">
              <span>我的博客:</span>
              <a :href="userData.blog" target="_black" v-if="userData.blog">
                {{userData.blog}}
              </a>
              <router-link v-else to="/setting">
                <input type="text" placeholder="添加博客网址"> 
              </router-link>     
            </div>
            <div class="email">
              <span>我的邮箱:</span>
              <span v-if="userData.email">{{userData.email}}</span> 
              <router-link v-else to="/setting">
                <input type="text"  placeholder="添加邮箱">  
              </router-link>   
            </div>
          </section> 
          <span class="edit-user-info">编辑个人资料</span>      
        </div>      
      </section>
      <section class="main-right">
        <div class="main-right-one">
          <span>个人成就</span>
          <div class="icon-and-text">
            <svg class="icon-dianzan" id="sel-show">
              <use xlink:href="#icon-dianzan" id="sel-show"></use>
            </svg>
            <span>获得点赞60</span>
          </div>
          <div class="icon-and-text">
            <svg class="icon-yuedu" id="sel-show">
              <use xlink:href="#icon-yuedu" id="sel-show"></use>
            </svg>
            <span>文章被阅读2660</span>
          </div>          
        </div>

        <div class="main-right-two">
          <div>
            <span>关注了</span>
            <span>7</span>
          </div>
          <div>
            <span>关注</span>
            <span>7</span>
          </div>
        </div>

        <div class="main-right-three">
          <div>
            <span>收藏集</span>
            <span>17</span>
          </div>
          <div>
            <span>加入于</span>
            <span>17</span>
          </div>
        </div>
      </section>  
    </div> 
  </div>  
</template>

<script>
import {url} from '../API/fetchData.js'
import bHeader from './common/bHeader.vue'

export default {
  name: 'Mypage',
  data () {
    return {
      userTime: '',
      isEditName: true,
      inputNewUserName:'',
      userName:'',
      siginUser: true,
      avatar:'',
      userData: ''
    }
  },
  components:{
    bHeader
  },
  methods:{
    setUserInfoData(){
      let timer=setTimeout(()=>{
        this.userName=this.$store.state.userInfo.userName
        this.avatar=url+'/images/avatar/'+this.$store.state.userInfo.avatar
        clearTimeout(timer)
      },0)
    }
  },
  created(){
    // if(this.$route.params.userName===localStorage.userName){      
    //   this.siginUser=true
    //   this.userName=localStorage.userName
    // }else{
    //   this.siginUser=false
    //   this.userName = this.$route.params.userName
    // }
  },
  mounted () { 
    this.setUserInfoData()    
  }
}

</script>

<style lang="scss" scoped>
  .mypage-wrapper{
    border: 1px solid green;     
    .main-wrapper{
      border: 1px solid red;
      display: flex; 
      justify-content: space-between;
      padding: 20px 60px;
      background: #f4f5f5;    
    } 
    .main-left{
      display: flex;
      align-items: center;
      width: 66%;
      background: #fff;
      .no-upload-avatar{
        padding: 10px;
        img{
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
        .upload-avatar-text{
          text-align: center;
        }
      }
      .user-info-wrapper{
        .user-info{
          display: flex;
          flex-direction: column;
          .user-name{
            padding: 5px 0;
          }
          .github{
            padding: 5px 0;
          }
          .blog{
            padding: 5px 0;
          }
          .email{
            padding: 5px 0;
          }
        }
        
      }
    }
    .main-right{
      width: 34%;
      background: #fff;
      margin-left: 10px;
      border: 1px solid yellow;
      .main-right-one{
        .icon-and-text{
          .icon-dianzan{
            width: 26px;
            height: 26px;
          }
          .icon-yuedu{
            width: 26px;
            height: 26px;
          }
        }
      }
      .main-right-two{}
      .main-right-three{}
    }
  }
</style>
