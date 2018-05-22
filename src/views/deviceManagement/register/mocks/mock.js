import Mock from 'mockjs'

Mock.mock('/devicemgmt/register/getDeviceTypeList', function () {
  console.log('mock getDeviceTypeList')
  return {
    'pageCount': 0,
    'deviceCategoryList': [
      {
        'uuid': '6a37695bca0943b399611ebe96df0613',
        'type': '2001',
        'typeName': 'camera',
        'typeDesc': '摄像头',
        'parentUuid': null,
        'typeModel': null,
        'hardwareVersion': null,
        'softwareVersion': null,
        'providerCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      },
      {
        'uuid': '0aa6e6218bd5412dbed5ff4a05c75269',
        'type': '2002',
        'typeName': 'ballhead_camera',
        'typeDesc': '球机',
        'parentUuid': null,
        'typeModel': null,
        'hardwareVersion': null,
        'softwareVersion': null,
        'providerCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      },
      {
        'uuid': '57c5b3bd1e104cfeab1ffbf9e337e193',
        'type': '2009',
        'typeName': 'door_access_controller',
        'typeDesc': '门禁控制器',
        'parentUuid': null,
        'typeModel': null,
        'hardwareVersion': null,
        'softwareVersion': null,
        'providerCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      },
      {
        'uuid': 'b8cc6692428d4953a081b10b8e9b181d',
        'type': '2010',
        'typeName': 'door_appliance',
        'typeDesc': '门禁一体机',
        'parentUuid': null,
        'typeModel': null,
        'hardwareVersion': null,
        'softwareVersion': null,
        'providerCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      },
      {
        'uuid': '2839cc545c1f4891afd4d2330098f5cb',
        'type': '2015',
        'typeName': 'brake_channel_controller',
        'typeDesc': '闸机通道控制器',
        'parentUuid': null,
        'typeModel': null,
        'hardwareVersion': null,
        'softwareVersion': null,
        'providerCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      },
      {
        'uuid': 'bb8cf4b0e79b443a8231296f79870059',
        'type': '2016',
        'typeName': 'elevator_controller',
        'typeDesc': '电梯控制器',
        'parentUuid': null,
        'typeModel': null,
        'hardwareVersion': null,
        'softwareVersion': null,
        'providerCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      }
    ]
  }
})

Mock.mock('/devicemgmt/register/getAttrList/6a37695bca0943b399611ebe96df0613', function () {
  return {
    'pageCount': 0,
    'deviceAttrList': [
      {
        'uuid': '862ca559de434867b8f56d1bbfa491b0',
        'attrDesc': '文件服务器IP',
        'attrCode': 'file_server_ip',
        'attrType': 'tech_parameter',
        'attrDataType': 'string',
        'unitDesc': null,
        'unitCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      },
      {
        'uuid': 'a19a039c6f974b2e8684f70b8791ec99',
        'attrDesc': 'NTP服务器IP',
        'attrCode': 'ntp_server_ip',
        'attrType': 'tech_parameter',
        'attrDataType': 'string',
        'unitDesc': null,
        'unitCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      },
      {
        'uuid': '02c19b3347b340cc8eae673356d854d1',
        'attrDesc': '开门延时',
        'attrCode': 'delay_time',
        'attrType': 'tech_parameter',
        'attrDataType': 'integer',
        'unitDesc': null,
        'unitCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      },
      {
        'uuid': '4c51b06dc88d4680a6e519b737ce17d2',
        'attrDesc': '开门超时',
        'attrCode': 'over_time',
        'attrType': 'tech_parameter',
        'attrDataType': 'integer',
        'unitDesc': null,
        'unitCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      },
      {
        'uuid': 'bae7204ba3af43c4be249fbf2005c8e9',
        'attrDesc': '多卡开门间隔',
        'attrCode': 'interval_time',
        'attrType': 'tech_parameter',
        'attrDataType': 'integer',
        'unitDesc': null,
        'unitCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      },
      {
        'uuid': '932558626da249c49f4f666f06c6a38e',
        'attrDesc': '公共密码',
        'attrCode': 'common_password',
        'attrType': 'tech_parameter',
        'attrDataType': 'string',
        'unitDesc': null,
        'unitCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      },
      {
        'uuid': 'db86edaea0004e0f92e48de044725686',
        'attrDesc': '胁迫密码',
        'attrCode': 'safe_password',
        'attrType': 'tech_parameter',
        'attrDataType': 'string',
        'unitDesc': null,
        'unitCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      },
      {
        'uuid': '7cfb3d289f5e4e4eaf9996fbf2d48113',
        'attrDesc': '消防通道',
        'attrCode': 'is_fire_access',
        'attrType': 'tech_parameter',
        'attrDataType': 'boolean',
        'unitDesc': null,
        'unitCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      },
      {
        'uuid': 'cf048e966d4d48d38da207289c2f00c9',
        'attrDesc': '管控状态',
        'attrCode': 'control_type',
        'attrType': 'tech_parameter',
        'attrDataType': 'select',
        'unitDesc': null,
        'unitCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      },
      {
        'uuid': '3e4306c6d8614d19b75f7ee1e77a20e8',
        'attrDesc': '认证方式',
        'attrCode': 'authentication_method',
        'attrType': 'tech_parameter',
        'attrDataType': 'select',
        'unitDesc': null,
        'unitCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      },
      {
        'uuid': 'e9dd222d81b94eebb4b757344d3f1428',
        'attrDesc': '开门时长',
        'attrCode': 'door_open_duration',
        'attrType': 'tech_parameter',
        'attrDataType': 'integer',
        'unitDesc': null,
        'unitCode': null,
        'createTime': 1512957600000,
        'updateTime': 1512957600000,
        'createUser': 'admin',
        'updateUser': 'admin',
        'courtUuid': '8ecad907705142dbb23df915336b7c0b',
        'deleteFlag': 1
      }
    ]
  }
})

// Mock.mock('/scp-devicemgmtcomponent/register/getOrg', function () {
//   return {
//     'code': '00000',
//     'data': {
//       'uuid': '5b12731ff7ef493299446b918f7fe174',
//       'name': '恒大山水城',
//       'children': [
//         {
//           'uuid': '2b58ade9a72847539fa7459c073c666f',
//           'name': '1幢',
//           'children': [
//             {
//               'uuid': '8ae37b7688e343b4b20bffc888992041',
//               'name': '2单元',
//               'children': null
//             },
//             {
//               'uuid': '4263119b2081477b872443e1e8d6480c',
//               'name': '3单元',
//               'children': null
//             },
//             {
//               'uuid': '1c21b7f75d3b48e289641cfbfbd2a83b',
//               'name': '1单元',
//               'children': [
//                 {
//                   'uuid': 'c3f5dabfc50d41aeba61f1a4315f20aa',
//                   'name': '恒大山水城',
//                   'children': null
//                 },
//                 {
//                   'uuid': 'a8f4b3a35b9a439490f54d5589db6c08',
//                   'name': '101',
//                   'children': null
//                 },
//                 {
//                   'uuid': 'fccb16e677d344dba340e715ebb4c36e',
//                   'name': '102',
//                   'children': null
//                 },
//                 {
//                   'uuid': 'cdf39246e39d432cb8e331dfa7d6fea6',
//                   'name': '恒大山水城',
//                   'children': null
//                 }
//               ]
//             }
//           ]
//         },
//         {
//           'uuid': '2d32757095c94c0d94eeb377a4c50dc1',
//           'name': '2幢',
//           'children': [
//             {
//               'uuid': 'c3f5dabfc50d41aeba61f1a4315f20aa',
//               'name': '恒大山水城',
//               'children': null
//             },
//             {
//               'uuid': 'a8f4b3a35b9a439490f54d5589db6c08',
//               'name': '101',
//               'children': null
//             },
//             {
//               'uuid': 'fccb16e677d344dba340e715ebb4c36e',
//               'name': '102',
//               'children': null
//             },
//             {
//               'uuid': 'cdf39246e39d432cb8e331dfa7d6fea6',
//               'name': '恒大山水城',
//               'children': null
//             }
//           ]
//         },
//         {
//           'uuid': '03b46a2c3afa4bc78f08b966818943e2',
//           'name': '3幢',
//           'children': [
//             {
//               'uuid': 'c3f5dabfc50d41aeba61f1a4315f20aa',
//               'name': '恒大山水城',
//               'children': null
//             },
//             {
//               'uuid': 'a8f4b3a35b9a439490f54d5589db6c08',
//               'name': '101',
//               'children': null
//             },
//             {
//               'uuid': 'fccb16e677d344dba340e715ebb4c36e',
//               'name': '102',
//               'children': null
//             },
//             {
//               'uuid': 'cdf39246e39d432cb8e331dfa7d6fea6',
//               'name': '恒大山水城',
//               'children': null
//             }
//           ]
//         }
//       ]
//     },
//     'message': 'success'
//   }
// })
