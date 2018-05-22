import Axios from '@/assets/js/AxiosPlugin'
import {BASE_PATH} from '../assets/js/common'
// import {MOCK_API_URL} from '../assets/js/common'
// const BASE_PATH = '/scp-iotbusconsoleapp'

// 监控指标实时数据
export const getRealTimeData = (data) => {
  return Axios.get(BASE_PATH + '/monitor/listRealTimeData', data).then(res => res)
}

// export const getRealTimeData = (data) => {
//   return Axios.get(MOCK_API_URL + '/monitor/list', data).then(res => res.data)
// }

// 告警信息列表（最近小时）
// export const getAlertInfo = (data) => {
//   return Axios.get(MOCK_API_URL + '/monitor/alertInfo', data).then(res => res.data)
// }
export const getAlertInfo = params => {
  return Axios.get(BASE_PATH + '/monitor/listMonitorAlertPage', {params: params}).then(res => res.data)
}

// 总线吞吐量历史数据
export const getThroughput = (data) => {
  return Axios.get(BASE_PATH + '/monitor/listHistoryData' + '?indexCode=mq.throughput').then(res => res)
}

// 总线连接数历史数据
export const getConnections = (data) => {
  return Axios.get(BASE_PATH + '/monitor/listHistoryData' + '?indexCode=client.connections').then(res => res)
}

// 入栈消息队列深度历史数据
export const getInboundQueue = (data) => {
  return Axios.get(BASE_PATH + '/monitor/listHistoryData' + '?indexCode=queue.depth.inbound').then(res => res)
}

// 死信消息队列深度历史数据
export const getDeadQueue = (data) => {
  return Axios.get(BASE_PATH + '/monitor/listHistoryData' + '?indexCode=queue.depth.dead').then(res => res)
}

// 日志消息队列深度历史数据
export const getLogQueue = (data) => {
  return Axios.get(BASE_PATH + '/monitor/listHistoryData' + '?indexCode=queue.depth.log').then(res => res)
}
