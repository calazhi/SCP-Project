<template>
  <div>
    <div class="event-form">
      <el-form ref="linkageForm" :model="linkageForm" label-width="80px">
        <el-row :gutter="10">
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item label="设备分类" prop="deviceType">
              <el-select v-model="linkageForm.deviceType" clearable placeholder="请选择设备分类" @change="getEvent" @clear="clear">
                <el-option v-for="item in deviceTypes" :key="item.id" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item label="事件类型" prop="eventType">
              <el-select v-model="linkageForm.eventType" clearable placeholder="请选择事件类型">
                <el-option v-for="item in eventOptions" :key="item.id" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item label="触发设备">
              <el-input class="device-input" v-model="deviceInputName" @click.native.prevent="onDeviceOpen" placeholder="请选择设备"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item>
              <el-button type="primary" @click="submitForm('linkageForm')">查询</el-button>
              <el-button type="primary" @click="resetForm('linkageForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item>
            <template slot-scope="scope">
              <el-button type="primary" @click.native.prevent="handleAddClick">新增</el-button>
              <el-button type="primary" @click.native.prevent="handleClickDelete">删除</el-button>
            </template>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="event-table">
      <el-table :data="linkageRuleList" border @selection-change="handleSelectionChange" :row-key="getRowKeys" ref="linkageRuleTable" tooltip-effect="light">
        <el-table-column type="selection" :reserve-selection="true" align="center"></el-table-column>
        <el-table-column prop="uuid" label="联动规则ID" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="eventTypeName" label="事件类型" align="center"></el-table-column>
        <el-table-column prop="eventSourceCode" label="资源点" align="center"></el-table-column>
        <el-table-column prop="deviceName" label="资源点名称" align="center"></el-table-column>
        <el-table-column prop="creator" label="创建者" align="center"></el-table-column>
        <el-table-column prop="isSequential" label="是否有序" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.isSequential === false ? '否' : '是'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" align="center">
          <template slot-scope="scope">
            <a @click="handleSelectClick(scope.$index,scope.row)">修改</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="el-page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryData.pageNo" :page-size="queryData.pageSize" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="queryData.total" v-show="showTable"></el-pagination>
    </div>
    <tree-component :is-check="true" :data="treeResult" :code="code" :show="deviceDialog" ref="ruleTree" @closeDeviceDialog="closeDeviceDialog"></tree-component>
    <rule-dialog :show="showAddDialog" @closeDialog="closeDialog" @closeDialogEdit="closeDialogEdit" :id="editTriggerId"></rule-dialog>
  </div>
