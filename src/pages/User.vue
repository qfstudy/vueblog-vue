<template>
  <div class="user-container">
    <section class="user-left-wrapper">
      <div class="user-info-container">
        <div class="user-info-wrapper">       
          <img :src="avatar" class="avatar"/>        
          <div class="info-right">
            <span class="user-name">{{userName}}</span>
            <span class="article-number">文章：{{userArticel.length}}</span>
          </div>
        </div>
        
      </div>
      <div class="article-info-wrapper">
        <div class="article-info">
          <span class="articel-tab">个人文章</span>
          <div class="article-info-detail" v-for="item in userArticel" :key="item.id">
            <router-link :to="{ name: 'Article', params: { articleId: item.id }}">
              <span class="title">{{item.title}}</span>
            </router-link>
            <p class="content" v-if="item.content">{{item.content}}</p>
            <p class="content" v-else>{{item.title}}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
axios.defaults.withCredentials=true

export default {
  name: 'Me',
  data(){
    return{
      userName: '',
      userArticel: '',
      avatar: '',
      n: 1
    }
  },
  methods: {
    inputChange(){
      this.save=true
      this.edit=false
    },
    saveClick(){
      this.save=false
      this.edit=true
    },
    // saveButtonChangeClass(){
      
    // },
    setUserName(){
      let timer=setInterval(()=>{
        this.userName=this.$store.state.userName
        if(this.userName || this.n>10){          
          this.checkLogin()
          console.log('this.userNamennn+user: '+this.userName,this.n)
          this.n=1
          clearInterval(timer)
        }
        this.n++
      },50)
    },
    checkLogin(){
      if(!this.userName && this.userName !== this.$route.params.userName){
        this.$root.tooltip('请先登录')
        let timer = setTimeout(() => {
          this.$router.push({name: 'Signin'})
          clearTimeout(timer)
        }, 2000)
        return
      }
      this.getUserArticleInfo()
    },
    getUserArticleInfo(){
      axios.get('http://localhost:3000/user',{
        params:{
          userName: this.userName
        }
      })
      .then((response)=>{
        this.userArticel = response.data.articles
        this.avatar=this.userArticel[0].avatar
        console.log(this.userArticel)
      })
    }
  },
  mounted(){
    this.setUserName()
  }
}
</script>

<style lang="scss" scoped>
  .user-container{
    background: #fff;
    .user-left-wrapper{
      .user-info-container{
        border-bottom: 1px solid #eee;
        padding-left: 10px;
        height: 80px;
        .user-info-wrapper{
          display: flex;
          padding: 10px 0;
          .avatar{
            display: inline-block;
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }        
          .info-right{
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            .user-name{
              font-size: 24px;
            }
            .article-number{
              font-size: 12px;
              color: #a59fac;
            }
          }
        }
        
      }
      
      .article-info-wrapper{
        .article-info{
          .articel-tab{
            display: inline-block;
            font-size: 20px;
            background: #eee;
            width: 100%;
            padding: 10px;
          }
          .article-info-detail{
            padding: 10px 0;
            border-bottom: 1px solid #eee;
            padding-left: 10px;
            .title{
              font-size: 28px;
            }
            .content{
              padding: 10px 0;
              color: #a59fac;
            }
          }
        }
      }
    }
  }
</style>
