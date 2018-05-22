<template>
  <div class="emergency">
    <!-- 横线 + 上半 -->
    <div>
      <el-form :inline="true" :model="EmergencyQuery" class="demo-form-inline">
        <!-- 第一行 -->
        <el-row class="headStyle">
          <!-- 第一列 -->
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="人 员" label-width="50px">
              <el-select v-model="EmergencyQuery.userId" filterable placeholder="请选择人员" @focus="addGetName">
                <el-option v-for="item in personList" :key="item.uuid" :label="item.name" :value="item.uuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 第二列 -->
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="设 备" label-width="50px">
              <el-select v-model="EmergencyQuery.deviceId" filterable placeholder="请选择设备" @focus="addTaskName">
                <el-option v-for="item in taskList" :key="item.deviceID" :label="item.deviceName" :value="item.deviceID">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 第三列 -->
          <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
            <el-form-item label="事发时间" label-width="70px">
              <el-date-picker v-model="EmergencyQuery.beginDate" type="date" value-format="yyyy-MM-dd" @change="getBegintTime" :placeholder='placeBegin' :editable="false">
              </el-date-picker>
            </el-form-item>
            <el-form-item label='到  ' label-width="26px">
              <el-date-picker v-model="EmergencyQuery.endDate" type="date" value-format="yyyy-MM-dd" :placeholder='placeEnd' @change="getEndTime" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 第四列 -->
          <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
            <el-form-item>
              <el-button type="primary" @click="addEmergencyEvent">查 询</el-button>
            </el-form-item>
          </el-col>
          <!-- 第五列 -->
          <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
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
      <el-table ref="multipleTable" :data="EmergencyData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" border>
        <el-table-column label="序号" prop="index" type="index" align="center" header-align="center" width="50"></el-table-column>
        <el-table-column label="事发时间" prop="eventTime" align="center" header-align="center" width="200"></el-table-column>
        <el-table-column label="事发地点" prop="place" align="center" header-align="center" width="300"></el-table-column>
        <el-table-column label="人员" prop="userName" align="center" header-align="center" width="200"> </el-table-column>
        <el-table-column label="设备" prop="deviceName" align="center" header-align="center" width="200"> </el-table-column>
        <el-table-column label="描述" align="center" header-align="center">
          <span slot-scope="scope" @click="dialogFormVisible(scope.$index, scope.row)" type="text" style="color:blue;cursor:pointer">
            {{ scope.row.description }}
          </span>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div v-show="EmergencyData.length">
        <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" align='center' :current-page="current.pageNo" :page-sizes="[10,20,30]" :page-size="current.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="current.total" style="margin-top:15px"></el-pagination>
      </div>
      <!-- 分页 END -->
    </div>
    <!-- 弹框 -->
    <describe :show="showaddDialog" :child="photo" @click="messageOpen" :video='video' @closeDialog="closeDialog"></describe>
    <!-- END 弹框 -->
    <!--表格 END -->
  </div>
