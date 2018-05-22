import Axios from '@/assets/js/AxiosPlugin'

// 接口地址
// const BASE_PATH = process.env.API_URL

// 访客管理
/**
 * 录入访客信息，测试接口
 */
export const addVisitorInfoTest = data => {
  return Axios({
    method: 'post',
    url: '/scp-visitorapp/visitor/insert',
    data
  })
}

/**
 * 查询访客
 * @param {*} data 根据访客姓名或手机号、或身份证号码查询访客记录
 */
export const getVisitor = data => {
  return Axios({
    method: 'get',
    url: '/scp-visitorapp/visitor/list',
    params: data
  })
}

/**
 * 根据被访者姓名时，查询与此被访者相关的信息：房屋地址、房屋id
 */
export const searchVisitorInfo = data => {
  return Axios({
    method: 'get',
    url: '/scp-visitorapp/user/list',
    params: data
  })
}

/**
 * 查询物业
 * @param {*} data
 */
export const getProperty = data => {
  return Axios({
    method: 'get',
    url: '/scp-visitorapp/property/list',
    params: data
  })
}

/**
 * 编辑物业
 * @param {*} data
 */
export const updateProperty = data => {
  return Axios({
    method: 'post',
    url: '/scp-visitorapp/property/update',
    data
  })
}

/**
 * 删除物业
 * @param {*} data
 */
export const deleteProperty = data => {
  return Axios({
    method: 'post',
    url: '/scp-visitorapp/property/delete',
    data
  })
}

/**
 * 新增物业
 * @param {*} data
 */
export const insertProperty = data => {
  return Axios({
    method: 'post',
    url: '/scp-visitorapp/property/insert',
    data
  })
}

/**
 * 请求物业下拉
 * @param {*} data
 */
export const getTypeNodeMap = data => {
  return Axios({
    method: 'get',
    url: '/scp-visitorapp/dictionary/getTypeNodeMap',
    params: data
  })
}

/**
 * 物业管理部门和岗位联动接口
 * @param {*} data
 */
export const positionList = data => {
  return Axios({
    method: 'get',
    url: '/scp-visitorapp/dictionary/positionList?itemCode=' + data
  })
}

/**
 * 物业管理离职人员复职
 * @param {*} data
 */
export const propertyResume = data => {
  return Axios({
    method: 'post',
    url: '/scp-visitorapp/property/resume',
    data
  })
}

// 172.16.10.73:9044/scp-visitorapp/organization/getOrgNextLevel   获取组织树节点数据
/**
 *  获取组织树节点数据信息
 * @param {*} data
 */
export const getOrgNextLevel = data => {
  return Axios({
    method: 'get',
    url: '/scp-visitorapp/organization/getOrgNextLevel',
    params: data
  })
}

// http://ip:port/scp-visitorapp/visitor/authorize  授权接口
/**
 授权接口 一键授权
 * @param {*} data
 */
export const authorize = data => {
  return Axios({
    method: 'post',
    url: '/scp-visitorapp/visitor/authorize',
    data
  })
}

// // http://ip:port/scp-visitorapp/visitor/listByName  访客录入根据名字查询匹配接口
// /**
//  访客录入根据名字查询匹配接口
//  * @param {*} data
//  */
// export const listByName = data => {
//   return Axios({
//     method: 'get',
//     url: '/scp-visitorapp/visitor/listByName',
//     params: data
//   })
// }

// ip:port/scp-visitorapp/property/getPropetyByUserName  物业编辑选中秩序员时输入账号后查询后台账号是否存在
/**
 物业编辑选中秩序员时输入账号后查询后台账号是否存在
 * @param {*} data
 */
export const validPropertyByUserName = data => {
  return Axios({
    method: 'get',
    url: '/scp-visitorapp/property/validPropertyByUserName',
    params: data
  })
}

// ip:port/scp-visitorapp/property/validPropertyByEmployeeId  物业编辑验证员工编号是否存在
/**
 物业编辑验证员工编号是否存在
 * @param {*} data
 */
export const validPropertyByEmployeeId = data => {
  return Axios({
    method: 'get',
    url: '/scp-visitorapp/property/validPropertyByEmployeeId',
    params: data
  })
}

// 172.16.10.128:9044/scp-visitorapp/visitor/cancelAuthority   取消授权接口
export const cancelAuthority = data => {
  return Axios({
    method: 'get',
    url: '/scp-visitorapp/visitor/cancelAuthority',
    params: data
  })
}

// 下载设备管理excel 模板
export const personTemplate = (type, URL) => {
  return Axios.get(URL, { responseType: 'arraybuffer' }
  ).then(res => {
    if (type === 1) {
      var fileName = '模板下载.xls'
    } else if (type === 2) {
      fileName = '数据导出.xls'
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
// 导出
export function downloadUsers (data) {
  return Axios({
    url: '/scp-visitorapp/visitor/exportExcel',
    method: 'get',
    params: data
  })
}

// ip:port/scp-visitorapp/visitor/validateCard  读卡设备读卡之后验证该卡号是否已在用
/**
 读卡设备读卡之后验证该卡号是否已在用
 * @param {*} data
 */
export const validateCard = data => {
  return Axios({
    method: 'get',
    url: '/scp-visitorapp/visitor/validateCard',
    params: data
  })
}

// ip:post/visitor/batchDeleteVisitor  访客管理批量删除
/**
 访客管理批量删除
 * @param {*} data
 */
export const batchDeleteVisitor = data => {
  return Axios({
    method: 'post',
    url: '/scp-visitorapp/visitor/batchDeleteVisitor',
    data
  })
}
