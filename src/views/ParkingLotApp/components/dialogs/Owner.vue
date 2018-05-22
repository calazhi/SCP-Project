<template>
  <div id="ower" class="ownerDiog">
    <el-form :inline="true">
      <el-form-item>
          <el-input placeholder="请输入人员姓名" v-model="queryValue" ref="queryValue" @change="onNameCheck" style="width:100%"></el-input>
          <el-input type="text" style="display:none" />
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="queryOwers">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-scroll">
      <el-table :data="authBaseData" ref="authBaseData" class="table-format" border max-height="540" 
        highlight-current-row  @current-change="handleCurrentChange" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="ownerName" label="人员姓名" ></el-table-column>
        <el-table-column prop="ownerHouseNum" label="房屋号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="phone" label="手机号" ></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
    </div>
    <el-col class="toolbar" style="text-align:right; margin:15px 0">
      <el-pagination @size-change="handleSizeChange" @current-change="findPage" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" background layout="total, sizes, prev, pager, next" :total="total">
      </el-pagination>
    </el-col>
    <!-- <section slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="innerVisible = false">取 消</el-button>
      <el-button type="primary" @click="selectOwer">确认</el-button>
    </section> -->
  </div>
</template>
<script>
import { queryOwner } from '@/views/ParkingLotApp/apis'
export default {
  data () {
    return {
      authBaseData: [],
      queryValue: '',
      selectAuto: '',
      // owerLoad: false,
      currentPage: 1,
      total: 0,
      sizes: 10
    }
  },
  mounted () {
    this.queryByOwer(this.currentPage, this.sizes, this.queryValue)
  },
  methods: {
    queryByOwer (currentPage, sizes, ownerName) {
      let _this = this
      // _this.owerLoad = true
      ownerName = encodeURI(ownerName)
      queryOwner(currentPage, sizes, ownerName).then(function (response) {
        // _this.owerLoad = false
        if (response.code === '0') {
          _this.authBaseData = response.data.rows
          _this.total = response.data.total
        } else {
          _this.$message({
            message: '获取数据异常',
            type: 'fail'
          })
        }
      })
      .catch(function () {
        // _this.owerLoad = false
        _this.$message({
          message: '获取数据失败',
          type: 'fail'
        })
      })
    },
    findPage (currentPage) {
      this.currentPage = currentPage
      this.queryByOwer(this.currentPage, this.sizes, this.queryValue)
    },
    handleSizeChange (val) {
      this.sizes = val
      this.queryByOwer(this.currentPage, this.sizes, this.queryValue)
    },
    handleCurrentChange (val) {
      this.selectAuto = val
    },
    queryOwers () {
      this.queryByOwer(1, 10, this.queryValue)
    },
    onNameCheck: function () {
      if (this.queryValue !== '') {
        if (!/^[\u4e00-\u9fa5A-Za-z0-9·]+$/.test(this.queryValue)) {
          this.queryValue = ''
          this.$message({
            message: '请输入正确中英文姓名',
            type: 'warning'
          })
        }
      }
    }
  }
}
</script>
<style lang="less">
.table-scroll{
  .el-table{
    .el-table__body-wrapper{
      td{
        padding:10px 0;
      }
    }
  }
  .table-format{
    .el-table__header-wrapper{
      .el-table__header{
        width:auto!important;
      }
    }
  }
}
</style>


