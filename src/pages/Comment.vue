<template>
  <div class="comment-container">
    <section class="comment-write-wrapper" v-if="userName">
      <div class="content-write">
        <div class="user-avatar">
          <img :src="avatar" alt="">
        </div>
        <textarea class="comment-input-content" spellcheck="false" placeholder="写下你的评论...  ">
        </textarea>   
      </div>
      <button class="submit" @click="saveCommentToMql">发送</button>
    </section>      
    <section v-else class="no-signin">
      <router-link :to="{ name: 'Signin'}">
        <span class="signin">登录</span>
      </router-link>	
      <span class="signin-comment">后发表评论</span>
    </section>
    
    <section class="comment-content-wrapper">
      <div class="comment-wrapper" v-for="content in commentContent" :key="content.id">
        <div class="comment-user-info">
          <img class="user-avatar" :src="content.avatar" alt="">
          <span class="user-name">{{content.name}}</span>
        </div>
        <div class="comment-content markdown-body" v-html="content.content"></div>
        <div class="comment-bottom">
          <span class="comment-time">{{content.moment}}</span>
          <span class="delete-comment-wrapper" v-if="content.name === userName" @click="deleteComment(content.id)">
            删除
          </span>
        </div>
      </div>
    </section>	
    <span class="no-comment" v-if="commentContent.length<1">智慧如你，不想发表一点想法咩~</span>
  </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
axios.defaults.withCredentials=true
import hljs from 'highlight.js'
import 'highlight.js/styles/atelier-dune-light.css'
import 'github-markdown-css'

export default {
  name: 'Comment',
  data () {
    return {
      userName: '',
      checkCommentValue: false,
      commentContent: '',
      n: 1
    }
  },
  props:{
    avatar: String
  },
  methods: {
    setUserName(){
      let timer=setInterval(()=>{
        this.userName=this.$store.state.userName
        if(this.userName || this.n>10){
          console.log('this.userNamennn+comment: '+this.userName,this.n)
          this.n=1
          clearInterval(timer)
        }
        this.n++
      },50)
    },
    checkInputValue(){
      console.log("$('.content').val().trim(): "+ $('.comment-input-content').val().trim())
      if ($('.comment-input-content').val().trim() === '') {
        this.$root.tooltip('请输入评论',1)
        this.checkCommentValue=false
			}else{
        this.checkCommentValue=true
      }
    },
    saveCommentToMql(){
      this.checkInputValue()
      if(!this.checkCommentValue){
        return
      }
      axios.post('http://localhost:3000/article/comment',{
        userName: this.userName,
        content: document.querySelector('.comment-input-content').value,
        articleId: this.$route.params.articleId
      })
      .then((response)=>{
        console.log(response)
        if(response.data.code==200){
          this.$root.tooltip(response.data.message,1)
          this.getComment()
          document.querySelector('.comment-input-content').value=''
        }else{
          this.$root.tooltip(response.data.message,1)
        }
      })
    },
    getComment(){
      axios.get('http://localhost:3000/article/comment',{
        params: {
          articleId: this.$route.params.articleId
        }
      })
        .then((response)=>{
          // console.log(response)
          this.commentContent=response.data.commentArray
          // console.log(this.commentContent)          
        })
        .catch(function(error){
          console.log(error)
        })
    },
    deleteComment(commentId){
      console.log(commentId)
      axios.post('http://localhost:3000/article/comment/remove',{
        id: commentId,
        userName: this.userName,
        articleId: this.$route.params.articleId
      })
      .then((response)=>{
        // console.log(response)
        if(response.data.code===200){
          this.$root.tooltip(response.data.message,1)
          this.getComment()
        }else{
          this.$root.tooltip(response.data.message,1)
        }
      })
    }
  },
  mounted () {
    this.getComment()
    this.setUserName()
  }
}
</script>

<style lang="scss" scoped>
  .comment-container{
    .comment-write-wrapper{
      padding-left: 10px;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      .content-write{
        display: flex;
        align-items: center;        
        .user-avatar{
          margin-right: 10px;
          img{
            width: 56px;
            height: 56px;
            border-radius: 50%;
          }
        }
        .comment-input-content{
          resize: none;  
          width: 50%;
          height: 80px;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 10px;
          font-size: 18px;
        }
        .comment-input-content:focus{
          outline: none;
        }
      }
      .submit{        
        border: 1px solid #ddd;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
        width: 60px;
        height: 40px;
        margin-left: 50%;
        background: #fff;
      }
      .submit:focus{
        outline: none;
      }
    }
    .no-signin{
      border: 1px solid #ddd;
      width: 50%;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #eee;
      margin: 0 auto;
      .signin{
        border-radius: 5px;
        background: #2175bc;
        color: white;
        padding: 2px 10px;
        font-size: 18px;
        cursor: pointer;
      }
      .signin-comment{
        padding-left: 10px;
      }
    }
    .comment-content-wrapper{
      border-top: 1px solid #ddd;
      margin-top: 80px;      
      .comment-wrapper{
        padding-left: 10px;
        padding-top: 20px; 
        .comment-user-info{
          display: flex;
          align-items: center;
          .user-avatar{            
            width: 38px;
            height: 38px;
            border-radius: 50%;
          }
          .user-name{
            font-size: 22px;
            padding-left: 10px;
          }
        }
        .comment-content{
          padding: 10px 0;
          font-size: 22px;
        }
        .comment-bottom{
          font-size: 16px;
          .comment-time{
            color: #999;
          }
          .delete-comment-wrapper{
            color: #2175bc;
            cursor: pointer;
          }
        }
      }
    }
    .no-comment{
      padding: 10px;
    }
  }
</style>
