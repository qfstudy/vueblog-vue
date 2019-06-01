<template>
  <div class="sel-wrap">
    <div id="sel-show" @click="hideOrShow" class="sel-show">
      <span class="avatar-wrapper" id="sel-show">
        <img :src="avatar" id="sel-show" class="navbar-avatar" v-if="avatar&&userName">
        <img src="../../assets/images/avatar-placeholder.svg" id="sel-show" v-if="userName">        
      </span>
      <svg class="icon-select" id="sel-show">
        <use xlink:href="#icon-xiasanjiaoxing" id="sel-show"></use>
      </svg>
    </div>
    <ul id="sel-option" class="sel-option" @click="clickHideLi($event)">
      <li data-flag="user" class="item" v-if="userName">
        <svg class="icon-wo">
          <use xlink:href="#icon-wo"></use>
        </svg>
        <span>我的主页</span>
      </li>
      <li data-flag="setting" class="item" v-if="userName">
        <svg class="icon-shehzi">
          <use xlink:href="#icon-shezhi"></use>
        </svg>
        <span>设置</span>
      </li>
      <li data-flag="signout" class="item" v-if="userName">
        <svg class="icon-exit">
          <use xlink:href="#icon-exit"></use>
        </svg>
        <span>登出</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Select',
  data(){
    return{
      flag: false,
    }
  },
  props:{
    userName: '',
    avatar: ''
  },
  methods:{
     /*点击下拉框显示选项列表*/
    hideOrShow(){
      let selOption = document.getElementById('sel-option')     
      this.flag = !this.flag
      if (this.flag === true) {
        selOption.style.display = 'block'
      } else {
        selOption.style.display = 'none'
      }
    },
    /*点击选项将内容替换到下拉框中并收起下拉选项*/
    clickHideLi(e){
      let selOption = document.getElementById('sel-option')
      let ev = e || window.event
      let target = ev.target || ev.srcElement
      if (target && target.nodeName === 'LI') {
        console.dir(target.dataset.flag)
        let dataFlag=target.dataset.flag
        switch(dataFlag){
          // case 'setting':
          //   this.$root.bus.$emit('emitSetting')
          //   break
          case 'signout':
            this.$root.bus.$emit('emitSignout')
            break
        }
        selOption.style.display = 'none'
        this.flag = false
      }
    },
     /*点击屏幕其他位置，收下拉选项*/
    cllckHideList(){
      let selOption = document.getElementById('sel-option')
      let bodyEle = document.getElementsByTagName('html')[0]
      // console.log(bodyEle)
      bodyEle.onclick = function (ev) {
        // console.log(ev.target)
        let e = ev || event
        let target = e.target || e.srcElement
        if (target && target.id !== 'sel-option' && target.id !== 'sel-show' && target.className !== 'item') {
         selOption.style.display = 'none'
          this.flag = false
        } else {
          return false
        }
        if (e && e.stopPropagation) {//阻止冒泡
          e.stopPropagation()
        } else {
          window.event.cancelBubble = true
        }
      }
    }
  },
  mounted(){
    this.cllckHideList()
  }
}
</script>

<style lang="scss" scoped>
.sel-wrap {
  position: relative;
  .sel-show {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .avatar-wrapper{
      img{
        width: 42px;
        height: 42px;
        border: 1px solid #eee;
        border-radius: 50%;        
      }
    }
    .icon-select{
      width: 14px;
      height: 14px;
      fill: #71777c;
    }
  }
  .sel-option {
    display: none;
    position: absolute;
    width: 120px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #fff;
    margin-top: 5px;
    padding: 8px 0;
    left: 0;
    li {
      padding: 5px;
      font-size: 14px;
      cursor: pointer;
      display: flex;      
      padding: 6px 4px;
      span{
        color: #71777c;
        padding-left: 10px;
      }
      svg{
        width: 20px;
        height: 20px;
        fill: #71777c;
      }
    }
    li:hover {
      background-color: #ddd;
      font-size: 14px;
    }
  } 
}
</style>
