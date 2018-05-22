<template>
  <div>
		<template>
      <el-form :inline="true" :model="queryForm" ref="queryForm">
         <el-form-item label="姓名" prop="name">
          <el-input placeholder="请输入姓名" v-model="queryForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="时间范围" prop="datetimeRange">
          <el-date-picker v-model="queryForm.datetimeRange" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="开门类型" prop="passType">
          <el-select v-model="queryForm.passType">
            <el-option v-for="item in passTypeOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetForm('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
		</template>
    <!-- 表格渲染 -->
    <div class="dialog-padding">
      <el-table ref="tableData" max-height="700" :data="tableData" highlight-current-row class="table-format" border >
        <el-table-column type="index" prop="messageId"></el-table-column>
        <el-table-column prop="userName" label="姓名" width="100"></el-table-column>
        <el-table-column prop="userType" label="人员类型" width="80" :formatter="personTypeFormate"></el-table-column>
        <el-table-column prop="deviceName" label="设备名称" width="170" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceCode" label="设备编码" width="190" show-overflow-tooltip></el-table-column>
        <el-table-column prop="parentDeviceCode" label="父设备编码" width="190" show-overflow-tooltip></el-table-column>
        <el-table-column prop="recordTime" label="开门时间"  width="160" :formatter="datetimeFormate"></el-table-column>
        <el-table-column prop="passType" label="开门类型" width="80" :formatter="passTypeFormate"></el-table-column>
        <el-table-column prop="orgName" label="位置" show-overflow-tooltip></el-table-column>
        <el-table-column prop="credenceNo" label="凭证" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="linkcred" v-if="(scope.row.eventType === 30000 || scope.row.eventType === 30008 || scope.row.eventType === 30306) && scope.row.credenceNo" @click="handleShowFacePic(scope.$index,scope.row)">查看</span>
            <span v-else>{{scope.row.credenceNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="imageUrl" label="抓拍图片">
          <template slot-scope="scope">
            <span class="linkcred" v-if="scope.row.imageUrl" @click="handleShowImage(scope.$index,scope.row)">查看</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="开门描述"></el-table-column>
      </el-table>

    </div>

    <el-dialog title="抓拍图片" :visible.sync="imageVisible" width="350px" height="400px">
        <img :src= this.imagePath class="imageSize"/>
    </el-dialog>

    <el-dialog title="人脸图片" :visible.sync="facePicVisible" width="350px" height="400px">
        <img :src= this.facePicPath class="imageSize"/>
    </el-dialog>

  <el-row class="page-row">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 50]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </el-row>

  </div>
</template>

<script>
import { listEntryAndExitRecords, formatDate } from '@/views/AccessControlApp/apis'
const personTypeMap = {
  1: '业主',
  2: '业主家属',
  3: '租客',
  4: '访客',
  5: '物业',
  6: '快递',
  7: '外卖',
  8: '其他'
}
export default {
  data () {
    return {
      tableData: [],
      passTypeOpts: [{'value': undefined, 'label': '全部'}, {'value': 0, 'label': '进'}, {'value': 1, 'label': '出'}],
      total: 0,
      page: 1,
      size: 20,
      queryForm: {
        passType: 0,
        name: undefined,
        datetimeRange: []
      },
      imageVisible: false,
      imagePath: '',
      facePicVisible: false,
      facePicPath: ''
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.queryForm.page = this.page
      this.queryForm.size = this.size
      if (this.queryForm.datetimeRange.length > 0) {
        this.queryForm.startTime = this.queryForm.datetimeRange[0]
        this.queryForm.endTime = this.queryForm.datetimeRange[1]
      }
      listEntryAndExitRecords(JSON.stringify(this.queryForm))
      .then(res => {
        this.total = res.data.total
        this.tableData = res.data.data
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
      this.page = val
      this.loadData(this.queryForm)
    },
    // 改变分页大小
    handleSizeChange (val) {
      this.size = val
      this.loadData(this.queryForm)
    },
    handleShowFacePic (index, row) {
      this.facePicVisible = true
      this.facePicPath = row.credenceNo
    },
    // 格式化人员类型
    personTypeFormate: (row, column) => {
      return personTypeMap[row.userType]
    },
    // 格式化开门类型
    passTypeFormate: row => {
      if (row.passType === 0) {
        return '进'
      } else if (row.passType === 1) {
        return '出'
      }
    },
    // 格式化开门时间
    datetimeFormate: row => {
      return formatDate(row.recordTime)
    },
    // 查看抓拍图片
    handleShowImage (index, row) {
      this.imageVisible = true
      this.imagePath = row.imageUrl
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
  .imageSize {
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
