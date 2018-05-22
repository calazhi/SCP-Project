import Axios from '../../../assets/js/AxiosPlugin'
// 获取权限数据
export const postAuthTableData = (params) => { return Axios.post('/scp-laddercontrolapp/ladderControl/listPermission', params, { headers: { 'Content-Type': 'application/json' } }) }
// 获取人员数据
export const getPersonTableData = (params) => { return Axios.post('/scp-laddercontrolapp/ladderControl/listPerson', params, { headers: { 'Content-Type': 'application/json' } }) }
// 获取设备数据
export const getEquipmentData = (params) => { return Axios.get('/scp-laddercontrolapp/ladderControl/listDevice', { params: params, headers: { 'Content-Type': 'application/json' } }) }
// 添加梯控设备权限
export const postAddPermissionsData = (params) => { return Axios.post('/scp-laddercontrolapp/ladderControl/insertPermission', params, { headers: { 'Content-Type': 'application/json' } }) }
// 删除权限
export const PostDeletePermissionsData = (params) => { return Axios.post('/scp-laddercontrolapp/ladderControl/deletePermission', params, { headers: { 'Content-Type': 'application/json' } }) }
// 下载权限
export const postDownloadAuthData = (params) => { return Axios.post('/scp-laddercontrolapp/ladderControl/download', params, { headers: { 'Content-Type': 'application/json' } }) }
// 梯控事件查询
export const postLadderLogData = (params) => { return Axios.post('/scp-laddercontrolapp/ladderControl/listLadderLog', params, { headers: { 'Content-Type': 'application/json' } }) }
// 获取权限接口
export const getPermissionData = (params) => { return Axios.get('/scp-laddercontrolapp/ladderControl/getPermissionById', { params: params, headers: { 'Content-Type': 'application/json' } }) }
// 修改权限接口
export const postUpdatePermissionData = (params) => { return Axios.post('/scp-laddercontrolapp/ladderControl/updatePermission', params, { headers: { 'Content-Type': 'application/json' } }) }
