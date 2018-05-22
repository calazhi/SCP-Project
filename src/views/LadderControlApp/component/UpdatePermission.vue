<template>
  <div>
    <el-dialog title="权限详情" :visible="show" @close="onCloseEvent('form')" width="800px">
      <el-row class="permissions-content">
        <el-form ref="form" :model="form" label-width="100px" :rules="rules" class="demo-ruleForm addPermissionForm">
          <el-row class="permissions-row">
            <el-col :span="12">
              <el-form-item label="姓名:" prop="personName">
                <el-input type="text" v-model="form.personName" :disabled="true" :readonly="true" class="permissions-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始时间:" prop="startTime">
                <el-date-picker ref="startTime" v-model="form.startTime" value-format="yyyy-MM-dd HH:mm:ss" :editable="false" type="datetime" class="permissions-input">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="permissions-row">
            <el-col :span="12">
              <el-form-item label="设备:" prop="deviceName">
                <el-input type="text" :disabled="true" v-model="form.deviceName" :readonly="true" class="permissions-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间:" prop="endTime">
                <el-date-picker ref="endTime" v-model="form.endTime" value-format="yyyy-MM-dd HH:mm:ss" :editable="false" type="datetime" class="permissions-input">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="permissions-row">
            <el-col :span="12">
              <el-form-item label="人员类型:" prop="personType">
                <el-input type="text" :disabled="true" v-model="form.personType" :readonly="true" class="permissions-input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="update">
              <el-form-item label="选择楼层:" prop="floors">
                <el-select v-model="form.floors" multiple placeholder="请选择" collapse-tags align="left" class="permissions-select" @change="changeFloors()">
                  <el-option v-for="item in getFloorOptions(startFloor,endFloor)" :key="item.value" :label="item.label" :value="item.value">
                    {{ item.label }}
                  </el-option>
                </el-select>
                <el-checkbox class="permissions-checkbox" v-model="form.checkAll" @change="handleCheckAllChange()">全选楼层</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="permissions-row">
            <el-col :span="12">
              <el-form-item label="凭证类型:" prop="permissionType">
                <el-checkbox-group v-model="form.permissionType" style="padding-left:22px">
                  <el-checkbox v-for="permissionType in permissionTypes" :label="permissionType" :key="permissionType">{{permissionType}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.personType === '物业'">
              <el-form-item label="职位:" prop="position">
                <el-input type="text" :disabled="true" v-model="form.position" :readonly="true" class="permissions-input"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="permissions-row">
            <el-col :span="12" v-if="form.cardIds.length > 0 && form.permissionType.indexOf('卡片') > -1">
              <el-form-item label="卡号:" prop="cardIds">
                <el-select v-model="form.cardIds" multiple placeholder="请选择" :disabled="true" align="left" class="permissions-input">
                  <el-option v-for="item in getCardIds(allCardIds)" :key="item.value" :label="item.label" :value="item.value">
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="faceCode && form.permissionType.indexOf('人脸') > -1">
              <el-form-item label="人脸:" prop="faceCode">
                <img class="face-img" :src="faceCode" alt="暂无图片">
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="permissions-row">
            <el-form-item class="form-btn">
              <el-button @click="onCloseEvent('form')">取 消</el-button>
              <el-button type="primary" class="save-btn" :disabled="disButton" @click="saveEpuipment('form')">修改</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionData, postUpdatePermissionData } from '../apis/index'
