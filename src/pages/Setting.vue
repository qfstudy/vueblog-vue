<template>
  <div class="setting-wrapper">
    <b-header class="b-header"></b-header>
    <div class="user-info-setting">
      <section class="edit-user-info">
        <span class="title-tab">{{userName}}个人资料</span>
        <div class="avatar-wrapper">
          <span>头像</span>          
          <img :src="baseUrl+'/images/avatar/'+avatar" v-if="avatar">
          <img src="../assets/images/avatar-placeholder.svg" v-else>
          <div class="upload-avatar">
            <input type="file" class="input-upload" @click="clickUploadAvatar($event)">
            <span class="click-upload">点击上传</span>
          </div>
        </div>
      </section>
      <section class="user-info-wrapper">
        <div class="user-blog">
          <span>个人博客</span>
          <input v-model="inputBlogValue" type="text" spellcheck="false" placeholder="填写你的博客">
        </div>
        <div class="user-github">          
          <span>github</span>
          <input v-model="inputGithubValue" type="text" spellcheck="false" placeholder="填写你的github">          
        </div>
        <div class="user-email">          
          <span>email</span>
          <input v-model="inputEmailValue" type="text" spellcheck="false" placeholder="填写你的email">          
        </div>
        <span class="save-user-info" @click="saveUserInfo">保存</span>
      </section>
     
    </div>
  </div>
</template>

<script>
import {url,uploadAvatar,getUserInfo,saveUserInfo} from '../API/fetchData.js'
import bHeader from './common/bHeader.vue'
export default {
  name: 'Setting',
  data(){
    return{
      // ss: false,
      userName: '',
      avatar: '',
      baseUrl: '',
      inputUserName: '',
      inputBlogValue: '',
      inputGithubValue: '',
      inputEmailValue: ''
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
                _that.avatar=res.avatar
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
    getUserInfo(){
      getUserInfo(this.userName).then((res)=>{
        console.log(res)
        this.inputUserName=res.data.userName
        this.inputBlogValue=res.data.blog
        this.inputGithubValue=res.data.github
        this.inputEmailValue=res.data.email
      })
    },
    saveUserInfo(){
      let github=this.inputGithubValue
      let blog=this.inputBlogValue
      let email=this.inputEmailValue
      saveUserInfo(this.avatar,github,blog,email,this.userName,).then(res=>{
        // console.log(res)
        if(res.code===200){
          this.$router.push({name: 'User',params: { userName: this.userName}})
        }
      })
    },
    setUserInfoData(){
      let timer=setTimeout(()=>{
        this.userName=this.$store.state.userInfo.userName
        this.avatar=this.$store.state.userInfo.avatar
        this.getUserInfo()
        this.checkSignin()
        clearTimeout(timer)
      },0)
    },
    checkSignin(){
      if(!this.userName){
        this.$router.push({name: 'Signin'})
      }
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
        border-bottom: 1px solid #ddd;
        .title-tab{
          font-size: 22px;
          font-weight: bold;
        }
        div{
          padding: 10px 0;
          display: flex;
          justify-content: space-between;
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
      .user-info-wrapper{
        display: flex;
        flex-direction: column;
        padding: 10px 0;
        .user-blog{
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #ddd;
          span{
            min-width: 20%;
          }
          input{
            padding: 6px 6px;
            width: 80%;
            border: none;
          }
          input:focus{
            outline: none;
          }
        }
        .user-github{
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #ddd;
          span{
            min-width: 20%;
          }
          input{
            padding: 6px 6px;
            width: 80%;
            border: none;
          }
          input:focus{
            outline: none;
          }
        }
        .user-email{
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #ddd;
          span{
            min-width: 20%;
          }
          input{
            padding: 6px 6px;
            width: 80%;
            border: none;
          }
          input:focus{
            outline: none;
          }
        }
        .save-user-info{
          padding: 6px 12px;
          background: #007fff;
          align-self: flex-end;
          margin-top: 10px;
          border-radius: 5px;
          color: #fff;
        }
      }
      
    }
  }
</style>
