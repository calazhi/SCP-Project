<template>
<div class="ui-common">
  <el-row :gutter="60">
    <el-col :span="8">
      <div class="grid-content bg-purple">
        <select-box title="设备类型"
                    code="deviceTypeDesc"
                    :options="deviceType"
                    @listenToInput="_saveDeviceData"
                    ref="deviceTypeDesc">
        </select-box>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content bg-purple">
        <select-box title="厂商名称"
                    code="providerCode"
                    ref="providerCode"
                    :options="providerType"
                    @listenToInput="_saveDeviceData">
        </select-box>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content bg-purple">
        <inputBox title="设备编码"
                  code="deviceCode"
                  ref="deviceCode"
                  @listenToInput="_saveDeviceData"
                  :maxlength=128>
        </inputBox>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="60">
    <el-col :span="8">
      <div class="grid-content bg-purple">
        <select-box title="离在线状态"
                    code="isOnline"
                    :options="isOnline"
                    @listenToInput="_saveDeviceData"
                    ref="isOnline">
        </select-box>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content bg-purple">
        <el-tooltip :content="selectedVaue.orgId" placement="top" effect="light" :disabled="!selectedVaue.orgId">
          <inputBox title="组织ID"
                    code="orgId"
                    ref="orgId"
                    @listenToInput="_saveDeviceData"
                    :disabled="true"
                    :value="selectedVaue.orgId"
                    :maxlength=64>
          </inputBox>
        </el-tooltip>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content bg-purple">
        <el-tooltip :content="selectedVaue.orgName" placement="top" effect="light" :disabled="!selectedVaue.orgName">
          <input-box style="margin-right: 20px"
                     title="组织名称"
                     code="orgName"
                     :disabled="true"
                     :value="selectedVaue.orgName"
                     ref="orgName">
          </input-box>
        </el-tooltip>
        <el-button plain @click="_selectOrgani">选择组织</el-button>
        <el-dialog
          class="deviceOrgDialog"
          title="选择组织"
          :visible.sync="showDialog"
          :close-on-click-modal="false"
          @close="_close"
          :modal="false"
          :modal-append-to-body="true"
          width="45%">
          <org-tree @changeDialogStatus="_changeSatus" ref="orgTree"></org-tree>
        </el-dialog>
      </div>
    </el-col>
  </el-row>
  <div class="action-container">
    <el-button type="primary" @click="_seekDevice" icon="el-icon-search" style="margin-right:70%">查找</el-button>
    <!--<el-button type="primary" @click="_openDevice" :disabled="currentRows.listDmDevice.length===0">开</el-button>-->
    <!--<el-button type="primary" @click="_closeDevice" :disabled="currentRows.listDmDevice.length===0">关</el-button>-->
    <el-button type="primary" @click="_restartDevice" :disabled="currentRows.listDmDevice.length===0">重启</el-button>
  </div>
  <device-state-list @listenToRowSelected="_selectResult" @listenCountOfPage="_pageSizeResult" @listenToRefresh="_refreshStatus" ref="deviceStateList"></device-state-list>
</div>
</template>

<script>
  import inputBox from '../register/components/inputBox'
  import selectBox from '../register/components/selectBox'
  import orgTree from '../register/components/orgTree'
  import deviceStateList from './components/deviceStateList'
  import {getDeviceTypeList, getProviderList} from '../register/apis/index'
  import {updateDeviceStatusOn, updateDeviceStatusOff, updateDeviceStatusRestart} from './apis/index'

  export default {
    data () {
      return {
        value: '',
        showDialog: false,
        selectedVaue: {},
        seekConditionData: {},
        currentRows: {'pageCount': 1, 'listDmDevice': []},
        deviceType: [{value: '', label: ''}],
        isOnline: [{
          value: '',
          label: ''
        }, {
          value: '在线',
          label: '在线'
        }, {
          value: '离线',
          label: '离线'
        }],
        providerType: [],
        deviceTypeList: [],
        pageSize: 10
      }
    },
    components: {
      inputBox,
      selectBox,
      orgTree,
      deviceStateList
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
            }.bind(this)
          )
          .catch()
      },
      _selectOrgani () {
        this.showDialog = true
        if (this.$refs.orgTree) {
          this.$refs.orgTree._loadALlOrgs()
        }
      },
      _changeSatus (selectedVaue) {
        this.showDialog = false
        if (this.selectedVaue.orgId !== selectedVaue.orgId) {
          this.$refs.orgId.clearBox()
          this.$refs.orgName.clearBox()
          this.selectedVaue = selectedVaue
          this.seekConditionData['orgName'] = selectedVaue.orgName
          this.seekConditionData['orgId'] = selectedVaue.orgId
        }
      },
      _saveDeviceData (data) {
        for (var key in data) {
          this.seekConditionData[key] = data[key]
          if (key === 'deviceTypeDesc') {
            this.seekConditionData['deviceType'] = ''
            for (let i = 0; i < this.deviceTypeList.length; i++) {
              if (data[key] === this.deviceTypeList[i].typeDesc) {
                this.seekConditionData['deviceType'] = this.deviceTypeList[i].type
              }
            }
          }
          if (key === 'isOnline' && data[key] !== '') {
            this.seekConditionData[key] = (data[key] === '在线')
          }
        }
      },
      _selectResult (section) {
        this.currentRows = {'pageCount': 1, 'listDmDevice': section}
      },
      _seekDevice () {
        this.currentRows.listDmDevice = []
        this.$refs.deviceStateList.loadDeviceStateTableData(1, this.pageSize, this.seekConditionData)
      },
      _openDevice () {
        this.$confirm('是否确定开启所选设备?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateDeviceStatusOn(this.currentRows)
            .then((result) => {}
            )
            .catch()
        })
          .catch()
      },
      _closeDevice () {
        this.$confirm('是否确定关闭所选设备?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateDeviceStatusOff(this.currentRows)
            .then((result) => {}
            )
            .catch()
        }
        )
          .catch()
      },
      _restartDevice () {
        this.$confirm('是否确定重启所选设备?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateDeviceStatusRestart(this.currentRows)
          .then((result) => {}
          )
          .catch()
        }
        )
          .catch()
      },
      _close () {
        this.$refs.orgTree.clear()
      },
      _pageSizeResult (val) {
        this.pageSize = val
      },
      _refreshStatus () {
        this.currentRows.listDmDevice = []
      }
    },
    mounted () {
      this._loadDeviceTypeList()
      this._loadProviderCode()
    }
  }
</script>

<style>
  @import "../register/assets/css/devicemgmt.less";
</style>
