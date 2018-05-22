import Vue from 'vue'
import SceneManager from '../../../../../../src/views/BroadcastApp/SceneManager.vue'

describe('SceneManager组件测试', () => {
  const vm = new Vue(SceneManager).$mount()
  it('updateList', () => {
    vm.updateList()
  })
  it('addScene', () => {
    vm.addScene()
  })
  it('handleSelectionChange函数', () => {
    vm.handleSelectionChange('val')
    expect(vm.selections).to.equal('val')
  })
  it('handleCurrentChange测试', () => {
    vm.handleCurrentChange(5)
    expect(vm.currentPage).to.equal(5)
  })
  it('handleSizeChange测试', () => {
    vm.handleSizeChange(5)
    expect(vm.currentPage).to.equal(1)
    expect(vm.pageSize).to.equal(5)
  })
  it('deleteTableData函数测试', () => {
    vm.deleteTableData()
    expect(vm.total).to.equal(10)
  })
  it('deleteTableData函数测试', () => {
    vm.tableData = [
      {sceneId: 1},
      {sceneId: 2},
      {sceneId: 3}
    ]
    vm.deleteTableData([1, 2])
  })
  it('delBatchTask函数测试selections数组长度大于0', () => {
    vm.selections = [
      {
        sceneName: 'A',
        sceneId: 1
      },
      {
        sceneName: '  B',
        sceneId: 2
      },
      {
        sceneName: 'C',
        sceneId: 3
      }
    ]
    vm.delBatchTask()
  })
  it('delBatchTask函数测试selections数组为0', () => {
    vm.selections = []
    vm.delBatchTask()
  })
})
