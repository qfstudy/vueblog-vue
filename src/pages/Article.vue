<template>
  <div class="article-container">
    <b-header class="homepage-header"></b-header>
    <section class="main-container">
      <div class="main-left">
        <div class="icon-wrapper">
          <div class="icon-like-wrapper">
            <span @click="saveLike" class="span-like" :class="{addLike: isLike}">
              <svg class="icon-left icon-like">
                <use xlink:href="#icon-dianzan"></use>
              </svg>
            </span>
            <span class="span-linknum">{{articleDetail.likenum}}</span>
          </div>
          <div class="icon-comment-wrapper">
            <span class="span-comment">
              <svg class="icon-left">
                <use xlink:href="#icon-pinglun"></use>
              </svg>
            </span>
            <span class="span-comment-length">{{commentLength}}</span>
          </div>
          <div class="icon-collection-wrapper">
            <span @click="saveCollection" class="span-collection" :class="{addCollection: isCollection}">
              <svg class="icon-left icon-collection">
                <use xlink:href="#icon-shoucang1"></use>
              </svg>
            </span>  
          </div>                      
        </div>
      </div>
      <section class="main-center">
        <div class="main-center-avatar">        
          <img 
            :src="baseUrl+'/images/avatar/'+articleDetail.avatar" 
            v-if="articleDetail.avatar"
            @click="linkToUser(articleDetail.name)"
          >
          <img  src="../assets/images/avatar-placeholder.svg" v-else>
          <div class="avatar-username">
            <span class="user-name" @click="linkToUser(articleDetail.name)">
              {{articleDetail.name}}
            </span>
            <span class="date">
              {{articleDetail.date}}
              <span class="read-number">阅读{{articleDetail.pv}}</span>
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
          <comment></comment>
        </div>
      </section>
      <div class="main-right">
        <section class="about-author-wrapper">
          <span class="about-author">关于作者</span>
          <div class="author-avatar">
            <img 
              :src="baseUrl+'/images/avatar/'+articleDetail.avatar" 
              v-if="articleDetail.avatar"
              @click="linkToUser(articleDetail.name)"
            >
            <img src="../assets/images/avatar-placeholder.svg" v-else>
            <span class="author-name" @click="linkToUser(articleDetail.name)">
              {{articleDetail.name}}
            </span>
          </div>
          <div class="article-info"> 
            <span>
              <svg class="icon-right">
                <use xlink:href="#icon-dianzan"></use>
              </svg>
            </span>
            <span class="info-text">获得点赞数 {{articleDetail.likenum}}</span>
          </div>
          <div class="article-info">
            <span>
              <svg class="icon-right">
                <use xlink:href="#icon-yuedu"></use>
              </svg>
            </span>
            <span class="info-text">文章被阅读 {{articleDetail.pv}}</span>
          </div>
        </section>
        <section class="author-other-article">
          <span class="other-article-tab">作者其它文章</span>
          <div class="other-article-detail" v-for="item in newArticleData" :key="item.id">
            <router-link :to="{ name: 'Article', params: { articleId: item.id }}">
              <p class="other-article-title">{{item.title}}</p>
            </router-link>
            <div class="other-icon">
              <span class="icon-wrapper">
                <svg class="icon-right">
                  <use xlink:href="#icon-dianzan"></use>
                </svg> 
                <span class="icon-text">{{item.likenum}}</span>
              </span>
              <span class="icon-wrapper">
                <svg class="icon-right">
                  <use xlink:href="#icon-pinglun"></use>
                </svg>
                <span class="icon-text">{{item.comments}}</span>
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
import {url,getUserInfo,getAnArticle,deleteAnArticle,saveCollection,saveLike,getCollection,getLike,getNewArticle} from '../API/fetchData.js'
import Comment from './Comment'
import bHeader from './common/bHeader.vue'

