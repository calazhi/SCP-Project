// 定义路由路径数组列表
export default [
  {
    path: '/infoapp/materialapp',
    name: 'MaterialApp',
    component: resolve => require(['@/views/InformationReleaseApp/MaterialApp.vue'], resolve)
  },
  {
    path: '/infoapp/programapp',
    name: 'ProgramApp',
    component: resolve => require(['@/views/InformationReleaseApp/ProgramApp.vue'], resolve)
  },
  {
    path: '/infoapp/scheduleapp',
    name: 'ScheduleApp',
    component: resolve => require(['@/views/InformationReleaseApp/ScheduleApp.vue'], resolve)
  },
  {
    path: '/infoapp/scheduleapprelease',
    name: 'ScheduleAppRelease',
    component: resolve => require(['@/views/InformationReleaseApp/ScheduleAppRelease.vue'], resolve)
  },
  {
    path: '/infoapp/scheduleappequipment',
    name: 'ScheduleEquipment',
    component: resolve => require(['@/views/InformationReleaseApp/ScheduleEquipment.vue'], resolve)
  }
]
