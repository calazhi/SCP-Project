<template>
  <div v-if="ocxShow" class="">
    <div class="ocx">
      <object classid="clsid:d97c5a6f-1b81-4ccc-8c3f-1c9860e57567" width="520" height="390" id="Plugin" name="Plugin" ref="prewviewOcx"></object>
    </div>
  </div>
  <div class="loading" v-else>
      <!-- 加载失败 -->
      <DownloadOcx></DownloadOcx>
    </div>
</template>
<script>
import DownloadOcx from './DownloadOcx'
import { getLpnDevice } from '@/views/ParkingLotApp/apis'
export default {
  components: {
    DownloadOcx
  },
  props: {
  },
  data () {
    return {
      errorImg: false,
      previewData: {
        // deviceID: '10032001001899000001',
        // parentID: '10032001001899000001',
        // mediaIP: '192.168.0.207',
        // mediaPort: 10000,
        // streamProfile: 1
      },
      ocxShow: true,
      playBackData: {},
      playbackRequestData: [],
      cameraData: {},
      previewAllData: {}
    }
  },
  mounted () {
    // 刷新时调用释放接口
    window.addEventListener('beforeunload', () => {
      this.releaseOcx()
    })
    setTimeout(() => {
      this.initOcx()
      this.getData()
    }, 20)
  },
  beforeDestroy () {
    this.releaseOcx()
  },
  methods: {
    // ocx初始化
    initOcx () {
      this.$nextTick(() => {
        try {
          let Plugin = this.$refs.prewviewOcx
          // 创建视频接口
          Plugin.OCX_SetFrame(JSON.stringify({
            cmd: 1,
            showMode: 3,
            width: Plugin.width,
            height: Plugin.height
          }))
          // 处理回调
          Plugin.OCX_SetCallback((data) => {
            this.funOnEvent(data)
          })
        } catch (e) {
          this.ocxShow = false
        }
      })
    },
    // 播放预览
    playPreview () {
      try {
        let Plugin = this.$refs.prewviewOcx
        Plugin.OCX_InformExe(JSON.stringify({
          cmd: 2,
          data: [this.previewData]
        }))
      } catch (e) { }
    },
    rePlayPreview () {
      try {
        let Plugin = this.$refs.prewviewOcx
        Plugin.OCX_InformExe(JSON.stringify({
          cmd: 2,
          data: [this.previewData]
        }))
      } catch (e) { }
    },
    // 关闭视频推流
    StopPreview () {
      try {
        let Plugin = this.$refs.prewviewOcx
        Plugin.OCX_InformExe(JSON.stringify({
          cmd: 3,
          data: [this.previewData]
        }))
      } catch (e) { }
    },
    releaseOcx () {
      this.playbackRequestData = []
      try {
        let Plugin = this.$refs.prewviewOcx
        Plugin.OCX_CloseFrame(JSON.stringify({ cmd: 9 }))
      } catch (e) { }
    },
    funOnEvent (data) {
      let callBackdata = JSON.parse(data)
      console.log(callBackdata)
    },
    // 获取视频数据
    getData () {
      this.cameraData = {}
      this.$nextTick(() => {
        let WshShell = new window.ActiveXObject('WScript.Shell')
        let computerName = WshShell.ExpandEnvironmentStrings('%COMPUTERNAME%')
        getLpnDevice(computerName).then(res => {
          this.previewAllData = res.data
          console.log('res : ' + JSON.stringify(res))
          if (this.previewAllData.length > 1) {
            this.previewData = this.previewAllData[1]
          }
          this.playPreview()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    changeStream (streamCode) {
      this.StopPreview()
      // 回放资源也需要释放
      this.previewData.streamProfile = streamCode
      this.rePlayPreview()
    }
  }
}
</script>
<style scoped lang='less'>
.ocx {
  position: relative;
  .ocx-show {
    margin-left: 52px;
    height: 594px;
    object {
      float: left;
    }
  }
  .error-img {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 100;
    width: 520px;
    height: 390px;
    margin-left: -528px;
  }
}
</style>



