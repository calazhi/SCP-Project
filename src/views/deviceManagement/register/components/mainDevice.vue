<template>
  <div class="main">
    <el-row :gutter="60">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <select-box title="设备类型" code="deviceTypeDesc" :options="deviceType" @listenToInput="_saveDeviceData" ref="deviceTypeDesc">
          </select-box>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <select-box title="厂商名称" code="providerCode" ref="providerCode" :options="providerType" @listenToInput="_saveDeviceData">
          </select-box>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <select-box title="网关标识" code="gatewayId" ref="gatewayId" :options="gatewayType" @listenToInput="_saveDeviceData">
          </select-box>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="60">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-tooltip :content="selectedVaue.orgId" placement="top" effect="light" :disabled="!selectedVaue.orgId">
            <inputBox title="组织ID" code="orgId" ref="orgId" @listenToInput="_saveDeviceData" :disabled=true :value="selectedVaue.orgId" :maxlength=30>
            </inputBox>
          </el-tooltip>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-tooltip :content="selectedVaue.orgName" placement="top" effect="light" :disabled="!selectedVaue.orgName">
            <input-box style="margin-right: 20px" title="组织名称" code="orgName" :value="selectedVaue.orgName" :disabled=true ref="orgName">
            </input-box>
          </el-tooltip>
          <el-button plain @click="_selectOrgani">选择组织</el-button>
          <el-dialog class="deviceOrgDialog" title="选择组织" :visible.sync="showDialog" :close-on-click-modal="false" @close="_close" :modal="false" :modal-append-to-body="true" width="45%">
            <org-tree @changeDialogStatus="_changeSatus" ref="orgTree"></org-tree>
          </el-dialog>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <span class="sub-title">创建时间：</span>
          <el-date-picker v-model="dateValue" type="datetimerange" :editable=false :clearable="false" @blur="mainDeviceData['timeSlot']=dateValue" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="60">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <inputBox title="设备IP" code="deviceIp" ref="deviceIp" @listenToInput="_saveDeviceData" :maxlength=16>
          </inputBox>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <input-box title="MAC地址" code="macAddress" ref="macAddress" @listenToInput="_saveDeviceData" :maxlength=20>
          </input-box>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <inputBox title="设备名称" code="deviceName" ref="deviceName" @listenToInput="_saveDeviceData" :maxlength=32>
          </inputBox>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="60">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <inputBox title="设备端口" code="devicePort" ref="devicePort" @listenToInput="_saveDeviceData" :maxlength=8>
          </inputBox>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <select-box title="注册状态" :options="registerStatus" code="isRegistered" ref="isRegistered" @listenToInput="_saveDeviceData">
          </select-box>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <select-box title="离在线状态" :options="onlineStatus" code="isOnline" ref="isOnline" @listenToInput="_saveDeviceData">
          </select-box>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="60">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <inputBox title="设备编码" code="deviceCode" ref="deviceCode" @listenToInput="_saveDeviceData" :maxlength=128>
          </inputBox>
        </div>
      </el-col>
    </el-row>
    <div class="btn-container">
      <el-button @click="_seekDevice" type="primary" icon="el-icon-search" style="margin-right:70%">查找</el-button>
      <el-button @click="_addDevice" type="primary">添加设备</el-button>
      <el-button @click="_importDevices" type="primary">设备批量导入</el-button>
    </div>
    <device-list ref="deviceList" @listenCountOfPage="_pageResult"></device-list>
    <el-dialog title='添加主设备' :visible.sync="isAddDialogShow" @close="_closeDialog" width="90%" top="8vh" :close-on-click-modal="false">
      <main-device-dialog @listenToAddEvent="_addResult" :deviceTypeList="deviceTypeList" :deviceType="deviceType" :gatewayType="gatewayType" ref="mainDeviceDialog" dialogType="ADD">
      </main-device-dialog>
    </el-dialog>
    <el-dialog title='设备批量导入' :visible.sync="isImportDialogShow" @close="_closeDialog" width="400px" top="8vh" :close-on-click-modal="false">
      <!--<el-upload-->
      <!--class="deviceImgUpload"-->
      <!--ref="upload"-->
      <!--drag-->
      <!--:limit=1-->
      <!--:multiple="false"-->
      <!--:auto-upload="false"-->
      <!--:on-change="_handleUploadFile"-->
      <!--action="">-->
      <!--<i class="el-icon-upload"></i>-->
      <!--<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
      <!--</el-upload>-->
      <!--<el-button type="primary" @click="_confirm" style="margin-left: 90%;margin-top: 5px">提交</el-button>-->
      <el-upload class="deviceUpload" :headers="tokenHeaders" ref="upload" :multiple="false" :limit=1 action="/scp-devicemgmtcomponent/register/excel" :on-success="_handleSucess" :on-error="_handleError" :on-change="_handleUploadFile" :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="_confirm">批量导入</el-button>
        <!--<el-button style="margin-left: 10px;" size="small" type="primary"><a href="/scp-devicemgmtcomponent/register/excel?type=XLSM" download="template.xlsm" style="color: white">模版下载</a></el-button>-->
        <el-button style="margin-left: 10px;" size="small" type="primary" @click="_download">模板下载</el-button>
        <div slot="tip" class="el-upload__tip">请选择EXCEL文件！</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import ElRow from 'element-ui/packages/row/src/row'
