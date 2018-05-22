<template>
  <div class="timeout">
    <!-- 横线 + 上半 -->
    <div>
      <el-form :inline="true" :model="TimeoutQuery" class="demo-form-inline">
        <!-- 第一行 -->
        <el-row class="headStyle">
          <!-- 第一列 -->
          <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
            <el-form-item label="人 员" label-width="70px">
              <el-select v-model="TimeoutQuery.userId" filterable placeholder="请选择人员" @focus="addGetName">
                <el-option v-for="item in personList" :key="item.uuid" :label="item.name" :value="item.uuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 第二列 -->
          <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
            <el-form-item label="任 务" label-width="70px">
              <el-input v-model="TimeoutQuery.taskName" placeholder="请输入任务" :maxlength="32"></el-input>
            </el-form-item>
          </el-col>
          <!-- 第三列 -->
          <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
            <el-form-item>
              <el-button type="primary" @click="getDate">查 询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row class="twoHeadStyle">
          <!-- 第一列 -->
          <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
            <el-form-item label="设 备" label-width="70px">
              <el-select v-model="TimeoutQuery.deviceId" filterable placeholder="请选择设备" @focus="addTaskName">
                <el-option v-for="item in taskList" :key="item.deviceID" :label="item.deviceName" :value="item.deviceID">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 第二列 -->
          <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
            <el-form-item label="报警时间" label-width="70px">
              <el-date-picker v-model="TimeoutQuery.beginDate" type="date" value-format="yyyy-MM-dd" @change="getBegintTime" :placeholder='placeBegin' :editable="false">
              </el-date-picker>
            </el-form-item>
            <el-form-item label='到' label-width="26px">
              <el-date-picker v-model="TimeoutQuery.endDate" type="date" value-format="yyyy-MM-dd" :placeholder='placeEnd' @change="getEndTime" :editable="false">
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
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" border>
        <el-table-column label="序号" prop="index" type="index" align="center" header-align="center" width="50"></el-table-column>
        <el-table-column label="报警时间" prop="planTime" align="center" header-align="center"></el-table-column>
        <el-table-column label="人员" prop="userName" align="center" header-align="center"> </el-table-column>
        <el-table-column label="设备" prop="deviceName" align="center" header-align="center"> </el-table-column>
        <el-table-column label="任务" prop="taskName" align="center" header-align="center"></el-table-column>
        <el-table-column label="预警" prop="pointStatusDetail" align="center" header-align="center" type="text">
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div v-show="tableData.length">
        <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" align='center' :current-page="current.pageNo" :page-sizes="[10,20,30]" :page-size="current.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="current.total" style="margin-top:15px"></el-pagination>
      </div>
      <!-- 分页 END -->
    </div>
    <!-- END -->
  </div>
</template>
<script>
// 引入ajax请求的index
import { getTimeoutAlarmEventData, getNameData, getTaskNameData } from './apis/eventHandler'
// 子组件的注册
export default {
  components: {
  },
  // 定义数据
  data () {
    return {
      placeBegin: 'placeBegin',
      placeEnd: 'placeEnd',
      uuid: '',
      showaddDialog: false,                      // 弹框显示控制
      TimeoutQuery: {                            // 查询请求参数
        taskName: '',                            // 任务名
        userId: '',                              // 用户id
        beginDate: new Date(),                   // 查询起始时间
        endDate: new Date(),                     // 查询结束时间
        deviceId: ''                             // 设备id
      },
      current: {                                 // table分页
        pageNo: 1,                               // 当前页
        pageSize: 10,                            // 每页条数
        total: 0                                 // 数据总计条数
      },
      multipleSelection: [],                     // table中的change事件
      tableData: [],                             // table渲染字段
      timeoutAlarmEvent: 'timeoutAlarmEvent',    // 区分弹框组件中是那个页面的内容
      personList: [],                            // 人员姓名下拉框渲染字段
      taskList: []                               // 设备选择下拉框
    }
  },
  // 选择期日重置更新
  updated () {
    this.placeBegin = '开始日期'
    this.placeEnd = '结束日期'
  },
  // 页面加载时加载
  mounted () {
    this.getDate()
  },
  // 定义方法
  methods: {
    // ajax 初始请求
    getDate () {
      // 传入的参数  parameter： pageSize pageNo taskName beginDate deviceId inStatus
      let params = {
        'pageSize': this.current.pageSize,
        'pageNo': this.current.pageNo,
        'taskName': this.TimeoutQuery.taskName,
        'userId': this.TimeoutQuery.userId,
        'beginDate': this.TimeoutQuery.beginDate,
        'endDate': this.TimeoutQuery.endDate,
        'deviceId': this.TimeoutQuery.deviceId,
        'inStatus[0]': 2,
        'inStatus[1]': 3,
        'inStatus[2]': 4
      }
      getTimeoutAlarmEventData(params).then(rs => {
        if (rs.status === 200) {
          // 数据
          this.tableData = rs.data.data.rows
          // 数据总条数
          this.current.total = rs.data.data.total
        } else {
          this.data = []
        }
      })
    },
    // 结束时间不能小于开始时间，请重新选择
    getBegintTime (beginIsTime) {
      if (this.TimeoutQuery.endDate && this.TimeoutQuery.endDate < beginIsTime) {
        this.$message({
          message: '开始时间不能大于结束时间，请重新选择',
          time: 3,
          type: 'warning'
        })
        this.TimeoutQuery.endDate = ''
      }
    },
    // 开始时间不能大于结束时间，请重新选择
    getEndTime (endIsTime) {
      if (this.TimeoutQuery.beginDate && this.TimeoutQuery.beginDate > endIsTime) {
        this.$message({
          message: '开始时间不能大于结束时间，请重新选择',
          time: 3,
          type: 'warning'
        })
        this.TimeoutQuery.beginDate = ''
      }
    },
    // 人员姓名下拉框
    addGetName () {
      getNameData().then(rs => {
        if (rs.data.code === '00000') {
          this.personList = rs.data.data
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
    },
    // 分页
    handleSizeChange (val) {
      // 每页显示几条
      this.current.pageSize = val
      this.getDate()
    },
    // 当前页数
    handleCurrentChange (val) {
      this.current.pageNo = val
      this.getDate()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    //  重置按钮
    closeQuery () {
      this.TimeoutQuery.taskName = ''
      this.TimeoutQuery.userId = ''
      this.TimeoutQuery.beginDate = ''
      this.TimeoutQuery.endDate = ''
      this.TimeoutQuery.deviceId = ''
      this.placeBegin = '开始日期'
      this.placeEnd = '结束日期'
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
.timeout {
  .el-table > .el-table__body-wrapper {
    overflow-x: hidden !important;
  }
}
</style>