</template>
<script>
// 引用ajax文件
import { getEmergencyEventData, getNameData, getTaskNameData } from './apis/eventHandler'
// 引用弹框组件
import describe from './components/dialogs/GustyEventDescribe.vue'
// 子组件的注册
export default {
  components: {
    describe
  },
  data () {
    return {
      placeBegin: 'placeBegin',
      placeEnd: 'placeEnd',
      showaddDialog: false,    // 视屏图片弹框显示控制
      photo: '',               // 向子组件传送图片地址
      video: '',               // 向子组件传送图片地址
      EmergencyQuery: {        // 查询请求参数
        userId: '',            // 用户id
        deviceId: '',          // 设备id
        beginDate: new Date(), // 事发开始时间
        endDate: new Date(),   // 事发结束时间
        taskName: ''           // 任务名称
      },
      current: {               // 分页
        pageNo: 1,             // 当前页
        pageSize: 10,          // 每页几条
        total: 0               // 总条数
      },
      multipleSelection: [],   // table中的change事件
      EmergencyData: [],       // table表格渲染字段
      personList: [],          // 人员姓名下拉框渲染字段
      taskList: []             // 设备选择下拉框
    }
  },
  // 选择期日重置更新
  updated () {
    this.placeBegin = '开始日期'
    this.placeEnd = '结束日期'
  },
  // 刷新加载
  mounted () {
    this.addEmergencyEvent()
  },
  methods: {
    // 数据加载
    addEmergencyEvent () {
      // 传送数据   参数： 每页数量  页数  人员Id 开始时间  结束时间 设备Id 任务名称
      let params = {
        'pageSize': this.current.pageSize,
        'pageNo': this.current.pageNo,
        'userId': this.EmergencyQuery.userId,
        'beginDate': this.EmergencyQuery.beginDate,
        'endDate': this.EmergencyQuery.endDate,
        'deviceId': this.EmergencyQuery.deviceId,
        'taskName': this.EmergencyQuery.taskName
      }
      getEmergencyEventData(params).then(rs => {
        if (rs.data.code === '00000') {
          this.EmergencyData = rs.data.data.rows
          this.current.total = rs.data.data.total
        } else {
          this.data = []
        }
      })
    },
    // 结束时间不能小于开始时间，请重新选择
    getBegintTime (value) {
      if (this.EmergencyQuery.endDate && this.EmergencyQuery.endDate < value) {
        this.$message({
          message: '开始时间不能大于结束时间，请重新选择',
          time: 3,
          type: 'warning'
        })
        this.EmergencyQuery.endDate = ''
      }
    },
    // 开始时间不能大于结束时间，请重新选择
    getEndTime (value) {
      if (this.EmergencyQuery.beginDate && this.EmergencyQuery.beginDate > value) {
        this.$message({
          message: '开始时间不能大于结束时间，请重新选择',
          time: 3,
          type: 'warning'
        })
        this.EmergencyQuery.beginDate = ''
      }
    },
    // 每页显示几条
    handleSizeChange (val) {
      this.current.pageSize = val
      this.addEmergencyEvent()
    },
    // 当前页数   点击选页和每页显示的数量时将页数和个数当参数发送ajax请求
    handleCurrentChange (val) {
      this.current.pageNo = val
      this.addEmergencyEvent()
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    /*
     *点击描述 -- 弹框弹出
     *    将传回子组件的值 以父传子的关系传给子组件
     *    父子组件间的传值
     *    父页面值直接传给子组件
     *    优点：避免发送请求  优化页面性能  减轻服务器压力
     */
    dialogFormVisible (index, row) {
      let flag = true
      if (row.picUrl !== undefined && row.picUrl !== '' && row.picUrl !== null) {
        flag = false
        this.photo = row.picUrl.split(',')
        this.video = ''
      }
      if (row.videoUrl !== undefined && row.videoUrl !== '' && row.videoUrl !== null) {
        flag = false
        this.video = row.videoUrl.split(',')
        this.photo = ''
      }
      if (!flag) {
        this.showaddDialog = true
      }
      if (flag) {
        this.messageOpen()
      }
    },
    // 消息提示
    messageOpen () {
      this.$message('没有图片和视频可以浏览')
    },
    // 重置按钮    重置按钮 ==> 将四个输入框的val赋值为空
    closeQuery () {
      this.EmergencyQuery.userId = ''
      this.EmergencyQuery.beginDate = ''
      this.EmergencyQuery.endDate = ''
      this.EmergencyQuery.deviceId = ''
      this.EmergencyQuery.taskName = ''
      this.placeBegin = '开始日期'
      this.placeEnd = '结束日期'
    },
    // 人员姓名下拉框   人员下拉 ==> 光标获取事件的时候ajax请求并显示到下拉框中
    addGetName () {
      getNameData().then(rs => {
        if (rs.data.code === '00000') {
          this.personList = rs.data.data
        } else {
          this.data = []
        }
      })
    },
    // 设备选择下拉框   同上
    addTaskName () {
      getTaskNameData().then(rs => {
        if (rs.data.code === '00000') {
          this.taskList = rs.data.data
        } else {
          this.data = []
        }
      })
    },
    // 关闭弹框
    closeDialog () {
      this.showaddDialog = false
    }
  }
}
</script>
 <style lang="less" scoped>
.headStyle {
  margin-top: 30px;
  margin-bottom: 20px;
}
.el-table el-table-column .cell {
  color: blue;
}
</style>
<style lang="less">
.emergency {
  .el-table > .el-table__body-wrapper {
    overflow-x: hidden !important;
  }
}
</style>