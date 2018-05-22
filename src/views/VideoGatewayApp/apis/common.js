import Axios from '@/assets/js/AxiosPlugin'
import CryptoJS from 'crypto-js'
export const cmd = {
  // 流媒体服务管理
  'streamMedia_list': 'streamMedia/list', // 获取流媒体服务配置
  'streamMedia_update': 'streamMedia/update', // 设置流媒体服务配置
  'streamMedia_save': 'streamMedia/save', // 添加流媒体服务
  'streamMedia_delete': 'streamMedia/delete', // 删除流媒体服务
  'streamMedia_search': 'streamMedia/getByOrgId', // 查询流媒体服务
  'streamMedia_edit': 'streamMedia/getAllByUuid', // 编辑流媒体服务
  'streamMedia_getAddedStreamMediaOrg': 'streamMedia/getAddedStreamMediaOrg', // 获取添加修改的流媒体组织树信息
  //  NVR视频设备管理
  'device_save': 'video/device/insertVideoDevice', // 添加视频设备
  'device_list': 'video/device/listVideoDevices', // 查询视频设备
  'device_delete': 'video/device/deleteVideoDevice', // 删除视频设备
  'device_update': 'video/device/updateVideoDevice', // 编辑视频设备
  'listVideoDeviceChannelInfo': 'video/device/listVideoDeviceChannelInfo', // 视频设备查看功能
  'updateVideoDeviceChannelInfo': 'video/device/updateVideoDeviceChannelInfo', // 视频设备刷新功能
  // 录像计划模板配置
  'template_list': 'recordPlanTemplate/list', // 查询录像计划模板
  'template_update': 'recordPlanTemplate/update', // 配置录像计划模板
  // 录像计划配置
  'plan_list': 'organization/device/getCameraPageByOrgId', // 查询录像计划
  'plan_save': 'recordPlan/update', // 保存录像计划
  'plan_delete': 'recordPlan/delete', // 清除录像计划
  // 视频参数配置
  'parameter_get': 'video/parameter/getVideoParameter', // 获取视频参数
  'parameter_save': 'video/parameter/updateVideoParameter', // 保存视频参数
  'parameter_recordpackagesize_list': 'api/dropList/listRecordPackageSizes', // 查询录像打包大小列表
  // 自定义分组
  'get_organizations': 'organization/device/getOrganizations', // 获取组织树
  'customgroup_delete': 'custom/group/delete', // 删除组
  'customgroup_get': 'custom/group/get', // 获取自定义组下的摄像头
  'customgroup_list': 'custom/group/list', // 根据名称查询自定义组
  'customgroup_insert': 'custom/group/insert', // 添加自定义组
  'customgroup_update': 'custom/group/update', // 修改自定义组
  'cameraTree_get': 'organization/device/getRootOrgDto', // 获取组织下的摄像头
  'cameraTree_node_get': 'organization/device/getChildOrgDto', // 根据组织uuid获取组织下的摄像头
  // 球机配置
  'camera_option_list': 'organization/device/getDomeDevicePageList', // 获取到球机列表
  // 电视墙配置
  'screen_list': 'tvWall/listBaseConfig', // 获取电视墙屏幕列表
  'screen_option_get': 'tvWall/listByMonitorId', // 获取电视墙一个屏幕的视频通道
  'screen_option_update': 'tvWall/update', // 设置电视墙一个屏幕的通道设置
  'screen_option_delete': 'tvWall/delete' // 删除电视墙一个屏幕的属性
}
const isMock = false // 是否mock调试
export const prePath = '/scp-videogatewayapp/'
export const request = (path, data, type) => {
  data = data || {}
  if (isMock && type === 'get') data = {}
  var promise = new Promise((resolve, reject) => {
    Axios({
      method: type || 'post',
      url: prePath + path,
      params: type === 'get' ? data : {}, // get 传的参数
      data: type !== 'get' ? data : {}, // post 传的参数
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(
      res => {
        if (res.data.code === '200' || res.data.code === '00000') {
          resolve(res.data.data)
        } else {
          if (res.data) res.data.fromService = true // 错误来自服务器，非axios
          reject(res.data)
        }
      }).catch(
        error => {
          reject(error)
        }
      )
  })
  return promise
}
export const confirmDelete = function (text, fnOk, fnCancel) {
  this.$confirm(text, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (fnOk) fnOk()
  }).catch(() => {
    if (fnCancel) fnCancel()
  })
}
export const serviceTypeArr = {
  '1': '流媒体',
  '2': '其它'
}
export const isValidIP = (ip) => {
  var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(ip)
}
export const emptyObj = (obj) => {
  for (var key in obj) {
    obj[key] = ''
  }
}
export const isArray = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Array]'
}
export const deviceTypeArr = { '1': 'NVR' }
export const deviceMaker = { '1': '海康', '2': '大华' }
export const onLine = { '0': '不在线', '1': '在线' }
// 密码加密
export const encryption = (pwd) => {
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  var len = chars.length
  var startStr = ''
  var endStr = ''
  for (var i = 0; i < 16; i++) {
    startStr += chars.charAt(Math.floor(Math.random() * len))
    endStr += chars.charAt(Math.floor(Math.random() * len))
  }
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(startStr + pwd + endStr))
}
// 密码解密
export const decryption = (pwd) => {
  var str = CryptoJS.enc.Base64.parse(pwd).toString(CryptoJS.enc.Utf8)
  return str.slice(16, -16)
}
// 下载excel 模板
export const downloadExcelTemplate = (type) => {
  return Axios.get('/scp-videogatewayapp/templates/deviceTemplate.xlsx', { responseType: 'arraybuffer' } // scp-videogatewayapp/video/device/uploadTemplate
  ).then(res => {
    if (type === 1) {
      var fileName = 'deviceTmplate.xlsx'
    } else if (type === 2) {
      fileName = 'deviceTmplate.xlsx'
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
// 下载excel 模板
export const cameraDownloadExcelTemplate = (type) => {
  return Axios.get('/scp-videogatewayapp/templates/cameraCoordinateTemplate.xlsx', { responseType: 'arraybuffer' }
  ).then(res => {
    if (type === 1) {
      var fileName = 'cameraCoordinateTemplate.xlsx'
    } else if (type === 2) {
      fileName = 'cameraCoordinateTemplate.xlsx'
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
