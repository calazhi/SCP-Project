import Axios from '@/assets/js/AxiosPlugin'
// 获取房屋列表
export function getHouseList (data) {
  return Axios({
    url: '/scp-mdmapp/house/getHousesByConditions',
    method: 'get',
    params: data
  })
}
// 删除房屋
export function deleteHouse (data) {
  return Axios({
    url: '/scp-mdmapp/house/deleteHouse',
    method: 'POST',
    data: data
  })
}
// 批量删除
export function batchDeleteHouse (data) {
  return Axios({
    url: '/scp-mdmapp/house/batchDeleteHouse',
    method: 'POST',
    data
  })
}
// 添加房屋
export function insertHouse (data) {
  return Axios({
    url: '/scp-mdmapp/house/insertHouse',
    method: 'POST',
    data
  })
}
// 更新房屋
export function updateHouse (data) {
  return Axios({
    url: '/scp-mdmapp/house/updateHouse',
    method: 'POST',
    data
  })
}
// 支付方式，入住方式
export function getHouseType (data) {
  return Axios({
    url: '/scp-mdmapp/dict/getDictItem',
    method: 'GET',
    params: data
  })
}
// 下载excel 房屋数据导出
export function houseDownload (data) {
  return Axios({
    url: '/scp-mdmapp/house/downloadHouses',
    method: 'get',
    params: data,
    responseType: 'arraybuffer'
  })
}
