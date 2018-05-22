import Axios from '@/assets/js/AxiosPlugin'
import {BASE_PATH} from '../assets/js/common'
// let contextPath = '/scp-iotbusconsole'

// 添加主題
export const addTopic = (data) => {
  return Axios.post(BASE_PATH + '/topic/insert', data).then(res => res.data)
}
// 获取主題列表
export const getTopicList = params => {
  return Axios.get(BASE_PATH + '/topic/list', {params: params}).then(res => res.data)
}
// 获取主題信息
export const getTopicByCode = params => {
  return Axios.get(BASE_PATH + '/topic/get', {params: params}).then(res => res.data)
}
// 修改主題信息
export const updateTopic = (data) => {
  return Axios.post(BASE_PATH + '/topic/update', data).then(res => res.data)
}
// 删除主題
// export const deleteTopic = (data) => {
//   return Axios.post(BASE_PATH + '/topic/delete' + '?key=' + data.key).then(res => res.data)
// }
