
import Axios from '@/assets/js/AxiosPlugin'
// 接口地址
const BASE_PATH = '/scp-devicemgmtcomponent/upgrade/'

export const getFotaFileList = () => {
  return Axios.post(BASE_PATH + 'getFotaFileList'
  ).then(res => res.data)
}

export const getFotaRecordList = (param1, param2) => {
  return Axios.get(BASE_PATH + 'getFotaRecordList?' + 'currentPage=' + param1 + '&pageSize=' + param2
  ).then(res => res.data)
}

export const getFotaFileSelectList = (param) => {
  return Axios.post(BASE_PATH + 'getFotaFileSelectList', param
  ).then(res => res.data)
}

export const fotaUpgradeRequest = (param) => {
  return Axios.post(BASE_PATH + 'fotaUpgradeRequest', param
  ).then(res => res.data)
}
