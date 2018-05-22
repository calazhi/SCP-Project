<template>
  <div>
		<template>
      <el-form :inline="true" :model="queryForm" ref="queryForm">
         <el-form-item label="姓名" prop="name">
          <el-input placeholder="请输入姓名" v-model="queryForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="证件号码" prop="idenNum">
          <el-input placeholder="请输入证件号码" v-model="queryForm.idenNum" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input placeholder="请输入父或子设备编号" v-model="queryForm.deviceCode" clearable></el-input>
        </el-form-item>
        <el-form-item label="子设备名称" prop="subDeviceName">
          <el-input placeholder="请输入子设备名称" v-model="queryForm.subDeviceName" clearable></el-input>
        </el-form-item>
        <el-form-item label="凭证编号" prop="credenceNo">
          <el-input placeholder="请输入凭证编号" v-model="queryForm.credenceNo" clearable></el-input>
        </el-form-item>
        <el-form-item label="下发状态" prop="status">
          <el-select v-model="queryForm.status">
            <el-option v-for="item in statusOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新时间" prop="datetimeRange">
          <el-date-picker v-model="queryForm.datetimeRange" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetForm('queryForm')">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="handleBatchDelete()" :disabled="this.sels.length === 0">批量删除</el-button>
        </el-form-item>
      </el-form>
		</template>
    <!-- 表格渲染 -->
    <div class="dialog-padding">
      <el-table ref="tableData" max-height="700" :data="tableData" highlight-current-row @selection-change="handleSelsChange" class="table-format" border >
        <el-table-column type="selection" prop="messageId"></el-table-column>
        <el-table-column prop="name" label="姓名" width="80"></el-table-column>
        <el-table-column prop="userType" label="人员类型" width="80"></el-table-column>
        <el-table-column prop="idenType" label="证件类型" width="80" :formatter="formatIdType"></el-table-column>
        <el-table-column prop="idenNum" label="证件号" width="165"></el-table-column>
        <el-table-column prop="deviceCode" label="父设备编号" width="175" show-overflow-tooltip></el-table-column>
        <el-table-column prop="subDeviceCode" label="子设备编号" width="175" show-overflow-tooltip></el-table-column>
        <el-table-column prop="subDeviceName" label="子设备名称" width="170" show-overflow-tooltip></el-table-column>
        <el-table-column prop="credenceType" label="凭证类型" :formatter="formatCredenceType"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="credenceNo" label="凭证编号" width="110" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="linkcred" v-if="scope.row.credenceType === 7" @click="handleShowFacePic(scope.$index,scope.row)">点击查看人脸</span>
            <a v-else-if="scope.row.credenceType === 0" :href="scope.row.credenceNo" target="_blank">点击查看文件</a>
            <span v-else>{{scope.row.credenceNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="下发状态" :formatter="formatStatus" width="80"></el-table-column>
        <el-table-column prop="errorMessage" label="失败原因" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" :formatter="formatDate" width="153" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope" style="width:100px">
            <el-button size="medium" type="text" @click="handleResend(scope.$index,scope.row)" :disabled="scope.row.sendDownVisible">重发</el-button>
            <el-button size="medium" type="text" @click="handleDeleteRecord(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="人脸图片" :visible.sync="facePicVisible" width="350px" height="400px">
        <img :src= this.facePicPath class="facePicSize"/>
    </el-dialog>

  <el-row class="page-row">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </el-row>

  </div>
</template>

<script>
import { listSendDownRecords, deleteRecord, resend, batchDelete, formatDate } from '@/views/AccessControlApp/apis'
// 凭证类型map
const credenceTypeMap = {
  1: 'ID卡',
  2: 'IC卡（TypeA）',
  3: 'ID卡（TypeB）',
  4: 'CPU卡',
  5: '车牌',
  6: '指纹',
  7: '人脸',
  8: '纸票/二维码',
  9: '蓝牙',
  10: '密码',
  11: '动态密码'
}
const idTypeMap = {
  '111': '身份证',
  '114': '军官证',
  '133': '学生证',
  '335': '驾驶证',
  '414': '护照',
  '990': '其它'
}
export default {
  data () {
    return {
      tableData: [],
      statusOpt: [{'value': undefined, 'label': '全部'}, {'value': 0, 'label': '成功'}, {'value': 1, 'label': '失败'}],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      sels: [],
      queryForm: {
        idenNum: undefined,
        deviceCode: undefined,
        subDeviceName: undefined,
        credenceNo: undefined,
        status: 1,
        name: undefined,
        datetimeRange: []
      },
      facePicVisible: false,
      facePicPath: ''
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.queryForm.currentPage = this.currentPage
      this.queryForm.pageSize = this.pageSize
      if (this.queryForm.datetimeRange.length > 0) {
        this.queryForm.startTime = this.queryForm.datetimeRange[0]
        this.queryForm.endTime = this.queryForm.datetimeRange[1]
      }
      listSendDownRecords(JSON.stringify(this.queryForm))
      .then(res => {
        this.total = res.data.total
        this.tableData = res.data.data
        if (this.tableData !== null && this.tableData.length > 0) {
          for (let data of this.tableData) {
            data.sendDownVisible = false
            if (data.status === 0) {
              data.sendDownVisible = true
            }
          }
        }
      })
    },
    handleSearch () {
      this.loadData()
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.currentPage = val
      this.loadData(this.queryForm)
    },
    // 改变分页大小
    handleSizeChange (val) {
      this.pageSize = val
      this.loadData(this.queryForm)
    },
    formatIdType (row, column, cellValue) {
      return idTypeMap[cellValue]
    },
    // 格式化凭证类型
    formatCredenceType (row, column, cellValue) {
      return credenceTypeMap[cellValue]
    },
    formatStatus (row, column, cellValue) {
      if (cellValue === 0) {
        return '成功'
      } else {
        return '失败'
      }
    },
    handleDeleteRecord (index, row) {
      this.$confirm('确定要删除该条下发记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRecord(row.messageId)
        .then(res => {
          if (res.code === '00000') {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.loadData()
          } else {
            this.$message({
              type: 'warning',
              message: '删除失败' + res.message
            })
          }
        })
      })
    },
    handleResend (index, row) {
      resend(row.messageId)
      .then(res => {
        if (res.code === '00000') {
          this.$message({
            type: 'success',
            message: '操作成功，稍后更新下发状态！'
          })
          this.loadData()
        } else {
          this.$message({
            type: 'error',
            message: '重发失败，请稍后再试！' + res.message
          })
        }
      })
    },
    handleSelsChange (sels) {
      this.sels = []
      for (let sel of sels) {
        this.sels.push(sel.messageId)
      }
    },
    handleBatchDelete (row) {
      this.$confirm('确定要删除选中的下发记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDelete(this.sels)
        .then(res => {
          if (res.code === '00000') {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.loadData()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败，请稍后再试！' + res.message
            })
          }
        })
      })
    },
    handleShowFacePic (index, row) {
      this.facePicVisible = true
      this.facePicPath = row.credenceNo
    },
    // 格式化时间
    formatDate: (row, index) => {
      return formatDate(row.updateTime)
    }
  }
}
</script>

<style lang="less" scoped>
  .el-input {
    width: 200px
  }
  .el-select {
    width: 150px
  }
  .page-row {
    text-align: right;
    margin-top: 5px
  }
  .linkcred {
    color: blue;
  }
  .facePicSize {
    width: 100%;
    height: 100%;
  }
</style>

<style lang="less">
  .dialog-padding {
    .el-dialog__body {
      padding: 10px
    }
    .table-format {
      .el-table__header-wrapper{
        .el-table__header{
          width:auto!important;
        }
      }
    }
  }
</style>
