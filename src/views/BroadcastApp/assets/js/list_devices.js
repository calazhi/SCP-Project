import { getDevicesList } from '@/views/BroadcastApp/apis/index.js'
import { LOG_TAG } from '@/views/BroadcastApp/assets/js/index.js'

/**
 * @description 查询设备信息初始化组织树
 */
export function listDeviceList () {
  let params = {
    deviceType: 2019
  }
  let idx = 0
  let treeD = []
  /**
   * @description 调用设备查询接口
   * @param {Object} params
   */
  getDevicesList(Object.assign({}, params))
    .then(res => {
      if (res.data.code === '00000') {
        let devcList = res.data.data.deviceList
        devcList.forEach((item, index) => {
          if (item.subDeviceList.length > 0) {
            treeD[idx] = {}
            treeD[idx].label = item.deviceName
            treeD[idx].id = item.deviceID
            treeD[idx].children = []
            item.subDeviceList.forEach(function (cur, _idx) {
              if (cur.subDeviceInstallAddress !== null && cur.subDeviceInstallAddress !== '') {
                let curSubOrgName = cur.subOrgName ? cur.subOrgName : ''
                let curSubDeviceName = cur.subDeviceName ? cur.subDeviceName : ''
                treeD[idx].children.push({
                  subDeviceInstallAddress: cur.subDeviceInstallAddress,
                  id: cur.subDeviceID,
                  label: curSubOrgName + ' ' + curSubDeviceName,
                  parentId: item.deviceID,
                  parentName: item.deviceName,
                  subDeviceInfo: cur.subDeviceID + ':' + curSubOrgName + '_' + curSubDeviceName
                })
              }
            })
            idx = idx + 1
          }
        })
        this.treeData = treeD
      }
    }).catch(err => {
      console.warn(LOG_TAG + err)
    })
}
