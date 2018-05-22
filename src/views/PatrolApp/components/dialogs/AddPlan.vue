<template>
  <div class='add-plan'>
    <el-dialog title='' :visible='show' width='50%' @close='closeEvent' class='add-one'>
      <el-form :model='detailInfo' :rules="rules" ref="detailInfo" class="demo-ruleForm">
        <el-form-item label='计划名称' label-width='100px' class='plan-name-one' id='plan-one' prop="planName">
          <el-input v-model.trim='detailInfo.planName' @blur="checkName" auto-complete='off' :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label='路线' label-width='100px' class='plan-name-two' prop="paramName">
          <el-select placeholder='请选择巡查路线' v-model='detailInfo.paramName' @click="pointId" @change='getValue' @focus="changeLoad" :disabled="true">
            <el-option v-for='item in partolParams' :key='item.uuid' :label='item.paramName' :value='item.uuid'>{{item.paramName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='开始时间' label-width='100px' class='plan-name-three' prop="startTime">
          <el-date-picker v-model='detailInfo.startTime' value-format='yyyy-MM-dd' type='date' :editable="false" @change="getBegintTime" :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item label='结束时间' label-width='100px' class='plan-name-four' prop="endTime">
          <el-date-picker v-model='detailInfo.endTime' value-format='yyyy-MM-dd' type='date' :editable="false" @change="getEndTime" :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <el-form-item label='巡更周期' label-width='100px' prop="repeat">
          <el-checkbox :indeterminate='isIndeterminate' v-model='detailInfo.checkAll' @change="handleCheckAllChange">全选</el-checkbox>
          <div style='margin: 15px 0;'></div>
          <el-checkbox-group v-model='detailInfo.repeat' @change='handleCheckedWeeksChange'>
            <el-checkbox v-for='Week in Weeks' :label='Week' :key='Week'>{{Week}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <h4 class='Period'>巡查时段 </h4>
      <span>(开始时间早于当前时间的巡查班次将不会被生成)</span>
      <div class='checkPeriod'>
        <!-- <span class="mustAdd">(请按顺序添加巡查时段，必填)</span>
        <el-button type="primary" @click.native.prevent="addRows" class="secondAdd">添加时段</el-button>
        <el-button type="primary" @click.native.prevent="handleClickDelete">全部清除</el-button> -->
        <div style='margin-top: 20px' class=''>
          <el-table ref='singleTable' :data='group' highlight-current-row style='width: 100%' :border='true' max-height="250">
            <el-table-column type='index' label='序号' width='50'>
            </el-table-column>
            <el-table-column label='开始时段' show-overflow-tooltip align='center'>
              <template slot-scope='scope'>
                <el-time-picker v-model="group[scope.$index].startTime" :ref="'timePicker'+scope.$index" :clearable="false" @change='getStartBegin(scope.$index)' value-format="HH:mm:ss" :editable='false' :placeholder='staticData.placeholderBeign' :disabled="true">
                </el-time-picker>
              </template>
            </el-table-column>
            <el-table-column label='结束时段' show-overflow-tooltip align='center' fixed='right'>
              <template slot-scope='scope'>
                <el-input v-model="scope.row.endTime" class="lastTime" :disabled="true"></el-input>
              </template>
            </el-table-column>
            <!-- <el-table-column fixed='right' label='操作' width='120' align='center'>
              <template slot-scope='scope'>
                <el-button @click.native.prevent='deleteRow(scope.$index, scope.row)' type='text' size='small'>
                  移除
                </el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
      </div>
      <div slot='footer' class='dialog-footer'>
        <!-- <el-button type='primary' @click="saveEvent('detailInfo')" class='savePlan'>保存</el-button> -->
        <el-button @click='closeEvent' type='primary'>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getPatrolPiontIdData, getPersonPlanData, postRenewPlanData, getMakeSurePnData } from '../../apis/planChannel'
const WeekOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default () {
        return false
      }
    },
    selectMessege: {
      type: String,
      default: ''
    }
  },
  data () {
    // 计划名称正则
    let plannameCheck = (rule, value, callback) => {
      if (this.detailInfo.planName.trim() && !/^[\u4e00-\u9fa50-9A-Za-z]+$/.test(this.detailInfo.planName.trim())) {
        callback(new Error('输入只能为中文、英文和数字,名称中间不能有空格'))
      } else {
        callback()
      }
    }
    return {
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        }
      },
      pickerOptions2: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        }
      },
      saveFlag: true,
      staticData: {
        placeholderBeign: ''
      },
      firstparamId: '', // 第一次查询的id
      timeLong: '',
      optionValue: '',
      courtUuid: '',
      uuid: '',
      name: '',
      paramName: '',
      finishtime: '',
      checkAll: false,
      isIndeterminate: true,
      Weeks: WeekOptions,
      dialogTableVisible: false,
      dialogFormVisible: false,
      detailInfo: {
        planName: '',
        paramName: '',
        startTime: '',
        endTime: '',
        checkAll: [],
        repeat: []
      },
      partolParams: [],
      optionlist: [],
      tableData: [],
      group: [],
      selectList: [],
      startTime: '',
      timeTotal: '',
      Hours: '',
      minutes: '',
      RealTimelong: '',
      changeHours: '',
      changeMinutes: '',
      endTime: '',
      startSecond: '',
      checkStart: '',
      vsinfo: '',
      rules: {
        planName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { validator: plannameCheck }
        ],
        paramName: [
          { required: true, message: '请选择路线', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        repeat: [
          { required: true, message: '请选择巡更周期', trigger: 'change' }
        ]
      },
      addFlag: true
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.uuid = this.selectMessege ? this.selectMessege : ''
        if (this.uuid) {
          this.pointId()
          this.queryMessege()
          setTimeout(() => {
            this.detailInfo.paramName = this.firstparamId
          }, 300)
        }
      }
    }
  },
  methods: {
    // 失去焦点时验证计划名称
    checkName () {
      let param = {
        'planName': this.detailInfo.planName,
        'uuid': this.uuid
      }
      if (this.vsinfo !== this.detailInfo.planName) {
        getMakeSurePnData(param).then(res => {
          if (res.data.data === 1) {
            this.$message({
              message: '计划名称不能重复',
              type: 'error'
            })
            this.detailInfo.planName = ''
          }
        })
      }
    },
    // 路线失去焦点提示
    changeLoad () {
      this.$message({
        message: '改变路线后，重新设置时段！',
        type: 'warning'
      })
    },
    // 巡查点参数
    pointId () {
      let params = {
        'paramName': ''
      }
      getPatrolPiontIdData(params).then(res => {
        this.partolParams = res.data.data
      })
    },
    // 获取巡查参数
    getValue (value) {
      this.handleClickDelete()
      this.timeLong = this.partolParams.filter((rs) => { return rs.uuid === value })[0].timeLong
    },
    getStartBegin (index) {
      let val = this.group[index].startTime
      if (!this.timeLong) {
        this.$message.error('请选择路线')
        return false
      }
      if (!val) {
        this.$message.error('请选择开始时段')
        return false
      }
      let len = this.group.length
      if (len > 1 && index > 0) {
        if (val < this.group[index - 1].endTime) {
          this.$message.error('开始时间不能小于上次结束时间，请重新选择')
          return false
        }
      }
      this.$set(this.group, index, { startTime: val, endTime: this.countEndTime(val) })
      // 如果修改的时间段不是最后一个时，才需要更新剩下的时间段的赋值
      if (index < len - 1) {
        this.updateTimeSeperate(index + 1)
      }
      this.saveFlag = true
    },
    // 更新时间间隔
    updateTimeSeperate (curIndex) {
      let len = this.group.length
      for (let index = curIndex; index < len; index++) {
        if (!this.addFlag) {
          this.group.length = index
          break
        }
        let curStartTime = this.group[index - 1].endTime
        this.$set(this.group, index, { startTime: curStartTime, endTime: this.countEndTime(curStartTime) })
      }
    },
    // 计算结束时间
    countEndTime (val) {
      let timeLong = this.timeLong ? this.timeLong : ''
      let Temps = val.split(':')
      Temps[0] = Temps[0] === '24' ? '0' : Temps[0]
      let all = 60 * Number(Temps[0]) + Number(Temps[1]) + parseInt(timeLong)
      let min = (all % 60)
      let h = Math.floor(all / 60)
      let s = Temps[2]
      // 需要重置下添加时间段的flag
      this.addFlag = true
      if (h < 10) {
        h = '0' + h.toString()
      } else if (h < 24) {
        h = h.toString()
      } else {
        h = (h - 24 < 10 ? '0' : '') + (h - 24).toString()
        this.addFlag = false
      }
      min = min > 9 ? min.toString() : '0' + min.toString()
      return h + ':' + min + ':' + s
    },
    // 开始时间不能大于结束时间，请重新选择
    getEndTime (value) {
      if (this.detailInfo.startTime && this.detailInfo.startTime > value) {
        this.$message({
          message: '开始时间不能大于结束时间，请重新选择结束时间',
          type: 'warning'
        })
        this.detailInfo.endTime = ''
      } else if (new Date(value).getTime() - new Date(this.detailInfo.startTime).getTime() > 90 * 24 * 60 * 60 * 1000) {
        this.$message({
          message: '开始时间到结束时间，计划范围不能超过90天！',
          type: 'warning'
        })
        this.detailInfo.endTime = ''
      }
    },
    // 结束时间不能小于开始时间，请重新选择
    getBegintTime (value) {
      if (this.detailInfo.endTime && this.detailInfo.endTime < value) {
        this.$message({
          message: '开始时间不能大于结束时间，请重新选择结束时间',
          type: 'warning'
        })
        this.detailInfo.endTime = ''
      } else if (new Date(this.detailInfo.endTime).getTime() - new Date(value).getTime() > 90 * 24 * 60 * 60 * 1000) {
        this.$message({
          message: '开始时间到结束时间，计划范围不能超过90天！',
          type: 'warning'
        })
        this.detailInfo.startTime = ''
      }
    },
    // 获取个人排班信息详情!
    queryMessege () {
      getPersonPlanData({ id: this.uuid }).then(rs => {
        if (rs.data.code === '00000') {
          this.vsinfo = rs.data.data.planName
          this.selectList = rs.data.data.repeat.split(',')
          this.group = []
          this.firstparamId = rs.data.data.paramId
          rs.data.data.patrolPlanTimes.forEach(item => {
            this.group.push({ startTime: item.startTime, endTime: item.endTime })
          })
          this.detailInfo.paramName = rs.data.data.patrolParam.paramName
          this.timeLong = rs.data.data.patrolParam.timeLong
          this.$nextTick(() => {
            this.detailInfo = Object.assign(rs.data.data, {
              planName: rs.data.data.planName,
              startTime: rs.data.data.startTime,
              endTime: rs.data.data.endTime,
              // paramName: rs.data.data.patrolParam.paramName,
              paramName: rs.data.data.patrolParam.uuid,
              repeat: rs.data.data.repeat.split(',')
            })
          })
        } else {
          this.detailInfo = {}
        }
      }).catch(res => {
        console.log(res)
      })
    },
    // 增加时间段
    addRows () {
      if (this.group.length === 0) {
        this.saveFlag = true
      }
      this.checkNull()
      let length = this.group.length
      if (length) {
        if (!this.group[0].startTime && length >= 1) {
          this.addFlag = false
          this.saveFlag = false
          this.$message.error('请先配置完前面的时段！')
        } else if (!this.saveFlag) {
          this.$message.error('请先配置完前面的时段！')
        } else if (this.addFlag) {
          this.saveFlag = true
          let startTime = this.countEndTime(this.group[length - 1].startTime)
          let endTime = this.countEndTime(startTime)
          this.group.push({ 'startTime': startTime, 'endTime': endTime })
        } else {
          this.$message.error('这一天的任务，24小时已超出，请设置下一天任务！')
          return false
        }
      } else {
        this.group.push({ 'startTime': '', 'endTime': '' })
      }
    },
    // 添加、修改 保存
    saveEvent (detailInfo) {
      setTimeout(() => {
        if (this.detailInfo.planName.trim() && !/^[\u4e00-\u9fa50-9A-Za-z]+$/.test(this.detailInfo.planName.trim())) {
          this.$message({
            message: '输入只能为中文、英文和数字,名称中间不能有空格',
            type: 'warning'
          })
          this.detailInfo.planName = ''
          return false
        }
        this.$refs['detailInfo'].validate((valid) => {
          if (valid) {
            this.saveData()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }, 500)
    },
    //  保存及请求保存接口
    saveData () {
      this.checkNull()
      if (this.group.length === 0) {
        this.$message({
          message: '请添加时段',
          type: 'warning'
        })
        return false
      }
      if (!this.group[0].startTime) {
        this.$message({
          message: '开始时段不能为空',
          type: 'warning'
        })
        return false
      }
      if (!this.saveFlag) {
        this.$message.error('请先配置完整前面的时段！')
        return false
      }
      let repeat = this.selectList.join(',')
      let param = {
        'uuid': this.uuid,
        'paramId': this.detailInfo.paramName,
        'patrolPlanTimes': this.group,
        'planName': this.detailInfo.planName,
        'startTime': this.detailInfo.startTime,
        'endTime': this.detailInfo.endTime,
        'repeat': repeat,
        'timeLong': this.timeLong
      }
      // 修改
      postRenewPlanData(param).then(res => {
        if (res.data.code === '00000') {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$emit('closePlan')
          this.cleanContent()
          this.$refs['detailInfo'].resetFields()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 取消
    closeEvent () {
      this.$emit('closePlan')
      this.cleanContent()
      this.$refs['detailInfo'].resetFields()
      this.addFlag = true
    },
    // 关闭后清除
    cleanContent () {
      this.group = []
      this.detailInfo.planName = ''
      this.detailInfo.startTime = ''
      this.detailInfo.endTime = ''
      this.detailInfo.checkedWeeks = []
      this.paramName = ''
    },
    // 判断开始时间是否有空
    checkNull () {
      this.group.forEach(item => {
        if (!item.startTime) {
          this.saveFlag = false
          return false
        }
      })
    },
    // 清除
    handleClickDelete () {
      this.group = []
      this.addFlag = true
    },
    // 删除行
    deleteRow (index, row) {
      if (index === this.group.length - 1) {
        this.addFlag = true
      }
      this.group.splice(index, 1)
    },
    // 全选
    handleCheckAllChange (val) {
      this.selectList = val ? this.Weeks : []
      this.detailInfo.repeat = val ? WeekOptions : []
      this.isIndeterminate = false
    },
    // 选择
    handleCheckedWeeksChange (value) {
      if (value.length === 0) {
        this.selectList = []
      } else {
        this.selectList = value
      }
      let checkedCount = value.length
      this.checkAll = checkedCount === this.Weeks.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.Weeks.length
    }
  }
}
</script>
<style scoped lang='less'>
.add-plan {
  .add-one {
    height: 100%;
  }
  .plan-name {
    width: 35%;
  }
  .plan-name-one {
    display: inline-block;
    margin-right: 10%;
  }
  .plan-name-two {
    display: inline-block;
  }
  .plan-name-three {
    display: inline-block;
    margin-right: 9.5%;
    margin-top: 1%;
  }
  .plan-name-four {
    display: inline-block;
    margin-top: 1%;
  }
  .dialog-footer {
    text-align: center;
  }
  .Period {
    padding-left: 3.5%;
    float: left;
    padding-right: 1.5%;
  }
  .el-button el-button--primary {
    float: right;
    padding-right: 5%;
  }
  .secondAdd {
    margin-left: 75%;
  }
  .checkPeriod {
    max-height: 40%;
  }
  .mustAdd {
    display: inline;
    margin-left: 50%;
    color: red;
  }
  .secondAdd {
    margin-left: 1%;
  }
  .lastTime {
    width: 200px;
    height: 40px;
  }
}
</style>
<style lang='less'>
.add-plan {
  .el-input.is-disabled .el-input__inner {
    background-color: #ffffff;
    border-color: #e4e7ed;
    color: #5e5e5e;
    cursor: not-allowed;
  }
}
</style>
