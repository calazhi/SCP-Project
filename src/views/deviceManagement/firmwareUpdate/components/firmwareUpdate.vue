<template>
    <div>
      <el-row :gutter="60">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <select-box title="设备类型"
                        code="deviceType"
                        :options="deviceType"
                        :disabled="selectDisable"
                        @listenToInput="_saveDeviceData"
                        ref="deviceType">
            </select-box>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <select-box title="厂商名称"
                        code="providerCode"
                        ref="providerCode"
                        :options="providerType"
                        :disabled="selectDisable"
                        @listenToInput="_saveDeviceData">
            </select-box>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <select-box title="设备型号"
                        code="deviceModel"
                        ref="deviceModel"
                        :options="deviceModelType"
                        @listenToInput="_saveDeviceData"
                        :disabled="selectDisable">
            </select-box>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="60">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <inputBox title="设备编码"
                      code="deviceCode"
                      ref="deviceCode"
                      :disabled="inputDisable"
                      @listenToInput="_saveDeviceData"
                      :maxlength=128>
            </inputBox>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="60">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <input-box style="margin-right: 20px"
                       title="固件名称"
                       code="fileName"
                       :value="selectedVaue.fileName"
                       :disabled="true"
                       ref="fileName">
            </input-box>
            <el-button plain @click="_selectFirmware">选择固件</el-button>
            <el-dialog
              title="选择固件"
              :visible.sync="showDialog"
              @close="_close"
              :close-on-click-modal="false"
              :modal-append-to-body="true"
              width="35%">
              <firmware-table-list ref="firmwareTableList" @listenToRowSelected="_selectedResult" :tableData="firmwareUpdateList"></firmware-table-list>
            </el-dialog>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <input-box title="固件版本"
                       code="firmwareVersion"
                       :value="selectedVaue.firmwareVersion"
                       :disabled="true"
                       @listenToInput="_saveDeviceData"
                       ref="firmwareVersion">
            </input-box>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <input-box title="固件大小"
                       code="fileSize"
                       :disabled="true"
                       ref="fileSize"
                       :value="selectedVaue.fileSize"
                       append="MB"
                       @listenToInput="_saveDeviceData">
            </input-box>
          </div>
        </el-col>
      </el-row>
      <div class="action-container">
        <el-button type="primary" :disabled="!selectedVaue.fileName" @click="_sendFirmwareUpdate">请求固件升级</el-button>
      </div>
      <update-history ref="updateHistory"></update-history>
    </div>
</template>

