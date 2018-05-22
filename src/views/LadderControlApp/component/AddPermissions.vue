<template>
  <div>
    <el-dialog title="添加权限" :visible="show" @close="onCloseEvent('form')" width="560px">
      <el-row class="permissions-content">
        <el-form ref="form" :model="form" label-width="100px" :rules="rules" class="demo-ruleForm addPermissionForm">
          <el-row class="permissions-row">
            <el-form-item label="选择人员:" prop="holder">
              <el-input type="textarea" :rows="2" placeholder="请选择人员" v-model="form.holder" @click.native.prevent="onPerson" :readonly="true" class="permissions-input"></el-input>
            </el-form-item>
          </el-row>
          <el-row class="permissions-row">
            <el-form-item label="选择设备:" prop="org">
              <el-input type="textarea" :rows="2" placeholder="请选择设备" v-model="form.org" @click.native.prevent="onEquiment" :readonly="true" class="permissions-input"></el-input>
            </el-form-item>
          </el-row>
          <el-row class="permissions-row update">
            <el-form-item label="凭证类型" prop="permissionType">
              <el-select class="permissions-select" v-model="form.permissionType" multiple placeholder="请选择" @change="changepermission()">
                <el-option v-for="item in allPermissionTypes" :label="item.label" :key="item.value" :value="item.value">{{item.label}}</el-option>
              </el-select>
              <el-checkbox class="permissions-checkbox" v-model="form.checkAll" @change="handleCheckAllChange()">全选类型</el-checkbox>
            </el-form-item>
          </el-row>
          <el-row class="permissions-row">
            <el-form-item label="开始时间:" prop="startTime">
              <el-date-picker ref="startTime" v-model="form.startTime" value-format="yyyy-MM-dd HH:mm:ss" :editable="false" type="datetime" class="permissions-input">
              </el-date-picker>
            </el-form-item>
          </el-row>
          <el-row class="permissions-row">
            <el-form-item label="结束时间:" prop="endTime">
              <el-date-picker ref="endTime" v-model="form.endTime" value-format="yyyy-MM-dd HH:mm:ss" :editable="false" type="datetime" class="permissions-input">
              </el-date-picker>
            </el-form-item>
          </el-row>
          <el-row class="permissions-row">
            <el-form-item class="form-btn">
              <el-button @click="onCloseEvent('form')">取 消</el-button>
              <el-button type="primary" class="save-btn" :disabled="disButton" @click="saveEpuipment('form')">确 定</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-row>
    </el-dialog>
    <add-equipment :show="showEquipment" :selectedData="selectedData" @selectedEquipments="getEquipments" @closeEquipment="closeEquipment"></add-equipment>
    <choose-person :show="showPerson" :selectPerson='selectPerson' @onSavePerson="doSavePerson" @closePerson="closePerson"></choose-person>
  </div>
