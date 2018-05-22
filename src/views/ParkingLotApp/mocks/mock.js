
import Mock from 'mockjs'

Mock.mock('http://localhost:8088/user/list?page=1&pageSize=10&name=&address=', function () {
  console.log('mock getTree')
  return {
    'id': 1,
    'parentId': '0',
    'name': 'root'
  }
})
// 去缴费
Mock.mock('scp-parkinglotapp/authMgmt/toPay', function () {
  console.log('缴费')
  return {
    'id': 1,
    'code': '0',
    'message': '成功'
  }
})

Mock.mock('/scp-parkinglotapp/authMgmt/queryAuths?page=1&pageSize=10&carNum=', function () {
  console.log('mock getTree')
  return {
    'code': '0',
    'data': {
      'currentPage': 1,
      'pageSize': 10,
      'total': 2,
      'start': 1,
      'end': 0,
      'rows': [
        {
          'id': 'f5b4c72a41ad43ac8f59eab7d2dd9319',
          'ownerId': '1002',
          'ownerName': '战三',
          'carId': null,
          'carNum': '粤B-1111',
          'authParkIds': null,
          'authParkNames': 'HDZC0001',
          'parkSeatId': null,
          'parkSeatCode': 'PC00001',
          'ruleId': null,
          'ruleName': '111',
          'beginTime': '',
          'endTime': '',
          'remark': ''
        },
        {
          'id': 'c4c4e2ba11e84bf6aba644e191bc800f',
          'ownerId': '1002',
          'ownerName': null,
          'carId': null,
          'carNum': '粤V-1111',
          'authParkIds': null,
          'authParkNames': '恒大增城停车场',
          'parkSeatId': null,
          'parkSeatCode': 'CW0001',
          'ruleId': null,
          'ruleName': '111',
          'beginTime': '',
          'endTime': '',
          'remark': ''
        }
      ],
      'count': 2,
      'pages': 0
    },
    'message': ''
  }
})

