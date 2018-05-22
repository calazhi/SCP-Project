export default {
  getOrgList: config => {
    var data = []
    for (let i = 0; i < 10; i++) {
      data.push({
        uuid: '321321321',
        name: '1单元',
        orgParentUuid: '24432423423',
        orgParentName: '1幢',
        orgCreatedDate: '2017/12/19',
        orgCreatorName: '管理员',
        memo: '1幢1单元'
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
  getOrgTree: config => {
    var data = {
      uuid: '234dsgsfd43534',
      name: '恒大小区',
      children: [
        {
          uuid: '235jklgdsj4543',
          name: '1幢',
          children: [
            {
              uuid: '235432432jklgdsj4543',
              name: '1单元'
            }
          ]
        },
        {
          uuid: '235jkl54gdsj4543',
          name: '2幢',
          children: [
            {
              uuid: '235432435432jklgdsj4543',
              name: '1单元'
            }
          ]
        }
      ]
    }
    return {
      data: data,
      code: '0000',
      msg: 'success'
    }
  },
  deleteOrg: config => {
    return {
      data: 'success',
      code: '0000',
      msg: 'success'
    }
  },
  batchDeleteOrg: config => {
    return {
      data: 'success',
      code: '0000',
      msg: 'success'
    }
  },
  insertOrg: config => {
    return {
      data: 'success',
      code: '0000',
      msg: 'success'
    }
  },
  updateOrg: config => {
    return {
      data: 'success',
      code: '0000',
      msg: 'success'
    }
  },
  uploadOrg: config => {
    return {
      data: 'success',
      code: '0000',
      msg: 'success'
    }
  }
}
