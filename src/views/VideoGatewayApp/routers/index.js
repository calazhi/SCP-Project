export default [
  {
    path: '/videogatewayapp/videooption',
    name: 'videoOption',
    component: resolve => require(['@/views/VideoGatewayApp/VideoOption.vue'], resolve)
  },
  {
    path: '/videogatewayapp/videotapetemplate',
    name: 'videotapeTemplate',
    component: resolve => require(['@/views/VideoGatewayApp/VideotapeTemplate.vue'], resolve)
  },
  {
    path: '/videogatewayapp/videotapeplan',
    name: 'videotapePlan',
    component: resolve => require(['@/views/VideoGatewayApp/VideotapePlan.vue'], resolve)
  },
  {
    path: '/videogatewayapp/customgroup',
    name: 'customGroup',
    component: resolve => require(['@/views/VideoGatewayApp/CustomGroup.vue'], resolve)
  },
  {
    path: '/videogatewayapp/videodevice',
    name: 'videoDevice',
    component: resolve => require(['@/views/VideoGatewayApp/VideoDevice.vue'], resolve)
  },
  {
    path: '/videogatewayapp/videoservice',
    name: 'videoService',
    component: resolve => require(['@/views/VideoGatewayApp/VideoService.vue'], resolve)
  },
  {
    path: '/videogatewayapp/cameraoption',
    name: 'cameraOption',
    component: resolve => require(['@/views/VideoGatewayApp/CameraOption.vue'], resolve)
  },
  {
    path: '/videogatewayapp/hostoption',
    name: 'hostOption',
    component: resolve => require(['@/views/VideoGatewayApp/HostOption.vue'], resolve)
  },
  {
    path: '/videogatewayapp/screenoption',
    name: 'hostOption',
    component: resolve => require(['@/views/VideoGatewayApp/ScreenOption.vue'], resolve)
  },
  {
    path: '/videogatewayapp/cameraposition',
    name: 'hostOption',
    component: resolve => require(['@/views/VideoGatewayApp/CameraPosition.vue'], resolve)
  },
  {
    path: '/videogatewayapp/deviceoption',
    name: 'deviceOption',
    component: resolve => require(['@/views/VideoGatewayApp/DeviceOption.vue'], resolve)
  }
]
