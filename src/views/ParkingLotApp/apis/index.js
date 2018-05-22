import Axios from '@/assets/js/AxiosPlugin'
// 查询车辆列表
export const listcars = (currentPage, pageSize, carNum, type, ownerName) => {
  return Axios.get('/scp-parkinglotapp/carMgmt/queryCars?currentPage=' +
  currentPage + '&pageSize=' + pageSize + '&carNum=' + carNum + '&type=' + type + '&ownerName=' + ownerName).then(res => res.data)
}

// 车辆下拉基本信息
export const carDictData = () => {
  return Axios.get('/scp-parkinglotapp/carMgmt/getCarDictData').then(res => res.data)
}
// 新增车辆
export const addCar = params => {
  return Axios.post('/scp-parkinglotapp/carMgmt/addCar', params).then(res => res.data)
}

// 修改车辆
export const editCar = params => {
  return Axios.post('/scp-parkinglotapp/carMgmt/editCar', params).then(res => res.data)
}

// 删除车辆
export const deleteCarById = (carIds) => {
  return Axios.post('/scp-parkinglotapp/carMgmt/deleteCar?ids=' + carIds).then(res => res.data)
}

// 修改车辆状态
export const carTypeChange = params => {
  return Axios.post('/scp-parkinglotapp/carMgmt/carTypeChange', params).then(res => res.data)
}

// 查询车辆是否存在
export const carIsExist = (carNum) => {
  return Axios.get('/scp-parkinglotapp/carMgmt/isExist?carNum=' + carNum).then(res => res.data)
}

// 车场管理
export const queryParkList = params => {
  return Axios.get('/scp-parkinglotapp/parkIngMgmt/queryParking', params).then(res => res.data)
}

// 车场管理查询规则
export const getTempRules = params => {
  return Axios.get('/scp-parkinglotapp/parkIngMgmt/getTempRules', params).then(res => res.data)
}

// 检测车场是否存在
export const parkingIsExist = (parkName) => {
  return Axios.post('/scp-parkinglotapp/parkIngMgmt/isExist?parkName=' + parkName).then(res => res.data)
}

// 根据绑定组织id查询车场
export const getParkOrgToJudgeBind = (orgId, bindParkCode) => {
  return Axios.post('/scp-parkinglotapp/parkIngMgmt/getParkOrgToJudgeBind?orgId=' + orgId + '&bindParkCode=' + bindParkCode).then(res => res.data)
}

// 车场获取组织详情
export const getParkOrgInfoByOrgId = (orgId) => {
  return Axios.get('/scp-parkinglotapp/parkIngMgmt/getParkOrgInfoByOrgId?orgId=' + orgId).then(res => res.data)
}

// 车场管理查询组织信息
export const getOrgInfo = () => {
  return Axios.get('/scp-parkinglotapp/parkIngMgmt/getOrgInfo').then(res => res.data)
}

// 新增车场信息
export const addParking = params => {
  return Axios.post('/scp-parkinglotapp/parkIngMgmt/addParking', params).then(res => res.data)
}

// 车位页面中车场树数据

export const carSeatTree = (parkCode) => {
  return Axios.get('/scp-parkinglotapp/parkSeatMgmt/getParkTreeSeat?parkCode=' + parkCode).then(res => res.data)
}

// 新增车位信息
export const addParkSeat = params => {
  return Axios.post('/scp-parkinglotapp/parkSeatMgmt/addParkSeat', params).then(res => res.data)
}

// 修改车位信息
export const editParkSeat = params => {
  return Axios.post('/scp-parkinglotapp/parkSeatMgmt/editParkSeat', params).then(res => res.data)
}

// 修改车位是否可用
export const updateParkSeatEnable = (parkSeatEnable) => {
  return Axios.post('/scp-parkinglotapp/parkSeatMgmt/updateParkSeatEnable?parkSeatEnable=' + parkSeatEnable).then(res => res.data)
}

// 检测车位是否存在
export const parkIsExist = (parkSeatCode) => {
  return Axios.post('/scp-parkinglotapp/parkSeatMgmt/isExist?parkSeatCode=' + parkSeatCode).then(res => res.data)
}