import selectBox from './selectBox.vue'
import inputBox from './inputBox.vue'
import ElButton from 'element-ui/packages/button/src/button.vue'
import orgTree from './orgTree'
import deviceList from './deviceList.vue'
import { getDeviceTypeList, getProviderList, getGatewayIdList, downloadExcelTemplate } from '../apis/index.js'
import { isValidIP, isValidMac } from '../assets/js/tool.js'
import mainDeviceDialog from './mainDeviceDialog.vue'
export default {
  components: {
    ElButton,
    ElRow,
    selectBox,
    inputBox,
    orgTree,
    deviceList,
    mainDeviceDialog
  },
  data () {
    return {
      registerStatus: [{
        'label': '',
        'value': '',
        'status': ''
      }, {
        'label': '已注册',
        'value': '已注册',
        'status': true
      }, {
        'label': '未注册',
        'value': '未注册',
        'status': false
      }],
      onlineStatus: [{
        'label': '',
        'value': '',
        'status': ''
      }, {
        'label': '在线',
        'value': '在线',
        'status': true
      }, {
        'label': '离线',
        'value': '离线',
        'status': false
      }],
      currentDevice: {},
      deviceTypeList: [],
      devicePropsList: [],
      specilPops: [],
      deviceType: [{ value: '', label: '' }],
      gatewayType: [],
      providerList: [{ value: '', label: '' }],
      providerType: [],
      selectedVaue: {},
      mainDeviceData: {},
      showDialog: false,
      isAddDialogShow: false,
      attrList: [],
      dateValue: [],
      countOfPage: 10,
      isImportDialogShow: false,
      importFileData: {},
      tokenHeaders: { 'FrontType': 'scp-admin-ui', 'Authorization': sessionStorage.token }
    }
  },
  methods: {
    _loadDeviceTypeList () {
      getDeviceTypeList()
        .then(
        function (result) {
          this.deviceTypeList = result.deviceCategoryList
          for (let i = 0; i < this.deviceTypeList.length; i++) {
            this.deviceType.push({
              value: this.deviceTypeList[i].typeDesc,
              label: this.deviceTypeList[i].typeDesc
            })
          }
        }.bind(this)
        )
        .catch()
    },
    _loadProviderCode () {
      getProviderList()
        .then(
        function (result) {
          this.providerList = result.providerList
          var list = [{
            value: '',
            label: ''
          }]
          for (let i = 0; i < this.providerList.length; i++) {
            list.push({
              value: this.providerList[i].providerCode,
              label: this.providerList[i].providerDesc
            })
          }
          this.providerType = list
          this.$refs.deviceList.passProviderType(this.providerType)
        }.bind(this)
        )
        .catch()
    },
    _loadGateway () {
      getGatewayIdList()
        .then((result) => {
          var list = [{
            value: '',
            label: ''
          }]
          for (let i = 0; i < result.length; i++) {
            list.push({
              value: result[i].appCode,
              label: result[i].appName
            })
          }
          this.gatewayType = list
          this.$refs.deviceList.passGatewayType(this.gatewayType)
        })
        .catch()
    },
    _selectOrgani () {
      this.showDialog = true
      if (this.$refs.orgTree) {
        this.$refs.orgTree._loadALlOrgs()
      }
    },
    _addDevice () {
      this.isAddDialogShow = true
    },
    _seekDevice () {
      // 查询主设备接口
      this.$refs.deviceList.loadMainDeviceTableData(1, this.countOfPage, this.mainDeviceData)
    },
    _saveDeviceData (data) {
      for (var key in data) {
        this.mainDeviceData[key] = data[key]
        if (key === 'deviceTypeDesc') {
          this.mainDeviceData['deviceType'] = ''
          this.specilPops = []
          for (let i = 0; i < this.deviceTypeList.length; i++) {
            if (data[key] === this.deviceTypeList[i].typeDesc) {
              this.currentDevice = this.deviceTypeList[i]
              this.mainDeviceData['deviceType'] = this.currentDevice.type
            }
          }
        }
        if (key === 'isRegistered') {
          this.registerStatus.forEach((value, index, array) => {
            if (value.value === data[key]) {
              this.mainDeviceData['isRegistered'] = value.status
            }
          })
        }
        if (key === 'isOnline') {
          this.onlineStatus.forEach((value, index, array) => {
            if (value.value === data[key]) {
              this.mainDeviceData['isOnline'] = value.status
            }
          })
        }
        if (key === 'deviceIp' && data[key] !== undefined && data[key] !== '') {
          if (!isValidIP(data[key])) {
            this.$message.error('请输入合法IP')
          }
        }
        if (key === 'macAddress' && data[key] !== undefined && data[key] !== '') {
          if (!isValidMac(data[key])) {
            this.$message.error('请输入合法Mac')
          }
        }
      }
    },
    _changeSatus (selectedVaue) {
      this.showDialog = false
      if (this.selectedVaue.orgId !== selectedVaue.orgId) {
        this.$refs.orgId.clearBox()
        this.$refs.orgName.clearBox()
        this.selectedVaue = selectedVaue
        this.mainDeviceData['orgName'] = selectedVaue.orgName
        this.mainDeviceData['orgId'] = selectedVaue.orgId
      }
    },
    _addResult (result) {
      this.isAddDialogShow = false
      // 添加设备成功列表刷新
      // var message = '是否前往' + result.deviceCode + '地址进行配置?'
      // this.$confirm(message, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   // window.location = 'https://www.baidu.com'
      // }).catch()
      this.$refs.deviceList.loadMainDeviceTableData(1, this.countOfPage)
    },
    _pageResult (val) {
      this.countOfPage = val
    },
    _close () {
      if (this.$refs.orgTree) {
        this.$refs.orgTree.clear()
      }
    },
    _closeDialog () {
      if (this.$refs.mainDeviceDialog) {
        this.$refs.mainDeviceDialog.clearData()
      }
      this.$refs.upload.clearFiles()
      this.importFileData = {}
    },
    _savePropData (data) {
      for (var key in data) {
        for (let i = 0; i < this.attrList.length; i++) {
          var item = this.attrList[i]
          if (item.attrDesc === key) {
            this.attrList[i]['attrValue'] = data[key]
          }
        }
      }
    },
    _importDevices () {
      this.isImportDialogShow = true
    },
    _handleUploadFile (file) {
      this.importFileData = { 'file': file }
    },
    _confirm () {
      if (this.importFileData['file']) {
        this.$refs.upload.submit()
      } else {
        this.$message({
          message: '请先选择上传文件',
          type: 'warning'
        })
      }
    },
    _download () {
      // window.location = '/static/device_template.xlsm'
      downloadExcelTemplate(2)
        .then()
    },
    _handleError () {
      this.$message({
        message: '文件上传失败，请重新上传',
        type: 'error'
      })
    },
    _handleSucess (response) {
      if (response.flag === 'FAIL') {
        var arrayMsg = []
        response.sheetStatistics.forEach(value => {
          if (value.listRemarkStatistics) {
            var message = value.sheet + ':'
            value.listRemarkStatistics.forEach(value2 => {
              message += value2.cell + '-' + value2.msg + '；'
            })
            arrayMsg.push(message)
          }
        })
        var msg = ''
        arrayMsg.forEach(value => {
          msg += value + '\n'
        })
        this.$alert(msg, '文件数据有误，请修改后重新导入', {
          confirmButtonText: '确定'
        })
      }
    }
  },
  mounted () {
    this._loadDeviceTypeList()
    this._loadProviderCode()
    this._loadGateway()
  }
}
</script>
