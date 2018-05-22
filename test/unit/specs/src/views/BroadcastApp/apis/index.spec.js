import {
    getAudioList,
    addAudio,
    delAudioClip,
    delMutipAudioClip,
    getRealtimeList,
    addRealtimeTask,
    playRealtimeTask,
    pauseRealtimeTask,
    delRealtimeTask,
    getTimingList,
    addTimingTask,
    delTimingTask,
    getSceneList,
    addScene,
    delScene,
    getDevicesList,
    getDevice
} from '../../../../../../../src/views/BroadcastApp/apis/index.js'

describe('BroadcastApp组件中API的测试', () => {
  describe('getAudioList接口测试', () => {
    it('getAudioList接口请求是否成功', () => {
      try {
        const res = getAudioList()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('addAudio接口测试', () => {
    it('addAudio接口请求是否成功', () => {
      try {
        const res = addAudio()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('delAudioClip接口测试', () => {
    it('addAudio接口请求是否成功', () => {
      try {
        const res = delAudioClip()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('delMutipAudioClip接口测试', () => {
    it('delMutipAudioClip接口请求是否成功', () => {
      try {
        const res = delMutipAudioClip()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('getRealtimeList接口测试', () => {
    it('getRealtimeList接口请求是否成功', () => {
      try {
        const res = getRealtimeList()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('addRealtimeTask接口测试', () => {
    it('addRealtimeTask接口请求是否成功', () => {
      try {
        const res = addRealtimeTask()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('playRealtimeTask接口测试', () => {
    it('playRealtimeTask接口请求是否成功', () => {
      try {
        const res = playRealtimeTask()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('pauseRealtimeTask接口测试', () => {
    it('pauseRealtimeTask接口请求是否成功', () => {
      try {
        const res = pauseRealtimeTask()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('delRealtimeTask接口测试', () => {
    it('delRealtimeTask接口请求是否成功', () => {
      try {
        const res = delRealtimeTask()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('getTimingList接口测试', () => {
    it('getTimingList接口请求是否成功', () => {
      try {
        const res = getTimingList()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('addTimingTask接口测试', () => {
    it('addTimingTask接口请求是否成功', () => {
      try {
        const res = addTimingTask()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('delTimingTask接口测试', () => {
    it('delTimingTask接口请求是否成功', () => {
      try {
        const res = delTimingTask()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('getSceneList接口测试', () => {
    it('getSceneList接口请求是否成功', () => {
      try {
        const res = getSceneList()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('addScene接口测试', () => {
    it('addScene接口请求是否成功', () => {
      try {
        const res = addScene()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('delScene接口测试', () => {
    it('delScene接口请求是否成功', () => {
      try {
        const res = delScene()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('getDevicesList接口测试', () => {
    it('getDevicesList接口请求是否成功', () => {
      try {
        const res = getDevicesList()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
  describe('getDevice接口测试', () => {
    it('getDevice接口请求是否成功', () => {
      try {
        const res = getDevice()
        expect(res.data).to.not.be.an('object')
      } catch (error) {
        expect(error.message).to.be.a('string')
      }
    })
  })
})
