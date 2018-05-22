<template>

<div>
  <el-row>
    <!-- 工具条 -->
    <el-col :span="24" class="toolbar">    
      <el-form :inline="true" :model="form">
        <el-form-item label="人员类型" >
          <el-select v-model="personType"  @change="handleChangePersonType" placeholder="请选择">
            <el-option
              v-for="item in personTypeItems"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" >
          <el-input v-model.trim="form.userName" placeholder="请输入人员姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="证件号" v-if="false">
          <el-input v-model.trim="form.cardNo" placeholder="请输入证件号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="queryOwner(form)">查询</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="showBatchAuth">批量授权</el-button>
        </el-form-item>
      </el-form>  
    </el-col>
    <!-- 列表 -->
    <el-col  class="dialog-padding">
      <el-table :data="tableUsers" max-height='700' highlight-current-row class="table-format" border >
        <el-table-column width="50" type="index"></el-table-column>
        <el-table-column label="人员编号" prop="userId" v-if="false"></el-table-column>

        <el-table-column label="姓名" prop="userName"></el-table-column>
        <el-table-column label="证件类型" prop="idenType"></el-table-column>
        <el-table-column label="证件号码" prop="idenNum"></el-table-column>
        <el-table-column label="人员类型" prop="userType" v-if="false"></el-table-column>
        <el-table-column label="人脸" prop="facePic">
          <template slot-scope="scope">
            <span class="linkfacePic" v-if="scope.row.facePic !== null" @click="handleShowFacePic(scope.$index,scope.row)">点击查看人脸</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="指纹" prop="finger" :formatter="fingerFaceFormat"></el-table-column>
        <el-table-column label="开始时间" prop="startDate" :formatter="formatDate"></el-table-column>
        <el-table-column label="结束时间" prop="endDate" :formatter="formatDate"></el-table-column>
        <el-table-column label="状态" prop="authFlag" :formatter="authStatusFormat"></el-table-column>
        <!-- <el-table-column label="密码" prop="password" :formatter="fingerFaceFormat"></el-table-column> -->
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="handleView($event, scope.$index, scope.row)" v-if="scope.row.authId">查看</el-button>
              <el-button type="text" @click="handleEdit($event, scope.$index, scope.row)" v-if="scope.row.authId && scope.row.authFlag === 1">修改</el-button>
              <el-button type="text" @click="handleDisable(scope.$index, scope.row)" v-if="scope.row.authId && scope.row.authFlag === 1">禁用</el-button>
              <el-button type="text" @click="handleAdd($event, scope.$index, scope.row)" v-if="!scope.row.authId">授权</el-button>
              <el-button type="text" @click="handleEnable(scope.$index, scope.row)" v-if="scope.row.authId && scope.row.authFlag === 0">启用</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <el-row class="page-row">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </el-row>
  <doorauthorityview v-if="viewDialogVisible" :viewDialogVisible="viewDialogVisible" :userRowData="userRowData" @dialogClose="noticeDialogClose" @refreshPerson="refreshData"></doorauthorityview>
  <doorauthorityedit v-if="editDialogVisible" :editDialogVisible="editDialogVisible" :userRowData="userRowData" @dialogClose="noticeDialogClose" @refreshPerson="refreshData"></doorauthorityedit>
  <batchdoorauth  :dialogVisible.sync="batchAuthDialogVisible" :personType="personType" v-if="batchAuthDialogVisible" @dialogClose="noticeBatchAuthDialogClose" @refreshPerson="refreshData"></batchdoorauth>

  <el-dialog title="人脸图片" :visible.sync="facePicVisible" width="350px" height="400px">
      <img :src= this.facePicPath class="facePicSize"/>
  </el-dialog>
</div>

</template>

<script>
import DoorAuthorityView from '@/views/AccessControlApp/components/DoorAuthorityView'
import DoorAuthorityEdit from '@/views/AccessControlApp/components/DoorAuthorityEdit'
import BatchDoorAuthorityEdit from '@/views/AccessControlApp/components/BatchDoorAuthorityEdit'
import { getOwners } from '@/views/AccessControlApp/apis/authMgmt'
import { enableUserAuthorInfo, formatDate } from '@/views/AccessControlApp/apis/index'

