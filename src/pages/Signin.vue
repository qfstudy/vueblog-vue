<template>
  <div class="signin-wrapper">
		<div class="signin-main">
      <input type="text" placeholder="用户名" class="user-name"/>
      <input type="password" placeholder="密码" class="password"/>
			<span class="submit" @click="checkInputValue">登录</span>
		</div>		
	</div>
</template>

<script>
import $ from 'jquery'
import {signin} from '../API/fetchData.js'

export default {
  name: 'Signin',
  data(){
    return{
      userName: '',
      password: '',
    }
  },
  methods:{
    keyupEvent(){
      let that=this
      $('.signin-main').keyup(function(e){
        if(e.keyCode===13){
          that.checkInputValue()
        }
      })
    },

    checkInputValue(){
      if ($('.user-name').val().trim() === '' || $('.password').val().trim() === '' ) {
        this.$root.tooltip('请输入用户名或密码',1)
        return
      }
      this.userName=$('.user-name').val().trim()
      this.password=$('.password').val().trim()
      this.userSignin()
      
    },

    async userSignin(){
      await signin(this.userName,this.password).then((res)=>{
        if(res.code===200){
          this.$root.tooltip(res.message,1)
          $('.user-name').val('') 
          $('.password').val('')
          this.$root.bus.$emit('emitCheckLogin')
          this.$router.push({name: 'Homepage'})
        }else{
          this.$root.tooltip(res.message,1)
        }
      }).catch((error)=>{
        console.log(error)
        this.$root.tooltip(error.message,1)
      })
    }
  },
  mounted(){    
    this.keyupEvent()
  }
}
</script>

<style lang="scss" scoped>
  .signin-wrapper{
    border: 1px solid #ddd;
    width: 320px;
    margin: 66px auto;
    background: #fff;
    box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.1);
    height: 500px;
    margin-top: 100px;
    .signin-main{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 150px;
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
      .submit{
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 6px 22px;
        margin-top: 20px;
        cursor: pointer;
      }
    } 
  }
</style>
