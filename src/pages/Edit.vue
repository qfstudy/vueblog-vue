<template>
  <div class="write-wrapper">
    <section class="write-navbar">
      <div class="title-wrapper">
        <input 
          placeholder="标题" 
          type="text" class="title" 
          :value="originalArticle.title"
        >
      </div>
      <ul class="write-title-nav">
        <li class="submit" @click="saveEditArticleToMql">保存修改</li>
        <li class="preview-submit" @click="preview">预览</li>
        <li class="edit-to-homepage" @click="editToHomepage">首页</li>
      </ul>
    </section>

    <section class="write-content">
      <div class="content-wrapper" id="textarea">
        <textarea 
          @input="inputHandle" 
          class="content" 
          id="write-article" 
          spellcheck="false" 
          :value="originalArticle.md"
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
import axios from 'axios'
axios.defaults.withCredentials=true

export default {
  name: 'Edit',
  data () {
    return {
      isPreview: true,
      // articleId: '',
      originalArticle: ''
    }
  },
  methods: {
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
    getArticleData(){
      axios.get('http://localhost:3000/edit',{
        params: {
          articleId: this.$route.params.articleId
        }
      })
      .then((response)=>{
        // console.log(response.data)
        this.originalArticle=response.data.article
      })
    },
    preview(){
      if(this.isPreview){
        $('.write-content').addClass('write-preview')      
      }else{
        $('.write-content').removeClass('write-preview')
      }
      this.inputHandle()
      this.isPreview=!this.isPreview
    },
    inputHandle(){
      let converter = new showdown.Converter()
      let previewContent=document.querySelector('.preview-content')
      let articleConten=document.getElementById('write-article').value
      previewContent.innerHTML=converter.makeHtml(articleConten).replace(/\n/gi,"<br/>")
      $('pre').each(function(i, block) {
        hljs.highlightBlock(block)
      })
    },
    checkInputValue(){
      if ($('.title').val().trim() === '') {
        this.$root.tooltip('请输入标题',1)
        this.isCheckInputValue=false
        return
      }
      if(document.getElementById('write-article').value.trim()===''){
        this.$root.tooltip('请输入内容',1)
        this.isCheckInputValue=false
        return
      }
      this.isCheckInputValue=true
    },
    saveEditArticleToMql(){
      this.checkInputValue()
      if(!this.isCheckInputValue){
        return
      }
      axios.post('http://localhost:3000/edit',{
        articleId: this.$route.params.articleId,
        title: document.querySelector('.title').value,
        content: document.getElementById('write-article').value
      }).then((response)=>{
        console.log('edit response'+response)
        let res=response.data
        if(res.code===200){
          this.$root.tooltip(res.message,1)
          this.$router.push({name: 'Article',params: { articleId: this.$route.params.articleId }})
        }else{
          this.$root.tooltip(res.message,1)
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    editToHomepage(){
      this.$router.push({name: 'Homepage'})
    }
  },
  mounted(){
    this.getArticleData()
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
