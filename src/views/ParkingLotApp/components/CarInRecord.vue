<template>
  <div class="inoutControl">
    <section>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="请输入车牌号|卡号" v-model="queryCarNum" ></el-input>
          <el-input type="text" style="display:none" />
        </el-form-item>       
        <el-form-item>
          <el-button type="primary" @click="queryByNum">查询</el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="inout-cont" style="margin-top:0">
      <div class="fix-table-bar">
        <el-table :data="inoutData" class="table-format" style="width: 100%" max-height="600" border highlight-current-row @current-change="handleCurrentChange">
          <el-table-column type="index" width="60" label="序号"></el-table-column>
          <el-table-column prop="parkLotName" label="车场名称" v-model="inoutData.parkLotName" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="carNum" label="车牌号码" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="cardNumber" label="卡号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="ownerName" label="人员姓名" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="ruleName" label="规则名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="inTime" label="入场时间"  width="180" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="channelName" label="入场通道" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="inImgUrl" label="入场图片">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleCheck(scope.$index, scope.row)">查看图片</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="deleteCarInRecord(scope.$index,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-col class="toolbar">
        <el-pagination @size-change="seatSizeChange" @current-change="seatFindPage" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-col>
    </section>
    <el-dialog :visible.sync="dialogImgVisible" title="查看图片" append-to-body>
      <div class="check-img"><img :src="imgUrl"/></div>
      <div style="text-align:center;width:100%">
        <el-button @click="dialogImgVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogGreenLightVisible" title="场内车辆" append-to-body></el-dialog>
  </div>
</template>
<script>
import {
  queryParkInVehicle, deleteCarInRecord
} from '@/views/ParkingLotApp/apis'
export default {
  data () {
    return {
      queryCarNum: '',
      queryOwnerName: '',
      dialogImgVisible: false,
      dialogGreenLightVisible: false,
      currentPage: 1,
      total: 10,
      pageSize: 10,
      inoutData: [],
      currentRow: '',
      imgUrl: '',
      artRelForm: {

      }
    }
  },
  props: ['CarInRecord', 'inCarLoad'],
  mounted () {
    this.loadData()
  },
  watch: {
    inCarLoad (curVal, oldVal) {
      this.currentPage = 1
      this.pageSize = 10
      this.loadData()
    }
  },
  methods: {
    loadData () {
      var _this = this
      queryParkInVehicle(_this.currentPage, _this.pageSize, '')
        .then(function (response) {
          if (response.code === '0') {
            _this.inoutData = response.data.rows || []
            _this.total = response.data.total
          }
        })
        .catch(
          function (error) {
            this.loading2 = false
            console.log(error)
          }.bind(this)
        )
    },
    artificRel () {
      this.dialogVisible = true
    },
    handleCheck (index, row) {
      this.imgUrl = row.fastdfsHttpAddress + row.inImgUrl
      this.dialogImgVisible = true
    },
    handleCurrentChange (val) {
      var _this = this
      _this.currentRow = val
    },
    deleteCarInRecord (index, rows) {
      var _this = this
      _this.$confirm('是否要删除此场内记录信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteCarInRecord(rows.id)
            .then(function (response) {
              if (response.code === '0') {
                _this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                _this.loadData()
                _this.queryCarNum = ''
              } else {
                _this.$alert('删除失败', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {}
                })
              }
            })
            .catch(() => {})
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    seatSizeChange (val) {
      this.pageSize = val
      this.loadData()
    },
    seatFindPage (val) {
      this.currentPage = val
      this.loadData()
    },
    greenLight () {
      console.log('currentRow' + JSON.stringify(this.currentRow))
      // _this.dialogGreenLightVisible = true
      if (this.currentRow === '') {
        this.$message('还没有选择放行车辆')
      } else {
        this.dialogGreenLightVisible = true
      }
    },
    queryByNum () {
      var _this = this
      var key = _this.queryCarNum
      key = encodeURI(key)
      queryParkInVehicle(_this.currentPage, _this.pageSize, key)
        .then(function (response) {
          if (response.code === '0') {
            _this.inoutData = response.data.rows || []
            _this.total = response.data.total
          }
        })
        .catch(
          function (error) {
            this.loading2 = false
            console.log(error)
          }.bind(this)
        )
    }
  }
}
</script>
<style lang="less" scoped>
.inoutControl{
  position: relative;
  z-index: 9999;
  width: 100%;
  min-height: 400px;
}
.inout-cont {
  margin-top:20px;
}
.toolbar{
  text-align: right;
  margin-top: 20px;
  float:none;
}
.check-img{
  padding: 15px;
  text-align: center;
  img{
    width: 640px;
    height: 480px;
  }
}
</style>
<style lang="less">
.table-scroll{
  .table-format{
    .el-table__header-wrapper{
      .el-table__header{
        width:auto!important;
      }
    }
  }
}
.inoutControl{
  .in-record{
    .el-dialog{
      margin-top:48px!important;
      width:70%;
    }
  }
}
</style>




