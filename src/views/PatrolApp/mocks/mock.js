import Mock from 'mockjs'
// 查询场景Id
Mock.mock('/redLineManage/listSceneId', 'get', {
  'code': '0',
  'data': [
    {
      'sceneType': '1',
      'options': [
        {
          'courtUuid': 'UNKOWN',
          'orgName': '37栋',
          'centerLon': 116.121332,
          'sceneName': 'Mock小区全图_勿删',
          'scale': 200,
          'updateUser': 'admin',
          'updateTime': 1517395279295,
          'url': 'http://192.168.0.246:8888/group1/M00/0B/07/wKgA9lpvHXWAMXaPABVqJoQfUZE352.png',
          'deleteFlag': 1,
          'createTime': 1517231477298,
          'scaleType': 1,
          'sceneType': 1,
          'countWarning': 3,
          'orgCode': '42e7c47696d8496a8c32a3e095c37e9c',
          'parentArea': '',
          'width': 960,
          'createUser': 'testUser',
          'centerLat': 45.123343,
          'id': 'b8b286b23a5c4336a3568321a5b92356',
          'height': 0
        }
      ]
    },
    {
      'sceneType': '4',
      'options': [
        {
          'realHeight': 950,
          'courtUuid': 'UNKOWN',
          'orgName': '梯控期',
          'sceneName': 'weryup-改',
          'scale': 9736,
          'updateUser': 'admin',
          'updateTime': 1517407270517,
          'url': 'http://192.168.0.246:8888/group1/M00/0C/C4/wKgA9lpxzCaAELb4AAwi051sk34660.jpg',
          'deleteFlag': 1,
          'createTime': 1517392036191,
          'scaleType': 2,
          'sceneType': 4,
          'orgCode': '',
          'width': 0,
          'createUser': 'testUser',
          'id': '3c7891bbca60447d94714135bbd7df65',
          'realWidth': 2630,
          'height': 0
        },
        {
          'courtUuid': 'UNKOWN',
          'orgName': 'fg',
          'sceneName': '猜猜',
          'updateUser': 'admin',
          'updateTime': 1517403709924,
          'url': 'http://192.168.0.246:8888/group1/M00/0C/49/wKgA9lpxaP-AZ1RHAAK8hml0w74008.jpg',
          'deleteFlag': 1,
          'createTime': 1517381874589,
          'sceneType': 4,
          'orgCode': '',
          'parentArea': 'c534c4dd6d114c8eb744c5db5ddc51d2',
          'width': 1920,
          'createUser': 'testUser',
          'id': 'bde830470e0a4965a478992bc59e9ec6',
          'height': 0
        },
        {
          'courtUuid': 'UNKOWN',
          'orgName': 'fg',
          'centerLon': 0,
          'sceneName': 'wqewq',
          'scale': 0,
          'updateUser': 'admin',
          'updateTime': 1517381388328,
          'url': 'http://192.168.0.246:8888/group1/M00/0C/45/wKgA9lpxZxaACZs3AAD_oETcWo0217.jpg',
          'deleteFlag': 1,
          'createTime': 1517381386072,
          'scaleType': 1,
          'sceneType': 4,
          'orgCode': '43dfcf78f94a42229b69caeb8d289eeb',
          'width': 746,
          'createUser': 'testUser',
          'centerLat': 0,
          'id': '827e8135c6ea4c4482b683243f727ec7',
          'height': 470
        },
        {
          'realHeight': 600,
          'courtUuid': 'UNKOWN',
          'orgName': '负1楼停车场',
          'sceneName': '一期停车场负一楼',
          'scale': 3773,
          'updateUser': 'admin',
          'updateTime': 1517359042648,
          'url': 'http://192.168.0.246:8888/group1/M00/0B/63/wKgA9lpxD8aANzzlAACKWI113Kg947.jpg',
          'deleteFlag': 1,
          'createTime': 1517359034157,
          'scaleType': 2,
          'sceneType': 4,
          'orgCode': 'e644e77cb0c74db6a8e05c9181d830d3',
          'width': 650,
          'createUser': 'testUser',
          'id': '0cca8992dbc14c8dade1fefe579523af',
          'realWidth': 800,
          'height': 0
        }
      ]
    }
  ],
  'message': '获取场景ID成功'
})
// 查询红线
Mock.mock('/redLineManage/listRedPoint', 'get', {
  'code': '0',
  'data': [
    {
      'businessId': null,
      'sourceSysId': null,
      'targetSysId': null,
      'extAttributes': {},
      'id': 'c3d30ebd61204c25a072d43ec4dc9ae7',
      'sceneId': '4bbb1d5badc04299a0efdc7335a5b1d1',
      'areaName': 'imyaaqfa',
      'areaType': 6,
      'linkSceneId': null,
      'countCamera': 0,
      'countBroadCast': 0,
      'countWarning': 0,
      'borderPoints': [
        {
          'sceneId': null,
          'gpsLongitude': 5.512,
          'gpsLatitude': 54.456,
          'pointX': 53,
          'pointY': 48,
          'pointType': 1,
          'pointOrder': 1
        },
        {
          'sceneId': null,
          'gpsLongitude': 15.512,
          'gpsLatitude': 54.456,
          'pointX': 43,
          'pointY': 41,
          'pointType': 1,
          'pointOrder': 1
        }
      ],
      'orgId': null,
      'areaDetailInfo': null
    }
  ],
  'message': '查询红线成功'
})

