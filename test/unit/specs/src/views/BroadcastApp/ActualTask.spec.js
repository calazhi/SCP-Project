import Vue from 'vue'
import ActualTask from '../../../../../../src/views/BroadcastApp/ActualTask.vue'
describe('ActualTask组件测试', () => {
  const vm = new Vue(ActualTask).$mount()
  const testTime = 900
  // const testTime = 900
  it('ActualTask组件钩子函数检查', () => {
    expect(typeof ActualTask.mounted).to.equal('function')
  })

  it('初始化数据是否正确', () => {
    expect(typeof ActualTask.data).to.equal('function')
    const data = ActualTask.data()
    expect(data.broadcastType).to.equal(0)
  })

  it('调用getTaskData函数后，像后端发请求，并修改初始化参数，将数据更新到页面中', function (done) {
    const vm = new Vue(ActualTask)
    vm.getTaskData()
    this.timeout(testTime + 100)
    setTimeout(done, testTime)
  })
  it('updateList函数', () => {
    vm.updateList()
  })
  it('playAudio函数operation为3时', function (done) {
    let parmas = {
      operation: 3,
      bcArLink: {
        playAreaId: '5, 4, 3, 2, 1'
      },
      broadcastId: 3,
      broadcastType: 0
    }
    vm.playAudio(parmas)
    this.timeout(testTime + 100)
    setTimeout(done, testTime)
  })
  it('playAudio函数operation为2时', () => {
    let parmas = {
      operation: 2,
      bcArLink: {
        playAreaId: '5,4,3,2,5'
      },
      broadcastId: 3,
      broadcastType: 0
    }
    vm.playAudio(parmas)
  })
  it('pauseAudio', () => {
    let parmas = {
      operation: 3,
      bcArLink: {
        playAreaId: '5,4,3,2,5'
      }
    }
    vm.pauseAudio(parmas)
  })
  it('stopAudio', () => {
    let parmas = {
      operation: 2,
      bcArLink: {
        playAreaId: '5,4,3,2,5'
      }
    }
    vm.stopAudio(parmas)
  })
  it('taskDelete函数', () => {
    vm.taskDelete({broadcastId: 2})
  })
  it('deleteTabkeData函数', () => {
    vm.tableData = [
      {broadcastId: 1},
      {broadcastId: 2},
      {broadcastId: 3}
    ]
    vm.deleteTableData(['1', '2'])
  })
  it('handleSelectionChange函数测试', () => {
    vm.handleSelectionChange('val')
    expect(vm.selections).to.equal('val')
  })
  it('deleteTableData函数测试', () => {
    vm.tableData = [
      {broadcastId: 1},
      {broadcastId: 2},
      {broadcastId: 3}
    ]
    vm.deleteTableData([1, 2])
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
  it('delBatchTaask函数selections数组为空', function () {
    vm.selections = []
    vm.delBatchTask()
  })
  it('delBatchTaask函数selections数组不为空', function () {
    vm.selections = [
      {
        broadcastName: 'a',
        broadcastId: 1
      },
      {
        broadcastName: 'b',
        broadcastId: 2
      },
      {
        broadcastName: 'c',
        broadcastId: 3
      }
    ]
    vm.delBatchTask()
  })
})
