<template>
  <div class="custom-time">
    <el-dialog :visible="show" width="768px" center @close="closeEvent(false)" class="dialog" top="5vh">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row :gutter="20">
          <el-col :span="3">
            <div class="grid-content item-height"></div>
          </el-col>
          <el-col :span="21" style="padding:0 25px">
            <div class="grid-content">
              <el-form-item label="日程名称" prop="name">
                <el-input style="width:300px" v-model.trim="ruleForm.name" placeholder="字符长度不能超过32个" :maxlength="32"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <div class="grid-content item-height"></div>
          </el-col>
          <el-col :span="21" style="padding:0 25px">
            <div class="equipment-choose">
              <el-form-item label="信息发布控制器" style="margin-left:-20px">
                <el-select v-model="equipmentValue" placeholder="请选择" :disabled='disabled' @change="changeValue">
                  <el-option v-for="item in options" :key="item.deviceID" :label="item.deviceName" :value="item.deviceID">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <div class="grid-content" style="min-height:10px"></div>
          </el-col>
          <el-col :span="21" style="padding:0 25px">
            <div class="grid-content">
              <el-form-item label="节目列表" prop="item">
                <el-select v-model="ruleForm.item" @change="handleChangeitem" placeholder="请选择节目">
                  <el-option v-for="item in alldata" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <template>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="grid-content item-height"></div>
            </el-col>
            <el-col :span="21" style="padding:0 25px">
              <div>
                <el-form-item label="播放类型">
                  <el-button v-for="(it,index) in buttontype" @click="onOpenDate(index)" :key="index" :class="{'button':ind===index}" type="info">{{it.name}}</el-button>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="grid-content item-height"></div>
            </el-col>
            <el-col :span="21" style="padding:0 25px">
              <div v-show="showday">
                <el-form-item label="播放时间" prop="dayDate">
                  <el-time-picker value-format="HH:mm:ss" v-model="dayValue" @change="getDayTime" :editable="false" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
                  </el-time-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <div v-show="showweek" class="week-content">
            <div class="week-all">
              <el-form-item prop="weekDate" ref="dateWeekItem">
                <div class="week-picker" v-for="(pro,index) in blankbox" :key="index">
                  <el-form-item>
                    <span style="margin-right:23px;" :weekId="index+1">{{pro.dayOfWeek}}</span>
                    <el-time-picker value-format="HH:mm:ss" v-model="pro.weekValue" @change="getWeekTime" :editable="false" is-range range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
                    </el-time-picker>
                  </el-form-item>
                </div>
              </el-form-item>
            </div>
          </div>
        </template>
        <el-form-item class="item-footer">
          <el-button type="primary" @click="onSubmitForm('ruleForm')">保存</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getItemListData, postAddScheduleData, getScheduleByIdData, postEditorScheduleData, getChooseEquipmentData } from '../apis/index'
