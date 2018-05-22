import Vue from 'vue'
import AddScene from '../../../../../../../src/views/BroadcastApp/components/AddScene.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
describe('AddScene组件测试', () => {
  const testTime = 900
  const vm = new Vue(AddScene).$mount()
  it('openDialog函数', () => {
    vm.openDialog()
    expect(vm.dialogFormVisible).to.equal(true)
  })
  it('closeDialog函数', function (done) {
    Vue.nextTick(() => {
      vm.taskForm.chooseTaskData = ['A', 'B']
      vm.closeDialog()
      expect(vm.dialogFormVisible).to.equal(false)
      done()
    })
    this.timeout(testTime + 100)
    setTimeout(done, testTime)
  })
  it('cancel函数', () => {
    vm.cancel()
    expect(vm.dialogFormVisible).to.equal(false)
  })
  it('uploadFacePic函数', () => {
    vm.uploadFacePic()
  })
  it('checkAllChange', () => {
    vm.checkAllChange()
    expect(vm.chooseTasks).to.be.an('array')
    expect(vm.isIndeterminate).to.equal(false)
  })
  it('selectTasks函数chooseTasks数组为空且taskForm.chooseTaskData也为空', function () {
    vm.chooseTasks = []
    vm.taskForm.chooseTaskData = []
    vm.selectTasks()
  })
  it('selectTasks函数chooseTasks数组为空且taskForm.chooseTaskData也为空', function () {
    vm.chooseTasks = ['a', 'b']
    vm.taskForm.chooseTaskData = []
    vm.selectTasks()
  })
  it('selectTasks函数中chooseTasks数组不为空', () => {
    vm.chooseTasks = ['A', 'B', 'C']
    vm.taskForm.chooseTaskData = ['A', 'B']
    vm.selectTasks()
  })
  it('deleteItems函数chooseTasks2数组为空时', function () {
    vm.chooseTasks2 = []
    vm.taskForm.chooseTaskData = []
    vm.deleteItems()
  })
  it('deleteItems函数chooseTasks2数组不为空时', function () {
    vm.chooseTasks2 = ['A', 'B', 'C']
    vm.taskForm.chooseTaskData = ['A', 'B']
    vm.deleteItems()
  })
  it('readFacePic', function (done) {
    Vue.nextTick(() => {
      vm.readFacePic()
      done()
    })
    this.timeout(testTime + 100)
    setTimeout(done, testTime)
  })
  it('checkTaskItemChange函数', function () {
    vm.taskDatas = ['0']
    vm.checkTaskItemChange([])
    expect(vm.checkAll).to.equal(false)
    expect(vm.isIndeterminate).to.equal(false)
  })
  it('alterCancel函数', () => {
    vm.alterCancel()
  })
  it('clearAll函数', () => {
    vm.clearAll()
    expect(vm.taskForm.chooseTaskData).to.be.an('array').to.lengthOf(0)
  })

  it('endTimeChange函数', () => {
    vm.endTimeChange('2018-2-01')
    expect(vm.taskForm.endTime).to.equal('2018-2-01')
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
  it('save函数', function (done) {
    Vue.nextTick(() => {
      vm.taskForm.chooseTaskData = ['A', 'B']
      vm.save()
      done()
    })
    this.timeout(testTime + 100)
    setTimeout(done, testTime)
  })
})
