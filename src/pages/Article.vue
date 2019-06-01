<template>
  <div class="article-container">
    <b-header class="homepage-header"></b-header>
    <div class="article-wrapper">
      <section class="article-title-content">
        <div class="title-wrapper">
          <span class="title">{{articleDetail.title}}</span>
        </div>
        <div class="content-wrapper markdown-body">
          <span class="content" v-html="articleDetail.content"></span>
        </div>
      </section>

      <section class="bottom-wrapper">
        <span>评论:({{articleDetail.comments}})</span>
        <span>阅读:({{articleDetail.pv}})</span>
        <span v-if="userName && (userName === articleDetail.name)">
          <router-link :to="{ name: 'Edit', params: { articleId: articleDetail.id }}">
            编辑
          </router-link>
        </span>
        <span 
          v-if="userName && (userName === articleDetail.name)" 
          class="delete-article"
          @click="deleteArticle"
        >
          删除
        </span>
      </section>
    </div>
    <div class="comment-wrapper">
      <comment/>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import hljs from 'highlight.js'
// idea.css github.css
import 'highlight.js/styles/atelier-dune-light.css'
import 'github-markdown-css'
import {getAnArticle,deleteAnArticle} from '../API/fetchData.js'
import Comment from './Comment'
import bHeader from './common/bHeader.vue'

export default {
  name: 'Article',
  data(){
    return{
      articleDetail: '',
      userName: '', 
      articleId: '',
      headerHeight: '',
    }
  },
  components:{
    Comment,
    bHeader
  },
  methods:{
    async getArticleData(){
      await getAnArticle(this.articleId).then((res)=>{
        // console.log(res)
        if(res.code===200){
          this.articleDetail=res.data  
        }else{
          console.log('错误: ',res)
        }      
      })
      .catch(function(error){
        console.log(error)
      })
    },
    async deleteArticle(){
      await deleteAnArticle(this.articleId).then((res)=>{
        // console.log(res)
        if(res.code===200){
          this.$root.tooltip(res.message,1)
          this.$router.push({name: 'Homepage'})
        }
      }).catch(function(error){
        console.log(error)
      })
    },
    initData(){
      this.articleId=this.$route.params.articleId
      this.headerHeight=this.$store.state.bHeaderHeight
      let timer=setTimeout(()=>{
        this.userName=this.$store.state.userInfo.userName
        clearTimeout(timer)
      },0)
      hljs.initHighlightingOnLoad()
      $(document).ready(function() {
        $('pre code').each(function(i, block) {
          hljs.highlightBlock(block);
        })
      })
    },
    removeBodyClass(){
      let html=document.querySelector('html')
      let body=document.querySelector('body')
      html.classList.remove('hidden-overflow')
      body.classList.remove('hidden-overflow')
    },
    getHeaderHeight(){
      let timer = setTimeout(()=>{
        let mainEle=document.querySelector('.article-wrapper')
        mainEle.style.marginTop=this.headerHeight+'px'
        clearTimeout(timer)
      },100)
    },
  },
  mounted(){ 
    this.initData()
    this.removeBodyClass()
    this.getArticleData()
    this.getHeaderHeight()
  }
}
</script>

<style lang="scss" scoped>
  // @import "../assets/css/github.css"
  .article-container{
    position: relative;
    .homepage-header{
      position: fixed;
      top: 0;
      width: 100%;
      background: #fff;
    }
    .article-wrapper{
      border-bottom: 1px solid #e9e9e9;
      padding-top: 10px;
      .article-title-content{
        padding-left: 10px;
        .title-wrapper{
          // border-bottom: 1px solid #eee;
          padding-bottom: 18px;
          .title{
            font-size: 26px;
            font-weight: 600;
          }
        }
      }
      .bottom-wrapper{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 14px;
        margin-right: 30px;
        margin-top: 20px;
        span{
          padding: 0 3px;
          color: #999999;
          margin-bottom: 20px;
          a{
            color: #2175bc;
            cursor: pointer;
          }
          &.delete-article{
            color: #2175bc;
            cursor: pointer;
          }
        }
      }
    }
    .comment-wrapper{
      margin-top: 10px;
      width: 100%;
    }
  }
</style>
