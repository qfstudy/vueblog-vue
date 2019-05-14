<template>
  <div class="article-container">
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
import {getAnArticle,deleteAnArticle} from '../API/fetchData.js'
import hljs from 'highlight.js'
// idea.css github.css
import 'highlight.js/styles/atelier-dune-light.css'
import 'github-markdown-css'
import Comment from './Comment'

export default {
  name: 'Article',
  data(){
    return{
      articleDetail: '',
      userName: '', 
      articleId: ''
    }
  },
  components:{
    Comment
  },
  methods:{
    async getArticleData(){
      await getAnArticle(this.articleId).then((res)=>{
        if(res.code===200){
          this.articleDetail=res.articles  
          //如果已登录就返回userName         
          if(res.userName){
            this.userName=res.userName
          }   
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
        }else{
          this.$root.tooltip(response.data.message,1)
          this.$router.push({name: 'Homepage'})
        }
      })
    },
    initData(){
      this.articleId=this.$route.params.articleId
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
    }
  },
  mounted(){
    this.initData()
    this.removeBodyClass()
    this.getArticleData()
  }
}
</script>

<style lang="scss" scoped>
  // @import "../assets/css/github.css"
  .article-container{
    margin-top: 56px;
    background: #fff;
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
