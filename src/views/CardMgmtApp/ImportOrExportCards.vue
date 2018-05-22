<template>
  <div class="box">
    <el-upload
      class="upload-demo"
      :headers="tokenHeaders"
      ref="upload"
      :multiple="false"
      :limit=1
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      action="/scp-cardmgmtapp/cardImportOrExport/importexcel"
      :on-success="successFiles"
      :on-error="errFiles"
      :on-change="fileChange"
      :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary" class="my-upload--text">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="onSubmitUpload">上传到服务器</el-button>
        <el-button style="margin-left: 10px;" size="small" type="primary" @click="onDownload">模版下载</el-button>
        <div slot="tip" class="el-upload__tip">请选择EXCEL文件！</div>
    </el-upload>
  </div>

</template>
<script>
import { downloadExcelTemplate } from './apis'
export default {
  data () {
    return {
      fileListName: null, // 上传文件列表名称
      tokenHeaders: { 'FrontType': 'scp-admin-ui', 'Authorization': sessionStorage.token }
    }
  },
  methods: {
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
    successFiles: function (response, file, fileList) {
      // response上传成功返回信息
      if (response.code === '00000') {
        var msgs = response.message.split('#')
        const h = this.$createElement
        let newDatas = []
        for (let i in msgs) {
          newDatas.push(h('p', null, msgs[i]))
        }
        this.$message({
          message: h('div', null, newDatas),
          file: response.message,
          type: 'success'
        })
        // 上传成功向父组件发送通知，进行下一步操作
        this.$emit('successUpload', true)
      } else {
        this.$message({
          message: '上传失败' + response.message,
          file: response.message,
          type: 'warning'
        })
      }
      this.onClearFiles()
    },
    errFiles: function (err, file, fileList) {
      console.error('----->ImportOrExportCards errFiles err = ' + JSON.stringify(err))
      this.$message({
        message: '网络异常',
        type: 'warning'
      })
    },
    onClearFiles: function () {
      this.$nextTick(() => {
        this.$refs.upload.clearFiles()
      })
    },
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
    onDownload: function () {
      downloadExcelTemplate('卡片初始化导入模板.xlsx')
    }
  }
}
</script>
<style lang="less" scoped>
  .selectButton {
    display: inline-block;
    line-height: 80px;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    font-size: 14px;
    border-radius: 4px;
  }
  .box{
    margin-left: auto;
    margin-right: auto;
    padding-top: 100px;
  }
  my-upload--text {
    with: 0;
    height: 0;
  }
</style>
