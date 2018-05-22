<template>
  <el-dialog :visible.sync="dialogVisible" width="400px" @open="onClearFiles">
    <div slot="title">
      <span>{{title}}</span>
    </div>
    <el-upload class="upload-demo" ref="upload" :headers="tokenHeaders" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :action="action" :on-change="fileChange" :auto-upload="false" :on-success="successFiles" :on-error="errFiles">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="onSubmitUpload">上传到服务器</el-button>
      <el-button style="margin-left: 10px;" size="small" type="primary" @click="onTemplateDownload">模版下载</el-button>
      <!--class="el-upload__tip"  element-ui官方命名-->
      <div slot="tip" class="el-upload__tip">{{tips}}</div>
    </el-upload>
  </el-dialog>
</template>
<script>
import { template } from '../apis/org_manager'
export default {
  data () {
    return {
      fileListName: null, // 上传文件列表名称
      dialogVisible: false, // 显隐dialog
      tokenHeaders: { 'FrontType': 'scp-admin-ui', 'Authorization': sessionStorage.token }
    }
  },
  props: {
    action: {
      type: String,
      required: true
    },
    tips: {
      type: String,
      default: ''
    },
    downloadUrl: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: '导入'
    }
  },
  methods: {
    /**
     * @description 打开导入页面
     */
    openDialog: function () {
      this.dialogVisible = true
    },
    /**
     * @description 文件上传，触发文件选择钩子函数
     * 在文件上传时，触发选择文件钩子函数，提示用户操作，增加用户体验优化
     */
    onSubmitUpload: function () {
      if (this.fileListName != null) {
        this.$refs.upload.submit()
        this.fileListName = null
      } else {
        this.$message({
          message: '请选择上传的文件',
          type: 'warning'
        })
      }
    },
    /**
     * @description 模板下载
     */
    onTemplateDownload: function () {
      template(this.downloadUrl)
        .then(res => {
          let fileName = this.title.slice(0, 2) + '模板.xlsx'
          let blob = new Blob([res.data], { type: 'application/x-xls' })
          if (navigator.appVersion.toString().indexOf('.NET') > 0) {
            window.navigator.msSaveBlob(blob, fileName)
          } else {
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
        .catch(err => {
          this.$message({
            message: '服务器连接异常',
            type: 'warning'
          })
          console.warn('模板下载err')
          console.warn(err)
        })
    },
    /**
     * @description element-UI官方函数  文件上传成功，触发成功钩子函数
     * 在文件上传时，上传成功，触发elementUi上传组件成功钩子函数，给用户提出相关提示信息，增加用户体验优化
     * @param {Object} response 后台返回信息
     * @param {Object} file fiels文件对象
     * @param {Array} fileList filelist文件列表信息
     */
    successFiles: function (response, file, fileList) {
      // response上传成功返回信息
      if (response.code === '00000') {
        this.$message({
          message: response.data,
          file: response.message,
          type: 'success'
        })
        // 上传成功向父组件发送通知，进行下一步操作
        this.$emit('successUpload', true)
        this.dialogVisible = false
      } else {
        this.$message({
          message: response.data,
          file: response.message,
          type: 'warning'
        })
        this.dialogVisible = true
      }
      this.onClearFiles()
    },
    /**
     * @description element-UI官方函数 文件上传失败，触发失败钩子函数
     * 在文件上传时，若遇服务器不稳定等情况，触发elementUi上传组件失败钩子函数，给用户提出相关提示信息，增加用户体验优化
     * @param {Object} err 后台返回信息
     * @param {Object} files fiels文件对象
     * @param {Array} fileList filelist文件列表信息
     */
    errFiles: function (err, file, fileList) {
      console.log(err.status)
      this.$message({
        message: '网络异常',
        type: 'warning'
      })
    },
    /**
     * @description 上传列表最多只能1个文件，在上传文件时，如果上传列表已经有文件了，则删除此文件
     * @param {Object} files fiels文件对象
     * @param {Array} fileList filelist文件列表信息
     */
    fileChange: function (files, fileList) {
      // 若上传文件对象存在，且可读
      if (files && files.status === 'ready' && fileList.length === 2) {
        fileList.shift()
      }
      if (files && files.status === 'ready' && fileList.length === 1) {
        // 截取文件名
        this.fileListName = files.name.toLowerCase().substring(files.name.lastIndexOf('.') + 1, files.name.length)
        // 判断文件后缀名
        if (this.fileListName === 'xls' || this.fileListName === 'xlsx' || this.fileListName === 'xlsm') {
          // 判断文件大小
          if (files.size <= 1024 * 1024) {
            this.$message({
              message: '文件选择成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '上传文件大小限制1M',
              type: 'warning'
            })
            fileList.shift()
          }
        } else {
          this.$message({
            message: '文件选择失败，请选择Excel表格文件',
            type: 'warning'
          })
        }
      }
    },
    /**
     * @description 文件对象重置
     */
    onClearFiles: function () {
      this.$nextTick(() => {
        this.$refs.upload.clearFiles()
      })
    }
  }
}
</script>
