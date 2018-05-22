import Axios from '@/assets/js/AxiosPlugin'

// 分页查询二维码
export const getUserListByPage = (listQuery) => {
  var trs = JSON.stringify(listQuery)
  return Axios.get('/scp-cardmgmtapp/cardMgmt/listQrCodesByPage?params=' + encodeURI(trs)).then(res => res.data)
}

// 查询卡片列表
export const queryCardList = (listQuery) => {
  var trs = JSON.stringify(listQuery)
  return Axios.get('/scp-cardmgmtapp/cardMgmt/listCardByPage?params=' + encodeURI(trs)).then(res => res.data)
}

// 卡片入库
export const storeCards = condition => {
  console.log(JSON.stringify(condition))
  return Axios.post('/scp-cardmgmtapp/cardMgmt/addCard', condition).then(res => res.data)
}

// 住户查询
export const queryUsers = (userCondition) => {
  console.log(JSON.stringify(userCondition))
  var trs = JSON.stringify(userCondition)
  return Axios.get('/scp-cardmgmtapp/cardMgmt/listResidentsByName?params=' + encodeURI(trs)).then(res => res.data)
}

// 物业人员查询
export const queryManagersByName = (userCondition) => {
  console.log(JSON.stringify(userCondition))
  var trs = JSON.stringify(userCondition)
  return Axios.get('/scp-cardmgmtapp/cardMgmt/listManagersByName?params=' + encodeURI(trs)).then(res => res.data)
}

// 查询卡务流水
export const queryCardOperateList = (listQuery) => {
  var trs = JSON.stringify(listQuery)
  return Axios.get('/scp-cardmgmtapp/cardMgmt/listCardOperationsPage?params=' + encodeURI(trs)).then(res => res.data)
}

// 查询卡片绑定人员的信息
export const queryCardBindInfo = (condition) => {
  var trs = JSON.stringify(condition)
  return Axios.get('/scp-cardmgmtapp/cardMgmt/getBindedUser?params=' + encodeURI(trs)).then(res => res.data)
}

// 卡片挂失
export const handleCardLost = (condition) => {
  return Axios.post('/scp-cardmgmtapp/cardMgmt/loseCard', condition).then(res => res.data)
}

// 卡片解挂
export const handleRecovery = (condition) => {
  return Axios.post('/scp-cardmgmtapp/cardMgmt/disLoseCard', condition).then(res => res.data)
}

// 卡片注销
export const discardCard = (condition) => {
  return Axios.post('/scp-cardmgmtapp/cardMgmt/discardCard', condition).then(res => res.data)
}

// 卡片退卡
export const handleBackCard = (condition) => {
  return Axios.post('/scp-cardmgmtapp/cardMgmt/returnCard', condition).then(res => res.data)
}

// 卡片删除
export const handleDelete = (condition) => {
  return Axios.post('/scp-cardmgmtapp/cardMgmt/deleteCard', condition).then(res => res.data)
}

// 导入卡片
export const importCardsFromExcel = (condition) => {
  return Axios.post('/scp-cardmgmtapp/cardImportOrExport/importexcel', condition).then(res => res.data)
}

// 卡片导入excel
export const exportCardsForExcel = (condition) => {
  var trs = JSON.stringify(condition)
//  return Axios.get('/scp-cardmgmtapp/cardMgmt/exportexcel?params=' + encodeURI(trs)).then(res => res.data)
  location.href = '/scp-cardmgmtapp/cardImportOrExport/exportexcel?params=' + encodeURI(trs)
}

// 下载模板
export const downloadExcelTemplate = (templateName) => {
  console.log('downloadExcelTemplate-->' + templateName)
  Axios.get('/scp-cardmgmtapp/cardImportOrExport/downloadTemplate?templateName=' + encodeURI(templateName), {responseType: 'arraybuffer'}).then(res => {
    let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
    if (navigator.appVersion.toString().indexOf('.NET') > 0) {
      window.navigator.msSaveBlob(blob, templateName)
    } else {
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = templateName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    return res.data
  })
}
