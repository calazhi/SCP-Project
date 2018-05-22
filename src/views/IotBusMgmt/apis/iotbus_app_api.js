import Axios from '@/assets/js/AxiosPlugin'
import {BASE_PATH} from '../assets/js/common'

// const BASE_PATH = '/scp-iotbusconsoleapp'

// 添加IOT应用
export const addIotBusApp = (data) => {
  return Axios.post(BASE_PATH + '/app/insert', data).then(res => res.data)
}

// 根据IOT应用ID获取IOT应用信息
export const getIotBusAppById = params => {
  return Axios.get(BASE_PATH + '/IotBusMgmt/IotBusApp/get/' + params.id).then(res => res.data)
}

// 获取IOT应用信息列表分页
export const getIotBusAppListPage = params => {
  return Axios.get(BASE_PATH + '/app/list', {params: params}).then(res => res.data)
}

// 修改IOT应用基本信息
export const updateIotBusApp = (data) => {
  return Axios.post(BASE_PATH + '/app/update', data).then(res => res.data)
}
// 删除IOT应用
// export const deleteIotBusApp = params => {
//   return Axios.post(BASE_PATH + '/app/delete' + '?key=' + params.appCode).then(res => res.data)
// }
