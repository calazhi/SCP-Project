// 引用pages
// import demoindex from '@/views/demo/index'
import AudioManager from '@/views/BroadcastApp/AudioManager'
import ActualTask from '@/views/BroadcastApp/ActualTask'
import RegularTask from '@/views/BroadcastApp/RegularTask'
import SceneManager from '@/views/BroadcastApp/SceneManager'
import BroadcastLog from '@/views/BroadcastApp/BroadcastLog'
import LinkageConfig from '@/views/BroadcastApp/LinkageConfig'
// 定义路由路径数组列表
export default [
  {
    path: '/broadcastapp/audiomanager',
    name: 'AudioManager',
    component: AudioManager
  },
  {
    path: '/broadcastapp/actualtask',
    name: 'ActualTask',
    component: ActualTask
  },
  {
    path: '/broadcastapp/regulartask',
    name: 'RegularTask',
    component: RegularTask
  },
  {
    path: '/broadcastapp/scenemanager',
    name: 'SceneManager',
    component: SceneManager
  },
  {
    path: '/broadcastapp/broadcastlog',
    name: 'BroadcastLog',
    component: BroadcastLog
  },
  {
    path: '/broadcastapp/linkageconfig',
    name: 'LinkageConfig',
    component: LinkageConfig
  }
]
