import { request, cmd } from '@/views/VideoGatewayApp/apis/common.js'

// 获取到球机列表
export const getCameraListData = (data) => {
  return request(cmd['camera_option_list'], data, 'get')
}