// 查询车位锁是否绑定车位
export const checkLockIsBind = (lockCode) => {
  return Axios.post('/scp-parkinglotapp/parkSeatMgmt/checkLockIsBind?lockCode=' + lockCode).then(res => res.data)
}

// 根据车位编号查询车位
export const queryParkSeatByKey = (currentPage, pageSize, key, queryType, defaultId, order) => {
  return Axios.get('/scp-parkinglotapp/parkSeatMgmt/queryParkSeatByKey?currentPage=' + currentPage + '&pageSize=' + pageSize +
  '&key=' + key + '&queryType=' + queryType + '&defaultId=' + defaultId + '&order=' + order).then(res => res.data)
}
// 批量删除车位信息

export const batchDelSeat = (carIds) => {
  return Axios.post('/scp-parkinglotapp/parkSeatMgmt/deleteParkSeat?id=' + carIds).then(res => res.data)
}
// 规则详情
export const listRules = (currentPage, pageSize, ruleName) => {
  return Axios.get('/scp-parkinglotapp/ruleMgmt/queryRules?currentPage=' + currentPage + '&pageSize=' + pageSize +
  '&ruleName=' + ruleName).then(res => res.data)
}

// 新增规则
export const addRule = params => {
  return Axios.post('/scp-parkinglotapp/ruleMgmt/addRule', params).then(res => res.data)
}

// 修改规则
export const editRule = params => {
  return Axios.post('/scp-parkinglotapp/ruleMgmt/editRule', params).then(res => res.data)
}

// 删除规则
export const deleteRule = ids => {
  return Axios.post('/scp-parkinglotapp/ruleMgmt/deleteRule?ids=' + ids).then(res => res.data)
}

// 获取放行规则数据字典
export const getRuleOpenWayData = () => {
  return Axios.get('/scp-parkinglotapp/ruleMgmt/getRuleOpenWayData').then(res => res.data)
}

// 查询规则是否存在
export const ruleIsExist = (ruleName) => {
  return Axios.get('/scp-parkinglotapp/ruleMgmt/isExist?ruleName=' + ruleName).then(res => res.data)
}

// 删除车场信息
export const deleteParking = (parkId) => {
  return Axios.post('/scp-parkinglotapp/parkIngMgmt/deleteParking?id=' + parkId).then(res => res.data)
}

// 修改车场信息
export const editParking = params => {
  return Axios.post('/scp-parkinglotapp/parkIngMgmt/editParking', params).then(res => res.data)
}

// 根据车场编号查询通道信息
export const queryChannelByParkCode = (parkCode) => {
  return Axios.get('/scp-parkinglotapp/channelMgmt/queryChannelByParkCode?parkCode=' + parkCode).then(res => res.data)
}

// 新增通道信息
export const addChannel = params => {
  return Axios.post('/scp-parkinglotapp/channelMgmt/addChannel', params).then(res => res.data)
}

// 修改通道信息
export const editChannel = params => {
  return Axios.post('/scp-parkinglotapp/channelMgmt/editChannel', params).then(res => res.data)
}

// 删除通道信息
export const deleteChannel = (channelId) => {
  return Axios.post('/scp-parkinglotapp/channelMgmt/deleteChannel?id=' + channelId).then(res => res.data)
}

// 根据通道id查询设备信息
export const queryDeviceByChannelId = (channelId) => {
  return Axios.get('/scp-parkinglotapp/channelDeviceMgmt/queryDeviceByChannelId?channelId=' + channelId).then(res => res.data)
}

// 检测通道是否存在
export const channelIsExist = (channelName) => {
  return Axios.post('/scp-parkinglotapp/channelMgmt/isExist?channelName=' + channelName).then(res => res.data)
}

// 根据组织id查询设备信息
export const queryDeviceByOrgId = (currentPage, pageSize, orgId, key, deviceType) => {
  return Axios.get('/scp-parkinglotapp/parkIngMgmt/getDeviceInfoByOrgId?currentPage=' + currentPage + '&pageSize=' + pageSize +
  '&orgid=' + orgId + '&key=' + key + '&deviceType=' + deviceType).then(res => res.data)
}

