import Mock from 'mockjs'
Mock.mock('/LadderControlApp/AuthApp/list', 'get', {
  'code': '00000',
  'success': 'true',
  'data': {
    'totalCount': 12,
    'pageNo': 1,
    'pageSize': 10,
    'totalPage': 12,
    'ladderEventLogVos': [
      {
        'holderName': '张三',
        'machinName': '1号电梯',
        'entranceName': '1号电梯',
        'cardId': '111111111111111111111111111111111111111',
        'eventType': '1',
        'createTime': '2017-12-12',
        'stopTime': '2017-12-12'
      },
      {
        'holderName': '张三',
        'machinName': '1号电梯',
        'entranceName': '1号电梯',
        'cardId': '111111111111111111111111111111111111111',
        'eventType': '1',
        'createTime': '2017-12-12',
        'stopTime': '2017-12-12'
      },
      {
        'holderName': '张三',
        'machinName': '1号电梯',
        'entranceName': '1号电梯',
        'cardId': '111111111111111111111111111111111111111',
        'eventType': '1',
        'createTime': '2017-12-12',
        'stopTime': '2017-12-12'
      },
      {
        'holderName': '张三',
        'machinName': '1号电梯',
        'entranceName': '1号电梯',
        'cardId': '111111111111111111111111111111111111111',
        'eventType': '1',
        'createTime': '2017-12-12',
        'stopTime': '2017-12-12'
      },
      {
        'holderName': '张三',
        'machinName': '1号电梯',
        'entranceName': '1号电梯',
        'cardId': '111111111111111111111111111111111111111',
        'eventType': '1',
        'createTime': '2017-12-12',
        'stopTime': '2017-12-12'
      },
      {
        'holderName': '张三',
        'machinName': '1号电梯',
        'entranceName': '1号电梯',
        'cardId': '111111111111111111111111111111111111111',
        'eventType': '1',
        'createTime': '2017-12-12',
        'stopTime': '2017-12-12'
      },
      {
        'holderName': '张三',
        'machinName': '1号电梯',
        'entranceName': '1号电梯',
        'cardId': '111111111111111111111111111111111111111',
        'eventType': '1',
        'createTime': '2017-12-12',
        'stopTime': '2017-12-12'
      },
      {
        'holderName': '张三',
        'machinName': '1号电梯',
        'entranceName': '1号电梯',
        'cardId': '111111111111111111111111111111111111111',
        'eventType': '1',
        'createTime': '2017-12-12',
        'stopTime': '2017-12-12'
      },
      {
        'holderName': '张三',
        'machinName': '1号电梯',
        'entranceName': '1号电梯',
        'cardId': '111111111111111111111111111111111111111',
        'eventType': '1',
        'createTime': '2017-12-12',
        'stopTime': '2017-12-12'
      },
      {
        'holderName': '张三',
        'machinName': '1号电梯',
        'entranceName': '1号电梯',
        'cardId': '111111111111111111111111111111111111111',
        'eventType': '1',
        'createTime': '2017-12-12',
        'stopTime': '2017-12-12'
      },
      {
        'holderName': '张三',
        'machinName': '1号电梯',
        'entranceName': '1号电梯',
        'cardId': '111111111111111111111111111111111111111',
        'eventType': '1',
        'createTime': '2017-12-12',
        'stopTime': '2017-12-12'
      },
      {
        'holderName': '张三',
        'machinName': '1号电梯',
        'entranceName': '1号电梯',
        'cardId': '111111111111111111111111111111111111111',
        'eventType': '1',
        'createTime': '2017-12-12',
        'stopTime': '2017-12-12'
      }
    ]
  }
})
Mock.mock('/LadderControlApp/event/list', 'get', {
  'code': '00000',
  'success': 'true',
  'data': {
    'pageNo': 1,
    'pageSize': 20,
    'totalCount': 4,
    'callLadderlogList': [
      {
        'holderName': '张三',
        'cardeId': 'a123',
        'machinName': '2号电梯',
        'entranceName': '2号电梯',
        'eventType': '1',
        'createTime': '2014-10-11 10:10:00',
        'stopTime': '2014-10-11 10:10:00'
      },
      {
        'holderName': '李四',
        'cardeId': 'a123',
        'machinName': '3号电梯',
        'entranceName': '3号电梯',
        'eventType': '2',
        'createTime': '2014-10-11 10:10:00',
        'stopTime': '2014-10-11 10:10:00'
      },
      {
        'holderName': '王二',
        'cardeId': 'a123',
        'machinName': '4号电梯',
        'entranceName': '4号电梯',
        'eventType': '0',
        'createTime': '2014-10-11 10:10:00',
        'stopTime': '2014-10-11 10:10:00'
      },
      {
        'holderName': '赵四',
        'cardeId': 'a123',
        'machinName': '5号电梯',
        'entranceName': '5号电梯',
        'eventType': '0',
        'createTime': '2014-10-11 10:10:00',
        'stopTime': '2014-10-11 10:10:00'
      }
    ]
  }
})
Mock.mock('/LadderControlApp/AuthApp/equipment', 'get', {
  'code': '00000',
  'success': 'true',
  'data': [
    {
      'deviceID': '1004201658FCDB000001',
      'deviceName': 'elevator_controller',
      'orgID': '50ee7595f5994a3e9807f2a00889fc56',
      'orgName': '恒大山水城恒大酒店poc12F广州厅',
      'startFloor': 6,
      'endFloor': 13,
      'selectFloors': [],
      'childrens': []
    },
    {
      'deviceID': '1004201658FCDBD8341E',
      'deviceName': 'elevator_controller',
      'orgID': '50ee7595f5994a3e9807f2a00889fc56',
      'orgName': '恒大山水城恒大酒店poc12F广州厅',
      'startFloor': 6,
      'endFloor': 13,
      'childrens': [
        {
          'childrenDeviceID': '30370000000000010002',
          'childrenDeviceName': '电梯轿厢IC卡读头',
          'startFloor': 6,
          'endFloor': 13,
          'selectFloors': [],
          'childrenOrgID': '50ee7595f5994a3e9807f2a00889fc56',
          'childrenOrgName': '恒大山水城恒大酒店poc12F广州厅'
        },
        {
          'childrenDeviceID': '30370000000000000001',
          'childrenDeviceName': '电梯轿厢IC卡读头',
          'startFloor': 6,
          'endFloor': 13,
          'selectFloors': [],
          'childrenOrgID': null,
          'childrenOrgName': null
        }
      ]
    }
  ]
})
Mock.mock('/LadderControlApp/AuthApp/dio', 'get', {
  'errMsg': null,
  'success': 'true',
  'data': [
    {
      'uuid': '1',
      'holderName': '张三',
      'orgVo': {
        'houseUuid': '1-1',
        'houseName': '楼幢1',
        'unit': '1单元',
        'floor': '3'
      }
    },
    {
      'uuid': '2',
      'holderName': '李四',
      'orgVo': {
        'uuid': '2-1',
        'name': '楼幢2',
        'unit': '1单元',
        'floor': '4'
      }
    },
    {
      'uuid': '3',
      'holderName': '王五',
      'orgVo': {
        'uuid': '23-1',
        'name': '楼幢23',
        'unit': '1单元',
        'floor': '23'
      }

    }
  ]
})
