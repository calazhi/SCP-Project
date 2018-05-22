/*
  将主设备和子设备合并
*/
// export const assignDevice = (list) => {
//   debugger
//   let temps = list
//   console.log('list: ')
//   console.log(list)
//   let arr = []
//   for (let i = 0; i < temps.length; i++) {
//     for (let j = 0; j < temps[i].subDevice.length; j++) {
//       arr.push((temps[i].subDevice)[j])
//     }
//   }
//   for (let k = 0; k < arr.length; k++) {
//     let arr2 = {}
//     arr2.deviceName = arr[k].subDevicName
//     arr2.deviceCode = arr[k].subDeviceCode
//     arr2.deviceDesc = arr[k].subDeviceDesc
//     arr2.deviceId = arr[k].subDeviceId
//     arr2.deviceIp = arr[k].subDeviceIp
//     arr2.deviceMarkers = arr[k].subDeviceMarkers
//     arr2.gps = arr[k].subGps
//     temps.push(arr2)
//   }
//   return temps
// }
export const assignDevice = list => {
  let temps = list
  let arr = []
  for (let i = 0; i < temps.length; i++) {
    // 将主设备信息存入
    arr.push(temps[i])
    for (let j = 0; j < temps[i].subDevice.length; j++) {
      // 将主设备下的所有子设备信息存入
      let arrSub = []
      arrSub.deviceName = temps[i].subDevice[j].subDevicName
      arrSub.deviceCode = temps[i].subDevice[j].subDeviceCode
      arrSub.deviceDesc = temps[i].subDevice[j].subDeviceDesc
      arrSub.deviceId = temps[i].subDevice[j].subDeviceId
      arrSub.deviceIp = temps[i].subDevice[j].subDeviceIp
      arrSub.deviceMarkers = temps[i].subDevice[j].subDeviceMarkers
      arrSub.gps = temps[i].subDevice[j].subGps
      arr.push(arrSub)
    }
  }
  return arr
}
