<template>
  <div id="EventMgmtdiv" class='ui-common'>
    <el-row>
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="showAddEventDialog()" style="margin-center: 10px" plain>
          新增事件
        </el-button>
      </el-col>
      <el-col :span="20">   
        <el-form :inline="true" :model="formInline" :rules="searchRules" ref="serachFormInline" class="demo-form-inline">
          <div class="search-container">
            <div class="btn-container">
              <el-form-item label="事件编码">
                <el-input @keyup.native.enter="onSearchTopicSubmit('serachFormInline')" v-model="formInline.eventCode" placeholder="事件编码"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class = "cancel-btn" @click="resetSearch">清空</el-button>
                <el-button class = "search-btn" type="primary" @click="onSearchEventSubmit('serachFormInline')">查询</el-button>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-col>
    </el-row>
    
    <div class="border-divide"></div>

    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="index" width="50"></el-table-column> -->
          <el-table-column prop="eventName" label="事件名称"></el-table-column>
          <el-table-column prop="eventCode" label="事件编码"></el-table-column>
          <el-table-column prop="eventTypeName" label="事件类型" width = "100"></el-table-column>
          <el-table-column prop="topicCode" label="关联事件组"></el-table-column>
          <el-table-column prop="deviceTypeDesc" label="关联设备类型"></el-table-column>
          <el-table-column prop="eventDesc" label="事件描述"></el-table-column>
          <!-- <el-table-column prop="createUser" label="创建人" width = "150"></el-table-column> -->
          <el-table-column prop="createTime" label="创建时间" :formatter="dateFormat"></el-table-column> 
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" content="编辑" placement="top-start">
                <span @click="showEditEventDialog(scope.$index, scope.row)" style="cursor:pointer; margin-right:10px" class="el-icon-edit"></span>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="删除" placement="top-start">
                <span @click="removeData(scope.$index, scope.row)" style="cursor:pointer" class="el-icon-delete"></span>
              </el-tooltip>
            </template> 
          </el-table-column>
        </el-table> 
      </el-col>
    </el-row>

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
   
    <!-- AddForm -->
    <el-dialog title="新增事件" 
      :visible.sync="addEventDialogFormVisible" 
      :before-close="handleClose" 
      :close-on-click-modal=false
      :close-on-press-escape=false
      width = "25%">
      <el-form :model="addEventForm" :rules="rules" ref="newEvent" label-width="20%">
        <el-form-item label="事件编码" prop="eventCode"> 
          <el-input v-model="addEventForm.eventCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="事件类型" prop="eventType">
          <el-select v-model="addEventForm.eventType" placeholder="请选择事件类型" style="width:300px">
            <el-option label="事件上报" value="EVENT"></el-option>
            <el-option label="访问控制" value="COMMAND"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联设备类型" prop="deviceTypeCode">
          <el-cascader v-model="addEventForm.deviceTypeCode" 
            :options="selectDeviceTypeOptions"
            :props="selectDTData"
            filterable
            clearable
            change-on-select 
            placeholder="请选择关联设备类型" 
            style="width:300px">
          </el-cascader>
        </el-form-item>
        <el-form-item label="关联事件组" prop="topicCode">
          <el-select v-model="addEventForm.topicCode" filterable  placeholder="请选择关联事件组" style="width:300px">
            <el-option v-for="item in selectEventGroupOptions" :key="item.topicCode" :label="item.topicCode" :value="item.topicCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件名称" prop="eventName"> 
          <el-input v-model="addEventForm.eventName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="事件描述" prop="eventDesc">
          <el-input v-model="addEventForm.eventDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="user-button" align="center">
        <el-button type="primary" @click="submitAddEventForm('newEvent')">保存</el-button>
        <el-button @click="closeAddAndEditModal()">取消</el-button>
      </div>
    </el-dialog>

    <!-- EditForm -->
    <el-dialog title="修改事件" 
      :visible.sync="editEventDialogFormVisible" 
      :before-close="handleClose" 
      :close-on-click-modal=false
      :close-on-press-escape=false
      width = "25%">
      <el-form :model="editEventForm" :rules="rules" ref="updateEvent" label-width="20%">
        <el-form-item label="事件编码">
          <el-input v-model="editEventForm.eventCode" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="事件类型">
          <el-input v-model="editEventForm.eventTypeName" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="关联设备类型">
          <el-input v-model="editEventForm.deviceTypeDesc" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="关联事件组">
          <el-input v-model="editEventForm.topicCode" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="事件名称" prop="eventName">
          <el-input v-model="editEventForm.eventName" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="事件描述" prop="eventDesc">
          <el-input v-model="editEventForm.eventDesc" auto-complete="off"></el-input>
        </el-form-item> 
      </el-form>
      <div class="user-button" align="center">
        <el-button type="primary" @click="submitEditEventForm('updateEvent')">保存</el-button>
        <el-button @click="closeAddAndEditModal()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import {getEventList, addEvent, updateEvent, deleteEvent, getEventByCode, getEventGroupList, getDeviceTypeList} from '@/views/IotBusMgmt/apis/iotbus_event_api'
  import {formatDate} from '../assets/js/tool.js'
  import {Loading} from 'element-ui'

  export default {
    name: 'tableData',
    data () {
      return {
        selectDeviceTypeOptions: [],
        selectEventGroupOptions: [],
        selectDTData: {
          label: 'deviceTypeDesc',
          value: 'deviceTypeCode',
          children: 'children'
        },
        currentPage: 1,
        total: 0,
        pageSize: 10,
        addEventForm: {
          eventCode: '',
          eventType: '',
          deviceTypeCode: [],
          topicCode: '',
          eventName: '',
          eventDesc: ''
        },
        editEventForm: {},
        searchRules: {
          eventCode: [
            {min: 0, max: 32, message: '长度不能超过64个字符'},
            {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\''}
          ]
        },
        rules: {
          eventCode: [
            {required: true, message: '请填写事件编码', trigger: 'blur'},
            {min: 0, max: 32, message: '长度需在 32 个字符内', trigger: 'blur'},
            {pattern: /^[0-9]+$/, message: '事件编码需由数字组成！'}
          ],
          eventType: [
            {required: true, message: '请选择事件类型', trigger: 'blur'}
          ],
          deviceTypeCode: [
            {required: true, message: '请选择设备类型', trigger: 'change'}
          ],
          topicCode: [
            {required: true, message: '请选择设备类型', trigger: 'blur'}
          ],
          eventName: [
            {required: true, message: '请填写事件名称', trigger: 'blur'},
            {min: 0, max: 32, message: '长度需在 32 个字符内', trigger: 'blur'},
            {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\''}
          ],
          eventDesc: [
            {min: 0, max: 256, message: '长度需在 256 个字符内', trigger: 'blur'},
            {pattern: /^((?!%).)*$/, message: '不支持特殊字符\'%\''}
          ]
        },
        tableData: [],
        formInline: {
          eventCode: null
        },
        multipleSelection: [],
        addEventDialogFormVisible: false,
        editEventDialogFormVisible: false
      }
    },
    mounted () {
      this.loadData()
    },
    methods: {
      // 加载数据
      loadData () {
        let eventLoading = Loading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        var params = {
          page: this.currentPage,
          size: this.pageSize,
          eventCode: this.formInline.eventCode
        }
        getEventList(params).then(function (result) {
          result.data.rows.forEach((item) => {
            item.eventType === 'EVENT' ? (item.eventTypeName = '事件上报') : (item.eventTypeName = '访问控制')
            this.tableData.push(item)
          })
          this.total = result.data.total
          this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            eventLoading.close()
          })
        }.bind(this)).catch(function (error) {
          this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            eventLoading.close()
          })
          console.log(error)
        }
        )
        .catch(
          function (error) {
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              eventLoading.close()
            })
            console.info(error)
          }
          )
      },
      loadSelectEventGroupListData () {
        getEventGroupList().then(function (result) {
          this.selectEventGroupOptions = result.data
        }.bind(this)).catch(function (error) {
          console.log(error)
        })
      },
      loadSelectDeviceTypeListData () {
        getDeviceTypeList().then(function (result) {
          this.selectDeviceTypeOptions = result
        }.bind(this)).catch(function (error) {
          console.log(error)
        })
      },
      confirmAddEvent () {
        var params = {}
        var checkcode = {
          key: this.addEventForm.eventCode
        }
        getEventByCode(checkcode).then(function (checkresult) {
          if (checkresult.data !== undefined) {
            this.$message.error('该事件编号已存在，请重新输入！')
          } else {
            params.eventCode = this.addEventForm.eventCode
            params.eventType = this.addEventForm.eventType
            params.deviceTypeCode = this.addEventForm.deviceTypeCode[this.addEventForm.deviceTypeCode.length - 1]
            params.topicCode = this.addEventForm.topicCode
            params.eventName = this.addEventForm.eventName
            params.eventDesc = this.addEventForm.eventDesc
            addEvent(params)
              .then(
                function (result) {
                  this.addEventDialogFormVisible = false
                  this.tableData = []
                  this.loadData()
                }.bind(this)
              )
              .catch(
                function (error) {
                  console.info(error)
                }
              )
          }
        }.bind(this))
      },
      submitAddEventForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.confirmAddEvent()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      confirmEditEvent () {
        var params = {}
        params.eventCode = this.editEventForm.eventCode
        params.eventType = this.editEventForm.eventType
        params.deviceTypeCode = this.editEventForm.deviceTypeCode
        params.topicCode = this.editEventForm.topicCode
        params.eventName = this.editEventForm.eventName
        params.eventDesc = this.editEventForm.eventDesc
        updateEvent(params)
          .then(
            function (result) {
              this.editEventDialogFormVisible = false
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
      submitEditEventForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.confirmEditEvent()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 查询
      onSearchEventSubmit (formName) {
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
      showAddEventDialog () {
        this.addEventDialogFormVisible = true
        this.loadSelectEventGroupListData()
        this.loadSelectDeviceTypeListData()
        this.resetForm('newEvent')
      },
      resetForm (formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      },
      // 打开修改窗口
      showEditEventDialog (index, item) {
        this.editEventDialogFormVisible = true
        this.editEventForm = JSON.parse(JSON.stringify(item))
        item.eventType === 'EVENT' ? (this.editEventForm.eventTypeName = '上行消息') : (this.editEventForm.eventTypeName = '下行消息')
      },
      closeAddAndEditModal () {
        this.addEventDialogFormVisible = false
        this.editEventDialogFormVisible = false
      },
      handleClose (done) {
        this.addEventDialogFormVisible = false
        this.editEventDialogFormVisible = false
      },
      removeData (index, item) {
        var data = item
        this.$confirm('确定要删除"' + data.eventName + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params = {
            key: data.eventCode
          }
          deleteEvent(params).then(
            function (result) {
              console.log(result)
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
      },
      batchRemove () {
        this.multipleSelection.forEach(row => {
          console.log(row.id)
        })
      }
    }
  }
</script>


<style type="text/css" scoped>
  .block {
    margin-top: 20px;
    width: 100%;
  }
  .block .r_btn {
    float: left;
    width: 90px;
  }
  .block .r_page {
     float: right;
  }
</style>
