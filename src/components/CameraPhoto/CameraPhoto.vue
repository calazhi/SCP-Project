<template>
  <el-dialog :visible.sync="cameraPhotoVisible" width="900px" append-to-body :before-close="handleClose">
    <div slot="title">
      <span>拍照</span>
    </div>
    <el-button type="primary" @click="GetDeviceList" size="mini">检测摄像头</el-button>
    <el-button type="primary" @click="SnapPicture" size="mini" :disabled="SnapButton">拍照</el-button>
    <div class='button'>
      <el-select v-model="selectedCameraName" placeholder="请选择摄像头" :disabled='isSelect' width='30px' @change='onChangeCamera'>
        <el-option v-for="camera in usbCameraNameList" :key="camera.id" :label="camera.name" :value="camera.value">
        </el-option>
      </el-select>
    </div>
    <div class='photo-preview'>
      <object ref="qcapture" CLASSID="CLSID:583A5342-AFE6-4DC7-98B1-F9F5F260ABE0" width="320" height="240"></object>
      <img :src="this.showImg" alt="" class="show-img" ref="imgShow">
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveUpload" :disabled='sendPhotoBase64'>确 定</el-button>
      <el-button @click="cancelUpload">取 消</el-button>
    </div>
  </el-dialog>
</template>
 <script>
