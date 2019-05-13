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
      <comment :avatar="avatar"></comment>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
axios.defaults.withCredentials=true
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
      avatar: '',
      n: 1
    }
  },
  components:{
    Comment
  },
  methods:{
    getArticleData(){
      axios.get('http://localhost:3000/article',{
        params: {
          articleId: this.$route.params.articleId
        }
      })
        .then((response)=>{
          // console.log(response)
          this.articleDetail=response.data.articles 
          this.avatar=response.data.articles.avatar      
        })
        .catch(function(error){
          console.log(error)
        })
    },
    deleteArticle(){
      axios.post('http://localhost:3000/article/remove',{
        articleId: this.$route.params.articleId
      })
      .then((response)=>{
        console.log(response.data)
        if(response.data.code===200){
          this.$root.tooltip(response.data.message,1)
          let timer = setTimeout(() => {
            this.$router.push({name: 'Homepage'})
            clearTimeout(timer)
          }, 1000)
        }else{
          this.$root.tooltip(response.data.message,1)
          let timer = setTimeout(() => {
            window.location.reload()
            clearTimeout(timer)
          }, 1000)
        }
      })
    },
    setUserName(){
      let timer=setInterval(()=>{
        this.userName=this.$store.state.userName
        this.cookieValue=this.$store.state.cookieValue
        if((this.userName && this.cookieValue) || this.n>10){
          console.log('this.userNamennn+write: '+this.userName,this.n)
          this.n=1
          clearInterval(timer)
        }
        this.n++
      },50)
    },
    initData(){
      hljs.initHighlightingOnLoad()
      $(document).ready(function() {
        $('pre code').each(function(i, block) {
          hljs.highlightBlock(block);
        })
      })
    }
  },
  mounted(){
    this.initData()
    this.getArticleData()
    this.setUserName()
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
