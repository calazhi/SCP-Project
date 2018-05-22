import Axios from '@/assets/js/AxiosPlugin'
// 获取组织列表
export function getOrgList (data) {
  return Axios({
    url: '/scp-mdmapp/org/getAllOrgsList',
    method: 'get',
    params: data
  })
}
// 获取组织树
export function getOrgTree (data) {
  return Axios({
    url: '/scp-mdmapp/org/getAllOrgs',
    method: 'GET',
    params: data
  })
}
// 删除组织
export function deleteOrg (data) {
  return Axios({
    url: '/scp-mdmapp/org/deleteOrg',
    method: 'POST',
    data: data
  })
}
// 参数：uuids: 组织节点uuid的数组
export function deleteOrgs (data) {
  return Axios({
    url: '/scp-mdmapp/org/batchDeleteOrg',
    method: 'POST',
    data
  })
}
// 添加组织
export function insertOrg (data) {
  return Axios({
    url: '/scp-mdmapp/org/insertOrg',
    method: 'POST',
    data
  })
}
// 更新组织
export function updateOrg (data) {
  return Axios({
    url: '/scp-mdmapp/org/updateOrg',
    method: 'POST',
    data
  })
}
// 编辑回显
export function getOrgAttribute (data) {
  return Axios({
    url: '/scp-mdmapp/org/getOrgAttribute',
    method: 'GET',
    params: data
  })
}
// 组织导出
export function getOrgTable (data) {
  return Axios({
    url: '/scp-mdmapp/org/downloadOrgs',
    method: 'GET',
    params: data
  })
}
// 组织类型选择
export function getOrgType (data) {
  return Axios({
    url: '/scp-mdmapp/dict/getDictItem',
    method: 'GET',
    params: data
  })
}
// 下载excel 组织数据导出
export function orgDownload (data) {
  return Axios({
    url: '/scp-mdmapp/org/downloadOrgs',
    method: 'get',
    params: data,
    responseType: 'arraybuffer'
  })
}
// 下载模板
export function template (URL) {
  return Axios({
    url: URL,
    method: 'get',
    responseType: 'arraybuffer'
  })
}
