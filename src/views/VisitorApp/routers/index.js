// 引用pages
import VisitorManage from '@/views/VisitorApp/VisitorManage'
import PropertyManage from '@/views/VisitorApp/PropertyManage'

// 定义路由路径数组列表
export default [
  {
    path: '/visitorapp/visitorapp',
    name: 'VisitorManage',
    component: VisitorManage
  },
  {
    path: '/visitorapp/propertyapp',
    name: 'PropertyManage',
    component: PropertyManage
  }
]
