import Mock from 'mockjs'

// 获取报警数据
Mock.mock('/CommunitySafetyApp/list/', function () {
  // console.log('mock audiolist')
  return {
    statue: true,
    code: 200,
    message: 'success',
    data: [
      {
        'id': '1',
        'menuName': '报警IO',
        'menuCode': '10',
        'children': [
          {
            'menuName': '用户管理',
            'menuCode': '11'
          },
          {
            'menuName': '角色管理',
            'menuCode': '12',
            'children': [
              {
                'menuName': '管理员',
                'menuCode': '121'
              },
              {
                'menuName': 'CEO',
                'menuCode': '122'
              },
              {
                'menuName': 'CFO',
                'menuCode': '123'
              },
              {
                'menuName': 'COO',
                'menuCode': '124'
              },
              {
                'menuName': '普通人',
                'menuCode': '124'
              }
            ]
          },
          {
            'menuName': '权限管理',
            'menuCode': '13'
          }
        ]
      },
      {
        'id': '2',
        'menuName': '普通监控点',
        'menuCode': ''
      },
      {
        'id': '3',
        'menuName': '智能监控点',
        'menuCode': '30',
        'children': [
          {
            'menuName': '订单列表',
            'menuCode': '31'
          },
          {
            'menuName': '退货列表',
            'menuCode': '32',
            'children': []
          }
        ]
      },
      {
        'id': '4',
        'menuName': '设备报警',
        'menuCode': '',
        'children': []
      }
    ],
    tableData7: [{
      linkage: '广播联动'
    }, {
      linkage: '抓图联动'
    }, {
      linkage: '录像联动'
    }, {
      linkage: '开门联动'
    }],
    tableData5: [{
      id: 1,
      eventType: '开门',
      eventSourceCode: '123',
      creator: '管理员1',
      operate: '按下'
    }, {
      id: 2,
      eventType: '开门',
      eventSourceCode: '123',
      creator: '管理员1',
      operate: '按下'
    }, {
      id: 3,
      eventType: '开门',
      eventSourceCode: '123',
      creator: '管理员1',
      operate: '按下'
    }, {
      id: 4,
      eventType: '开门',
      eventSourceCode: '123',
      creator: '管理员1',
      operate: '按下'
    }],
    eventData: [
      {
        'eventLogId': 'e001',
        'eventTypeName': '开门',
        'startTime': '2017-12-02 08:14:05',
        'endTime': '2018-01-05 22:14:05',
        'content': '开门',
        'deviceName': '1号传感器',
        'deviceCode': 'HD-S001',
        'statusMessage': '事件开始'
      },
      {
        'eventLogId': 'e002',
        'eventTypeName': '人脸抓拍',
        'startTime': '2017-12-02 08:14:05',
        'endTime': '2018-01-05 22:14:05',
        'content': '人脸抓拍',
        'deviceName': '1号摄像头',
        'deviceCode': 'HD-S001',
        'statusMessage': '事件脉冲'
      },
      {
        'eventLogId': 'e003',
        'eventTypeName': '开门',
        'startTime': '2017-12-02 08:14:05',
        'endTime': '2018-01-05 22:14:05',
        'content': '开门',
        'deviceName': '2号传感器',
        'deviceCode': 'HD-S001',
        'statusMessage': '事件结束'
      },
      {
        'eventLogId': 'e004',
        'eventTypeName': '人脸抓拍',
        'startTime': '2017-12-02 08:14:05',
        'endTime': '2018-01-05 22:14:05',
        'content': '人脸抓拍',
        'deviceName': '2号摄像头',
        'deviceCode': 'HD-S002',
        'statusMessage': '事件脉冲'
      }
    ],
    eventDetail: {
      'personName': '张三',
      'Sex': '女',
      'params': '汉',
      'IDType': '中国',
      'IDNumber': '511222199506012222',
      'vcount': '88',
      'result': '联动呼梯成功！'
    }
  }
})

Mock.mock(
  // '/scp-commonitysafetyapp/trigger/rule/list',
  'get', {
    'code': '0000',
    'message': '',
    'data': {
      'rows|1-100': [
        {
          'triggerRuleId|1-1000000': 999,
          'eventTypeName|+1': ['1111', '3222', '33333'],
          'eventSourceCode|+1': ['1111', '3222', '33333'],
          'creator|+1': ['asdfa', 'asdfsdf', 'asdfasdf'],
          'sequential|+1': [true, false]
        }
      ],
      pageNo: 1,
      pageSize: 15,
      total: 10
    }
  })