// 通道绑定设备信息
export const bindDevice = params => {
  return Axios.post('/scp-parkinglotapp/channelDeviceMgmt/bindDevice', params).then(res => res.data)
}

// 删除通道信息
export const unbindDevice = (id) => {
  return Axios.post('/scp-parkinglotapp/channelDeviceMgmt/unbindDevice?id=' + id).then(res => res.data)
}
// 查询授权列表
export const queryAuth = (currentPage, pageSize, ownerName, parkSeatCode) => {
  return Axios.get('/scp-parkinglotapp/authMgmt/queryAuths?currentPage=' + currentPage + '&pageSize=' + pageSize +
  '&ownerName=' + encodeURIComponent(ownerName) + '&parkSeatCode=' + encodeURIComponent(parkSeatCode)).then(res => res.data)
}

// 新增授权
export const addAuth = params => {
  return Axios.post('/scp-parkinglotapp/authMgmt/addAuth', params).then(res => res.data)
}

// 修改授权
export const editAuth = params => {
  return Axios.post('/scp-parkinglotapp/authMgmt/editAuth', params).then(res => res.data)
}

// 删除授权
export const deleteAuthById = (authIds) => {
  return Axios.post('/scp-parkinglotapp/authMgmt/deleteAuth?ids=' + authIds).then(res => res.data)
}
// 查询未授权车位
export const queryUnAuthParkSeat = (currentPage, pageSize, parkOrgId, parkSeatCode) => {
  return Axios.get('/scp-parkinglotapp/authMgmt/queryUnAuthParkSeat?currentPage=' + currentPage + '&pageSize=' + pageSize +
  '&parkOrgId=' + parkOrgId + '&parkSeatCode=' + parkSeatCode).then(res => res.data)
}
// 查询未授权车位
export const getMonthRule = () => {
  return Axios.get('/scp-parkinglotapp/authMgmt/getMonthRule').then(res => res.data)
}
export const getPayMent = (authId) => {
  return Axios.get('/scp-parkinglotapp/authMgmt/payment?authId=' + authId).then(res => res.data)
}
// 根据车场Code获取车场树
export const getParkTreeSeat = (parkCode) => {
  return Axios.get('/scp-parkinglotapp/parkSeatMgmt/getParkTreeSeat?parkCode=' + parkCode).then(res => res.data)
}
// 去缴费toPay
export const toPay = params => {
  return Axios.post('/scp-parkinglotapp/authMgmt/doPayment', params).then(res => res.data)
}
// 查看缴费记录
export const paymentRecord = (currentPage, pageSize, authId) => {
  return Axios.get('/scp-parkinglotapp/authMgmt/paymentRecord?currentPage=' + currentPage + '&pageSize=' + pageSize + '&authId=' + authId).then(res => res.data)
}

// 计费标准列表
export const queryFee = () => {
  return Axios.get('/scp-parkinglotapp/chargeMgmt/queryChargeStandardByList').then(res => res.data)
}
// 新增计费
export const addFee = params => {
  return Axios.post('/scp-parkinglotapp/chargeMgmt/addChargeStandard', params).then(res => res.data)
}

// 删除计费
export const deleteFee = (id) => {
  return Axios.post('/scp-parkinglotapp/chargeMgmt/deteleChargeStandard?id=' + id).then(res => res.data)
}

// 计费名称是否存在
export const feeIsExist = (chargeName) => {
  return Axios.post('/scp-parkinglotapp/chargeMgmt/isExist?chargeName=' + chargeName).then(res => res.data)
}
// 修改计费
export const updateCharge = params => {
  return Axios.post('/scp-parkinglotapp/chargeMgmt/updateChargeStandard', params).then(res => res.data)
}

// 查询场内车辆
export const queryParkInVehicle = (currentPage, pageSize, key) => {
  return Axios.get('/scp-parkinglotapp/parkInOutMgmt/queryParkInVehicle?currentPage=' + currentPage + '&pageSize=' + pageSize + '&key=' + key).then(res => res.data)
}

