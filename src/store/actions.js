export default {
  addUserInfo({commit},userinfo){
    commit('ADD_USER_INFO',userinfo)
  },
  addbHeaderHeight({commit},bHeaderHeight){
    commit('GET_BHEADER_HEIGHT',bHeaderHeight)
  }
}