<template>
  <div class="boundaryAlarm">
    <!-- 横线 + 上半 -->
    <div>
      <el-form :inline="true" :model="BoundaryQuery" class="demo-form-inline">
        <!-- 第一行 -->
        <el-row class="headStyle">
          <!-- 第一列 -->
          <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
            <el-form-item label="人 员" label-width="70px" class="security-select">
              <el-select v-model="BoundaryQuery.userId" filterable placeholder="请选择人员" @focus="addGetName">
                <el-option v-for="item in users" :key="item.uuid" :label="item.name" :value="item.uuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 第二列 -->
          <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
            <el-form-item label="任 务" label-width="70px">
              <el-input v-model="BoundaryQuery.taskName" placeholder="请输入任务" :maxlength="32"></el-input>
            </el-form-item>
          </el-col>
          <!-- 第三列 -->
          <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
            <el-form-item>
              <el-button type="primary" @click="addBoundaryAlarmEvent">查 询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row class="twoHeadStyle">
          <!-- 第一列 -->
          <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
            <el-form-item label="设 备" label-width="70px">
              <el-select v-model="BoundaryQuery.deviceId" filterable placeholder="请选择设备" @focus="addTaskName">
                <el-option v-for="item in taskList" :key="item.deviceID" :label="item.deviceName" :value="item.deviceID">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 第二列 -->
          <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
            <el-form-item label="报警时间" label-width="70px">
              <el-date-picker v-model="BoundaryQuery.beginTime" type="date" value-format="yyyy-MM-dd" @change="getBegintTime" :placeholder='placeBegin' :editable="false">
              </el-date-picker>
            </el-form-item>
            <el-form-item label='到' label-width="26px">
              <el-date-picker v-model="BoundaryQuery.endTime" type="date" value-format="yyyy-MM-dd" :placeholder='placeEnd' @change="getEndTime" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 第三列 -->
          <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
            <el-form-item>
               <el-button type="primary" @click="closeQuery">重 置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- END -->
    <!-- 表格 -->
    <div>
      <el-table ref="multipleTable" :data="BoundaryData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" border>
        <el-table-column label="序号" prop="index" type="index" align="center" header-align="center" width="50"></el-table-column>
        <el-table-column label="报警时间" prop="happenTime" align="center" header-align="center"></el-table-column>
        <el-table-column label="人员" prop="userName" align="center" header-align="center"> </el-table-column>
        <el-table-column label="设备" prop="deviceName" align="center" header-align="center"> </el-table-column>
        <el-table-column label="任务" prop="taskName" align="center" header-align="center"></el-table-column>
        <el-table-column label="原因" prop="reason" align="center" show-overflow-tooltip header-align="center"></el-table-column>
        <el-table-column label="预警" prop="alarmStatusDetail" align="center" header-align="center" type="text">
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div v-show="BoundaryData.length">
        <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" align='center' :current-page="current.pageNo" :page-sizes="[10,20,30]" :page-size="current.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="current.total" style="margin-top:15px"></el-pagination>
      </div>
      <!-- 分页 END -->
    </div>
    <!-- END 表格 -->
  </div>
</template>
<script>
// 引入ajax请求的index
import { getBoundaryAlarmEventData, getNameData, getTaskNameData } from './apis/eventHandler'
// 定义组件
export default {
  components: {
  },
  // 注册数据
  data () {
    return {
      placeBegin: 'placeBegin',
      placeEnd: 'placeEnd',
      users: [],                          // 人员列表下拉框渲染
      taskList: [],                       // 设备选择下拉框渲染
      BoundaryQuery: {                    // 查询请求渲染字段
        taskName: '',                     // 任务名称
        userId: '',                       // 用户id
        beginTime: new Date(),            // 起始时间
        endTime: new Date(),              // 结束时间
        deviceId: ''                      // 设备id
      },
      current: {                          // table分页
        pageNo: 1,                        // 页数
        pageSize: 10,                     // 条数
        total: 0                          // 总数
      },
      multipleSelection: [],              // table中change事件
      BoundaryData: []                    // table渲染字段
    }
  },
  // 选择期日重置更新
  updated () {
    this.placeBegin = '开始日期'
    this.placeEnd = '结束日期'
  },
  // 页面加载执行
  mounted () {
    this.addBoundaryAlarmEvent()
  },
  methods: {
    // 页面加载ajax 请求
    addBoundaryAlarmEvent () {
      // 参数：当前页  下一页 任务名 用户ID 开始时间 结束时间 设备ID
      let params = {
        'pageSize': this.current.pageSize,
        'pageNo': this.current.pageNo,
        'taskName': this.BoundaryQuery.taskName,
        'userId': this.BoundaryQuery.userId,
        'beginDate': this.BoundaryQuery.beginTime,
        'endDate': this.BoundaryQuery.endTime,
        'deviceId': this.BoundaryQuery.deviceId
      }
      getBoundaryAlarmEventData(params).then(rs => {
        if (rs.status === 200) {
          this.BoundaryData = rs.data.data.rows
          this.current.total = rs.data.data.total
        } else {
          this.data = []
        }
      })
    },
    // 结束时间不能小于开始时间，请重新选择
    getBegintTime (beginIsTime) {
      if (this.BoundaryQuery.endTime && this.BoundaryQuery.endTime < beginIsTime) {
        this.$message({
          message: '开始时间不能大于结束时间，请重新选择',
          time: 3,
          type: 'warning'
        })
        this.BoundaryQuery.endTime = ''
      }
    },
    // 开始时间不能大于结束时间，请重新选择
    getEndTime (endIsTime) {
      if (this.BoundaryQuery.beginTime && this.BoundaryQuery.beginTime > endIsTime) {
        this.$message({
          message: '开始时间不能大于结束时间，请重新选择',
          time: 3,
          type: 'warning'
        })
        this.BoundaryQuery.beginTime = ''
      }
    },
    // 每页显示几条
    handleSizeChange (val) {
      this.current.pageSize = val
      this.addBoundaryAlarmEvent()
    },
    // 当前页数
    handleCurrentChange (val) {
      this.current.pageNo = val
      this.addBoundaryAlarmEvent()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    //  重置按钮
    closeQuery () {
      this.BoundaryQuery.taskName = ''
      this.BoundaryQuery.userId = ''
      this.BoundaryQuery.beginTime = ''
      this.BoundaryQuery.endTime = ''
      this.BoundaryQuery.deviceId = ''
      this.placeBegin = '开始日期'
      this.placeEnd = '结束日期'
    },
    // 人员姓名下拉框
    addGetName () {
      getNameData().then(rs => {
        if (rs.data.code === '00000') {
          this.users = rs.data.data
        } else {
          this.data = []
        }
      })
    },
    // 设备选择下拉框
    addTaskName () {
      getTaskNameData().then(rs => {
        if (rs.data.code === '00000') {
          this.taskList = rs.data.data
        } else {
          this.data = []
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.headStyle {
  margin-top: 30px;
  margin-bottom: 20px;
}
.twoHeadStyle {
  margin-top: 20px;
  margin-bottom: 20px;
}
.clickStyle {
  color: blue;
  cursor: pointer;
}
</style>
<style lang="less">
.boundaryAlarm {
  .el-table > .el-table__body-wrapper {
    overflow-x: hidden !important;
  }
}
</style>