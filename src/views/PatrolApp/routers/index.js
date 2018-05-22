// 引用pages
// import demoindex from '@/views/demo/index'
import RedlineApp from '@/views/PatrolApp/RedlineApp'
// import PatrolPointApp from '@/views/PatrolApp/PatrolPointApp'
import PatrolPointMap from '@/views/PatrolApp/PatrolPointMap'
import PatrolParamApp from '@/views/PatrolApp/PatrolParamApp'
import CrewPlan from '@/views/PatrolApp/CrewPlan'
import HistoryTask from '@/views/PatrolApp/HistoryTask'
import PlanInfo from '@/views/PatrolApp/PlanInfo'
import TimeoutAlarmEvent from '@/views/PatrolApp/TimeoutAlarmEvent'
import BoundaryAlarmEvent from '@/views/PatrolApp/BoundaryAlarmEvent'
import EmergencyEvent from '@/views/PatrolApp/EmergencyEvent'
import BindDevice from '@/views/PatrolApp/BindDevice'
import DrawLine from '@/views/PatrolApp/DrawLine'

// 定义路由路径数组列表
export default [
  {
    path: '/patrolapp/redlineapp',
    name: 'RedlineApp',
    component: RedlineApp
  },
  {
    path: '/patrolapp/patrolpointapp',
    name: 'PatrolPointApp',
    component: PatrolPointMap
  },
  {
    path: '/patrolapp/patrolparamapp',
    name: 'PatrolParamApp',
    component: PatrolParamApp
  },
  {
    path: '/patrolapp/drawline',
    name: 'DrawLine',
    component: DrawLine
  },
  {
    path: '/patrolapp/crewplan',
    name: 'CrewPlan',
    component: CrewPlan
  },
  {
    path: '/patrolapp/historytask',
    name: 'HistoryTask',
    component: HistoryTask
  },
  {
    path: '/patrolapp/planinfo',
    name: 'PlanInfo',
    component: PlanInfo
  },
  {
    path: '/patrolapp/timeoutalarmevent',
    name: 'TimeoutAlarmEvent',
    component: TimeoutAlarmEvent
  },
  {
    path: '/patrolapp/boundaryalarmevent',
    name: 'BoundaryAlarmEvent',
    component: BoundaryAlarmEvent
  },
  {
    path: '/patrolapp/emergencyevent',
    name: 'EmergencyEvent',
    component: EmergencyEvent
  },
  {
    path: '/patrolapp/binddevice',
    name: 'BindDevice',
    component: BindDevice
  },
  {
    path: '/patrolapp/patrolpointmap',
    name: 'PatrolPointMap',
    component: PatrolPointMap
  }
]
