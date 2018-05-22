import Axios from '@/assets/js/AxiosPlugin'

// 获取所有的设备组
export const listDeviceGroup = () => {
  return Axios.get('/scp-accesscontrolapp/deviceGroup/listDeviceGroup')
  .then(res => res.data)
}

// 删除设备组
export const deleteDeviceGroupById = id => {
  return Axios.get('/scp-accesscontrolapp/deviceGroup/deleteDeviceGroupById?id=' + id).then(res => res.data)
}

// 删除组内设备
export const batchDeleteDevices = (groupId, ids) => {
  return Axios.get('/scp-accesscontrolapp/deviceGroup/batchDeleteDevices?groupId=' + groupId + '&ids=' + ids).then(res => res.data)
}

// 根据设备组ID获取组内设备
export const listDevicesByGroupId = groupId => {
  return Axios.get('/scp-accesscontrolapp/deviceGroup/listDevicesByGroupId?groupId=' + groupId)
  .then(res => res.data)
}

// 获取组织内设备
export const listDevicesByOrgId = orgId => {
  return Axios.get('/scp-accesscontrolapp/deviceGroup/listDevicesByOrgId?orgId=' + orgId)
  .then(res => res.data)
}

// 加载组织树
export const loadOrgTree = () => {
  return Axios.get('/scp-accesscontrolapp/deviceGroup/loadOrgTree')
  .then(res => res.data)
}

// 新增保存设备组
export const insertDeviceGroup = params => {
  return Axios.post('/scp-accesscontrolapp/deviceGroup/insertDeviceGroup', params).then(res => res.data)
}

// 修改保存设备组
export const updateDeviceGroup = params => {
  return Axios.post('/scp-accesscontrolapp/deviceGroup/updateDeviceGroup', params).then(res => res.data)
}

// 判断设备组名称是否已经存在
export const isGroupNameExists = groupName => { return Axios.get('/scp-accesscontrolapp/deviceGroup/isGroupNameExists?groupName=' + groupName).then(res => res.data) }

// 获取所有设备组
export const allEquipmentGroups = () => { return Axios.get('/scp-accesscontrolapp/auths/equipment/groups').then(res => res.data) }

// 获取当前用户的授权信息
export const currentUserAuthorInfo = params => { return Axios.get('/scp-accesscontrolapp/auths/record', params).then(res => res.data) }
// export const currentUserAuthorInfo = () => { return Axios.get('/scp-accesscontrolapp/auths/author/record').then(res => res.data) }

// 添加用户授权信息
export const addUserAuthorInfo = params => { return Axios.post('/scp-accesscontrolapp/auths/add', params).then(res => res.data) }

// 更新用户授权信息
export const updateUserAuthorInfo = params => { return Axios.post('/scp-accesscontrolapp/auths/update', params).then(res => res.data) }

// 注销用户授权信息
export const cancelUserAuthorInfo = params => { return Axios.get('/scp-accesscontrolapp/auths/cancel?authId=' + params).then(res => res.data) }

// 禁用用户授权信息
// export const disableUserAuthorInfo = params => { return Axios.post('/scp-accesscontrolapp/auths/disable', params).then(res => res.data) }

// 启用/禁用用户授权信息
export const enableUserAuthorInfo = (authId, mode) => { return Axios.post('/scp-accesscontrolapp/auths/enable?authId=' + authId + '&mode=' + mode).then(res => res.data) }

// 查询用户绑定卡片
export const listCardByUserId = userId => { return Axios.get('/scp-accesscontrolapp/auths/listCardByUserId?userId=' + userId).then(res => res.data) }

// 查询下发记录
export const listSendDownRecords = params => { return Axios.get('/scp-accesscontrolapp/sendDownRecord/listSendDownRecords?params=' + encodeURIComponent(params)).then(res => res.data) }

// 删除下发记录
export const deleteRecord = params => { return Axios.get('/scp-accesscontrolapp/sendDownRecord/deleteRecord?messageId=' + params).then(res => res.data) }

// 重发权限信息
export const resend = params => { return Axios.get('/scp-accesscontrolapp/sendDownRecord/resend?messageId=' + params).then(res => res.data) }

// 批量删除记录
export const batchDelete = params => { return Axios.get('/scp-accesscontrolapp/sendDownRecord/batchDelete?messageIds=' + params).then(res => res.data) }

// 添加用户授权信息
export const batchAddUserAuthorInfo = params => { return Axios.post('/scp-accesscontrolapp/auths/saveBatchAuth', params).then(res => res.data) }

// 根据人员ID查询房屋信息
export const listHouseNamesById = personId => { return Axios.get('/scp-accesscontrolapp/auths/listHouseNamesById?personId=' + personId).then(res => res.data) }

// 查询出入记录
export const listEntryAndExitRecords = params => { return Axios.get('/scp-accesscontrolapp/entryAndExitRecord/listEntryAndExitRecords?params=' + encodeURIComponent(params)).then(res => res.data) }

// 格式化时间
export const formatDate = date => {
  if (!date) {
    return date
  }
  let oldDate = new Date(date)
  let year = oldDate.getFullYear()
  let month = (oldDate.getMonth() + 1) < 10 ? '0' + (oldDate.getMonth() + 1) : (oldDate.getMonth() + 1)
  let day = oldDate.getDate() < 10 ? '0' + oldDate.getDate() : oldDate.getDate()
  let hour = oldDate.getHours() < 10 ? '0' + oldDate.getHours() : oldDate.getHours()
  let minute = oldDate.getMinutes() < 10 ? '0' + oldDate.getMinutes() : oldDate.getMinutes()
  let second = oldDate.getSeconds() < 10 ? '0' + oldDate.getSeconds() : oldDate.getSeconds()
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}