// 查询出入场车辆信息
export const queryCarInOutRecord = (currentPage, pageSize, key, queryTime) => {
  return Axios.get('/scp-parkinglotapp/parkInOutMgmt/queryCarInOutRecord?currentPage=' + currentPage + '&pageSize=' + pageSize + '&key=' + encodeURIComponent(key) + '&queryTime=' + queryTime).then(res => res.data)
}

// 查询出入场车辆信息
export const queryParkAndParkSeatInfo = params => {
  return Axios.get('/scp-parkinglotapp/parkInOutMgmt/queryParkAndParkSeatInfo', params).then(res => res.data)
}

// 查询出入场车辆信息
export const getParkDeviceByLocalIp = (computerName) => {
  return Axios.get('/scp-parkinglotapp/parkInOutMgmt/getParkDeviceByLocalIp?computerName=' + computerName).then(res => res.data)
}

// 人工放行
export const getArtificialRelease = params => {
  return Axios.post('/scp-parkinglotapp/parkInOutMgmt/getArtificialRelease', params).then(res => res.data)
}

// 人工放行查询通道
export const getChannelByIp = (direct, computerName) => {
  return Axios.get('/scp-parkinglotapp/parkInOutMgmt/getChannelByIp?direct=' + direct + '&computerName=' + computerName).then(res => res.data)
}

// 删除场内记录
export const deleteCarInRecord = (ids) => {
  return Axios.post('/scp-parkinglotapp/parkInOutMgmt/deleteCarInRecord?ids=' + ids).then(res => res.data)
}

// 人工放行查询通道
export const getCutOffData = params => {
  return Axios.post('/scp-parkinglotapp/parkInOutMgmt/getCutOffData', params).then(res => res.data)
}

// 获取车场系统设置getSysSet
export const getSysSet = () => {
  return Axios.get('/scp-parkinglotapp/parkSysConfigMgmt/getConfig').then(res => res.data)
}

// 更新车场系统设置getSysSet
export const updateConfig = params => {
  return Axios.post('/scp-parkinglotapp/parkSysConfigMgmt/updateConfig', params).then(res => res.data)
}

// 获取卡片信息
export const getCard = (currentPage, pageSize, key) => {
  return Axios.get('/scp-parkinglotapp/tempCardAuthMgmt/getCard?currentPage=' + currentPage + '&pageSize=' + pageSize + '&key=' + key).then(res => res.data)
}

// 临停卡授权
export const updateCardAuth = (parkCode, cardNums) => {
  return Axios.post('/scp-parkinglotapp/tempCardAuthMgmt/updateCardAuth?parkCode=' + parkCode + '&cardNums=' + cardNums).then(res => res.data)
}
// 查询已授权的临停卡
export const getAuthTempCard = (currentPage, pageSize, cardNo) => {
  return Axios.get('/scp-parkinglotapp/tempCardAuthMgmt/getAuthTempCard?currentPage=' + currentPage + '&pageSize=' + pageSize + '&cardNo=' + cardNo).then(res => res.data)
}
// 修改临停卡授权
export const updateAuthTempCard = (parkCode, cardNum) => {
  return Axios.post('/scp-parkinglotapp/tempCardAuthMgmt/updateAuthTempCard?parkCode=' + parkCode + '&cardNum=' + cardNum).then(res => res.data)
}
// 获取业主信息
export const queryOwner = (currentPage, pageSize, ownerName) => {
  return Axios.get('/scp-parkinglotapp/common/queryOwners?currentPage=' + currentPage + '&pageSize=' + pageSize + '&ownerName=' + ownerName).then(res => res.data)
}
// 开闸
export const updataCarNum = params => {
  return Axios.post('/scp-parkinglotapp/parkInOutMgmt/updateCarNum', params).then(res => res.data)
}
// 获取视频设备信息
export const getLpnDevice = (computerName) => {
  return Axios.get('/scp-parkinglotapp/parkInOutMgmt/getLpnDevice?computerName=' + computerName).then(res => res.data)
}
// 出场车牌矫正
export const updateOutCarNum = params => {
  return Axios.post('/scp-parkinglotapp/parkInOutMgmt/updateOutCarNum', params).then(res => res.data)
}

