/**
 * 验证手机号码
 */
export function phoneVerification (rule, value, callback) {
  const isMobile = /^1(3|4|5|7|8)\d{9}$/
  if (!isMobile.test(value)) {
    callback(new Error('请输入正确的手机号码!'))
  } else {
    callback()
  }
}
/**
 * 验证 邮箱
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function emailValidator (rule, value, callback) {
  if (value) {
    if (!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,32}$/.test(value)) {
      callback(new Error('请输入正确的邮箱地址!'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

/**
 * 把日期对象转成 yyyy-MM-dd hh:mm:ss 显示格式
 * @param {*} date
 */
export function formatDateTime (date, type = '-') {
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  let h = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute = date.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  let second = date.getSeconds()
  second = second < 10 ? '0' + second : second
  return y + type + m + type + d + ' ' + h + ':' + minute + ':' + second
}

/**
 * 验证姓名
 */
export function nameValidator (rule, value, callback) {
  const isName = /^[\u4e00-\u9fa5A-Za-z0-9]+$/
  if (!isName.test(value)) {
    callback(new Error('不能输入特殊字符!'))
  } else {
    callback()
  }
}

/**
 * 验证籍贯
 */
export function originValidator (rule, value, callback) {
  const isName = /^[\u4e00-\u9fa5A-Za-z\s]{1,10}$/
  if (!isName.test(value)) {
    callback(new Error('不能输入特殊字符和数字'))
  } else {
    callback()
  }
}

/**
 * 验证不能输入特殊字符
 */
export function typeValidator (rule, value, callback) {
  const isName = /^[\u4e00-\u9fa5A-Za-z0-9]+$/
  if (!isName.test(value)) {
    callback(new Error('不能输入特殊字符!'))
  } else {
    callback()
  }
}

/**
 * 验证密码
 */
export function passValidator (rule, value, callback) {
  const isName = /^[0-9]{6}$/
  if (!isName.test(value)) {
    callback(new Error('请输入6位数字密码!'))
  } else {
    callback()
  }
}

/**
 * 验证拜访人数
 */
export function visitorCntValidator (rule, value, callback) {
  const isName = /^[1-9]\d*$/
  if (!isName.test(value)) {
    callback(new Error('请输入正整数!'))
  } else {
    callback()
  }
}

/**
 * 验证只能输入字母和数字
 */
export function employeeValidator (rule, value, callback) {
  const isName = /^[0-9A-Za-z]*$/
  if (!isName.test(value)) {
    callback(new Error('请输入数字和字母组合!'))
  } else {
    callback()
  }
}
