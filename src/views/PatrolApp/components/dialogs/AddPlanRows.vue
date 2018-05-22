<template>
  <div class='add-plan-rows'>
    <el-dialog title="" :visible="show" width="50%" @close="closeEvent" class="add-one">
      <el-form :model="detailInfo" ref="detailInfo" :rules="rules">
        <el-form-item label="计划名称" label-width="100px" class="plan-name-one" id="plan-one" prop="planName">
          <el-input v-model="detailInfo.planName" @blur="checkName" auto-complete="off" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="路线" label-width="100px" class="plan-name-two" prop="paramName">
          <el-select placeholder="请选择巡查路线" v-model="detailInfo.paramName" @change="getValue">
            <el-option v-for='item in partolParams' :key='item.uuid' :label='item.paramName' :value='item.uuid'>{{item.paramName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" label-width="100px" class="plan-name-three" prop="startTime">
          <el-date-picker v-model="detailInfo.startTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" :editable="false" @change="getBegintTime" :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" label-width="100px" class="plan-name-four" prop="endTime">
          <el-date-picker v-model="detailInfo.endTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" :editable="false" @change="getEndTime" :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="巡更周期" label-width="100px" prop="checkWeeks">
          <el-checkbox :indeterminate="isIndeterminate" v-model="detailInfo.checkAll" @change="handleCheckAllChange(detailInfo.checkAll)">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="detailInfo.checkWeeks" @change="handleCheckedWeeksChange">
            <el-checkbox v-for="Week in Weeks" :label="Week" :key="Week">{{Week}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <h4 class="Period">巡查时段 </h4>
      <span>(开始时间早于当前时间的巡查班次将不会被生成)</span>
      <div class="checkPeriod">
        <span class="mustAdd">(请按顺序添加巡查时段，必填)</span>
        <el-button type="primary" @click.native.prevent="addRows" class="secondAdd">添加时段</el-button>
        <el-button type="primary" @click.native.prevent="handleClickDelete">全部清除</el-button>
        <div style="margin-top: 20px">
          <el-table ref="singleTable" :data="group" highlight-current-row style="width: 100%" :border="true" max-height="250" :rules="secondRules">
            <el-table-column type="index" label="序号" width="50">
            </el-table-column>
            <el-table-column label='开始时段' show-overflow-tooltip align='center' prop='startTime'>
              <template slot-scope='scope'>
                <el-time-picker v-model="group[scope.$index].startTime" :ref="'timePicker'+scope.$index" :clearable="false" @change="getStartTime(scope.$index)" value-format="HH:mm:ss" :editable='false'>
                </el-time-picker>
              </template>
            </el-table-column>
            <el-table-column label='结束时段' show-overflow-tooltip align='center' prop='endTime'>
              <template slot-scope='scope'>
                <el-input v-model="scope.row.endTime" class="lastTime" :disabled="true"></el-input>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120" align="center">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveEvent('detailInfo')" class="savePlan">保存</el-button>
        <el-button @click="closeEvent('detailInfo')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { postSavePlanData, getPatrolPiontIdData, getMakeSurePnData } from '../../apis/planChannel'
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
      detailInfo: {
        planName: '',
        startTime: '',
        timeTotal: '',
        checkAll: false,
        endTime: '',
        checkWeeks: []
      },
      firstparamId: '', // 第一次查询的id
      timeLong: '',
      optionValue: '',
      uuid: '',
      name: '',
      paramName: '',
      finishtime: '',
      isIndeterminate: true,
      Weeks: WeekOptions,
      dialogTableVisible: false,
      dialogFormVisible: false,
      startTime: '',
      endTime: '',
      partolParams: [],
      optionlist: [],
      tableData: [],
      group: [],
      handleTime: '',
      selectList: [],
      Hours: '',
      minutes: '',
      RealTimelong: '',
      changeHours: '',
      changeMinutes: '',
      timeTotal: '',
      startSecond: '',
      checkStart: '',
      addFlag: true,
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
        checkWeeks: [
          { required: true, message: '请选择巡更周期', trigger: 'change' }
        ]
      },
      secondRules: {
        startTime: [
          { required: true, message: '请选择时段的开始时间', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.pointId()
        setTimeout(() => {
          this.detailInfo.paramName = this.firstparamId
        }, 300)
      }
    }
  },
  methods: {
    // 失去焦点时验证计划名称
    checkName () {
      let param = {
        'planName': this.detailInfo.planName
      }
      getMakeSurePnData(param).then(res => {
        if (res.data.data === 1) {
          this.$message({
            message: '设置计划名称不能重复',
            type: 'error'
          })
          this.detailInfo.planName = ''
        }
      })
    },
    // 获取巡查参数
    getValue (value) {
      this.handleClickDelete()
      this.timeLong = this.partolParams.filter((rs) => { return rs.uuid === value })[0].timeLong
    },
    // 获取添加开始时间和开始时间拼接
    getStartTime (index) {
      let val = this.group[index].startTime
      if (this.detailInfo.paramName === '') {
        this.$message({
          message: '请先选择巡查路线！',
          type: 'warning'
        })
        return false
      }
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
          message: '开始时间不能大于结束时间，请重新选择',
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
          message: '开始时间不能大于结束时间，请重新选择',
          type: 'warning'
        })
        this.detailInfo.startTime = ''
      } else if (new Date(this.detailInfo.endTime).getTime() - new Date(value).getTime() > 90 * 24 * 60 * 60 * 1000) {
        this.$message({
          message: '开始时间到结束时间，计划范围不能超过90天！',
          type: 'warning'
        })
        this.detailInfo.startTime = ''
      }
    },
    // 添加、修改 保存
    saveEvent (detailInfo) {
      setTimeout(() => {
        if (this.detailInfo.planName.trim() && !/^[\u4e00-\u9fa50-9A-Za-z]+$/.test(this.detailInfo.planName.trim())) {
          this.$message({
            message: '输入姓名只能为中文、英文和数字,名称中间不能有空格',
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
    // 请求保存接口
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
      // let patrolPlanTimes = this.group
      let repeat = this.selectList.join(',')
      let param = {
        'paramId': this.detailInfo.paramName,
        'patrolPlanTimes': this.group,
        'planName': this.detailInfo.planName,
        'startTime': this.detailInfo.startTime,
        'endTime': this.detailInfo.endTime,
        'repeat': repeat,
        'timeLong': this.timeLong
      }
      // 保存
      postSavePlanData(param).then(res => {
        if (res.data.code === '00000') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$emit('closePlan1')
          this.cleanContent()
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 关闭后清除
    cleanContent () {
      this.group = []
      this.detailInfo.planName = ''
      this.detailInfo.paramName = ''
      this.detailInfo.startTime = ''
      this.detailInfo.endTime = ''
      this.detailInfo.checkWeeks = []
      this.detailInfo.checkAll = false
      this.startTime = ''
      this.endTime = ''
      this.repeat = ''
      this.paramName = ''
      this.selectList = []
      this.pointId()
    },
    // 取消
    closeEvent () {
      this.$emit('closePlan1')
      this.cleanContent()
      this.$refs['detailInfo'].resetFields()
      this.addFlag = true
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
    // 清除
    handleClickDelete () {
      this.group = []
    },
    // 删除行
    deleteRow (index, row) {
      this.group.splice(index, 1)
      this.addFlag = true
    },
    // 全选
    handleCheckAllChange (val) {
      if (val) {
        this.selectList = this.Weeks
      }
      this.detailInfo.checkWeeks = val ? WeekOptions : []
      this.isIndeterminate = false
    },
    handleCheckedWeeksChange (value) {
      if (value.length === 0) {
        this.selectList = []
      } else {
        this.selectList = value
      }
      let checkedCount = value.length
      this.checkAll = checkedCount === this.Weeks.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.Weeks.length
    },
    // 巡查点参数
    pointId () {
      let params = {
        'paramName': ''
      }
      getPatrolPiontIdData(params).then(res => {
        this.partolParams = res.data.data
      })
    }
  }
}
</script>
<style scoped lang='less'>
.add-plan-rows {
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
.add-plan-rows {
  .el-input.is-disabled .el-input__inner {
    background-color: #ffffff;
    border-color: #e4e7ed;
    color: #5e5e5e;
    cursor: not-allowed;
  }
}
</style>

