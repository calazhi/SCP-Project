import { getAudioList } from '@/views/BroadcastApp/apis/index.js'

export const LOG_TAG = '[BroadcastApp] '

/**
 * @description 获取备选音频列表
 */
export function getAudioData () {
  let condition = {}
  condition.pageNo = this.currentPage
  condition.pageSize = this.pageSize
  condition.searchKey = this.searchKey
  getAudioList(Object.assign({}, condition))
    .then(res => {
      if (res.data.code === '00000') {
        let tableD = res.data.data.audioClip
        tableD.forEach((item, index) => {
          this.taskDatas.push(item)
        })
      }
      this.audioTotal = res.data.data.total
    }).catch(err => {
      console.warn(LOG_TAG + err)
    })
}