Mock.mock('/PatrolApp/PatrolPointAppList', 'get', {
  'code': '',
  'message': null,
  'data': [
    {
      'uuid': 'cfe4e9c803b34d9088b7cbc4205ab563',
      'pointName': '测试巡查点1',
      'cardNumber': null,
      'mapId': '14561',
      'lng': null,
      'lat': null,
      'xValue': null,
      'yValue': null,
      'remark': '测试1',
      'courtUuid': '123',
      'createTime': 1515982898104,
      'updateTime': 1515982898231,
      'createUser': 'yeguo',
      'updateUser': 'admin'
    },
    {
      'uuid': '42f0c06da120487f8f84b6b93e3310ce',
      'pointName': '测试巡查点2',
      'cardNumber': null,
      'mapId': '14561',
      'lng': null,
      'lat': null,
      'xValue': null,
      'yValue': null,
      'remark': '测试2',
      'courtUuid': '123',
      'createTime': 1515982898280,
      'updateTime': 1515982898280,
      'createUser': 'yeguo',
      'updateUser': 'admin'
    },
    {
      'uuid': 'd802afb59bd64269ba9a1c09ef19ac02',
      'pointName': '测试巡查点3',
      'cardNumber': null,
      'mapId': '14561',
      'lng': null,
      'lat': null,
      'xValue': null,
      'yValue': null,
      'remark': '测试3',
      'courtUuid': '123',
      'createTime': 1515982898288,
      'updateTime': 1515982898288,
      'createUser': 'yeguo',
      'updateUser': 'admin'
    }
  ]
})
Mock.mock('/PatrolApp/select', 'get', {
  'code': '0',
  'data': [
    {
      'sceneType': '1',
      'options': [
        {
          'courtUuid': 'UNKOWN',
          'orgName': '37栋',
          'centerLon': 116.121332,
          'sceneName': '小区全图_勿删',
          'scale': 200,
          'updateUser': 'admin',
          'updateTime': 1517395279295,
          'url': 'http://192.168.0.246:8888/group1/M00/0B/07/wKgA9lpvHXWAMXaPABVqJoQfUZE352.png',
          'deleteFlag': 1,
          'createTime': 1517231477298,
          'scaleType': 1,
          'sceneType': 1,
          'countWarning': 3,
          'orgCode': '42e7c47696d8496a8c32a3e095c37e9c',
          'parentArea': '',
          'width': 960,
          'createUser': 'testUser',
          'centerLat': 45.123343,
          'id': 'b8b286b23a5c4336a3568321a5b92356',
          'height': 0
        }
      ]
    },
    {
      'sceneType': '4',
      'options': [
        {
          'realHeight': 950,
          'courtUuid': 'UNKOWN',
          'orgName': '梯控期',
          'sceneName': 'weryup-改',
          'scale': 9736,
          'updateUser': 'admin',
          'updateTime': 1517407270517,
          'url': 'http://192.168.0.246:8888/group1/M00/0C/C4/wKgA9lpxzCaAELb4AAwi051sk34660.jpg',
          'deleteFlag': 1,
          'createTime': 1517392036191,
          'scaleType': 2,
          'sceneType': 4,
          'orgCode': '',
          'width': 0,
          'createUser': 'testUser',
          'id': '3c7891bbca60447d94714135bbd7df65',
          'realWidth': 2630,
          'height': 0
        },
        {
          'courtUuid': 'UNKOWN',
          'orgName': 'fg',
          'sceneName': '猜猜',
          'updateUser': 'admin',
          'updateTime': 1517403709924,
          'url': 'http://192.168.0.246:8888/group1/M00/0C/49/wKgA9lpxaP-AZ1RHAAK8hml0w74008.jpg',
          'deleteFlag': 1,
          'createTime': 1517381874589,
          'sceneType': 4,
          'orgCode': '',
          'parentArea': 'c534c4dd6d114c8eb744c5db5ddc51d2',
          'width': 1920,
          'createUser': 'testUser',
          'id': 'bde830470e0a4965a478992bc59e9ec6',
          'height': 0
        },
        {
          'courtUuid': 'UNKOWN',
          'orgName': 'fg',
          'centerLon': 0,
          'sceneName': 'wqewq',
          'scale': 0,
          'updateUser': 'admin',
          'updateTime': 1517381388328,
          'url': 'http://192.168.0.246:8888/group1/M00/0C/45/wKgA9lpxZxaACZs3AAD_oETcWo0217.jpg',
          'deleteFlag': 1,
          'createTime': 1517381386072,
          'scaleType': 1,
          'sceneType': 4,
          'orgCode': '43dfcf78f94a42229b69caeb8d289eeb',
          'width': 746,
          'createUser': 'testUser',
          'centerLat': 0,
          'id': '827e8135c6ea4c4482b683243f727ec7',
          'height': 470
        },
        {
          'realHeight': 600,
          'courtUuid': 'UNKOWN',
          'orgName': '负1楼停车场',
          'sceneName': '一期停车场负一楼',
          'scale': 3773,
          'updateUser': 'admin',
          'updateTime': 1517359042648,
          'url': 'http://192.168.0.246:8888/group1/M00/0B/63/wKgA9lpxD8aANzzlAACKWI113Kg947.jpg',
          'deleteFlag': 1,
          'createTime': 1517359034157,
          'scaleType': 2,
          'sceneType': 4,
          'orgCode': 'e644e77cb0c74db6a8e05c9181d830d3',
          'width': 650,
          'createUser': 'testUser',
          'id': '0cca8992dbc14c8dade1fefe579523af',
          'realWidth': 800,
          'height': 0
        }
      ]
    }
  ]
})
Mock.mock('/PatrolApp/CrewPlan', 'get', {
  'errMsg': null,
  'success': 'true',
  'data': {
    'total': 100,
    'pageNo': 1,
    'rows|90': [
      {
        'date|+1': 1,
        'planName|+1': ['王小虎', '王大虎', '王老虎', '虎不虎', '还是虎', '王小虎'],
        'paramId|+1': ['上海市普陀区金沙江路 1518 弄', '上海市普陀区金沙江路 1519 弄'],
        'startTime|+1': ['2016-05-03', '2016-05-06'],
        'beginTime|+1': ['2017-05-03', '2017-05-06']
      }
    ]
  }
})

