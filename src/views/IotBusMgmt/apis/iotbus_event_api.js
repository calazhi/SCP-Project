import Axios from '@/assets/js/AxiosPlugin'
import {BASE_PATH} from '../assets/js/common'

// 添加事件
export const addEvent = (data) => {
  return Axios.post(BASE_PATH + '/event/insert', data).then(res => res.data)
}
// 获取事件列表
export const getEventList = params => {
  return Axios.get(BASE_PATH + '/event/list', {params: params}).then(res => res.data)
}
// 获取事件信息
export const getEventByCode = params => {
  return Axios.get(BASE_PATH + '/event/get', {params: params}).then(res => res.data)
}
// 修改事件信息
export const updateEvent = (data) => {
  return Axios.post(BASE_PATH + '/event/update', data).then(res => res.data)
}
// 删除事件
export const deleteEvent = (data) => {
  return Axios.post(BASE_PATH + '/event/delete' + '?key=' + data.key).then(res => res.data)
}
// 获取事件组列表
export const getEventGroupList = params => {
  return Axios.get(BASE_PATH + '/topic/list').then(res => res.data)
}
// 获取设备类型列表
export const getDeviceTypeList = params => {
  return Axios.get(BASE_PATH + '/event/listDeviceTypes').then(res => res.data)
}
