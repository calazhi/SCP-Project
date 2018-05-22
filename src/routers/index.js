import Vue from 'vue'
import Router from 'vue-router'
// 引入各业务模块路由数据
import demorouters from '@/views/demo/routers/index'
// 引入设备管理模块路由数据
import deviceMgmRegister from '@/views/deviceManagement/register/routers/index'
import deviceMgmStateMonitor from '@/views/deviceManagement/stateMonitor/routers/index'
import deviceMgmParamConfig from '@/views/deviceManagement/paramConfig/routers/index'
import deviceMgmFirmwareUpdate from '@/views/deviceManagement/firmwareUpdate/routers/index'
// 引入模型管理模块路由数据
import modelManagementrouters from '@/views/modelManagement/routers/index'
// 引入用户管理模块路由数据
import userMgmtrouters from '@/views/UserMgmt/login/routers/index'
// 引入主数据管理模块路由数据
import MdmApprouters from '@/views/MdmApp/routers/index'
// 引入地图应用
import MapAppRouter from '@/views/MapApp/routers/index'
// 引入访客管理
import VisitorAppRouter from '@/views/VisitorApp/routers/index'
// 引入个性化广播
import BroadcastAppRouter from '@/views/BroadcastApp/routers/index'
import userManagementRouters from '@/views/UserMgmt/userManagement/routers/index'
import AccessControlAppindex from '@/views/AccessControlApp/routers/index'
import ParkingLotAppindex from '@/views/ParkingLotApp/routers/index'
import CardMgmtAppIndex from '@/views/CardMgmtApp/routers/index'
// 引入物联网总线管理模块路由数据
import iotBusMgmt from '@/views/IotBusMgmt/routers/index'

// 引入日志服务组件路由数据
import logServiceComponentrouters from '@/views/LogServiceComponent/routers/index'
// 引入视频应用配置路由数据
import VideoGatewayAppRouters from '@/views/VideoGatewayApp/routers/index'
// 小区安全（事件应用）
import EventRouter from '@/views/EventApp/routers/index'
// 信息展示应用
import InfoAppRouter from '@/views/InformationReleaseApp/routers/index'
// 巡查应用
import PatrolAppRouter from '@/views/PatrolApp/routers/index'
// 梯控应用
import LadderAppRouter from '@/views/LadderControlApp/routers/index'
// 引入短信网关模块路由数据
import ismgAppIsmgRouters from '@/views/IsmgApp/routers/index'
// 引入可视对讲应用路由数据
import VideoIntercomRouters from '@/views/VideoIntercomApp/routers/index'
// 配置路由
Vue.use(Router)
// 定义路由实例
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: resolve =>
        require(['@/views/UserMgmt/login/Login.vue'], resolve)
    },
    {
      path: '/401',
      name: '无权访问',
      component: resolve => require(['@/components/error/page401.vue'], resolve)
    }, {
      path: '/404',
      name: '找不到页面',
      component: resolve => require(['@/components/error/page404.vue'], resolve)
    },
    {
      path: '/home',
      component: resolve => require(['@/components/main/Home.vue'], resolve),
      children: [
        {
          path: '/',
          component: resolve =>
            require(['@/components/main/Index.vue'], resolve)
        },
        ...MdmApprouters,
        ...demorouters,
        ...deviceMgmRegister,
        ...deviceMgmStateMonitor,
        ...deviceMgmParamConfig,
        ...deviceMgmFirmwareUpdate,
        ...modelManagementrouters,
        ...userMgmtrouters,
        ...userManagementRouters,
        ...EventRouter,
        ...MapAppRouter,
        ...VisitorAppRouter,
        ...BroadcastAppRouter,
        ...AccessControlAppindex,
        ...ParkingLotAppindex,
        ...CardMgmtAppIndex,
        ...InfoAppRouter,
        ...VideoGatewayAppRouters,
        ...PatrolAppRouter,
        ...LadderAppRouter,
        ...iotBusMgmt,
        ...logServiceComponentrouters,
        ...ismgAppIsmgRouters,
        ...VideoIntercomRouters
      ]
    }
  ]
})
