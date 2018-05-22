import Mock from 'mockjs'
import './business_manager'
import markerImg1 from '@/views/MapApp/assets/images/ico_local_default.png'
import markerImg2 from '@/views/MapApp/assets/images/icon.png'
// 添加用户
Mock.mock('/mapService/setMapSetting', function () {
  console.log('mock setMapSetting')
  return {
    errMsg: 'success！',
    success: true
  }
})

Mock.mock('/scp-mapapp/mapapp/getDeviceList', function () {
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

Mock.mock('/scp-mapcomponent/mapService/getSceneList', function () {
  console.log('mock getSceneList')
  return {
    errMsg: 'success！',
    success: true,
    data: [
      {
        sceneName: '1栋',
        scene_id: '11'
      },
      {
        sceneName: '2栋',
        scene_id: '12'
      },
      {
        sceneName: '3栋',
        scene_id: '13'
      }
    ]
  }
})
Mock.mock('/scp-mapapp/mapapp/getOrgTree', function () {
  console.log('mock getOrgTree')
  return {
    errMsg: 'success！',
    success: true,
    data: [{
      uuid: 1,
      name: '一级 1',
      children: [{
        uuid: 4,
        name: '二级 1-1',
        children: [{
          iuuidd: 9,
          name: '三级 1-1-1'
        }, {
          uuid: 10,
          name: '三级 1-1-2'
        }]
      }]
    },
    {
      uuid: 2,
      name: '一级 2',
      children: [{
        uuid: 5,
        name: '二级 2-1'
      }, {
        uuid: 6,
        name: '二级 2-2'
      }]
    },
    {
      uuid: 3,
      name: '一级 3',
      children: [{
        uuid: 7,
        name: '二级 3-1'
      }, {
        uuid: 8,
        name: '二级 3-2'
      }]
    }]
  }
})

Mock.mock('/mapService/getMapSetting', function () {
  console.log('mock getMapSetting')
  return {
    errMsg: 'success！',
    success: true,
    data: {
      mapType: 'baidu',
      mapCenterLongitude: '120.121311',
      mapCenterLatitude: '45.121313',
      MapZLevel: '12',
      Sat: '1'
    }
  }
})
// 增加点位
Mock.mock('/mapService/addMarker', function () {
  console.log('mock addMarker')
  return {
    code: '00000',
    message: 'success',
    data: []
  }
})
// 删除点位
Mock.mock('/mapService/deleteMarker?id=id01', function () {
  console.log('mock deleteMarker')
  return {
    code: '00000',
    message: 'success',
    data: {}
  }
})
Mock.mock('/scp-mapapp/mapService/getMarkerList', function () {
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
      'markerType': '01',
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
      'markerType': '02',
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
      'markerType': '02',
      'markerOrder': '1',
      'imgUrl': markerImg2,
      'size': [32, 48],
      'markerName': '路灯C'
    }]
  }
})
// 场景分页列表初始化查询
Mock.mock('/mapService/getScenePageList', function () {
  console.log('mock getScenePageList')
  return {
    errMsg: 'success！',
    success: true,
    data: {
      pageData: [
        {
          scene_name: '停车场',
          scene_type: '2',
          org_code: '1231',
          center_lon: '122.235545',
          center_lat: '22.235545',
          scene_id: '2233'
        },
        {
          scene_name: '小区',
          scene_type: '1',
          org_code: '123',
          center_lon: '122.235545',
          center_lat: '22.235545',
          scene_id: '2233'
        },
        {
          scene_name: '一楼大厅',
          scene_type: '3',
          org_code: '123',
          center_lon: '122.235545',
          center_lat: '22.235545',
          scene_id: '2233'
        },
        {
          scene_name: '楼顶天台',
          scene_type: '41',
          org_code: '123',
          center_lon: '122.235545',
          center_lat: '22.235545',
          scene_id: '2233'
        },
        {
          scene_name: '一楼展厅',
          scene_type: '5',
          org_code: '123',
          center_lon: '122.235545',
          center_lat: '22.235545',
          scene_id: '2233'
        },
        {
          scene_name: '一楼办公区',
          scene_type: '6',
          org_code: '123',
          center_lon: '122.235545',
          center_lat: '22.235545',
          scene_id: '2233'
        },
        {
          scene_name: '安全通道',
          scene_type: '7',
          org_code: '1231',
          center_lon: '122.235545',
          center_lat: '22.235545',
          scene_id: '2233'
        }
      ],
      total: 101
    }
  }
})
// http://localhost:8080/mapService/getScenePageList?pageNum=1&pageSize=10
Mock.mock('/mapService/getScenePageList?pageNum=1&pageSize=10', function () {
  console.log('mock getScenePageList')
  return {
    errMsg: 'success！',
    success: true,
    data: {
      pageData: [
        {
          sceneName: '停车场',
          sceneType: '2',
          orgId: '1231',
          centerLon: '122.235545',
          centerLat: '22.235545',
          sceneId: '133'
        },
        {
          sceneName: '停车场1',
          sceneType: '2',
          orgId: '1231',
          centerLon: '232.235545',
          centerLat: '212.235545',
          sceneId: '2133'
        },
        {
          sceneName: '停车场2',
          sceneType: '2',
          orgId: '1231',
          centerLon: '122.235545',
          centerLat: '22.235545',
          sceneId: '2233'
        },
        {
          sceneName: '一楼大厅',
          sceneType: '3',
          orgId: '331',
          centerLon: '32.235545',
          centerLat: '232.235545',
          sceneId: '233'
        },
        {
          sceneName: '停车场4',
          sceneType: '2',
          orgId: '1231',
          centerLon: '122.235545',
          centerLat: '22.235545',
          sceneId: '2233'
        },
        {
          sceneName: '停车场5',
          sceneType: '2',
          orgId: '1231',
          centerLon: '122.235545',
          centerLat: '22.235545',
          sceneId: '2233'
        },
        {
          sceneName: '停车场6',
          sceneType: '2',
          orgId: '1231',
          centerLon: '122.235545',
          centerLat: '22.235545',
          sceneId: '2233'
        }
      ],
      total: 88
    }
  }
})

