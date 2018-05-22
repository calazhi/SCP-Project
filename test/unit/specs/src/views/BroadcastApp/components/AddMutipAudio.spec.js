import Vue from 'vue'
import AddMutipAudio from '../../../../../../../src/views/BroadcastApp/components/AddMutipAudio.vue'

describe('AddMutipAudio组件的测试', () => {
  const vm = new Vue(AddMutipAudio).$mount()
  // const testTime = 900
  it('AddMutipAudio评估原始组件选项中的函数的结果', () => {
    expect(typeof AddMutipAudio.data).to.equal('function')
  })

  it('openDialog函数调用后，弹出对话框', () => {
    vm.openDialog()
    expect(vm.dialogFormVisible).to.equal(true)
  })
  it('resetForm函数测试', () => {
    vm.resetForm()
    expect(vm.fileList).to.be.an('array').to.have.lengthOf(0)
  })
  it('save函数', function () {
    // vm.fileList = ['music.mp3']
    vm.save()
  })
  it('save函数', function () {
    vm.fileList = [{name: 'music.mp3'}]
    vm.save()
  })
  it('upload函数', function () {
    vm.loading = true
    vm.fileList = [{name: 'musice.mp3'}]
    vm.upload()
  })
  it('cancel函数当fileList的length不为零的时候且loading为true', () => {
    vm.fileList = ['music1.mp3', 'music2.mp3', 'music3.mp3']
    vm.loading = true
    vm.cancel()
    expect(vm.dialogFormVisible).to.equal(true)
  })
  it('cancel函数当fileList的length不为零的时候且loading为false', () => {
    vm.fileList = ['music1.mp3', 'music2.mp3', 'music3.mp3']
    vm.loading = false
    vm.cancel()
  })
  it('cancel函数当fileList的length为零的时候且isHadNews为true', () => {
    vm.fileList = []
    vm.isHadNews = true
    vm.cancel()
  })
  it('handleChange函数的测试', () => {
    vm.handleChange()
  })
  it('handleExceed函数的测试', () => {
    vm.handleExceed(['music1.mp3', 'music2.mp3', 'music3.mp3'], ['music1.mp3', 'music2.mp3', 'music3.mp3'])
  })
  it('handleRemove函数的测试', () => {
    vm.handleRemove()
  })
  it('beforeRemove函数的测试', () => {
    vm.beforeRemove({name: '音频'})
  })
  it('beforeUpload函数的测试', () => {
    vm.beforeUpload()
  })
  it('audioFmtVld函数的测试', () => {
    expect(vm.audioFmtVld('music.mp3')).to.equal(true)
    expect(vm.audioFmtVld('music.mp4')).to.equal(false)
  })
  // it('cancel函数的测试', () => {
  //   vm.fileList = ['music1.mp3', 'music2.mp3', 'music3.mp3']
  //   vm.loading = true
  //   vm.cancel()
  // })
})
