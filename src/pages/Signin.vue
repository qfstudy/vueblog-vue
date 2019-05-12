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
import axios from 'axios'
axios.defaults.withCredentials=true

export default {
  name: 'Signin',
  data(){
    return{
      userName: '',
      n: 1
    }
  },
  methods:{
    keyupEvent(){
      let that=this
      $('body').keyup(function(e){
        if(e.keyCode===13){
          that.checkInputValue()
        }
      })
    },

    checkInputValue(){
      if ($('.user-name').val().trim() === '' || $('.password').val().trim() === '' ) {
        this.$root.tooltip('请输入用户名或密码')
        return
      }
      this.postUserData()
    },

    postUserData(){
      axios.post('http://localhost:3000/signin',{
          name: $('.user-name').val().trim(),
          password: $('.password').val().trim(),
        })
        .then((response)=>{
          let res=response.data
          if(res.code===200){
            this.$root.tooltip(res.message)
            $('.user-name').val('') 
            $('.password').val('')
            this.$root.bus.$emit('emitSetUserName')
            this.$router.push({name: 'Homepage'})
          }
          if(res.code===500){
            this.$root.tooltip(res.message)
          }
        })
        .catch(function(error){
          console.log(error)
        })
    },
    setUserName(){
      let timer=setInterval(()=>{
        this.userName=this.$store.state.userName
        this.cookieValue=this.$store.state.cookieValue
        if((this.userName && this.cookieValue) || this.n>10){
          console.log('this.userNamennn+write: '+this.userName,this.n)
          this.checkLogin()
          this.n=1
          clearInterval(timer)
        }
        this.n++
      },50)
    },
    checkLogin(){
      if(this.userName){
        this.$router.push({name: 'Homepage'})
      }
    },
    eventBusFn(){
      this.$root.bus.$emit('emitSetUserName')
    }
  },
  mounted(){
    this.keyupEvent()
    this.setUserName()
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
    .signin-main{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 100px;
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
