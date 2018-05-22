import Axios from '../../../assets/js/AxiosPlugin'
// 获取事件日志中事件类型
export const getEventTypeListData = (params) => {
  return Axios.get('/scp-eventapp/resource/listLogEventType', params, { headers: { 'Content-Type': 'application/json' } })
}
// 获取联动结果数据
export const getLinkageResultData = (params) => {
  return Axios.get('/scp-eventapp/trigger/result/list', params, { headers: { 'Content-Type': 'application/json' } })
}
// 获取联动日志结果
export const getEventLogData = (params) => {
  return Axios.get('/scp-eventapp/eventlog/list', { params: params, headers: { 'Content-Type': 'application/json' } })
}
// 通过传递当前ID获取联动结果详情
export const getEventLogByIdData = (params) => {
  return Axios.get('/scp-eventapp/eventlog/eventLogId', { params: params, headers: { 'Content-Type': 'application/json' } })
}
// 查询联动规则结果
export const getLinkageRuleData = (params) => {
  return Axios.get('/scp-eventapp/trigger/list', { params: params, headers: { 'Content-Type': 'application/json' } })
}
// 当页面加载时获取联动规则中的设备类型
export const getLinkageRuleDeviceData = (params) => {
  return Axios.get('/scp-eventapp/resource/listSubSystem', params, { headers: { 'Content-Type': 'application/json' } })
}
// 通过code获取当前事件类型
export const getLinkageRuleByCodeData = (params) => {
  return Axios.get('/scp-eventapp/resource/listEventType', { params: params, headers: { 'Content-Type': 'application/json' } })
}
// 通过当前选中的id删除此条内容
export const postDelLinkageByIdData = (params) => {
  return Axios.post('/scp-eventapp/trigger/delete', params, { headers: { 'Content-Type': 'application/json' } })
}
// 获取联动方式列表
export const getLinkageModeData = () => {
  return Axios.get('/scp-eventapp/resource/listTriggerType', { headers: { 'Content-Type': 'application/json' } })
}
// 保存联动规则数据
export const postLinkageRuleSaveData = (params) => {
  return Axios.post('/scp-eventapp/trigger/save', params, { headers: { 'Content-Type': 'application/json' } })
}
// 获取联动规则主页面组织树
export const getSourceTreeData = (params) => {
  return Axios.get('/scp-eventapp/org/getRootOrg', { params: params, headers: { 'Content-Type': 'application/json' } })
}
// 通过triggerId获取当前行数据
export const getLinkageRuleInfoData = (params) => {
  return Axios.get('/scp-eventapp/trigger/get', { params: params, headers: { 'Content-Type': 'application/json' } })
}
// 修改联动规则完成保存
export const postLinkageRuleUpdateData = (params) => {
  return Axios.post('/scp-eventapp/trigger/update', params, { headers: { 'Content-Type': 'application/json' } })
}
// 获取组织树中每个节点的数据
export const getOrgNextLevelData = (params) => {
  return Axios.get('/scp-eventapp/org/getDeviceTree', { params: params, headers: { 'Content-Type': 'application/json' } })
}
// 获取广播联动中的广播内容
export const getAudioSelectData = (params) => {
  return Axios.get('/scp-eventapp/resource/listBroadcastTask', params, { headers: { 'Content-Type': 'application/json' } })
}
// 事件预警清除
export const deleteWarningEvent = () => {
  return Axios.get('/scp-businesscommonapp/businessCommon/batchReleaseEvent', { headers: { 'Content-Type': 'application/json' } })
}
// 清除巡更事件
export const deteleCruiseEvent = () => {
  return Axios.post('/scp-patrolapp/patrolMessage/updateAllStatus', { headers: { 'Content-Type': 'application/json' } })
}
