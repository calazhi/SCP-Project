// 引用pages
// import demoindex from '@/views/demo/index'
import deviceGroupMgmt from '@/views/AccessControlApp/components/DeviceGroupMgmt'
import auth from '@/views/AccessControlApp/components/Auth'
import sendDownRecord from '@/views/AccessControlApp/components/sendDownRecordMgmt'
import entryAndExitRecord from '@/views/AccessControlApp/components/EntryAnExitRecord'

// 定义路由路径数组列表
export default[
  {
    path: '/accesscontrolapp/deviceGroupMgmt',
    name: 'deviceGroupMgmt',
    component: deviceGroupMgmt
  },
  {
    path: '/accesscontrolapp/auth',
    name: 'auth',
    component: auth
  },
  {
    path: '/accesscontrolapp/sendDownRecordMgmt',
    name: 'sendDownRecordMgmt',
    component: sendDownRecord
  },
  {
    path: '/accesscontrolapp/entryAndExitRecord',
    name: 'entryAndExitRecord',
    component: entryAndExitRecord
  }
]
