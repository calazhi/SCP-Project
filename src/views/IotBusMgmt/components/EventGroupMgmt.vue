<template>
  <div id="EventGroupMgmtdiv" class='ui-common'> 
      <el-row>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="showAddTopicDialog()" style="margin-center: 10px" plain>
            新增事件组
          </el-button>
        </el-col>
        <el-col :span="20">   
          <el-form :inline="true" :model="formInline" :rules="searchRules" ref="serachFormInline" class="demo-form-inline" onsubmit="return false;">
            <div class="search-container">
              <div class="btn-container">
                <el-form-item label="事件组编码" prop="topicCode">
                  <el-input @keyup.native.enter="onSearchTopicSubmit('serachFormInline')" v-model="formInline.topicCode"  placeholder="事件组编码"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button class = "cancel-btn" @click="resetSearch">清空</el-button>
                  <el-button class = "search-btn" type="primary" @click="onSearchTopicSubmit('serachFormInline')">查询</el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </el-col>
      </el-row>

      <div class="border-divide"></div>

      <div class="flex-1">
        <el-row>
          <el-col :span="24">
            <el-table 
              :data="tableData" 
              style="width: 100%" 
              @selection-change="handleSelectionChange"
            >
              <!-- <el-table-column type="index" width="50"></el-table-column> -->
              <el-table-column prop="topicName" label="事件组名称"></el-table-column>
              <el-table-column prop="topicCode" label="事件组编码" width="300"></el-table-column>
              <el-table-column prop="topicTypeName" label="事件组类型"></el-table-column>
              <el-table-column prop="topicTag" label="事件组标签" width="300"></el-table-column> 
              <el-table-column prop="topicDesc" label="事件组描述"></el-table-column>
              <!-- <el-table-column prop="createUser" label="创建人" ></el-table-column> -->
              <el-table-column prop="createTime" label="创建时间" :formatter="dateFormat"></el-table-column> 
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="light" content="编辑" placement="top-start">
                    <span @click="showEditTopicDialog(scope.$index, scope.row)" style="cursor:pointer; margin-right:10px" class="el-icon-edit"></span>
                  </el-tooltip>
                  <el-tooltip class="item" effect="light" content="删除" placement="top-start">
                    <span @click="removeData(scope.$index, scope.row)" style="cursor:pointer" class="el-icon-delete"></span>
                  </el-tooltip>
                </template> 
              </el-table-column>
            </el-table> 
          </el-col>
        </el-row>
      
      <!--SlidePage-->
      <el-row>
        <el-col :span="24">
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
        </el-col>
      </el-row> 
    </div>
   
    <!-- AddForm -->
    <el-dialog title="新增事件组" 
      :visible.sync="addTopicDialogFormVisible" 
      :before-close="handleClose" 
      :close-on-click-modal=false
      :close-on-press-escape=false
      width = "25%">
      <el-form :model="addTopicForm" :rules="rules" ref="newTopic" label-width="110px">
        <el-form-item label="事件组名称" prop="topicName"> 
          <el-input size="small" v-model="addTopicForm.topicName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="事件组类型" prop="topicType">
          <el-select size="small" v-model="addTopicForm.topicType" placeholder="请选择事件组类型">
            <el-option label="上行消息" value="EVENT"></el-option>
            <el-option label="下行命令" value="COMMAND"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件组标签" prop="topicTag">
          <el-input size="small" v-model="addTopicForm.topicTag" auto-complete="off" ></el-input>
        </el-form-item>
       <el-form-item label="事件组描述" prop="topicDesc">
          <el-input :autosize="{minRows: 2, maxRows: 10}" type="textarea" v-model="addTopicForm.topicDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="user-button" align="center">
        <el-button type="primary" @click="submitAddTopicForm('newTopic')">保存</el-button>
        <el-button @click="closeAddOrEditModal()">取消</el-button>
      </div>
    </el-dialog>

    <!-- EditForm -->
    <el-dialog title="修改事件组" 
      :visible.sync="editTopicDialogFormVisible" 
      :before-close="handleClose" 
      :close-on-click-modal=false
      :close-on-press-escape=false
      width = "25%">
      <el-form :model="editTopicForm" :rules="rules" ref="updateTopic" label-width="110px">
        <el-form-item label="事件组编码">
          <el-input size="small" v-model="editTopicForm.topicCode" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="事件组名称">
          <el-input size="small" v-model="editTopicForm.topicName" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="事件组类型">
          <el-input size="small" v-model="editTopicForm.topicTypeName" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="事件组标签" prop="topicTag">
          <el-input size="small" v-model="editTopicForm.topicTag" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="事件组描述" prop="topicDesc">
          <el-input :autosize="{minRows: 2, maxRows: 10}" type="textarea" v-model="editTopicForm.topicDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="user-button" align="center">
        <el-button type="primary" @click="submitEditTopicForm('updateTopic')">保存</el-button>
        <el-button @click="closeAddOrEditModal()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import {getTopicList, addTopic, updateTopic} from '@/views/IotBusMgmt/apis/iotbus_eventgroup_api'
  import {formatDate} from '../assets/js/tool.js'
  import {Loading} from 'element-ui'
  
  export default {
    name: 'tableData',
    data () {
      return {
        currentPage: 1,
        total: 0,
        pageSize: 10,
        addTopicForm: {
          topicName: '',
          topicType: '',
          topicTag: '',
          topicDesc: ''
        },
        editTopicForm: {},
        searchRules: {
          topicCode: [
            {min: 0, max: 64, message: '长度不能超过64个字符'},
            {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\''}
          ]
        },
        rules: {
          topicName: [
            {required: true, message: '请填写事件组名称', trigger: 'blur'},
            {min: 1, max: 16, message: '长度需在 16 个字符内', trigger: 'blur'},
            {pattern: /^[A-Z][A-Z0-9]+$/, message: '仅支持大写英文字母和数字，且必须以英文字母为首字符'}
          ],
          topicType: [
            {required: true, message: '请选择事件组类型', trigger: 'blur'}
          ],
          topicTag: [
            {min: 0, max: 64, message: '长度需在 64 个字符内', trigger: 'blur'},
            {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\''}
          ],
          topicDesc: [
            {min: 0, max: 256, message: '长度需在 256 个字符内', trigger: 'blur'},
            {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\''}
          ]
        },
        tableData: [],
        formInline: {
          topicCode: null
        },
        multipleSelection: [],
        addTopicDialogFormVisible: false,
        editTopicDialogFormVisible: false
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      // 加载数据
      loadData () {
        let loadingInstance = Loading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        var params = {
          page: this.currentPage,
          size: this.pageSize,
          topicCode: this.formInline.topicCode
        }
        getTopicList(params).then(function (result) {
          result.data.rows.forEach((item) => {
            item.topicType === 'EVENT' ? (item.topicTypeName = '上行消息') : (item.topicTypeName = '下行命令')
            this.tableData.push(item)
          })
          this.total = result.data.total
          this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close()
          })
        }.bind(this)).catch(function (error) {
          this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close()
          })
          console.log(error)
        }.bind(this)
        )
        .catch(
          function (error) {
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close()
            })
            this.$message.error('服务器请求超时，无法获取数据！')
            console.info(error)
          }.bind(this)
          )
      },
      confirmAddTopic () {
        var params = {}
        var reg = /^[A-Z][A-Z0-9]+$/
        if (!reg.test(this.addTopicForm.topicName)) {
          this.$message.error('事件组名称只支持大写英文字母和数字，且必须以英文字母为首字符！')
          return
        } else {
          params.topicName = this.addTopicForm.topicName
        }
        params.topicTag = this.addTopicForm.topicTag
        params.topicDesc = this.addTopicForm.topicDesc
        params.topicType = this.addTopicForm.topicType
        params.enableFlag = true
        addTopic(params)
          .then(
            function (result) {
              this.addTopicDialogFormVisible = false
              this.tableData = []
              this.loadData()
            }.bind(this)
          )
          .catch(
            function (error) {
              console.info(error)
            }
          )
      },
      submitAddTopicForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.confirmAddTopic()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      confirmEditTopic () {
        var params = {}
        params.topicCode = this.editTopicForm.topicCode
        params.topicName = this.editTopicForm.topicName
        params.topicTag = this.editTopicForm.topicTag
        params.topicDesc = this.editTopicForm.topicDesc
        params.topicType = this.editTopicForm.topicType
        params.enableFlag = true
        updateTopic(params)
          .then(
            function (result) {
              this.editTopicDialogFormVisible = false
              this.tableData = []
              this.loadData()
            }.bind(this)
          )
          .catch(
            function (error) {
              console.info(error)
            }
          )
      },
      submitEditTopicForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.confirmEditTopic()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 查询
      onSearchTopicSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.currentPage === 1) {
              this.tableData = []
              this.loadData()
            } else {
              this.currentPage = 1
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 改变分页大小
      handleSizeChange (val) {
        this.pageSize = val
        this.tableData = []
        this.loadData()
      },
      // 跳转页数
      handleCurrentChange (val) {
        this.currentPage = val
        this.tableData = []
        this.loadData()
      },
      resetSearch () {
        this.resetForm('serachFormInline')
        this.tableData = []
        this.loadData()
      },
      showAddTopicDialog () {
        this.resetForm('newTopic')
        this.addTopicDialogFormVisible = true
      },
      resetForm (formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      },
      // 打开修改窗口
      showEditTopicDialog (index, item) {
        this.editTopicDialogFormVisible = true
        this.editTopicForm = JSON.parse(JSON.stringify(item))
        item.topicType === 'EVENT' ? (this.editTopicForm.topicTypeName = '上行消息') : (this.editTopicForm.topicTypeName = '下行命令')
      },
      closeAddOrEditModal () {
        this.addTopicDialogFormVisible = false
        this.editTopicDialogFormVisible = false
      },
      handleClose (done) {
        this.addTopicDialogFormVisible = false
        this.editTopicDialogFormVisible = false
      },
      removeData (index, item) {
        var data = item
        data.enableFlag = false
        this.$confirm('"' + data.topicName + '" 的相关订阅关系也会被一起删除，确定要删除 "' + data.topicName + '" 吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateTopic(data).then(
            function (result) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.tableData = []
              this.loadData()
            }.bind(this)
          )
          .catch(
              function (error) {
                console.info(error)
              }
            )
        })
      },
      dateFormat (row, column) {
        var time = row[column.property]
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      }
    }
  }
</script>


<style type="text/css" scoped>
  
</style>
