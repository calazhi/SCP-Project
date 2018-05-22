import Axios from '@/assets/js/AxiosPlugin'
let contextPath = '/scp-videointercomapp'
// let contextPath = ''
/**
 * 增加ip
 */
export const insertIp = (ip) => {
  let params = {
    ip: ip
  }
  return Axios.post(contextPath + '/VideointercomAppPcIp/insert', params).then(
    res => res.data
  )
}
/**
 * 修改ip
 */
export const updateIp = (oldIP, newIP) => {
  let params = {
    oldIP: oldIP,
    newIP: newIP
  }
  return Axios.post(contextPath + '/VideointercomAppPcIp/update', params).then(
    res => res.data
  )
}
/**
 * 删除ip
 */
export const deleteIp = (oldIP) => {
  let params = {
    oldIP
  }
  return Axios.post(contextPath + '/VideointercomAppPcIp/delete', params).then(
    res => res.data
  )
}
/**
 * 查询ip列表
 */
export const ipList = () => {
  let params = {}
  return Axios.get(contextPath + '/VideointercomAppPcIp/list', params).then(
    res => res.data
  )
}
