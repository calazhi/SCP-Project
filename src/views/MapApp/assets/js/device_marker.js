/*
  点位类型
  1-摄像头
  2-广播设备
  4-人行道闸
  5-车闸
  6-门禁
  8-电梯
  9-电子围栏
  null-无点位
*/
let deviceCodes = [
  ['2001', '3001', '3002', '3003', '2002', '3004', '3005', '3006', '2003', '3007', '3008', '3009', '2004', '3041', '3042', '3043', '2022', '3061'], // 1-摄像头
  ['2019', '3022'], // 2-广播设备
  ['2010'], // 4-人行道闸
  ['2005'], // 5-车闸
  ['2009', '2011'], // 6-门禁
  ['2020', '3038'], // 8-电梯
  ['2021', '3060'] // 9-电子围栏（特殊在于主设备不可添加点位，子设备可以添加点位）
]
export const getMarkerTypeByDeviceCode = (deviceCode) => {
  let MarkerType = ''
  for (let i = 0; i < deviceCodes.length; i++) {
    if (deviceCodes[i].indexOf(deviceCode) !== -1) {
      switch (i) {
        case 0: MarkerType = 1
          break
        case 1: MarkerType = 2
          break
        case 2: MarkerType = 4
          break
        case 3: MarkerType = 5
          break
        case 4: MarkerType = 6
          break
        case 5: MarkerType = 8
          break
        case 6: MarkerType = 9
          break
      }
    }
  }
  return MarkerType
}
/*
 过滤子设备
*/
let deviceTypes = ['2010', '2005', '2009', '2011']
export const addFilter = (deviceType) => {
  let temp = {}
  temp.deviceType = deviceType
  temp.filter = 0
  if (deviceTypes.indexOf(deviceType) !== -1) {
    temp.filter = 1
  }
  return temp
}
