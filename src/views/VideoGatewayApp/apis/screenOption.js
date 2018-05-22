import { request, cmd } from '@/views/VideoGatewayApp/apis/common.js'

// 获取电视墙屏幕列表
export const getScreenList = (data) => {
  return request(cmd['screen_list'], data, 'get')
}
// 获取电视墙一个屏幕的视频通道
export const getScreenOption = (data) => {
  return request(cmd['screen_option_get'], data, 'get')
}
// 设置电视墙一个屏幕的通道设置
export const updateScreenOption = (data) => {
  return request(cmd['screen_option_update'], data)
}
// 删除电视墙一个屏幕的属性
export const deleteScreenOption = (data) => {
  return request(cmd['screen_option_delete'], data)
}
