<template>
<div class = "ui-common">
    
  <!-- 查询&新增区域 -->
  <div>  
    <el-row :gutter="20">
      <el-col :span="4">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-button icon="el-icon-circle-plus-outline" style="margin-center: 10px" @click="showAddIotAppDialog()" plain type="primary">新增应用</el-button>
            </el-form-item>
          </el-form>
      </el-col>
      <el-col :span="20">
        <div class="text-right">
          <el-form :inline="true" :model="iotAppListSearch" :rules="searchRules" ref="iotAppListSearch" class="demo-form-inline">
            <el-form-item label="应用名称" prop="appName">
              <el-input @keyup.native.enter="handleSearch('iotAppListSearch')" v-model="iotAppListSearch.appName" placeholder="请输入应用名称"></el-input>
            </el-form-item>
            <el-form-item label="应用编码" prop="appCode">
              <el-input @keyup.native.enter="handleSearch('iotAppListSearch')" v-model="iotAppListSearch.appCode" placeholder="请输入应用编码"></el-input>
            </el-form-item>
            <el-form-item label="应用类型" prop="appType">
              <el-select size="middle" v-model="iotAppListSearch.appType" placeholder="请选择应用类型" @change="searchSubmit">
                <el-option label="全部" value="全部"></el-option>
                <el-option label="网关应用" value="网关应用"></el-option>
                <el-option label="其他应用" value="其他应用"></el-option>          
              </el-select>
            </el-form-item>
            <el-form-item label="应用描述" prop="appDesc">
              <el-input @keyup.native.enter="handleSearch('iotAppListSearch')" v-model="iotAppListSearch.appDesc" placeholder="请输入应用描述"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class = "cancel-btn" @click="resetSearch">清空</el-button>
              <el-button class = "search-btn" type="primary" @click="handleSearch('iotAppListSearch')">查询</el-button>
            </el-form-item>
        </el-form> 
        </div>       
      </el-col>
    </el-row>
  </div>  
  <div class="border-divide"></div>
  
  <!-- App list显示区 -->   
  <div class="flex-1">
      <el-table
        :data="iotBusAppList"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="应用名称：">
                <span>{{ props.row.appName }}</span>
              </el-form-item>
              <el-form-item label="应用编码：">
                <span>{{ props.row.appCode }}</span>
              </el-form-item>
              <el-form-item label="应用类型：">
                <span>{{ props.row.appType ? "网关应用":"其他应用" }}</span>
              </el-form-item>
              <el-form-item label="应用描述：">
                <span>{{ props.row.appDesc }}</span>
              </el-form-item>
              <!-- <el-form-item label="应用状态：">
                <span>{{ props.row.enableFlag ? "启用":"不启用" }}</span>
              </el-form-item>
              <el-form-item label="需要检查密码：">
                <span>{{ props.row.checkPwd ? "是":"否" }}</span>
              </el-form-item> -->
              <el-form-item label="访问密钥串：">
                <span>{{ props.row.token }}</span>
              </el-form-item>
              <el-form-item label="监听队列名称：">
                <span>{{ props.row.queueName }}</span>
              </el-form-item>
              <el-form-item label="联系人：">
                <span>{{ props.row.ownerName }}</span>
              </el-form-item>
              <el-form-item label="联系方式：">
                <span>{{ props.row.ownerContact }}</span>
              </el-form-item>
              <!-- <el-form-item label="创建人：">
                <span>{{ props.row.createUser }}</span>
              </el-form-item>
              <el-form-item label="更新人：">
                <span>{{ props.row.updateUser }}</span>
              </el-form-item> -->
              <el-form-item label="创建时间：">
                <span>{{ props.row.createTime | formatDate }}</span>
              </el-form-item>
              <el-form-item label="最后更新时间：">
                <span>{{ props.row.updateTime | formatDate }}</span>
              </el-form-item>                    
            </el-form>
          </template>
        </el-table-column>
        <!-- <el-table-column
          type="index"
          width="70">
        </el-table-column>     -->
        <el-table-column
          label="应用名称"
          prop="appName">
        </el-table-column>
        <el-table-column
          label="应用编码"
          prop="appCode">
        </el-table-column>
        <el-table-column
          label="应用类型"
          prop="appTypeName">
        </el-table-column>
        <el-table-column
          label="应用描述"
          prop="appDesc">
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <!-- <el-button type="text" size="small"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="text" size="small"  @click="removeData(scope.$index, scope.row)">删除</el-button> -->
              <el-tooltip class="item" effect="light" content="编辑" placement="top-start">
                <span @click="handleEdit(scope.$index, scope.row)" style="cursor:pointer; margin-right:10px" class="el-icon-edit"></span>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="删除" placement="top-start">
                <span @click="removeData(scope.$index, scope.row)" style="cursor:pointer" class="el-icon-delete"></span>
              </el-tooltip>
            </template>
          </el-table-column>
      </el-table>
      
    <!-- 分页显示区 -->  
    <!-- <div class="block text-center margin-top-20"> -->
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

