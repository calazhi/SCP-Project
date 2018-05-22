import Axios from '@/assets/js/AxiosPlugin'
// import {MOCK_API_URL} from '../assets/js/common'

const BASE_PATH = '/scp-iotbusconsoleapp'

// 获取IOT应用信息列表分页
export const getArgItems = (data) => {
  return Axios.get(BASE_PATH + '/mi/list', data).then(res => res.data)
}

// 修改IOT应用基本信息
export const updateArgItem = (data) => {
  return Axios.post(BASE_PATH + '/mi/update', data).then(res => res.data)
}

// 获取监控任务开启状态
export const getMonitorStatus = (data) => {
  return Axios.get(BASE_PATH + '/monitor/getMonitorJob', data).then(res => res.data)
}

// 开启监控任务
export const enableMonitorJob = (data) => {
  return Axios.get(BASE_PATH + '/monitor/enableMonitorJob', data).then(res => res.data)
}

// 关闭监控任务
export const disableMonitorJob = (data) => {
  return Axios.get(BASE_PATH + '/monitor/disableMonitorJob', data).then(res => res.data)
}

// 同步缓存
export const syncCache = (data) => {
  return Axios.get(BASE_PATH + '/common/cachesync', data).then(res => res.data)
}

// 同步配置
export const syncConfig = (data) => {
  return Axios.get(BASE_PATH + '/common/configsync', data).then(res => res.data)
}

// 清理IOT死信队列
export const dumpDeadLog = any => {
  return Axios.get(BASE_PATH + '/common/deadletterdump').then(res => res.data)
}
