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
          <el-tooltip :content="selectedVaue.orgId" placement="top" effect="light" :disabled="!selectedVaue.orgId">
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
      <el-button type="primary" @click="_getTechParam" :disabled="!currentRow.deviceCode">获取技术参数</el-button>
      <el-button type="primary" @click="_setTechParam" :disabled="!currentRow.deviceCode">配置技术参数</el-button>
    </div>
    <device-config-list @listenToRowSelected="_selectResult" @listenCountOfPage="_pageSizeResult" @listenToRefresh="_refreshStatus" ref="deviceConfigList"></device-config-list>
  </div>
</template>

<script>
  import inputBox from '../register/components/inputBox'
  import selectBox from '../register/components/selectBox'
  import orgTree from '../register/components/orgTree'
  import deviceConfigList from './components/deviceConfigList'
  import {getDeviceTypeList, getProviderList} from '../register/apis/index'
  import {getDeviceAttr, updateDeviceAttr} from './apis/index'

  export default {
    data () {
      return {
        value: '',
        showDialog: false,
        selectedVaue: {},
        seekConditionData: {},
        currentRow: {},
        deviceType: [{value: '', label: ''}],
        providerType: [],
        deviceTypeList: [],
        pageSize: 10,
        isOnline: [{
          value: '',
          label: ''
        }, {
          value: '在线',
          label: '在线'
        }, {
          value: '离线',
          label: '离线'
        }]
      }
    },
    components: {
      inputBox,
      selectBox,
      orgTree,
      deviceConfigList
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
      _selectResult (data) {
        this.currentRow = data
      },
      _seekDevice () {
        this.$refs.deviceConfigList.loadDeviceConfigTableData(1, this.pageSize, this.seekConditionData)
      },
      _setTechParam () {
        // 利用收集的paramCollectedData和currentRow发送配置请求
        var list = this.currentRow.attributeList
        for (let i = 0; i < list.length; i++) {
          if (list[i].required && (!list[i].attrValue || list[i].attrValue === '' || list[i].attrValue === undefined)) {
            this.$message({
              message: '请将参数配置页面中带*号的必填项目补充完整',
              type: 'warning'
            })
            return 1
          } else if (i === (this.currentRow.attributeList.length - 1)) {
            this.$confirm('是否确定修改所选设备的技术参数?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              updateDeviceAttr(this.currentRow)
                .then(
                  function (result) {
                    this.$message({
                      message: '配置参数请求已成功发送',
                      type: 'success'
                    })
                  }.bind(this)
                )
                .catch()
            })
              .catch()
          }
        }
      },
      _getTechParam () {
        // 利用currentRow发送获取请求
        getDeviceAttr(this.currentRow)
          .then(
            function (result) {
              this.$message({
                message: '获取参数请求已成功发送',
                type: 'success'
              })
            }.bind(this)
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
        this.currentRow = {}
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
