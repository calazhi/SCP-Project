import Mock from 'mockjs'
Mock.mock('/infoApp/material/list', 'get', {
  'errMsg': null,
  'success': 'true',
  'data': {
    'totalPage': 1,
    'pageSize': 10,
    'pageNo': 1,
    'total': 7,
    'datas': [ // |1-100
      {
        'id': '028317f2f29c4712ae279284aac0c2bb',
        'mediaName': '规范',
        'size': '350.0KB',
        'meidaType': 4,
        'meidaTypeDescription': 'PDF文档',
        'mediaUrl': null,
        'description': null,
        'approveState': null,
        'createUser': 'admin',
        'updateUser': null,
        'duration': null,
        'materialFormat': null,
        'createTime': '2018-01-12 09:34:23'
      }
    ]
  }
})
Mock.mock('/infoApp/material/delete', 'get', {
  'errMsg': null,
  'success|+1': ['true', 'false'],
  'data': null
})
Mock.mock('/infoApp/material/add', 'get', {
  'errMsg': null,
  'success': 'true',
  'data': {
    'totalPage': 1,
    'pageSize': 10,
    'pageNo': 1,
    'total': 1,
    'datas': [
      {
        'programName': 'string',
        'type': 'normal',
        'description': 'string',
        'playTime': null,
        'createTime': '2018-01-12 17:40:17',
        'createUser': 'admin',
        'approveState': 'approved',
        'id': '7652893dd7ba4aa890379d654ff32ab6'
      }
    ]
  }
})
// Mock.mock('/infoApp/program/getScreenConfig', 'get', {
//   'code': '00000',
//   'errMsg': null,
//   'success': 'true',
//   'message': 'success',
//   'data': [
//     {
//       'positionX': 0,
//       'positionY': 0,
//       'width': 1920,
//       'height': 1700,
//       'id': 0
//     },
//     {
//       'positionX': 0,
//       'positionY': 1700,
//       'width': 1920,
//       'height': 220,
//       'id': 1
//     }
//   ]
// })
// 日程管理mock数据
Mock.mock('/infoApp/material/Pagelist', 'get', {
  'code': '00000',
  'data': {
    'totalPage': 1,
    'pageSize': 30,
    'pageNo': 1,
    'total': 2,
    'datas': [
      {
        'id': '1',
        'scheduleName': 'TestSchedule1',
        'scheduleType': '2',
        'typeDescription': '按周播放',
        'programNo': null,
        'createUser': 'admin',
        'createTime': '2018-01-15 08:53:28',
        'publishState': '未发布',
        'dailySchedule': null,
        'weekySchedule': null
      },
      {
        'id': '2',
        'scheduleName': 'TestSchedule',
        'scheduleType': '2',
        'typeDescription': '按日播放',
        'programNo': null,
        'createUser': 'admin',
        'createTime': '2018-01-15 08:53:28',
        'publishState': '未发布',
        'dailySchedule': null,
        'weekySchedule': null
      }
    ]
  },
  'message': 'success'
})
// 获取节目列表mock数据
Mock.mock('/infoApp/material/listAll', 'get', {
  'code': '00000',
  'data': [
    {
      'id': '7652893dd7ba4aa890379d654ff32ab6',
      'name': 'string'
    },
    {
      'id': 'be33c731ca884bfc86f4b002de084016',
      'name': 'string'
    }
  ],
  'message': 'success'
})
// 获取设备数据
Mock.mock('/scp-informationreleaseapp/schedule/device/list/demo', 'get', {
  'code': '00000',
  'data': [
    {
      'deviceID': '024232343240',
      'deviceName': 'sdfwfsfjwle;f0',
      'deviceDesc': 'jklspdfwe',
      'orgName': 'sdfsdfsdf',
      'installAddress': 'sdfsdfsdf',
      'subDevice': [
        {
          'subDeviceID': '0s23535344230',
          'subDeviceName': 'sdfjweifljsdf 0',
          'subDeviceDesc': 'sdfsdfdf',
          'subDeviceTypeCode': 'Fsfjwef;jsd f',
          'subDeviceTypeName': null,
          'subOrgName': 'sdfsdfsdfsdf',
          'subDeviceInstallAddress': 's就开始大范围飞机扣水电费'
        },
        {
          'subDeviceID': '192s23535344231',
          'subDeviceName': 'sdfjweifljsdf 1',
          'subDeviceDesc': 'sdfsdfdf',
          'subDeviceTypeCode': 'Fsfjwef;jsd f',
          'subDeviceTypeName': null,
          'subOrgName': 'sdfsdfsdfsdf',
          'subDeviceInstallAddress': 's就开始大范围飞机扣水电费'
        }]
    }
  ],
  'message': 'success'
})