<!-- 弹出对话框Start -->
  <!-- 新增应用对话框 -->
  <el-dialog
    title="新增应用"
    :visible.sync="addIotAppDialogVisible"
    :before-close="handleClose"
    :close-on-click-modal=false
    :close-on-press-escape=false
    width="25%">

    <el-form :model="newIotApp" :rules="rules" ref="addIotApp" label-width="110px" class="demo-ruleForm">
      <el-form-item label="应用名称" prop="appName">
        <el-input size="small" v-model="newIotApp.appName"></el-input>
      </el-form-item>
      <el-form-item label="应用类型" prop="appType">
        <el-select size="small" v-model="newIotApp.appType" placeholder="请选择应用类型">
          <el-option label="网关应用" value="1"></el-option>
          <el-option label="其他应用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否启用" prop="enableFlag">
        <el-switch v-model="newIotApp.enableFlag">
        </el-switch>
      </el-form-item>
      <el-form-item label="需要检查密码" prop="checkPwd">
        <el-switch v-model="newIotApp.checkPwd">
        </el-switch>
      </el-form-item> -->
      <el-form-item label="联系人" prop="ownerName">
        <el-input size="small" v-model="newIotApp.ownerName"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="ownerContact">
        <el-input size="small" v-model="newIotApp.ownerContact"></el-input>
      </el-form-item>
      <el-form-item label="应用描述" prop="appDesc">
        <el-input :autosize="{ minRows: 2, maxRows: 10}" type="textarea" v-model="newIotApp.appDesc"></el-input>
      </el-form-item>
    <div class="user-button" align="center">
      <!-- <el-form-item> -->
        <el-button type="primary" @click="submitNewForm('addIotApp')">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      <!-- </el-form-item> -->
    </div>
    </el-form>  
  </el-dialog>

  <!-- 编辑IOT应用对话框 -->
  <el-dialog
    title="编辑应用"
    :close-on-click-modal=false
    :close-on-press-escape=false
    :visible.sync="editIotAppDialogVisible"    
    :before-close="handleClose"
    width="25%">

    <el-form :model="editIotApp" :rules="rules" ref="updateIotApp" label-width="100px" class="demo-ruleForm">
      <el-form-item label="应用名称" prop="appName">
        <el-input size="small" v-model="editIotApp.appName"></el-input>
      </el-form-item>
      <el-form-item label="应用类型" prop="appType">
        <el-select size="small" v-model="editIotApp.appTypeName" placeholder="请选择应用类型" disabled>
          <el-option label="网关应用" value="网关应用"></el-option>
          <el-option label="其他应用" value="其他应用"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否启用" prop="enableFlag">
        <el-switch v-model="editIotApp.enableFlag">
        </el-switch>
      </el-form-item>
      <el-form-item label="需要检查密码" prop="checkPwd">
        <el-switch v-model="editIotApp.checkPwd">
        </el-switch>
      </el-form-item> -->
      <el-form-item label="联系人" prop="ownerName">
        <el-input size="small" v-model="editIotApp.ownerName"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="ownerContact">
        <el-input size="small" v-model="editIotApp.ownerContact"></el-input>
      </el-form-item>
      <el-form-item label="应用描述" prop="appDesc">
        <el-input :autosize="{ minRows: 2, maxRows: 10}" type="textarea" v-model="editIotApp.appDesc"></el-input>
      </el-form-item>

      <!-- <el-form-item class="text-right add-iotapp-button"> -->
        <div class="user-button" align="center">
          <el-button type="primary" @click="submitEditForm('updateIotApp')">保存</el-button>
          <el-button @click="handleClose">取消</el-button>
        </div>
      <!-- </el-form-item> -->
    </el-form>
  </el-dialog>

