import * as type from './mutation-types.js'

export default {
  [type.ADD_USER_INFO](state,userinfo){
    state.userInfo=userinfo
  }
}