<template>
  <div class="outRecord">
    <section class="record-main">
      <el-date-picker v-model="queryTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" 
      :picker-options="pickerOptions">
      </el-date-picker>
      <el-button type="primary" @click="queryByNum">查询</el-button>
      <!-- <el-form :model="queryForm" ref="queryForm" :inline="true" :rules="searchRules">
        <el-form-item prop="queryCarNum" label="">
          <el-input placeholder="请输入用户名" v-model.trim="queryForm.queryCarNum"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryByNum">查询</el-button>
        </el-form-item>
      </el-form> -->
    </section>
    <section class="inout-cont">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="车辆类型缴费统计" name="first">
          <div class="fix-table-bar">
            <el-table :data="countData" border style="width: 100%" max-height="680" class="table-format">
              <el-table-column prop="carType" label="车辆类型"  :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="carInNum" label="进场数" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="carOutNum" label="出场数" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="onLineCharge" label="线上缴费（元）" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="cash" label="线下缴费（元）" min-width="100" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="totalCharge" label="总费用（元）" width="160" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="出口车辆缴费统计" name="second">
          <div class="fix-table-bar">
            <el-table :data="outCountData" border style="width: 100%" max-height="680" class="table-format">
              <el-table-column prop="outChannelName" label="出口通道名称"  :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="monthOutNum" label="月保出场数" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="propertyOutNum" label="产权出场数" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="tempOutNum" label="临停出场数" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="tempCash" label="临停线下缴费（元）" min-width="100" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
      
    </section>
  </div>
</template>
<script>
import {
  getPayCount, getOutChannelCount
} from '@/views/ParkingLotApp/apis'
export default {
  data () {
    return {
      activeName: 'first',
      countData: [],
      outCountData: [],
      tabIndex: 0,
      pickerOptions: {
        shortcuts: [{
          text: '最近一天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      queryTime: ''
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      var _this = this
      // _this.loading = true
      getPayCount(_this.queryTime)
        .then(function (response) {
          // _this.loading = false
          if (response.code === '0') {
            _this.countData = response.data
          }
        })
        .catch(
          function (error) {
            // this.loading = false
            console.log(error)
          }
        )
    },
    getChannelCount () {
      let _this = this
      getOutChannelCount(_this.queryTime)
        .then(function (response) {
          if (response.code === '0') {
            _this.outCountData = response.data
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    handleClick (tab) {
      let _this = this
      if (tab.index === '1') {
        _this.tabIndex = 1
        _this.getChannelCount()
      } else {
        _this.tabIndex = 0
        _this.loadData()
      }
    },
    queryByNum () {
      if (this.queryTime === null) {
        this.queryTime = ''
      }
      if (this.tabIndex === 0) {
        this.loadData()
      } else {
        this.getChannelCount()
      }
      // _this.$refs['queryForm'].validate((valid) => {
      //   if (valid) {
      //     let queryTime = _this.queryTime
      //     if (queryTime === null) {
      //       queryTime = ''
      //     }
      //     this.loadData(_this.currentPage, _this.pageSize, _this.queryForm.queryCarNum, queryTime)
      //   }
      // })
    }
  }
}
</script>
<style lang="less" scoped>
.record-main > *{
  display:inline-block;
  vertical-align: top;
  margin-right:20px;
}
.inout-cont {
  margin-top:20px;
}
.toolbar{
  text-align: right;
  margin-top: 20px;
}
.check-img{
  padding-top: 10px;
  text-align: center;
  overflow: hidden;
  div{
    float: left;
    width: 50%;
    img{
      width: 440px;
      height: 330px;
      display: inline-block;
    }
  } 
}
.detail-list{
  margin-bottom: 0;
}
.detail-text{
  display: block;
  width: 250px;
}
.fix-table-bar{
  height:700px;
  overflow: auto;
}
</style>
<style lang="less">
.table-format{
  .el-table__header-wrapper{
    .el-table__header{
      width:auto!important;
    }
  }
}
</style>




