import Vue from 'vue'
import AudioManager from '../../../../../../src/views/BroadcastApp/AudioManager.vue'

describe('AudioManager组件测试', () => {
  const vm = new Vue(AudioManager).$mount()
  it('钩子函数测试', () => {
    expect(typeof AudioManager.mounted).to.equal('function')
  })

  it('addAudio函数', () => {
    vm.addAudio()
  })
  it('updateList函数', () => {
    vm.updateList()
    expect(vm.tableData).to.be.an('array')
  })
  it('audioDelete函数', () => {
    vm.audioDelete()
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
    vm.tableData = [
      {audioClipId: 1},
      {audioClipId: 2},
      {audioClipId: 3}
    ]
    vm.deleteTableData([1, 2])
  })
  it('delBatchAudio函数测试', () => {
    vm.selections = [
      {
        audioClipName: 'A',
        audioClipId: 1
      },
      {
        audioClipName: '  B',
        audioClipId: 2
      },
      {
        audioClipName: 'C',
        audioClipId: 3
      }
    ]
    vm.delBatchAudio()
  })
  it('deleteTableData函数', () => {
    vm.tableData = [
      {audioClipId: 1},
      {audioClipId: 2},
      {audioClipId: 3}
    ]
    vm.deleteTableData([1, 2])
  })
})
