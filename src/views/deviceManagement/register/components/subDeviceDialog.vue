<template>
  <div>
    <div class="row-container">
      <el-row :gutter="60">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <select-box title="设备类型" code="deviceTypeDesc" ref="deviceTypeDesc" :options="deviceType" :initValue="childDeviceData.deviceTypeDesc" :disabled='inputDisabled' :required="true" @listenToInput="_saveDeviceData">
            </select-box>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <select-box title="厂商名称" code="providerCode" ref="providerCode" :options="providerType" :initValue="childDeviceData.providerName" :disabled='inputDisabled' :required="true" @listenToInput="_saveDeviceData">
            </select-box>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <select-box title="设备型号" code="deviceModel" ref="deviceModel" :options="deviceModelType" :required="true" @listenToInput="_saveDeviceData" :initValue="childDeviceData.deviceModel" :disabled='inputDisabled'>
            </select-box>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <select-box title="软件版本" ref="softwareVersion" :options="softwareVersionType" :required="true" code="softwareVersion" @listenToInput="_saveDeviceData" :initValue="childDeviceData.softwareVersion" :disabled='inputDisabled'>
            </select-box>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="row-container">
      <el-row :gutter="60">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <input-box title="MAC地址" code="macAddress" ref="macAddress" :value="childDeviceData.macAddress" :disabled='inputDisabled' @listenToInput="_saveDeviceData" :required="true" :maxlength=20>
            </input-box>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <input-box title="父级设备编码" code="parentDeviceCode" ref="parentDeviceCode" :disabled=true :value="parentDeviceCode" @listenToInput="_saveDeviceData">
            </input-box>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <select-box title="网关服务标识" code="gatewayId" ref="gatewayId" :required="true" :options="gatewayType" :disabled='inputDisabled' @listenToInput="_saveDeviceData" :initValue="childDeviceData.gatewayId">
            </select-box>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <input-box title="设备名称" code="deviceName" ref="deviceName" :required="true" :value="childDeviceData.deviceName" @listenToInput="_saveDeviceData" :maxlength=32>
            </input-box>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="60">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <input-box title="设备掩码" code="deviceMask" ref="deviceMask" :value="childDeviceData.deviceMask" @listenToInput="_saveDeviceData" :maxlength=32>
            </input-box>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <input-box title="设备IP" code="deviceIp" ref="deviceIp" :value="childDeviceData.deviceIp" @listenToInput="_saveDeviceData" :maxlength=16>
            </input-box>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <input-box title="用户名" code="userName" ref="userName" :value="childDeviceData.userName" @listenToInput="_saveDeviceData" :maxlength=32>
            </input-box>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <input-box title="用户密码" code="password" ref="password" :value="childDeviceData.password" @listenToInput="_saveDeviceData" type="password" :maxlength=32>
            </input-box>
          </div>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="60">
        <div class="grid-content bg-purple">
            <input-box title="用户名" code="userName" ref="userName" :value="childDeviceData.userName" @listenToInput="_saveDeviceData" :maxlength=32>
            </input-box>
          </div>
      </el-row> -->
      <el-row :gutter="60">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <input-box title="设备端口" code="devicePort" ref="devicePort" :value="childDeviceData.devicePort" @listenToInput="_saveDeviceData" :maxlength=8>
            </input-box>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <input-box title="安装地址" ref="installAddress" code="installAddress" :value="childDeviceData.installAddress" @listenToInput="_saveDeviceData" :maxlength=64>
            </input-box>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <select-box title="设备状态" code="deviceStatus" ref="deviceStatus" :options="deviceState" :initValue="childDeviceData.deviceStatus" @listenToInput="_saveDeviceData">
            </select-box>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <inputBox title="设备描述" code="deviceDesc" ref="deviceDesc" @listenToInput="_saveDeviceData" :value="childDeviceData.deviceDesc" :maxlength=256>
            </inputBox>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="60">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <inputBox title="子设备GPS坐标" code="deviceLocation" ref="deviceLocation" @listenToInput="_saveDeviceData" :value="childDeviceData.deviceLocation" :maxlength=23 placeholder="输入格式为'经度,纬度'">
            </inputBox>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="row-container">
      <el-row :gutter="60">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <inputBox title="组织ID" code="orgId" ref="orgId" :required="true" :value="selectedVaue.orgId" @listenToInput="_saveDeviceData" :disabled=true>
            </inputBox>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <input-box style="margin-right: 20px" title="组织名称" ref="orgName" code="orgName" :required="true" :value="selectedVaue.orgName" :disabled=true>
            </input-box>
            <el-button plain @click="_selectOrgani">选择组织</el-button>
            <el-dialog class="deviceOrgDialog" title="选择组织" :visible.sync="showDialog" :close-on-click-modal="false" @close="_close" :modal="false" :modal-append-to-body="true" width="45%">
              <org-tree @changeDialogStatus="_changeSatus" ref="orgTree"></org-tree>
            </el-dialog>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--代码注释，经纬度分开录入-->
    <!-- <div class="row-container">
      <el-row :gutter="60">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <inputBox title="设备GPS经度" code="deviceGPSLon" ref="deviceGPSLon" @listenToInput="_saveDeviceData" :value="childDeviceData.deviceGPSLon" :maxlength=11>
            </inputBox>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <inputBox title="设备GPS纬度" code="deviceGPSLat" ref="deviceGPSLat" @listenToInput="_saveDeviceData" :value="childDeviceData.deviceGPSLat" :maxlength=11>
            </inputBox>
          </div>
        </el-col>
      </el-row>
    </div> -->
    <div style="padding-top: 20px" v-show="attrList.length>0">
      <p style="margin-bottom: 15px;font-size: 14px">专有属性设置</p>
      <el-row :gutter="60">
        <el-col :span="6" v-for="(item, index) in attrList" :key="index">
          <div class="grid-content attr-content bg-purple">
            <input-box v-if="item.attrDataType === 'string'" :title="item.attrDesc" :code="item.attrDesc" :ref="item.attrDesc" @listenToInput="_savePropData" :append="item.unitDesc" :disabled="(item.attrType==='device_attribute')||(item.attrType==='tech_parameter'&&dialogType==='EDIT')" :value="item.attrValue">
            </input-box>
            <input-box v-if="item.attrDataType === 'integer'" :title="item.attrDesc" :code="item.attrDesc" :ref="item.attrDesc" type="number" @listenToInput="_savePropData" :append="item.unitDesc" :disabled="(item.attrType==='device_attribute')||(item.attrType==='tech_parameter'&&dialogType==='EDIT')" :value="item.attrValue">
            </input-box>
            <select-box v-if="item.attrDataType === 'select'" :title="item.attrDesc" :code="item.attrDesc" :ref="item.attrDesc" :options="item.selectData" @listenToInput="_savePropData" :disabled="(item.attrType==='device_attribute')||(item.attrType==='tech_parameter'&&dialogType==='EDIT')" :initValue="item.attrValue">
            </select-box>
            <select-box v-if="item.attrDataType === 'boolean'" :title="item.attrDesc" :code="item.attrDesc" :ref="item.attrDesc" :options="boolOption" :disabled="(item.attrType==='device_attribute')||(item.attrType==='tech_parameter'&&dialogType==='EDIT')" @listenToInput="_savePropData" :initValue="item.attrValue">
            </select-box>
          </div>
        </el-col>
      </el-row>

    </div>
    <el-upload class="deviceImgUpload" ref="upload" drag :limit=2 :multiple="false" :auto-upload="false" :file-list="fileList" :on-change="_handleUploadFile" action="">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将图像拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>
    <el-button type="primary" @click="_confirm" style="margin-left: 90%">提交</el-button>
  </div>
