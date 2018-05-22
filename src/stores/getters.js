// import { login } from '@/views/UserMgmt/login/apis'

export default {
  getWindowHeight (state) {
    return state.windowHeight
  },
  getHeaderStatus: (state) => {
    return state.headerStatus
  },

  getUserInfo: (state) => {
    let scpUserInfoStr = sessionStorage.getItem('scpUserInfo')
    if (scpUserInfoStr !== undefined && scpUserInfoStr !== null) {
      // let qs = require('qs')
      let scpUserInfo = JSON.parse(scpUserInfoStr)
      // console.log(scpUserInfo)
      state.userinfo = scpUserInfo
    }
    return state.userinfo
  },
  getUserResourcePermission: (state) => {
    return state.userResourcePermission
  },
  getUserRouters: (state) => {
    return state.userRouters
  }
}
