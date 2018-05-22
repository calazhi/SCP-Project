// import Axios from '@/assets/js/AxiosPlugin'

// // 接口地址
// // const BASE_PATH = process.env.API_URL
// let contextPath = '/scp-broadcastcomponent/broadcast'
// /**
//  * 获取音频列表数据
//  */
// export const getAudioList = data => {
//   return Axios({
//     method: 'get',
//     url: contextPath + '/audioClip/getList',
//     data
//   })
// }
// /**
//  * 添加音频
//  * @param {*} data
//  */
// export const addAudio = data => {
//   return Axios({
//     method: 'post',
//     url: contextPath + '/audioClip/create',
//     data
//   })
// }
// /**
//  * 删除音频
//  * @param {*} data
//  */
// export const delAudioClip = data => {
//   return Axios({
//     method: 'post',
//     url: contextPath + '/audioClip/del',
//     data
//   })
// }

// /**
//  * 获取 实时任务 列表数据
//  */
// export const getRealtimeList = data => {
//   return Axios({
//     method: 'get',
//     url: contextPath + '/realtime/getList',
//     data
//   })
// }
// /**
//  * 添加实时任务
//  * @param {*} data
//  */
// export const addRealtimeTask = data => {
//   return Axios({
//     method: 'post',
//     url: contextPath + '/task/add',
//     data
//   })
// }
// /**
//  * 播放 实时任务
//  * @param {*} data
//  */
// export const playRealtimeTask = data => {
//   return Axios({
//     method: 'post',
//     url: contextPath + '/task/play',
//     data
//   })
// }
// /**
//  * 停止 实时任务
//  * @param {*} data
//  */
// export const pauseRealtimeTask = data => {
//   return Axios({
//     method: 'post',
//     url: contextPath + '/task/pause',
//     data
//   })
// }

// /**
//  * 删除实时任务
//  * @param {*} data
//  */
// export const delRealtimeTask = data => {
//   return Axios({
//     method: 'post',
//     url: contextPath + '/task/del',
//     data
//   })
// }

// /**
//  * 获取 定时任务 列表数据
//  */
// export const getTimingList = data => {
//   return Axios({
//     method: 'get',
//     url: contextPath + '/timing/getList',
//     data
//   })
// }
// /**
//  * 添加 定时 任务
//  * @param {*} data
//  */
// export const addTimingTask = data => {
//   return Axios({
//     method: 'post',
//     url: contextPath + '/timing/add',
//     data
//   })
// }
// /**
//  * 添加 定时 任务
//  * @param {*} data
//  */
// export const delTimingTask = data => {
//   return Axios({
//     method: 'post',
//     url: contextPath + '/timing/del',
//     data
//   })
// }
// /**
//  * 排班历史查询
//  * @param {*} data
//  */
// export const HistoryTask = data => {
//   return Axios({
//     method: 'get',
//     url: '/PatrolApp/HistoryTask',
//     data
//   })
// }
// /**
//  * 排班信息查询
//  * @param {*} data
//  */
// export const PlanInfo = data => {
//   return Axios({
//     method: 'get',
//     url: '/PatrolApp/PlanInfo',
//     data
//   })
// }

// /**
//  * 巡查点分页
//  * @param {*} params
//  */
// export const getByCriteria = (params) => {
//   return Axios.get('/scp-patrolapp/patrolPointManage/getByCriteria', { params: params },
//     {
//       headers: { 'Content-Type': 'application/json' }
//     })
// }

// /**
//  * 巡查点添加
//  * @param {*} params
//  */
// export const addPatrolPoint = (params) => {
//   return Axios.post('/scp-patrolapp/patrolPointManage/addPatrolPoint', params,
//     {
//       headers: { 'Content-Type': 'application/json' }
//     })
// }

// /**
//  * 巡查点删除
//  * @param {*} params
//  */
// export const deletePatrolPoint = (params) => {
//   return Axios.post('/scp-patrolapp/patrolPointManage/deletePatrolPoint', params,
//     {
//       headers: { 'Content-Type': 'application/json' }
//     })
// }

// /**
//  * 巡查点修改
//  * @param {*} params
//  */
// export const updatePatrolPoint = (params) => {
//   return Axios.post('/scp-patrolapp/patrolPointManage/updatePatrolPoint', params,
//     {
//       headers: { 'Content-Type': 'application/json' }
//     })
// }
// // 结果
// export const Result = (params) => {
//   return Axios.get('/scp-patrolapp/patrolHistoryPoint/list', { params: params },
//     {
//       headers: { 'Content-Type': 'application/json' }
//     })
// }
// /**
//  * 超时报警
//  */
// export const TimeoutAlarmEvent = (params) => {
//   return Axios.get('/scp-patrolapp/patrolHistoryPoint/list', { params: params },
//     {
//       headers: { 'Content-Type': 'application/json' }
//     })
// }
// /**
//  * 超时报警--查询
//  */
// export const TimeoutQuery = (params) => {
//   return Axios.post('/scp-patrolapp/patrolHistoryPoint/update', params,
//     {
//       headers: { 'Content-Type': 'application/json' }
//     })
// }
// /**
//  *  人员姓名下拉框
//  */
// export const getName = () => {
//   return Axios.get('/scp-patrolapp/patrolTaskMng/listSecurity',
//     {
//       headers: { 'Content-Type': 'application/json' }
//     })
// }
// /**
//  *  设备下拉框
//  */
// export const taskName = () => {
//   return Axios.get('/scp-patrolapp/patrolDevice/listDevice',
//     {
//       headers: { 'Content-Type': 'application/json' }
//     })
// }
// /**
//  *越界报警
//  */
// export const BoundaryAlarmEvent = (params) => {
//   return Axios.get('/scp-patrolapp/patrolAlarm/list', { params: params },
//     {
//       headers: { 'Content-Type': 'application/json' }
//     })
// }
// /**
//  * 越界报警--查询
//  */
// export const BoundaryQuery = (params) => {
//   return Axios.post('/scp-patrolapp/patrolAlarm/update', params,
//     {
//       headers: { 'Content-Type': 'application/json' }
//     })
// }
// /**
//  *应急事件 --列表
//  */
// export const EmergencyEvent = (params) => {
//   return Axios.get('/patrolEmergencyEvent/list', { params: params },
//     {
//       headers: { 'Content-Type': 'application/json' }
//     })
// }
