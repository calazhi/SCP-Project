<template>
  <div class="device-main">
    <el-form :inline="true" :model="searchData" :rules="searchFormRules" ref="searchForm" class="search-form">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="searchData.deviceName" clearable placeholder="设备名称" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="设备IP" prop="deviceIp">
        <el-input v-model="searchData.deviceIp" clearable placeholder="设备IP" :maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="端口" prop="devicePort">
        <el-input v-model="searchData.devicePort" clearable placeholder="端口" :maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="设备类型" prop="deviceType">
        <el-select v-model="searchData.deviceType" clearable placeholder="请选择">
          <el-option v-for="(value,key) in deviceTypeArr" :label="value" :value="key" :key="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="监控点IP" prop="cameraIp">
        <el-input v-model="searchData.cameraIp" clearable placeholder="监控点IP" :maxlength="32"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onResetSearchForm">重置</el-button>
      </el-form-item>
      <div>
        <el-button type="primary" @click="onSearch(1)">查询</el-button>
        <el-button type="primary" @click="onBtnAdd">新增设备</el-button>
        <el-button type="primary" @click="onSelectDelete">删除设备</el-button>
        <el-button type="primary" @click="onDeviceUpload">导入</el-button>
      </div>
      <el-table :data="deviceList" border @selection-change="selectChange" ref="deviceListForm">
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="deviceName" label="设备名称"></el-table-column>
        <el-table-column align="center" prop="deviceIp" label="IP地址"></el-table-column>
        <el-table-column align="center" prop="devicePort" label="端口"></el-table-column>
        <el-table-column align="center" prop="deviceType" label="设备类型" :formatter="getDeviceTypeLabel"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="onBtnModify(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="onBtnDelete(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" @click="onBtnCheck(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" @click="onBtnRefresh(scope.$index, scope.row)">刷新</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="video-pagination">
        <el-pagination @size-change="onSizeChange" @current-change="onSearch" :current-page="curPageNo" :page-sizes="[10, 20, 50]" :page-size="searchData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="numTotal">
        </el-pagination>
      </div>
    </el-form>
    <el-dialog :title="dialog.isAdd?'添加视频设备':'修改视频设备'" :visible.sync="dialog.visible" :close-on-click-modal="false">
      <el-form :model="device" ref="deviceForm" :rules="dialogRules" label-width="80px">
        <el-form-item label="设备厂商" prop="manufacturer">
          <el-select v-model="device.manufacturer" clearable placeholder="请选择">
            <el-option v-for="(value,key) in deviceMaker" :label="value" :value="key" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model.trim="device.deviceName" clearable placeholder="设备名称" :maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="device.deviceType" clearable placeholder="请选择">
            <el-option v-for="(value,key) in deviceTypeArr" :label="value" :value="key" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IP地址" prop="deviceIp">
          <el-input v-model="device.deviceIp" placeholder="IP地址" :disabled="disabledInput" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="devicePort">
          <el-input v-model="device.devicePort" clearable placeholder="端口" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="deviceUserName">
          <el-input v-model.trim="device.deviceUserName" clearable placeholder="用户名" :maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="deviceUserPwd">
          <el-input v-model.trim="device.deviceUserPwd" clearable placeholder="密码" type="password" :maxlength="32"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="onAddItem()" v-if="dialog.isAdd" :loading="insertLoading">确 定</el-button>
        <el-button type="primary" @click="onModifyItem()" v-else :loading="updataLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="checkName" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
      <el-table :data="checkDataList" border fit>
        <el-table-column align="center" prop="channelLogicId" label="NVR通道号"></el-table-column>
        <el-table-column align="center" prop="cameraIp" label="监控点IP"></el-table-column>
        <el-table-column align="center" prop="cameraPort" label="监控点端口"></el-table-column>
        <el-table-column align="center" prop="online" label="监控点状态" :formatter="getOnline"></el-table-column>
        <el-table-column align="center" prop="cameraChannelNo" label="监控点通道号"></el-table-column>
        <el-table-column align="center" prop="cameraCode" label="监控点编号"></el-table-column>
      </el-table>
      <div class="video-pagination">
        <el-pagination @size-change="onHandleSizeChange" @current-change="onHandleCurrentChange" :current-page="curpageNo" :page-size='checkDataList.pageSize' :page-sizes="[5, 10]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog title='设备导入' :visible.sync="isImportDialogShow" width="400px" top="8vh" @close="closeDialog" :close-on-click-modal="false">
      <el-upload class="upload-demo" :headers="tokenHeaders" ref="upload" :multiple="false" :limit=1 action="/scp-videogatewayapp/video/device/deviceInto" :on-error="handleError" :on-success="handleSucess" :on-change="handleUploadFile" :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="onSubmitUpload">上传到服务器</el-button>
        <el-button size="small" type="primary" @click="onDownload">模板下载</el-button>
        <div slot="tip" class="el-upload__tip">请选择EXCEL文件！</div>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
import { isValidIP, emptyObj, deviceTypeArr, deviceMaker, onLine, encryption, decryption, downloadExcelTemplate } from '@/views/VideoGatewayApp/apis/common.js'
import { postGetDeviceData, postAddDeviceData, postDeleteDeviceData, postModifyDeviceData, getCheckDeviceData, getRefreshDeviceData } from '@/views/VideoGatewayApp/apis/videoDevice.js'
import { copyObject } from '../../packages/utils/util'
export default {
  name: 'videoDevice',
  data () {
    return {
      searchData: { // 获取设备列表
        deviceName: '',
        deviceType: '',
        cameraIp: '',
        deviceIp: '',
        devicePort: '',
        pageNo: 0,
        pageSize: 20
      },
      device: this.getEmptyDevice(), // 设备属性
      numTotal: 0,
      curPageNo: 1,
      curpageNo: 1,
      deviceTypeArr: deviceTypeArr,
      deviceMaker: deviceMaker,
      deviceList: [],  // 设备列表
      selection: [],
      checkData: {
        uuid: '',
        pageNo: 1,
        pageSize: 10
      },
      insertLoading: false,
      updataLoading: false,
      checkDataList: [], // 查看属性
      dialogTableVisible: false,
      isImportDialogShow: false,
      importFileData: {},
      tokenHeaders: { 'FrontType': 'scp-admin-ui', 'Authorization': sessionStorage.token },
      checkName: '',
      onLine: onLine,
      total: '',
      disabledInput: false,
      dialog: {
        visible: false,
        isAdd: true,
        curIndex: 0
      },
      // 设备属性框规则
      dialogRules: {
        manufacturer: [{ required: true, message: '请选择设备厂商', trigger: 'change' }],
        deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        deviceType: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        deviceIp: [
          { required: true, message: '请输入IP地址', trigger: 'blur' },
          { validator: this.deviceIpFormat, trigger: 'blur' }
        ],
        devicePort: [
          { required: true, message: '请输入端口', trigger: 'blur' },
          { validator: this.devicePortFormat, trigger: 'blur' }
        ],
        deviceUserName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        deviceUserPwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      // 查询框规则
      searchFormRules: {
        deviceName: [{ required: false, message: '请输入设备名称', trigger: 'blur' }],
        deviceType: [{ required: false, message: '请选择设备类型', trigger: 'change' }],
        deviceIp: [
          { required: false, trigger: 'blur' },
          { validator: this.deviceIpFormat, trigger: 'blur' }
        ],
        cameraIp: [
          { required: false, trigger: 'blur' },
          { validator: this.deviceIpFormat, trigger: 'blur' }
        ],
        devicePort: [
          { required: false, trigger: 'blur' },
          { validator: this.devicePortFormat, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.onSearch(this.curPageNo)
  },
  methods: {
    // 查询设备列表
    onSearch (pageNo) {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.searchData.pageNo = pageNo // 查询页码
          postGetDeviceData(this.searchData).then(
            result => {
              this.deviceList = result.rows
              this.numTotal = result.total
              this.curPageNo = pageNo
              for (let i = 0; i < result.rows.length; i++) {
                this.deviceList[i].deviceUserPwd = decryption(this.deviceList[i].deviceUserPwd)
              }
            }
          )
        } else {
          return false
        }
      })
      // if (this.checkSearchForm()) {
      // }
    },
    // 添加设备功能
    onAddItem () {
      this.$refs['deviceForm'].validate(
        (valid) => {
          if (valid) {
            this.insertLoading = true
            let reqData = this.getReqData(this.device, true)
            postAddDeviceData(reqData).then(
              result => {
                this.insertLoading = false
                this.dialog.visible = false
                this.onSearch(this.curPageNo)
                this.$message({ type: 'success', message: '添加成功！' })
              }
            ).catch(() => {
              this.insertLoading = false
            })
          } else {
            return false
          }
        }
      )
    },
    // 添加设备按钮
    onBtnAdd () {
      this.device = this.getEmptyDevice()
      this.dialog.visible = true
      this.dialog.isAdd = true
      this.disabledInput = false
      if (this.$refs['deviceForm']) this.$refs['deviceForm'].resetFields()
    },
    // 删除用户选择的设备
    onSelectDelete () {
      if (this.selection.length <= 0) {
        this.$alert('先勾选设备,才能删除设备', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          center: true,
          callback: () => { return false }
        })
      } else {
        this.$confirm('删除设备可能影响录像查询功能, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var oidArr = this.selection.map(item => item.uuid)
          let reqData = { deviceIdList: oidArr }
          postDeleteDeviceData(reqData).then(
            result => {
              this.numTotal -= this.selection.length
              this.deviceList = this.deviceList.filter(
                item => oidArr.indexOf(item.uuid) === -1
              )
              this.$message({ type: 'success', message: '删除成功!' })
              this.onSearch(this.curPageNo)
            }
          ).catch(() => {
            this.$message({ type: 'error', message: '删除失败！' })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
          this.$refs.deviceListForm.clearSelection()
        })
      }
    },
    // 删除设备功能按钮
    onBtnDelete (index, item) {
      this.$confirm('删除设备可能影响录像查询功能, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let reqData = { deviceIdList: [item.uuid] }
        postDeleteDeviceData(reqData).then(
          result => {
            this.deviceList.splice(index, 1)
            this.numTotal--
            this.$message({ type: 'success', message: '删除成功!' })
            this.onSearch(this.curPageNo)
          }
        ).catch(() => {
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.$refs.deviceListForm.clearSelection()
      })
    },
    // 编辑设备功能
    onModifyItem () {
      this.$refs['deviceForm'].validate((valid) => {
        if (valid) {
          this.updataLoading = true
          let reqData = this.getReqData(this.device, false)
          postModifyDeviceData(reqData).then(
            result => {
              this.updataLoading = false
              this.dialog.visible = false
              this.deviceList.splice(this.dialog.curIndex, 1, copyObject(this.device))
              this.$message({ type: 'success', message: '编辑成功！' })
            }
          ).catch(() => {
            this.updataLoading = false
          })
        } else {
          return false
        }
      })
    },
    // 编辑设备按钮
    onBtnModify (index, item) {
      this.device = copyObject(this.deviceList[index])
      this.dialog.curIndex = index
      this.dialog.visible = true
      this.dialog.isAdd = false
      this.disabledInput = true
      if (this.$refs['deviceForm']) this.$refs['deviceForm'].resetFields()
    },
    // 查看设备属性功能
    onBtnCheck (index, item) {
      if (item) this.checkData.uuid = item.uuid
      getCheckDeviceData(this.checkData).then(
        result => {
          this.dialogTableVisible = true
          this.checkName = '设备名称:' + item.deviceName
          this.total = result.total
          this.checkDataList = result.rows
        }
      ).catch(() => {
        return false
      }
        )
    },
    // 刷新设备属性功能
    onBtnRefresh (index, item) {
      let reqData = { uuid: item.uuid }
      getRefreshDeviceData(reqData).then(
        result => {
          this.$message({ type: 'success', message: '刷新成功！' })
        }
      ).catch(() => {
        return false
      }
        )
    },
    // 重置查询框
    onResetSearchForm () {
      emptyObj(this.searchData)
      this.searchData.pageSize = 20
    },
    // 验证查询格式
    checkSearchForm () {
      if (this.searchData.deviceIp) {
        if (!isValidIP(this.searchData.deviceIp)) {
          this.$message({ message: 'IP地址格式不正确！', type: 'warning' })
          return false
        }
      }
      if (this.searchData.devicePort) {
        let value = this.searchData.devicePort
        if (!this.isRegex(value) || value < 1 || value > 65535) {
          this.$message({ message: '端口不正确！', type: 'warning' })
          return false
        }
      }
      return true
    },
    // 获取被选中的数据
    selectChange (val) {
      this.selection = val
    },
    // 转换格式
    getDeviceTypeLabel (row, column, cellValue) {
      return deviceTypeArr[cellValue]
    },
    getOnline (row, column, cellValue) {
      return onLine[cellValue]
    },
    // 数据名称转换
    getReqData (item, isAdd) {
      var deviceUserPwd = encryption(item.deviceUserPwd) // 加密
      let reqData = {
        'deviceType': item.deviceType,
        'deviceName': item.deviceName,
        'devicePort': item.devicePort,
        'deviceIp': item.deviceIp,
        'deviceManufacturer': item.manufacturer,
        'deviceUsername': item.deviceUserName,
        'devicePassword': deviceUserPwd
      }
      if (!isAdd) reqData.uuid = item.uuid
      return reqData
    },
    // 重置设备属性
    getEmptyDevice () {
      return {
        uuid: '',
        deviceType: '',
        deviceName: '',
        devicePort: '',
        deviceIp: '',
        manufacturer: '',
        deviceUserName: '',
        deviceUserPwd: ''
      }
    },
    // ip规则验证
    deviceIpFormat (rule, value, callback) {
      if (value === '') callback()
      else {
        if (!isValidIP(value)) {
          callback(new Error('IP地址格式不正确'))
        } else callback()
      }
    },
    // 端口规则验证
    devicePortFormat (rule, value, callback) {
      if (value === '') callback()
      else {
        if (!this.isRegex(value) || value < 1 || value > 65535) {
          return callback(new Error('请输入1-65535的整数！'))
        } else callback()
      }
    },
    // 数字正则
    isRegex (string) {
      var reg = /^[1-9]\d*$/
      return reg.test(string)
    },
    // 手动更改设备表格分组分页
    onSizeChange (val) {
      this.searchData.pageSize = val
      this.onSearch(1)
    },
    // 向后端发送请求获取设备属性数据
    getData () {
      getCheckDeviceData(this.checkData).then(
        result => {
          this.checkDataList = result.rows
        }
      ).catch(() => {
      }
        )
    },
    // currentPage 改变时会触发
    onHandleCurrentChange (val) {
      this.checkData.pageNo = val
      this.getData()
    },
    // pageSize 改变时会触发
    onHandleSizeChange (val) {
      this.checkData.pageSize = val
      this.getData()
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
      downloadExcelTemplate(2)
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
    handleSucess (response, file, fileList) {
      // response上传成功返回信息
      if (response.code === '200' || response.code === '00000') {
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
      this.onSearch(this.curPageNo)
    }
  }
}
</script>
<style  lang="less">
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
