<template>
  <div class="main">
    <el-row :gutter="60">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <select-box title="设备类型" code="deviceTypeDesc" ref="deviceTypeDesc" :options="deviceType" :initValue="mainDeviceData.deviceTypeDesc" @listenToInput="_saveDeviceData" :required="true" :disabled='inputDisabled'>
          </select-box>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <select-box title="厂商名称" code="providerCode" ref="providerCode" :options="providerType" :initValue="mainDeviceData.providerName" @listenToInput="_saveDeviceData" :required="true" :disabled='inputDisabled'>
          </select-box>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <select-box title="设备型号" code="deviceModel" ref="deviceModel" :options="deviceModelType" :required="true" @listenToInput="_saveDeviceData" :initValue="mainDeviceData.deviceModel" :disabled='inputDisabled'>
          </select-box>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <select-box title="软件版本" ref="softwareVersion" :options="softwareVersionType" :required="true" code="softwareVersion" @listenToInput="_saveDeviceData" :initValue="mainDeviceData.softwareVersion" :disabled='inputDisabled'>
          </select-box>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="60">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <inputBox title="组织ID" code="orgId" @listenToInput="_saveDeviceData" :value="selectedVaue.orgId" :disabled=true :required="true" ref="orgId" :maxlength=30>
          </inputBox>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <input-box style="margin-right: 20px" title="组织名称" code="orgName" :value="selectedVaue.orgName" ref="orgName" :required="true" :disabled=true>
          </input-box>
          <el-button plain @click="_selectOrgani">选择组织</el-button>
          <el-dialog class="deviceOrgDialog" title="选择组织" :visible.sync="showDialog" :close-on-click-modal="false" @close="_close" :modal="false" :modal-append-to-body="true" width="45%">
            <org-tree @changeDialogStatus="_changeSatus" ref="orgTree"></org-tree>
          </el-dialog>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <select-box title="网关服务标识" code="gatewayId" ref="gatewayId" :options="gatewayType" :required="true" :disabled='inputDisabled' :initValue="mainDeviceData.gatewayId" @listenToInput="_saveDeviceData">
          </select-box>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="60">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <input-box title="MAC地址" code="macAddress" @listenToInput="_saveDeviceData" :value="mainDeviceData.macAddress" :disabled='inputDisabled' ref="macAddress" :required="true" :maxlength=20>
          </input-box>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <inputBox title="设备名称" code="deviceName" ref="deviceName" :required="true" @listenToInput="_saveDeviceData" :value="mainDeviceData.deviceName" :maxlength=32>
          </inputBox>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <inputBox title="设备IP" code="deviceIp" ref="deviceIp" :value="mainDeviceData.deviceIp" @listenToInput="_saveDeviceData" :maxlength=16>
          </inputBox>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <inputBox title="设备端口" code="devicePort" ref="devicePort" @listenToInput="_saveDeviceData" :value="mainDeviceData.devicePort" :maxlength=8>
          </inputBox>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="60">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <inputBox title="安装地址" ref="installAddress" code="installAddress" @listenToInput="_saveDeviceData" :value="mainDeviceData.installAddress" :maxlength=128>
          </inputBox>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <inputBox title="用户名" code="userName" ref="userName" @listenToInput="_saveDeviceData" :value="mainDeviceData.userName" :maxlength=32>
          </inputBox>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <inputBox title="用户密码" code="password" ref="password" @listenToInput="_saveDeviceData" :value="mainDeviceData.password" type="password" :maxlength=32>
          </inputBox>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <inputBox title="设备掩码" code="deviceMask" ref="deviceMask" @listenToInput="_saveDeviceData" :value="mainDeviceData.deviceMask" :maxlength=32>
          </inputBox>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="60">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <inputBox title="设备描述" code="deviceDesc" ref="deviceDesc" @listenToInput="_saveDeviceData" :value="mainDeviceData.deviceDesc" :maxlength=256>
          </inputBox>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <inputBox title="排序描述" code="showSort" ref="showSort" @listenToInput="_saveDeviceData" :value="mainDeviceData.showSort" type="num" :maxlength=32>
          </inputBox>
        </div>
      </el-col>
      <!-- <el-col :span="6">
        <div class="grid-content bg-purple">
          <inputBox title="设备GPS经度" code="deviceGPSLon" ref="deviceGPSLon" @listenToInput="_saveDeviceData" :value="mainDeviceData.deviceGPSLon" :maxlength=11>
          </inputBox>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <inputBox title="设备GPS纬度" code="deviceGPSLat" ref="deviceGPSLat" @listenToInput="_saveDeviceData" :value="mainDeviceData.deviceGPSLat" :maxlength=11>
          </inputBox>
        </div>
      </el-col> -->
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <inputBox title="设备GPS坐标" code="deviceLocation" ref="deviceLocation" @listenToInput="_saveDeviceData" :value="mainDeviceData.deviceLocation" :maxlength=32 placeholder="输入格式为'经度,纬度'">
          </inputBox>
        </div>
      </el-col>
    </el-row>
    <div v-show="attrList.length>0">
      <p style="margin-bottom: 15px;font-size: 14px">专有属性设置</p>
      <el-row :gutter="60">
        <el-col :span="6" v-for="(item, index) in attrList" :key="index">
          <div class="grid-content attr-content bg-purple">
            <input-box v-if="item.attrDataType==='string'" :title="item.attrDesc" :code="item.attrDesc" :ref="item.attrDesc" @listenToInput="_savePropData" :append="item.unitDesc" :disabled="(item.attrType==='device_attribute')||(item.attrType==='tech_parameter'&&dialogType==='EDIT')" :value="item.attrValue">
            </input-box>
            <input-box v-if="item.attrDataType === 'integer'" :title="item.attrDesc" :code="item.attrDesc" :ref="item.attrDesc" type="number" :append="item.unitDesc" @listenToInput="_savePropData" :disabled="(item.attrType==='device_attribute')||(item.attrType==='tech_parameter'&&dialogType==='EDIT')" :value="item.attrValue">
            </input-box>
            <select-box v-if="item.attrDataType === 'select'" :title="item.attrDesc" :code="item.attrDesc" :ref="item.attrDesc" :options="item.selectData" @listenToInput="_savePropData" :disabled="(item.attrType==='device_attribute')||(item.attrType==='tech_parameter'&&dialogType==='EDIT')" :initValue="item.attrValue">
            </select-box>
            <select-box v-if="item.attrDataType === 'boolean'" :title="item.attrDesc" :code="item.attrDesc" :ref="item.attrDesc" :options="boolOption" @listenToInput="_savePropData" :disabled="(item.attrType==='device_attribute')||(item.attrType==='tech_parameter'&&dialogType==='EDIT')" :initValue="item.attrValue">
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
import orgTree from './orgTree'
import { getAttrListByUuid, insertParentDevice, updateParentDevice, getDeviceDetail, getProviderByType, getTypeModel, getSoftwareVersion } from '../apis/index.js'
import { isValidIP, isValidMac, isValidGPS, Base64Encode, readBlobAsDataURL } from '../assets/js/tool.js'
export default {
  props: {
    dialogType: {
      type: String
    },
    deviceTypeList: {
      type: Array
    },
    deviceType: {
      type: Array
    },
    uuid: {
      type: String
    },
    gatewayType: {
      type: Array
    }
  },
  data () {
    return {
      providerType: [],
      deviceTypeUuid: '',
      deviceModelType: [],
      softwareVersionType: [],
      currentDevice: {},
      devicePropsList: [],
      selectedVaue: {},
      mainDeviceData: {},
      showDialog: false,
      attrList: [],
      inputDisabled: false,
      fileList: [],
      boolOption: [{
        value: 'Yes',
        label: 'Yes'
      }, {
        value: 'No',
        label: 'No'
      }]
    }
  },
  components: {
    ElButton,
    ElRow,
    selectBox,
    inputBox,
    orgTree
  },
  methods: {
    _saveDeviceData (data) {
      for (var key in data) {
        if (key === 'providerCode' && this.dialogType === 'EDIT') {
          console.log('providerCode')
        } else {
          this.$set(this.mainDeviceData, key, data[key])
        }
        if (key === 'deviceTypeDesc' && data[key] !== '' && data[key] !== undefined && this.dialogType === 'ADD') {
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

        if (key === 'deviceTypeDesc' && data[key] === '' && this.dialogType === 'ADD') {
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
        if (key === 'providerCode' && data[key] === '' && this.dialogType === 'ADD') {
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
          getSoftwareVersion({ 'typeCode': this.currentDevice.type, 'providerCode': this.mainDeviceData.providerCode, 'typeModel': data[key] })
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

        if (key === 'deviceModel' && data[key] === '' && this.dialogType === 'ADD') {
          this.softwareVersionType = []
          this.$refs.softwareVersion.clearBox()
          this.attrList = []
        }

        if (key === 'softwareVersion' && data[key] !== '' && data[key] !== undefined && this.dialogType === 'ADD') {
          this.attrList = []
          getAttrListByUuid({ 'typeCode': this.currentDevice.type, 'providerCode': this.mainDeviceData.providerCode, 'typeModel': this.mainDeviceData.deviceModel, 'softwareVersion': this.mainDeviceData.softwareVersion })
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

        if (key === 'softwareVersion' && data[key] === '' && this.dialogType === 'ADD') {
          this.attrList = []
        }

        if (key === 'password') {
          this.mainDeviceData['password'] = Base64Encode(data[key])
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
    _savePropData (data) {
      for (var key in data) {
        for (let i = 0; i < this.attrList.length; i++) {
          // this.attrList[i]['dataType'] = this.attrList[i].attrDataType
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
    _handleUploadFile (file, fileList) {
      if (fileList.length === 2) {
        fileList.shift()
      }
      readBlobAsDataURL(file.raw, (result) => {
        this.mainDeviceData['imgData'] = result
      })
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
    _close () {
      if (this.$refs.orgTree) {
        this.$refs.orgTree.clear()
      }
    },
    _selectOrgani () {
      this.showDialog = true
    },
    /**
     * @description 主设备数据提交操作
     *  */
    _confirm () {
      if (this.dialogType === 'ADD') {
        if (this.mainDeviceData['deviceTypeDesc'] && this.mainDeviceData['deviceTypeDesc'] !== '' && this.mainDeviceData['providerCode'] && this.mainDeviceData['providerCode'] !== '' && this.mainDeviceData['macAddress'] && this.mainDeviceData['macAddress'] !== '' && this.mainDeviceData['gatewayId'] && this.mainDeviceData['gatewayId'] !== '' && this.mainDeviceData['deviceName'] && this.mainDeviceData['deviceName'] !== '' && this.mainDeviceData['orgId'] && this.mainDeviceData['orgName'] && this.mainDeviceData['deviceModel'] && this.mainDeviceData['deviceModel'] !== '' && this.mainDeviceData['softwareVersion'] && this.mainDeviceData['softwareVersion'] !== '') {
          if (this.mainDeviceData['devicePort'] && this.mainDeviceData['devicePort'] !== undefined && this.mainDeviceData['devicePort'] !== '' && this._checkPort(this.mainDeviceData['devicePort'])) {
            this.$message.error('端口号仅能为数字且小于65535')
          } else {
            // 添加设备接口
            this.mainDeviceData['listDmDeviceAttrValue'] = this.attrList
            this.mainDeviceData['deviceTypeUuid'] = this.deviceTypeUuid
            this.mainDeviceData['deviceType'] = this.currentDevice.type
            this.mainDeviceData['deviceTypeDesc'] = this.currentDevice.typeDesc
            // if (this.mainDeviceData.deviceGPSLon && this.mainDeviceData.deviceGPSLon !== '' && this.mainDeviceData.deviceGPSLat && this.mainDeviceData.deviceGPSLon !== '') { this.mainDeviceData['deviceLocation'] = Number(this.mainDeviceData.deviceGPSLon.trim()).toFixed(6) + ',' + Number(this.mainDeviceData.deviceGPSLat.trim()).toFixed(6) } else {
            //   this.mainDeviceData['deviceLocation'] = null
            // }
            // delete this.mainDeviceData.deviceGPSLon
            // delete this.mainDeviceData.deviceGPSLat
            if (this.mainDeviceData['deviceLocation'] && this.mainDeviceData['deviceLocation'] !== '') {
              if (this.mainDeviceData['deviceLocation'].indexOf(',') > -1) {
                var arr = this.mainDeviceData['deviceLocation'].split(',')
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
            if (this.mainDeviceData['deviceLocation'] === '') {
              this.mainDeviceData['deviceLocation'] = null
            }
            insertParentDevice(this.mainDeviceData)
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
        // 编辑保存设备接口
        if (this.mainDeviceData['gatewayId'] && this.mainDeviceData['orgId'] && this.mainDeviceData['orgName'] && this.mainDeviceData['gatewayId'] !== '' && this.mainDeviceData['deviceName'] && this.mainDeviceData['deviceName'] !== '') {
          if (this.mainDeviceData['devicePort'] && this.mainDeviceData['devicePort'] !== undefined && this.mainDeviceData['devicePort'] !== '' && this._checkPort(this.mainDeviceData['devicePort'])) {
            this.$message.error('端口号仅能为数字且小于65535')
          } else {
            this.mainDeviceData['listDmDeviceAttrValue'] = this.attrList
            // if (this.mainDeviceData.deviceGPSLon && this.mainDeviceData.deviceGPSLon !== '' && this.mainDeviceData.deviceGPSLat && this.mainDeviceData.deviceGPSLon !== '') { this.mainDeviceData['deviceLocation'] = Number(this.mainDeviceData.deviceGPSLon.trim()).toFixed(6) + ',' + Number(this.mainDeviceData.deviceGPSLat.trim()).toFixed(6) } else {
            //   this.mainDeviceData['deviceLocation'] = null
            // }
            // delete this.mainDeviceData.deviceGPSLon
            // delete this.mainDeviceData.deviceGPSLat
            if (this.mainDeviceData['deviceLocation'] && this.mainDeviceData['deviceLocation'] !== '') {
              if (this.mainDeviceData['deviceLocation'].indexOf(',') > -1) {
                arr = this.mainDeviceData['deviceLocation'].split(',')
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
            if (this.mainDeviceData['deviceLocation'] === '') {
              this.mainDeviceData['deviceLocation'] = null
            }
            updateParentDevice(this.mainDeviceData)
              .then(
              function (result) {
                this.$message({
                  message: '更新成功',
                  type: 'success'
                })
                this.$emit('listenToEditEvent', this.mainDeviceData)
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
    clearData () {
      for (var key in this.mainDeviceData) {
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
      this.mainDeviceData = {}
      this.selectedVaue = {}
      this.attrList = []
      this.$refs.upload.clearFiles()
    },
    passToDialogUuid (uuid) {
      this.inputDisabled = true
      // 根据uuid获取最新主设备编辑数据
      getDeviceDetail(uuid)
        .then(
        function (result) {
          // 刷新视图
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
                if (attr['attrUuid'] === attrDomain['attrUuid']) {
                  attrDomain['label'] = attrDomain.domainValue
                  attrDomain['value'] = attrDomain.domainValueCode
                  list.push(attrDomain)
                  this.attrList[i]['selectData'] = list
                }
              }
            }
          }
          this.selectedVaue = { 'orgId': result.orgId, 'orgName': result.orgName }
          if (result.picId && result.picId !== '') {
            this.$set(this.fileList, 0, { name: result.picId, 'url': '' })
          }
          this.mainDeviceData = result
        }.bind(this)
        )
        .catch()
    }
  },
  mounted () {
    if (this.uuid) {
      this.passToDialogUuid(this.uuid)
    }
  }
}
</script>
