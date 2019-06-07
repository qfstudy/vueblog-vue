<template>
  <div class="comment-container" v-cloak>
    <section class="comment-write-wrapper" v-if="isSignin">
      <div class="content-write">
        <div class="user-avatar">
          <img 
            :src="baseUrl+'/images/avatar/'+avatar" 
            @click="linkToUser(userName)" 
            v-if="avatar"
          >          
          <img src="../assets/images/avatar-placeholder.svg" v-else>
        </div>
        <textarea 
          class="comment-input-content" 
          spellcheck="false" 
          placeholder="写下你的评论...  "
          v-model="textareaValue"
        >
        </textarea>   
      </div>
      <button class="submit" @click="saveCommentToMql">发送</button>
    </section>      
    <section v-if="!isSignin" class="no-signin">
      <router-link :to="{ name: 'Signin'}">
        <span class="signin">登录</span>
      </router-link>	
      <span class="signin-comment">后发表评论</span>
    </section>
    
    <section class="comment-content-wrapper">
      <div class="comment-wrapper" v-for="content in commentContent" :key="content.id">
        <div class="comment-user-info">
          <img 
            class="user-avatar" 
            v-if="content.avatar"
            :src="baseUrl+'/images/avatar/'+content.avatar"             
            @click="linkToUser(content.userName)"
          >
          <img class="user-avatar" src="../assets/images/avatar-placeholder.svg" v-else>
          <span class="user-name" @click="linkToUser(content.userName)">
            {{content.userName}}
          </span>
        </div>
        <div class="comment-content markdown-body" v-html="content.content"></div>
        <div class="comment-bottom">
          <span class="comment-time">{{content.date}}</span>
          <span 
            class="delete-comment-wrapper" 
            v-if="content.userName === userName" 
            @click="deleteComment(content.id)"
          >
            删除
          </span>
        </div>
      </div>
    </section>	
    <span class="no-comment" v-if="commentContent.length<1 && isSignin">
      智慧如你，不想发表一点想法咩~
    </span>
  </div>
</template>

<script>
import {url,getComment,deleteComment,saveComment,getUserInfo} from '../API/fetchData.js'
import hljs from 'highlight.js'
import 'highlight.js/styles/atelier-dune-light.css'
import 'github-markdown-css'

export default {
  name: 'Comment',
  data () {
    return {
      articleId: '',
      textareaValue: '',
      checkCommentValue: false,
      commentContent: '',
      baseUrl: '',
      userName: '',
      avatar: '',
      isSignin: false
    }
  },
  methods: {
    linkToUser(userName){
      this.$router.push({name: 'User',params:{userName: userName}})
    },
    checkUserSignin(){
      getUserInfo().then((res)=>{
      // console.log(res.data)
        if(res.code===200){
          this.userName=res.data.userName
          this.avatar=res.data.avatar 
          this.isSignin=true
        }else{
          this.isSignin=false
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    saveCommentToMql(){
      if (this.textareaValue === '') {
        this.$root.tooltip('请输入评论',1)
        return
			}
      let content=this.textareaValue
      saveComment(this.userName,this.avatar,content,this.articleId).then((res)=>{
        // console.log(res)
        if(res.code==200){
          this.$root.tooltip(res.message,1)
          this.getAllComment()
          this.textareaValue=''
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    getAllComment(){
      getComment(this.articleId)
        .then((res)=>{
          // console.log(res)
          this.commentContent=res.data 
          let commentLength=this.commentContent.length
          this.$root.bus.$emit('emitCommentLength',commentLength)    
        }).catch((error)=>{
          console.log(error)
        })
    },
    deleteComment(commentId){
      deleteComment(commentId,this.userName,this.articleId).then((res)=>{
        // console.log(res)
        if(res.code===200){
          this.$root.tooltip(res.message,1)
          this.getAllComment()
        }
      }).catch(error=>{
        console.log(error)
      })
    }
  },
  created(){
    this.articleId=this.$route.params.articleId
    this.checkUserSignin()
    this.getAllComment()
  },
  mounted () {
    this.$root.bus.$on('emitGetComment',(articleId)=>{
      this.articleId=articleId
      this.getAllComment()
    })
    this.$root.bus.$on('emitSignout',()=>{
      console.log('emitSignout0')
      this.isSignin=false 
    })
    this.baseUrl=url
  }
}
</script>

<style lang="scss" scoped>
  .comment-container{
    .comment-write-wrapper{          
      display: flex;
      flex-direction: column;
      padding-left: 10px;
      .content-write{
        display: flex;
        align-items: center;        
        .user-avatar{
          margin-right: 10px;
          img{
            width: 46px;
            height: 46px;
            border-radius: 50%;
            cursor: pointer;
          }
        }
        .comment-input-content{
          width: 100%;
          resize: none;  
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 4px;
          font-size: 16px;
           margin-right: 10px;
        }
        ::placeholder{
          font-size: 14px;
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
        padding: 8px;
        color: #fff;
        background: #007fff;
        align-self: flex-end;
        margin-right: 10px;
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
        padding: 4px 10px;
        font-size: 18px;
        cursor: pointer;
      }
      .signin-comment{
        padding-left: 10px;
      }
    }
    .comment-content-wrapper{
      // border-top: 1px solid #ddd;
      margin: 20px 0;      
      .comment-wrapper{
        padding-left: 10px;
        padding-top: 20px; 
        .comment-user-info{
          display: flex;
          align-items: center;
          .user-avatar{            
            width: 46px;
            height: 46px;
            border-radius: 50%;
            cursor: pointer;
          }
          .user-name{
            font-size: 22px;
            padding-left: 10px;
            cursor: pointer;
          }
        }
        .comment-content{
          padding: 10px 0;
          font-size: 20px;
        }
        .comment-bottom{
          font-size: 14px;
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