// 获取场景信息
Mock.mock('/mapService/getSceneInfo', function () {
  console.log('mock getSceneInfo')
  return {
    code: '00000',
    message: 'success',
    data: {
      id: '123',
      sceneName: '停车场01',
      url: '../assets/images/default_picture.png',
      gpsLongitude: '110.121332',
      gpsLatitude: '45.123343',
      mapLongitude: '110.121332',
      mapLatitude: '45.123343',
      longitudeStart: '110.000000',
      longitudeEnd: '111.000000',
      latitudeStart: '45.000000',
      latifudeEnd: '46.000000',
      scale: '20000',
      length: '1200',
      width: '800',
      orgCode: '0010102401',
      sceneType: '02',
      gpsLongitude1: '110.121332',
      gpsLatitude1: '45.123343',
      gpsLongitude2: '110.121332',
      gpsLatitude2: '45.123343',
      mapLongitude1: '110.121332',
      mapLatitude1: '45.123343',
      mapLongitude2: '110.121332',
      mapLatitude2: '45.123343',
      imgSize: '1260',
      sceneSize: '123000'
    }
  }
})

// 关联场景中获取亚洲场景的数据
Mock.mock('/scp-mapapp/mapService/getSceneList?sceneType=1', function () {
  return [
    { sceneName: '中国', SceneId: 1 },
    { sceneName: '日本', SceneId: 2 },
    { sceneName: '朝鲜', SceneId: 3 },
    { sceneName: '韩国', SceneId: 4 },
    { sceneName: '新加坡', SceneId: 5 },
    { sceneName: '阿联酋', SceneId: 6 },
    { sceneName: '沙特阿拉伯', SceneId: 7 },
    { sceneName: '乌兹别克斯坦', SceneId: 8 },
    { sceneName: '马来西亚', SceneId: 9 },
    { sceneName: '印度', SceneId: 10 }
  ]
})

