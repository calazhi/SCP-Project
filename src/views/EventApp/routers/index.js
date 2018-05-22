// 定义路由路径数组列表
export default [
  {
    path: '/eventapp/eventlogapp',
    name: 'EventLogApp',
    component: resolve => require(['@/views/EventApp/EventLogApp.vue'], resolve)
  },
  {
    path: '/eventapp/linkageruleapp',
    name: 'LinkageRuleApp',
    component: resolve => require(['@/views/EventApp/LinkageRuleApp.vue'], resolve)
  },
  {
    path: '/eventapp/deletewarningevent',
    name: 'DeleteWarningEvent',
    component: resolve => require(['@/views/EventApp/DeleteWarningEvent.vue'], resolve)
  }
]
