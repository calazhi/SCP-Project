import Axios from '@/assets/js/AxiosPlugin'

/**
 * 巡查点分页
 * @param {*} params
 */
export const listByCriteria = params => {
  return Axios.get('/scp-patrolapp/patrolPointManage/listByCriteria', params,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 巡查点添加
 * @param {*} params
 */
export const postInsertPatrolPointData = (params) => {
  return Axios.post('/scp-patrolapp/patrolPointManage/insertPatrolPoint', params,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 巡查点删除
 * @param {*} params
 */
export const postDeletePatrolPointData = (params) => {
  return Axios.post('/scp-patrolapp/patrolPointManage/deletePatrolPoint', params,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 巡查点修改
 * @param {*} params
 */
export const postUpdatePatrolPointData = (params) => {
  return Axios.post('/scp-patrolapp/patrolPointManage/updatePatrolPoint', params,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

// 根据地图id获取巡查点列表
export const getPatrolPointMessegeData = (params) => {
  return Axios.get('/scp-patrolapp/patrolPointManage/listPatrolPoint', { params: params })
}

// 下拉框
export const getPatrolPointSelectData = (params) => {
  return Axios.get('/scp-patrolapp/redLineManage/listSceneId', { params: params })
}

// 名称去重
export const getPatrolPointRepeatData = (params) => {
  return Axios.get('/scp-patrolapp/patrolPointManage/getPatrolPointName', { params: params })
}

// 卡号去重
export const getPatrolPointRepeatCardData = (params) => {
  return Axios.get('/scp-patrolapp/patrolPointManage/getCardNumber', { params: params })
}
