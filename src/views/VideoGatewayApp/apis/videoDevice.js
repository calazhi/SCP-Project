import { request, cmd } from '@/views/VideoGatewayApp/apis/common.js'
// 查询设备
export const postGetDeviceData = (data) => {
  return request(cmd['device_list'], data)
}
// 添加设备
export const postAddDeviceData = (data) => {
  return request(cmd['device_save'], data)
}
// 删除设备
export const postDeleteDeviceData = (data) => {
  return request(cmd['device_delete'], data)
}
// 修改设备
export const postModifyDeviceData = (data) => {
  return request(cmd['device_update'], data)
}
// 查看设备
export const getCheckDeviceData = (data) => {
  return request(cmd['listVideoDeviceChannelInfo'], data, 'get')
}
// 刷新设备
export const getRefreshDeviceData = (data) => {
  return request(cmd['updateVideoDeviceChannelInfo'], data, 'get')
}
export const deviceTypeArr = { '1': 'NVR' }
export const deviceMaker = { '1': '海康', '2': '大华' }
export const onLine = { '0': '不在线', '1': '在线' }
