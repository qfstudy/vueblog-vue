<template>
  <div class="article-container">
    <b-header class="homepage-header"></b-header>
    <section class="main-container">
      <div class="main-left">
        <div class="icon-wrapper">
          <span>
            <svg class="icon-left">
              <use xlink:href="#icon-dianzan"></use>
            </svg>
          </span>
          <span>
            <svg class="icon-left">
              <use xlink:href="#icon-pinglun"></use>
            </svg>
          </span>
          <span>
            <svg class="icon-left">
              <use xlink:href="#icon-shoucang1"></use>
            </svg>
          </span>              
        </div>
      </div>
      <section class="main-center">
        <div class="main-center-avatar">
          <img  src="../assets/images/avatar-placeholder.svg" alt="">
          <div class="avatar-username">
            <span class="user-name">userName</span>
            <span class="date">
              2014年04月26日
              <span class="read-number">阅读1685</span>
            </span>            
          </div>
        </div>
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
      </section>
      <div class="main-right">
        <section class="about-author-wrapper">
          <span class="about-author">关于作者</span>
          <div class="author-avatar">
            <img src="../assets/images/avatar-placeholder.svg">
            <span class="author-name">userName</span>
          </div>
          <div class="article-info"> 
            <span>
              <svg class="icon-right">
                <use xlink:href="#icon-dianzan"></use>
              </svg>
            </span>
            <span class="info-text">获得点赞数60</span>
          </div>
          <div class="article-info">
            <span>
              <svg class="icon-right">
                <use xlink:href="#icon-yuedu"></use>
              </svg>
            </span>
            <span class="info-text">文章被阅读2609</span>
          </div>
        </section>
        <section class="author-other-article">
          <span class="other-article-tab">相关文章</span>
          <div class="other-article-detail">
            <p class="other-article-title">trrrrrrritle</p>
            <div class="other-icon">
              <span class="icon-wrapper">
                <svg class="icon-right">
                  <use xlink:href="#icon-dianzan"></use>
                </svg> 
                <span class="icon-text">6</span>
              </span>
              <span class="icon-wrapper">
                <svg class="icon-right">
                  <use xlink:href="#icon-pinglun"></use>
                </svg>
                <span class="icon-text">6</span>
              </span>
            </div>
          </div>
        </section>
      </div>
    </section>
    
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
        let mainEle=document.querySelector('.main-container')
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
  .article-container{
    position: relative;
    width: 100%;
    .homepage-header{
      position: fixed;
      top: 0;
      width: 100%;
      background: #fff;
      z-index: 99;
    }
    .main-container{
      display: flex;
      width: 100%;
      .main-left{
        background: #f4f5f5;
        width: 15%;
        .icon-wrapper{
          position: fixed;
          display: flex;
          flex-direction: column;
          top: 22%;
          left: 10%;
          span{
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 8px 0;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: #fff;
          }
          .icon-left{           
            width: 26px;
            height: 26px;
            fill: #bbb;            
          }
        }
        
      }
      .main-center{
        flex-grow: 1;
        width: 60%;
        margin-right: 25%;
        .main-center-avatar{
          display: flex;
          align-items: center;
          margin: 20px 16px;
          img{
            width: 46px;
            height: 46px;
            border-radius: 50%;
          }
          .avatar-username{
            display: flex;
            flex-direction: column;
            .user-name{
              padding-left: 16px; 
              font-weight: 600;
            }
            .date{
              font-size: 14px;
              padding-left: 16px;
              padding-top: 6px;
              color: #b2bac2;
              .read-number{
                padding-left: 10px;
                color: #b2bac2;
              }
            }
          }
        }
        .article-wrapper{
          padding-top: 10px;
          .article-title-content{
            padding: 0 16px;
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
      .main-right{
        width: 25%;
        background: #f4f5f5;
        padding-left: 10px;
        position: fixed;
        top: 56px;
        right: 0;
        height: 100%;
        .about-author-wrapper{
          background: #fff;
          margin: 10px;
          .about-author{
            display: inline-block;
            padding: 10px;
            font-size: 16px;
          }
          .author-avatar{
            padding: 10px;
            display: flex;
            align-items: center;
            img{
              width: 46px;
              height: 46px;
              border-radius: 50%;
            }
            .author-name{
              padding-left: 10px;
              font-size: 16px;
              font-weight: 600;
            }
          }
          .article-info{
            display: flex;
            align-items: center;
            padding: 10px;
            span{
              padding-right: 10px;
              .icon-right{
                width: 26px;
                height: 26px;
                fill: #92c6ff;
                border-radius: 50%;
                background: #f4f5f5;
              }
            }
          }
        }
        .author-other-article{
          background: #fff;
          margin: 10px;
          .other-article-tab{
            display: inline-block;
            padding: 10px;
          }
          .other-article-detail{
            padding: 10px;
            .other-article-title{
              font-size: 16px;
            }
            .other-icon{  
              display: flex;
              .icon-wrapper{
                display: flex;
                align-items: center; 
                padding: 10px 0;
                padding-right: 20px;                 
                .icon-right{
                  width: 20px;
                  height: 20px;
                  fill: #b2bac2;
                }
              }
              .icon-text{
                font-size: 14px;
                padding-left: 6px;
                color: #b2bac2;
              }
            }
          }                 
        }
      }
    }       
  }
</style>
