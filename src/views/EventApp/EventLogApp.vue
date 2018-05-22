<template>
  <div>
    <div class="event-form">
      <el-form ref="eventLog" :model="eventLog" label-width="80px">
        <el-row :gutter="10">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="事件类型" prop="name">
              <el-select class="event-select" v-model="eventLog.name" clearable placeholder="选择事件">
                <el-option v-for="item in eventTypeResult" :key="item.id" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="事件状态" prop="state">
              <el-select class="event-select" v-model="eventLog.state" clearable placeholder="请选择事件状态">
                <el-option label="事件开始" value="0"></el-option>
                <el-option label="事件进行中" value="1"></el-option>
                <el-option label="事件结束" value="2"></el-option>
                <el-option label="不适用" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item>
              <el-button type="primary" @click="submitForm('eventLog')">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker v-model="eventLog.startTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker v-model="eventLog.endTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" :editable="false" @change="getEndTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item>
              <el-button type="primary" @click="resetForm('eventLog')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="event-table">
      <el-table :data="eventResult" :row-key="getRowKeys" :expand-row-keys="expands" border @expand-change="handleExpandChange" type="expand" tooltip-effect="light">
        <el-table-column prop="eventLogId" label="事件日志ID" align="center" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="eventTypeName" label="事件类型" align="center"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="center"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
        <el-table-column prop="content" label="事件内容" align="center"></el-table-column>
        <el-table-column prop="deviceName" label="设备名称" align="center"></el-table-column>
        <el-table-column prop="deviceCode" label="设备编号" align="center" min-width="90"></el-table-column>
        <el-table-column prop="statusMessage" label="事件状态" align="center"></el-table-column>
        <el-table-column type="expand" align="center">
          <template slot-scope="props">
            <el-row :gutter="10">
              <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <div v-if="props.row.extend &&  props.row.extend.imgUrl || ''">
                  <img :src="props.row.extend.imgUrl" style="width:100%">
                </div>
              </el-col>
              <div class="text-center" v-if="resultTotalData">
                <div>
                  <img :src="resultTotalData.imgUrl" alt="">
                </div>
                <div>{{resultTotalData.message}}</div>
              </div>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="el-page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNo" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total" v-show="showTable">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getEventLogData, getEventLogByIdData, getEventTypeListData } from './apis/index'
export default {
  data () {
    return {
      eventResult: [],          // 联动日志数据结果
      resultTotalData: {},      // 展开行数据
      eventTypeResult: [],      // 事件类型集合
      showTable: false,         // 分页是否显示
      pageNo: 1,                // 页码
      pageSize: 10,             // 每页多少条
      eventLogId: '',           // 当前行id
      type: '',
      imgUrl: '',
      total: 0,                 // 总条数
      eventLog: {               // 事件表单
        name: '',
        contain: '',
        state: '',
        startTime: '',
        endTime: ''
      },
      // 获取row的key值
      getRowKeys (row) {
        return row.eventLogId
      },
      form: {},
      // 要展开的行，数值的元素是row的key值
      expands: []
    }
  },
  mounted () {
    this.getData()
    this.getEventType()
  },
  methods: {
    // 获取事件类型
    getEventType () {
      getEventTypeListData()
        .then(res => {
          if (res.data.code === '00000') {
            this.eventTypeResult = res.data.data.eventType
          } else {
            this.eventTypeResult = []
            this.$message({
              message: res.data.message ? res.data.message : '请求数据失败',
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 向后端发送请求获取联动日志数据
    getData () {
      getEventLogData({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        eventType: this.eventLog.name,
        status: this.eventLog.state,
        startTime: this.eventLog.startTime,
        endTime: this.eventLog.endTime
      })
        .then(res => {
          if (res.data.code === '00000') {
            // 判断结果是否不为空
            if (res.data.data == null) {
              this.eventResult = []
              this.showTable = false
            } else {
              this.eventResult = res.data.data.rows
              this.total = res.data.data.total
              this.showTable = true
            }
          } else {
            this.eventResult = []
            this.total = 0
            this.showTable = false
            this.$message({
              message: res.data.message ? res.data.message : '请求数据失败',
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 通过传递参数ID发送请求得到相关数据
    getDataById (eventLogId) {
      getEventLogByIdData({
        eventLogId: eventLogId
      })
        .then(res => {
          // 判断结果是否不为空
          if (!res.data.data) {
            this.resultTotalData = ''
          } else {
            this.resultTotalData = res.data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取结束时间并判断
    getEndTime (val) {
      if (this.eventLog.startTime > val) {
        this.$message({
          message: '开始时间不能大于结束时间，请重新选择',
          type: 'warning'
        })
        this.eventLog.endTime = ''
        this.eventLog.startTime = ''
      }
    },
    // 通过每页的条数向后端获取数据
    handleSizeChange (val) {
      this.pageSize = val
      this.pageNo = 1
      this.getData()
    },
    handleCurrentChange (val) {
      // 显示当前页数
      this.pageNo = val
      this.getData()
    },
    // 展开当前行详细内容
    handleExpandChange (row) {
      this.resultTotalData = ''
      if (this.expands[0] === row.eventLogId) {
        // 关闭当前行
        this.expands = []
      } else if (row.eventLogId) {
        this.expands = []
        this.expands.push(row.eventLogId)
        this.getDataById(row.eventLogId)
      }
    },
    // 查询所有数据
    submitForm (formName) {
      this.$refs['eventLog'].validate((valid) => {
        if (valid) {
          this.pageNo = 1
          this.getData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置数据
    resetForm (formName) {
      this.$refs['eventLog'].resetFields()
      this.eventResult = []
      this.pageNo = 1
      this.getData()
    }
  }
}
</script>
<style lang='less'>
.event-table {
  .el-table__body-wrapper {
    overflow-x: hidden;
  }
}
</style>
<style scoped lang='less'>
.demo-table-expand {
  font-size: 0;
  label {
    width: 90px;
    color: #99a9bf;
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
}
.event-form {
  width: 100%;
  margin-top: 30px;
  .event-select {
    width: 220px;
  }
}
.event-table {
  width: 100%;
  .el-table {
    width: 100%;
  }
}
.el-page {
  text-align: center;
}
.text-center {
  text-align: center;
}
</style>