// 关联场景中获取欧洲场景的数据
Mock.mock('/scp-mapapp/mapService/getSceneList?sceneType=2', function () {
  return [
    { sceneName: '法国', SceneId: 7 },
    { sceneName: '德国', SceneId: 8 },
    { sceneName: '意大利', SceneId: 9 },
    { sceneName: '西班牙', SceneId: 10 },
    { sceneName: '比利时', SceneId: 11 },
    { sceneName: '英格兰', SceneId: 12 }
  ]
})

// 关联场景中获取非洲场景的数据
Mock.mock('/scp-mapapp/mapService/getSceneList?sceneType=3', function () {
  return [
    { sceneName: '埃及', SceneId: 13 },
    { sceneName: '尼日利亚', SceneId: 14 },
    { sceneName: '喀麦隆', SceneId: 15 },
    { sceneName: '西班牙', SceneId: 16 },
    { sceneName: '比利时', SceneId: 17 },
    { sceneName: '英格兰', SceneId: 18 }
  ]
})

// 模糊搜索的结果模拟(关联子场景)
Mock.mock('/scp-mapapp/mapService/getSceneList?sceneName=aaa', function () {
  return [
    { sceneName: '场景一', SceneId: 19 },
    { sceneName: '场景二', SceneId: 20 },
    { sceneName: '场景三', SceneId: 21 },
    { sceneName: '场景四', SceneId: 22 },
    { sceneName: '场景五', SceneId: 23 },
    { sceneName: '场景六', SceneId: 24 }
  ]
})

// 模糊搜索的结果模拟(关联场景)
Mock.mock('/scp-mapapp/mapService/getSceneList?sceneType=1&sceneName=aaa', function () {
  return [
    { sceneName: '场景七', SceneId: 25 },
    { sceneName: '场景八', SceneId: 26 },
    { sceneName: '场景九', SceneId: 27 },
    { sceneName: '场景十', SceneId: 28 },
    { sceneName: '场十一', SceneId: 29 },
    { sceneName: '场十二', SceneId: 30 }
  ]
})

// 模糊搜索的结果模拟(关联场景)
Mock.mock('/scp-mapapp/mapService/getSceneList?sceneType=2&sceneName=aaa', function () {
  return [
    { sceneName: '场十三', SceneId: 25 },
    { sceneName: '场十四', SceneId: 26 },
    { sceneName: '场十五', SceneId: 27 },
    { sceneName: '场十六', SceneId: 28 },
    { sceneName: '场十七', SceneId: 29 },
    { sceneName: '场十八', SceneId: 30 }
  ]
})

// 模糊搜索的结果模拟(关联场景)
Mock.mock('/scp-mapapp/mapService/getSceneList?sceneType=3&sceneName=aaa', function () {
  return [
    { sceneName: '场十九', SceneId: 25 },
    { sceneName: '场二十', SceneId: 26 },
    { sceneName: '场二一', SceneId: 27 },
    { sceneName: '场二二', SceneId: 28 },
    { sceneName: '场二三', SceneId: 29 },
    { sceneName: '场二四', SceneId: 30 }
  ]
})

// 车场类型的模拟接口
Mock.mock('/parkService/ParkAreaType', function () {
  return [
    { pareaName: '车场类型一', pareaId: 25 },
    { pareaName: '车场类型二', pareaId: 26 },
    { pareaName: '车场类型三', SceneId: 27 },
    { pareaName: '车场类型四', SceneId: 28 },
    { pareaName: '车场类型五', SceneId: 29 },
    { pareaName: '车场类型六', SceneId: 30 }
  ]
})
