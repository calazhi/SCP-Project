import Axios from '@/assets/js/AxiosPlugin'

// 代码提交部署时使用/scp-patrolapp作上下文
const contextPath = '/scp-patrolapp'
// 调试用上下文字段为空
// const contextPath = ''

// 真实数据
// 获取场景列表
export const getSceneListData = () => { return Axios.get(contextPath + '/redLineManage/listSceneId').then(res => res.data) }

// 保存红线
export const postSaveRedPointsData = params => { return Axios.post(contextPath + '/redLineManage/insertRedPoint', params).then(res => res.data) }

// 删除红线
export const getDeleteRedLineData = params => { return Axios.get(contextPath + '/redLineManage/deleteRedLine', { params: params }).then(res => res.data) }

// 查询所有红线点
export const getRedPointsData = params => { return Axios.get(contextPath + '/redLineManage/listRedPoint', { params: params }).then(res => res.data) }

// DrawLine相关
// 查询巡查路线
export const getPatrolLineData = params => { return Axios.get(contextPath + '/patrolRouteManage/getPatrolRoute', { params: params }).then(res => res.data) }

// 保存巡更路线
export const postSavePartolLineData = params => { return Axios.post(contextPath + '/patrolRouteManage/insertPatrolRoute', params).then(res => res.data) }

// 删除巡更路线
export const postDeltetPatrolLineData = params => { return Axios.post(contextPath + '/patrolRouteManage/deletePatrolRoute', params).then(res => res.data) }