Mock.mock(
  // '/scp-commonitysafetyapp/trigger/rule/tree',
  'get',
  {
    'code': '200',
    'message': '',
    'success': true,
    'data': {
      'uuId': 'e9cb9549f7e24660b80b5b3c400639dc',
      'label': '恒大山水城',
      'children': [
        {
          'uuId': '124660355c2d4234a015823ef3f31478',
          'label': '别墅',
          'children': [],
          'parent': false,
          'checked': false
        },
        {
          'uuId': '079f347a41ef467699ebc19585110934',
          'label': '恒大酒店',
          'children': [
            {
              'uuId': '9f202c47f3de4620967604fdf03624e8',
              'label': 'poc1',
              'children': [
                {
                  'uuId': 'bcbd824c070e4803b7f51326cf100ef3',
                  'label': '2F',
                  'children': [
                    {
                      'uuId': '50ee7595f5994a3e9807f2a00889fc56',
                      'label': '广州厅',
                      'children': [
                        {
                          'uuId': '50ee7595f5994a3e9807f2a00889fc34',
                          'label': 'xxxxxx梯1',
                          'deviceId': 'f23423rrwe23233',
                          'isDevice': true,
                          'children': [],
                          'parent': false,
                          'checked': false
                        }, {
                          'uuId': '50ee7595f5994a3e9807f2a00889fc45',
                          'label': 'xxxxxx梯2',
                          'deviceId': 'f23423rrwe23253',
                          'isDevice': true,
                          'children': [],
                          'parent': false,
                          'checked': false
                        }, {
                          'uuId': '50ee7595f5994a3e9807f2a00889fc36',
                          'label': 'xxxxxx梯3',
                          'deviceId': 'f23423rrwe23263',
                          'isDevice': true,
                          'children': [],
                          'parent': false,
                          'checked': false
                        }
                      ],
                      'parent': false,
                      'checked': false
                    },
                    {
                      'uuId': 'd9d7b87724b24359b03ff68f5bea16cf',
                      'label': '公共区',
                      'children': [],
                      'parent': false,
                      'checked': false
                    }
                  ],
                  'parent': false,
                  'checked': false
                }
              ],
              'parent': false,
              'checked': false
            }
          ],
          'parent': false,
          'checked': false
        },
        {
          'uuId': '2f43a1b69c024231bea65797c7c92a78',
          'label': '住宅区',
          'children': [],
          'parent': false,
          'checked': false
        }
      ],
      'parent': false,
      'checked': false
    }
  })
Mock.mock(
  // '/scp-commonitysafetyapp/resource/triggerType/list',
  'get',
  {
    'code': '200',
    'success': true,
    'data': [
      {
        'name': '联动呼梯',
        'value': 'FAC_CALLING',
        'code': '2016',
        'to': 'MSG/EVENT/LIFTCONTROL'
      },
      {
        'name': '抓拍联动',
        'value': 'CATCH_CALLING',
        'code': '2009',
        'to': 'MSG/EVENT/CATCH'
      }
    ],
    'errorMessage': null
  }
)

Mock.mock(
  // '/scp-commonitysafetyapp/trigger/rule/get',
  'get',
  {
    'code': '200',
    'success': true,
    /* eslint-disable quotes */
    'data': { "deviceType": "2001", "triggerId": "", "isSequential": true, "eventType": 20009, "eventSourceCode": "f23423rrwe23253", "triggers": [{ "method": "FAC_CALLING", "to": "MSG/EVENT/LIFTCONTROL", "params": { "deviceId": "f23423rrwe23233", "sourceLists": "[{\"uuId\":\"50ee7595f5994a3e9807f2a00889fc34\",\"label\":\"xxxxxx梯1\",\"deviceId\":\"f23423rrwe23233\",\"isDevice\":true,\"children\":[],\"parent\":false,\"checked\":false}]" } }, { "method": "CATCH_CALLING", "to": "MSG/EVENT/CATCH", "params": { "deviceId": "f23423rrwe23263", "sourceLists": "[{\"uuId\":\"50ee7595f5994a3e9807f2a00889fc36\",\"label\":\"xxxxxx梯3\",\"deviceId\":\"f23423rrwe23263\",\"isDevice\":true,\"children\":[],\"parent\":false,\"checked\":false}]" } }] }
  }
)