export default {
  name: 'material',
  props: {
    show: {
      type: Boolean,
      required: true,
      default () {
        return false
      }
    },
    senScheduleMessage: {
      type: String,
      required: true,
      default () {
        return ''
      }
    },
    isSchedule: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      options: [],
      disabled: false,
      selectValue: false,
      equipmentValue: '',
      getSenScheduleMessage: '',
      value88: [],
      alldata: [],
      ruleForm: {
        name: '',
        item: '',
        dayDate: '',
        weekDate: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入日程名称', trigger: 'blur' }
        ],
        item: [
          { required: true, message: '请选择节目', trigger: 'change' }
        ],
        dayDate: [
          { validator: this.validFormDayDate, trigger: 'change' }
        ],
        weekDate: [
          { validator: this.validFormWeekDate, trigger: 'change' }
        ]
      },
      weekId: '',
      dayOfWeek: '',
      begintime: '',
      endtime: '',
      input10: '',
      time: '',
      type: 'daily',
      ind: 0,
      showweek: false,
      showday: true,
      array: [],
      currentObj: '',
      value: '',
      blankbox: [{
        dayOfWeek: '星期一',
        id: '1',
        weekValue: null
      }, {
        dayOfWeek: '星期二',
        id: '2',
        weekValue: null
      }, {
        dayOfWeek: '星期三',
        id: '3',
        weekValue: null
      }, {
        dayOfWeek: '星期四',
        id: '4',
        weekValue: null
      }, {
        dayOfWeek: '星期五',
        id: '5',
        weekValue: null
      }, {
        dayOfWeek: '星期六',
        id: '6',
        weekValue: null
      }, {
        dayOfWeek: '星期日',
        id: '7',
        weekValue: null
      }],
      buttontype: [{
        name: '按日播放',
        id: '1'
      }, {
        name: '按周播放',
        id: '2'
      }],
      timedata: [{
        name: '星期一',
        id: '1'
      }, {
        name: '星期二',
        id: '2'
      }, {
        name: '星期三',
        id: '3'
      }, {
        name: '星期四',
        id: '4'
      }, {
        name: '星期五',
        id: '5'
      }, {
        name: '星期六',
        id: '6'
      }, {
        name: '星期日',
        id: '7'
      }],
      dayValue: null
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.onChooseEquipment()
        if (!this.isSchedule) {
          this.getSenScheduleMessage = this.senScheduleMessage
          this.getIdMessage()
          this.disabled = true
        } else {
          this.disabled = false
        }
      }
    }
  },
  methods: {
    // 选择节目列表
    handleChangeitem (value) {
      this.ruleForm.item = value
    },
    // 获取节目列表信息
    getItemLists () {
      getItemListData({ deviceId: this.equipmentValue })
        .then(res => {
          this.alldata = res.data.data
        }).catch(res => {
        })
    },
    changeValue (value) {
      console.log(value)
      console.log(this.equipmentValue)
      this.getItemLists()
    },
    // 节目获取主设备
    onChooseEquipment () {
      getChooseEquipmentData({ isOnline: true }).then(res => {
        if (res.data.code === '00000') {
          this.options = res.data.data
          if (res.data.data && res.data.data.length) {
            if (this.isSchedule) {
              this.equipmentValue = res.data.data[0].deviceID
            }
          }
          this.getItemLists()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 添加日程(表单提交)
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.isSchedule) {
            this.editorSche()
          } else {
            this.addSche()
          }
        } else {
          return false
        }
      })
    },
    // 根据id获取日程信息按周播放
    getIdMessage () {
      getScheduleByIdData({ id: this.getSenScheduleMessage }).then(res => {
        if (res.data.code === '00000') {
          this.ruleForm.name = res.data.data.scheduleName
          this.ruleForm.item = res.data.data.programNo
          this.equipmentValue = res.data.data.deviceId
          if (res.data.data.scheduleType === '按日播放') {
            this.ind = 0
            this.type = 'daily'
            this.showday = true
            this.showweek = false
            this.dayValue = res.data.data.dailySchedule.platspan
            if (res.data.data.dailySchedule.platspan) {
              this.ruleForm.dayDate = res.data.data.dailySchedule.platspan
            }
          } else {
            this.ind = 1
            this.type = 'weekly'
            this.showweek = true
            this.showday = false
            this.blankbox.forEach(el => {
              res.data.data.weekSchedule.forEach(elment => {
                if (el.dayOfWeek === elment.dayOfWeek) {
                  el.weekValue = elment.weekValue
                }
              })
            })
            this.blankbox.forEach(el => {
              if (el.weekValue) {
                this.ruleForm.weekDate = el.weekValue
              }
            })
          }
        } else {
          this.$message({
            showClose: true,
            message: '数据加载失败',
            type: 'error'
          })
        }
      }).catch(() => {
      })
    },
    // 重置按钮
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dayValue = null
      this.blankbox.forEach((ele) => {
        ele.weekValue = null
      })
      this.ruleForm.dayDate = ''
      this.ruleForm.weekDate = ''
      this.ruleForm.dateArr = []
    },
    // 添加日程
    addSche () {
      let param = {
        scheduleName: this.ruleForm.name,
        scheduleType: this.type,
        programNo: this.ruleForm.item,
        deviceId: this.equipmentValue,
        dailySchedule: {
          platspan: this.dayValue
        },
        weekSchedule: this.blankbox
      }
      postAddScheduleData(param).then(res => {
        this.$emit('showstate')
        if (res.data.code === '00000') {
          this.resetForm('ruleForm')
          this.dayValue = null
          this.blankbox.forEach(ele => {
            ele.weekValue = null
          })
          this.$message({
            message: '添加日程成功',
            type: 'success'
          })
          this.$emit('closeDialog')
        } else {
          this.$message.error('添加日程失败')
        }
      })
    },
    // 编辑日程
    editorSche () {
      let param = {
        scheduleId: this.getSenScheduleMessage,
        scheduleName: this.ruleForm.name,
        scheduleType: this.type,
        programNo: this.ruleForm.item,
        deviceId: this.equipmentValue,
        dailySchedule: {
          platspan: this.dayValue
        },
        weekSchedule: this.blankbox
      }
      postEditorScheduleData(param).then(res => {
        this.$emit('showstate')
        if (res.data.code === '00000') {
          this.resetForm('ruleForm')
          this.dayValue = null
          this.blankbox.forEach(ele => {
            ele.weekValue = null
          })
          this.$message({
            message: '修改日程成功',
            type: 'success'
          })
          this.$emit('closeDialog')
        } else {
          this.$message.error('修改日程失败')
        }
      })
    },
    // 点×关闭对话框
    closeEvent () {
      this.$emit('closeDialog')
      this.resetForm('ruleForm')
      this.ind = 0
      this.type = 'daily'
      this.showday = true
      this.showweek = false
    },
    // 获取按日播放时间
    getDayTime (time) {
      this.ruleForm.dayDate = time
      if (time && time.length !== 0) {
        if (this.ruleForm.dayDate[0] >= this.ruleForm.dayDate[1]) {
          this.ruleForm.dayDate = ''
          this.dayValue = null
          this.$message({
            message: '开始时间不能大于或等于结束时间',
            type: 'error'
          })
        } else {
          this.ruleForm.dayDate = time
        }
      }
    },
    // 获取按周播放时间
    getWeekTime (time) {
      let aaa = 0
      this.blankbox.forEach(el => {
        if (el.weekValue === null) {
          aaa++
        }
      })
      if (aaa === 7) {
        this.ruleForm.weekDate = ''
      }
      if (!time) return
      this.ruleForm.weekDate = time
      if (this.ruleForm.weekDate[0] >= this.ruleForm.weekDate[1]) {
        this.blankbox.forEach(el => {
          if (el.weekValue === this.ruleForm.weekDate) {
            el.weekValue = null
          }
        })
        this.$message({
          message: '开始时间不能大于结束时间',
          type: 'error'
        })
      } else {
        this.ruleForm.weekDate = time
      }
      this.$refs.dateWeekItem.onFieldChange()
    },
    // 显示和隐藏按日或按周播放按钮
    onOpenDate (index) {
      this.ind = index
      if (index === 0) {
        this.type = 'daily'
        this.showday = true
        this.showweek = false
      } else {
        this.type = 'weekly'
        this.showweek = true
        this.showday = false
      }
    },
    // 提交添加日程时的自定义属性,让按日播放的时间不能为空
    validFormDayDate (rule, value, callback) {
      if (this.ind === 0) {
        if (value) callback()
        else callback(new Error('请选择日期'))
      } else callback()
    },
    // 提交添加日程时的自定义属性,让按周播放的时间不能为空
    validFormWeekDate (rule, value, callback) {
      if (this.ind === 1) {
        if (value) callback()
        else callback(new Error('请至少选择一个日期'))
      } else callback()
    }
  }
}
</script>
<style lang="less" scoped>
.item-height {
  min-height: 10px;
}
.item-footer {
  text-align: center;
  margin-left: -100px;
}
.content {
  overflow: hidden;
  height: 300px;
}
.button {
  background-color: #409eff;
}
.week-content {
  margin-top: -10px;
  text-align: center;
  .week-all {
    height: auto;
    .week-picker {
      margin-bottom: 15px;
      width: 75%;
      text-align: right;
    }
  }
}
</style>
<style lang="less">
.custom-time {
  .demo-ruleForm {
    padding: 0 !important;
    .el-row {
      margin-bottom: 0 !important;
    }
  }
  .el-dialog--center .el-dialog__body {
    text-align: left;
  }
  .el-input.el-date-editor--daterange,
  .el-input__inner.el-date-editor--daterange,
  .el-input.el-date-editor--timerange,
  .el-input__inner.el-date-editor--timerange {
    width: 354px;
  }
  .equipment-choose {
    .el-form-item {
      .el-form-item__label {
        width: 120px !important;
      }
    }
  }
}
</style>
