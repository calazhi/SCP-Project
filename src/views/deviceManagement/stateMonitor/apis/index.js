import Axios from '@/assets/js/AxiosPlugin'
// 接口地址
const BASE_PATH = '/scp-devicemgmtcomponent/status/'

export const getDeviceListForStatus = (param1, param2) => {
  return Axios.get(BASE_PATH + 'getDeviceList?currentPage=' + param1 + '&pageSize=' + param2
  ).then(res => res.data)
}

export const getDeviceSelectListForStatus = (params) => {
  return Axios.post(BASE_PATH + 'getDeviceSelectList/', params
  ).then(res => res.data)
}

export const updateDeviceStatusOn = (params) => {
  return Axios.post(BASE_PATH + 'updateDeviceStatusOn', params
  ).then(res => res.data)
}

export const updateDeviceStatusOff = (params) => {
  return Axios.post(BASE_PATH + 'updateDeviceStatusOff', params
  ).then(res => res.data)
}

export const updateDeviceStatusRestart = (params) => {
  return Axios.post(BASE_PATH + 'updateDeviceStatusRestart', params
  ).then(res => res.data)
}
