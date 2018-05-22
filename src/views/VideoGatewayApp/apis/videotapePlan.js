import { request, cmd } from '@/views/VideoGatewayApp/apis/common.js'

// 查询录像计划
export const postTapeDeviceData = (data) => {
  return request(cmd['plan_list'], data)
}
// 保存录像计划
export const postSetTapePlanData = (data) => {
  return request(cmd['plan_save'], data)
}
// 清除录像计划
export const postClearTapePlanData = (data) => {
  return request(cmd['plan_delete'], data)
}
// 获取组织树
export const getOrganizationsData = (data) => {
  return request(cmd['get_organizations'], data, 'get')
}
