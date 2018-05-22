import { request, cmd } from '@/views/VideoGatewayApp/apis/common.js'
// 查询录像计划模板
export const getTemplateData = (param) => { return request(cmd['template_list'], param, 'get') }
// 配置录像计划模板
export const postSaveTemplateData = (param) => { return request(cmd['template_update'], param) }
