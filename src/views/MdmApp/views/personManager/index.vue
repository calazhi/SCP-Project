<template>
  <div class="person-manager">
    <org-house-tree-view :search="search" :exportHouseNode="exportHouseNode" class="org-view-tree" ref="OrgHouseTreeView"></org-house-tree-view>
    <div class="tree-view-container">
      <div class="operation pb10 clearfix box-sizing">
        <!-- 操作栏 -->
        <el-col :md="24">
          <el-button type="primary" @click="onPersonEdit">添加</el-button>
          <person-edit ref="personEdit" :search="search" :exportHouseNode="exportHouseNode" :dictItem="dictItem"></person-edit>
          <el-button @click="onPersonUpload">导入</el-button>
          <upload title="人员导入" :search="search" action="/scp-mdmapp/user/uploadUsers" downloadUrl="/scp-mdmapp/templates/personTemplate.xlsx" tips="请选择EXCEL文件！" ref='personUpload' @successUpload="listChange"></upload>
          <el-button @click="onDownload" ref="download" :headers="tokenHeaders">导出</el-button>
          <el-button type="danger" @click="onDelBatchPerson" class="danger">批量删除</el-button>
          <span class="select-name">姓名：</span>
          <el-input v-model.trim="personSearch.name" placeholder="请输入姓名" @change="onNameCheck" class="name-input"></el-input>
          <span class="select-name">性别：</span>
          <el-select clearable v-model="personSearch.sex" placeholder="请选择性别" class="name-input">
            <el-option v-for="item in dictItem.sexList" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
          </el-select>
          <span class="select-name">人员类型：</span>
          <el-select clearable v-model="personSearch.userType" placeholder="请选择人员类型" class="name-input">
            <el-option v-for="item in dictItem.userTypeList" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
          </el-select>
          <el-button class="primary query primary-select" type="primary" @click="onQuery" :loading="isLoading">查询</el-button>
          <el-button class="primary query primary-clear" type="primary" @click="onReset">重置</el-button>
        </el-col>
      </div>
      <div class="person-list" height="400" style="min-width:1200px">
        <!-- 带分页表格 -->
        <el-table :data="tableData" stripe height="640" @selection-change="onHandleSelectionChange">
          <el-table-column fixed="left" type="selection" width="55">
          </el-table-column>
          <el-table-column label="姓名" prop="name">
          </el-table-column>
          <el-table-column label="人员类型" prop="userType" :formatter="filtersUserType">
          </el-table-column>
          <el-table-column label="性别" prop="sex" :formatter="filtersSex">
          </el-table-column>
          <el-table-column label="年龄" prop="age">
          </el-table-column>
          <el-table-column label="证件类型" prop="idenType" :formatter="filtersIdenType">
          </el-table-column>
          <el-table-column label="证件号码" prop="idenNum" width="200">
          </el-table-column>
          <el-table-column label="房屋地址" prop="houseName" width="200" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column label="电话号码" prop="phone" width="120">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="onPersonEdit(scope.row)" size="mini">
                编辑</el-button>
              <el-button @click="onDelPerson(scope.row)" size="mini" type="danger" class="danger">
                删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="table-pager" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="onSizeChange" @current-change="onCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import OrgHouseTreeView from './OrgHouseTreeView'
