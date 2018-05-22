import Vue from 'vue'
import Router from 'vue-router'
import MapConfig from '@/views/MapApp/MapConfig'
import SceneManager from '@/views/MapApp/SceneManager'
import BusinessManager from '@/views/MapApp/BusinessManager'
import ParkingManager from '@/views/MapApp/ParkingManager'
// import FenceManager from '@/views/MapApp/FenceManager'
import BatchManager from '@/views/MapApp/BatchManager'

Vue.use(Router)
// 定义路由路径数组列表
export default [
  {
    path: '/MapApp/MapConfig',
    name: 'MapConfig',
    component: MapConfig
  },
  {
    path: '/MapApp/SceneManager',
    name: 'SceneManager',
    component: SceneManager
  },
  {
    path: '/MapApp/BusinessManager',
    name: 'BusinessManager',
    component: BusinessManager
  },
  {
    path: '/MapApp/ParkingManager',
    name: 'ParkingManager',
    component: ParkingManager
  },
  // {
  //   path: '/MapApp/FenceManager',
  //   name: 'FenceManager',
  //   component: FenceManager
  // },
  {
    path: '/MapApp/BatchManager',
    name: 'BatchManager',
    component: BatchManager
  }
]