<script>
  import inputBox from '../../register/components/inputBox'
  import selectBox from '../../register/components/selectBox'
  import firmwareTableList from './firmwareTableList'
  import updateHistory from './updateHistory'
  import {getDeviceTypeList, getProviderList, getProviderByType, getTypeModel} from '../../register/apis/index'
  import {getFotaFileList, getFotaFileSelectList, fotaUpgradeRequest} from '../apis/index'

  export default {
    data () {
      return {
        deviceType: [{value: '', label: ''}],
        providerType: [],
        deviceModelType: [],
        deviceUpdateData: {},
        showDialog: false,
        selectedVaue: {},
        deviceTypeList: [],
        selectDisable: false,
        inputDisable: false,
        firmwareUpdateList: []
      }
    },
    components: {
      inputBox,
      selectBox,
      firmwareTableList,
      updateHistory
    },
    methods: {
      _loadDeviceTypeList () {
        getDeviceTypeList()
          .then(
            function (result) {
              this.deviceTypeList = result.deviceCategoryList
              for (let i = 0; i < this.deviceTypeList.length; i++) {
                this.deviceType.push({
                  value: this.deviceTypeList[i].type,
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
              var providerList = result.providerList
              var list = [{
                value: '',
                label: ''
              }]
              for (let i = 0; i < providerList.length; i++) {
                list.push({
                  value: providerList[i].providerCode,
                  label: providerList[i].providerDesc
                })
              }
              this.providerType = list
            }.bind(this)
          )
          .catch()
      },
      _saveDeviceData (data) {
        for (var key in data) {
          this.deviceUpdateData[key] = data[key]
          if (key === 'deviceType' || key === 'providerCode' || key === 'deviceCode' || key === 'deviceModel') {
            this.selectedVaue = {}
            if (this.$refs.fileSize) {
              this.$refs.fileSize.clearBox()
              this.$refs.firmwareVersion.clearBox()
              this.$refs.fileName.clearBox()
            }
          }
          if (key === 'deviceType' && data[key] !== undefined && data[key] !== '') {
            this.inputDisable = true
            this.providerType = []
            this.$refs.providerCode.clearBox()
            this.deviceModelType = []
            this.$refs.deviceModel.clearBox()
            getProviderByType(data[key])
              .then(result => {
                var providerList = result.providerList
                var list = [{
                  value: '',
                  label: ''
                }]
                for (let i = 0; i < providerList.length; i++) {
                  list.push({
                    value: providerList[i].providerCode,
                    label: providerList[i].providerDesc
                  })
                }
                this.providerType = list
              })
          }
          if (key === 'deviceType' && (data[key] === undefined || data[key] === '')) {
            this.inputDisable = false
            this.providerType = []
            this.$refs.providerCode.clearBox()
            this.deviceModelType = []
            this.$refs.deviceModel.clearBox()
          }
          if (key === 'providerCode' && data[key] !== undefined && data[key] !== '') {
            // this.inputDisable = true
            this.deviceModelType = []
            this.$refs.deviceModel.clearBox()
            getTypeModel({'typeCode': this.deviceUpdateData.deviceType, 'providerCode': data[key]})
              .then(result => {
                var deviceModelList = result.deviceCategoryList
                var list = [{
                  value: '',
                  label: ''
                }]
                for (let i = 0; i < deviceModelList.length; i++) {
                  list.push({
                    value: deviceModelList[i].typeModel,
                    label: deviceModelList[i].typeModel
                  })
                }
                this.deviceModelType = list
              })
          }
          if (key === 'providerCode' && (data[key] === undefined || data[key] === '')) {
            // this.inputDisable = false
            this.deviceModelType = []
            this.$refs.deviceModel.clearBox()
          }
          if (key === 'deviceCode' && data[key] !== undefined && data[key] !== '') {
            this.selectDisable = true
          }
          if (key === 'deviceCode' && (data[key] === undefined || data[key] === '')) {
            this.selectDisable = false
          }
        }
      },
      _close () {
      },
      _selectFirmware () {
        if ((this.deviceUpdateData.deviceType !== undefined && this.deviceUpdateData.deviceType !== '' && this.deviceUpdateData.providerCode !== undefined && this.deviceUpdateData.providerCode !== '' && this.deviceUpdateData.deviceModel !== undefined && this.deviceUpdateData.deviceModel !== '') || (this.deviceUpdateData.deviceCode !== undefined && this.deviceUpdateData.deviceCode !== '')) {
          // 请求固件升级文件列表
          getFotaFileSelectList(this.deviceUpdateData)
            .then((result) => {
              if (result.listFotaFileVo.length > 0) {
                this.firmwareUpdateList = result.listFotaFileVo
                this.showDialog = true
                if (this.$refs.firmwareTableList) {
                  this.$refs.firmwareTableList.loadFirmwareTableList(result.listFotaFileVo)
                }
              } else {
                this.$message({
                  message: result.message,
                  type: 'warning'
                })
              }
            })
            .catch()
        } else {
          this.$message({
            message: '请先选择设备类型+厂商名称+设备型号或直接输入设备编码',
            type: 'warning'
          })
        }
      },
      _selectedResult (data) {
        this.selectedVaue = data
        this.showDialog = false
        this.deviceUpdateData = Object.assign(this.deviceUpdateData, data)
      },
      _sendFirmwareUpdate () {
        // 发送升级请求
        fotaUpgradeRequest(this.deviceUpdateData)
          .then((result) => {
            this.$refs.updateHistory.loadHistoryTable(1, 10)
            this.$message({
              message: '固件升级请求发送成功',
              type: 'success'
            })
            for (var key in this.deviceUpdateData) {
              if (this.$refs[key]) {
                this.$refs[key].clearBox()
              }
            }
            this.deviceUpdateData = {}
            this.selectedVaue = {}
            this.selectDisable = false
            this.inputDisable = false
          })
          .catch()
      },
      _loadNotify () {
        getFotaFileList()
          .then((result) => {
            var list = result.listFotaFileVo
            if (list.length > 0) {
              var messageFile = ''
              list.forEach((value, index) => {
                if (index < 20) {
                  messageFile += value.fileName + '\n'
                }
              })
              const h = this.$createElement
              this.$notify({
                title: '新的固件升级文件已上传，请安排升级',
                dangerouslyUseHTMLString: true,
                message: h('i', {style: 'color: teal'}, messageFile),
                offset: 60
              })
            }
          })
          .catch()
      }
    },
    mounted () {
      this._loadDeviceTypeList()
      // this._loadProviderCode()
      this._loadNotify()
    }
  }
</script>