// 出场车辆类型矫正
export const updateCarMode = params => {
  return Axios.post('/scp-parkinglotapp/parkInOutMgmt/updateCarMode', params).then(res => res.data)
}

// 获取视频流
export const getStreaming = () => {
  return Axios.get('/scp-parkinglotapp/parkInOutMgmt/getStreaming').then(res => res.data)
}
// 获取心跳任务
export const getHeartbeat = () => {
  return Axios.post('/scp-parkinglotapp/parkInOutMgmt/getHeartbeat').then(res => res.data)
}

// 获取停车场应用IP和端口配置
export const getParkinglotAppWebSocketUrl = () => {
  const url = window.location.href
  let webSocketUrl = ''
  // Dev2环境
  if (/192.168.0.242/.test(url)) {
    webSocketUrl = '192.168.0.242:39081'
  } else if (/192.168.0.161/.test(url)) {
  // Dev3环境
    webSocketUrl = '192.168.0.161:39081'
  } else if (/192.168.0.236/.test(url)) {
    // test环境
    webSocketUrl = '192.168.0.235:9081'
  } else if (/192.168.0.176/.test(url)) {
    // test2环境
    webSocketUrl = '192.168.0.176:9081'
  } else if (/127.0.0.1/.test(url) || /localhost/.test(url)) {
    // 本地环境
    webSocketUrl = '127.0.0.1:8082/scp-parkinglotapp'
  }
  return webSocketUrl
}

// 获取车场道闸设备
export const listBarrierGate = () => {
  return Axios.get('/scp-parkinglotapp/barrierGate/listBarrierGate').then(res => res.data)
}

// 查询道闸授权列表
export const queryBarrierGateAuth = (params) => {
  var par = JSON.stringify(params)
  return Axios.get('/scp-parkinglotapp/barrierGate/queryBarrierGateAuth?params=' + encodeURI(par)).then(res => res.data)
}

// 道闸重新同步
export const syncDev = (params) => {
  return Axios.post('/scp-parkinglotapp/barrierGate/syncDev?params=' + params).then(res => res.data)
}

// 道闸授权重新同步
export const syncAuth = (params) => {
  return Axios.post('/scp-parkinglotapp/barrierGate/syncAuth?params=' + params).then(res => res.data)
}

// 获取停车场应用IP
export const getParkinglotAppLocalIp = () => {
  return Axios.get('/scp-parkinglotapp/common/getLocalIp').then(res => res.data)
}

// 根据业主ID查询业主的车辆列表
export const queryCarsByOwnerId = (ownerId) => {
  return Axios.get('/scp-parkinglotapp/carMgmt/queryCarsByOwnerId?ownerId=' + ownerId).then(res => res.data)
}

// 获取字典类型
export const listSysCodeType = () => {
  return Axios.get('/scp-parkinglotapp/sysCodeMgmt/listCodeType').then(res => res.data)
}

// 获取字典数据
export const getSysCode = (params) => {
  var p = JSON.stringify(params)
  return Axios.get('/scp-parkinglotapp/sysCodeMgmt/getSysCode?params=' + encodeURI(p)).then(res => res.data)
}

// 新增字典数据
export const addSysCode = (params) => {
  return Axios.post('/scp-parkinglotapp/sysCodeMgmt/add', params).then(res => res.data)
}

// 修改字典数
export const updateSysCode = (params) => {
  return Axios.post('/scp-parkinglotapp/sysCodeMgmt/update', params).then(res => res.data)
}
// 查询缴费统计

// 车辆类型缴费统计
export const getPayCount = (queryTime) => {
  return Axios.get('/scp-parkinglotapp/feeCountMgmt/getAllFeeCount?queryTime=' + queryTime).then(res => res.data)
}

// 出口通道车辆统计
export const getOutChannelCount = (queryTime) => {
  return Axios.get('/scp-parkinglotapp/feeCountMgmt/getOutChannelCarCount?queryTime=' + queryTime).then(res => res.data)
}
