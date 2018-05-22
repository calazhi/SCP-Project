<template>
  <div id='deadLogMgmtVue'>
    <!-- DeadLogListData -->
    <el-row class="button-align deadLog-title">
      <el-col :span="24">
        <el-form :inline="true" :model="deadLogListSearch" :rules="searchRules" ref="deadLogListSearch" class="demo-form-inline" align= "left">
          <el-form-item prop="appid">
            <el-input @keyup.native.enter="onSearchDeadLogSubmit('deadLogListSearch')" v-model="deadLogListSearch.appid" placeholder="请输入应用编码"></el-input>
          </el-form-item>
          <el-form-item prop="topic">
            <el-input @keyup.native.enter="onSearchDeadLogSubmit('deadLogListSearch')" v-model="deadLogListSearch.topic" placeholder="请输入事件组编码"></el-input>
          </el-form-item>
          <el-form-item prop="msgid">
            <el-input @keyup.native.enter="onSearchDeadLogSubmit('deadLogListSearch')" v-model="deadLogListSearch.msgid" placeholder="请输入消息标识"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class = "cancel-btn" @click="resetSearch">清空</el-button>
            <el-button class = "search-btn" type="primary" @click="onSearchDeadLogSubmit('deadLogListSearch')">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="button-align">
      <el-col :span="24">
        <el-table :data="deadLogTableData" style="width: 100%" border height="550">
          <el-table-column prop="id" label="ID" v-if="boolean" align="left"></el-table-column>
          <el-table-column prop="appid" label="应用编码" align="left" width="100"></el-table-column>
          <el-table-column prop="topic" label="事件组编码" align="left" width="150"></el-table-column>
          <el-table-column prop="msgid" label="消息标识" align="left" width="150"></el-table-column>
          <el-table-column prop="createTime" :formatter="dateFormat" label="创建时间" align="left" width="150"></el-table-column>
          <el-table-column prop="payload" label="消息内容" align="left"></el-table-column>
          <el-table-column label="操作" align="center" width="60">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" content="删除" placement="top-start">
                <span @click="removeDeadLog(scope.$index, scope.row)" style="cursor:pointer" class="el-icon-delete"></span>
              </el-tooltip>
            </template> 
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          align="left"
          style="margin-top:15px;"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.deadLog-title {
  margin-bottom:-20px;
}

</style>

<script>
import {formatDate} from '../assets/js/tool.js'
import {getDeadLogListData, deleteDeadLog} from '@/views/IotBusMgmt/apis/iotbus_deadlogmgmt_api'
// import {Loading} from 'element-ui'

export default {
  name: 'iotDeadLogMgmt',
  data () {
    return {
      boolean: false,
      deadLogTableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      deadLogListSearch: {
        appid: null,
        topic: null,
        msgid: null
      },
      searchRules: {
        appid: [
          {min: 0, max: 16, message: '长度不能超过16个字符'},
          {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\''}
        ],
        topic: [
          {min: 0, max: 64, message: '长度不能超过32个字符'},
          {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\''}
        ],
        msgid: [
          {min: 0, max: 256, message: '长度不能超过256个字符'},
          {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\''}
        ]
      }
    }
  },
  methods: {
    dateFormat (row, column) {
      var time = row[column.property]
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.deadLogTableData = []
      this.loadDeadLogData()
    },
    loadDeadLogData () {
      var params = {
        page: this.currentPage,
        size: this.pageSize,
        appid: this.deadLogListSearch.appid,
        topic: this.deadLogListSearch.topic,
        msgid: this.deadLogListSearch.msgid
      }
      getDeadLogListData(params)
        .then(function (result) {
          this.deadLogTableData = result.data.rows
          this.total = result.data.total
        }.bind(this)).catch(
          function (error) {
            console.info(error)
          }
        )
    },
    removeDeadLog (index, item) {
      var data = item
      this.$confirm('确定要删除"' + data.msgid + '"?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          key: data.id
        }
        deleteDeadLog(params).then(
          function (result) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.deadLogTableData = []
            this.loadDeadLogData()
          }.bind(this)
        )
        .catch(
            function (error) {
              console.info(error)
            }
          )
      })
    },
    onSearchDeadLogSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.currentPage === 1) {
            this.deadLogTableData = []
            this.loadDeadLogData()
          } else {
            this.currentPage = 1
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetSearch () {
      this.resetForm('deadLogListSearch')
      this.deadLogTableData = []
      this.loadDeadLogData()
    },
    resetForm (formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    showDeadMessageList () {
      this.$nextTick(() => {
        this.handleCurrentChange(this.currentPage)
      })
    }
  },
  mounted () {
    // this.showAppRTChart()
  }
}
</script>