Mock.mock('/PatrolApp/HistoryTask', 'get', {
  'errMsg': null,
  'success': 'true',
  'data': {
    'total': 100,
    'pageNo': 1,
    'rows|90': [
      {
        'date|+1': 1,
        'startPlanTime|+1': ['2016-05-03', '2016-05-06', '2016-05-06', '2016-05-06', '2017-05-06', '2017-05-03'],
        'paramsId|+1': ['巡查参数1', '巡查参数2'],
        'deviceId|+1': ['单兵1', '单兵2'],
        'userId|+1': ['张三', '李四'],
        'taskStatus|+1': ['正常', '异常']
      }
    ]
  }
})

Mock.mock('/PatrolApp/PlanInfo', 'get', {
  'errMsg': null,
  'success': 'true',
  'data': {
    'total': 100,
    'pageNo': 1,
    'rows|90': [
      {
        'date|+1': 1,
        'startTime|+1': ['2016-05-03', '2016-05-06', '2016-05-06', '2016-05-06', '2017-05-06', '2017-05-03'],
        'parameter|+1': ['巡查参数1', '巡查参数2'],
        'requipments|+1': ['单兵1', '单兵2']
      }
    ]
  }
})

Mock.mock('/PatrolApp/PatrolParamApp', 'get', {
  'errMsg': null,
  'success': 'true',
  'data': {
    'rows|6': [
      {
        'order|+1': 1,
        'parameterName|+1': ['Wulian720p摄像头', '中兴Memo', '微软 LifeCam HD', '罗技Pro C920'],
        'equipment|+1': ['中兴1号', '中兴2号'],
        'startTime|+1': ['8:00', '8:20', '8:40', '8:50', '9:00']
      }
    ]
  }
})

