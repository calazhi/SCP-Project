
import Axios from '@/assets/js/AxiosPlugin'
import {BASE_PATH} from '../assets/js/common'
// const BASE_PATH = '/scp-iotbusconsoleapp'

// 添加订阅
export const addIotBusSub = (data) => {
  return Axios.post(BASE_PATH + '/subs/insert', data).then(res => res.data)
}

// 获取IOT订阅列表分页
export const getIotBusSubListPage = params => {
  return Axios.get(BASE_PATH + '/subs/list', {params: params}).then(res => res.data)
}

// 修改订阅基本信息
export const editIotBusSub = (data) => {
  return Axios.post(BASE_PATH + '/subs/update', data).then(res => res.data)
}
// 删除订阅
// export const deleteIotBusSubById = params => {
//   return Axios.post(BASE_PATH + '/subs/delete' + '?key=' + params.key).then(res => res.data)
// }

// export const deleteIotBusSubById = params => {
//   return Axios.post(BASE_PATH + '/subs/delete', {params: params}).then(res => res.data)
// }

// 获取IOT应用信息列表分页
export const getIotBusAppList = params => {
  return Axios.get(BASE_PATH + '/app/list', {params: params}).then(res => res.data)
}

// 获取主題列表
export const getTopicList = params => {
  return Axios.get(BASE_PATH + '/topic/list', {params: params}).then(res => res.data)
}