</template>

<script>
import ElRow from 'element-ui/packages/row/src/row'
import selectBox from './selectBox.vue'
import inputBox from './inputBox.vue'
import ElButton from 'element-ui/packages/button/src/button.vue'
import { getAttrListByUuid, getSubDeviceTypeList, insertSubDevice, updateSubDevice, getSubDeviceDetail, getProviderByType, getTypeModel, getSoftwareVersion } from '../apis/index.js'
import orgTree from './orgTree'
import { isValidIP, isValidMac, isValidGPS, Base64Encode, readBlobAsDataURL } from '../assets/js/tool.js'

export default {
  props: {
    dialogType: {
      type: String
    },
    childUuid: {
      type: String
    },
    mainDeviceData: {
      type: Object
    },
    gatewayType: {
      type: Array
    }
  },
  components: {
    ElButton,
    ElRow,
    selectBox,
    inputBox,
    orgTree
  },
  data () {
    return {
      providerType: [],
      deviceModelType: [],
      softwareVersionType: [],
      deviceType: [],
      parentDeviceCode: '',
      deviceTypeList: [],
      showDialog: false,
      fileList: [],
      deviceState: [{
        value: '',
        label: ''
      }, {
        value: '开',
        label: '开'
      }, {
        value: '关',
        label: '关'
      }],
      boolOption: [{
        value: 'Yes',
        label: 'Yes'
      }, {
        value: 'No',
        label: 'No'
      }],
      childDeviceData: {},
      currentDevice: {},
      selectedVaue: '',
      inputDisabled: false,
      attrList: []
    }
  },
  methods: {
    passDeviceInfo (row) {
      this.parentDeviceCode = row.deviceCode
      this.parentUuid = row.uuid
      // 请求子设备类型
      getSubDeviceTypeList(row.deviceTypeUuid)
        .then(
        function (result) {
          this.deviceTypeList = result.deviceCategoryList
          var list = [{ value: '', label: '' }]
          for (let i = 0; i < this.deviceTypeList.length; i++) {
            list.push({
              value: this.deviceTypeList[i].typeDesc,
              label: this.deviceTypeList[i].typeDesc
            })
          }
          this.deviceType = list
        }.bind(this)
        )
        .catch(
        function (error) {
          console.log(error)
        }
        )
    },
    _saveDeviceData (data) {
      for (var key in data) {
        if (key === 'providerCode' && this.dialogType === 'EDIT') {
          console.log('providerCode')
        } else {
          this.childDeviceData[key] = data[key]
        }
        if (key === 'deviceTypeDesc' && this.dialogType === 'ADD' && data[key] !== '' && data[key] !== undefined) {
          for (let i = 0; i < this.deviceTypeList.length; i++) {
            if (data[key] === this.deviceTypeList[i].typeDesc) {
              this.currentDevice = this.deviceTypeList[i]
            }
          }
          if (this.currentDevice.type !== '') {
            this.providerType = []
            this.$refs.providerCode.clearBox()
            this.deviceModelType = []
            this.$refs.deviceModel.clearBox()
            this.softwareVersionType = []
            this.$refs.softwareVersion.clearBox()
            this.attrList = []
            getProviderByType(this.currentDevice.type)
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
        }

        if (key === 'deviceTypeDesc' && data[key] === '') {
          this.providerType = []
          this.$refs.providerCode.clearBox()
          this.deviceModelType = []
          this.$refs.deviceModel.clearBox()
          this.softwareVersionType = []
          this.$refs.softwareVersion.clearBox()
          this.attrList = []
        }

        if (key === 'providerCode' && data[key] !== '' && data[key] !== undefined && this.dialogType === 'ADD') {
          this.deviceModelType = []
          this.$refs.deviceModel.clearBox()
          this.softwareVersionType = []
          this.$refs.softwareVersion.clearBox()
          this.attrList = []
          getTypeModel({ 'typeCode': this.currentDevice.type, 'providerCode': data[key] })
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

        if (key === 'providerCode' && data[key] === '') {
          this.deviceModelType = []
          this.$refs.deviceModel.clearBox()
          this.softwareVersionType = []
          this.$refs.softwareVersion.clearBox()
          this.attrList = []
        }

        if (key === 'deviceModel' && data[key] !== '' && data[key] !== undefined && this.dialogType === 'ADD') {
          this.softwareVersionType = []
          this.$refs.softwareVersion.clearBox()
          this.attrList = []
          getSoftwareVersion({ 'typeCode': this.currentDevice.type, 'providerCode': this.childDeviceData.providerCode, 'typeModel': data[key] })
            .then(result => {
              var softwareVersionList = result.deviceCategoryList
              var list = [{
                value: '',
                label: ''
              }]
              for (let i = 0; i < softwareVersionList.length; i++) {
                list.push({
                  value: softwareVersionList[i].softwareVersion,
                  label: softwareVersionList[i].softwareVersion
                })
              }
              this.softwareVersionType = list
            })
        }

        if (key === 'deviceModel' && data[key] === '') {
          this.softwareVersionType = []
          this.$refs.softwareVersion.clearBox()
          this.attrList = []
        }

        if (key === 'softwareVersion' && data[key] !== '' && data[key] !== undefined && this.dialogType === 'ADD') {
          this.attrList = []
          getAttrListByUuid({ 'typeCode': this.currentDevice.type, 'providerCode': this.childDeviceData.providerCode, 'typeModel': this.childDeviceData.deviceModel, 'softwareVersion': this.childDeviceData.softwareVersion })
            .then(
            function (result) {
              this.deviceTypeUuid = result.deviceTypeUuid
              this.attrDomainList = result.attrDomainList
              this.attrList = result.deviceAttrList
              for (let i = 0; i < this.attrList.length; i++) {
                this.attrList[i]['attrValue'] = ''
                if (this.attrList[i].attrDataType === 'select') {
                  var list = []
                  for (let j = 0; j < this.attrDomainList.length; j++) {
                    var attr = this.attrList[i]
                    var attrDomain = this.attrDomainList[j]
                    if (attr['uuid'] === attrDomain['attrUuid']) {
                      attrDomain['value'] = attrDomain.domainValue
                      list.push(attrDomain)
                      this.attrList[i]['selectData'] = list
                    }
                  }
                }
              }
            }.bind(this)
            )
        }

        if (key === 'softwareVersion' && data[key] === '') {
          this.attrList = []
        }

        if (key === 'password') {
          this.childDeviceData['password'] = Base64Encode(data[key])
        }

        if (key === 'deviceMask' && data[key] !== undefined && data[key] !== '') {
          if (!isValidIP(data[key])) {
            this.$message.error('请输入合法掩码')
          }
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
        if (key === 'devicePort' && data[key] !== undefined && data[key] !== '') {
          if (this._checkPort(data[key])) this.$message.error('端口号仅能为数字且小于65535')
        }
        /**
         * 代码注释：经纬度分开录入检查
         */
        // if (key === 'deviceGPSLon' && data[key] !== undefined && data[key] !== '') {
        //   if (isValidGPSlon(data[key]) === '01') {
        //     this.$message.error('设备GPS经度坐标范围在-180~180间')
        //   } else if (isValidGPSlon(data[key]) === '02') {
        //     this.$message.error('设备GPS经度坐标请输入数字')
        //   }
        // }
        // if (key === 'deviceGPSLat' && data[key] !== undefined && data[key] !== '') {
        //   if (isValidGPSlat(data[key]) === '01') {
        //     this.$message.error('设备GPS纬度坐标范围在-90~90间')
        //   } else if (isValidGPSlat(data[key]) === '02') {
        //     this.$message.error('设备GPS纬度坐标请输入数字')
        //   }
        // }
        if (key === 'deviceLocation' && data[key] !== undefined && data[key] !== '') {
          if (isValidGPS(data[key]) === '01') {
            this.$message.error('请检查设备的GPS经度是否在-180~180，纬度是否在-90~90范围内')
          }
          if (isValidGPS(data[key]) === '02') {
            this.$message.error('设备GPS数据只能输入数据')
          }
          if (isValidGPS(data[key]) === '03') {
            this.$message.error('请输入英文字符下的，')
          }
        }
      }
    },
    _checkPort (value) {
      var reg = /^[0-9]*[1-9][0-9]*$/
      return (!reg.test(value) || parseInt(value) > 65535)
    },
    clearData () {
      for (var key in this.childDeviceData) {
        if (this.$refs[key]) {
          this.$refs[key].clearBox()
        }
      }
      if (this.$refs.orgId) {
        this.$refs.orgId.clearBox()
      }
      if (this.$refs.orgName) {
        this.$refs.orgName.clearBox()
      }
      this.attrList = []
      this.childDeviceData = {}
      this.selectedVaue = {}
      this.$refs.upload.clearFiles()
    },
    _savePropData (data) {
      for (var key in data) {
        for (let i = 0; i < this.attrList.length; i++) {
          this.attrList[i]['dataType'] = this.attrList[i].attrDataType
          var item = this.attrList[i]
          if (item.attrDesc === key) {
            if (data[key] === 'Yes') {
              this.attrList[i]['attrValue'] = 'true'
            } else if (data[key] === 'No') {
              this.attrList[i]['attrValue'] = 'false'
            } else {
              this.attrList[i]['attrValue'] = data[key]
            }
          }
        }
      }
    },
    _selectOrgani () {
      this.showDialog = true
    },
    _changeSatus (selectedVaue) {
      this.showDialog = false
      if (this.selectedVaue.orgId !== selectedVaue.orgId) {
        this.$refs.orgId.clearBox()
        this.$refs.orgName.clearBox()
        this.selectedVaue = selectedVaue
        this.childDeviceData['orgName'] = selectedVaue.orgName
        this.childDeviceData['orgId'] = selectedVaue.orgId
      }
    },
    _close () {
      if (this.$refs.orgTree) {
        this.$refs.orgTree.clear()
      }
    },
    _handleUploadFile (file, fileList) {
      if (fileList.length === 2) {
        fileList.shift()
      }
      readBlobAsDataURL(file.raw, (result) => {
        this.childDeviceData['imgData'] = result
      })
    },
    _confirm () {
      if (this.dialogType === 'ADD') {
        // 添加子设备接口
        if (this.childDeviceData['deviceTypeDesc'] && this.childDeviceData['deviceTypeDesc'] !== '' && this.childDeviceData['providerCode'] && this.childDeviceData['providerCode'] !== '' && this.childDeviceData['macAddress'] && this.childDeviceData['macAddress'] !== '' && this.childDeviceData['gatewayId'] && this.childDeviceData['gatewayId'] !== '' && this.childDeviceData['deviceName'] && this.childDeviceData['deviceName'] !== '' && this.childDeviceData['orgId'] && this.childDeviceData['orgName'] && this.childDeviceData['deviceModel'] && this.childDeviceData['deviceModel'] !== '' && this.childDeviceData['softwareVersion'] && this.childDeviceData['softwareVersion'] !== '') {
          if (this.childDeviceData['devicePort'] && this.childDeviceData['devicePort'] !== undefined && this.childDeviceData['devicePort'] !== '' && this._checkPort(this.childDeviceData['devicePort'])) {
            this.$message.error('端口号仅能为数字且小于65535')
          } else {
            this.childDeviceData['listDmDeviceAttrValue'] = this.attrList
            this.childDeviceData['uuid'] = this.parentUuid
            this.childDeviceData['deviceCode'] = this.parentDeviceCode
            this.childDeviceData['deviceTypeUuid'] = this.deviceTypeUuid
            this.childDeviceData['deviceType'] = this.currentDevice.type
            this.childDeviceData['deviceTypeDesc'] = this.currentDevice.typeDesc
            // if (this.childDeviceData.deviceGPSLon && this.childDeviceData.deviceGPSLon !== '' && this.childDeviceData.deviceGPSLat && this.childDeviceData.deviceGPSLon !== '') { this.childDeviceData['deviceLocation'] = Number(this.childDeviceData.deviceGPSLon.trim()).toFixed(6) + ',' + Number(this.childDeviceData.deviceGPSLat.trim()).toFixed(6) } else {
            //   this.childDeviceData['deviceLocation'] = null
            // }
            // delete this.childDeviceData.deviceGPSLon
            // delete this.childDeviceData.deviceGPSLat
            if (this.childDeviceData['deviceLocation'] && this.childDeviceData['deviceLocation'] !== '') {
              if (this.childDeviceData['deviceLocation'].indexOf(',') > -1) {
                var arr = this.childDeviceData['deviceLocation'].split(',')
                if (Math.abs(arr[0].trim()) > 180 || Math.abs(arr[1].trim()) > 90) {
                  this.$message.error('请检查设备的GPS经度是否在-180~180，纬度是否在-90~90范围内')
                  return false
                } else if ((!/^(-?\d+)(\.\d+)?$/.test(arr[0].trim())) || (!/^(-?\d+)(\.\d+)?$/.test(arr[1].trim()))) {
                  this.$message.error('经纬度请输入数字')
                  return false
                }
              } else {
                // 中文输入的，给出提示
                this.$message.error('请输入英文字符下的，')
                return false
              }
            }
            if (this.childDeviceData['deviceLocation'] === '') {
              this.childDeviceData['deviceLocation'] = null
            }
            insertSubDevice(this.childDeviceData)
              .then(
              function (result) {
                if (result.deviceCode) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                  // 清空数据
                  this.$emit('listenToAddEvent', result)
                  // this.clearData()
                } else {
                  this.$message({
                    message: JSON.stringify(result),
                    type: 'error'
                  })
                }
              }.bind(this)
              )
              .catch(
              function (error) {
                this.$message({
                  message: JSON.stringify(error.response.data),
                  type: 'error'
                })
              }.bind(this)
              )
          }
        } else {
          this.$message({
            message: '请将页面中带*号的必填项目补充完整',
            type: 'warning'
          })
        }
      } else {
        if (this.childDeviceData['gatewayId'] && this.childDeviceData['orgId'] && this.childDeviceData['orgName'] && this.childDeviceData['gatewayId'] !== '' && this.childDeviceData['deviceName'] && this.childDeviceData['deviceName'] !== '') {
          if (this.childDeviceData['devicePort'] && this.childDeviceData['devicePort'] !== undefined && this.childDeviceData['devicePort'] !== '' && this._checkPort(this.childDeviceData['devicePort'])) {
            this.$message.error('端口号仅能为数字且小于65535')
          } else {
            this.childDeviceData['listDmDeviceAttrValue'] = this.attrList
            if (this.childDeviceData['deviceLocation'] && this.childDeviceData['deviceLocation'] !== '') {
              if (this.childDeviceData['deviceLocation'].indexOf(',') > -1) {
                arr = this.childDeviceData['deviceLocation'].split(',')
                if (Math.abs(arr[0].trim()) > 180 || Math.abs(arr[1].trim()) > 90) {
                  this.$message.error('请检查设备的GPS经度是否在-180~180，纬度是否在-90~90范围内')
                  return false
                } else if ((!/^(-?\d+)(\.\d+)?$/.test(arr[0].trim())) || (!/^(-?\d+)(\.\d+)?$/.test(arr[1].trim()))) {
                  this.$message.error('经纬度请输入数字')
                  return false
                }
              } else {
                // 中文输入的，给出提示
                this.$message.error('请输入英文字符下的，')
                return false
              }
            }
            if (this.childDeviceData['deviceLocation'] === '') {
              this.childDeviceData['deviceLocation'] = null
            }
            // 编辑保存子设备接口
            updateSubDevice(this.childDeviceData)
              .then(
              function (result) {
                this.$message({
                  message: '更新成功',
                  type: 'success'
                })
                this.$emit('listenToEditEvent', this.childDeviceData)
                this.clearData()
              }.bind(this)
              )
              .catch(
              function (error) {
                this.$message.error(JSON.stringify(error.response.data))
              }.bind(this)
              )
          }
        } else {
          this.$message({
            message: '请将页面中带*号的必填项目补充完整',
            type: 'warning'
          })
        }
      }
    },
    passToDialogChildUuid (param) {
      this.inputDisabled = true
      // 根据uuid获取最新子设备编辑数据
      getSubDeviceDetail(param)
        .then(
        function (result) {
          // if (result.deviceLocation) {
          //   if (result.deviceLocation.indexOf(',') > -1) {
          //     var arr = result.deviceLocation.split(',')
          //     result.deviceGPSLon = arr[0]
          //     result.deviceGPSLat = arr[1]
          //   }
          // }
          this.attrList = result.listDmDeviceAttrValue
          this.attrDomainList = result.attrDomainList
          for (let i = 0; i < this.attrList.length; i++) {
            if (this.attrList[i].attrDataType === 'select') {
              var list = []
              for (let j = 0; j < this.attrDomainList.length; j++) {
                var attr = this.attrList[i]
                var attrDomain = this.attrDomainList[j]
                if (attr['uuid'] === attrDomain['attrUuid']) {
                  attrDomain['label'] = attrDomain.domainValue
                  attrDomain['value'] = attrDomain.domainValueCode
                  list.push(attrDomain)
                  this.attrList[i]['selectData'] = list
                }
              }
            }
          }
          this.selectedVaue = { 'orgId': result.orgId, 'orgName': result.orgName }
          this.parentDeviceCode = result.parentDeviceCode
          if (result.picId && result.picId !== '') {
            this.$set(this.fileList, 0, { name: result.picId, 'url': '' })
          }
          this.childDeviceData = result
        }.bind(this)
        )
        .catch()
    }
  },
  mounted () {
    if (this.mainDeviceData) {
      this.passDeviceInfo(this.mainDeviceData)
    }
    if (this.childUuid) {
      this.passToDialogChildUuid(this.childUuid)
    }
  }
}
</script>
