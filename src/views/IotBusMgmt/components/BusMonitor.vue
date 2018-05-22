<template>
  <div id='app' class = "ui-common">

    <el-row>
      <el-col :span="12">
        <el-row>
          <div style='width: 100%; height: 360px'>
            <div class="monitor-title"><i class="el-icon-news"></i> 
              实时监控数据
            </div>
            <el-table :data="timelyData" style='width: 740px;' highlight-current-row @row-click="handleDeadLogMgmt" border :row-class-name="tableRowClassName">
              <el-table-column prop="indexName" label="参数类型" width='220px'>
                <template slot-scope="scope">
                  <span :class="{ 'blue cursor-hand': scope.$index===1}">
                    <b>{{ scope.row.indexName }}</b>
                  </span></template>
              </el-table-column>
              <el-table-column prop="thresholdMax" label="阈值">
              </el-table-column>
              <el-table-column prop="intValue" label="当前实时数据">
                <template slot-scope="scope">
                  <span :class="{ 'green': scope.row.intValue<scope.row.thresholdMax, 'red': scope.row.intValue>=scope.row.thresholdMax}">
                    <b>{{ scope.row.intValue }}</b>
                  </span></template>
              </el-table-column>
              <el-table-column prop="time" label="数据获取时间">
              </el-table-column>
            </el-table>
            <el-row style="margin-top:10px; font-size:12px" :inline="true">
              <el-col :span="17">
                自动刷新开关（10s/次）：
                <el-switch v-model="enableStatus" active-color="#13ce66" inactive-color="#ff4949">></el-switch>
              </el-col>
              <el-col :span="4">
                手动点击刷新：
                <span @click="refreshDataByManual()" style="cursor:pointer" class="el-icon-refresh"></span>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <el-row>
          <el-form :inline="true" class="appMonitor">
            <el-form-item label="应用：" prop="appItem">
              <el-select v-model="selectAppValue" filterable clearable placeholder="请选择 < 应用编码 | 应用名称 >" style="width:275px">
                <el-option
                v-for="item in selectOptions"
                :key="item.appCode"
                :label="item.appCode + ' | ' + item.appName"
                :value="item.appCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button class = "search-btn" type="primary" @click="onSearchAppSubmit(selectAppValue)" >查看应用监控</el-button>
          </el-form>
        </el-row>
      </el-col>
      <el-col :span="12">
        <div style='width: 100%; height: 360px; margin-left: 5px'>
          <div class="monitor-title"><i class="el-icon-news"></i> 告警信息列表</div>
          <el-table :data="alertList" style="width: 730px;" border>
            <el-table-column prop="createTime" label="告警时间" :formatter="dateFormat" width='190px'>
            </el-table-column>
            <el-table-column prop="indexName" label="告警类型" width='210px'>
              <template slot-scope="scope">       
                <span>{{ (scope.row.appCode ? scope.row.appCode + '-' : '') + scope.row.indexName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="thresholdMax" label="历史阈值">
            </el-table-column>
            <el-table-column prop="intValue" label="告警值">
              <template slot-scope="scope">
                <span class="warnText">{{ scope.row.intValue }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>

    <!--创建4个echarts的容器-->
    <div style="margin-top: 25px">
      <el-row>
        <el-col :span="12"><div id='echartContainerOfConnections' style='width: 100%; height: 320px'></div></el-col>
        <el-col :span="12"><div id='echartContainerOfThroughput' style='width: 100%; height: 320px'></div></el-col>
      </el-row>
      <el-row style="margin: 60px 0">
        <el-col :span="8"><div id='echartContainerOfDead' style='width: 100%; height: 300px'></div></el-col>
        <el-col :span="8"><div id='echartContainerOfInbound' style='width: 100%; height: 300px'></div></el-col>
        <el-col :span="8"><div id='echartContainerOfLog' style='width: 100%; height: 300px'></div></el-col>
      </el-row>
    </div>

    <!--从AppMonitor引入弹出框的页面-->
    <el-dialog 
      title="应用实时监控情况" 
      :visible.sync="appRealTimeMonitorChartVisible" 
      :before-close="handleAppRTChartClose" 
      :close-on-click-modal=false
      :close-on-press-escape=false
      style="width: 100%; height: 100%;">
      <appMonitor ref="appMonitorVue"> </appMonitor>
    </el-dialog>

    <!--从实时监控数据引入死信消息队列管理页面-->
    <el-dialog 
      title="死信消息队列管理" 
      :visible.sync="deadLogMgmtChartVisible" 
      :before-close="handleDeadLogMgmtClose" 
      :close-on-click-modal=false
      :close-on-press-escape=false
      style="width: 100%; height: 100%;">
      <deadLogMgmt ref="deadLogMgmtVue"> </deadLogMgmt>
    </el-dialog>
  </div>
</template>

<style scoped>
.monitor-title {
    padding: 0 0 10px 10px;
    /* border-bottom: 1px solid #cccccc; */
    /* margin-bottom: 20px; */
    font-size: 17px;
    color: #666666;
    font-weight: bold;
}
.warnText{
  color: red;
  font-weight: bold;
}
.el-table >>> .special-row {
  background: #f0f9eb;
}
/* .inlineDiv{
  display: inline-block;
  margin: 30px 15px;
} */
</style>

<script>
import echarts from 'echarts'
import appMonitor from './AppMonitor.vue'
import deadLogMgmt from './DeadLogMgmt.vue'
import { formatDate, getChartOptions } from '../assets/js/tool.js'
import {getRealTimeData, getAlertInfo, getConnections, getInboundQueue, getDeadQueue, getLogQueue, getThroughput} from '@/views/IotBusMgmt/apis/iotbus_busmonitor_api'
import {getAppList} from '@/views/IotBusMgmt/apis/iotbus_appmonitor_api'

// import {Loading} from 'element-ui'

export default {
  name: 'iotBusMonitor',
  components: {
    appMonitor,
    deadLogMgmt
  },
  data () {
    return {
      appRealTimeMonitorChartVisible: false,
      deadLogMgmtChartVisible: false,
      selectOptions: [],
      selectAppValue: '',
      timelyData: [],
      alertList: [],
      iotBusArgList: [],
      enableStatus: false,
      currentPage: 1,
      pageSize: 6,
      total: 0
    }
  },
  methods: {
    // 时间格式化
    dateFormat (row, column) {
      var time = row[column.property]
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'special-row'
      }
      return ''
    },
    loadAlertList () {
      var params = {
        page: this.currentPage,
        size: this.pageSize
      }
      getAlertInfo(params)
        .then(
          function (result) {
            this.alertList = result.rows
            console.log(result)
            this.total = result.total
            // this.alertList = []
          }.bind(this)
        )
        .catch(
          function (error) {
            console.info(error)
          }
        )
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.alertList = []
      this.loadAlertList()
    },
    loadIndexData () {
      getRealTimeData()
        .then(function (result) {
          let handledData = result.data
          handledData[1].indexName = handledData[1].indexName + '（点击查看）'
          this.timelyData = handledData
        }.bind(this)).catch(
          function (error) {
            console.info(error)
          }
        )
    },
    refreshData () {
      this.intervalID = setInterval(() => {
        if (this.enableStatus === true) {
          this.loadIndexData()
          this.loadAlertList()
        }
      }, 10100)
    },
    refreshDataByManual () {
      // console.log('我在刷新')
      this.loadIndexData()
      this.currentPage = 1
      this.alertList = []
      this.loadAlertList()
      // this.creatCharts()
    },
    drawChartOfConnections () {
      let myChart = echarts.init(document.getElementById('echartContainerOfConnections'))
      myChart.setOption({
        title: {
          text: '客户端连接数'
        },
        xAxis: {
          data: []
        },
        yAxis: {
        },
        series: {
          name: '客户端连接数',
          type: 'line',
          data: []
        }
      })
      window.addEventListener('resize', function () { myChart.resize() })
      getConnections().then((res) => {
        const data = res.data
        const listX = data.map(index => index.time)
        const listY = data.map(index => index.intValue)
        getRealTimeData().then(
          function (result) {
            var connectionsThresholdMax = result.data[4].thresholdMax
            // console.log('长度' + listX.length)
            var option = getChartOptions(listX, listY, connectionsThresholdMax)
            myChart.setOption(option)
          }
        )
      })
    },
    drawChartOfThroughput () {
      let myChart = echarts.init(document.getElementById('echartContainerOfThroughput'))
      myChart.setOption({
        title: {
          text: '吞吐量'
        },
        xAxis: {
          data: []
        },
        yAxis: {
        },
        series: {
          name: '消息服务每分钟吞吐量',
          type: 'line',
          data: []
        }
      })
      window.addEventListener('resize', function () { myChart.resize() })
      getThroughput().then((res) => {
        const data = res.data
        const listX = data.map(index => index.time)
        const listY = data.map(index => index.intValue)
        getRealTimeData().then(
          function (result) {
            var throughputThresholdMax = result.data[3].thresholdMax
            // var connectionsThresholdMax = 15
            var option = getChartOptions(listX, listY, throughputThresholdMax)
            myChart.setOption(option)
          }
        )
      })
    },
    drawChartOfDeadDepth () {
      let myChart = echarts.init(document.getElementById('echartContainerOfDead'))
      myChart.setOption({
        title: {
          text: '死信消息队列深度'
        },
        xAxis: {
          data: []
        },
        yAxis: {
        },
        series: {
          name: '死信消息队列深度',
          type: 'line',
          data: []
        }
      })
      window.addEventListener('resize', function () { myChart.resize() })
      getDeadQueue().then((res) => {
        const data = res.data
        const listX = data.map(index => index.time)
        const listY = data.map(index => index.intValue)
        getRealTimeData().then(
          function (result) {
            var deadQueueThresholdMax = result.data[1].thresholdMax
            var option = getChartOptions(listX, listY, deadQueueThresholdMax)
            myChart.setOption(option)
          }
        )
      })
    },
    drawChartOfInboundDepth () {
      let myChart = echarts.init(document.getElementById('echartContainerOfInbound'))
      myChart.setOption({
        title: {
          text: '入栈消息队列深度'
        },
        xAxis: {
          data: []
        },
        yAxis: {
        },
        series: {
          name: '入栈消息队列深度',
          type: 'line',
          data: []
        }
      })
      window.addEventListener('resize', function () { myChart.resize() })
      getInboundQueue().then((res) => {
        const data = res.data
        const listX = data.map(index => index.time)
        const listY = data.map(index => index.intValue)
        getRealTimeData().then(
          function (result) {
            var inboundThresholdMax = result.data[0].thresholdMax
            var option = getChartOptions(listX, listY, inboundThresholdMax)
            myChart.setOption(option)
          }
        )
      })
    },
    drawChartOfLogDepth () {
      let myChart = echarts.init(document.getElementById('echartContainerOfLog'))
      myChart.setOption({
        title: {
          text: '日志消息队列深度'
        },
        xAxis: {
          data: []
        },
        yAxis: {
        },
        series: {
          name: '日志消息队列深度',
          type: 'line',
          data: []
        }
      })
      window.addEventListener('resize', function () { myChart.resize() })
      getLogQueue().then((res) => {
        const data = res.data
        const listX = data.map(index => index.time)
        const listY = data.map(index => index.intValue)
        getRealTimeData().then(
          function (result) {
            var logThresholdMax = result.data[2].thresholdMax
            var option = getChartOptions(listX, listY, logThresholdMax)
            myChart.setOption(option)
          }
        )
      })
    },

    creatCharts () {
      // this.loadArgData()
      this.drawChartOfConnections()
      this.drawChartOfThroughput()
      this.drawChartOfDeadDepth()
      this.drawChartOfInboundDepth()
      this.drawChartOfLogDepth()
      // this.drawChartOfResponsetime()
    },
    loadSelectAppData () {
      getAppList().then(function (result) {
        this.selectOptions = result.data
      }.bind(this)).catch(function (error) {
        console.log(error)
      })
    },
    onSearchAppSubmit (item) {
      if (item === '') {
        this.appRealTimeMonitorChartVisible = false
      } else {
        this.appRealTimeMonitorChartVisible = true
        this.$nextTick(() => {
          this.$refs.appMonitorVue.showAppRTChart(item)
        })
      }
    },
    handleAppRTChartClose (done) {
      this.appRealTimeMonitorChartVisible = false
    },
    handleDeadLogMgmt (row) {
      if (row.indexCode === 'queue.depth.dead') {
        this.deadLogMgmtChartVisible = true
        this.$nextTick(() => {
          this.$refs.deadLogMgmtVue.showDeadMessageList()
        })
      } else {
        this.deadLogMgmtChartVisible = false
      }
    },
    handleDeadLogMgmtClose (done) {
      this.deadLogMgmtChartVisible = false
    }

  },
  mounted () {
    this.loadIndexData()
    this.loadAlertList()
    this.creatCharts()
    this.loadSelectAppData()
    this.refreshData()
  },
  beforeDestroy () {
    clearInterval(this.intervalID)
  }
}
</script>
