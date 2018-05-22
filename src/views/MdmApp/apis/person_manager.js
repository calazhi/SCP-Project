import Axios from '@/assets/js/AxiosPlugin'

// 获取人员信息
export function getPersonList (data) {
  return Axios({
    url: '/scp-mdmapp/user/getUsersByConditions',
    method: 'get',
    params: data
  })
}
// 删除人员
export function deletePerson (data) {
  return Axios({
    url: '/scp-mdmapp/user/deleteUser',
    method: 'POST',
    data: data
  })
}
// 批量删除人员
export function batchDeletePerson (data) {
  return Axios({
    url: '/scp-mdmapp/user/batchDeleteUser',
    method: 'POST',
    data
  })
}
// 添加人员信息
export function insertPerson (data) {
  return Axios({
    url: '/scp-mdmapp/user/insertUser',
    method: 'POST',
    data
  })
}
// 获取人员信息
export function getUser (data) {
  return Axios({
    url: '/scp-mdmapp/user/getUser',
    method: 'get',
    params: data
  })
}
// 更新人员信息
export function updatePerson (data) {
  return Axios({
    url: '/scp-mdmapp/user/updateUser',
    method: 'POST',
    data
  })
}
// 获取总组织树节点
export function obtainOrganization (data) {
  return Axios({
    url: '/scp-mdmapp/org/getUserOrgNextLevel',
    method: 'get',
    params: data
  })
}

// 字典查询
export function getDictItem (data) {
  return Axios({
    url: '/scp-mdmapp/dict/getDictItemMap',
    method: 'get',
    params: data
  })
}
// 图片
export function getPic (data) {
  return Axios({
    url: '/scp-mdmapp/user/getPicture',
    method: 'get',
    params: data
  })
}
// 下载excel 人员数据导出
export function personDownload (data) {
  return Axios({
    url: '/scp-mdmapp/user/downloadUsers',
    method: 'get',
    params: data,
    responseType: 'arraybuffer'
  })
}
