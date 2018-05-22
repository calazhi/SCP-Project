import {
  getImgByType
} from '@/views/MapApp/assets/js/image_manager'

export const mapOptionFormat = options => {
  /* initMap需要的options结构
  {
    mapId: option.id,
    gisEngine: 'bitmap',
    sizeW: 1920,
    sizeH: 1080,
    domId: 'mapDiv',
    mapUrl: mapImageUrl,
    maxZoom: 10,
    minZoom: 1,
    center: [112.334403, 39.8],
    popupDom: {
      popup: 'popup',
      popupcloser: 'popup-closer',
      popupcontent: 'popup-content'
    }
  }
  原始得到的sceneList结构
 {
    id: '1e9286c5df964ffbafcbb1b314ae7f9b',
    courtUuid: '123',
    sceneName: '单条搜索',
    url: 'testUrl',
    gpsLon: null,
    gpsLat: null,
    centerLon: 202.121332,
    centerLat: 202.123343,
    scale: 200,
    scaleType: 1,
    height: 120.0,
    width: 230.0,
    realHeight: null,
    realWidth: null,
    orgCode: null,
    sceneType: 1,
    parentArea: null,
    countWarning: null
  }
  */
  let formatedOption = {}
  formatedOption.mapId = options.id
  formatedOption.sceneName = options.sceneName
  formatedOption.gisEngine = 'bitmap'
  formatedOption.sizeW = options.width
  formatedOption.sizeH = options.height
  formatedOption.realHeight = options.realHeight
  formatedOption.realWidth = options.realWidth
  formatedOption.mapUrl = options.mapImage
  formatedOption.center = options.center ? options.center : [0, 0]
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

/* marker 需要结构
  {
    id: id,
    markerType: 'camera',
    position: [-40, 3.76],
    name: 'aa',
    imgUrl: markerImg,
    size: [32, 48]
  }
  后台返回的markerInfo结构
  {
    id: '4b23566be698427682e5ebe3089e3f8d',
    sceneId: '0',
    deviceId: '0',
    longitude: 0,
    latitude: 0,
    positionX: 0,
    positionY: 0,
    markerType: 0,
    markerOrder: 0
  }
 */
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
  formatedInfo.markerName = markerInfo.markerName
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
  if (featureInfo.GPS) {
    markerInfo.latitude = featureInfo.GPS[0]
    markerInfo.longitude = featureInfo.GPS[1]
  }
  return markerInfo
}

export const LOG_TAG = '[MapApp]：'

export const scaleMap = {
  scale: 0.3
}
