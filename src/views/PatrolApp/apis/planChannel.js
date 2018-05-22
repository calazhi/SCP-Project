import Axios from '@/assets/js/AxiosPlugin'
/**
 * 1 排班计划查询页面
 * @param {*} params
 */
export const getPatrolData = (params) => {
  return Axios.get('/scp-patrolapp/scheduleMng/listSchedule', { params: params },
    {
      headers: { 'Content-Type': 'application/json' }
    })
}
/**
 * 2 删除排班计划页面
 * @param {*} params
 */
export const postDeletPlanData = (params) => {
  return Axios.post('/scp-patrolapp/scheduleMng/deleteSchedule', params,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 3 任务排班页面 历史和信息查询
 * @param {*} params
 */
export const getTaskPlanData = (params) => { return Axios.get('/scp-patrolapp/patrolTaskMng/listHistoryTask', { params: params, headers: { 'Content-Type': 'application/json' } }) }

/**
 * 3.1 任务排班页面 历史和信息查询
 * @param {*} params
 */
export const getInfoPlanData = (params) => { return Axios.get('/scp-patrolapp/patrolTaskMng/listTask', { params: params, headers: { 'Content-Type': 'application/json' } }) }

/**
 * 4 保存排班计划
 * @param {*} params
 */
export const postSavePlanData = (params) => {
  return Axios.post('/scp-patrolapp/scheduleMng/insertSchedule', params,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 5 安保，保安接口
 * @param {*} params
 */
export const getSecurityData = (params) => {
  return Axios.get('/scp-patrolapp/patrolTaskMng/listSecurity', { params: params },
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 6 巡查参数
 * @param {*} params
 */
export const getPatrolPiontIdData = (params) => {
  return Axios.get('/scp-patrolapp/scheduleMng/listPatrolParams', { params: params },
    {
      headers: { 'Content-Type': 'application/json' }
    })
}
/**
 *7更新排班计划
 * @param {*} params
 */
export const postRenewPlanData = (params) => {
  return Axios.post('/scp-patrolapp/scheduleMng/updateSchedule', params,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 *8获取个人排班计划
 * @id {*} id
 */
export const getPersonPlanData = (params) => {
  return Axios.get('/scp-patrolapp/scheduleMng/getSchedule', { params: params },
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

// 9巡更参数列表，暂时没使用用
export const getResultData = (params) => {
  return Axios.get('/scp-patrolapp/patrolTaskPoint/listTaskPoint', { params: params },
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

// 10巡更计划名称
export const getMakeSurePnData = (params) => {
  return Axios.get('/scp-patrolapp/scheduleMng/listPatrolPlan', { params: params },
    {
      headers: { 'Content-Type': 'application/json' }
    })
}
