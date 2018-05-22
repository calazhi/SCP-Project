import Axios from '@/assets/js/AxiosPlugin'
// 接口地址
const BASE_PATH = '/scp-devicemgmtcomponent/attr/'

export const getDeviceListForConfig = (param) => {
  return Axios.post(BASE_PATH + 'getDeviceList', param
  ).then(res => res.data)
}

export const getDeviceAttr = (params) => {
  return Axios.post(BASE_PATH + 'getDeviceParameter/', params
  ).then(res => res.data)
}

export const updateDeviceAttr = (params) => {
  return Axios.post(BASE_PATH + 'updateDeviceAttr/', params
  ).then(res => res.data)
}
