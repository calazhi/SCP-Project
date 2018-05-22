import Axios from '@/assets/js/AxiosPlugin'

/**
 * 超时报警
 */
export const getTimeoutAlarmEventData = (params) => {
  return Axios.get('/scp-patrolapp/patrolTaskPoint/listTaskPoint', {
    params: params
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/**
 * 超时报警--查询
 */
export const TimeoutQuery = (params) => {
  return Axios.post('/scp-patrolapp/patroTaskPoint/updateTaskPoint', params, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/**
 *  人员姓名下拉框
 */
export const getNameData = () => {
  return Axios.get('/scp-patrolapp/patrolTaskMng/listSecurity', {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/**
 *  设备下拉框
 */
export const getTaskNameData = () => {
  return Axios.get('/scp-patrolapp/patrolDevice/listDevice', {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/**
 *越界报警
 */
export const getBoundaryAlarmEventData = (params) => {
  return Axios.get('/scp-patrolapp/patrolAlarm/listAlarm', {
    params: params
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/**
 * 越界报警--查询
 */
export const BoundaryQuery = (params) => {
  return Axios.post('/scp-patrolapp/patrolAlarm/updateAlarm', params, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/**
 *应急事件 --列表
 */
export const getEmergencyEventData = (params) => {
  return Axios.get('/scp-patrolapp/patrolEmergencyEvent/listEmergencyEvent', {
    params: params
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
