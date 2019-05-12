<template>
  <div class="app-wrapper">
    <div>
      <router-view class="navbar" name="navbar"></router-view>
      <router-view class="main" name="main"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
      // navHeight: ''
    }
  },
  methods:{
    getNavbarHeight(){
      let navbar=document.querySelector('.navbar')
      let main=document.querySelector('.main')
      // console.log(navbar.getBoundingClientRect())
      let navbarHeight=navbar.getBoundingClientRect().height
      main.style.marginTop=navbarHeight+'px'
      // this.navHeight = navbarHeight
    }
  },
  mounted(){
    this.getNavbarHeight()
    // if(this.navHeight){
    //   this.$root.bus.$emit('getNavHeight',this.navHeight)
    // }
  }
}
</script>

<style lang="scss" scoped> 
.navbar{
  position: fixed;
  top: 0;
  width: 100%;
} 
</style>
