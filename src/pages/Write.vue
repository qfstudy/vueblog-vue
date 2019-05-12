<template>
  <div class="write-wrapper">
    <section class="write-navbar">
      <div class="title-wrapper">
        <input placeholder="标题" type="text" class="title">
      </div>
      <ul class="write-title-nav">
        <li class="submit" @click="saveDataToMql">发布文章</li>
        <li class="preview-submit" @click="preview">预览</li>
      </ul>
    </section>

    <section class="write-content">
      <div class="content-wrapper" id="textarea">
        <textarea @input="inputHandle" class="content" id="write-article" spellcheck="false"></textarea>
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
// idea.css github.css
import 'highlight.js/styles/atelier-dune-light.css'
import 'github-markdown-css'
import axios from 'axios'
axios.defaults.withCredentials=true


export default {
  name: 'Write',
  data(){
    return{
      isPreview: true,
      isCheckInputValue: false,
      userName: '',
      n: 1
    }
  },
  methods: {
    setDivHeight(val){
      let body=document.querySelector('body')
      let writeNavbar=document.querySelector('.write-navbar')
      let titleWrapper=document.querySelector('.title-wrapper')
      let writeTtitleNav=document.querySelector('.write-title-nav')

      let writeContent=document.querySelector('.write-content')
      let previewContent=document.querySelector('.preview-content')
     
      let bodyHeight=body.getBoundingClientRect().height
      let writeNavbarHeight=writeNavbar.getBoundingClientRect().height
      let titleWrapperHeight=titleWrapper.getBoundingClientRect().height
      let writeTtitleNavHeight=writeTtitleNav.getBoundingClientRect().height
      // console.log('888888888888')
      // console.log(titleWrapperHeight)
      // console.log(writeTtitleNavHeight)
      // console.log(writeNavbarHeight)
      // console.log(bodyHeight)
      // console.log(val)
      // console.log('888888888888')
      writeContent.style.height=(bodyHeight-titleWrapperHeight-writeTtitleNavHeight-val)+'px'
      previewContent.style.height=(bodyHeight-titleWrapperHeight-writeTtitleNavHeight-val)+'px'
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
        this.$root.tooltip('请输入标题')
        this.isCheckInputValue=false
        return
      }
      if(document.getElementById('write-article').value.trim()===''){
        this.$root.tooltip('请输入内容')
        this.isCheckInputValue=false
        return
      }
      this.isCheckInputValue=true
    },
    saveDataToMql(){
      this.checkInputValue()
      if(!this.isCheckInputValue){
        return
      }
      axios.post('http://localhost:3000/write',{
        title: document.querySelector('.title').value,
        content: document.getElementById('write-article').value
      }).then((response)=>{
        // console.log('write response'+response)
        let res=response.data
        if(res.code===200){
          this.$root.tooltip(res.message)
        }
        if(res.code==400){
          this.$root.tooltip(res.message)
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    checkWriteLogin(){
      axios.post('http://localhost:3000/writecheck',{
          userName: this.userName
        })
        .then((response)=>{
          // console.log(response)
          let res=response.data
          if(res.code!==200){
            this.$root.tooltip(res.message)
            let timer = setTimeout(()=>{
              this.$router.push({name: 'Signin'})
              clearTimeout(timer)
            },2000)
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
          this.checkWriteLogin()
          clearInterval(timer)
        }
        this.n++
      },50)
    },
    eventBusFn(){
      this.$root.bus.$on('getNavHeight',(val)=>{
        this.navHeight=val
        this.setDivHeight(val)
      })       
    },
  },
  mounted(){
    hljs.initHighlightingOnLoad()
    this.eventBusFn() 
    this.setUserName()
  }
}
</script>

<style lang="scss">
  // @import "../assets/css/github.css";

  html,body{
    height: 100%;
    overflow-y: hidden;
  }
  .write-wrapper{
    overflow-y: hidden;
    // height: 100%;
    .write-navbar{
      .title-wrapper{
        display: flex;
        .title{
          height: 48px;
          padding: 0 6px;
          font-size: 20px;
          border: none;
          width: 100%;
          // border-top: 1px solid #ddd;
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
      // height: 100%;
      .content-wrapper{
        display: flex;
        height: 100%;
        border-bottom: 1px solid #d9d9d9;
        .content{
          resize: none;
          width: 100%;
          // height: 100%;
          border-color: transparent;
          color: #333;
          font-size: 18px;
          font-weight: 400;
          padding: 30px 38px;
          padding-bottom: 60px;
          word-wrap: break-word;
          word-break: break-all;
          overflow-y: auto;
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
      border-bottom: 1px solid #d9d9d9;
      background: #ffff;
    }
    .write-content.write-preview .preview-wrapper{
      width: 50%;
      border-color: transparent;
      color: #333;
      font-size: 18px;
      padding: 30px 38px;
      padding-bottom: 60px;
      // height: 83%;
      background: #fcfaf2;
      border-left: 1px solid #e9e9e9;
      overflow: auto;
      border-bottom: 1px solid #d9d9d9;
    }
  }
</style>
