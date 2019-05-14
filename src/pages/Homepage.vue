<template>
  <div class="homepage-container">
    <div class="no-article" v-if="articleData.length<1">
      还没有文章，快去写一篇吧
    </div>
    <div class="homepage-main-wrapper" v-for="item in articleData" :key="item.id">
      <section class="homepage-title-wrapper">
        <!-- 跳转到文章详情 -->
        <router-link :to="{ name: 'Article', params: { articleId: item.id }}">
          <span class="title">{{item.title}}</span>
        </router-link>
      </section>
      <section class="homepage-content-wrapper">
        <div class="content" v-if="item.content" v-html="item.content"></div>
        <div class="content" v-else>{{item.title}}</div>
      </section>
      <section class="homepage-bottom-wrapper">
        <div class="bottom-wrapper">
          <span class="time">{{item.moment}}</span>
          <router-link :to="{ name: 'User', params: { userName: item.name }}">
            <span class="author">{{item.name}}</span>
          </router-link>          
          <span class="comment">评论:({{item.comments}})</span>
          <span class="reading">阅读:({{item.pv}})</span>
        </div>
        <div class="article-link">
          <!-- 跳转到文章详情 -->
          <router-link :to="{ name: 'Article', params: { articleId: item.id }}">
            <span class="title">阅读全文</span>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import {getAllArticles} from '../API/fetchData.js'

export default {
  name: 'Homepage',
  data(){
    return{
      userName: '',
      articleData: ''
    }
  },
  methods:{
    async getArticles(){
      await getAllArticles().then((res)=>{
        if(res.code==200){
          this.articleData=res.articles
        }
      }).catch(function(error){
        console.log(error)
      })
    },
    removeBodyClass(){
      let html=document.querySelector('html')
      let body=document.querySelector('body')
      html.classList.remove('hidden-overflow')
      body.classList.remove('hidden-overflow')
    }
  },
  mounted(){
    this.removeBodyClass()
    this.getArticles() 
  }
}
</script>

<style lang="scss" scoped>
  .homepage-container{
    background: #fff;
    margin-top: 56px;
    .homepage-main-wrapper{
      padding: 10px;
      border-bottom: 1px solid #e9e9e9;
      .homepage-title-wrapper{
        .title{
          font-size: 22px;
          color: #000;
          font-weight: 500;
        }
      }
      .homepage-content-wrapper{
        margin-top: 16px;
        word-wrap: break-word;
        word-break: break-all;
        .content{
          font-size: 16px;
          color: #86868f;
          line-height: 1.8;
          padding: 10px 0;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
      .homepage-bottom-wrapper{
        display: flex;
        margin-bottom: 3px;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        .bottom-wrapper{
          span{
            color: #86868f;
            padding: 0 2px;
            font-size: 12px;    
            &.author{
              color: #2175bc;
            }
          }
          
        }
        .article-link{
          span{
            color: #2175bc;
            font-size: 12px;
            margin-right: 50px;
          }
        }
      }
    }
  }
</style>
