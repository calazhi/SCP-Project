// 引用pages
import qrCodeQuery from '@/views/CardMgmtApp/QrCodeMgmt'
import queryCard from '@/views/CardMgmtApp/QueryCard'
import storeCard from '@/views/CardMgmtApp/StoreCard'
import queryCardOperate from '@/views/CardMgmtApp/QueryCardOperate'
import importOrExportCards from '@/views/CardMgmtApp/ImportOrExportCards'

// 定义路由路径数组列表
export default[
  {
    path: '/QrCodeMgmtIndex/qrCodeQuery',
    name: 'qrCodeQuery',
    component: qrCodeQuery
  },
  {
    path: '/CardMgmtAppIndex/queryCard',
    name: 'queryCard',
    component: queryCard
  },
  {
    path: '/CardMgmtAppIndex/operateLogQuery',
    name: 'queryCardOperate',
    component: queryCardOperate
  },
  {
    path: '/CardMgmtAppIndex/storeCard',
    name: 'storeCard',
    component: storeCard
  },
  {
    path: '/CardMgmtAppIndex/importOrExportCards',
    name: 'importOrExportCards',
    component: importOrExportCards
  }
]
