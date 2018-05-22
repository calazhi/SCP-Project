
import Mock from 'mockjs'
let contextPath = '/scp-logservicecomponent'
// 查询日志
Mock.mock(contextPath + '/logservice/listLogs', function () {
  console.log('mock query logservice')
  return { 'pageCount': 2, 'logListVo': [{ 'ip': '192.168.0.2', 'url': '192.168.0.239:5672/Q_DEMO_002', 'operatorId': null, 'operatorName': null, 'type': '接口日志', 'dbusiness': '2222', 'operation': '2732', 'operateTime': '2017-12-25 15:42:59', 'completeTime': '2017-12-25 15:42:59', 'isSucess': null, 'errorDetail': '', 'bussinessid': null, 'sourcesysid': 'scp-devicemgmtcomponent                                         ', 'targetsysid': 'scp-devicemgmtcomponent                                         ', 'ext1': null, 'ext2': null, 'ext3': null }, { 'ip': '192.168.0.1', 'url': '192.168.0.239:5672/Q_DEMO_002', 'operatorId': null, 'operatorName': null, 'type': '接口日志', 'dbusiness': '2222', 'operation': '2732', 'operateTime': '2017-12-25 15:42:59', 'completeTime': '2017-12-25 15:42:59', 'isSucess': null, 'errorDetail': '', 'bussinessid': null, 'sourcesysid': 'scp-devicemgmtcomponent', 'targetsysid': 'scp-devicemgmtcomponent', 'ext1': null, 'ext2': null, 'ext3': null }] }
})

// 删除日志
Mock.mock(contextPath + '/scp-logservicecomponent/logservice/delete?uuid=11', function () {
  console.log('mock delete logservice')
  return {

  }
})

// 查询日志
Mock.mock(contextPath + '/logservice/listSysCode', function () {
  console.log('mock query listSysCode')
  return [{ 'code': 'scp-ssocomponent', 'description': '统一认证' },
  { 'code': 'scp-searchenginecomponent', 'description': '搜索引擎' },
  { 'code': 'scp-modelmgmtcomponent', 'description': '模型管理' },
  { 'code': 'scp-usermgmtcomponent', 'description': '用户管理' },
  { 'code': 'scp-devicemgmtcomponent', 'description': '设备管理' },
  { 'code': 'scp-ismgcomponent', 'description': '短信网关' },
  { 'code': 'scp-gatewaycomponent', 'description': '电话网关' },
  { 'code': 'scp-iotbusruntimeapp', 'description': '物联网总线应用' },
  { 'code': 'scp-iotbusconsoleapp', 'description': '物联网总线管理应用' },
  { 'code': 'scp-logservicecomponent', 'description': '日志服务组件' },
  { 'code': 'scp-websocketcomponent', 'description': 'WebSocket组件' },
  { 'code': 'scp-videointercomapp', 'description': '可视对讲应用' },
  { 'code': 'scp-videointercomcomponent', 'description': '可视对讲组件' },
  { 'code': 'scp-communityoperationapp ', 'description': '小区运营' },
  { 'code': 'scp-thirdpartyaccesscomponent', 'description': '第三方接入' },
  { 'code': 'scp-mapapp', 'description': '地图应用' },
  { 'code': 'scp-mapcomponent', 'description': '地图服务' },
  { 'code': 'scp-mdmapp', 'description': '主数据管理应用' },
  { 'code': 'scp-mdmcomponent', 'description': '主数据管理' },
  { 'code': 'scp-communityserviceapp', 'description': '小区服务应用' },
  { 'code': 'scp-lifeserviceapp', 'description': '生活服务应用' },
  { 'code': 'scp-broadcastcomponent', 'description': '广播组件' },
  { 'code': 'scp-broadcastapp', 'description': '广播应用' },
  { 'code': 'scp-visitorapp', 'description': '访客应用' },
  { 'code': 'scp-visitorcomponent', 'description': '访客组件' },
  { 'code': 'scp-communityplatformapicomponent', 'description': '小区平台API' },
  { 'code': 'scp-imagemgmtcomponent', 'description': '图像数据存储区' },
  { 'code': 'scp-apianalysiscomponent', 'description': '分析模块API' },
  { 'code': 'scp-laddercontrolapp', 'description': '梯控应用' },
  { 'code': 'scp-laddercontrolcomponent', 'description': '梯控组件' },
  { 'code': 'scp-videogatewayapp', 'description': '视频应用' },
  { 'code': 'scp-videogatewaycomponent', 'description': '视频组件' },
  { 'code': 'scp-eventcomponent', 'description': '事件组件' },
  { 'code': 'scp-informationreleaseapp', 'description': '信息展示应用' },
  { 'code': 'scp-informationdeliverycomponent', 'description': '信息发布组件' },
  { 'code': 'scp-communitysafetyapp', 'description': '小区安全应用' },
  { 'code': 'scp-patrolapp', 'description': '巡查应用' },
  { 'code': 'scp-patrolcomponent', 'description': '巡查组件' },
  { 'code': 'scp-accesscontrolapp', 'description': '门禁应用' },
  { 'code': 'scp-accesscontrolcomponent', 'description': '门禁逻辑处理组件' },
  { 'code': 'scp-parkinglotapp', 'description': '停车场应用' },
  { 'code': 'scp-parkinglotcomponent', 'description': '停车场组件' },
  { 'code': 'scp-cardmgmtcomponent', 'description': '卡片管理' },
  { 'code': 'scp-deviceaccessgatewayapp', 'description': '设备接入网关' },
  { 'code': 'scp-broadcastgatewayapp', 'description': '广播设备接入网关' },
  { 'code': 'scp-smartdevicegatewayapp', 'description': '轻量级接入网关' },
  { 'code': 'scp-logtransfercomponent', 'description': '日志中转服务' }]
})
