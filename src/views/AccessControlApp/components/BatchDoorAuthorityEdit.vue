<template>
<div class="dialog-padding">
  <el-dialog title="批量授权" :show-close=true :center=true :visible.sync="dialogOpen" width="1400px" top="6vh"  custom-class="dialog-Class">
    <el-tabs type="card" v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="住户" name="0"></el-tab-pane>
      <el-tab-pane label="物业" name="1"></el-tab-pane>
    </el-tabs>
    <el-container style="height:700px;">
        <el-aside class="park-tree"  style="height:95%" v-if="activeName === '0'">
          <el-input placeholder="组织树过滤" v-model="treeFilterText" clearable></el-input>
          <el-tree class="filter-tree" :filter-node-method="filterTreeNode" :data="treeData" :props="defaultProps" ref="orgTree" @node-click="handleNodeClick"></el-tree>
          <!-- <p class="tree-nodata" v-else>暂无数据</p> -->
        </el-aside>
        <el-main style="height:100%;width:1210px;padding-top:0px!important;overflow-y: hidden;">
          <div>
            <el-table :data="tableData" v-loading = "seatLoad" ref="carSeatData"  @select="handleSelectChange" @select-all="handleSelectAll" height="330" border style="width: 100%">
              <el-table-column type="selection" width="60" prop="userId" :selectable="checkboxInit"></el-table-column>
              <el-table-column type="index" label="人员编号" width="80"></el-table-column>
              <el-table-column prop="userName" label="姓名" ></el-table-column>
              <el-table-column prop="idenType" label="证件类型" width="100"></el-table-column>
              <el-table-column prop="idenNum" label="证件号"  width="200"></el-table-column>
              <el-table-column  label="人脸" >
                <template slot-scope="scope">
                    <span class="linkcred" v-if="scope.row.facePic" @click="handleShowFacePic(scope.$index,scope.row)">查看</span>
                    <span v-else>无</span>
                </template>
              </el-table-column>
              <el-table-column  label="指纹" >
                <template slot-scope="scope">
                    <span v-if="scope.row.finger">有</span>
                    <span v-else>无</span>
                </template>
              </el-table-column>
              <el-table-column prop="authId" label="授权状态">
                <template slot-scope="scope">
                    <span  v-if="scope.row.authId" >已授权</span>
                    <span v-else>未授权</span>
                </template>
              </el-table-column>
            </el-table>
            <el-col class="pageFootor">
              <el-pagination @size-change="userTableSizeChange" @current-change="userTableCurrentPageChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50, 100]" :page-size="pageSize" background layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </el-col>
          </div>
          <el-row class="row-border">
            <el-col :span="12" style="text-align:center">
                  <label>开始日期</label>
                  <span>
                    <el-date-picker v-model="startDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" :editable="false" :picker-options="pickerOptionsS">
                    </el-date-picker>
                  </span>
              </el-col>
              <el-col :span="12" style="text-align:center">
                  <span>结束日期</span>
                  <span>
                    <el-date-picker v-model="endDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" :editable="false" :picker-options="pickerOptionsE">
                    </el-date-picker>
                  </span>
              </el-col>
              <el-col :span="24" style="margin-top:10px">
                <span>门禁设备组:</span>
                <el-table :data="deviceGroups" border  style="text-align:left" :show-header='false' @selection-change="groupChange" ref="groupTab" height="180">
                  <el-table-column type="selection" prop="deviceID"></el-table-column>
                  <el-table-column prop="uuid" v-if="false"></el-table-column>
                  <el-table-column label="组名" prop="groupName"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
        </el-main>
      </el-container>
      <div slot="footer"  style="margin-top: -10px;">
        <el-button type="primary" @click="confirmClick($event)">保 存</el-button>
        <el-button type="info" @click="closeClick($event)">关 闭</el-button>
      </div>
  </el-dialog>
  <el-dialog title="人脸图片" :visible.sync="facePicVisible" width="350px" height="400px">
      <img :src= this.facePicPath class="facePicSize"/>
  </el-dialog>
