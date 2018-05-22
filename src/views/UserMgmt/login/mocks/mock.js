
import config from './config'
import Mock from 'mockjs'
import userMockJsonData from '@/assets/js/userMockJsonData.js'

Mock.mock('/scp-usermgmtcomponent/admin/login', function () {
  console.log('mock userlogin')
  return userMockJsonData
})

Mock.mock('/scp-usermgmtcomponent/admin/logout', function () {
  console.log('mock logout')
  return {
    'code': '00000',
    'data': {
      'status': '1',
      'token': '',
      'userId': '',
      'userName': '',
      'department': '',
      'uuid': ''
    },
    'message': ''
  }
})

Mock.mock(config.url('homeloadData'), function () {
  console.log('mock homeloadData')
  return { 'status': true, 'code': 200, 'message': null, 'data': 'hello' }
})

/*
Mock.mock(config.url('test'), function () {
  console.log('mock homeloadData')
  return { 'status': true, 'code': 200, 'message': null, 'data': 'hello' }
})
*/