// 计费
Mock.mock('/scp-parkinglotapp/chargeMgmt/', function () {
  return {
    code: 0,
    data: [{
      'id': 'xxx',
      'name': '临停收费标准',
      'type': 'interval',
      'chargeInfo': [{
        'carType': '0',
        'available': true,
        'freeTime': {
          'time': '10',
          'isContain': true
        },
        'highestFee': '50',
        'chargeDetail': {
          'peakPeriod': {
            'startTime': '8:00',
            'endTime': '20:00',
            'cash': '3.5',
            'each': '30'
          },
          'nonPeakPeriod': {
            'startTime': '20:00',
            'endTime': '8:00',
            'cash': '2.0',
            'each': '30'
          }
        }
      },
      {
        'carType': '1',
        'available': true,
        'freeTime': {
          'time': '20',
          'isContain': false
        },
        'highestFee': '100',
        'chargeDetail': {
          'peakPeriod': {
            'startTime': '8:00',
            'endTime': '20:00',
            'cash': '5.0',
            'each': '30'
          },
          'nonPeakPeriod': {
            'startTime': '20:00',
            'endTime': '8:00',
            'cash': '4.0',
            'each': '30'
          }
        }
      },
      {
        'carType': '2',
        'available': true,
        'freeTime': {
          'time': '30',
          'isContain': false
        },
        'highestFee': '200',
        'chargeDetail': {
          'peakPeriod': {
            'startTime': '8:00',
            'endTime': '20:00',
            'cash': '7.5',
            'each': '30'
          },
          'nonPeakPeriod': {
            'startTime': '20:00',
            'endTime': '8:00',
            'cash': '5.5.0',
            'each': '30'
          }
        }
      },
      {
        'carType': '3',
        'available': false,
        'freeTime': {
          'time': '5',
          'isContain': true
        },
        'highestFee': '20',
        'chargeDetail': {
          'peakPeriod': {
            'startTime': '8:00',
            'endTime': '20:00',
            'cash': '3.5',
            'each': '30'
          },
          'nonPeakPeriod': {
            'startTime': '20:00',
            'endTime': '8:00',
            'cash': '1.0',
            'each': '30'
          }
        }
      }]
    }, {
      'id': 'xxx',
      'name': '临停收费标准11',
      'type': 'time',
      'chargeInfo': [{
        'carType': '0',
        'available': false,
        'freeTime': {
          'time': '10',
          'isContain': false
        },
        'highestFee': '50',
        'chargeDetail': {
          'peakPeriod': {
            'startTime': '8:00',
            'endTime': '20:00',
            'cash': '3.5',
            'each': '30'
          },
          'nonPeakPeriod': {
            'startTime': '20:00',
            'endTime': '8:00',
            'cash': '2.0',
            'each': '30'
          }
        }
      },
      {
        'carType': '1',
        'available': true,
        'freeTime': {
          'time': '20',
          'isContain': true
        },
        'highestFee': '100',
        'chargeDetail': {
          'peakPeriod': {
            'startTime': '8:00',
            'endTime': '20:00',
            'cash': '5.0',
            'each': '30'
          },
          'nonPeakPeriod': {
            'startTime': '20:00',
            'endTime': '8:00',
            'cash': '4.0',
            'each': '30'
          }
        }
      },
      {
        'carType': '2',
        'available': false,
        'freeTime': {
          'time': '30',
          'isContain': true
        },
        'highestFee': '200',
        'chargeDetail': {
          'peakPeriod': {
            'startTime': '8:00',
            'endTime': '20:00',
            'cash': '7.5',
            'each': '30'
          },
          'nonPeakPeriod': {
            'startTime': '20:00',
            'endTime': '8:00',
            'cash': '5.5.0',
            'each': '30'
          }
        }
      },
      {
        'carType': '3',
        'available': false,
        'freeTime': {
          'time': '5',
          'isContain': true
        },
        'highestFee': '20',
        'chargeDetail': {
          'peakPeriod': {
            'startTime': '8:00',
            'endTime': '20:00',
            'cash': '3.5',
            'each': '30'
          },
          'nonPeakPeriod': {
            'startTime': '20:00',
            'endTime': '8:00',
            'cash': '1.0',
            'each': '30'
          }
        }
      }]
    }, {
      'id': 'xxx',
      'name': '临停收费标准2',
      'type': 'interval',
      'chargeInfo': [{
        'carType': '0',
        'available': false,
        'freeTime': {
          'time': '10',
          'isContain': true
        },
        'highestFee': '50',
        'chargeDetail': {
          'peakPeriod': {
            'startTime': '8:00',
            'endTime': '20:00',
            'cash': '3.5',
            'each': '30'
          },
          'nonPeakPeriod': {
            'startTime': '20:00',
            'endTime': '8:00',
            'cash': '2.0',
            'each': '30'
          }
        }
      },
      {
        'carType': '1',
        'available': false,
        'freeTime': {
          'time': '20',
          'isContain': true
        },
        'highestFee': '100',
        'chargeDetail': {
          'peakPeriod': {
            'startTime': '8:00',
            'endTime': '20:00',
            'cash': '5.0',
            'each': '30'
          },
          'nonPeakPeriod': {
            'startTime': '20:00',
            'endTime': '8:00',
            'cash': '4.0',
            'each': '30'
          }
        }
      },
      {
        'carType': '2',
        'available': true,
        'freeTime': {
          'time': '30',
          'isContain': true
        },
        'highestFee': '200',
        'chargeDetail': {
          'peakPeriod': {
            'startTime': '8:00',
            'endTime': '20:00',
            'cash': '7.5',
            'each': '30'
          },
          'nonPeakPeriod': {
            'startTime': '20:00',
            'endTime': '8:00',
            'cash': '5.5.0',
            'each': '30'
          }
        }
      },
      {
        'carType': '3',
        'available': false,
        'freeTime': {
          'time': '5',
          'isContain': true
        },
        'highestFee': '20',
        'chargeDetail': {
          'peakPeriod': {
            'startTime': '8:00',
            'endTime': '20:00',
            'cash': '3.5',
            'each': '30'
          },
          'nonPeakPeriod': {
            'startTime': '20:00',
            'endTime': '8:00',
            'cash': '1.0',
            'each': '30'
          }
        }
      }]
    }]
  }
})

// 新增计费
Mock.mock('/scp-parkinglotapp/feeMgmt/addFee', function () {
  console.log('新增计费')
  return {
    'id': 1,
    'code': '0',
    'message': '新增成功'
  }
})
