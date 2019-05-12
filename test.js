checkLogin(){
  axios.post('http://localhost:3000/checklogin',{
    cookieValue: this.cookieValue
  })
    .then((response)=>{
      // console.log(response)
      let res=response.data
      if(res.code === 200){
        this.isLogin=true
        this.userName=res.userName
        this.$root.bus.$emit('saveUserName',this.userName)
        this.$root.bus.$emit('getNavHeight',this.navHeight)
      }else{
        this.$root.tooltip(res.message)        
        this.isLogin=false
      }
    })
},

getCookie(){
  console.log('document.cookie0: '+document.cookie)
  let cookieStr,n=1
  let timer=setInterval(() => {
    let cookieVal=document.cookie
    cookieStr=cookieVal.split('=')
    if(cookieStr.length>1 && cookieStr[1] || n>10){
      this.cookieValue=cookieStr[1]
      console.log('document.cookie: '+document.cookie)
      this.checkLogin()
      clearInterval(timer)
    }
    n++
    console.log(n)
  }, 50);
},

eventBusFn(){
  // this.$root.bus.$on('saveUserName',(username)=>{
  //   console.log('navbar $on saveUserName: '+username)        
  // })
  this.$root.bus.$on('emitGetCookie',()=>{        
    this.getCookie()          
  }) 
}