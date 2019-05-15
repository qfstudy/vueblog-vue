<template>
  <div class="app-wrapper">
    <div>
      <router-view :key="$route.fullpath" class="navbar" name="navbar"></router-view>
      <router-view class="main" name="main"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss" scoped> 
  .navbar{
    position: fixed;
    top: 0;
    width: 100%;
  } 
</style>
