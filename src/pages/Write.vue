<template>
  <div class="write-wrapper">
    <b-header class="blog-header"></b-header>
    <section class="write-navbar">
      <div class="title-wrapper">
        <input 
          placeholder="标题" 
          type="text" 
          class="title" 
          spellcheck="false"
          v-model="titleValue"
        >
      </div>
      <ul class="write-title-nav">
        <li class="submit" @click="saveDataToMql">发布文章</li>
        <li class="preview-submit" @click="preview">预览</li>
        <li class="write-to-homepage" @click="writeToHomepage">首页</li>
      </ul>
    </section>

    <section class="write-content" :class="{'write-preview':isPreview}">
      <div class="content-wrapper" id="textarea">
        <textarea
          @input="inputHandle" 
          class="content" 
          id="write-article" 
          spellcheck="false"
          v-model="textareaValue"
        >
        </textarea>
      </div>
      <div class="preview-wrapper">
        <div class="preview-content markdown-body"></div>
      </div> 
    </section>
  </div>
</template>

<script>
import $ from 'jquery'
import showdown from 'showdown'
import hljs from 'highlight.js'
// highlight样式 idea.css github.css
import 'highlight.js/styles/atelier-dune-light.css'
import 'github-markdown-css'
import {saveWriteData} from '../API/fetchData.js'
import bHeader from './common/bHeader.vue'

export default {
  name: 'Write',
  data(){
    return{
      isPreview: false,
      userName: '',
      avatar: '',
      titleValue: '',
      textareaValue: ''
    }
  },
  components:{
    bHeader
  },
  methods: {
    writeToHomepage(){
      this.$router.push({name: 'Homepage'})
    },
    checkSignin(){
      if(!this.userName){
        this.$root.tooltip('还没有登录，无法操作')
        this.$router.push({name: 'Homepage'})
      }
    },
    setHeight(){
      let html=document.querySelector('html')
      let body=document.querySelector('body')
      html.classList.add('hidden-overflow')
      body.classList.add('hidden-overflow')

      let navbar=document.querySelector('.write-navbar')

      let textarea = document.querySelector('.content')
      let preview = document.querySelector('.preview-wrapper')

      let bodyHeight=body.getBoundingClientRect().height
      let navbarHeight=navbar.getBoundingClientRect().height

      textarea.style.height=(bodyHeight-navbarHeight)+'px'
      preview.style.height=(bodyHeight-navbarHeight)+'px'
      // console.log(textarea.style.height,preview.style.height)
    },
    preview(){
      this.inputHandle()
      this.isPreview=!this.isPreview
    },
    inputHandle(){
      let converter = new showdown.Converter()
      let previewContent=document.querySelector('.preview-content')
      let articleConten=this.textareaValue
      previewContent.innerHTML=converter.makeHtml(articleConten).replace(/\n/gi,"<br/>")
      $('pre').each(function(i, block) {
        hljs.highlightBlock(block)
      })
    },
    
    async saveDataToMql(){
      if (!this.titleValue) {
        this.$root.tooltip('请输入标题',1)
        return
      }
      if(!this.textareaValue){
        this.$root.tooltip('请输入内容',1)
        return
      }
      await saveWriteData(this.userName,this.avatar,this.titleValue,this.textareaValue).then((res)=>{
        if(res.code===200){
          this.$root.tooltip(res.message,1)
          this.$router.push({name: 'Homepage'})
        }
      }).catch((error)=>{
        console.log(error)
        this.$root.tooltip(error.message,1)        
      })
    }
  },
  mounted(){    
    let timer=setTimeout(()=>{
      this.userName=this.$store.state.userInfo.userName
      this.avatar=this.$store.state.userInfo.avatar
      // console.log(this.userName)
      this.checkSignin()
      clearTimeout(timer)
    },0)
    hljs.initHighlightingOnLoad()
    this.setHeight() 
  }
}
</script>

<style lang="scss" scoped>
  .write-wrapper{
    .blog-header{
      display: none;
    }
    .write-navbar{
      .title-wrapper{
        display: flex;
        .title{
          height: 48px;
          padding: 0 6px;
          font-size: 20px;
          border: none;
          width: 100%;
          border-top: 1px solid #ddd;
        }
        input.title:focus {
          outline: none;
        }
      }
      .write-title-nav{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        height: 46px;
        background: #d9d9d9;
        padding-right: 10px;
        .submit{
          display: inline-block;
          margin-right: 22px;
          cursor: pointer;
        }
        .preview-submit {
          display: inline-block;
          margin-right: 30px;
          cursor: pointer;
        }
        .write-to-homepage{
          cursor: pointer;
        }
      }
    }
    .write-content{
      .content-wrapper{
        .content{
          overflow-y: auto;
          resize:none;
          width: 100%;
          border: none;
          font-size: 18px;
          color: #333333;
          padding: 10px;
        }
        .content:focus {
          outline: none;
        }
      }
    }
    .write-content .preview-wrapper{
      display: none;
    }
    .write-content.write-preview .preview-wrapper{
      display: block;
    }
    .write-content.write-preview{
      display: flex;
    }
    .write-content.write-preview .content-wrapper{
      width: 50%;
    }
    .write-content.write-preview .preview-wrapper{
      width: 50%;
      border: none;
      background: #fcfaf2;
      border-left: 1px solid #e9e9e9;
      overflow-y: auto;
      padding: 10px;
      .preview-content{
        font-size: 18px;
      }
    }
  }
</style>
