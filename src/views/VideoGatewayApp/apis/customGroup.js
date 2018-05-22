import { request, cmd } from '@/views/VideoGatewayApp/apis/common.js'

// 根据名称查询自定义组
export const getGroupListData = (data) => {
  return request(cmd['customgroup_list'], data, 'get')
}
// 获取自定义组下的摄像头
export const getCamerasByGroupData = (data) => {
  return request(cmd['customgroup_get'], data, 'get')
}
// 添加自定义组
export const postGroupAddData = (data) => {
  return request(cmd['customgroup_insert'], data)
}
// 删除组
export const postGroupDeleteData = (data) => {
  return request(cmd['customgroup_delete'], data)
}
// 修改自定义组
export const postGroupUpdateData = (data) => {
  return request(cmd['customgroup_update'], data)
}
// 获取组织下的摄像头
export const getCameraTreeData = (data) => {
  return request(cmd['cameraTree_get'], data, 'get')
}
// 根据组织uuid获取组织下的摄像头
export const getCameraTreeNodeData = (data) => {
  return request(cmd['cameraTree_node_get'], data, 'get')
}
