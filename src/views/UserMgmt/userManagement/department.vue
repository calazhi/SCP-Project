<template>
  <div class='ui-common'>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="部门列表" name="0"></el-tab-pane>
        <el-tab-pane label="部门树形结构" name="1"></el-tab-pane>
      </el-tabs>
      <div v-show="showGrid == true" class="flex-c flex-1">
        <div>
          <el-form :model="listQuery" ref="listQuery">
            <el-button icon="el-icon-circle-plus-outline" @click="handleCreate" plain type="primary" >添加</el-button>
            <span style="float:right">
              <el-input @keyup.enter.native="handleFilter" style="width:360px; display:inline-block" class="filter-item" placeholder="请输入部门名称搜索" v-model="listQuery.q_departName"></el-input>
              <el-form-item v-show="false">
                <el-input> </el-input>
              </el-form-item>
              <el-button class="cancel-btn" type="primary" @click="handleFilterReset" style="margin-left:10px">清空</el-button>
              <el-button class="action-btn" type="primary" @click="handleFilter" style="margin-left:10px">搜索</el-button>
            </span>
          </el-form>
        </div>

      <div class="border-divide"></div>
      <div class="table-container">
          <grid-list
            :editable="true" 
            :deletable="true"
            :showOperation="true"
            :tableData="departmentList" 
            :params="departmentListParam" 
            style="margin-top: 15px" 
            @listenToDeleteEvent="departmentDeleteEvent" 
            @listenToEditEvent="departmentEditEvent"
          ></grid-list>
      </div>
      <div>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.page"
            :page-sizes="[10, 20, 50]"
            :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
      <el-dialog :title="dialogStatus" :visible.sync="dialogCreateFormVisible" :before-close="handleClose" :close-on-click-modal="false">
        <department-create ref="departmentCreateVue" :departmentSelect="departmentOptions" :departmentTypeSelect="departmentTypeOptions"
        @gridCreateEvent="deptAddEvent" @canelDialogEvent="handleClose"></department-create>
      </el-dialog>
      <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :before-close="handleClose" :close-on-click-modal="false">
        <department-edit ref="departmentEditVue" @canelDialogEvent="handleClose" :isAddFlag="addFlag" :department="departmentForm" :departmentSelect="departmentOptions"
        @gridSaveEvent="deptUpdateEvent" :departmentTypeSelect="departmentTypeOptions"
        :curDepartmentUuidParm="curDepartmentUuid"></department-edit>
      </el-dialog>
    </div>
    <div v-show="showGrid == false">
      <el-row>
        <el-col :span="8" style='margin-top:15px;'>
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <div class="departmentTree">
            <el-tree style='margin-top:10px;'
              class="el-department-tree"
              :data="treeData"
              :props="defaultProps"
              node-key="id"
              :filter-node-method="filterNode"
              ref="departmentTree"
              @node-click="handleNodeClick"
              default-expand-all
            >
            </el-tree>
          </div>
          <div style="margin-top: 30px" v-show="showSubGrid">
            <el-button icon="el-icon-circle-plus-outline" style="margin-center: 10px" @click="handleTreeCreate" plain type="primary">添加</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleTreeDelete" type="primary">删除</el-button>
          </div>
        </el-col>
        <el-col :span="16" style='margin-top:15px;' v-show="showSubGrid">
          <el-card class="box-card" style='margin-left:10px;' v-show="showEditTree">
            <department-edit ref="departmentEditTreeVue" @canelDialogEvent="handleClose" :department="departmentForm"
            :departmentSelect="departmentOptions" @gridSaveEvent="deptUpdateEvent" @gridRefreshDir="loadDepartmentTree"
            :departmentTypeSelect="departmentTypeOptions"
            :curDepartmentUuidParm="curDepartmentUuid"></department-edit>
          </el-card>
          <el-card class="box-card" style='margin-left:10px;' v-show="showCreateTree">
            <department-create  ref="departmentCreateTreeVue" :departmentSelect="departmentOptions" @gridCreateEvent="deptAddEvent"
            :departmentTypeSelect="departmentTypeOptions"
            @canelDialogEvent="handleClose"></department-create>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import gridList from './component/gridList.vue'
  import departmentCreate from './component/DepartmentCreate.vue'
  import departmentEdit from './component/departmentEdit.vue'
  import {
    getDepartmentList,
    getParenetDepartmentSelect,
    getDepartmentTreeData,
    getDepartmentDetail,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    listUserType
  } from '@/views/UserMgmt/userManagement/apis'
  export default {
    data () {
      return {
        showCreate: false,
        departmentList: undefined,
        departmentListParam: [ {
          title: '部门名称',
          prop: 'departmentName'
        }, {
          title: '用户类型',
          prop: 'userTypeName'
        }, {
          title: '上级部门',
          prop: 'parentDepartmentName'
        }, {
          title: '下级部门',
          prop: 'childrenDepartments'
        }, {
          title: '直属员工',
          prop: 'directUsers'
        }],
        listQuery: {
          page: 1,
          limit: 10,
          q_departName: ''
        },
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        total: 0,
        showEditTree: false,
        showCreateTree: false,
        selectDepartmentData: undefined,
        dialogFormVisible: false,
        dialogCreateFormVisible: false,
        showGrid: true,
        showSubGrid: false,
        activeName: '0',
        departmentForm: {
          departmentName: undefined,
          parentDepartmentUuid: undefined,
          remark: undefined,
          departmentType: '',
          userType: undefined,
          uuid: ''
        },
        treeData: [],
        treeHighlight: true,
        filterText: '',
        gridListTableData: undefined,
        dialogStatus: undefined,
        addFlag: false,
        departmentOptions: [],
        curDepartmentUuid: '',
        departmentTypeOptions: undefined
      }
    },
    components: {
      gridList,
      departmentEdit,
      departmentCreate
    },
    mounted () {
      this.loadData()
      this.getDepartmentType()  // 加载部门类别下拉框 首次加载
    },
    methods: {
      loadData () {
        getDepartmentList(this.listQuery)
          .then(
            function (result) {
              this.departmentList = result.childrenDepartmentVoList
              this.total = result.pageCount
            }.bind(this)
          )
          .catch(
            function (error) {
              console.log(error)
            }
          )
      },
      loadDepartmentTree () {
        getDepartmentTreeData()
          .then(
            function (result) {
              this.treeData = []
              this.treeData.push(result)
            }.bind(this)
          )
          .catch(
            function (error) {
              console.log(error)
            }
          )
      },
      // 获取用户状态信息
      getDepartmentType () {
      // 获取用户类型信息
        listUserType()
        .then(
            function (result) {
              this.departmentTypeOptions = result
            }.bind(this)
          )
        .catch(
          function (error) {
            console.log(error)
          }
        )
      },
      // 改变分页大小
      handleSizeChange (val) {
        this.listQuery.limit = val
        this.loadData()
      },
    // 跳转页数
      handleCurrentChange (val) {
        this.listQuery.page = val
        this.loadData()
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      handleFilter () {
        this.listQuery.page = 1
        this.loadData()
      },
      handleCreate () {
        this.dialogStatus = '添加部门'
        this.showCreate = true
        this.showEdit = false
        this.dialogFormVisible = false
        this.dialogCreateFormVisible = true
        this.addFlag = false
        this.$refs.departmentCreateVue.initParentDepartmentUuid('')
      },
      getDepartmentSelect (uuid, userType) {
        // 获取部门信息
        getParenetDepartmentSelect(uuid, userType)
          .then(
              function (result) {
                let unChoose = {departmentName: '', disabled: false}
                result.unshift(unChoose)
                this.departmentOptions = result
              }.bind(this)
            )
          .catch(function (error) {
            console.log(error)
          })
      },
      handleTabClick (tab, event) {
        if (tab.name === '0') {
          this.showGrid = true
          this.showSubGrid = false
        } else if (tab.name === '1') {
          this.showGrid = false
          this.filterText = ''
          this.loadDepartmentTree()
        }
      },
      handleNodeClick (data) {
        this.departmentOptions = []
        this.selectDepartmentData = data
        this.showSubGrid = true
        if (!data.pid) {
          this.showEditTree = false
          this.showCreateTree = false
          return
        }
        this.showEditTree = true
        this.showCreateTree = false
        this.curDepartmentUuid = data.id
        getDepartmentDetail(data.id)
          .then(
            function (result) {
              this.departmentForm = result.departmentBaseVo
              this.getDepartmentSelect(data.id, this.departmentForm.userType)
              if (result.departmentBaseVo.parentDepartmentUuid) {
                let chooseParentName = {uuid: result.departmentBaseVo.parentDepartmentUuid, departmentName: result.departmentBaseVo.parentDepartmentName, disabled: false}
                this.departmentOptions.push(chooseParentName)
              }
              this.dialogStatus = '编辑部门'
              this.addFlag = true
            }.bind(this)
          )
          .catch(function (error) {
            console.log(error)
          })
      },
      handleTreeCreate () {
        this.departmentOptions = []
        this.departmentOptions.push({
          uuid: this.selectDepartmentData.id,
          departmentName: this.selectDepartmentData.name,
          disabled: false
        })
        this.showEditTree = false
        this.showCreateTree = true
        this.$refs.departmentCreateTreeVue.initParentDepartmentUuid(this.selectDepartmentData.id, this.selectDepartmentData.departmentType)
      },
      handleFilterReset () {
        this.listQuery = {
          page: 1,
          limit: 10,
          q_departName: ''
        }
        this.loadData()
      },
      handleTreeDelete () {
        if (this.selectDepartmentData.leaf) {
          this.$confirm('确定删除此项？', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
          .then(() => {
            this.delete(this.selectDepartmentData.id)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          this.$message({
            type: 'error',
            message: '删除失败! 存在下级部门，请先删除下级部门！'
          })
        }
      },
      delete () {
        deleteDepartment(this.selectDepartmentData.id)
          .then(
            function (result) {
              this.showEditTree = false
              this.showCreateTree = false
              this.loadData()
              this.loadDepartmentTree()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }.bind(this)
          )
          .catch(function (error) {
            console.log(error)
          })
      },
      initDepartmentForm () {
        this.departmentForm = {
          departmentName: undefined,
          parentDepartmentUuid: undefined,
          remark: undefined,
          departmentType: undefined,
          userType: undefined,
          uuid: ''
        }
      },
      departmentDeleteEvent (data) {
        this.deptDeleteEvent(data.uuid)
      },
      departmentEditEvent (data) {
        this.curDepartmentUuid = data.uuid
        this.getDepartmentSelect(data.uuid, data.userType)
        getDepartmentDetail(data.uuid)
          .then(
            function (result) {
              this.departmentForm = result.departmentBaseVo
              if (result.departmentBaseVo.parentDepartmentUuid) {
                let chooseParentName = {uuid: result.departmentBaseVo.parentDepartmentUuid, departmentName: result.departmentBaseVo.parentDepartmentName, disabled: false}
                this.departmentOptions.push(chooseParentName)
              }
              this.dialogStatus = '编辑部门'
              this.addFlag = true
              this.dialogFormVisible = true
              this.dialogCreateFormVisible = false
            }.bind(this)
          )
          .catch(
            function (error) {
              console.log(error)
            }
          )
      },
      deptDeleteEvent (data) {
        deleteDepartment(data)
          .then(
            function (result) {
              this.dialogFormVisible = false
              this.dialogCreateFormVisible = false
              this.loadData()
              this.loadDepartmentTree()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }.bind(this)
          )
          .catch(function (error) {
            console.log(error)
          })
      },
      deptUpdateEvent (data) {
        updateDepartment(data)
          .then(
            function (result) {
              this.dialogFormVisible = false
              this.dialogCreateFormVisible = false
              this.loadData()
              this.loadDepartmentTree()
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
            }.bind(this)
          )
          .catch(function (error) {
            console.log(error)
          })
      },
      deptAddEvent (data) {
        if (data.parentDepartmentUuid === 'CREATION_VIRTUAL_UUID') {
          data.parentDepartmentUuid = null
        }
        createDepartment(data)
          .then(
            function (result) {
              this.dialogFormVisible = false
              this.dialogCreateFormVisible = false
              this.showEditTree = false
              this.showCreateTree = false
              this.loadData()
              this.loadDepartmentTree()
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
            }.bind(this)
          )
          .catch(function (error) {
            console.log(error)
          })
      },
      handleClose () {
        this.dialogFormVisible = false
        this.dialogCreateFormVisible = false
        this.showEditTree = false
        this.showCreateTree = false
        this.filterText = ''
        this.loadData()
        this.loadDepartmentTree()
      }
    },
    watch: {
      filterText (val) {
        this.$refs.departmentTree.filter(val)
      }
    }
  }
</script>

<style scoped>
    @import "assets/css/usermanagement.less"
</style>