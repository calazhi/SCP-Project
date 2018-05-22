
// import Mock from 'mockjs'

// Mock.mock('/scp-accesscontrolapp/deviceGroup/listDevicesByOrgId', function () {
//   console.info('进入组织ID查询设备mock')
//   return {
//     errorcode: '00000',
//     errormsg: 'message',
//     data: [{
//       subDeviceCode: '124235423103666',
//       subDeviceTypeName: '型号1',
//       subDeviceDesc: '设备1',
//       subParentCode: '001'
//     },
//     {
//       subDeviceCode: '124235423543662',
//       subDeviceTypeName: '型号1',
//       subDeviceDesc: '设备2',
//       subParentCode: '001'
//     },
//     {
//       subDeviceCode: '124235423543663',
//       subDeviceTypeName: '型号1',
//       subDeviceDesc: '设备3',
//       subParentCode: '001'
//     },
//     {
//       subDeviceCode: '124235423543664',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备4',
//       subParentCode: '001'
//     },
//     {
//       subDeviceCode: '124235423543665',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备5',
//       subParentCode: '001'
//     },
//     {
//       subDeviceCode: '124235423543666',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备6',
//       subParentCode: '001'
//     },
//     {
//       subDeviceCode: '124235423543667',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备7',
//       subParentCode: '001'
//     },
//     {
//       subDeviceCode: '124235423543668',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备8',
//       subParentCode: '001'
//     },
//     {
//       subDeviceCode: '124235423543669',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备9',
//       subParentCode: '001'
//     },
//     {
//       subDeviceCode: '124235423543660',
//       subDeviceTypeName: '型号1',
//       subDeviceDesc: '设备10',
//       subParentCode: '001'
//     },
//     {
//       subDeviceCode: '124235423533661',
//       subDeviceTypeName: '型号1',
//       subDeviceDesc: '设备11',
//       subParentCode: '001'
//     },
//     {
//       subDeviceCode: '124235423542262',
//       subDeviceTypeName: '型号1',
//       subDeviceDesc: '设备12',
//       subParentCode: '001'
//     },
//     {
//       subDeviceCode: '124235423113663',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备13',
//       subParentCode: '001'
//     },
//     {
//       subDeviceCode: '124235423523664',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备14',
//       subParentCode: '002'
//     },
//     {
//       subDeviceCode: '124235423903665',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备15',
//       subParentCode: '002'
//     },
//     {
//       subDeviceCode: '1242354231003666',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备16',
//       subParentCode: '002'
//     },
//     {
//       subDeviceCode: '1242350284543667',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备17',
//       subParentCode: '002'
//     },
//     {
//       subDeviceCode: '124175487533661',
//       subDeviceTypeName: '型号1',
//       subDeviceDesc: '设备18',
//       subParentCode: '002'
//     },
//     {
//       subDeviceCode: '124234223542262',
//       subDeviceTypeName: '型号1',
//       subDeviceDesc: '设备19',
//       subParentCode: '002'
//     },
//     {
//       subDeviceCode: '124237423113663',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备20',
//       subParentCode: '002'
//     },
//     {
//       subDeviceCode: '124238023523664',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备21',
//       subParentCode: '002'
//     },
//     {
//       subDeviceCode: '124235417903665',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备22',
//       subParentCode: '002'
//     },
//     {
//       subDeviceCode: '1242358335803666',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备23',
//       subParentCode: '003'
//     },
//     {
//       subDeviceCode: '1242354704543667',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备24',
//       subParentCode: '003'
//     },
//     {
//       subDeviceCode: '1242354235488668',
//       subDeviceTypeName: '型号2',
//       subDeviceDesc: '设备25',
//       subParentCode: '003'
//     } ]
//   }
// })

// Mock.mock('/scp-accesscontrolapp/deviceGroup/listDevicesByGroupId', function () {
//   console.info('查询组内设备进入mock')
//   return {
//     errorcode: '00000',
//     data: [{
//       deviceDesc: '设备1',
//       deviceTypeName: '型号1',
//       orgName: '1栋1单元'
//     },
//     {
//       deviceDesc: '设备2',
//       deviceTypeName: '型号1',
//       orgName: '1栋1单元'
//     },
//     {
//       deviceDesc: '设备3',
//       deviceTypeName: '型号1',
//       orgName: '1栋1单元'
//     } ]
//   }
// })

// Mock.mock('/scp-accesscontrolapp/deviceGroup/loadOrgTree', function () {
//   console.info('加载组织树')
//   return {
//     errorcode: '00000',
//     data: [{
//       uuid: '001',
//       name: '一级 1',
//       children: [{
//         uuid: '001',
//         name: '一级 1',
//         children: [{
//           uuid: '0011',
//           name: '二级 1-1',
//           children: [{
//             name: '三级 1-1-1'
//           }]
//         }]
//       }, {
//         uuid: '002',
//         name: '一级 2',
//         children: [{
//           uuid: '0021',
//           name: '二级 2-1',
//           children: [{
//             name: '三级 2-1-1'
//           }]
//         }, {
//           uuid: '003',
//           name: '二级 2-2',
//           children: [{
//             uuid: '0031',
//             name: '三级 2-2-1'
//           }]
//         }]
//       }, {
//         uuid: '004',
//         name: '一级 3',
//         children: [{
//           name: '二级 3-1',
//           children: [{
//             name: '三级 3-1-1'
//           }]
//         }, {
//           uuid: '005',
//           name: '二级 3-2',
//           children: [{
//             name: '三级 3-2-1'
//           }]
//         }]
//       }]
//     }]
//   }
// })

// // Mock.mock('/scp-accesscontrolapp/deviceGroup/listSubDevicesByGroupId', function () {
// //   console.info('根据设备组ID获取其中的子设备列表')
// //   return {
// //     errorcode: '00000',
// //     data: [{
// //       subDeviceCode: '124235423103666',
// //       subDeviceDesc: '设备1'
// //       // subParentCode: '1'
// //     },
// //     {
// //       subDeviceCode: '124235423542262',
// //       subDeviceDesc: '设备12'
// //       // subParentCode: '1'
// //     }]
// //   }
// // })

// Mock.mock('/scp-accesscontrolapp/deviceGroup/listDeviceGroup', function () {
//   console.info('获取设备组列表')
//   return {
//     errorcode: '00000',
//     data: [{
//       id: '1',
//       groupName: '设备组1',
//       remark: '设备组1描述'
//     },
//     {
//       id: '2',
//       groupName: '设备组2',
//       remark: '设备组2描述'
//     }]
//   }
// })

// Mock.mock('/scp-accesscontrolapp/auths/list', function () {
//   console.info('获取业主信息')
//   return {
//     rows: [{
//       userId: '001',
//       userName: '李为民',
//       cardType: '类型A',
//       cardNo: '粤A31290891',
//       address: '恒大山水城1栋304号',
//       finger: '保留',
//       facePic: '保留'
//     }]
//   }
// }
// )

// Mock.mock('/scp-accesscontrolapp/auths/author/record', function () {
//   console.info('获取业主信息')
//   return {
//     data: [{
//       id: '001',
//       user: {
//         userId: '001',
//         userName: '李为民',
//         sex: 1,
//         nationName: '001',
//         cardType: '类型1',
//         cardNo: '21419432',
//         nationPlace: '1',
//         userAddress: '恒大山水城'
//       }
//     }]
//   }
// })
