// 引用pages
import appMgmt from '@/views/IotBusMgmt/components/AppMgmt'
import eventGroupMgmt from '@/views/IotBusMgmt/components/EventGroupMgmt'
import argMgmt from '@/views/IotBusMgmt/components/ArgMgmt'
import busMonitor from '@/views/IotBusMgmt/components/BusMonitor'
// import eventMgmt from '@/views/IotBusMgmt/components/EventMgmt'
import subMgmt from '@/views/IotBusMgmt/components/SubMgmt'

// 定义路由路径数组列表
export default[
  {
    path: '/iotbusmgmt/appmgmt',
    name: '应用管理',
    component: appMgmt
  },
  {
    path: '/iotbusmgmt/eventgroupmgmt',
    name: '事件组管理',
    component: eventGroupMgmt
  },
  // {
  //   path: '/iotbusmgmt/eventmgmt',
  //   name: '事件管理',
  //   component: eventMgmt
  // },
  {
    path: '/iotbusmgmt/submgmt',
    name: '订阅管理',
    component: subMgmt
  },
  {
    path: '/iotbusmgmt/argmgmt',
    name: '参数配置',
    component: argMgmt
  },
  {
    path: '/iotbusmgmt/busmonitor',
    name: '总线监控',
    component: busMonitor
  }
]
