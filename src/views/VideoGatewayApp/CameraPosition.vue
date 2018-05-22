<template>
  <div class="device-main">
    <el-form :inline="true" :model="searchData" :rules="searchFormRules" ref="searchForm" class="search-form">
      <el-form-item label="设备名称" prop="cameraName">
        <el-input v-model.trim="searchData.cameraName" clearable placeholder="设备名称" :maxlength="64"></el-input>
      </el-form-item>
      <el-button type="primary" @click="onSearch">查询</el-button>
      <el-button type="primary" @click="onDeviceUpload">导入</el-button>
      <el-table :data="deviceList" border ref="deviceListForm">
        <el-table-column align="center" prop="deviceName" label="设备名称"></el-table-column>
        <el-table-column align="center" prop="deviceTypeName" label="设备类型"></el-table-column>
        <el-table-column align="center" prop="deviceIP" label="IP地址"></el-table-column>
        <el-table-column align="center" prop="devicePort" label="端口号"></el-table-column>
        <el-table-column align="center" prop="installAddress" label="安装地址"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="onBtnBinding(scope.$index, scope.row)">绑定位置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="video-pagination">
        <el-pagination @size-change="onHandleSizeChange" @current-change="onHandleCurrentChange" :current-page.sync="searchData.pageNo" :page-sizes="[10, 20, 50]" :page-size="searchData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="numTotal">
        </el-pagination>
      </div>
    </el-form>
    <el-dialog title='设备导入' :visible.sync="isImportDialogShow" width="400px" top="8vh" @close="closeDialog" :close-on-click-modal="false">
      <el-upload class="upload-demo" :headers="tokenHeaders" ref="upload" :multiple="false" :limit=1 action="/scp-videogatewayapp/camera/coordinate/cameraCoordinateImport" :on-error="handleError" :on-success="handleSucess" :on-change="handleUploadFile" :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="onSubmitUpload">上传到服务器</el-button>
        <el-button size="small" type="primary" @click="onDownload">模板下载</el-button>
        <div slot="tip" class="el-upload__tip">请选择EXCEL文件！</div>
      </el-upload>
    </el-dialog>
    <el-dialog :title="dialogtitle" :visible.sync="dialog.visible" :close-on-click-modal="false" center width="960px">
      <el-table :data="dialogList" border ref="deviceListForm" stripe class="binding-table">
        <el-table-column align="center" prop="x" label="X坐标"></el-table-column>
        <el-table-column align="center" prop="y" label="Y坐标"></el-table-column>
        <el-table-column align="center" prop="longitude" label="经度"></el-table-column>
        <el-table-column align="center" prop="latitude" label="纬度"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="onBtnModify(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" class="Danger" size="mini" @click="onBtnDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="video-pagination" v-show="dialogList&&dialogList.length">
        <el-pagination @size-change="onSizeChange" @current-change="onCurrentChange" :current-page.sync="bindingPositonData.pageNo" :page-sizes="[10, 20, 50]" :page-size="bindingPositonData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="bindingTotal">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onButtonaAdd">新增</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="inputDialog.visible" :close-on-click-modal="false" width="730px" center @close="closeEvent">
      <el-form :model="positionData" ref="positionData" :rules="rules" label-width="80px" label-position="left" style="text-align:center">
        <el-form-item label="X坐标" prop="xcoordinate">
          <el-input v-model.trim="positionData.xcoordinate" clearable placeholder="请输入X坐标" :maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="Y坐标" prop="ycoordinate">
          <el-input v-model.trim="positionData.ycoordinate" clearable placeholder="请输入Y坐标" :maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model.trim="positionData.longitude" clearable placeholder="请输入经度" :maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model.trim="positionData.latitude" clearable placeholder="请输入纬度" :maxlength="64"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onAddPosition('positionData')">确定</el-button>
        <!-- <el-button type="primary" @click="onAddItem()" v-if="dialog.isAdd" :loading="insertLoading">取消</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getCameraPositionData, getCameraPositionBindingData, postCameraPositionAddData, postCameraPositionDeleteData, postCameraPositionModificationData } from '@/views/VideoGatewayApp/apis/cameraPosition.js'
