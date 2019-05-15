<template>
  <div class="signup-wrapper">
		<div class="signup-content">
      <input class="user-name" type="text" placeholder="用户名"/>
      <input class="password" type="password" placeholder="请输入密码" />
      <input class="confirm-password" type="password" placeholder="请确认密码"/>
			<div class="avatar-wrapper">
				<div class="avatar">
          <span>上传头像</span>
          <input class="upload-avatar" @change="uploadAvatar" type="file" name="avatar" ref="uploadAvatar">
        </div>
        <div>
          <img class="preview-avatar" alt="图像预览" src="../assets/images/avatar-placeholder.png">
        </div>
			</div>
      <span class="submit" @click="checkInputValue">注册</span>
		</div>
	</div>
</template>

<script>
import $ from 'jquery'
import {signup} from '../API/fetchData.js'

export default {
  name: 'Register',
  data(){
    return{
      userName: '',
      password: '',
      avatar: ''
    }
  },
  methods:{
    keyupEvent(){
      let that=this
      $('.signup-content').keyup(function(e){
        if(e.keyCode===13){
          that.checkInputValue()
        }
      })
    },
    
    uploadAvatar(){
      let uploadAvatar=this.$refs.uploadAvatar
      let	fileReader = new FileReader()
      let file = uploadAvatar.files[0]
      // console.log(file)
      if(file.size>2048000){
        this.$root.tooltip('上传的图片要小于1.8MB!',1)
        return
      }
      if (uploadAvatar.files.length === 0 || !fileReader) {
        return
      }

      if (!/image/g.test(file.type)) {
        this.$root.tooltip('请上传图片文件!',1)
        $('.preview-avatar').attr('src', '')
        $('.preview-avatar').fadeOut()
        return 
      }

      fileReader.onload = function (e) {
        this.value = ''
        $('.preview-avatar').attr('src', e.target.result)
        $('.preview-avatar').fadeIn()
      }
      fileReader.readAsDataURL(file)
    },

    checkInputValue(){
      if ($('.user-name').val().trim() === '') {
        this.$root.tooltip('请输入用户名',2)
      }else if($('.user-name').val().match(/[<'">]/g)){
        this.$root.tooltip('请输入合法字符',2)
      }else if(($('.password').val().trim() === '')){
        this.$root.tooltip('请输入密码',2)
      }else if(($('.confirm-password').val().trim() === '')){
        this.$root.tooltip('请确认密码',2)
      }else if($('.password').val().trim()!==$('.confirm-password').val().trim()){
        this.$root.tooltip('两次输入的密码不一致',2)
      }else if(!this.$refs.uploadAvatar.files[0]){
        this.$root.tooltip('请上传头像',2)
      }else{
        this.userName=$('.user-name').val().trim()
        this.password=$('.password').val().trim()
        this.avatar=$('.preview-avatar')[0].src.trim()
        this.postUserData()
      }
    },

    async postUserData(){
      await signup(this.userName,this.password,this.avatar)
        .then((res)=>{
          if(res.code===200){
            this.$root.tooltip(res.message,1)
            $('.user-name').val('')
            $('.password').val('')
            $('.confirm-password').val('')
            this.$router.push({name: 'Signin'})
          }else{
            this.$root.tooltip(res.message,1)
          }
        }).catch(function(error){
          console.log(error)
        })
    }
  },
  mounted(){
    this.keyupEvent()
  }
}
</script>

<style lang="scss" scoped>
  .signup-wrapper{
    border: 1px solid #ddd;
    width: 320px;
    margin: 66px auto;
    background: #fff;
    box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.1);
    height: 500px;
    margin-top: 100px;
    .signup-content{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 80px;
      >input{
        border: 1px solid #ddd;
        border-radius: 5px;
        width: 80%;
        height: 46px;
        padding: 0px 2px;
        margin: 2px 0;
      }
      >input:focus{
        outline: none;
      }
      .avatar-wrapper{
        display: flex;
        align-items: center;
        .avatar{
          position: relative;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 8px 10px;
          cursor: pointer;
          .upload-avatar{
            position: absolute;
            right: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
          }
        }
        .preview-avatar{
          width: 56px;
          height: 56px;
          border-radius: 50%;
          margin: 10px;
        }
      }
      .submit{
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 6px 22px;
        cursor: pointer;
      }
    } 
  }
</style>