</div>
</template>
<script>
import {listDeviceGroup, loadOrgTree, batchAddUserAuthorInfo} from '@/views/AccessControlApp/apis'
import {getOwners} from '@/views/AccessControlApp/apis/authMgmt'
export default {
  data () {
    return {
      dialogOpen: this.dialogVisible,
      activeName: '0',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      tableData: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      seatLoad: false,
      selectedUserRows: [],
      startDate: '',
      endDate: '',
      deviceGroups: [],
      groupIds: [],
      selectedOrgId: '',
      facePicVisible: false,
      facePicPath: '',
      pickerOptionsS: {
        disabledDate: time => {
          let endDate = this.endDate
          if (endDate) {
            return time.getTime() > endDate - 8.64e7 || time.getTime() < Date.now() - 8.64e7
          }
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      pickerOptionsE: {
        disabledDate: time => {
          let startDate = this.startDate
          if (startDate) {
            return time.getTime() < startDate
          }
          return time.getTime() < Date.now()
        }
      },
      treeFilterText: '' // 组织树过滤关键字
    }
  },
  props: ['dialogVisible', 'personType'],
  watch: {
    dialogVisible () {
      this.dialogOpen = this.dialogVisible
    },
    dialogOpen (val) {
      this.$emit('update:dialogVisible', this.dialogOpen)
    },
    // 组织树过滤关键字
    treeFilterText (val) {
      this.$refs.orgTree.filter(val)
    }
  },
  mounted () {
    this.loadTreeData()
    // 查询所有的设备组
    this.loadDeviceGroupTableData()
  },
  methods: {
    // 加载树的数据
    loadTreeData () {
      this.getOrgInfo()
    },
    getOrgInfo () {
      let _this = this
      loadOrgTree()
      .then(res => {
        let code = res.code
        if (code === '00000') {
          _this.treeData = res.data
        } else {
          _this.$message({
            type: 'warning',
            message: '加载组织树异常:' + res.message
          })
        }
      })
    },
    loadTableData (type) {
      let _this = this
      this.loading = true
      getOwners(this.currentPage, this.pageSize, type, {orgId: this.selectedOrgId})
      .then(res => {
        _this.total = res.total
        _this.tableData = res.rows
      })
      .catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    loadDeviceGroupTableData () {
      listDeviceGroup().then(result => {
        this.deviceGroups = result.data
      })
    },
     // 切换页签
    handleTabClick (tab, event) {
      this.total = 0
      this.tableData = []
      this.selectedUserRows = []
      this.selectedOrgId = ''
      this.deviceGroups = []
      this.treeData = []
      this.groupIds = []
      if (tab.name === '0') {
        this.loadTreeData()
      } else if (tab.name === '1') {
        this.loadTableData(tab.name)
      }
      this.startDate = ''
      this.endDate = ''
      this.loadDeviceGroupTableData()
    },
    // 选择树节点
    handleNodeClick (data) {
      this.selectedOrgId = data.uuid
      this.loadTableData(this.activeName)
    },
    // 勾选行的checkbox时触发
    handleSelectChange: function (selection, row) {
      let i = 0
      let len = this.selectedUserRows.length
      while (i < len && this.selectedUserRows[i].userId !== row.userId) {
        i++
      }
      // 如果已存在就删除，否则就添加
      if (i < len) {
        this.selectedUserRows.splice(i, 1)
      } else {
        this.selectedUserRows = this.selectedUserRows.concat(row)
      }
    },
    // 全选事件
    handleSelectAll: function (selection) {
      // 1.全部合并到已选数组
      this.selectedUserRows = this.selectedUserRows.concat(selection)
      // 2.去重
      let hash = {}
      this.selectedUserRows = this.selectedUserRows.reduce((item, next) => {
        if (!hash[next.userId]) {
          hash[next.userId] = true
          item.push(next)
        }
        return item
      }, [])
    },
    // 切换用户表格页面大小
    userTableSizeChange (val) {
      this.pageSize = val
      this.loadTableData(this.activeName)
    },
    // 翻页
    userTableCurrentPageChange: function (val) {
      this.currentPage = val
      this.loading = true
      getOwners(this.currentPage, this.pageSize, this.activeName, {orgId: this.selectedOrgId})
      .then(res => {
        this.total = res.total
        this.tableData = res.rows
      })
      .then(() => {
        let arr = []
        for (let row of this.selectedUserRows) {
          arr.push(row.userId)
        }
        for (let index in this.tableData) {
          if (arr.indexOf(this.tableData[index].userId) !== -1) {
            setTimeout(() => { this.$refs.carSeatData.toggleRowSelection(this.tableData[index]) }, 200)
          }
        }
      })
      .catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    // 设备组翻页
    groupChange: function (selections) {
      let _this = this
      _this.groupIds = []
      for (let sel of selections) {
        _this.groupIds.push(sel.uuid)
      }
    },
    closeClick: function (event) {
      this.$emit('dialogClose', false)
    },
    confirmClick: function (event) {
      if (!this.isSaveValid()) {
        return
      }
      let userArr = []
      for (let row of this.selectedUserRows) {
        userArr.push({
          userId: row.userId,
          userType: row.userType,
          userName: row.userName,
          facePic: row.facePic,
          finger: row.finger
        })
      }
      let postData = {
        personList: userArr,
        startDate: this.startDate,
        endDate: this.endDate,
        groupIds: this.groupIds
      }
      batchAddUserAuthorInfo(postData).then(res => {
        let code = res.code
        if (code === '00000') {
          this.$message({
            type: 'success',
            message: '批量授权成功！'
          })
          this.dialogOpen = false
          this.$emit('refreshPerson', this.personType)
        } else {
          this.$message({
            type: 'error',
            message: '批量授权保存失败:' + res.message
          })
        }
      })
    },
    handleShowFacePic (index, row) {
      this.facePicVisible = true
      this.facePicPath = row.facePic
    },
    // 根据授权状态设置表格行是否可选
    checkboxInit (row, index) {
      return !row.authId
    },
    // 保存时校验是否勾选
    isSaveValid () {
      if (this.selectedUserRows.length < 1) {
        this.$message({
          type: 'warning',
          message: '人员必须勾选！'
        })
        return false
      }
      if (!this.startDate || !this.endDate) {
        this.$message({
          type: 'warning',
          message: '开始日期、结束日期必须勾选！'
        })
        return false
      }
      if (this.groupIds.length < 1) {
        this.$message({
          type: 'warning',
          message: '设备组必须勾选！'
        })
        return false
      }
      return true
    },
    // 组织树过滤
    filterTreeNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/views/AccessControlApp/assets/css/batchDoorAuth.less";
.row-border {
  border-top:1px solid #606266;
  border-bottom:1px solid #606266;
  padding:10px 0px;
  margin-top: 10px;
  margin-bottom: 12px;
}
.dialog-Class {
  height:840px
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
  .el-dialog__footer {
    padding-bottom: 10px
  }
}
</style>