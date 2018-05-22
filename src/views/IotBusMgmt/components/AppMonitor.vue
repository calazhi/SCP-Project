<template>
  <div id='appMonitorVue' style="overflow-x:hidden; overflow-y:scroll; height:650px;">
    <!-- AppRealTimeChart -->
    <el-row class="button-align">
      <el-col :span="24">
        <div class="monitor-title" align="left"><i class="el-icon-news"></i> 实时监控信息 </div>
        <el-table :data="appMonitorTableData" style="width: 100%" border>
          <el-table-column prop="indexName" label="参数类型" align="left"></el-table-column>
          <el-table-column prop="thresholdMax" label="阈值" align="left"></el-table-column>
          <el-table-column prop="intValue" label="当前实时数据" align="left"></el-table-column>
          <el-table-column prop="time" label="数据获取时间" align="left"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row class="button-align alertApp-dialog">
     <el-col :span="24">
        <div class="monitor-title" align="left"><i class="el-icon-news"></i> 应用告警信息 </div>
        <el-table :data="appAlertListData" style="width: 100%;" border>
          <el-table-column prop="createTime" label="告警时间" :formatter="dateFormat" align="left"></el-table-column>
          <el-table-column prop="indexName" label="告警类型" align="left"></el-table-column>
          <el-table-column prop="thresholdMax" label="历史阈值" align="left"></el-table-column>
          <el-table-column prop="intValue" label="告警值" align="left">
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
          align="middle"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
    <el-row class="button-align monitorApp-dialog">
      <el-col :span="24"><div id='echartAppChartContainer1' ref="echartAppChartContainer1" style='width: 100%; height: 400px'></div></el-col>
    </el-row>
  </div>
</template>

<style scoped>
.monitor-title {
  padding: 0 0 10px 10px;
  font-size: 13px;
  color: #666666;
  font-weight: bold;
}
.warnText{
  color: red;
  font-weight: bold;
}
.alertApp-dialog{
  margin-top: 15px;
}
.monitorApp-dialog{
  margin-top: 35px;
}
</style>

<script>
import echarts from 'echarts'
import {formatDate} from '../assets/js/tool.js'
import {getAppTimelyData, getAppHistoryData, getAppAlertData, getAppNameByCode} from '@/views/IotBusMgmt/apis/iotbus_appmonitor_api'
// import {Loading} from 'element-ui'

export default {
  name: 'iotAppMonitor',
  data () {
    return {
      appMonitorTableData: [],
      appAlertListData: [],
      currentPage: 1,
      currentCode: '',
      currentName: '',
      pageSize: 2,
      total: 0
    }
  },
  methods: {
    dateFormat (row, column) {
      var time = row[column.property]
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    getAppNameByAppCode (item) {
      var params = { key: item }
      getAppNameByCode(params).then((res) => {
        this.currentName = res.data.appName
      })
    },
    refreshData (item) {
      this.intervalID = setInterval(() => {
        this.loadAppMonitorRTData(item)
      }, 30000)
    },
    loadAppMonitorRTData (item) {
      var params = {
        appCode: item
      }
      getAppTimelyData(params)
        .then(function (result) {
          this.appMonitorTableData = result
        }.bind(this)).catch(
          function (error) {
            console.info(error)
          }
        )
    },
    loadAppAlertRTData (item) {
      var params = {
        appCode: item,
        page: this.currentPage,
        size: this.pageSize
      }
      getAppAlertData(params)
        .then(function (result) {
          this.appAlertListData = result.rows
          this.total = result.total
        }.bind(this)).catch(
          function (error) {
            console.info(error)
          }
        )
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.appAlertListData = []
      this.loadAppAlertRTData(this.currentCode)
    },
    showAppQueueDepthChart (item) {
      var params = { appCode: item }
      let appChartContainer1 = echarts.init(document.getElementById(this.$refs.echartAppChartContainer1.id))
      appChartContainer1.setOption({
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: []
        },
        yAxis: {
          splitLine: {
            show: false
          }
        },
        toolbox: {
          left: 'right',
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: [{
        }, {
          type: 'inside'
        }],
        series: {
          name: '',
          type: 'line',
          data: [],
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 0
              }]
          }
        }
      })
      getAppHistoryData(params).then((res) => {
        var currentThresholdMax = 0
        if (res.length === 0) {
          appChartContainer1.setOption({
            title: {text: this.currentCode + ' | ' + this.currentName + '  ' + '消息队列深度'},
            xAxis: {
              max: new Date(),
              min: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
              type: 'time',
              splitLine: {
                show: false
              },
              axisLabel: {
                formatter: function (a) {
                  var date = new Date(a)
                  var t1 = function (num) { return num < 10 ? '0' + num : num }
                  return [t1(date.getHours()), t1(date.getMinutes()), t1(date.getSeconds())].join(':')
                }
              }
            },
            yAxis: {
              max: 1,
              min: 0,
              type: 'value'
            },
            toolbox: {},
            series: {
              markLine: {
                silent: true,
                data: []
              }
            },
            graphic: [
              {
                type: 'group',
                left: 'center',
                top: 'center',
                children: [
                  {
                    type: 'text',
                    z: 100,
                    left: 'center',
                    top: 'middle',
                    style: {
                      fill: '#333',
                      text: '暂无历史数据',
                      font: '20px Microsoft YaHei'
                    }
                  }
                ]
              }
            ]
          })
        } else {
          var mdata = res
          const listX = mdata.map(index => index.time)
          const listY = mdata.map(index => index.intValue)
          getAppTimelyData(params).then((res2) => {
            res2.length === 0 ? (currentThresholdMax = 0) : (currentThresholdMax = res2[0].thresholdMax)
            appChartContainer1.setOption({
              title: {text: this.currentCode + ' | ' + this.currentName + '  ' + mdata[0].indexName},
              xAxis: {data: listX},
              visualMap: {
                top: 10,
                right: 80,
                pieces: [{
                  gt: 0,
                  lte: currentThresholdMax,
                  color: '#096'
                }, {
                  gt: currentThresholdMax,
                  color: '#cc0033'
                }],
                outOfRange: {
                  color: '#999'
                }
              },
              series: {
                data: listY,
                name: mdata[0].indexName,
                markLine: {
                  data: [{
                    yAxis: currentThresholdMax
                  }]
                }
              }
            })
          })
        }
      })
    },
    showAppRTChart (item) {
      this.currentCode = item
      this.$nextTick(() => {
        this.getAppNameByAppCode(this.currentCode)
        this.refreshData(this.currentCode)
        this.loadAppMonitorRTData(this.currentCode)
        this.handleCurrentChange(this.currentPage)
        this.showAppQueueDepthChart(this.currentCode)
      })
    }
  },
  mounted () {
    // this.showAppRTChart()
  },
  beforeDestroy () {
    clearInterval(this.intervalID)
  }
}
</script>
