import Vue from 'vue'
import AddActualTask from '../../../../../../../src/views/BroadcastApp/components/AddActualTask.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

describe('AddActualTask组件测试', () => {
  const testTime = 900
  const vm = new Vue(AddActualTask).$mount()
  it('openDialog函数', () => {
    vm.openDialog()
    expect(vm.dialogFormVisible).to.equal(true)
  })
  it('getDeviList函数', () => {
    vm.getDeviList()
  })
  it('getDeviceMsg函数测试', () => {
    vm.getDeviceMsg()
  })
  it('closeDialog函数', function (done) {
    Vue.nextTick(() => {
      vm.closeDialog()
      expect(vm.dialogFormVisible).to.equal(false)
      expect(vm.taskForm.chooseTaskData).to.be.an('array')
      done()
    })
    this.timeout(testTime + 100)
    setTimeout(done, testTime)
  })
  it('save函数', function (done) {
    Vue.nextTick(() => {
      vm.save()
      done()
    })
    this.timeout(testTime + 100)
    setTimeout(done, testTime)
  })
  it('readFacePic', function (done) {
    Vue.nextTick(() => {
      vm.readFacePic()
      done()
    })
    this.timeout(testTime + 100)
    setTimeout(done, testTime)
  })
  it('cancel函数', () => {
    vm.cancel()
    expect(vm.dialogFormVisible).to.equal(false)
  })
  it('checkAllChange函数', () => {
    vm.checkAllChange()
    expect(vm.chooseTasks).to.be.an('array').to.have.lengthOf(0)
    expect(vm.isIndeterminate).to.equal(false)
  })
  it('checkTaskItemChange函数', function (done) {
    vm.checkTaskItemChange([])
    this.timeout(testTime + 100)
    setTimeout(done, testTime)
  })
  it('selectTasks函数', function () {
    vm.taskForm.chooseTaskData = ['A', 'B']
    vm.selectTasks()
  })
  it('selectTasks函数', function () {
    vm.taskForm.chooseTaskData = []
    vm.chooseTasks = ['A', 'B']
    vm.selectTasks()
  })
  it('selectTasks函数', function () {
    vm.taskForm.chooseTaskData = ['A', 'B']
    vm.chooseTasks = ['A', 'B', 'C']
    vm.selectTasks()
  })
  it('deleteItems函数chooseTasks2数组为空', function () {
    vm.chooseTasks2 = []
    vm.taskForm.chooseTaskData = ['A', 'B', 'C']
    vm.deleteItems()
  })
  it('deleteItems函数chooseTasks2数组为空', function () {
    vm.chooseTasks2 = ['A', 'B']
    vm.taskForm.chooseTaskData = ['A', 'B', 'C']
    vm.deleteItems()
  })

  it('clearAll函数', () => {
    vm.clearAll()
    expect(vm.taskForm.chooseTaskData).to.be.an('array').to.have.lengthOf(0)
  })
})