export default {
  data () {
    return {
      viewDialogVisible: false,
      editDialogVisible: false,
      userRowData: {
        authorStatus: '',
        authorPeriod: {
          startDate: '',
          endDate: ''
        },
        userId: ''
      },
      svalue: '',
      evalue: '',
      facePicVisible: false,
      form: {
        userName: '',
        cardNo: ''
      },
      personType: 0,
      personTypeItems: [
        { value: 0, label: '住户（含业主、业主家属与租客）' },
        { value: 1, label: '物业人员' }
      ],
      tableUsers: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      batchAuthDialogVisible: false,
      facePicPath: undefined
    }
  },
  mounted () {
    this.loadData(this.personType)
  },
  components: {
    doorauthorityview: DoorAuthorityView,
    doorauthorityedit: DoorAuthorityEdit,
    batchdoorauth: BatchDoorAuthorityEdit
  },
  methods: {
    handleView: function (event, index, row) {
      this.userRowData = row
      this.userRowData.personType = this.personType
      this.viewDialogVisible = true
    },
    handleAdd: function (event, index, row) {
      this.userRowData = row
      this.userRowData.personType = this.personType
      this.editDialogVisible = true
    },
    handleEdit: function (event, index, row) {
      this.userRowData = row
      this.userRowData.personType = this.personType
      this.editDialogVisible = true
    },
    // 禁用
    handleDisable: function (index, row) {
      enableUserAuthorInfo(row.authId, 0)
      .then(res => {
        if (res.code === '00000') {
          this.$message({
            message: '禁用成功！',
            type: 'success'
          })
          this.loadData(this.personType)
        } else {
          this.$message({
            message: '禁用失败，请联系管理员!',
            type: 'error'
          })
        }
      })
    },
    // 启用
    handleEnable: function (index, row) {
      enableUserAuthorInfo(row.authId, 1)
      .then(res => {
        if (res.code === '00000') {
          this.$message({
            message: '启用成功！',
            type: 'success'
          })
          this.loadData(this.personType)
        } else {
          this.$message({
            message: '启用失败，请联系管理员!',
            type: 'error'
          })
        }
      })
    },
    noticeDialogClose: function (event, value) {
      this.viewDialogVisible = value
      this.editDialogVisible = value
    },
    noticeBatchAuthDialogClose: function (event, value) {
      this.batchAuthDialogVisible = value
    },
    // 加载数据
    loadData (type) {
      let _this = this
      _this.loading = true
      getOwners(_this.currentPage, _this.pageSize, type, _this.form)
        .then(res => {
          _this.total = res.total
          _this.tableUsers = res.rows
        })
        .catch(error => {
          _this.loading = false
          console.log(error)
        })
    },
    // 格式化指纹人脸显示
    fingerFaceFormat: function (row, column) {
      var fingerFace = row[column.property]
      if (fingerFace === undefined || fingerFace === null || fingerFace === '') {
        return '无'
      }
      return '有'
    },
    queryOwner: function (form) {
      console.log('查询人员信息...')
      this.loadData(this.personType)
    },
    // 改变分页大小
    handleSizeChange (val) {
      this.pageSize = val
      this.loadData(this.personType)
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.currentPage = val
      this.loadData(this.personType)
    },
    // 处理选择人员类型
    handleChangePersonType: function (value) {
      this.form = {}
      this.tableUsers = []
      this.currentPage = 1
      this.loadData(this.personType)
    },
    // 显示批量授权界面
    showBatchAuth () {
      this.batchAuthDialogVisible = true
    },
    // 显示人脸图片
    handleShowFacePic (index, row) {
      this.facePicVisible = true
      this.facePicPath = row.facePic
    },
    // 格式化授权状态
    authStatusFormat (row, column) {
      let authId = row.authId
      if (authId === undefined || authId === null || authId === '') {
        return '未授权'
      } else {
        let authFlag = row.authFlag
        if (authFlag === 0) {
          return '禁用'
        }
        return '正常'
      }
    },
    // 格式化时间
    formatDate: (row, column) => {
      return formatDate(row[column.property])
    },
    // 刷新人员列表
    refreshData (personType) {
      this.loadData(personType)
    }
  }
}
</script>

<style lang="less" scoped>
  .page-row {
    text-align: right;
    margin-top: 5px;
   }
  .toolbar {
    background:#f2f2f2;
    padding:10px;
    margin:10px 0px
  }
  .toolbar .el-form-item {
    margin-bottom:10px
  }
  .facePicSize {
    width: 100%;
    height: 100%;
  }
  .linkfacePic {
    color: blue;
  }
  .el-select {
    width: 270px
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
