import Axios from '@/assets/js/AxiosPlugin'
import {BASE_PATH} from '../assets/js/common'

// const BASE_PATH = '/scp-iotbusconsoleapp'

// 获取IOT死信队列列表
export const getDeadLogListData = params => {
  return Axios.get(BASE_PATH + '/deadlog/list', {params: params}).then(res => res.data)
}

// 删除IOT死信消息
export const deleteDeadLog = data => {
  return Axios.post(BASE_PATH + '/deadlog/delete' + '?key=' + data.key).then(res => res.data)
}
