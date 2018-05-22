<template>
<div class = "ui-common">
  
  <!-- 主布局 Start -->

  <!-- 查询&新增区域 -->
  <div>  
    <el-row :gutter="20">
      <el-col :span="8">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <!-- <el-button @click="multipleSub()" type="primary" icon="el-icon-view">批量订阅
              </el-button> -->
              <el-button @click="showAddIotSubDialog()" plain type="primary" icon="el-icon-circle-plus-outline" style="margin-center: 10px" >新增订阅
              </el-button>
            </el-form-item>
          </el-form>
      </el-col>
      <el-col :span="16">
        <div class="text-right">
          <el-form :inline="true" :model="iotSubListSearch" :rules="searchRules"  ref="iotSubListSearch" class="demo-form-inline">
            <!-- <el-form-item label="订阅编码" prop="id">
              <el-input @keyup.native.enter="handleSearch('iotSubListSearch')" v-model="iotSubListSearch.id" placeholder="请输入订阅编码"></el-input>
            </el-form-item> -->
            <el-form-item label="应用编码" prop="appCode">
              <el-input @keyup.native.enter="handleSearch('iotSubListSearch')" v-model="iotSubListSearch.appCode" placeholder="请输入应用编码"></el-input>
            </el-form-item>
            <el-form-item label="事件组编码" prop="topicCode">
              <el-input @keyup.native.enter="handleSearch('iotSubListSearch')" v-model="iotSubListSearch.topicCode" placeholder="请输入事件组编码"></el-input>
            </el-form-item>
            <!-- <el-form-item label="订阅状态" prop="subStatus">
              <el-select size="middle" v-model="iotSubListSearch.subStatus" placeholder="请选择订阅状态" @change="searchSubmit">
                <el-option label="全部" value="全部"></el-option>
                <el-option label="已订阅" value="已订阅"></el-option>
                <el-option label="未订阅" value="未订阅"></el-option>          
              </el-select>
            </el-form-item> -->
            <el-form-item>
              <el-button class = "cancel-btn" @click="resetSearch">清空</el-button>
              <el-button class = "search-btn" type="primary" @click="handleSearch('iotSubListSearch')">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>    
  <div class="border-divide"></div>
  <!-- Sub list显示区 -->   
  <div class="flex-1">
    <el-table
      :data="iotBusSubList"
      style="width: 100%">
      <!-- @selection-change="handleSelectionChange"> -->
      <!-- <el-table-column type="selection"></el-table-column> -->
      <el-table-column label="订阅编号" prop="id" width="150"></el-table-column>    
      <el-table-column label="应用编码" prop="appCode" width="250"></el-table-column>
      <el-table-column label="事件组编码" prop="topicCode"></el-table-column>
      <!-- <el-table-column label="是否订阅" prop="enableFlag" :formatter="enableText"></el-table-column> -->
      <!-- <el-table-column label="创建人" prop="createUser"></el-table-column> -->
      <el-table-column label="创建时间" prop="createTime" :formatter="dateFormat"></el-table-column>
      <!-- <el-table-column label="更新人" prop="updateUser"></el-table-column>
      <el-table-column label="最后更新时间" prop="updateTime" :formatter="dateFormat"></el-table-column> -->
            
      <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <!-- <el-tooltip class="item" effect="light" content="更新订阅" placement="top-start">
                <span @click="handleEdit(scope.$index, scope.row)" style="cursor:pointer; margin-right:10px" class="el-icon-edit"></span>
              </el-tooltip> -->
              <el-tooltip class="item" effect="light" content="删除" placement="top-start">
                <span @click="removeData(scope.$index, scope.row)" style="cursor:pointer" class="el-icon-delete"></span>
              </el-tooltip>
          </template>
      </el-table-column>
    </el-table>

    <!-- 分页显示区 -->  
    <div class="margin-top-20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>


  <!-- 主布局 End -->

