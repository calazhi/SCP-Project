// 定义路由路径数组列表
export default [
  {
    path: '/laddercontrolapp/authapp',
    name: 'AuthApp',
    component: resolve => require(['@/views/LadderControlApp/AuthApp.vue'], resolve)
  },
  {
    path: '/laddercontrolapp/eventapp',
    name: 'EventApp',
    component: resolve => require(['@/views/LadderControlApp/EventApp.vue'], resolve)
  }
]
