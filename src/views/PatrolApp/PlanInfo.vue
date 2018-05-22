<template>
  <div class="PlanInfo">
    <div class="PlanInfo-one">
      <el-form label-width="80px " class="form-one">
        <el-form-item label="路线">
          <el-select placeholder="请选择巡查路线" v-model="paramName" @change='getValue'>
            <el-option v-for="item in partolParams" :key="item.uuid" :label="item.paramName" :value="item.uuid" class="item.timeLong"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form label-width="120px " class="form-four">
        <el-form-item label="开始时间">
          <el-date-picker v-model="beginDate" value-format="yyyy-MM-dd" type="date" :placeholder="placeholderData" @change='getBegintTime' :editable="false">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-form label-width="40px " class="form-five">
        <el-form-item label="到 ">
          <el-date-picker v-model="endDate" value-format="yyyy-MM-dd" type="date" :placeholder="placeholderData" @change='getEndTime' :editable="false">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="button-one" @click="queryList">查询</el-button>
      <el-button type="primary" class="button-two" @click="resetPerson">重置</el-button>
    </div>
    <div class="PlanInfo-three">
      <el-table ref="multipleTable" :data="data" tooltip-effect="dark" class="table" :border="true" @selection-change="handleSelectionChange">
        <el-table-column type="index" prop="date" label="序号" width="120" align="center">
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="patrolParam.paramName" label="路线" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="deviceName" label="设备" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class='pages-crew' v-show="data.length">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageData.pageNo" :page-sizes="[10, 20, 30]" :page-size="pageData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageData.total">
      </el-pagination>
    </div>
  </div>
</template> 
<script>
import { getInfoPlanData, getPatrolPiontIdData } from './apis/planChannel'
export default {
  data () {
    return {
      placeholderData: 'placeholderData',
      data: [],
      optionValue: '',
      paramName: '',
      pageData: {
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      planData: [],
      pointList: [],
      partolParams: [],
      paramId: '',
      Id: '',
      userId: '',
      beginDate: new Date(),
      endDate: new Date(),
      deviceName: ''
    }
  },
  created () {
  },
  updated () {
    this.placeholderData = '选择日期'
  },
  mounted () {
    this.queryList()
    this.pointId()
  },
  methods: {
    getValue (value) {
      this.optionValue = value
      this.partolParams.forEach(value => {
        // 获取巡查参数的时间段
        if (this.optionValue === value.uuid) {
          this.timeLong = value.timeLong
        }
      })
    },
    // 结束时间不能小于开始时间，请重新选择
    getBegintTime (value) {
      if (value === null) {
        this.$message({
          message: '请尽量选择一个开始日期',
          type: 'warning'
        })
        return false
      } else if (this.endDate && new Date(this.endDate) < new Date(value)) {
        this.$message({
          message: '开始时间不能大于结束时间，请重新选择',
          type: 'warning'
        })
        this.endDate = ''
      }
    },
    // 开始时间不能大于结束时间，请重新选择
    getEndTime (value) {
      if (value === null) {
        this.$message({
          message: '请尽量选择一个结束时间',
          type: 'warning'
        })
        return false
      } else if (this.beginDate && new Date(this.beginDate) > new Date(value)) {
        this.$message({
          message: '开始时间不能大于结束时间，请重新选择',
          type: 'warning'
        })
        this.beginDate = ''
      }
    },
    // 查询
    queryList () {
      let params = {
        'pageNo': this.pageData.pageNo,
        'pageSize': this.pageData.pageSize,
        'taskStatus': this.taskStatus,
        'planName': '',
        'beginDate': this.beginDate,
        'endDate': this.endDate,
        'paramId': this.paramName,
        'userId': this.userId,
        'startTime': this.startTime,
        'deviceName': this.deviceName
      }
      getInfoPlanData(params).then(rs => {
        if (rs.data.code === '00000') {
          this.data = rs.data.data.rows
          this.pageData.total = rs.data.data.total
        } else {
          this.data = []
        }
      })
    },
    // 巡查路线
    pointId () {
      let params = {
        'paramName': ''
      }
      getPatrolPiontIdData(params).then(res => {
        if (res.data.code === '00000') {
          this.partolParams = res.data.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 重置
    resetPerson () {
      this.pageData.pageNo = 1
      this.beginDate = null
      this.endDate = null
      this.paramName = ''
      this.placeholderData = '选择日期'
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.pageData.pageSize = val
      this.queryList()
      this.pointId()
      console.log('测试' + this.data)
    },
    handleCurrentChange (val) {
      this.pageData.pageNo = val
      this.queryList()
      this.pointId()
    },
    showstate (mstate) {
    },
    updated () {
    }
  }
}
</script>
<style scoped lang='less'>
.PlanInfo {
  margin-top: 2%;
  padding-bottom: 3%;
  .form-one {
    display: inline-block;
    margin-right: 4%;
  }
  .form-four {
    display: inline-block;
  }
  .form-five {
    display: inline-block;
    margin-right: 4%;
  }
  .PlanInfo-two {
    padding: 1% 0;
  }
  .PlanInfo-three {
    margin-top: 20px;
  }
  .button-one {
    margin-left: 2%;
    margin-right: 3.5%;
  }
  .pages-crew {
    text-align: center;
    padding-top: 1%;
  }
}
</style>
<style lang='less'>
.PlanInfo-three {
  .el-table__body-wrapper {
    overflow-x: hidden;
  }
}
@import url("./assets/css/common.less");
</style>
 

