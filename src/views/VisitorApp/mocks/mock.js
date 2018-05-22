
import Mock from 'mockjs'
/**
 *  查询房屋信息
 */
Mock.mock('/visitorManagement/getHomeInfoByUserInfo', function () {
  console.log('mock 查询房屋信息')
  return {
    statue: true,
    code: 200,
    message: 'success',
    data: {
      homeID: '100001',
      username: '100001', //
      buildingName: '1', // 楼宇号码
      buildingUnit: '1', // 单元号码
      floorNumber: '1', // 楼层号码
      homeNumber: '1', // 房屋号码
      name: '张三' // 业主名称
    }
  }
})

/**
 *  查询安防设备编号
 */
Mock.mock('/visitorManagement/getDeviceIdByHomeInfo', function () {
  console.log('mock 查询安防设备编号')
  return {
    statue: true,
    code: 200,
    message: 'success',
    data: {
      deviceID: '100001',
      deviceName: '门禁', //
      buildingName: '1', // 楼宇号码
      buildingUnit: '1', // 单元号码
      floorNumber: '1', // 楼层号码
      deviceAddressDesc: '大门处' // 设备位置描述
    }
  }
})

/**
 *  提交访客信息
 */
Mock.mock('/visitorManagement/addVisitorInfo', function () {
  console.log('mock 提交访客信息')
  return {
    statue: true,
    code: 200,
    message: 'success',
    data: {}
  }
})
/**
 *  根据被访者姓名时，查询与此被访者相关的信息：房屋地址、房屋id
 */
Mock.mock('/scp-visitorapp/visitor/getSearchInfo', function () {
  console.log('mock 查询与此被访者相关的信息')
  return {
    statue: true,
    code: 200,
    message: 'success',
    data: [
      {
        houseCode: '001',
        ownerName: '张珊珊',
        address: '上海市长宁区淞虹路661号'
      },
      {
        houseCode: '002',
        ownerName: '张珊珊',
        address: '上海市普陀区真北路988号创邑金沙谷6号楼113'
      },
      {
        houseCode: '003',
        ownerName: '张珊珊',
        address: '嘉定区曹安公路2383弄55号'
      },
      {
        houseCode: '004',
        ownerName: '李珊珊',
        address: '元丰天山花园(东门) 双流路267号'
      },
      {
        houseCode: '005',
        ownerName: '刘珊珊',
        address: '长宁区淞虹路148号'
      }
    ]
  }
})
/**
 *  设备授权信息放入消息队列
 */
Mock.mock('/visitorManagement/updateDevicePermissions', function () {
  console.log('mock 设备授权信息放入消息队列')
  return {
    statue: true,
    code: 200,
    message: 'success',
    data: {}
  }
})