<!-- 弹出对话框页面 -->
  <!-- 新增系统订阅对话框 -->
  <el-dialog
    title="新增订阅"
    :close-on-click-modal=false
    :close-on-press-escape=false
    :visible.sync="addIotSubDialogVisible"
    width="27%"
    :before-close="handleClose">

    <el-form :model="newIotSub" :rules="rules" ref="newIotSub" label-width="110px" class="demo-ruleForm">
      <el-form-item label="应用" prop="appCode">
        <el-select size="small" v-model="newIotSub.appCode" filterable placeholder="请选择应用编码" style="width:300px">
          <el-option
          v-for="item in appList"
          :label="item.appCode"
          :key="item.appCode"
          :value="item.appCode"></el-option>
        </el-select>
        <!-- <el-autocomplete popper-class="my-autocomplete" class="inline-input" v-model="newIotSub.appCode" :fetch-suggestions="queryAppCode" placeholder="请选择应用编码"></el-autocomplete> -->
      </el-form-item>
      <el-form-item label="事件组" prop="topicCode">
        <el-select size="small" v-model="newIotSub.topicCode" filterable placeholder="请选择事件组编码" style="width:300px">
          <el-option
          v-for="item in topicList"
          :label="item.topicCode"
          :key="item.topicCode"
          :value="item.topicCode"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否启用" prop="enableFlag">
        <el-switch v-model="newIotSub.enableFlag">
        </el-switch>
      </el-form-item> -->

      <div class="user-button" align="center">
      <!-- <el-form-item class="text-right add-IotSub-button"> -->
        <el-button type="primary" @click="submitNewForm('newIotSub')">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      <!-- </el-form-item> -->
      </div>
    </el-form>  
  </el-dialog>

  <!-- 编辑IOT订阅对话框 -->
  <el-dialog
    title="更新订阅状态"
    :close-on-click-modal=false
    :close-on-press-escape=false
    :visible.sync="editIotSubDialogVisible"
    width="22%"
    :before-close="handleClose">

    <el-form :model="editIotSub" ref="editIotSub" label-width="110px" class="demo-ruleForm">
      <el-form-item label="订阅编号：" prop="id">
        <span>{{ editIotSub.id }}</span>
        <!-- <el-select size="small" v-model="editIotSub.id" disabled style="width:300px"></el-select> -->
      </el-form-item>  
      <el-form-item label="应用编码：" prop="appCode">
        <span>{{ editIotSub.appCode }}</span>
        <!-- <el-select size="small" v-model="editIotSub.appCode" disabled style="width:300px"></el-select> -->
      </el-form-item>
      <el-form-item label="事件组编码：" prop="topicCode">
        <span>{{ editIotSub.topicCode }}</span>
        <!-- <el-select size="small" v-model="editIotSub.topicCode" disabled style="width:300px"></el-select> -->
      </el-form-item>
      <el-form-item label="是否启用：" prop="enableFlag">
        <el-switch v-model="editIotSub.enableFlag">
        </el-switch>
      </el-form-item>

      <div class="user-button" align="center">
      <!-- <el-form-item class="text-right add-IotSub-button"> -->
        <el-button type="primary" @click="submitEditForm('editIotSub')">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      <!-- </el-form-item> -->
      </div>
    </el-form>
  </el-dialog>

</div>
</template>


<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 110px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.el-table .unenable-row {
  background: oldlace;
}
.el-table .enable-row {
  background: rgb(175, 215, 255); 
}
</style>

<script>
import {getIotBusSubListPage, addIotBusSub, editIotBusSub, getIotBusAppList, getTopicList} from '@/views/IotBusMgmt/apis/iotbus_sub_api'
import { formatDate } from '../assets/js/tool.js'
import {Loading} from 'element-ui'

