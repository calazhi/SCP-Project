import Mock from 'mockjs'
import {
  cmd,
  prePath
} from '@/views/VideoGatewayApp/apis/common.js'
let respond = {
  code: '200',
  data: '',
  message: '成功！'
}
// 查询视频参数
Mock.mock(prePath + cmd['parameter_get'], function () {
  respond.data = {
    'capturePath': '/home/var',
    'exceptionEventPrePlayTime': '30'
  }
  return respond
})
// 设置视频参数
Mock.mock(prePath + cmd['parameter_save'], function () {
  return respond
})
// 增加视频设备
Mock.mock(prePath + cmd['device_save'], function () {
  respond.data = {
    uuid: 'dev' + Math.random()
  }
  return respond
})
// 删除视频设备
Mock.mock(prePath + cmd['device_delete'], function () {
  return respond
})
// 编辑视频设备
Mock.mock(prePath + cmd['device_update'], function () {
  return respond
})
// 获取视频设备
Mock.mock(prePath + cmd['device_list'], function () {
  respond.data = {
    total: 3,
    'num': 12,
    rows: [{
      'createTime': 1516327214909,
      'uuid': '235476987091',
      'deviceName': '设备名称1',
      'deviceType': '1',
      'manufacturer': '1',
      'deviceIp': '10.34.46.45',
      'devicePort': 8000,
      'deviceUserName': '登录设备用户名',
      'deviceUserPwd': '登录设备密码'
    },
    {
      'createTime': 1516327214908,
      'uuid': '235476987092',
      'deviceName': '设备名称2',
      'deviceType': '1',
      'manufacturer': '1',
      'deviceIp': '10.34.46.45',
      'devicePort': 8000,
      'deviceUserName': '登录设备用户名',
      'deviceUserPwd': '登录设备密码'
    },
    {
      'createTime': 1516327214007,
      'uuid': '235476987093',
      'deviceName': '设备名称3',
      'deviceType': '1',
      'manufacturer': '1',
      'deviceIp': '10.34.46.45',
      'devicePort': 8000,
      'deviceUserName': '登录设备用户名',
      'deviceUserPwd': '登录设备密码'
    }
    ]
  }
  return respond
})
// 获取录像计划
Mock.mock(prePath + cmd['plan_list'], function () {
  respond.data = {
    'total': 90,
    'rows': [{
      'uuid': 'uuid01',
      'deviceCode': 'canmera01',
      'deviceName': '摄像头01',
      'deviceIp': '192.168.1.1',
      'devicePort': '500',
      'cameraName': '监控点01',
      'cameraCode': 'address01',
      'templateId': 'template02'
    }, {
      'uuid': 'uuid01',
      'deviceCode': 'canmera02',
      'deviceName': '摄像头02',
      'deviceIp': '192.168.1.1',
      'devicePort': '500',
      'cameraName': '监控点02',
      'cameraCode': 'address02',
      'templateId': 'template03'
    }, {
      'uuid': 'uuid01',
      'deviceCode': 'canmera03',
      'deviceName': '摄像头03',
      'deviceIp': '192.168.1.1',
      'devicePort': '500',
      'cameraName': '监控点03',
      'cameraCode': 'address03',
      'templateId': ''
    }]
  }
  return respond
})
// 获取人脸抓拍图片
Mock.mock(prePath + cmd['getHumanFaceCaptureInfo'], function () {
  respond.data = {
    'num': 32,
    'pictureUrls': [{
      'id': '1',
      'url': 'www.runoob.com'
    },
    {
      'id': '2',
      'url': 'www.runoob.com'
    },
    {
      'id': '3',
      'url': 'www.runoob.com'
    }
    ]
  }
  return respond
})
// 设置录像计划
Mock.mock(prePath + cmd['plan_save'], function () {
  return respond
})
// 清除录像计划
Mock.mock(prePath + cmd['plan_delete'], function () {
  return respond
})
// 设置录像计划模板
Mock.mock(prePath + cmd['template_update'], function () {
  return respond
})
// 获取录像计划模板
Mock.mock(prePath + cmd['template_list'], function () {
  respond.data = Mock.mock([{
    uuid: 'template01',
    templateName: '全天模板',
    mondaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    tuesdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    wednesdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    thursdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    fridaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    saturdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    sundaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }]
  }, {
    uuid: 'template02',
    templateName: '周末模板',
    mondaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    tuesdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    wednesdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    thursdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    fridaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    saturdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    sundaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }]
  }, {
    uuid: 'template03',
    templateName: '用户模板01',
    mondaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    tuesdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    wednesdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    thursdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    fridaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    saturdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    sundaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }]
  }, {
    uuid: 'template04',
    templateName: '用户模板02',
    mondaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    tuesdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    wednesdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    thursdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    fridaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    saturdaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }],
    sundaySchedule: [{
      type: 1,
      'from|1-20000': 20000,
      'to|30000-50000': 50000
    }, {
      type: 2,
      'from|50000-60000': 50200,
      'to|60500-70000': 70000
    }]
  }])
  return respond
})
// 获取流媒体服务器列表
Mock.mock(prePath + cmd['streamMedia_list'], function () {
  respond.data = {
    'total': 20,
    'rows': [{
      oid: 'oid01',
      streamMediaName: '流媒体服务器01',
      orgId: ['l5', 'l6', 'l7'],
      type: '1',
      ip: '192.168.1.1',
      port: 7000,
      username: 'admin',
      password: '1111'
    }, {
      oid: 'oid02',
      streamMediaName: '流媒体服务器02',
      orgId: ['l8', 'l9'],
      type: '1',
      ip: '192.168.1.2',
      port: 6000,
      username: 'admin',
      password: '2222'
    }, {
      oid: 'oid02',
      streamMediaName: '流媒体服务器03',
      orgId: ['10'],
      type: '2',
      ip: '192.168.1.3',
      port: 500,
      username: 'user',
      password: '2222'
    }]
  }
  return respond
})
// 保存流媒体服务配置
Mock.mock(prePath + cmd['streamMedia_update'], function () {
  return respond
})
// 添加流媒体服务
Mock.mock(prePath + cmd['streamMedia_save'], function () {
  return respond
})
// 删除流媒体服务
Mock.mock(prePath + cmd['streamMedia_delete'], function () {
  return respond
})
// 获取组织树
Mock.mock(prePath + cmd['get_organizations'], function () {
  respond.data = {
    'businessId': null,
    'sourceSysId': null,
    'targetSysId': null,
    'extAttributes': {},
    'uuid': 'c69aeede4f6341929721e2892beec3cb',
    'name': '恒大山水城',
    'children': [{
      'name': '商业666666666666666666666666666666666666666666666666666666666666666666666666666666666666',
      'uuid': '124660355c2d4264a015823ef3f31589'
    },
    {
      'name': '地下停车场',
      'uuid': '2f43a1b69c424231bea65797c7c95462'
    },
    {
      'children': [{
        'children': [{
          'children': [{
            'name': '广州厅',
            'uuid': '50ee7595f5994a3e9807f2a00889fc56'
          },
          {
            'name': '公共区',
            'uuid': 'd9d7b87724b24359b03ff68f5bea16cf'
          }
          ],
          'name': '2F',
          'uuid': 'bcbd824c070e4803b7f51326cf100ef3'
        }],
        'name': '二级节点',
        'uuid': '9f202c47f3de4620967604fdf03624e8'
      }],
      'name': '恒大酒店',
      'uuid': '079f347a41ef467699ebc19999585110934'
    },
    {
      'children': [{
        'children': [{
          'children': [{
            'name': '锦绣厅',
            'uuid': '50ee7595f5994a3e9807f2a00889fc56'
          },
          {
            'name': '宴会区',
            'uuid': 'd9d7b87724b24359b03ff68f5bea16cf'
          }
          ],
          'name': '2F1',
          'uuid': 'bcbd824c070e4803b7f51326cf100ef3'
        }],
        'name': '二级节点1',
        'uuid': '9f202c47f3de4620967604fdf03624e8'
      }],
      'name': '山水城',
      'uuid': '079f347a41ef467699ebc19585110934'
    },
    {
      'name': '别墅',
      'uuid': '124660355c2d4234a015823ef3f31478'
    },
    {
      'name': '住宅区',
      'uuid': '2f43a1b69c024231bea65797c7c92a78'
    }
    ],
    'type': null,
    'isParent': null
  }
  return respond
})
// 根据名称查询自定义组
Mock.mock(prePath + cmd['customgroup_list'], function () {
  let mockData = Mock.mock({
    'data': [{
      'customGroupId': Mock.Random.id(),
      'customGroupName': '中山厅',
      'videos': [{
        'cameraId': 'c69aeede4f6341929721e289222ec',
        'cameraName': '摄像头02111111111111111111111111',
        'order': 1
      }, {
        'cameraId': 'c69aeede4f6341929721e2892beec',
        'cameraName': '摄像头01',
        'order': 0
      }]
    }, {
      'customGroupId': Mock.Random.id(),
      'customGroupName': '恒大山水城恒大山水城恒大山水城恒大山水城恒大山水城',
      'videos': [{
        'cameraId': 'c69aeede4f6341929721e289222ec',
        'cameraName': '摄像头02111111111111111111111111',
        'order': 1
      }]
    }]
  })
  respond.data = mockData.data
  return respond
})
// 获取自定义组下的摄像头
Mock.mock(prePath + cmd['customgroup_get'], function () {
  respond.data = {
    'customGroupId': 'e7eb859cd4ee403eaf41a85a8d29fb14',
    'customGroupName': 'name',
    'videos': [{
      'cameraId': 'c69aeede4f6341929721e289222ec',
      'cameraName': '摄像头02111111111111111111111111',
      'order': 1
    }, {
      'cameraId': 'c69aeede4f6341929721e2892beec',
      'cameraName': '摄像头01',
      'order': 0
    }]
  }
  return respond
})
// 添加自定义组
Mock.mock(prePath + cmd['customgroup_insert'], function () {
  return respond
})
// 删除组
Mock.mock(prePath + cmd['customgroup_delete'], function () {
  return respond
})
// 修改自定义组
Mock.mock(prePath + cmd['customgroup_update'], function () {
  return respond
})
// 获取组织下的摄像头
Mock.mock(prePath + cmd['cameraTree_get'], function () {
  respond.data = {
    'uuid': 'c69aeede4f6341929721e2892beec3cb',
    'name': '恒大山水城',
    'type': null,
    'children': []
  }
  return respond
})
// 根据组织uuid获取组织下的东西
Mock.mock(prePath + cmd['cameraTree_node_get'], function () {
  respond.data = {
    'uuid': 'c69aeede4f6341929721e2892beec3cb',
    'name': '恒大山水城',
    'type': null,
    'children': [{
      'uuid': 'c69aeede4f6341929721e2892beec322',
      'name': '住宅区',
      'type': null,
      'children': null
    }, {
      'uuid': 'c69aeede4f6341929721e2892beec552',
      'name': '恒大酒店',
      'type': null,
      'children': []
    },
    {
      'uuid': 'c69aeede4f6341929721e2892beec',
      'name': '摄像头01111111111111111111111111111111111111111111111111111111111111111111',
      'type': 'camera',
      'children': null
    }, {
      'uuid': 'c69aeede4f6341929721e289222ec',
      'name': '摄像头02',
      'type': 'camera',
      'children': null
    }, {
      'uuid': 'c69aeede4f6341929721eww9222ec',
      'name': '摄像头03',
      'type': 'camera',
      'children': null
    }, {
      'uuid': 'c69aeede4f634eee9721eww9222ec',
      'name': '',
      'type': 'camera',
      'children': null
    }
    ]
  }
  return respond
})
// 球机配置
Mock.mock(prePath + cmd['camera_option_list'], function () {
  respond.data = {
    'total': 2,
    'pageNo': 1,
    'pageSize': 10,
    'rows': [{
      'deviceID': '10032001001899000001',
      'deviceName': 'IPC枪机-1',
      'deviceTypeName': 'camera',
      'deviceIP': '192.168.199.14',
      'devicePort': '8080',
      'installAddress': ''
    },
    {
      'deviceID': '10012001161324132174',
      'deviceName': '宴会厅枪机222',
      'deviceTypeName': 'camera',
      'deviceIP': '1.168.199.200',
      'devicePort': '5060',
      'installAddress': null
    }

    ]
  }
  return respond
})
// 获取电视墙屏幕列表
Mock.mock(prePath + cmd['screen_list'], function () {
  respond.data = [{
    'name': '左一',
    'mainMonitorId': '1',
    'maxChildMonitorNum': 64
  }, {
    'name': '左二',
    'mainMonitorId': '2',
    'maxChildMonitorNum': 64
  }

  ]
  return respond
})
// 获取电视墙一个屏幕的视频接口
Mock.mock(prePath + cmd['screen_option_get'], function () {
  respond.data = {
    'total': 2,
    'pageNo': 1,
    'pageSize': 10,
    'rows': [{
      'monitorId': 1,
      'childMonitorId': 1,
      'deviceCode': 'afadfaere',
      'cameraCode': 'asdfsadfsf',
      'deviceName': '人行通道控制器',
      'subDeviceName': '人证读卡器（闸机',
      'orgName': ' 恒大山水城'
    },
    {
      'monitorId': 1,
      'childMonitorId': 2,
      'deviceCode': 'afadfaere2',
      'cameraCode': 'asdfsadfsf2',
      'deviceName': '人行通道控制器',
      'subDeviceName': '人证读卡器（闸机',
      'orgName': ' 恒大山水城'
    }]
  }

  return respond
})
// 获取电视墙一个屏幕的视频接口
Mock.mock(prePath + cmd['screen_option_delete'], function () {
  return respond
})
// 设置电视墙一个屏幕的通道设置
Mock.mock(prePath + cmd['screen_option_update'], function () {
  return respond
})