</template>
<script>
import AddEquipment from './AddEquipment'
import ChoosePerson from './ChoosePerson'
import { postAddPermissionsData } from '../apis/index'
const allPermissionTypes = [{ label: '卡片', value: 2 }, { label: '指纹', value: 6 }, { label: '人脸', value: 7 }]
const ERROK = '00000'
export default {
  components: {
    AddEquipment,
    ChoosePerson
  },
  props: {
    show: {
      required: true,
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      allPermissionTypes: allPermissionTypes,
      form: {
        holder: '',
        org: '',
        permissionType: [],
        startTime: '',
        checkAll: false,
        endTime: ''
      },
      rules: {
        holder: [{ required: true, message: '请选择人员', trigger: 'change' }],
        org: [{ required: true, message: '请选择设备', trigger: 'change' }],
        permissionType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        startTime: [{ required: true, validator: this.checkstartTime, trigger: 'blur' }],
        endTime: [{ required: true, validator: this.checkendTime, trigger: 'change' }]
      },
      deviceIDs: '',
      persons: '',
      selectedData: [],
      selectPerson: [],
      showEquipment: false,
      showPerson: false,
      disButton: false
    }
  },
  methods: {
    // 获取设备数据
    getEquipments (equipments) {
      let getDeviceName = []
      if (equipments.selectedEquipments && equipments.selectedEquipments.length > 0) {
        for (let i = 0; i < equipments.selectedEquipments.length; i++) {
          getDeviceName.push(equipments.selectedEquipments[i].deviceName)
          delete equipments.selectedEquipments[i].deviceName
        }
      }
      this.form.org = getDeviceName.join('、')
      this.deviceIDs = equipments.selectedEquipments
      this.selectData = equipments.selectedEquipments.selectData
      this.selectedData = equipments.selectData
      this.showEquipment = false
    },
    // 全选凭证类型
    handleCheckAllChange () {
      let allpermissionType = []
      for (let i = 0; i < this.allPermissionTypes.length; i++) {
        allpermissionType.push(allPermissionTypes[i].value)
      }
      if (this.form.checkAll) {
        this.form.permissionType = allpermissionType
        this.$refs['form'].clearValidate()
      } else {
        this.form.permissionType = []
      }
    },
    // 全选凭证类型关联全选按钮
    changepermission () {
      if (this.form.permissionType.length === this.allPermissionTypes.length) {
        this.form.checkAll = true
      } else {
        this.form.checkAll = false
      }
    },
    // 打开添加人员弹框
    onPerson () {
      this.showPerson = true
    },
    // 打开添加人员弹框
    onEquiment () {
      this.showEquipment = true
    },
    // 添加、修改权限
    saveEpuipment (fromName) {
      this.$refs[fromName].validate((valid) => {
        if (valid) {
          this.disButton = true
          this.addPermissionsFuc()
        } else {
          this.disButton = false
          return false
        }
      })
    },
    // 添加权限接口
    addPermissionsFuc () {
      postAddPermissionsData({
        deviceIDs: this.deviceIDs,
        persons: this.persons,
        permissionType: this.form.permissionType.join(','),
        startTime: this.form.startTime,
        endTime: this.form.endTime
      }).then(res => {
        if (res.data.code === ERROK) {
          this.$refs['form'].resetFields()
          this.disButton = false
          this.selectedData = []
          this.$emit('addpermissions')
          this.$message({
            message: '添加人员权限成功',
            type: 'success'
          })
        } else {
          this.disButton = false
          this.$message({
            message: res.data.message ? res.data.message : '添加权限失败',
            type: 'error'
          })
        }
      }).catch(err => {
        this.disButton = false
        console.log(err)
      })
    },
    // 开始时间规则
    checkstartTime (rule, value, callback) {
      if (!value) {
        return callback(new Error('开始时间不能为空'))
      }
      if (this.form.startTime > this.form.endTime) {
        callback(new Error('开始时间不能大于结束时间'))
      } else {
        callback()
      }
    },
    // 结束时间规则
    checkendTime (rule, value, callback) {
      if (!value) {
        return callback(new Error('结束时间不能为空'))
      }
      if (this.form.startTime > this.form.endTime) {
        callback(new Error('结束时间不能小于开始时间'))
      } else {
        callback()
      }
    },
    // 获取人员信息
    doSavePerson (chosePerson) {
      this.form.holder = chosePerson.holderNames.join(',')
      this.persons = chosePerson.persons
      this.selectPerson = chosePerson.selectPerson
      this.showPerson = false
    },
    // 关闭设备
    closeEquipment (isStated) {
      if (isStated.isStated) {
        this.form.org = ''
        this.deviceIDs = ''
        this.selectedData = []
      }
      this.showEquipment = false
    },
    // 关闭人员
    closePerson (isStated) {
      if (isStated.isStated) {
        this.form.holder = ''
        this.persons = ''
        this.selectPerson = []
      }
      this.showPerson = false
    },
    // 关闭弹框
    onCloseEvent (fromName) {
      this.$refs['form'].resetFields()
      this.disButton = false
      this.selectedData = []
      this.selectPerson = []
      this.form.holder = ''
      this.form.org = ''
      this.form.checkAll = false
      this.form.permissionType = []
      this.form.startTime = ''
      this.form.endTime = ''
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
      // 增加权限 默认开始时间与结束时间
      this.form.startTime = this.formatDate(new Date())
      this.form.endTime = this.formatDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
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
      margin-left: -50px;
      width: 350px;
    }
    .permissions-select {
      float: left;
      margin-left: 10px;
      width: 264px;
    }
    .permissions-checkbox {
      float: left;
      margin-left: 5px;
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
  .el-checkbox {
    float: left;
  }
}
</style>

