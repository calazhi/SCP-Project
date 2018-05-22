<template>
  <div id="qrCodes">
    <el-form id="queryForm" :inline="true" :model="listQuery" ref="listQuery">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <el-form-item label="二维码类型">
            <el-select v-model.trim="listQuery.cardType" clearable placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="住户" value="QR-R"></el-option>
                <el-option label="访客" value="QR-V"></el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">    
          <el-form-item label="访客姓名">
            <el-input @keyup.enter.native="queryByFilters" placeholder="访客姓名" v-model.trim="listQuery.ownerName"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="住户姓名">
            <el-input @keyup.enter.native="queryByFilters" placeholder="住户姓名" v-model.trim="listQuery.residentName"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="queryByFilters">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="12">
          <el-form-item label="有效时段">
            <el-date-picker v-model.trim="listQuery.validTime" type="datetime" @change="dateSelected($event, 'validTime')" placeholder="选择有效开始时间"/>
            <span>至</span>
            <el-date-picker v-model.trim="listQuery.expireTime" type="datetime" @change="dateSelected($event, 'expireTime')" placeholder="选择有效结束时间"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">    
          <el-form-item>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>       
      </el-row>
    </el-form>

    <el-table :data="tableData" style="width: 100%" max-height="580" element-loading-text="拼命加载中">
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <!-- <el-table-column prop="id" label="id" align="center" v-if=""></el-table-column>  -->
      <el-table-column prop="uniqueCode" label="二维码编码" align="center"></el-table-column>
      <el-table-column prop="cardType" label="二维码类型" align="center" :formatter="cardTypeFormat"></el-table-column>
      <el-table-column prop="ownerName" label="访客姓名" align="center"></el-table-column>
      <el-table-column prop="residentName" label="住户姓名" align="center"></el-table-column>
      <el-table-column prop="validTime" label="生效时间" align="center" :formatter="validTimeFormat"></el-table-column>
      <el-table-column prop="expireTime" label="失效时间" align="center" :formatter="expireTimeFormat"></el-table-column>
      <el-table-column prop="createUser" label="创建人" align="center"></el-table-column>
    </el-table>

    <div class="block">
        <div class="r_page">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
          </el-pagination>
        </div>
    </div>
  
  </div>
</template>
<style type="text/css" scoped>
#queryForm {
  padding-top: 20px;
  margin-bottom: 30px;
  height:150px;
}
.block {
  margin-top: 20px;
  width: 100%;
}
.block .r_page {
  padding-left: 40%;
  width: 20%;
}
</style>
<script type="text/javascript">
import { getUserListByPage } from '@/views/CardMgmtApp/apis'

export default {
  data () {
    return {
      tableData: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      selectDate: '',
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        name: '',
        address: '',
        id: ''
      },
      loading2: false,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        cardType: '',
        residentName: '',
        ownerName: '',
        validTime: '',
        expireTime: ''
      }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    // 加载数据
    loadData () {
      this.loading2 = true
      this.listQuery.currentPage = this.currentPage
      this.listQuery.pageSize = this.pageSize
      getUserListByPage(this.listQuery)
        .then(
          function (result) {
            console.log('cardmgmt_qrcode get data by page queryparams:' + JSON.stringify(this.listQuery))
            console.log('vardmgmt_qrcode get data by page result:' + JSON.stringify(result.data.list))
            this.tableData = result.data.list
            this.total = result.data.pageCount
            this.loading2 = false
          }.bind(this)
        )
        .catch(
          function (error) {
            this.loading2 = false
            console.log(error)
          }.bind(this)
        )
    },
    // 改变分页大小
    handleSizeChange (val) {
      this.pageSize = val
      this.loadData()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.currentPage = val
      this.loadData()
    },
    // 重置搜选宽内容
    resetForm: function () {
      this.listQuery = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        cardType: '',
        ownerName: '',
        residentName: '',
        validTime: '',
        expireTime: ''
      }
    },
    queryByFilters () {
      this.loadData()
    },
    cardTypeFormat (row, column, cellValue) {
      if (row.cardType === 'QR-V') {
        return '访客二维码'
      }
      if (row.cardType === 'QR-R') {
        return '住户二维码'
      }
    },
    validTimeFormat (row, column, cellValue) {
      if (row.validTime) {
        return timeFormatter(row.validTime)
      }
    },
    expireTimeFormat (row, column, cellValue) {
      if (row.expireTime) {
        return timeFormatter(row.expireTime)
      }
    },
    dateSelected (val, flag) {
      console.log('val=' + val)
      if (val !== '') {
        var currentYear = new Date(val).getFullYear()
        if (currentYear - 2999 > 0) {
          this.$alert('选择的查询日期不能超过2999年', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.listQuery[flag] = ''
            }
          })
        }
      }
    }
  }
}
function timeFormatter (millionSeconds) {
  var time = new Date(millionSeconds)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
}
function add0 (m) {
  return m < 10 ? '0' + m : m
}
</script>
