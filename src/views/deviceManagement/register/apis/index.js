import Axios from '@/assets/js/AxiosPlugin'
// 接口地址
const BASE_PATH = '/scp-devicemgmtcomponent/register/'

// 主数据根节点
export const getAllOrgs = () => {
  return Axios.get(BASE_PATH + 'getOrg/'
  ).then(res => res.data)
}

// 主数据子节点
export const getOrgNextLevel = (param) => {
  return Axios.get(BASE_PATH + 'getOrgNextLevel?id=' + param.uuid + '&type=' + param.type + '&isParent=' + param.isParent
  ).then(res => res.data)
}

// 組織list
export const getOrgList = (params) => {
  return Axios.get(BASE_PATH + 'getOrgChildren?id=' + params
  ).then(res => res.data)
}

// 获取主设备类型
export const getDeviceTypeList = () => {
  return Axios.get(BASE_PATH + 'getDeviceTypeList'
  ).then(res => res.data)
}

// 获取主设备专有属性
export const getAttrList = (params) => {
  return Axios.get(BASE_PATH + 'getAttrList?id=' + params
  ).then(res => res.data)
}

export const getAttrListByUuid = (params) => {
  return Axios.get(BASE_PATH + 'getAttrListByUuid?typeCode=' + params.typeCode + '&providerCode=' + params.providerCode + '&typeModel=' + params.typeModel + '&softwareVersion=' + params.softwareVersion
  ).then(res => res.data)
}

// 添加主设备
export const insertParentDevice = (params) => {
  return Axios.post(BASE_PATH + 'insertParentDevice', params
  ).then(res => res.data)
}

// 获取主设备列表
export const getDeviceList = (param1, param2) => {
  return Axios.get(BASE_PATH + 'getDeviceList?currentPage=' + param1 + '&pageSize=' + param2
  ).then(res => res.data)
}

// 获取子设备设备类型
export const getSubDeviceTypeList = (params) => {
  return Axios.get(BASE_PATH + 'getSubDeviceTypeList?id=' + params
  ).then(res => res.data)
}

// 删除主设备
export const deleteParentDevice = (params) => {
  return Axios.get(BASE_PATH + 'deleteParentDevice?id=' + params
  ).then(res => res.data)
}
// 编辑更新主设备
export const updateParentDevice = (params) => {
  return Axios.post(BASE_PATH + 'updateParentDevice/', params
  ).then(res => res.data)
}

// 查找主设备
export const getDeviceSelectList = (params) => {
  return Axios.post(BASE_PATH + 'getDeviceSelectList/', params
  ).then(res => res.data)
}

// 获取子设备列表
export const getSubDeviceList = (param1, param2, param3) => {
  return Axios.get(BASE_PATH + 'getSubDeviceList?id=' + param1 + '&currentPage=' + param2 + '&pageSize=' + param3
  ).then(res => res.data)
}

// 刷新单个主设备数据
export const getDeviceDetail = (params) => {
  return Axios.get(BASE_PATH + 'getDeviceDetail?id=' + params
  ).then(res => res.data)
}

// 添加子设备
export const insertSubDevice = (params) => {
  return Axios.post(BASE_PATH + 'insertSubDevice/', params
  ).then(res => res.data)
}

// 编辑更新子设备
export const updateSubDevice = (params) => {
  return Axios.post(BASE_PATH + 'updateSubDevice/', params
  ).then(res => res.data)
}

// 删除子设备
export const deleteSubDevice = (params) => {
  return Axios.get(BASE_PATH + 'deleteSubDevice?id=' + params
  ).then(res => res.data)
}

// 获取厂商编码
export const getProviderList = (params) => {
  return Axios.get(BASE_PATH + 'getProviderList'
  ).then(res => res.data)
}

// 根据设备类型，查询设备厂商
export const getProviderByType = (params) => {
  return Axios.get(BASE_PATH + 'getProviderByType?typeCode=' + params
  ).then(res => res.data)
}

// 根据设备类型，设备厂商，查询设备型号
export const getTypeModel = (params) => {
  return Axios.get(BASE_PATH + 'getTypeModel?typeCode=' + params.typeCode + '&providerCode=' + params.providerCode
  ).then(res => res.data)
}

// 根据设备类型，设备厂商，设备型号，查询软件版本号
export const getSoftwareVersion = (params) => {
  return Axios.get(BASE_PATH + 'getSoftwareVersion?typeCode=' + params.typeCode + '&providerCode=' + params.providerCode + '&typeModel=' + params.typeModel
  ).then(res => res.data)
}

// 刷新单个子设备数据
export const getSubDeviceDetail = (params) => {
  return Axios.get(BASE_PATH + 'getSubDeviceDetail?id=' + params
  ).then(res => res.data)
}

// 已绑定设备list
export const getBindingDeviceList = (params) => {
  return Axios.get(BASE_PATH + 'getDeviceById?id=' + params
  ).then(res => res.data)
}

// 可绑定设备list
export const getSelectedBindinglist = (params) => {
  return Axios.post(BASE_PATH + 'getDeviceByOrgId', params
  ).then(res => res.data)
}

// 增加绑定设备
export const addDeviceBinding = (params) => {
  return Axios.post(BASE_PATH + 'addDeviceBinding', params
  ).then(res => res.data)
}

// 删除绑定设备
export const removeDeviceBinding = (params) => {
  return Axios.post(BASE_PATH + 'removeDeviceBinding', params
  ).then(res => res.data)
}

// 网关标识
export const getGatewayIdList = () => {
  return Axios.get(BASE_PATH + 'getGatewayIdList'
  ).then(res => res.data)
}

// 下载设备管理excel 模板
export const downloadExcelTemplate = (type) => {
  return Axios.get(BASE_PATH + 'excel?type=' + 'XLSM', {responseType: 'arraybuffer'}
  ).then(res => {
    if (type === 1) {
      var fileName = 'template.xls'
    } else if (type === 2) {
      fileName = 'template.xlsm'
    }
    let blob = new Blob([res.data], { type: 'application/x-xls' })
    if (navigator.appVersion.toString().indexOf('.NET') > 0) {
      window.navigator.msSaveBlob(blob, fileName)
    } else {
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    return res.data
  })
}

// 获取用户信息
export const getUserList = params => { return Axios.get(`${BASE_PATH}/user/lists`, { params: params }).then(res => res.data) }
