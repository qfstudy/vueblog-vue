<template>
  <div class="write-wrapper">
    <section class="write-navbar">
      <div class="title-wrapper">
        <input 
          placeholder="标题" 
          type="text" 
          class="title"           
          v-model="titleValue"
        >
      </div>
      <ul class="write-title-nav">
        <li class="submit" @click="saveEditArticleToMql">保存修改</li>
        <li class="preview-submit" @click="preview">预览</li>
        <li class="edit-to-homepage" @click="editToHomepage">首页</li>
      </ul>
    </section>

    <section class="write-content" :class="{'write-preview':isPreview}">
      <div class="content-wrapper" id="textarea">
        <textarea 
          @input="inputHandle" 
          class="content" 
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
import 'highlight.js/styles/atelier-dune-light.css'
import 'github-markdown-css'
import {getEditArticle,saveEditArticle} from '../API/fetchData.js'

export default {
  name: 'Edit',
  data () {
    return {
      isPreview: false,
      titleValue: '',
      textareaValue: '',
      articleId: '',
      originalArticle: ''
    }
  },
  methods: {
    editToHomepage(){
      this.$router.push({name: 'Homepage'})
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
    async getArticleData(){
      await getEditArticle(this.articleId).then((res)=>{
        // console.log(res)
        this.originalArticle=res.data
        this.titleValue=this.originalArticle.title
        this.textareaValue=this.originalArticle.md
      }).catch((error)=>{
        console.log(error)
      })
    },

    async saveEditArticleToMql(){
      if (!this.titleValue) {
        this.$root.tooltip('请输入标题',1)
        return
      }
      if(!this.textareaValue){
        this.$root.tooltip('请输入内容',1)
        return
      }
      let title=this.titleValue
      let content=this.textareaValue
      await saveEditArticle(this.articleId,title,content)
      .then((res)=>{
        // console.log('edit response: ',res)
        if(res.code===200){
          this.$root.tooltip(res.message,1)
          this.$router.push({name: 'Article',params: { articleId: this.articleId }})
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    
  },
  created(){
    this.articleId=this.$route.params.articleId
    this.getArticleData()
  },
  mounted(){    
    this.setHeight()
  }
}
</script>

<style lang="scss" scoped>
  .write-wrapper{
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
        .edit-to-homepage{
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
