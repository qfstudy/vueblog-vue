import * as type from './mutation-types.js'

export default {
  [type.ADD_USER_INFO](state,userinfo){
    state.userInfo=userinfo
  },
  [type.GET_BHEADER_HEIGHT](state,bHeaderHeight){
    state.bHeaderHeight=bHeaderHeight
  }
}