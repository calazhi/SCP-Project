<template>
  <div class="outRecord">
    <section class="record-main">
      <el-date-picker v-model="queryTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" 
      :picker-options="pickerOptions">
      </el-date-picker>
      <el-form :model="queryForm" ref="queryForm" :inline="true" :rules="searchRules">
        <el-form-item prop="queryCarNum" label="">
          <el-input placeholder="请输入车牌号|卡号" v-model.trim="queryForm.queryCarNum"></el-input>
          <el-input type="text" style="display:none" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryByNum">查询</el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="inout-cont">
      <div class="fix-table-bar">
        <el-table :data="inoutData" border style="width: 100%" max-height="680" class="table-format">
          <el-table-column type="index" width="60" label="序号"></el-table-column>
          <el-table-column prop="parkName" label="停车场名称" width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="carNum" label="车牌号码" width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="cardNumber" label="卡号" width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="ownerName" label="人员姓名" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="ruleName" label="规则名称" min-width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="inTime" label="入场时间" width="160" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="parkInChannelName" label="入场通道" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="outTime" label="出场时间" width="160" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="parkOutChannelName" label="出场通道" min-width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="stopTime" label="停车时长" min-width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="payedMoney" label="缴费金额(元)" width="105" ></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="inImgUrl" label="详情">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleCheck(scope.$index, scope.row, 0)">查看详情</el-button>
            </template>
          </el-table-column>
          
        </el-table>
      </div>
      <el-col class="toolbar">
        <el-pagination @size-change="handleSizeChange" @current-change="findPage" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-col>
    </section>
    <el-dialog :visible.sync="dialogImgVisible" title="进出场记录详情" >
      <el-form :inline="true" label-width="150px">
        <el-form-item label="停车场名称：" class="detail-list">
          <span v-text="detailRecod.parkName" class="detail-text"></span>
        </el-form-item>
        <el-form-item label="车牌号：" class="detail-list" v-if="detailRecod.carNum">
          <span v-text="detailRecod.carNum" class="detail-text"></span>
        </el-form-item>
        <el-form-item label="卡号：" class="detail-list" v-else-if="detailRecod.cardNumber">
          <span v-text="detailRecod.cardNumber" class="detail-text"></span>
        </el-form-item>
        <el-form-item label="人员姓名：" class="detail-list">
          <span v-text="detailRecod.ownerName" class="detail-text"></span>
        </el-form-item>
        <el-form-item label="规则名称：" class="detail-list">
          <span v-text="detailRecod.ruleName" class="detail-text"></span>
        </el-form-item>
        <el-form-item label="入场通道：" class="detail-list">
          <span v-text="detailRecod.parkInChannelName" class="detail-text"></span>
        </el-form-item>
        <el-form-item label="出场通道：" class="detail-list">
          <span v-text="detailRecod.parkOutChannelName" class="detail-text"></span>
        </el-form-item>
        <el-form-item label="入场时间：" class="detail-list">
          <span v-text="detailRecod.inTime" class="detail-text"></span>
        </el-form-item>
        <el-form-item label="出场时间：" class="detail-list">
          <span v-text="detailRecod.outTime" class="detail-text"></span>
        </el-form-item>
        <el-form-item label="停车时长：" class="detail-list">
          <span v-text="detailRecod.stopTime" class="detail-text"></span>
        </el-form-item>
        <el-form-item label="应缴金额：" class="detail-list">
          <span v-text="detailRecod.payedMoney" class="detail-text"></span>
        </el-form-item>
      </el-form>
      <div class="check-img">
        <div v-show="detailRecod.inImgUrl">
          <img :src="detailRecod.fastdfsHttpAddress + detailRecod.inImgUrl" />
          <p>入场图片</p>
        </div>
        <div v-show="detailRecod.outImgUrl">
          <img :src="detailRecod.fastdfsHttpAddress + detailRecod.outImgUrl" />
          <p>出场图片</p>
        </div>
        <!-- <img v-show="detailRecod.outImgUrl" :src="detailRecod.fastdfsHttpAddress + detailRecod.outImgUrl" /> -->
      </div>
      <div style="text-align:center;width:100%">
        <el-button @click="dialogImgVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryCarInOutRecord
} from '@/views/ParkingLotApp/apis'
export default {
  data () {
    let queryValid = (rule, value, callback) => {
      let regexp = new RegExp("[`·~!@#$%+^&*\\-_()=|{}'/\\\\:;'\"\",\\[\\].<>/?！#￥……&*（）——【】‘’；：”“。，、？]")
      if (regexp.test(value)) {
        callback(new Error('请勿输入特殊字符'))
      } else {
        callback()
      }
    }
    return {
      queryForm: {
        queryCarNum: ''
      },
      queryOwnerName: '',
      dialogImgVisible: false,
      recordImg: '',
      // loading: true,
      currentPage: 1,
      pageSize: 10,
      total: 10,
      inoutData: [],
      detailRecod: [],
      parkData: [{
        parkName: '恒大山水',
        allCount: 300,
        residueCount: 147
      }, {
        parkName: '恒大山水库',
        allCount: 500,
        residueCount: 347
      }],
      artRelForm: {

      },
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
      queryTime: '',
      searchRules: {
        queryCarNum: [
          {validator: queryValid, trigger: 'change'}
        ]
      }
    }
  },
  mounted () {
    this.loadData(this.currentPage, this.pageSize, this.queryForm.queryCarNum, this.queryTime)
  },
  methods: {
    loadData (currentPage, pageSize, carNum, queryType) {
      var _this = this
      if (queryType === null) {
        queryType = ''
      }
      // _this.loading = true
      queryCarInOutRecord(currentPage, pageSize, carNum, queryType)
        .then(function (response) {
          // _this.loading = false
          if (response.code === '0') {
            _this.inoutData = response.data.rows
            _this.total = response.data.total
          }
        })
        .catch(
          function (error) {
            // this.loading = false
            console.log(error)
          }
        )
    },
    queryByNum () {
      let _this = this
      _this.$refs['queryForm'].validate((valid) => {
        if (valid) {
          let queryTime = _this.queryTime
          if (queryTime === null) {
            queryTime = ''
          }
          this.loadData(_this.currentPage, _this.pageSize, _this.queryForm.queryCarNum, queryTime)
        }
      })
    },
    artificRel () {
      this.dialogVisible = true
    },
    handleCheck (index, row, recordType) {
      this.detailRecod = row
      console.log(row)
      // if (recordType === 0) {
      //   this.recordImg = row.fastdfsHttpAddress + row.inImgUrl
      // } else {
      //   this.recordImg = row.fastdfsHttpAddress + row.outImgUrl
      // }
      this.dialogImgVisible = true
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.loadData(this.currentPage, this.pageSize, this.queryForm.queryCarNum, this.queryTime)
    },
    findPage (val) {
      this.currentPage = val
      this.loadData(this.currentPage, this.pageSize, this.queryForm.queryCarNum, this.queryTime)
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




