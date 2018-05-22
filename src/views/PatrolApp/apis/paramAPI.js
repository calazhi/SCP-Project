import Axios from '@/assets/js/AxiosPlugin'

/**
 * 获取巡查参数配置列表
 * @param {*}
 */
export const getPatrolParamAppData = (params) => {
  return Axios.get('/scp-patrolapp/patrolParamMng/listPatrolParam', { params: params },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
/**
 * 根据id获取巡查参数配置详情
 * @id {*}巡查参数配置项id
 */
export const getInfoData = id => {
  return Axios.get(`/scp-patrolapp/patrolParamMng/getPatrolParamById?patrolParamId=${id}`,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 添加巡查参数配置
 * @param {*}
 */
export const postAddParamData = param => {
  return Axios.post('/scp-patrolapp/patrolParamMng/insertPatrolParam', param,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 更新巡查参数配置
 * @param {*}
 */
export const postModifyParamData = param => {
  return Axios.post('/scp-patrolapp/patrolParamMng/updatePatrolParam', param,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 删除巡查参数配置
 * @param {*}
 */
export const postDelParamData = param => {
  return Axios.post('/scp-patrolapp/patrolParamMng/deletePatrolParam', param,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 获取设备列表
 * @param {*}
 */
export const getDviceListData = param => {
  return Axios.get('/scp-patrolapp/patrolDevice/listDevice', param,
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 获取巡点位信息
 * @id {*} 巡查路线id
 */
export const getParamRelationData = (params) => {
  return Axios.get('/scp-patrolapp/patrolParamMng/getPatrolParamById', { params: params },
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 巡查点分页
 * @param {*} params
 */
export const getByCriteriaData = (params) => {
  return Axios.get('/scp-patrolapp/patrolPointManage/listByCriteria', { params: params },
    {
      headers: { 'Content-Type': 'application/json' }
    })
}

/**
 * 巡查参数重名检测
 * @param {*} params
 */
export const getCheckParamNameData = (params) => {
  return Axios.get('/scp-patrolapp/patrolParamMng/getPatrolParamName', { params: params },
    {
      headers: { 'Content-Type': 'application/json' }
    })
}
