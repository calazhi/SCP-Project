import { phoneVerification, emailValidator, formatDateTime, formatDate, formatTime, validPositiveInt, validTaskName } from '../../../../../../../../src/views/BroadcastApp/assets/js/validate.js'
describe('BroadcastApp下assets测试', () => {
  let dateTime = new Date()
  let callBackFunction = (parma) => {
    return parma
  }
  it('phoneVerification手机号码验证', () => {
    expect().to.equal(phoneVerification(null, 13691388234, callBackFunction))
    expect().to.equal(phoneVerification(null, 13691388234000000, callBackFunction))
  })
  it('emailValidator邮箱账号验证', () => {
    expect().to.equal(emailValidator(null, 'lee13691388242@sina.com', callBackFunction))
    expect().to.equal(emailValidator(null, 'lee13691388242', callBackFunction))
  })
  it('formatDateTime日期时间格式化验证', () => {
    expect(formatDateTime(dateTime)).to.be.a('string')
  })
  it('formatDate日期格式化验证', () => {
    expect(formatDate(dateTime)).to.be.a('string')
  })
  it('formatTime时间格式化验证', () => {
    expect(formatTime(dateTime)).to.be.a('string')
  })
  it('validPositiveInt正整数验证', () => {
    expect(validPositiveInt(5)).to.be.equal(true)
  })
  it('validTaskName任务名称验证', () => {
    expect(validTaskName('广播任务模块开发')).to.equal(true)
  })
})
