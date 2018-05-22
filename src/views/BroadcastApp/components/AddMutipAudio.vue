<template>
  <el-dialog :visible.sync="dialogFormVisible" :before-close="onCancel" width="450px">
    <div slot="title">
      <span>音频添加</span>
    </div>
    <div class="add-audio-con">
      <el-upload class="upload-comp" ref="upload" v-loading="loading" action="" :before-remove="beforeRemove" :limit="limit" :file-list="fileList" :auto-upload="false" :on-change="handleChange" :on-remove="handleRemove" :on-exceed="handleExceed" multiple>
        <el-button size="small" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload-tip">最多上传10个文件，文件格式:MP3</div>
      </el-upload>
    </div>
    <audio controls="" v-for="file in fileList" :key="file.index" :src="file.url" style="display: none" class="audio"></audio>
    <div slot="footer">
      <el-button type="primary" @click="onSave">{{btnLabel}}</el-button>
      <el-button @click="onCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>

import { addAudio } from '@/views/BroadcastApp/apis/index'
import { LOG_TAG } from '@/views/BroadcastApp/assets/js/index.js'
export default {
  data () {
    return {
      fileList: [],
      limit: 10,
      btnLabel: '上 传',
      dialogFormVisible: false,
      isHadNews: false,
      loading: false,
      isAudio: true
    }
  },
  methods: {
    /**
     * @description 打开对话框
     */
    openDialog: function () {
      this.resetForm()
      this.dialogFormVisible = true
    },
    /**
     * @description 清空文件列表
     */
    resetForm: function () {
      this.fileList = []
    },
    /**
     * @description 点击‘上传’按钮，上传音频文件
     */
    onSave: function () {
      if (this.fileList.length === 0) {
        this.$message({
          message: '请选择要上传的音频文件',
          type: 'warning'
        })
        return
      }
      this.isAudio = true
      this.upload()
    },
    /**
     * @description 上传文件
     */
    upload: function () {
      let _this = this
      if (this.loading) {
        this.$message({
          message: '正在上传文件，请稍候……',
          type: 'warning'
        })
        return false
      }
      let passArr = []
      let filesSize = 0
      let fileSizepass = []
      if (this.fileList.length > 0) {
        this.fileList.forEach((item, index) => {
          // 单个文件大小限制
          if (item.size / 1024 / 1024 > 50) {
            fileSizepass.push(item.name)
          } else if (!_this.audioFmtVld(item.name)) {
            passArr.push(0)
          } else {
            filesSize = filesSize + item.size
          }
        })
      }
      if (fileSizepass.length > 0) {
        let msg = '以下文件大小超过50M: ' + fileSizepass.join(',')
        _this.$message({
          message: msg,
          type: 'warning'
        })
        return false
      }
      // 校验多个文件总大小
      if (filesSize / 1024 / 1024 > 300) {
        this.$message({
          message: '上传文件超过300MB',
          type: 'warning'
        })
        return false
      }
      if (this.fileList.length > 0 && passArr.length === 0 && fileSizepass.length === 0) {
        this.getTime()
        if (!this.isAudio) {
          return false
        }
        this.loading = true
        this.btnLabel = '上传中'
        let formdata = new FormData()
        this.fileList.forEach((item, index) => {
          formdata.append('file[' + index + ']', item.raw)
          let fileName = item.raw.name
          let timeLength = item.raw.timeLength
          formdata.append('timeLengthInfo', fileName + ':' + timeLength)
        })
        addAudio(formdata).then(res => {
          if (res.data.code === '00000') {
            this.fileList = []
            this.isHadNews = true
            if (res.data.data === null) {
              this.$message({
                message: '上传成功',
                type: 'success'
              })
            } else {
              let desc = '以下音频文件名称重复，未上传： '
              this.$message.warning(desc + res.data.data)
            }
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
          this.btnLabel = '上 传'
          this.loading = false
        }).catch(err => {
          console.warn(LOG_TAG + err)
          this.btnLabel = '上 传'
          this.loading = false
        })
      }
    },
    /**
     * @description 取消按钮
     */
    onCancel: function () {
      if (this.fileList.length > 0) {
        if (this.loading) {
          this.$message({
            message: '正在上传文件，请稍候……',
            type: 'warning'
          })
          return false
        } else {
          this.$confirm('还有文件未上传，确认关闭窗口取消上传？')
            .then(_ => {
              this.fileList = []
              if (this.isHadNews) {
                this.isHadNews = false
                // 通知父组件，添加音频成功，须更新列表
                this.$emit('addAudioSucc')
              }
              this.dialogFormVisible = false
            })
            .catch(_ => { })
        }
      } else {
        if (this.isHadNews) {
          this.isHadNews = false
          // 通知父组件，添加音频成功，须更新列表
          this.$emit('addAudioSucc')
        }
        this.dialogFormVisible = false
      }
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleChange (files, fileList) {
      this.fileList = fileList
    },
    handleRemove (file, fileList) {
      this.fileList = fileList
    },
    beforeRemove: function (file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    beforeUpload: function (file) {
    },
    /**
     * @description 审查音频格式 与 文件名长度
     * @param {String} filename
     */
    audioFmtVld: function (filename) {
      let arrLen = filename.split('.').length
      let extension = filename.split('.')[arrLen - 1]
      let filenameText = filename.split('.')[arrLen - 2]
      if (extension !== 'mp3') {
        this.$message({
          message: '上传文件含非指定音频格式!',
          type: 'warning'
        })
        return false
      } else if (filenameText.length > 128) {
        this.$message({
          message: '上传文件含文件名超长的文件!',
          type: 'warning'
        })
        return false
      } else {
        return true
      }
    },
    /**
     * @description 获取音频时长
     */
    getTime: function () {
      let duration = []
      for (let i = 0; i < this.fileList.length; i++) {
        duration[i] = document.querySelectorAll('.audio')[i].duration
        if (!duration[i]) {
          let notAudio = this.fileList[i].name
          this.$message.warning('[' + notAudio + ']' + ' 为非法音频文件,请重新选择！')
          this.isAudio = false
          break
        } else {
          this.fileList[i].raw.timeLength = parseInt(duration[i])
          if (isNaN(duration[i])) {
            this.getTime()
          }
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-upload-tip {
  font-size: 12px;
  color: rgb(228, 90, 90);
}
</style>