const ERROK = '00000'
export default {
  props: {
    show: {
      required: true,
      type: Boolean,
      default: false
    },
    modifyMessege: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      startFloor: '',
      endFloor: '',
      faceCode: '',
      allCardIds: [],
      permissionTypes: [],
      form: {
        cardIds: [],
        permissionType: [],
        personName: '',
        checkAll: false,
        personType: '',
        position: '',
        deviceName: '',
        floors: [],
        startTime: '',
        endTime: ''
      },
      rules: {
        permissionType: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        floors: [{ required: true, message: '请选择楼层', trigger: 'change' }],
        startTime: [{ required: true, validator: this.checkstartTime, trigger: 'blur' }],
        endTime: [{ required: true, validator: this.checkendTime, trigger: 'change' }]
      },
      deviceIDs: '',
      persons: '',
      uuid: '',
      selectedData: [],
      selectPerson: [],
      showEquipment: false,
      showPerson: false,
      disButton: false
    }
  },
  methods: {
    // 查询权限信息
    getPermission () {
      getPermissionData({
        uuid: this.uuid
      }).then(res => {
        if (res.data.code === ERROK) {
          if (res.data.data.uuid) {
            this.form = Object.assign({}, res.data.data)
            let tempArr1 = []
            res.data.data.allPermissionType.map(function (n) {
              if (n === 2 || n === 6 || n === 7) {
                tempArr1.push(n)
              }
              res.data.data.allPermissionType = tempArr1
            })
            let tempArr2 = []
            res.data.data.permissionType.map(function (n) {
              if (n === 2 || n === 6 || n === 7) {
                tempArr2.push(n)
              }
              res.data.data.permissionType = tempArr2
            })
            this.changeString(res.data.data.allPermissionType, res.data.data.permissionType)
            this.form.cardIds = res.data.data.cardCode.split(',')
            this.allCardIds = res.data.data.cardCode.split(',')
            this.form.personType = res.data.data.personType === 1 ? '业主' : res.data.data.personType === 2 ? '家属' : res.data.data.personType === 3 ? '租客' : res.data.data.personType === 5 ? '物业' : ''
            this.faceCode = res.data.data.faceCode
            this.uuid = res.data.data.uuid
            this.form.floors = JSON.parse(res.data.data.floors)
            this.form.startTime = new Date(res.data.data.startTime)
            this.form.endTime = new Date(res.data.data.endTime)
            this.endFloor = res.data.data.endFloor
            this.startFloor = res.data.data.startFloor
            if (res.data.data.deleteFlag === 2 || res.data.data.deleteFlag === 3) this.disButton = true
            if (this.form.floors.length === this.getFloorOptions(this.startFloor, this.endFloor).length) {
              this.form.checkAll = true
            } else {
              this.form.checkAll = false
            }
          } else {
            this.disButton = true
          }
        } else {
          this.disButton = true
          this.$message({
            message: res.data.message ? res.data.message : '获取权限信息失败',
            type: 'error'
          })
        }
      }).catch(err => {
        this.disButton = true
        console.log(err)
      })
    },
    // 全选楼层
    handleCheckAllChange () {
      let allFloor = []
      for (let i = 0; i < this.getFloorOptions(this.startFloor, this.endFloor).length; i++) {
        allFloor.push(this.getFloorOptions(this.startFloor, this.endFloor)[i].value)
      }
      if (this.form.checkAll) {
        this.form.floors = allFloor
        this.$refs['form'].clearValidate()
      } else {
        this.form.floors = []
      }
    },
    // 全选楼层关联全选按钮
    changeFloors () {
      if (this.form.floors.length === this.getFloorOptions(this.startFloor, this.endFloor).length) {
        this.form.checkAll = true
      } else {
        this.form.checkAll = false
      }
    },
    // 类型转换 数字转换为字符串
    changeString (permissionTypes, permissionType) {
      this.permissionTypes = []
      this.form.permissionType = []
      for (let i = 0; i < permissionTypes.length; i++) {
        permissionTypes[i] = permissionTypes[i] === 2 ? '卡片' : permissionTypes[i] === 6 ? '指纹' : '人脸'
        this.permissionTypes.push(permissionTypes[i])
      }
      if (permissionType && permissionType.length) {
        for (let i = 0; i < permissionType.length; i++) {
          permissionType[i] = permissionType[i] === 2 ? '卡片' : permissionType[i] === 6 ? '指纹' : '人脸'
          this.form.permissionType.push(permissionType[i])
        }
      } else {
        this.$refs['form'].clearValidate() // 移除整个表单的校验结果
      }
    },
    // 类型转换 将字符串转换为数字
    changeNum (arr) {
      let permissionTypeArr = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '卡片') {
          arr[i] = 2
        } else if (arr[i] === '指纹') {
          arr[i] = 6
        } else if (arr[i] === '人脸') {
          arr[i] = 7
        }
        permissionTypeArr.push(arr[i])
      }
      return permissionTypeArr.join(',')
    },
    // 获取卡片数
    getCardIds (cardIds) {
      let allCardId = []
      for (let i = 0; i < cardIds.length; i++) {
        allCardId.push({ label: cardIds[i], value: cardIds[i] })
      }
      return allCardId
    },
    // 获取楼层数
    getFloorOptions (startFloor, endFloor) {
      let start = parseInt(startFloor)
      let end = parseInt(endFloor)
      let floorArrs = []
      for (; start < end + 1; start++) {
        if (start === 0) {
          start = 1
        }
        floorArrs.push({ label: start + '楼', value: start })
      }
      return floorArrs
    },
    // 修改权限
    saveEpuipment (fromName) {
      this.$refs[fromName].validate((valid) => {
        if (valid) {
          this.disButton = true
          this.updetePermissionFuc()
        } else {
          this.disButton = false
          return false
        }
      })
    },
    // 修改权限接口
    updetePermissionFuc () {
      postUpdatePermissionData({
        id: this.uuid,
        permissionTypes: this.changeNum(this.form.permissionType),
        floors: this.systemSort(this.form.floors).join(','),
        startTime: this.form.startTime.length ? this.form.startTime : this.formatDate(this.form.startTime),
        endTime: this.form.endTime.length ? this.form.endTime : this.formatDate(this.form.endTime)
      }).then(res => {
        if (res.data.code === ERROK) {
          this.$refs['form'].resetFields()
          this.disButton = false
          this.startFloor = ''
          this.endFloor = ''
          this.$emit('updatePermissions')
          this.$message({
            message: '更新人员权限成功',
            type: 'success'
          })
        } else {
          this.disButton = false
          this.form.permissionType = []
          this.$message({
            message: res.data.message ? res.data.message : '修改权限失败',
            type: 'error'
          })
        }
      }).catch(err => {
        this.disButton = false
        this.form.permissionType = []
        console.log(err)
      })
    },
    // 开始时间规则
    checkstartTime (rule, value, callback) {
      if (!value) return callback(new Error('开始时间不能为空'))
      if (this.form.startTime > this.form.endTime) {
        callback(new Error('开始时间不能大于结束时间'))
      } else {
        callback()
      }
    },
    // 结束时间规则
    checkendTime (rule, value, callback) {
      if (!value) return callback(new Error('结束时间不能为空'))
      if (this.form.startTime > this.form.endTime) {
        callback(new Error('结束时间不能小于开始时间'))
      } else {
        callback()
      }
    },
    // 关闭弹框
    onCloseEvent (fromName) {
      this.$refs['form'].resetFields()
      this.disButton = false
      this.form.permissionType = []
      this.permissionTypes = []
      this.form.personName = ''
      this.form.deviceName = ''
      this.form.position = ''
      this.form.personType = ''
      this.form.cardIds = []
      this.allCardIds = []
      this.faceCode = ''
      this.form.startTime = ''
      this.form.endTime = ''
      this.form.floors = []
      this.startFloor = ''
      this.endFloor = ''
      this.$emit('closeDialog')
    },
    // 时间格式化
    formatDate (now) {
      let newDate = new Date(now)
      let year = newDate.getFullYear()
      let month = newDate.getMonth() + 1
      if (month < 10) month = '0' + month
      let date = newDate.getDate()
      if (date < 10) date = '0' + date
      let hour = newDate.getHours()
      if (hour < 10) hour = '0' + hour
      let minute = newDate.getMinutes()
      if (minute < 10) minute = '0' + minute
      let second = newDate.getSeconds()
      if (second < 10) second = '0' + second
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    },
    // 排序
    systemSort (array) {
      return array.sort(function (a, b) { return a - b })
    }
  },
  watch: {
    show (val) {
      if (this.modifyMessege) {
        this.uuid = this.modifyMessege
        this.getPermission()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.permissions-content {
  text-align: center;
  .permissions-row {
    width: 100%;
    margin-bottom: 30px;
    .permissions-input {
      margin-left: 0px;
      width: 240px;
    }
    .permissions-select {
      float: left;
      margin-left: 20px;
      width: 160px;
    }
    .permissions-checkbox {
      float: left;
      margin-left: 5px;
    }
    .face-img {
      margin-left: -50px;
      width: 180px;
    }
    .form-btn {
      margin-left: -100px;
    }
    .save-btn {
      margin-left: 20px;
    }
  }
}
</style>
<style lang="less">
.permissions-content {
  .permissions-row {
    .el-form-item {
      margin: 0 auto;
    }
  }
  .update {
    .el-checkbox {
      float: left;
    }
    .el-checkbox__inner {
      width: 0;
      height: 0;
      border: none;
    }
    .el-checkbox__label {
      padding: 9px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      color: #66b1ff;
    }
    .el-checkbox__label:focus,
    .el-checkbox__label:hover {
      color: #409eff;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #fff;
      background-color: #409eff;
      border-color: #409eff;
    }
    .el-checkbox__inner::after {
      border: none;
    }
  }
}
</style>
