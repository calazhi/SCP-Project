import Mock from 'mockjs'
import markerImg1 from '@/views/MapApp/assets/images/ico_local_default.png'
import markerImg2 from '@/views/MapApp/assets/images/icon.png'
Mock.mock('/scp-mapapp/mapService/getSceneList?sceneName=&sceneType=', function () {
  console.log('mock getSceneList')
  return {
    errMsg: 'success！',
    success: true,
    data: [
      {
        sceneName: '1栋',
        id: '001'
      },
      {
        sceneName: '2栋',
        id: '002'
      },
      {
        sceneName: '3栋',
        id: '003'
      }
    ]
  }
})

// 获取场景信息
Mock.mock('/scp-mapapp/mapService/getSceneInfo?sceneId=001', function () {
  console.log('mock getSceneInfo 001')
  return {
    code: '00000',
    message: 'success',
    data: {
      id: '001',
      sceneName: '小区主地图',
      url: '../assets/images/default_picture.png',
      gpsLongitude: '110.121332',
      gpsLatitude: '45.123343',
      scale: '20000',
      length: '1200',
      width: '800',
      orgCode: '0010102401',
      sceneType: '02',
      imgSize: '1260'
    }
  }
})

// 获取场景信息
Mock.mock('/scp-mapapp/mapService/getSceneInfo?sceneId=002', function () {
  console.log('mock getSceneInfo 002')
  return {
    code: '00000',
    message: 'success',
    data: {
      id: '002',
      sceneName: '小区分区地图',
      url: '../assets/images/default_picture.png',
      gpsLongitude: '110.121332',
      gpsLatitude: '45.123343',
      scale: '20000',
      sceneType: '1',
      length: '1200',
      width: '800',
      orgCode: '0010102401',
      imgSize: '1260'
    }
  }
})
// 获取场景信息
Mock.mock('/scp-mapapp/mapService/getSceneInfo?sceneId=003', function () {
  console.log('mock getSceneInfo 003')
  return {
    code: '00000',
    message: 'success',
    data: {
      id: '003',
      sceneName: '楼层图',
      url: '../assets/images/default_picture.png',
      gpsLongitude: '110.121332',
      gpsLatitude: '45.123343',
      scale: '20000',
      sceneType: '1',
      length: '1200',
      width: '800',
      orgCode: '0010102401',
      imgSize: '1260'
    }
  }
})

// 获取场景信息
Mock.mock('/scp-mapapp/mapService/getSceneInfo?sceneType=1', function () {
  console.log('mock getSceneInfo 003')
  return {
    code: '00000',
    message: 'success',
    data: {
      id: '001',
      sceneName: '楼层图',
      url: '../assets/images/default_picture.png',
      gpsLongitude: '110.121332',
      gpsLatitude: '45.123343',
      scale: '20000',
      sceneType: '1',
      length: '1200',
      width: '800',
      orgCode: '0010102401',
      imgSize: '1260'
    }
  }
})

Mock.mock('/scp-mapapp/mapapp/getDeviceList?deviceType=&deviceName=&orgId=', function () {
  console.log('mock getDeviceList')
  return {
    errMsg: 'success！',
    success: true,
    data: [
      {
        'deviceName': '设备1',
        'deviceId': '1111',
        'subDeviceList': [
          {
            'subDeviceName': '设备1-1',
            'subDeviceId': '1111011'
          },
          {
            'subDeviceName': '设备1-2',
            'subDeviceId': '1111012'
          },
          {
            'subDeviceName': '设备1-3',
            'subDeviceId': '1111013'
          }
        ]
      },
      {
        'deviceName': '设备2',
        'deviceId': '1112',
        'subDeviceList': [
          {
            'subDeviceName': '设备2-1',
            'subDeviceId': '1111021'
          },
          {
            'subDeviceName': '设备2-2',
            'subDeviceId': '1111022'
          },
          {
            'subDeviceName': '设备2-3',
            'subDeviceId': '1111023'
          }
        ]
      },
      {
        'deviceName': '设备3',
        'deviceId': '1113',
        'subDeviceList': [
          {
            'subDeviceName': '设备3-1',
            'subDeviceId': '1111031'
          },
          {
            'subDeviceName': '设备3-2',
            'subDeviceId': '1111032'
          },
          {
            'subDeviceName': '设备3-3',
            'subDeviceId': '1111033'
          }
        ]
      },
      {
        'deviceName': '设备4',
        'deviceId': '1114',
        'subDeviceList': [
          {
            'subDeviceName': '设备4-1',
            'subDeviceId': '1111041'
          },
          {
            'subDeviceName': '设备4-2',
            'subDeviceId': '1111042'
          },
          {
            'subDeviceName': '设备4-3',
            'subDeviceId': '1111043'
          }
        ]
      }
    ]
  }
})

Mock.mock('/scp-mapapp/mapService/getMarkerList?sceneId=001', function () {
  console.log('mock getMarkerList')
  return {
    errMsg: 'success！',
    success: true,
    data: [{
      'id': '11',
      'sceneId': '11',
      'deviceId': '1111',
      'longitude': '123.112133',
      'latitude': '45.112112',
      'positionX': '100',
      'positionY': '40',
      'markerType': 1,
      'markerOrder': '1',
      'imgUrl': markerImg1,
      'size': [32, 48],
      'markerName': '路灯A'
    }, {
      'id': '12',
      'sceneId': '12',
      'deviceId': '1112',
      'longitude': '133.112133',
      'latitude': '48.112112',
      'positionX': '60',
      'positionY': '60',
      'markerType': 1,
      'markerOrder': '1',
      'imgUrl': markerImg2,
      'size': [32, 48],
      'markerName': '路灯B'
    }, {
      'id': '13',
      'sceneId': '12',
      'deviceId': '1113',
      'longitude': '133.112133',
      'latitude': '48.112112',
      'positionX': '-30',
      'positionY': '20',
      'markerType': 2,
      'markerOrder': '1',
      'imgUrl': markerImg2,
      'size': [32, 48],
      'markerName': '路灯C'
    }]
  }
})
