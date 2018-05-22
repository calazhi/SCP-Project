import { request, cmd } from '@/views/VideoGatewayApp/apis/common.js'
// 获取流媒体服务器列表
export const getStreamMediaData = (data) => {
  return request(cmd['streamMedia_list'], data, 'get')
}
// 设置流媒体服务器
export const postSetStreamMediaData = (data) => {
  return request(cmd['streamMedia_update'], data)
}
// 删除流媒体服务器
export const postDeleteStreamMediaData = (data) => {
  return request(cmd['streamMedia_delete'], data)
}
// 添加流媒体服务器
export const postAddStreamMediaData = (data) => {
  return request(cmd['streamMedia_save'], data)
}
// 查询流媒体服务器
export const getSearchStreamMediaData = (data) => {
  return request(cmd['streamMedia_search'], data, 'get')
}
// 修改单条数据
export const getEditStreamMediaData = (data) => {
  return request(cmd['streamMedia_edit'], data, 'get')
}
// 获取添加修改的流媒体组织树信息
export const getAddedOrgData = (data) => {
  return request(cmd['streamMedia_getAddedStreamMediaOrg'], data, 'get')
}