export default {
  name: 'Article',
  data(){
    return{
      articleDetail: '',
      userName: '', 
      articleId: '',
      avatar: '',
      baseUrl: '',
      isCollection: false,
      isLike: false,
      commentLength: '',
      articleAuthor: '',
      newArticleData: []
    }
  },
  components:{
    Comment,
    bHeader
  },
  methods:{
    linkToUser(userName){
      this.$router.push({name: 'User',params:{userName: userName}})
    },
    getArticleData(){
      getAnArticle(this.articleId).then((res)=>{
        // console.log(this.articleId)
        // console.log(res)
        if(res.code===200){
          this.articleDetail=res.data  
          this.articleAuthor=this.articleDetail.name
          this.getNewArticle()
          $('document').ready(function() {
            $('pre code').each(function(i, block) {
              hljs.highlightBlock(block);
            })
          })
        }else{
          console.log('错误: ',res)
        }      
      })
      .catch(function(error){
        console.log(error)
      })
    },
    deleteArticle(){
      deleteAnArticle(this.articleId).then((res)=>{
        // console.log(res)
        if(res.code===200){
          this.$root.tooltip(res.message,1)
          this.$router.push({name: 'Homepage'})
        }
      }).catch(function(error){
        console.log(error)
      })
    },
    // 收藏
    saveCollection(){
      saveCollection(this.userName,this.articleId).then(res=>{
        // console.log(res)
        if(res.code===200){
          // this.isCollection=!this.isCollection
          this.getCollection()
          this.getArticleData()
        }
        
      })
    },
    // 获取收藏
    getCollection(){
      getCollection(this.userName,this.articleId).then(res=>{
        // console.log(res)
        if(res.code===200 && res.data){
          this.isCollection=true
        }else{
          this.isCollection=false
        }
      }).catch((error)=>{
        this.isCollection=false
        console.log(error)
      })
    },
    // 点赞
    saveLike(){
      saveLike(this.userName,this.articleId).then(res=>{
        // console.log(res)
        if(res.code===200){
          // this.isLike=!this.isLike
          this.getLike()
          this.getArticleData()
        }
      })
    },
     // 获取点赞
    getLike(){
      getLike(this.userName,this.articleId).then(res=>{
        // console.log(res)
        if(res.code=200 && res.data){
          this.isLike=true
        }else{
          this.isLike=false
        }
      }).catch((error)=>{
        this.isLike=false
        console.log(error)
      })
    },
    // 获取五篇文章
    getNewArticle(){
      getNewArticle(this.articleAuthor).then(res=>{
        this.newArticleData=res.data
        // console.log(res.data)
      }).catch((error)=>{
        console.log(error)
      })
    },
    checkUserSignin(){
      getUserInfo().then((res)=>{
        console.log(res)
        if(res.code===200){
          this.userName=res.data.userName
          this.avatar=res.data.avatar 
          this.getLike()
          this.getCollection()
        }
      }).catch((error)=>{
        this.userName=''
        this.getLike()
        this.getCollection()
        console.log(error)
      })
    },
    initData(){
      this.articleId=this.$route.params.articleId
      hljs.initHighlightingOnLoad()
    },
    removeBodyClass(){
      let html=document.querySelector('html')
      let body=document.querySelector('body')
      html.classList.remove('hidden-overflow')
      body.classList.remove('hidden-overflow')
    }
  },
  watch:{
    $route(to,from){
      this.articleId=this.$route.params.articleId
      this.getArticleData()
      this.getLike()
      this.getCollection()
      this.$root.bus.$emit('emitGetComment',this.articleId)    
    }
  },
  created(){
    this.initData()
    this.checkUserSignin()    
    this.getArticleData() 
  },
  mounted(){ 
    this.$root.bus.$on('emitCommentLength',(value)=>{
      this.commentLength=value
    })
    this.$root.bus.$on('emitSignout',()=>{
      console.log('emitSignout')
      this.checkUserSignin()    
    })
    this.baseUrl=url   
    this.removeBodyClass()
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
      margin-top: 56px;
      .main-left{
        position: fixed;
        top: 56px;
        left: 0;
        height: 100%;
        background: #f4f5f5;
        width: 15%;
        .icon-wrapper{
          position: fixed;
          display: flex;
          flex-direction: column;
          top: 30%;
          left: 6%;
          .icon-like-wrapper{
            display: flex;
            .span-like{
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 8px 0;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background: #fff;
              cursor: pointer;
            }
            .span-linknum{
              font-size: 12px;
              padding: 1px;
              color: #bbb;
            }
          }
          .icon-comment-wrapper{
            display: flex;
            .span-comment{
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 8px 0;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background: #fff;
            }
            .span-comment-length{
              font-size: 12px;
              padding: 1px;
              color: #bbb;
            }
          }
          .icon-collection-wrapper{
            .span-collection{
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 8px 0;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background: #fff;
              cursor: pointer;
            }
          }
          
          .addCollection{
            .icon-collection{
              fill: #ffc347;   
            }
          }
          .addLike{
            .icon-like{
              fill: #6cbd45;
            }
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
        margin-left:  15%;
        .main-center-avatar{
          display: flex;
          align-items: center;
          margin: 20px 16px;
          img{
            width: 46px;
            height: 46px;
            border-radius: 50%;
            cursor: pointer;
          }
          .avatar-username{
            display: flex;
            flex-direction: column;
            .user-name{
              padding-left: 16px; 
              font-weight: 600;
              cursor: pointer;
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
              cursor: pointer;
            }
            .author-name{
              padding-left: 10px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
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
