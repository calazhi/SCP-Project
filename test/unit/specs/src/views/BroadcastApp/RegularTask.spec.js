import Vue from 'vue'
import RegularTask from '../../../../../../src/views/BroadcastApp/RegularTask.vue'

describe('RegularTask组件测试', () => {
  const vm = new Vue(RegularTask)
  it('钩子函数', () => {
    expect(typeof RegularTask.mounted).to.equal('function')
  })
  // it('addAudio函数', () => {
  //   vm.addAudio()
  // })
  it('taskDelete函数', () => {
    vm.taskDelete()
  })

  it('updateList函数', () => {
    vm.updateList()
    expect(vm.tableData).to.be.an('array')
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
    expect(vm.pageSize).to.equal(5)
    expect(vm.currentPage).to.equal(1)
  })
  it('deleteTableData测试', () => {
    vm.tableData = [
      {broadcastId: 1},
      {broadcastId: 2},
      {broadcastId: 3}
    ]
    vm.deleteTableData([1, 2])
  })
  it('delBatchTask函数测试selections数组长度大于0', () => {
    vm.selections = [
      {
        broadcastName: 'A',
        broadcastId: 1
      },
      {
        broadcastName: '  B',
        broadcastId: 2
      },
      {
        broadcastName: 'C',
        broadcastId: 3
      }
    ]
    vm.delBatchTask()
  })
  it('delBatchTask函数测试selections数组为0', () => {
    vm.selections = []
    vm.delBatchTask()
  })
})
