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
    }
  },
  methods:{
    getNavbarHeight(){
      let navbar=document.querySelector('.navbar')
      let main=document.querySelector('.main')
      let navbarHeight=navbar.getBoundingClientRect().height
      main.style.marginTop=navbarHeight+'px'
    }
  },
  // mounted(){
  //   this.getNavbarHeight()
  // },
  // updated () {
  //   this.getNavbarHeight()
  // }
}
</script>

<style lang="scss" scoped> 
  .navbar{
    position: fixed;
    top: 0;
    width: 100%;
  } 
</style>