Mock.mock('/PatrolApp/ParameterSave', 'get', {
  'errMsg': null,
  'success': 'true',
  'data': {
    'rows|5': [
      {
        'date|+1': 1,
        'name|+1': ['小虎1', '小虎2', '小虎3', '小虎4', '小虎5', '小虎6'],
        'address|+1': ['普陀区金沙江路1', '普陀区金沙江路2']
      }
    ]
  }
})

Mock.mock('/PatrolApp/PatrolChoose', 'get', {
  'errMsg': null,
  'success': 'true',
  'data': {
    'rows': [
      { 'uuid': '0101011', 'pointId': '001', 'interval': '15', 'paramId': '00110011', 'pointName': '巡查点1' },
      { 'uuid': '0101022', 'pointId': '002', 'interval': '12', 'paramId': '00110012', 'pointName': '巡查点2' },
      { 'uuid': '0101033', 'pointId': '003', 'interval': '10', 'paramId': '00110013', 'pointName': '巡查点3' },
      { 'uuid': '0101044', 'pointId': '004', 'interval': '18', 'paramId': '00110014', 'pointName': '巡查点4' },
      { 'uuid': '0101045', 'pointId': '004', 'interval': '18', 'paramId': '00110014', 'pointName': '巡查点5' },
      { 'uuid': '0101046', 'pointId': '004', 'interval': '18', 'paramId': '00110014', 'pointName': '巡查点6' },
      { 'uuid': '0101047', 'pointId': '004', 'interval': '18', 'paramId': '00110014', 'pointName': '巡查点7' }
    ]
  }
})

Mock.mock('/PatrolApp/PatrolPointApp', 'get', {
  'errMsg': null,
  'success': 'true',
  'data': {
    'rows|10': [
      {
        'pointName|+1': ['巡更点名称1', '巡更点名称2'],
        'remark|+1': ['abc12345', 'abc']
      }
    ]
  }
})

Mock.mock('/PatrolApp/components/dialogs/CheckResult', 'get', {
  'errMsg': null,
  'success': 'true',
  'data': {
    'date|+1': 1,
    'resultname|+1': ['2016-05-03', '2016-05-06', '2016-05-06', '2016-05-06', '2017-05-06', '2017-05-03'],
    'pointtime|+1': ['2016-05-03', '2016-05-06', '2016-05-06'],
    'result|+1': ['异常', '正常'],
    'reason|+1': ['母鸡', '正常']
  }
})

// Mock.mock('/PatrolApp/TimeoutAlarmEvent', 'get', {
//   'errMsg': null,
//   'success': 'true',
//   'data': {
//     'rows': [
//       {
//         'date|+1': 1,
//         'startTime|+1': ['2016-05-03', '2016-05-06', '2016-05-06', '2016-05-06', '2017-05-06', '2017-05-03'],
//         'parameter|+1': ['超时报警'],
//         'descrlbe|+1': ['西南角越界'],
//         'state|+1': ['已处理', '未处理']
//       }
//     ]
//   }
// })