export default {
  props: {
    uploadImg: {
      imgName: 'cameraPhote.jpg',
      imgBase64: ''
    },
    changeImg: false
  },
  data () {
    return {
      cameraPhotoVisible: false,  // 显隐dialog
      appendToBody: true,
      isSelect: true,             // 摄像头可选         默认禁用
      SnapButton: true,           // 拍照按钮           默认禁用
      sendPhotoBase64: true,      // 拍照成功确认按钮    默认禁用
      usbCameraName: [],          // OCX识别摄像头名初始化
      usbCameraNameList: [],      // 显示可选摄像头列表初始化
      selectedCameraName: '',     // 选中摄像头初始化
      showImg: ''
    }
  },
  methods: {
    /**
     * @description 打开拍照页面
     */
    OpenCamera: function () {
      this.cameraPhotoVisible = true
    },
    /**
     * @description 确认提交按钮
     */
    saveUpload: function () {
      // 拍照图片base64是否存在
      if (this.showImg !== '') {
        this.uploadImg.imgBase64 = this.$refs.imgShow.src
        this.$emit('changeImg', true)
        this.reset()
      } else {
        this.$message({
          message: '请拍照后上传',
          type: 'warning'
        })
      }
      this.StopVideo()
    },
    /**
     * @description 取消按钮
     */
    cancelUpload: function () {
      this.reset()
    },
    /**
     * @description 页面关闭按钮
     */
    handleClose: function () {
      this.reset()
    },
    /**
     * @description 页面关闭重置初始化
     */
    reset: function () {
      this.cameraPhotoVisible = false
      this.StopVideo()
      // 照片预览初始化
      this.showImg = ''
      // OCX识别摄像头名初始化
      this.usbCameraName = []
      // 显示可选摄像头列表初始化
      this.usbCameraNameList = []
      this.isSelect = true
      this.SnapButton = true
      this.sendPhotoBase64 = true
      this.cameraPhotoVisible = false
    },
    DirectCall: function (command, param) {
      this.$refs.qcapture.DirectCall(command, param)
    },
    /**
     * @description 检测控件
     */
    checkOcx: function (command, param) {
      try {
        this.$refs.qcapture.DirectCall(command, param)
        return true
      } catch (err) {
        return false
      }
    },
    /**
     * @description OCX控件下载页面
     */
    ocxUrl: function () {
      this.$alert('<strong><a href="/OCX/dh-usbcamera.zip">摄像头OCX控件检测失败，请点击下载安装控件</a></strong>', '摄像头OCX控件下载地址', {
        dangerouslyUseHTMLString: true
      })
    },
    /**
     * @description 控件初始化
     */
    initOcx: function () {
      if (this.checkOcx('General.Init', '{}')) {
        console.log('摄像头OCX控件已安装，初始化成功')
      } else {
        this.ocxUrl()
        this.reset()
      }
    },
    // 控件版本号   请勿删除用于更新控件使用
    // GetVersion: function () {
    //   var command = 'Common.GetVersion'
    //   var param = '{}'
    //   var ret = this.$refs.qcapture.DirectCall(command, param)
    //   alert(ret)
    // },
    /**
     * @description 获取摄像头列表
     */
    GetDeviceList: function () {
      // OCX控件初始化
      this.initOcx()
      var ret = this.$refs.qcapture.DirectCall('General.GetDeviceList', '{"deviceType":"video"}')
      console.log('所有摄像头列表   ' + ret)
      var x = ret.indexOf('[')
      var y = ret.indexOf(']')
      if (x === -1 && y === -1) {
        this.$message({
          message: '检测不到摄像头硬件设备或USB无访问权限',
          type: 'warning'
        })
        return
      }
      console.log('控件检测成功、摄像头设备识别正常')
      this.usbCameraName = []                    // 重置Ocx硬件识别列表
      this.usbCameraNameList = []                // 重置Ocx硬件识别列表
      this.selectedCameraName = ''               // 重置选中摄像头
      this.isSelect = false                      // 摄像头是否可选
      this.sendPhotoBase64 = true
      this.usbCameraName = ret.slice(x + 4, y - 2).split(',')
      console.log(this.usbCameraName)
      for (var i = 0; i < this.usbCameraName.length; i++) {
        var camera = {}
        camera.name = '摄像头' + (i + 1)
        camera.value = this.usbCameraName[i]
        this.usbCameraNameList.push(camera)
      }
      if (this.usbCameraName.length === 1) {
        this.isSelect = true
      }
      this.selectedCameraName = this.usbCameraName[0]
      this.StopVideo()
      this.OpenVideo(this.selectedCameraName)
    },
    /**
     * @description 切换摄像头
     * 切换摄像头  用于摄像头切换先停止前一个摄像头工作
     */
    onChangeCamera: function () {
      this.StopVideo()
      this.OpenVideo(this.selectedCameraName)
      this.sendPhotoBase64 = true
    },
    /**
     * @description 打开摄像头
     * @param {String} selectedCameraName 选中摄像头
     */
    OpenVideo: function (selectedCameraName) {
      this.SnapButton = false
      var command = 'Real.OpenVideo'
      console.log('选中摄像头   ' + selectedCameraName)
      var param = '{"videoName":' + selectedCameraName + ',"videoType":"MJPG","sizeWidth":240,"sizeHeight":240,"frameRate":25}'
      this.$refs.qcapture.DirectCall(command, param)
    },
    /**
     * @description 拍照
     */
    SnapPicture: function () {
      var command = 'Record.SnapPicture'
      var param = '{}'
      var ret = this.$refs.qcapture.DirectCall(command, param)
      console.log(ret.slice(17, -20))
      console.log(ret.slice(17, -20).length > 20)
      if (ret.slice(17, -20).length > 50) {
        this.showImg = 'data:image/jpeg;base64,' + ret.slice(17, -20)
        this.sendPhotoBase64 = false
      } else {
        this.$message({
          message: '摄像头设备运行异常或损坏，成像异常',
          type: 'warning'
        })
        console.log('摄像头设备运行异常或损坏，成像异常')
      }
    },
    /**
     * @description 关闭摄像头
     */
    StopVideo: function () {
      var command = 'Real.CloseVideo'
      var param = '{}'
      this.$refs.qcapture.DirectCall(command, param)
      console.log('摄像头停止工作')
    }
  }
}
</script>
<style scoped>
.photo-preview {
  margin: 20px 0 0 205px;
}
.show-img {
  width: 320px;
  height: 240px;
}
.button {
  margin-top: 20px;
}
</style scoped>

