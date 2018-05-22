import Vue from 'vue'
import Router from 'vue-router'
// 路由文件，引用各业务模块路由
// 引入各业务模块路由数据
import demorouters from '@/views/demo/routers/index'
// 引入设备管理模块路由数据
import deviceManagementrouters from '@/views/deviceManagement/routers/index'
// 引入用户管理模块路由数据
import userMgmtrouters from '@/views/UserMgmt/login/routers/index'
import userManagementRouters from '@/views/UserMgmt/userManagement/routers/index'
// 引用pages
import demoindex1 from '@/views/demo/index1'

// 配置路由
Vue.use(Router)
// 定义路由实例
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'demoindex1',
      component: demoindex1
    },
    {
      path: '/index1',
      name: 'index1',
      component: demoindex1
    },
    ...demorouters,
    ...deviceManagementrouters,
    ...userMgmtrouters,
    ...userManagementRouters
  ]
})
