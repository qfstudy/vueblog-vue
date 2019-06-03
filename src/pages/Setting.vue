<template>
  <div class="setting-wrapper">
    <b-header class="b-header"></b-header>
    <div class="user-info-setting">
      <section class="edit-user-info">
        <span class="title-tab">个人资料</span>
        <div class="avatar-wrapper">
          <span>头像</span>          
          <img :src="avatar" v-if="avatar">
          <img src="../assets/images/avatar-placeholder.svg" v-else>
          <div class="upload-avatar">
            <input type="file" class="input-upload" @click="clickUploadAvatar($event)">
            <span class="click-upload">点击上传</span>
          </div>
        </div>
        <div class="user-name-wrapper">
          <div class="user-name">
            <span>用户名</span>
            <input type="text">
          </div>
          <div class="edit-icon">
            <svg class="icon-xiugai">
              <use xlink:href="#icon-xiugai"></use>
            </svg>
            <span>修改</span>
          </div>
        </div>
        <div class="introduction">
          <div class="user-name">
            <span>个人介绍</span>
            <input type="text">
          </div>
          <div class="edit-icon">
            <svg class="icon-xiugai">
              <use xlink:href="#icon-xiugai"></use>
            </svg>
            <span>修改</span>
          </div>
        </div>
        <div class="user-blog">
          <div class="user-name">
            <span>个人博客</span>
            <input type="text">
          </div>
          <div class="edit-icon">
            <svg class="icon-xiugai">
              <use xlink:href="#icon-xiugai"></use>
            </svg>
            <span>修改</span>
          </div>
        </div>
        <div class="user-github">
          <div class="user-name">
            <span>github</span>
            <input type="text">
          </div>
          <div class="edit-icon">
            <svg class="icon-xiugai">
              <use xlink:href="#icon-xiugai"></use>
            </svg>
            <span>修改</span>
          </div>
        </div>
        <div class="user-email">
          <div class="user-name">
            <span>email</span>
            <input type="text">
          </div>
          <div class="edit-icon">
            <svg class="icon-xiugai">
              <use xlink:href="#icon-xiugai"></use>
            </svg>
            <span>修改</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import {url,uploadAvatar} from '../API/fetchData.js'
import bHeader from './common/bHeader.vue'
export default {
  name: 'Setting',
  data(){
    return{
      userName: '',
      avatar: '',
      baseUrl: ''
    }
  },
  components:{
    bHeader
  },
  methods:{
    clickUploadAvatar(event){
      let _that=this
      console.log(event.target)
      event.target.addEventListener('change', function() {
        if(this.files.length > 0){
          let file = this.files[0]
          if(!/image/g.test(file.type)) {
            _that.$root.tooltip('请上传图片文件')
            return
          }
          let reader = new FileReader()
          if (!reader) return
          reader.onload =async function(e) {
            let imageData = e.target.result    
            //  console.log(_that.userName)         
            await uploadAvatar(_that.userName,imageData).then((res)=>{
              // console.log(res)
              if(res.code===200){
                _that.avatar=_that.baseUrl+'/images/avatar/'+res.avatar
              }
            }).catch(e=>{
              console.log(e)
              _that.$root.tooltip(e.message,2)
            })
          }
          reader.readAsDataURL(file)
        }
      }, false)
    },
    setUserInfoData(){
      let timer=setTimeout(()=>{
        this.userName=this.$store.state.userInfo.userName
        this.avatar=this.baseUrl+'/images/avatar/'+this.$store.state.userInfo.avatar
        clearTimeout(timer)
      },0)
    }
  },
  mounted(){
    this.baseUrl=url
    this.setUserInfoData()
  }
}
</script>

<style lang="scss" scoped>
  .setting-wrapper{
    background: #f4f5f5;
    height: 100%;
    .b-header{
      background: #fff;      
    }
    .user-info-setting{
      background: #fff;
      margin: 15px 100px;
      padding: 30px 50px;
      width: 60%;
      .edit-user-info{
        .title-tab{
          font-size: 22px;
          font-weight: bold;
        }
        div{
          padding: 10px 0;
          display: flex;
          justify-content: space-between;
          div.edit-icon{
            .icon-xiugai{
              width: 30px;
              height: 30px;              
            }
          }
        }
        .avatar-wrapper{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          *{
            margin: 0 10px;
          }
          img{
            width: 80px;
            height: 80px;
            border-radius: 50%;
          }
          .upload-avatar{
            display: flex;
            align-items: center;
            position: relative;
            background: #007fff;    
            width: 82px;
            .input-upload{
              height: 8px;
              width: 74px;
              opacity: 0;
              z-index: 99;              
            }
            .input-upload:focus{
              outline: none;
            }
            .click-upload{
              position: absolute;
              left: 2px;
              font-size: 14px;   
              color: #fff;                    
            }
          }
        }
      }
    }
  }
</style>
