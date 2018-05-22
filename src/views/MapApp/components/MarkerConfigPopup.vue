<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" width='30%' :before-close="onClose">
      <div slot="title" class="dialog-title">
        <p>{{form.deviceName}}</p>
      </div>
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="经度" :label-width="formLabelWidth" prop="longitude">
          <el-input v-model="form.longitude" auto-complete="off" :readonly='true' style="width:215px"></el-input>
        </el-form-item>
        <el-form-item label="纬度" :label-width="formLabelWidth" prop="latitude">
          <el-input v-model="form.latitude" auto-complete="off" :readonly='true' style="width:215px"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="markerType">
          <el-select v-model="form.markerType" placeholder="请选择点位类型" disabled>
            <el-option v-for="item in form.markerTypesOptions" :label="item.itemName" :value="item.itemCode" :key="item.itemCode">{{item.itemName}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示等级" :label-width="formLabelWidth" prop="selectZoomLevel">
          <el-select v-model="form.selectZoomLevel" placeholder="请选择显示等级">
            <el-option v-for="(item,index) in form.zoomLevel" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="isChoice" v-show="isChoice">
          <el-form-item :label-width="formLabelWidth" prop="isFloorDevice">
            <el-checkbox-group v-model="form.isFloorDevice">
              <el-checkbox label="是否楼内设备" name="isFloorDevice" @change="onChange"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 折叠面板 -->
          <div v-show="isShow" ref="divPopup">
            <el-popover ref="orgPopover" width="174" placement="bottom" trigger='click'>
              <OrgTreeView ref="orgTree" @node-click="onHandleNodeClick"></OrgTreeView>
            </el-popover>
            <el-form-item label="所属楼栋区域" :label-width="formLabelWidth" prop="OrgName">
              <el-input v-model="form.OrgName" placeholder="请选择组织" clearable v-popover:orgPopover @focus="propOrgDara" style="width:215px"></el-input>
            </el-form-item>
            <el-form-item label="所在楼层类型" :label-width="formLabelWidth" prop="selectfloorType">
              <el-select v-model="form.selectfloorType" placeholder="请选择所属组织" clearable>
                <el-option v-for="item in form.floorTypes" :key="item.itemCode" :label="item.itemName" :value="item.itemCode">{{item.itemName}}
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAreaList } from '@/views/MapApp/apis/index.js'
import OrgTreeView from '@/components/TreeView'
export default {
  components: {
    OrgTreeView
  },
  data () {
    // 验证是否选择的是楼栋
    var isHouseNode = (rule, value, callback) => {
      if (this.isShow) {
        // TODO 配置区域和楼层
        if (value === '') {
          callback(new Error('楼栋不能为空'))
        } else {
          if (!this.isOrgType) {
            callback()
            return
          }
          if (this.isOrgType && this.isOrgType === '3') {
            var data = {
              orgCode: this.orgCode,
              sceneId: this.sceneId
            }
            getAreaList(data).then(res => {
              if (res.data.data && res.data.data.length !== 0) {
                this.areaId = res.data.data[0].id
                callback()
                return
              }
              callback(new Error('该楼层没有画区域'))
            }).catch(err => {
              console.warn(err)
            })
            return
          }
          callback(new Error('请选择正确的楼栋'))
        }
      } else {
        // TODO 不配置区域和楼层
        callback()
      }
    }
    var isNulls = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    var isSelectfloorType = (rule, value, callback) => {
      if (this.isShow) {
        if (value === '') {
          callback(new Error('楼层类型不能为空'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      OrgName: '',
      treeDatas: {
        tData: []
      },
      areaId: '',
      sceneId: '',
      orgCode: '',
      isOrgType: '',
      dialogFormVisible: false,
      isShow: false,
      isChoice: false,
      form: {
        deviceName: '',
        longitude: '',
        latitude: '',
        markerTypesOptions: [],
        markerType: '',
        zoomLevel: [],
        OrgName: '',
        OrgTree: [],
        floorTypes: [],
        selectfloorType: '',
        selectZoomLevel: '3',
        isFloorDevice: ''
      },
      rules: {
        longitude: [
          { required: true, validator: isNulls, message: '不能为空', trigger: 'change' }
        ],
        latitude: [
          { required: true, validator: isNulls, message: '不能为空', trigger: 'change' }
        ],
        selectDeviceType: [
          { required: true, validator: isNulls, message: '不能为空', trigger: 'change' }
        ],
        selectZoomLevel: [
          { required: true, validator: isNulls, message: '不能为空', trigger: 'change' }
        ],
        OrgName: [
          { required: true, validator: isHouseNode }
        ],
        selectfloorType: [
          { required: true, validator: isSelectfloorType }
        ]
      },
      formLabelWidth: '180px'
    }
  },
  props: {
    transferInfo: {
      type: Object
    }
  },
  methods: {
    /*
     *@description 输入框focus时，进行传值
    */
    propOrgDara () {
      this.$refs['orgTree'].treeDatas = this.transferInfo.treeDatas
    },
    onHandleNodeClick (data) {
      console.log(data)
      this.form.OrgName = data.name
      this.$refs.orgPopover.doClose()
      this.isOrgType = data.orgType
      this.orgCode = data.uuid
    },
    openDialog () {
      this.form.markerTypesOptions = this.transferInfo.markerTypes
      this.form.zoomLevel = this.transferInfo.zoomLevel
      this.form.OrgTree = this.transferInfo.OrgTree
      this.form.floorTypes = this.transferInfo.floorTypes[0]
      this.dialogFormVisible = true
      if (this.transferInfo.sceneType === 1) {
        // TODO 判断地图场景是小区全图---1 还是停车场地图---2
        this.isChoice = true
      }
      // 判断是新增还是编辑
      if (Object.keys(this.transferInfo.echoInfo).length) {
        // 编辑点位操作
        this.form.deviceName = this.transferInfo.echoInfo.deviceName
        this.form.longitude = this.transferInfo.echoInfo.longitude
        this.form.latitude = this.transferInfo.echoInfo.latitude
        this.form.markerType = this.transferInfo.echoInfo.markerType.toString()
        this.form.selectZoomLevel = this.transferInfo.echoInfo.zoomLevel
        this.sceneId = this.transferInfo.sceneId
        if (this.transferInfo.echoInfo.inBuilding === 1) {
          this.areaId = this.transferInfo.echoInfo.areaId
          this.orgCode = this.transferInfo.echoInfo.orgCode
          this.form.OrgName = this.transferInfo.echoInfo.orgName
          this.form.selectfloorType = this.transferInfo.echoInfo.floorType.toString()
          this.isShow = true
          this.form.isFloorDevice = true
        } else {
          this.isShow = false
          this.form.isFloorDevice = false
        }
      } else {
        // 新增点位操作
        this.form.longitude = this.transferInfo.longitude
        this.form.latitude = this.transferInfo.latitude
        this.form.deviceName = this.transferInfo.deviceName
        this.sceneId = this.transferInfo.sceneId
        this.form.markerType = this.transferInfo.markerType.toString()
        this.isShow = false
      }
    },
    onSubmit () {
      var markerObj = {}
      // 判断是否在楼层内
      if (!this.isShow) {
        markerObj.markerName = this.form.deviceName
        markerObj.longitude = this.form.longitude
        markerObj.latitude = this.form.latitude
        markerObj.markerType = Number(this.form.markerType)
        markerObj.zoomLevel = Number(this.form.selectZoomLevel)
        markerObj.areaId = ''
        markerObj.sceneId = this.sceneId
        markerObj.inBuilding = 0
        markerObj.floorType = 0
      } else {
        markerObj.markerName = this.form.deviceName
        markerObj.longitude = this.form.longitude
        markerObj.latitude = this.form.latitude
        markerObj.markerType = Number(this.form.markerType)
        markerObj.zoomLevel = Number(this.form.selectZoomLevel)
        markerObj.areaId = this.areaId
        markerObj.sceneId = this.sceneId
        markerObj.inBuilding = 1
        markerObj.floorType = Number(this.form.selectfloorType)
      }
      markerObj.addOrEdit = this.transferInfo.addOrEdit
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('send', markerObj)
          this.onClose()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onChange () {
      // 获取是否选中 <!-- `checked` 为 true 或 false -->
      this.isShow = this.form.isFloorDevice
    },
    // 弹窗关闭时的回调
    onClose () {
      console.log('弹窗关闭时的回调')
      this.$refs['form'].resetFields()
      console.log('弹窗关闭时的回调--清空')
      this.isShow = false
      this.isChoice = false
      this.form.OrgName = ''
      this.form.selectfloorType = ''
      this.form.isFloorDevice = false
      if (this.transferInfo.addOrEdit === 'add') {
        // 新增弹窗的取消
        this.$emit('send', 'cancelAdd')
      }
      if (this.transferInfo.addOrEdit === 'edit') {
        // 编辑弹窗的取消
        this.$emit('send', 'cancelEdit')
      }
      this.dialogFormVisible = false
    },
    // 取消
    onCancel () {
      this.onClose()
    }
  }
}
</script>
<style lang="less" scoped>
.dialog-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}
.dialog-footer {
  text-align: center;
}
</style>

