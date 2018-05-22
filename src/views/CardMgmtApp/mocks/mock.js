
// import Mock from 'mockjs'

// const Users = []

// for (let i = 0; i < 100; i++) {
//   Users.push(Mock.mock({
//     id: Mock.Random.guid(),
//     qrCode: 'EWM-' + Mock.Random.integer(100, 100000),
//     personName: Mock.Random.cname(),
//     personCode: Mock.Random.cname(),
//     visitor: Mock.Random.cname(),
//     effectiveTime: Mock.Random.date() + '~' + Mock.Random.date(),
//     useTimes: Mock.Random.integer(0, 100),
//     visitorPhoneNum: Mock.Random.integer(10, 100),
//     personAdress: Mock.mock('@county(true)'),
//     sex: Mock.Random.integer(0, 1)
//   }))
// }

// Mock.mock('/cardMgmtApp/queryPageData', function (listQuery) {
//   console.log('qrcodemock  ' + JSON.stringify(listQuery))
//   debugger
//   let obj = JSON.parse(listQuery.body)
//   let total = Users.length
//   let {currentPage, pageSize} = obj
//   let mockUsers = Users.filter((u, index) => index < currentPage * pageSize && index >= pageSize * (currentPage - 1))
//   return {
//     'pageCount': total,
//     'user': mockUsers
//   }
// })
// Mock.mock('/scp-cardmgmtapp/card/list', function (obj) {
//   console.log(JSON.stringify(obj))
//   var condition = JSON.parse(obj.body)
//   var data = []
//   for (var i = 0; i < condition.pageSize; i++) {
//     var item = {}
//     item.recordId = Mock.Random.guid()
//     item.cardNo = 'MJ' + Mock.Random.guid().substr(0, 5)
//     item.cardType = 'MJ'
//     item.cardStatus = 'NORMAL'
//     item.userNo = 'CUS' + Mock.Random.guid().substr(0, 5)
//     item.userName = Mock.Random.cname()
//     item.storegeTime = Mock.Random.date()
//     item.publishTime = Mock.Random.date()
//     item.expirationDate = Mock.Random.date()
//     item.updateDate = Mock.Random.date()
//     data.push(item)
//   }
//   return {
//     code: 0,
//     page: condition.page,
//     pageSize: condition.pageSize,
//     totalAccount: 100,
//     tableData: data
//   }
// })
// Mock.mock('/scp-cardmgmtapp/card/list', function (obj) {
//   console.log(JSON.stringify(obj))
//   var condition = JSON.parse(obj.body)
//   var data = []
//   for (var i = 0; i < condition.pageSize; i++) {
//     var item = {}
//     item.recordId = Mock.Random.guid()
//     item.cardNo = 'MJ' + Mock.Random.guid().substr(0, 5)
//     item.cardType = 'MJ'
//     item.cardStatus = 'NORMAL'
//     item.userNo = 'CUS' + Mock.Random.guid().substr(0, 5)
//     item.userName = Mock.Random.cname()
//     item.storegeTime = Mock.Random.date()
//     item.publishTime = Mock.Random.date()
//     item.expirationDate = Mock.Random.date()
//     item.updateDate = Mock.Random.date()
//     data.push(item)
//   }
//   return {
//     code: 0,
//     page: condition.page,
//     pageSize: condition.pageSize,
//     totalAccount: 100,
//     tableData: data
//   }
// })

// Mock.mock('/cardMgmtApp/queryPageData', function (listQuery) {
//   console.log('qrcodemock  ' + JSON.stringify(listQuery))
//   debugger
//   let obj = JSON.parse(listQuery.body)
//   let total = Users.length
//   let {currentPage, pageSize} = obj
//   let mockUsers = Users.filter((u, index) => index < currentPage * pageSize && index >= pageSize * (currentPage - 1))
//   return {
//     'pageCount': total,
//     'user': mockUsers
//   }
// })
// Mock.mock('/scp-cardmgmtapp/cardMgmt/queryCardPage', function (obj) {
//   console.log(JSON.stringify(obj))
//   var condition = JSON.parse(obj.body)
//   var data = []
//   for (var i = 0; i < condition.pageSize; i++) {
//     var item = {}
//     item.recordId = Mock.Random.guid()
//     item.cardNo = 'MJ' + Mock.Random.guid().substr(0, 5)
//     item.cardType = 'MJ'
//     item.cardStatus = 'NORMAL'
//     item.userNo = 'CUS' + Mock.Random.guid().substr(0, 5)
//     item.userName = Mock.Random.cname()
//     item.storegeTime = Mock.Random.date()
//     item.publishTime = Mock.Random.date()
//     item.expirationDate = Mock.Random.date()
//     item.updateDate = Mock.Random.date()
//     data.push(item)
//   }
//   return {
//     code: 0,
//     page: condition.page,
//     pageSize: condition.pageSize,
//     totalAccount: 100,
//     tableData: data
//   }
// })
// Mock.mock('/scp-cardmgmtapp/card/add', function (obj) {
//   console.log('mock中接收的请求参数' + JSON.stringify(obj))
//   var body = JSON.parse(obj.body)
//   var result = {
//     rescode: 0
//   }
//   if (isEmpty(body.physicsNo) || isEmpty(body.cardNo) || isEmpty(body.cardOwner) || isEmpty(body.cardType)) {
//     result.rescode = 1
//     return result
//   }
//   if (window.cards === undefined) {
//     window.cards = []
//   }
//   window.cards.push(body)
//   return result
// })
// function isEmpty (obj) {
//   if (typeof obj === 'string' && obj === '') {
//     return true
//   } else if (obj === null || obj === undefined) {
//     return true
//   }
//   return false
// }

