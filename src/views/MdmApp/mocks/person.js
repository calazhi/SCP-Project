export default {
  getUserList: config => {
    var data = []
    for (let i = 0; i < 2; i++) {
      data.push({
        uuid: '321321321',
        name: '周程',
        userTypeStr: '1',
        sexStr: '1',
        idenTypeStr: '1',
        idenNum: '339005199212223345',
        houseAddress: '1幢1单元101',
        phone: '15105813720',
        email: '12345675213@163.com'
      })
    }
    return {
      data: {
        pageCount: 2,
        pageData: data
      },
      code: '0000',
      msg: 'success'
    }
  },
  deleteUser: config => {
    return {
      data: 'success',
      code: '0000',
      msg: 'success'
    }
  },
  batchDeleteUser: config => {
    return {
      data: 'success',
      code: '0000',
      msg: 'success'
    }
  },
  insertUser: config => {
    return {
      data: 'success',
      code: '0000',
      msg: 'success'
    }
  },
  updateUser: config => {
    return {
      data: 'success',
      code: '0000',
      msg: 'success'
    }
  },
  uploadUser: config => {
    return {
      data: 'success',
      code: '0000',
      msg: 'success'
    }
  }
}