import { cameraDownloadExcelTemplate } from '@/views/VideoGatewayApp/apis/common.js'
export default {
  name: 'videoDevice',
  data () {
    var checkX = (rule, value, callback) => {
      if (!this.positionData.xcoordinate) {
        return callback(new Error('X不能为空'))
      }
      if (!/^(?!!0+(\.0+)?$)\d+(\.\d+)?$/.test(this.positionData.xcoordinate)) {
        callback(new Error('请输入非负的数字'))
      } else {
        callback()
      }
    }
    var checkY = (rule, value, callback) => {
      if (!this.positionData.ycoordinate) {
        return callback(new Error('Y不能为空'))
      }
      if (!/^(?!!0+(\.0+)?$)\d+(\.\d+)?$/.test(this.positionData.ycoordinate)) {
        callback(new Error('请输入非负的数字'))
      } else {
        callback()
      }
    }
    var checkLongitude = (rule, value, callback) => {
      if (!this.positionData.longitude) {
        return callback(new Error('经度不能为空'))
      }
      if (!/^-?[0-9]+\.?[0-9]*$/.test(this.positionData.longitude)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    var checkLatitude = (rule, value, callback) => {
      if (!this.positionData.latitude) {
        return callback(new Error('纬度不能为空'))
      }
      if (!/^-?[0-9]+\.?[0-9]*$/.test(this.positionData.latitude)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      searchData: {
        cameraName: '',
        pageNo: 1,
        pageSize: 10
      },
      numTotal: 0,
      btnState: false,
      bindingPositonData: {
        cameraId: '',
        pageNo: 1,
        pageSize: 10
      },
      bindingTotal: 0,
      isImportDialogShow: false,
      importFileData: {},
      tokenHeaders: { 'FrontType': 'scp-admin-ui', 'Authorization': sessionStorage.token },
      modifyUuid: '',
      dialogtitle: '',
      positionData: {
        xcoordinate: '',
        ycoordinate: '',
        longitude: '',
        latitude: ''
      },
      cameraPositonAdd: {
        cameraName: ''
      },
      deviceList: [],
      dialogList: [],
      insertLoading: false,
      updataLoading: false,
      total: '',
      inputDialog: {
        visible: false
      },
      dialog: {
        visible: false
        // isAdd: true
      },
      // 设备属性框规则
      rules: {
        xcoordinate: [{ required: true, validator: checkX, trigger: 'blur' }],
        ycoordinate: [{ required: true, validator: checkY, trigger: 'blur' }],
        longitude: [{ required: true, validator: checkLongitude, trigger: 'blur' }],
        latitude: [{ required: true, validator: checkLatitude, trigger: 'blur' }]
      },
      // 查询框规则
      searchFormRules: {
        cameraName: [{ required: false, message: '请输入设备名称', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.onSearch()
  },
  methods: {
    // 查询设备列表
    onSearch () {
      getCameraPositionData(this.searchData).then(
        result => {
          if (result.data.code === '00000') {
            if (result.data.data.rows && result.data.data.rows.length) {
              this.deviceList = result.data.data.rows
              this.numTotal = result.data.data.total
            } else {
              this.deviceList = []
              this.numTotal = 0
            }
          } else {
            this.deviceList = []
            this.numTotal = 0
          }
        }
      ).catch(() => {
      })
    },
    // 绑定位置列表
    onDialogSearch () {
      getCameraPositionBindingData(this.bindingPositonData).then(
        result => {
          if (result.data.code === '00000') {
            if (result.data.data.rows && result.data.data.rows.length) {
              this.dialogList = result.data.data.rows
              this.bindingTotal = result.data.data.total
            } else {
              this.dialogList = []
              this.bindingTotal = 0
            }
          } else {
            this.dialogList = []
            this.bindingTotal = 0
          }
        }
      ).catch(() => {
      })
    },
    // 导入按钮
    onDeviceUpload () {
      this.isImportDialogShow = true
    },
    // 关闭时重置导入dialog文件
    closeDialog () {
      this.$refs.upload.clearFiles()
      this.importFileData = {}
    },
    // 上传服务器按钮
    onSubmitUpload () {
      if (this.importFileData['file']) {
        this.$refs.upload.submit()
      } else {
        this.$message({
          message: '请先选择上传文件',
          type: 'warning'
        })
      }
    },
    // 导入功能下载模板
    onDownload () {
      cameraDownloadExcelTemplate(2)
        .then()
    },
    // 文件上传失败
    handleError () {
      this.$message({
        message: '文件上传失败，请重新上传',
        type: 'error'
      })
    },
    // 文件改变时
    handleUploadFile (file) {
      this.importFileData = { 'file': file }
    },
    // 文件上传成功
    handleSucess (response, file, fileList) {
      // response上传成功返回信息
      if (response.code === '00000') {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$msgbox({
          title: '消息',
          message: response.data,
          confirmButtonText: '确定'
        })
      }
      this.isImportDialogShow = false
      this.onSearch()
    },
    // 添加按钮
    onButtonaAdd () {
      this.btnState = false
      this.inputDialog.visible = true
    },
    // 确认按钮
    onAddPosition (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.btnState) {
            this.onAddBtnModify()
          } else {
            this.onAdd()
          }
          this.inputDialog.visible = false
          this.$refs['positionData'].resetFields()
        } else {
          return false
        }
      })
    },
    // 添加接口
    onAdd () {
      let param = {
        cameraId: this.bindingPositonData.cameraId,
        cameraName: this.cameraPositonAdd.cameraName,
        x: this.positionData.xcoordinate,
        y: this.positionData.ycoordinate,
        longitude: this.positionData.longitude,
        latitude: this.positionData.latitude
      }
      postCameraPositionAddData(param).then(
        result => {
          if (result.data.code === '00000') {
            this.onDialogSearch()
            this.$message({ type: 'success', message: '添加成功!' })
          }
          if (result.data.code === '220') {
            this.$message({ type: 'error', message: result.data.data })
          }
        }
      ).catch(() => {
      })
    },
    // 编辑接口
    onAddBtnModify () {
      let param = {
        cameraId: this.bindingPositonData.cameraId,
        cameraName: this.cameraPositonAdd.cameraName,
        x: this.positionData.xcoordinate,
        y: this.positionData.ycoordinate,
        longitude: this.positionData.longitude,
        latitude: this.positionData.latitude,
        uuid: this.modifyUuid
      }
      postCameraPositionModificationData(param).then(rs => {
        if (rs.data.code === '00000') {
          this.onDialogSearch()
          this.$message({ type: 'success', message: '修改成功!' })
        }
        if (rs.data.code === '220') {
          this.$message({ type: 'error', message: rs.data.data })
        }
      }).catch(() => {
      })
    },
    // 绑定位置按钮
    onBtnBinding (index, item) {
      this.dialogtitle = item.deviceName
      this.cameraPositonAdd.cameraName = item.deviceName
      this.bindingPositonData.cameraId = item.deviceID
      this.onDialogSearch()
      this.dialog.visible = true
    },
    // 编辑按钮
    onBtnModify (index, item) {
      this.modifyUuid = item.uuid
      this.btnState = true
      this.inputDialog.visible = true
      this.positionData.xcoordinate = item.x
      this.positionData.ycoordinate = item.y
      this.positionData.longitude = item.longitude
      this.positionData.latitude = item.latitude
    },
    // 关闭按钮
    closeEvent () {
      this.$refs['positionData'].resetFields()
      this.positionData.xcoordinate = ''
      this.positionData.ycoordinate = ''
      this.positionData.longitude = ''
      this.positionData.latitude = ''
      this.inputDialog.visible = false
    },
    // 删除设备功能按钮
    onBtnDelete (index, item) {
      this.$confirm('是否要删掉该条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let param = {
          uuid: item.uuid,
          cameraId: item.cameraId
        }
        postCameraPositionDeleteData(param).then(rs => {
          if (rs.data.code === '00000') {
            this.onDialogSearch()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: rs.data.message ? rs.data.message : '删除失败!'
            })
          }
        }).catch(() => {
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // pageSize 改变时会触发
    onHandleSizeChange (val) {
      this.searchData.pageSize = val
      this.onSearch()
    },
    // currentPage 改变时会触发
    onHandleCurrentChange (val) {
      this.searchData.pageNo = val
      this.onSearch()
    },
    // 手动更改设备表格分组分页
    onSizeChange (val) {
      this.bindingPositonData.pageSize = val
      this.onDialogSearch()
    },
    // currentPage 改变时会触发
    onCurrentChange (val) {
      this.bindingPositonData.pageNo = val
      this.onDialogSearch()
    }
  }
}
</script>
<style  lang="less">
.binding-table th {
  background: #eef1f6 !important;
}
.device-main {
  .el-table {
    margin-top: 30px;
    width: 100%;
  }
  .video-pagination {
    text-align: center;
    margin-top: 15px;
  }
  .el-upload--text {
    width: auto;
    height: auto;
    overflow: visible;
  }
}
.search-form {
  .el-form-item.is-success .el-input__inner {
    border-color: #dcdfe6;
  }
  .el-form-item.is-success .el-input__inner:focus {
    border-color: #409eff;
  }
}
</style>
