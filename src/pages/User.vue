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
          <div v-if="userArticel.length<1">
            该作者还没有文章
          </div>
          <div class="article-info-detail" v-for="item in userArticel" :key="item.id">
            <router-link :to="{ name: 'Article', params: { articleId: item.id }}">
              <span class="title">{{item.title}}</span>
            </router-link>
            <p class="content" v-if="item.content" v-html="item.content"></p>
            <p class="content" v-else >{{item.title}}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {getUserAllArticle} from '../API/fetchData.js'

export default {
  name: 'Me',
  data(){
    return{
      userName: '',
      userArticel: '',
      avatar: '',
    }
  },
  methods: {
    async getUserArticleInfo(){
      await getUserAllArticle(this.userName)
      .then((res)=>{
        this.userArticel = res.articles
        this.avatar=res.articles[0].avatar
      }).catch((error)=>{
        console.log(error)
      })
    }
  },
  mounted(){
    this.userName=this.$route.params.userName
    this.getUserArticleInfo()
  }
}
</script>

<style lang="scss" scoped>
  .user-container{
    margin-top: 56px;
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
              font-size: 22px;
            }
            .content{
              padding: 10px 0;
              color: #a59fac;
              display: -webkit-box;
              font-size: 16px;
              line-height: 1.8;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
</style>