import PersonEdit from './PersonEdit'
import Upload from '../../components/Upload'
import { getPersonList, deletePerson, batchDeletePerson, getUser, getDictItem, personDownload } from '../../apis/person_manager'
import { LOG_TAG } from '@/views/MdmApp/assets/js/index.js'
export default {
  data () {
    return {
      tokenHeaders: { 'FrontType': 'scp-admin-ui', 'Authorization': sessionStorage.token },
      exportHouseNode: {
        houseUuid: '',                      // 搜索关键词
        orgUuid: ''                         // 搜索关键词
      },
      dictItem: {                           // 字典库
        userTypeList: [],                   // 业主类型
        sexList: [],                        // 性别字典
        idenTypeList: [],                   // 证件类型字典
        nationList: [],                     // 名族字典
        focusOnPersonnelList: []            // 重点关注字典
      },
      personSearch: {                       // 人员信息初始化 人员新增使用
        name: '',
        userType: '',
        idenType: '',
        sex: '',
        houseUuid: '',
        uuid: '',
        orgUuid: '',
        facePic: ''
      },
      isLoading: false,                   // 提交按键锁定
      selections: [],                     // 选中人员信息
      total: 1,                           // 数据总量 默认1
      currentPage: 1,                     // 当前页 默认1
      pageSize: 10,                       // 当前页展示数据量 默认10
      tableData: [],                      // 分页显示人员信息
      age: 0,                             // 默认年龄
      orgUuid: ''                         //
    }
  },
  components: {
    OrgHouseTreeView,
    Upload,
    PersonEdit
  },
  methods: {
    /**
     * @description 搜索姓名验证
     */
    onNameCheck: function () {
      if (this.personSearch.name !== '') {
        if (!/^[\u4e00-\u9fa5A-Za-z0-9·]+$/.test(this.personSearch.name)) {
          this.personSearch.name = ''
          this.$message({
            message: '请输入正确中英文姓名',
            type: 'warning'
          })
        }
      }
    },
    /**
     * @description 点击table组件复选框触发
     * @param {Array} val 所有选中行数据
     */
    onHandleSelectionChange: function (val) {
      this.selections = val
    },
    /**
     * @description 分页组件单页总数变化
     * @param {Number} val 选择的单页总数得值
     */
    onSizeChange: function (val) {
      this.pageSize = val
      this.currentPage = 1
      this.search(true)
    },
    /**
     * @description 分页组件当前页变化
     * @param {Number} val 选择当前页的值
     */
    onCurrentChange: function (val) {
      this.currentPage = val
      this.search(true)
    },
    /**
     * @description 开始人员添加/编辑
     * @param {Object} personInfo @default {} 人员信息
     */
    onPersonEdit: function (personInfo = {}) {
      var Editors = {
        uuid: personInfo.uuid,
        houseUuid: personInfo.houseUuid
      }
      var personInfoTmp
      // 人员编辑
      if (personInfo.uuid) {
        getUser(Editors)
          .then(res => {
            if (res.data.code === '00000') {
              personInfoTmp = res.data.data
              this.$refs['personEdit'].personEdit(personInfoTmp)
            } else {
              this.$message({
                message: res.data.data,
                type: 'warning'
              })
            }
          })
          .catch(err => {
            this.$message({
              message: '服务器连接异常',
              type: 'warning'
            })
            console.warn(LOG_TAG + '人员信息加载err')
            console.warn(err)
          })
      } else {
        personInfoTmp = Object.assign({}, personInfo)
        this.$refs['personEdit'].personEdit(personInfoTmp)
      }
    },
    /**
     * @description 人员删除
     * @param {Object} personInfo @default {} 人员信息
     */
    onDelPerson: function (personInfo = {}) {
      this.$confirm('确定要刪除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        let personInfoobj = { userUuid: personInfo.uuid, houseUuid: personInfo.houseUuid }
        deletePerson(personInfoobj).then(res => {
          if (res.data.code === '00000') {
            this.$message({
              message: res.data.data,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.data,
              type: 'warning'
            })
          }
          // 删除成功后重新请求
          this.search(true)
        })
          // 服务器异常
          .catch(err => {
            this.$message({
              message: '服务器连接异常',
              type: 'warning'
            })
            console.warn(LOG_TAG + '人员数据删除err')
            console.warn(err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * @description 过滤模板函数
     * @param {Array} item 字典库
     * @param {Object} row 人员信息参数
     * @param {Object} column 数据当前列
     * @return {string} 显示过滤结果
     */
    filterdata: function (item, row, column) {
      var fingerFace = row[column.property]
      for (var tmp of item) {
        if (tmp.itemCode === fingerFace) {
          return tmp.itemName
        }
      }
    },
    /**
     * @description 人员信息分页列表显示 回显性别 业主性别类型过滤
     * @param {Object} row 人员信息参数
     * @param {Object} column 数据当前列
     * @return {string} 显示过滤结果
     */
    filtersSex: function (row, column) {
      return this.filterdata(this.dictItem.sexList, row, column)
    },
    /**
     * @description 人员信息分页列表显示 回显业主类型 业主类型过滤
     * @param {Object} row 人员信息参数
     * @param {Object} column 数据当前列
     * @return {string} 显示过滤结果
     */
    filtersUserType: function (row, column) {
      return this.filterdata(this.dictItem.userTypeList, row, column)
    },
    /**
     * @description 人员信息分页列表显示 回显证件类型 证件类型过滤
     * @param {Object} row 人员信息参数
     * @param {Object} column 数据当前列
     * @return {string} 显示过滤结果
     */
    filtersIdenType: function (row, column) {
      return this.filterdata(this.dictItem.idenTypeList, row, column)
    },
    /**
     * @description 人员批量删除
     * @param {Array} personInfo @default [] 人员信息
     */
    onDelBatchPerson: function () {
      const personList = [].concat(this.selections)
      let ids = []
      if (personList.length <= 0) {
        this.$message({
          message: '请至少选择一项！',
          type: 'warning'
        })
        return
      }
      for (let i = 0, length = personList.length; i < length; i++) {
        ids.push({ userUuid: personList[i].uuid, houseUuid: personList[i].houseUuid })
      }
      this.$confirm('确定要刪除人员信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        batchDeletePerson({ users: ids }).then(res => {
          if (res.data.code === '00000') {
            this.$message({
              message: res.data.data,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.data,
              type: 'warning'
            })
          }
          this.search({})
        })
          // 服务器连接异常，未收到成功或失败返回
          .catch(err => {
            this.$message({
              message: '服务器连接异常',
              type: 'warning'
            })
            console.warn(LOG_TAG + '人员批量删除err')
            console.warn(err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * @description 打开人员数据导入页面
     */
    onPersonUpload: function () {
      this.$refs['personUpload'].openDialog()
    },
    /**
     * @description 导入成功
     * 子组件导入成功后，通知父组件进行相应的操作，这里是触发刷新数据
     */
    listChange: function () {
      this.search()
    },
    /**
     * @description 搜索查询按钮
     */
    onQuery: function () {
      this.search({})
    },
    /**
     * @description 搜索重置按钮
     */
    onReset: function () {
      this.personSearch.name = ''
      this.nameCheckResult = 0
      this.personSearch.userType = ''
      this.personSearch.sex = ''
      this.search({})
    },
    /**
     * @description 人员查询
     * 搜索条件、保存后搜索清空index页面搜索关键词
     * @param {string} options @default {} 非空 增加查询条件
     * @param {string} isSave  @default {} 非空 特殊新增条件下 无视查询条件 新增人员信息置顶显示 便于操作确认及修改
     */
    search: function (options, isSave) {
      let condition = {}
      condition.pageSize = this.pageSize
      condition.currentPage = this.currentPage
      if (options) {
        condition.name = isSave ? '' : this.personSearch.name
        condition.sex = isSave ? '' : this.personSearch.sex
        condition.userType = isSave ? '' : this.personSearch.userType
        condition.orgUuid = this.exportHouseNode.orgUuid
        condition.houseUuid = this.exportHouseNode.houseUuid
      }
      getPersonList(condition)
        .then(res => {
          this.total = res.data.data.totalCount
          var data = res.data.data.result
          for (var tmp in data) {
            data[tmp].age = data[tmp].birth ? new Date().getYear() - new Date(data[tmp].birth).getYear() : ''
          }
          this.tableData = data
        })
        .catch(err => {
          this.$message({
            message: '服务器连接异常',
            type: 'warning'
          })
          console.warn(LOG_TAG + '条件查询err')
          console.warn(err)
        })
    },
    /**
     * @description 导出按钮
     */
    onDownload: function () {
      let params = {}
      params.houseUuid = this.exportHouseNode.houseUuid
      params.orgUuid = this.exportHouseNode.orgUuid
      params.name = this.personSearch.name
      params.userType = this.personSearch.userType
      params.sex = this.personSearch.sex
      personDownload(params)
        .then(res => {
          let fileName = '人员表.xlsx'
          let blob = new Blob([res.data], { type: 'application/x-xls' })
          if (navigator.appVersion.toString().indexOf('.NET') > 0) {
            window.navigator.msSaveBlob(blob, fileName)
          } else {
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
        .catch(err => {
          this.$message({
            message: '服务器连接异常',
            type: 'warning'
          })
          console.warn(LOG_TAG + '人员导出下载err')
          console.warn(err)
        })
    }
  },
  mounted: function () {
    // 字典库加载
    getDictItem()
      .then(res => {
        this.dictItem.userTypeList = res.data.data.userType
        this.dictItem.sexList = res.data.data.sex
        this.dictItem.idenTypeList = res.data.data.idenType
        this.dictItem.nationList = res.data.data.nation
        this.dictItem.focusOnPersonnelList = res.data.data.focusOnPersonnel
      })
      .catch(err => {
        console.warn(LOG_TAG + '字典库加载err')
        console.warn(err)
      })
    this.search()
  }
}
</script>
<style scoped>
.person-manager {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  min-height: 500px;
}

.person-list {
  flex: 1;
  position: relative;
  margin-top: 10px;
  display: flex;
  flex-flow: column;
}

.tree-view-container {
  height: 100%;
  display: flex;
  flex-flow: column;
  border: 1px solid #dddee1;
  margin-left: 210px;
  padding: 10px;
  box-sizing: border-box;
}

.table-pager {
  padding: 0;
  margin-top: 10px;
  text-align: right;
}
.demo-form-inline {
  padding-top: 15px;
  margin-top: 10px;
  box-sizing: border-box;
  border: 1px solid #cccc;
}
.name-input {
  padding-top: 5px;
  margin-left: 5px;
  width: 190px;
  /* overflow: hidden; */
}
.select-name{
  margin-left: 12px;
  text-align: center;
  color: #999999;
  box-sizing: border-box; 
}
.primary-select {
  margin-left: 30px;
}
/* .query {
  margin-left: 15px;
} */
.el-table th {
  height: 60px;
}
.primary:focus {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
.danger:focus {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}
</style>