export default {
  name: 'iotBusSubList',
  components: {
  },
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // currentStep: 1,
      addIotSubDialogVisible: false,
      editIotSubDialogVisible: false,
      // loadingList: false,
      // loadingAddStep: false,
      // loadingEditStep: false,
      iotBusSubList: [],
      // multipleSelection: [],
      appCodeList: [],
      appList: [],
      topicCodeList: [],
      topicList: [],
      newIotSub: {
        appCode: null,
        topicCode: null,
        enableFlag: true // Bolean（True 表示enable），False代表disable
      },
      editIotSub: {},
      iotSubListSearch: {
        appCode: null,
        topicCode: null,
        enableFlag: null,
        subStatus: null
      },
      searchRules: {
        id: [
          {min: 0, max: 16, message: '长度不能超过16个字符'},
          {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\''}
        ],
        appCode: [
          {min: 0, max: 16, message: '长度不能超过16个字符'},
          {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\''}
        ],
        topicCode: [
          {min: 0, max: 64, message: '长度不能超过64个字符'},
          {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\''}
        ]
      },
      rules: {
        appCode: [
          {required: true, message: '请选择应用', trigger: 'change'}
        ],
        topicCode: [
          {required: true, message: '请输选择事件组', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    // 时间格式化
    dateFormat (row, column) {
      var time = row[column.property]
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    enableText (row, column) {
      var enableKey = row[column.property]
      return enableKey ? '已订阅' : '未订阅'
    },
    loadAppCodeData () {
      let args1 = {page: '', size: ''}
      getIotBusAppList(args1)
        .then(
          function (result) {
            this.appList = result.data
            // this.appCodeList = this.appList.map(({appCode}) => ({appCode}))
            // for (let i of this.appCodeList) {
            //   i.value = i.appCode  // 将CUSTOMER_NAME作为value
            // }
          }.bind(this)
        )
        .catch(
          function (error) {
            // this.loadingList = false
            // this.$message.error('发生错误，无法获取AppCode数据！')
            console.info(error)
          }
        )
    },
    loadTopicCodeData () {
      let args2 = {page: '', size: ''}
      getTopicList(args2)
        .then(
          function (result) {
            this.topicList = result.data
            // this.topicCodeList = this.topicList.map(({topicCode}) => ({topicCode}))
            // for (let i of this.topicCodeList) {
            //   i.value = i.topicCode  // 将CUSTOMER_NAME作为value
            // }
          }.bind(this)
        )
        .catch(
          function (error) {
            // this.loadingList = false
            // this.$message.error('发生错误，无法获取TopicCode数据！')
            console.info(error)
          }
        )
    },
    loadData () {
      // this.loadingList = true
      let loadingInstance = Loading.service({
        lock: true,
        fullscreen: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      var params = {
        page: this.currentPage,
        size: this.pageSize,
        appCode: this.iotSubListSearch.appCode,
        topicCode: this.iotSubListSearch.topicCode,
        enableFlag: this.iotSubListSearch.enableFlag
      }
      // console.log(params)
      getIotBusSubListPage(params)
        .then(
          function (result) {
            this.iotBusSubList = result.data.rows
            // console.log('hi--- ' + this.iotBusSubList)
            this.total = result.data.total
            // this.loadingList = false
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close()
            })
          }.bind(this)
        )
        .catch(
          function (error) {
            // this.loadingList = false
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close()
            })
            // this.$message.error('服务器请求超时，无法获取数据！')
            console.info(error)
          }.bind(this)
        )
    },
    handleSearch (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.searchSubmit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    searchSubmit () {
      // if (this.iotSubListSearch.subStatus === '全部' || this.iotSubListSearch.subStatus === undefined || this.iotSubListSearch.subStatus === null) {
      //   this.iotSubListSearch.enableFlag = null
      // } else {
      //   this.iotSubListSearch.enableFlag = this.iotSubListSearch.subStatus === '已订阅'
      //   console.log('subStatus:' + this.iotSubListSearch.subStatus)
      // }
      if (this.currentPage === 1) {
        this.iotBusSubList = []
        this.loadData()
      } else {
        this.currentPage = 1
      }
    },
    resetSearch () {
      this.resetForm('iotSubListSearch')
      this.iotSubListSearch = {}
      this.iotBusSubList = []
      this.loadData()
    },
    showAddIotSubDialog () {
      // this.currentStep = 1
      // this.newIotSub.appCode = null
      // this.newIotSub.topicCode = null
      // this.newIotSub.enableFlag = true
      this.resetForm('newIotSub')
      this.addIotSubDialogVisible = true
      this.loadAppCodeData()
      this.loadTopicCodeData()
    },
    resetForm (formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    submitNewForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmNewSubForm()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    confirmNewSubForm () {
      // 用户信息由后台从请求的token中获取，前端不赋值
      // this.newIotSub.createUser = this.username
      var params = this.newIotSub
      // console.log(params)
      addIotBusSub(params)
        .then(
          function (result) {
            // console.log(result)
            // this.loadingAddStep = false
            this.addIotSubDialogVisible = false
            this.loadData()
          }.bind(this)
        )
        .catch(
          function (error) {
            // this.loadingAddStep = false
            // this.$message.error('发生错误，添加失败！')
            console.info(error)
          }
        )
    },
    confirmEditIotSub () {
      // 用户信息由后台从请求的token中获取，前端不赋值
      // this.editIotSub.updateUser = this.username
      var params = this.editIotSub
      // console.log(params)
      editIotBusSub(params)
        .then(
          function (result) {
            // console.log(result)
            // this.loadingEditStep = false
            this.editIotSubDialogVisible = false
            this.loadData()
          }.bind(this)
        )
        .catch(
          function (error) {
            // this.loadingEditStep = false
            // this.$message.error('发生错误，更新失败！')
            console.info(error)
          }
        )
    },
    submitEditForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmEditIotSub()
        } else {
          console.log('error submit Edit!!')
          return false
        }
      })
    },
    checkedFlag () {

    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.iotBusSubList = []
      this.loadData()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      this.iotBusSubList = []
      this.loadData()
    },
    handleClose (done) {
      this.addIotSubDialogVisible = false
      this.editIotSubDialogVisible = false
    },
    handleEdit (index, item) {
      // console.info(item)
      // this.editIotSub = item
      this.editIotSub = JSON.parse(JSON.stringify(item))
      this.editIotSubDialogVisible = true
    },
    removeData (index, item) {
      var data = item
      data.enableFlag = false
      this.$confirm('确定要删除编号为"' + data.id + '"的订阅吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // var params = {
        //   key: data.id
        // }
        editIotBusSub(data)
          .then(
            function (result) {
              // console.log(result)
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.iotBusSubList = []
              this.loadData()
            }.bind(this)
          )
          .catch(
            function (error) {
              // this.loadingEditStep = false
              // this.$message.error('发生错误，删除失败！')
              console.info(error)
            }
          )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
    // handleSelectionChange (val) {
    //   this.multipleSelection = val
    // }
  },
  // 用户信息由后台从请求的token中获取，前端不赋值
  // computed: {
  //   username () {
  //     let username = localStorage.getItem('login_username')
  //     // console.log('我是11' + username)
  //     return username || this.name || 'admin'
  //   }
  // },
  mounted () {
    this.loadData()
    // this.loadAppCodeData()
    // this.loadTopicCodeData()
  }
}
</script>