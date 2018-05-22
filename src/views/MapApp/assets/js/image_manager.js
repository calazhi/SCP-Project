import cameraImg from '@/views/MapApp/assets/images/ico_camera_normal.png'
import broadcastImg from '@/views/MapApp/assets/images/ico_broadcast_normal.png'
import gatesImg from '@/views/MapApp/assets/images/ico_gates_normal.png'
import brakeImg from '@/views/MapApp/assets/images/ico_brake_normal.png'
import controlImg from '@/views/MapApp/assets/images/ico_control_normal.png'
import elevatorImg from '@/views/MapApp/assets/images/ico_elevator_normal.png'
import fenceImg from '@/views/MapApp/assets/images/ico_fence_normal.png'
import defaultImg from '@/views/MapApp/assets/images/warn.png'
// 背景透明的图标
import transCamermImg from '@/views/MapApp/assets/images/camerm.png'
import transRadioImg from '@/views/MapApp/assets/images/radio.png'
import transBrakeImg from '@/views/MapApp/assets/images/brake.png'
import transControlImg from '@/views/MapApp/assets/images/control.png'
import transElevatorImg from '@/views/MapApp/assets/images/elevator.png'
import transFenceImg from '@/views/MapApp/assets/images/fence.png'
import transGatesImg from '@/views/MapApp/assets/images/gates.png'
/*
  点位类型
  1-摄像头
  2-广播设备
  4-人行道闸
  5-车闸
  6-门禁
  8-电梯
  9-电子围栏
*/
export const getImgByType = (type) => {
  let img
  if (type === 1) {
    img = cameraImg
  } else if (type === 2) {
    img = broadcastImg
  } else if (type === 4) {
    img = gatesImg
  } else if (type === 5) {
    img = brakeImg
  } else if (type === 6) {
    img = controlImg
  } else if (type === 8) {
    img = elevatorImg
  } else if (type === 9) {
    img = fenceImg
  } else {
    img = defaultImg
  }
  return img
}
/**
 * 获取设备列表的透明背景图标
 * @param {String|Number} markerType  设备类型
 * @param {String} backgroundUrl  设备图标的背景图
 * @return {String} backgroundUrl 重新赋值的设备图标的背景图
 */
export const getDeviceIcon = (markerType, backgroundUrl) => {
  switch (Number(markerType)) {
    case 1:
      backgroundUrl = 'url(' + transCamermImg + ')'
      break
    case 2:
      backgroundUrl = 'url(' + transRadioImg + ')'
      break
    case 4:
      backgroundUrl = 'url(' + transGatesImg + ')'
      break
    case 5:
      backgroundUrl = 'url(' + transBrakeImg + ')'
      break
    case 6:
      backgroundUrl = 'url(' + transControlImg + ')'
      break
    case 8:
      backgroundUrl = 'url(' + transElevatorImg + ')'
      break
    case 9:
      backgroundUrl = 'url(' + transFenceImg + ')'
      break
    default:
      backgroundUrl = '#fff'
      break
  }
  return backgroundUrl
}
