import { request, cmd } from '@/views/VideoGatewayApp/apis/common.js'
// 获取视频参数
export const getVideoOptionData = (data) => {
  return request(cmd['parameter_get'], data, 'get')
}
// 设置视频参数
export const postVideoOptionData = (data) => {
  return request(cmd['parameter_save'], data)
}
