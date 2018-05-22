import Axios from '@/assets/js/AxiosPlugin'

/**
 * 根据条件查询设备/获取设备列表
 * @param {*}
 */
export const getDeviceListData = (param) => {
  return Axios.get(`/scp-patrolapp/patrolDeviceManage/listDevices`, { param: param },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
/**
 * 根据id查询设备/获取单个设备
 * @id {*}设备id
 */
export const getDeviceByIdData = id => {
  return Axios.get(`/scp-patrolapp/patrolDeviceManage/getPatrolDeviceById?deviceId=${id}`,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 绑定用户设备关联关系/绑定
 * @param {*}
 */
export const postBindOperateData = param => {
  return Axios.post('/scp-patrolapp/patrolDeviceManage/insertDeviceUser', param,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 绑定用户设备关联关系/绑定
 * @param {*}
 */
export const postUpdateDeviceUserData = param => {
  return Axios.post('/scp-patrolapp/patrolDeviceManage/updateDeviceUser', param,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 批量绑定用户设备关联关系
 * @param {*}
 */
export const postBindAllOperateData = param => {
  return Axios.post('/scp-patrolapp/patrolDeviceManage/insertDeviceUserList', param,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 批量解绑用户设备关联关系
 * @param {*}
 */
export const postRemoveBindAllData = param => {
  return Axios.post('/scp-patrolapp/patrolDeviceManage/deleteDeviceUser', param,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 查询保安列表
 * @param {*}
 */
export const getSecurityData = param => {
  return Axios.get('/scp-patrolapp/patrolTaskMng/listSecurityBindDevice', { param: param },
    {
      headers: { 'Content-Type': 'application/json' }
    })
}
