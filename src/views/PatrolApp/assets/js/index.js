import { getImgByType } from '@/views/MapApp/assets/js/image_manager'

export const mapOptionFormat = options => {
  let formatedOption = {}
  formatedOption.mapId = options.id
  formatedOption.sceneName = options.sceneName
  formatedOption.gisEngine = 'bitmap'
  formatedOption.sizeW = options.width
  formatedOption.sizeH = options.height
  formatedOption.realHeight = options.realHeight
  formatedOption.realWidth = options.realWidth
  formatedOption.mapUrl = options.mapImage
  formatedOption.center = [0, 0]
  formatedOption.centerGPS = []
  formatedOption.centerGPS.push(options.centerLon)
  formatedOption.centerGPS.push(options.centerLat)
  formatedOption.scale = options.scale
  formatedOption.scaleType = options.scaleType
  formatedOption.countWarning = options.countWarning

  return formatedOption
}

export const extendObj = (object, extend) => {
  for (let key in extend) {
    object[key] = extend[key]
  }
  return object
}

export const markerInfoFormat = markerInfo => {
  let formatedInfo = {}
  formatedInfo.markerId = markerInfo.id
  formatedInfo.id = markerInfo.deviceId
  formatedInfo.deviceId = markerInfo.deviceId
  formatedInfo.markerType = markerInfo.markerType
  formatedInfo.position = []
  formatedInfo.position.push(markerInfo.positionX)
  formatedInfo.position.push(markerInfo.positionY)
  formatedInfo.GPS = []
  formatedInfo.GPS.push(markerInfo.longitude)
  formatedInfo.GPS.push(markerInfo.latitude)
  formatedInfo.name = markerInfo.markerName
  formatedInfo.imgUrl = getImgByType(markerInfo.markerType)
  return formatedInfo
}

export const markerListFormat = markerList => {
  let formatedList = []
  for (let i = 0; i < markerList.length; i++) {
    formatedList.push(markerInfoFormat(markerList[i]))
  }
  return formatedList
}

export const featureToMarker = featureInfo => {
  if (!featureInfo.markerId) {
    console.warn('feature Info without markerId')
    return null
  }
  let markerInfo = {}
  markerInfo.id = featureInfo.markerId
  markerInfo.positionX = featureInfo.position[0]
  markerInfo.positionY = featureInfo.position[1]
  return markerInfo
}
