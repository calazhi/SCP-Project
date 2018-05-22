import Axios from '@/assets/js/AxiosPlugin'
import {BASE_PATH} from '../assets/js/common'

// const BASE_PATH = '/scp-iotbusconsoleapp'

// 获取IOT应用信息列表
export const getAppList = params => {
  return Axios.get(BASE_PATH + '/app/list').then(res => res.data)
}
// 获取IOT应用相关实时监控信息
export const getAppTimelyData = params => {
  return Axios.get(BASE_PATH + '/monitor/listRealTimeData', {params: params}).then(res => res.data)
}

// 获取IOT应用相关历史监控信息
export const getAppHistoryData = params => {
  return Axios.get(BASE_PATH + '/monitor/listHistoryData', {params: params}).then(res => res.data)
}
// 获取IOT应用相关历史告警信息
export const getAppAlertData = params => {
  return Axios.get(BASE_PATH + '/monitor/listMonitorAlertPage', {params: params}).then(res => res.data)
}
// 获取IOT应用名称信息
export const getAppNameByCode = params => {
  return Axios.get(BASE_PATH + '/app/get', {params: params}).then(res => res.data)
}
