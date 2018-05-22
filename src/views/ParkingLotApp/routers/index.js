// 引用pages
import carMgmt from '@/views/ParkingLotApp/components/CarMgmt'
import ruleMgmt from '@/views/ParkingLotApp/components/RuleMgmt'
import parkMgmt from '@/views/ParkingLotApp/components/ParkMgmt'
import parkSeatMgmt from '@/views/ParkingLotApp/components/ParkSeatMgmt'
import parkAuthMgmt from '@/views/ParkingLotApp/components/AuthMgmt'
import feeMgmt from '@/views/ParkingLotApp/components/FeeMgmt'
import inoutControl from '@/views/ParkingLotApp/components/InoutControl'
import carInRecord from '@/views/ParkingLotApp/components/CarInRecord'
import outRecord from '@/views/ParkingLotApp/components/OutRecord'
import parkSysConfig from '@/views/ParkingLotApp/components/ParkSysConfig'
import tempCardAuth from '@/views/ParkingLotApp/components/TempCardAuth'
import barrierGate from '@/views/ParkingLotApp/components/BarrierGate'
import sysCodeMgmt from '@/views/ParkingLotApp/components/SysCodeMgmt'
import payCount from '@/views/ParkingLotApp/components/PayCount'

// 定义路由路径数组列表
export default[
  {
    path: '/parkinglotapp/carmgmt',
    name: 'carMgmt',
    component: carMgmt
  },
  {
    path: '/parkinglotapp/rulemgmt',
    name: 'ruleMgmt',
    component: ruleMgmt
  },
  {
    path: '/parkinglotapp/parkmgmt',
    name: 'parkMgmt',
    component: parkMgmt
  },
  {
    path: '/parkinglotapp/parkseatmgmt',
    name: 'parkSeatMgmt',
    component: parkSeatMgmt
  },
  {
    path: '/parkinglotapp/parkauthmgmt',
    name: 'parkAuthMgmt',
    component: parkAuthMgmt
  },
  {
    path: '/parkinglotapp/feemgmt',
    name: 'feeMgmt',
    component: feeMgmt
  },
  {
    path: '/parkinglotapp/inoutcontrol',
    name: 'inoutControl',
    component: inoutControl
  },
  {
    path: '/parkinglotapp/carInRecord',
    name: 'carInRecord',
    component: carInRecord
  },
  {
    path: '/parkinglotapp/outRecord',
    name: 'outRecord',
    component: outRecord
  },
  {
    path: '/parkinglotapp/parksysconfig',
    name: 'parkSysConfig',
    component: parkSysConfig
  },
  {
    path: '/parkinglotapp/tempcardauth',
    name: 'tempCardAuth',
    component: tempCardAuth
  },
  {
    path: '/parkinglotapp/barriergate',
    name: 'barrierGate',
    component: barrierGate
  },
  {
    path: '/parkinglotapp/syscodemgmt',
    name: 'sysCodeMgmt',
    component: sysCodeMgmt
  },
  {
    path: '/parkinglotapp/payCount',
    name: 'payCount',
    component: payCount
  }
]