</div>
</template>


<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand >>> label {
  width: 120px;
  color: #99a9bf;
}
.demo-table-expand >>> .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

<script>
import {getIotBusAppListPage, addIotBusApp, updateIotBusApp} from '@/views/IotBusMgmt/apis/iotbus_app_api'
import { formatDate } from '../assets/js/tool.js'
import {Loading} from 'element-ui'

export default {
  name: 'iotBusAppList',
  components: {
  },
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      addIotAppDialogVisible: false,
      editIotAppDialogVisible: false,
      // loadingList: true,
      // loadingAddStep: false,
      // loadingEditStep: false,
      iotBusAppList: [],
      newIotApp: {
        // appCode: '', // 后台自动生成，前台新增页面不显示
        appName: '',
        appType: '0', // 默认为0（其他应用），1代表“网关应用”
        appDesc: '',
        enableFlag: true, // Bolean（True 表示enable），False代表disable
        checkPwd: true, // Bolean（True 需要检查），False代表“不需要检查”
        ownerName: '',
        ownerContact: '',
        typeName: ''
      },
      editIotApp: {},
      iotAppListSearch: {
        appCode: null,
        appName: null,
        appType: null,
        appDesc: null,
        appTypeCode: null
      },
      searchRules: {
        appCode: [
          {min: 0, max: 16, message: '长度不能超过16个字符'},
          {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\''}
        ],
        appName: [
          {min: 0, max: 32, message: '长度不能超过32个字符'},
          {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\''}
        ],
        appDesc: [
          {min: 0, max: 256, message: '长度不能超过256个字符'},
          {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\''}
        ]
      },
      rules: {
        appName: [
          {required: true, message: '请输入应用名称', trigger: 'blur'},
          {min: 0, max: 32, message: '长度不能超过32个字符', trigger: 'blur'},
          {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\'', trigger: 'blur'}
        ],
        appType: [
          {required: true, message: '请选择应用类型', trigger: 'change'}
        ],
        appDesc: [
          // {required: true, message: '请输入应用描述', trigger: 'blur'},
          {min: 0, max: 256, message: '长度不能超过256个字符', trigger: 'blur'},
          {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\'', trigger: 'blur'}
        ],
        ownerName: [
          // {required: true, message: '请输入联系人', trigger: 'blur'},
          {min: 0, max: 32, message: '长度不能超过32个字符', trigger: 'blur'},
          {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\'', trigger: 'blur'}
        ],
        ownerContact: [
          // {required: true, message: '请输入联系方式', trigger: 'blur'},
          // {min: 0, max: 32, message: '长度不能超过32个字符', trigger: 'blur'},
          {pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: '请输入正确的固定电话或手机格式,区号请用\'-\'连接', trigger: 'blur'}
        ]
      }
    }
  },
  filters: {
    formatDate (time) {
      // var timeS = time.replace(/(\d{4})-(\d{2})-(\d{2})T(.*)?\.(.*)/, '$1/$2/$3 $4')
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      // 此处formatDate是一个函数，将其封装在assets/js/tool.js里面，便于全局使用
    }
  },
  methods: {
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
        appCode: this.iotAppListSearch.appCode,
        appName: this.iotAppListSearch.appName,
        appType: this.iotAppListSearch.appTypeCode,
        appDesc: this.iotAppListSearch.appDesc
      }
      getIotBusAppListPage(params)
        .then(
          function (result) {
            result.data.rows.forEach((item) => {
              item.appType === 1 ? (item.appTypeName = '网关应用') : (item.appTypeName = '其他应用')
              this.iotBusAppList.push(item)
            })
            this.total = result.data.total
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close()
            })
          }.bind(this)
        )
        .catch(
          function (error) {
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
      if (this.iotAppListSearch.appType === '全部' || this.iotAppListSearch.appType === undefined || this.iotAppListSearch.appType === null) {
        this.iotAppListSearch.appTypeCode = null
      } else {
        this.iotAppListSearch.appType === '网关应用' ? (this.iotAppListSearch.appTypeCode = 1) : (this.iotAppListSearch.appTypeCode = 0)
      }
      if (this.currentPage === 1) {
        this.iotBusAppList = []
        this.loadData()
      } else {
        this.currentPage = 1
      }
    },
    resetSearch () {
      this.resetForm('iotAppListSearch')
      this.iotAppListSearch = {}
      this.iotBusAppList = []
      this.loadData()
    },
    showAddIotAppDialog () {
      this.resetForm('addIotApp')
      // this.newIotApp.appName = ''
      // this.newIotApp.appType = '0' // 默认为0（其他应用），1代表“网关应用”
      // this.newIotApp.appDesc = ''
      // this.newIotApp.enableFlag = true // Bolean（True 表示enable），False代表disable
      // this.newIotApp.checkPwd = true // Bolean（True 需要检查），False代表“不需要检查”
      // this.newIotApp.ownerName = ''
      // this.newIotApp.ownerContact = ''
      this.addIotAppDialogVisible = true
    },
    resetForm (formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    resetValidation (formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].clearValidate()
      }
    },
    submitNewForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmNewAppForm()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    confirmNewAppForm () {
      // 用户信息由后台从请求的token中获取，前端不赋值
      // this.newIotApp.createUser = this.username
      let params = this.newIotApp
      // params.appType = parseInt(params.appType)
      // if (this.newIotApp.typeName === '网关应用') {
      //   this.newIotApp.appType = 1
      // } else if (this.newIotApp.typeName === '其他应用') {
      //   this.newIotApp.appType = 0
      // } else {
      //   this.$message.error('发生错误！')
      // }
      // this.newIotApp.appType = parseInt(this.newIotApp.appType)
      // console.log('appType' + typeof this.newIotApp.appType)
      // var params = {
      //   appName: this.newIotApp.appName,
      //   appType: this.newIotApp.appType, // 默认为0（其他应用），1代表“网关应用”
      //   appDesc: this.newIotApp.appDesc,
      //   enableFlag: this.newIotApp.enableFlag, // Bolean（True 表示enable），False代表disable
      //   checkPwd: this.newIotApp.checkPwd, // Bolean（True 需要检查），False代表“不需要检查”
      //   ownerName: this.newIotApp.ownerName,
      //   ownerContact: this.newIotApp.ownerContact
      // }
      // console.log(params)
      addIotBusApp(params)
        .then(
          function (result) {
            // this.loadingAddStep = false
            this.addIotAppDialogVisible = false
            this.iotBusAppList = []
            this.loadData()
          }.bind(this)
        )
        .catch(
          function (error) {
            // this.loadingAddStep = false
            // this.$message.error('添加失败！（应用名已存在）')
            console.info(error)
          }
        )
    },
    confirmEditIotApp () {
      // 用户信息由后台从请求的token中获取，前端不赋值
      // this.editIotApp.updateUser = this.username
      var params = this.editIotApp
      params.enableFlag = true
      updateIotBusApp(params)
        .then(
          function (result) {
            // console.log(result)
            // this.loadingEditStep = false
            this.editIotAppDialogVisible = false
            this.iotBusAppList = []
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
      // this.resetForm('updateIotApp')
    },
    submitEditForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmEditIotApp()
          // this.resetForm('updateIotApp')
        } else {
          console.log('error submit Edit!!')
          // this.resetForm('updateIotApp')
          return false
        }
        this.resetValidation('updateIotApp')
      })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.iotBusAppList = []
      this.loadData()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      this.iotBusAppList = []
      this.loadData()
    },
    handleClose (done) {
      this.addIotAppDialogVisible = false
      this.editIotAppDialogVisible = false
      this.resetForm('updateIotApp')
    },
    handleEdit (index, item) {
      // this.resetForm('updateIotApp')
      this.editIotApp = JSON.parse(JSON.stringify(item))
      // this.editIotApp = item
      this.editIotAppDialogVisible = true
      this.editIotApp.appType = (item.appType === 1 ? '1' : '0')
    },
    removeData (index, item) {
      var data = item
      data.enableFlag = false
      this.$confirm('"' + data.appName + '" 的相关订阅关系也会被一起删除，确定要删除 "' + data.appName + '" 吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // var params = {
        //   appCode: data.appCode
        // }
        updateIotBusApp(data)
          .then(
            function (result) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.iotBusAppList = []
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
  }
}
</script>