</template>
<script>
import TreeComponent from './public_component/Tree.vue'
import RuleDialog from './public_component/RuleDialog.vue'
import { getLinkageRuleData, postDelLinkageByIdData, getLinkageRuleDeviceData, getLinkageRuleByCodeData, getSourceTreeData } from './apis/index'
export default {
  name: 'LinkageRule',
  components: {
    TreeComponent,
    RuleDialog
  },
  data () {
    return {
      deviceInputName: '',
      deviceDialog: false,
      treeResult: [],          // 第一层组织树
      showTable: false,        // 控制分页是否显示
      // 查询对象
      queryData: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      deviceTypes: [],         // 设备类型集合
      showAddDialog: false,    // 新增窗口打开
      linkageForm: {           // 联动规则表单
        deviceType: '',
        eventType: '',
        eventSourceCode: ''
      },
      linkageRuleList: [],     // 所有联动结果
      editTriggerId: '',       // 修改时传递的当前行id
      eventOptions: [],        // 事件类型集合
      code: '',                // 当前code码
      triggerRuleId: '',
      reset: false,
      hasSelected: [],          // 当前选中
      deviceData: [],
      getRowKeys (row) {
        return row.uuid
      }
    }
  },
  // 页面加载时获取设备类型
  mounted () {
    this.getDeviceType()
    this.getData()
  },
  methods: {
    // 向后台发送请求获取联动数据
    getData () {
      let param = Object.assign({}, this.queryData, this.linkageForm)
      getLinkageRuleData(param).then(res => {
        if (res.data.code === '00000') {
          this.linkageRuleList = res.data.data.rows
          this.queryData.total = res.data.data.total
          this.showTable = true
        } else {
          this.linkageRuleList = []
          this.showTable = false
          this.queryData.total = 0
          this.$message({
            message: res.data.message ? res.data.message : '请求数据失败',
            type: 'error'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取设备类型
    getDeviceType () {
      getLinkageRuleDeviceData().then(res => {
        if (res.data.code === '00000') {
          this.deviceTypes = res.data.data
        } else {
          this.deviceTypes = []
          this.$message({
            message: res.data.message ? res.data.message : '请求数据失败',
            type: 'error'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 通过code对应到相应的事件类型
    getEvent (value) {
      if (this.linkageForm.deviceType) {
        this.linkageForm.eventType = ''
        this.linkageForm.eventSourceCode = ''
        this.treeResult = []
        this.$refs.ruleTree.clear()
        this.deviceInputName = ''
        this.code = value
        getLinkageRuleByCodeData({ code: value }).then(res => {
          if (res.data.code === '00000') {
            this.eventOptions = res.data.data
          } else {
            this.eventOptions = []
          }
        }).catch(err => {
          console.log(err)
        })
        getSourceTreeData({ uuid: '' }).then(res => {
          if (res.data.code === '00000') {
            this.treeResult = [res.data.data]
          } else {
            this.treeResult = []
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 打开触发设备弹窗
    onDeviceOpen () {
      this.deviceDialog = true
    },
    // 关闭触发设备弹窗
    closeDeviceDialog (data) {
      this.deviceDialog = false
      if (data) {
        this.deviceData = data
        this.deviceInputName = data.map((item) => { return item.deviceName }).join(',')
        this.linkageForm.eventSourceCode = data.map((item) => { return item.deviceID }).join(',')
      }
    },
    // 通过每页的条数向后端获取数据
    handleSizeChange (val) {
      this.queryData.pageSize = val
      this.queryData.pageNo = 1
      this.getData()
    },
    handleCurrentChange (val) {
      // 显示当前页数
      this.queryData.pageNo = val
      this.getData()
    },
    //  修改
    handleSelectClick (index, row) {
      this.editTriggerId = row.uuid
      this.showAddDialog = true
    },
    // 新增
    handleAddClick () {
      this.editTriggerId = ''
      this.showAddDialog = true
    },
    closeDialogEdit () {
      this.editTriggerId = ''
      this.showAddDialog = false
    },
    // 关闭弹窗
    closeDialog () {
      this.editTriggerId = ''
      this.showAddDialog = false
      this.handleRefresh()
    },
    // 新增完成刷新页面
    handleRefresh () {
      this.treeResult = []
      this.resetForm('linkageForm')
      this.getData()
    },
    // 处理表行checkbox选中事件
    handleSelectionChange (rows) {
      this.hasSelected = []
      if (rows) {
        rows.forEach(row => {
          if (row) {
            this.hasSelected.push(row)
          }
        })
      }
    },
    // 友好的删除
    handleClickDelete () {
      if (this.hasSelected.length > 0) {
        this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.handleDelete()
          setTimeout(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }, 1500)
          this.$refs.linkageRuleTable.clearSelection()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
          this.$refs.linkageRuleTable.clearSelection()
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选中再点击删除!'
        })
      }
    },
    // 删除联动数据
    handleDelete () {
      let ids = this.hasSelected.map((item) => { return item.uuid }).join(',')
      if (ids !== '') {
        postDelLinkageByIdData({ triggerRuleId: ids }).then(res => {
          if (res.data.code === '00000') {
            this.getData()
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 查询联动结果
    submitForm () {
      this.queryData.pageNo = 1
      this.getData()
    },
    // 清空数据
    clear () {
      this.treeResult = []
      this.eventOptions = []
      this.$refs.ruleTree.clear()
      this.$refs['linkageForm'].resetFields()
      this.linkageForm.eventSourceCode = ''
      this.deviceInputName = ''
    },
    // 重置所有数据
    resetForm (formName) {
      this.clear()
      this.queryData.pageNo = 1
      this.getData()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.tree-menu {
  li {
    line-height: 1.5;
  }
}
.event-form {
  width: 100%;
  margin-top: 30px;
  .device-input {
    width: 220px;
  }
}
.event-table {
  width: 100%;
  a {
    color: #409eff;
  }
  a:hover {
    cursor: pointer;
  }
  .el-table {
    width: 100%;
  }
  .el-page {
    text-align: center;
  }
}
</style>
