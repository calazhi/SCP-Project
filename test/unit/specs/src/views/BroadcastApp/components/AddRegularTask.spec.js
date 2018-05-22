import Vue from 'vue'
import AddRegularTask from '../../../../../../../src/views/BroadcastApp/components/AddRegularTask.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
describe('AddRegularTask.vue组件测试', () => {
  const vm = new Vue(AddRegularTask).$mount()
  const testTime = 900
  it('初始化数据', function (done) {
    AddRegularTask.data()
    this.timeout(testTime + 100)
    setTimeout(done, testTime)
  })
  it('点击openDialog,弹出对话框', () => {
    vm.openDialog()
    expect(vm.dialogFormVisible).to.equal(true)
  })
  it('closeDialog函数测试', function (done) {
    Vue.nextTick(() => {
      vm.closeDialog()
      done()
    })
    this.timeout(testTime + 100)
    setTimeout(done, testTime)
  })
  it('resetChecked', function (done) {
    Vue.nextTick(() => {
      vm.resetChecked()
      done()
    })
    this.timeout(testTime + 100)
    setTimeout(done, testTime)
  })
  it('handleSelectionChange', () => {
    vm.handleSelectionChange([])
    expect(vm.multipleSelection).to.be.an('array')
    expect(vm.chooseScene).to.be.an('array')
  })
  it('validDailyTime', () => {
    expect(vm.validDailyTime()).to.equal(false)
  })
  it('handleCheckChange', () => {
    vm.handleCheckChange()
  })
  it('cancel', () => {
    vm.cancel()
    expect(vm.dialogFormVisible).to.equal(false)
  })
  it('uploadFacePic', () => {
    vm.uploadFacePic()
  })
  it('readFacePic', function (done) {
    Vue.nextTick(() => {
      vm.readFacePic()
      done()
    })
    this.timeout(testTime + 100)
    setTimeout(done, testTime)
  })
  it('checkAllChange', () => {
    vm.checkAllChange()
    expect(vm.isIndeterminate).to.equal(false)
    expect(vm.chooseTasks).to.be.an('array')
  })
  it('checkTaskItemChange', () => {
    vm.checkTaskItemChange([])
  })
  it('endTimeChange', () => {
    vm.endTimeChange('2018-1-31')
    expect(vm.taskForm.endTime).to.equal('2018-1-31')
  })
  it('handleEvdchange', () => {
    vm.handleEvdchange()
    expect(vm.taskForm.duplicate).to.be.an('array')
    expect(vm.everyDayChecked).to.equal(vm.everyDayChecked)
  })
  it('duplicateChange', () => {
    vm.everyDayChecked = true
    vm.duplicateChange()
    expect(vm.weekDaydisabled).to.equal(true)
    expect(vm.taskForm.duplicate).to.be.an('array').that.includes('0')
  })
  it('duplicateChange', () => {
    vm.everyDayChecked = false
    vm.duplicateChange()
    expect(vm.weekDaydisabled).to.equal(false)
  })
  it('save函数', function (done) {
    vm.taskForm.chooseTaskData = []
    Vue.nextTick(() => {
      vm.save()
      done()
    })
    this.timeout(testTime + 100)
    setTimeout(done, testTime)
  })
})
