<template>
  <div class="org-manager" v-loading="loading">
    <org-tree-view ref="orgTree" :search="search" :getArrangerTree="getArrangerTree" class="org-view-tree" :exportOrgNode="exportOrgNode"></org-tree-view>
    <div class="tree-view-container">
      <div class="operation clearfix" style="min-width:1000px">
        <!-- 操作栏 -->
        <el-button type="primary" @click="onOrgEdit" class="primary">添加</el-button>
        <org-edit :search="search" ref="orgEdit" :exportOrgNode="exportOrgNode" @successOrgEdit="successOrgEdit"></org-edit>
        <el-button :search="search" @click="onOrgUpload">导入</el-button>
        <upload title="组织导入" action="/scp-mdmapp/org/uploadOrgs" downloadUrl="/scp-mdmapp/templates/orgTemplate.xlsx" tips="请选择EXCEL文件！" ref='orgUpload' @successUpload="successUpload"></upload>
        <el-button @click="onDownload" :headers="tokenHeaders">导出</el-button>
        <el-button type="danger" @click="onDelBatchOrg" class="danger">批量删除</el-button>
        <span class="house-num">组织名称：</span>
        <el-input v-model.trim="name" placeholder="请输入组织名称" class="house-num-input" :maxlength="64"></el-input>
        <span class="span">查</span>
        <el-button type="primary" class="lookup-btn, primary" @click="onSearchOrgName">查询</el-button>
        <el-button type="primary" class="lookup-btn, primary" @click="onClearup">重置</el-button>
      </div>
      <div class="org-list">
        <!-- 带分页表格 -->
        <el-table :data="tableData" stripe height="100%" @selection-change="handleSelectionChange">
          <el-table-column fixed="left" type="selection" width="55">
          </el-table-column>
          <el-table-column label="组织名称" prop="name">
          </el-table-column>
          <el-table-column label="上级组织名称" prop="orgParentName">
          </el-table-column>
          <el-table-column label="描述" prop="memo">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click.stop="onOrgEdit(scope.row)" size="mini">
                编辑</el-button>
              <el-button @click.stop="onOrgDel(scope.row)" size="mini" type="danger" class="danger">
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
import OrgTreeView from './OrgTreeView'
import OrgEdit from './OrgEdit'
import Upload from '../../components/Upload'
import { getOrgList, deleteOrg, deleteOrgs, orgDownload } from '../../apis/org_manager'
export default {
  data () {
    return {
      tokenHeaders: { 'FrontType': 'scp-admin-ui', 'Authorization': sessionStorage.token },
      // 焦点组织对象
      exportOrgNode: {
        // 焦点组织uuid
        uuid: '',
        // 焦点组织父组织的uuid
        parentUuid: '',
        // 根节点uuid
        rootUuid: '',
        // 根节点组织名称
        rootName: '',
        // 焦点组织名称
        orgName: '',
        // 根节点组织类型
        rootOrgType: ''
      },
      // 组织uuid
      uuid: null,
      // 父组织uuid
      orgParentUuid: null,
      // 上级组织uuid
      parentUuid: '',
      // 被选中行
      selections: [],
      // 组织uuid
      orgUuid: '',
      // 默认当前页
      total: 1,
      // 搜索组织名称
      name: '',
      // 当前页
      currentPage: 1,
      // 每页显示条数
      pageSize: 10,
      // 列表信息数组
      tableData: [],
      loading: false
    }
  },
  components: {
    // 组织树组件
    OrgTreeView,
    // 添加编辑组件
    OrgEdit,
    // 上传组件
    Upload
  },
  methods: {
    /**
     * @description 点击table组件复选框触发
     * @param Array val 所有选中行数据
     */
    handleSelectionChange: function (val) {
      this.selections = val
    },
    /**
     * @description 调用组织树组件
     * @param 指向组织树组件
     */
    getArrangerTree: function () {
      this.$refs['orgTree'].getArrangerTree()
    },
    /**
     * @description 分页组件单页总数变化
     * @param Number val 选择的单页总数得值，执行刷新
     */
    onSizeChange: function (val) {
      this.pageSize = val
      this.currentPage = 1
      // 焦点组织uuid刷新
      this.search({ uuid: this.exportOrgNode.uuid })
    },
    /**
     * @description 分页组件当前页变化
     * @param Number val 选择当前页的值,执行刷新
     */
    onCurrentChange: function (val) {
      this.currentPage = val
      let condition = {}
      // 搜索组织名称
      condition.name = this.name || null
      // 焦点组织uuid或组织uuid或根节点组织uuid
      condition.uuid = this.exportOrgNode.uuid || this.orgUuid || this.exportOrgNode.rootUuid
      // 当前页
      condition.currentPage = this.currentPage
      // 每页信息
      condition.pageSize = this.pageSize
      // 调用刷新接口
      getOrgList(condition)
        .then(res => {
          var self = this
          this.total = res.data.data.totalCount
          self.tableData = res.data.data.result
          self.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    /**
    * @description 开始组织编辑/添加
    *
    * @param {Object} orgInfo @default {} 组织信息，添加信息，引用子组件orgEdit
    */
    onOrgEdit: function (orgInfo = {}) {
      const orgInfoTmp = Object.assign({}, orgInfo)
      this.$refs['orgEdit'].orgEdit(orgInfoTmp)
    },
    /**
    * @description 开始组织编辑/添加成功后
    *
    * @param {Object} orgInfo @default {} 组织信息，添加信息成功，再次调用组织树
    */
    successOrgEdit: function () {
      // 请求编辑或添加组件组织树列表
      this.getArrangerTree()
      let condition = {}
      // 组织名称
      condition.name = this.name || null
      // 焦点组织uuid或根组织uuid
      condition.uuid = this.exportOrgNode.uuid || this.orgUuid || this.exportOrgNode.rootUuid
      // 当前页
      condition.currentPage = this.currentPage
      // 每页信息条数
      condition.pageSize = this.pageSize
      // 请求组织列表接口，刷新界面
      getOrgList(condition)
        .then(res => {
          var self = this
          this.total = res.data.data.totalCount
          self.tableData = res.data.data.result
          self.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
      this.exportOrgNode.uuid = ''
      this.exportOrgNode.parentUuid = ''
      this.exportOrgNode.orgName = ''
      this.exportOrgNode.rootName = ''
    },
    /**
    * @description 组织查询
    *
    * @param {Object} orgNames @default {} 组织名称查询;添加一个参数为name，表示需要搜索的组织名称，再次请求刷新界面，返回数据
    */
    onSearchOrgName: function (options) {
      // 验证用户输入查询信息是否合法
      let condition = {}
      condition.name = this.name
      if (/[^\w\u4E00-\u9FA5]/g.test(this.name)) {
        this.$message({
          message: '只能输入中文、英文或数字组织名称!',
          type: 'warning'
        })
        this.name = ''
        return
      }
      // 合法查询信息之后再按查询条件进行查询
      condition.uuid = this.exportOrgNode.uuid || this.exportOrgNode.rootUuid
      condition.currentPage = this.currentPage
      condition.pageSize = this.pageSize
      getOrgList(condition)
        .then(res => {
          var self = this
          this.total = res.data.data.totalCount
          self.tableData = res.data.data.result
          self.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    /**
       * @description 组织查询信息重置
       *
       * @param {Object} orgInfo @default {} 组织名称重置,刷新全部
       */
    onClearup: function () {
      // 用户输入重置
      this.name = ''
      let condition = {}
      // 重新获取用户输入组织名
      condition.name = this.name
      // 焦点组织uuid或根组织uuid
      condition.uuid = this.exportOrgNode.uuid || this.exportOrgNode.rootUuid
      condition.currentPage = this.currentPage
      condition.pageSize = this.pageSize
      // 调用组织列表刷新界面信息
      getOrgList(condition)
        .then(res => {
          var self = this
          this.total = res.data.data.totalCount
          self.tableData = res.data.data.result
          self.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    /**
     * @description 组织删除
     *
     * @param {Object} orgInfo @default {} 组织信息，双层判断：1,首先判断父节点是否为'0';2,判断code是否为'00000'；给出相对应的提示信息
     */
    onOrgDel: function (orgInfo = {}) {
      var parentUuid = this.orgParentUuid
      // 提示信息，用户确认删除或取消
      this.$confirm('您确定要刪除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then((res) => {
        // 判断删除组织上级组织是否为根组织节点
        if (parentUuid !== '0') {
          deleteOrg({ uuid: orgInfo.uuid }).then(res => {
            if (res.data.code === '00000') {
              this.$message({
                message: res.data.data,
                type: 'success'
              })
              // 组织节点删除成功后，根据焦点组织uuid或父组织uuid或根节点组织uuid刷新界面
              this.search({ uuid: this.exportOrgNode.uuid || this.parentUuid || this.exportOrgNode.rootUuid })
              // 删除成功后，立即刷新组织树
              this.$refs['orgTree'].getArrangerTree()
              this.exportOrgNode.uuid = ''
              this.exportOrgNode.orgName = ''
              this.exportOrgNode.rootName = ''
              this.exportOrgNode.ownOrgType = ''
              this.exportOrgNode.parentOrgType = ''
            } else {
              this.$message({
                message: res.data.data,
                type: 'warning'
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$message({
            message: res.data.data,
            type: 'warning'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * @description 组织批量删除
     *
     * @param {Array} orgInfo @default [] 组织信息，双层判断：1,首先判断父节点是否为'0';2,判断code是否为'00000'；给出相对应的提示信息
     */
    onDelBatchOrg: function (orgInfo = {}) {
      var parentUuid = this.orgParentUuid
      // 被选中组织行组成新的数组
      const orgList = [].concat(this.selections)
      // 声明空数组，存储被选中组织行uuid
      var ids = []
      // 判断最少选择一项删除
      if (orgList.length <= 0) {
        this.$message({
          message: '请至少选择一项！',
          type: 'warning'
        })
        return
      }
      // 被选中选项uuid存储进数组ids中
      for (let i = 0, length = orgList.length; i < length; i++) {
        ids.push(orgList[i].uuid)
      }
      // 弹出提示信息,用户确认删除或取消
      this.$confirm('您确定要刪除组织信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then((res) => {
        // 判断选择项是否有根节点，若无怎执行删除操作
        if (parentUuid !== '0') {
          deleteOrgs({ uuid: this.exportOrgNode.uuid || this.exportOrgNode.rootUuid, ids: ids }).then(res => {
            if (res.data.code === '00000') {
              this.$message({
                message: res.data.data,
                type: 'success'
              })
              // 删除成功后，根据焦点组织uuid或根节点uuid刷新组织列表
              this.search({ uuid: this.exportOrgNode.uuid || this.parentUuid || this.exportOrgNode.rootUuid })
              // 刷新组织树
              this.getArrangerTree()
              this.exportOrgNode.orgName = ''
            } else {
              this.$message({
                message: res.data.data,
                type: 'warning'
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$message({
            message: res.data.data,
            type: 'warning'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
    * @description 导入，elementUI组织树自带函数，详情请查阅elementUI中导入部分
    *
    * @param
    */
    onOrgUpload: function () {
      this.$refs['orgUpload'].openDialog()
    },
    /**
    * @description 导入成功
    *
    * @param {condition} orgList @default [] 子组件导入成功后，通知父组件进行相应的操作，这里是触发刷新数据
    */
    successUpload: function () {
      // 导入成功，刷新组织树
      this.getArrangerTree()
      let condition = {}
      // 焦点组织uuid或根节点uuid
      condition.uuid = this.exportOrgNode.uuid || this.exportOrgNode.rootUuid
      // 每页显示信息条数
      condition.pageSize = this.pageSize
      // 当前页数
      condition.currentPage = this.currentPage
      // 导入成功再次刷新组织列表
      getOrgList(condition)
        .then(res => {
          var self = this
          this.total = res.data.data.totalCount
          self.tableData = res.data.data.result
          self.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    /**
     * @description 搜索刷新
     *
     * @param {condition} orgList @default [] 具有pagesize与pageNum两个参数，请求所有符合要求的数据，调用getOrgList,获取组织列表
     */
    search: function (options) {
      let condition = {}
      // 每页显示信息条数
      condition.pageSize = this.pageSize
      // 组织名称
      condition.name = this.name
      // 当前页数
      condition.currentPage = this.currentPage
      condition.uuid = this.exportOrgNode.uuid || this.exportOrgNode.rootUuid
      if (options) {
        condition.currentPage = this.currentPage
        this.orgUuid = condition.uuid = options.uuid || this.uuid
      }
      getOrgList(condition)
        .then(res => {
          var self = this
          this.total = res.data.data.totalCount
          self.tableData = res.data.data.result
          self.loading = false
          self.orgUuid = self.tableData[0].uuid
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    /**
    * @description 导出
    *
    * @param {condition} orgList @default [] elementUI组织树自带函数，详情请查阅elementUI中导出部分
    */
    onDownload: function () {
      // 根据组织名称与焦点组织uuid导出组织表
      let params = {}
      params.uuid = this.exportOrgNode.uuid || this.exportOrgNode.rootUuid
      params.name = this.name
      orgDownload(params)
        .then(res => {
          let fileName = '组织表.xlsx'
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
          console.warn('组织导出下载err')
          console.warn(err)
        })
    }
  },
  mounted: function () {
    this.search()
  }
}
</script>
<style lang='less' scoped>
.org-manager {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  min-height: 500px;
}
.org-list {
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
.org-view-tree {
  overflow: hidden;
}
.table-pager {
  padding: 0;
  margin-top: 10px;
  text-align: right;
}
.house-num {
  width: 10%;
  text-align: center;
  margin-left: 25px;
  padding-top: 10px;
  color: #999999;
  box-sizing: border-box;
}
.house-num-input {
  width: 20%;
  text-align: center;
  padding-top: 5px;
}
.span {
  visibility: hidden;
}
.lookup-btn {
  width: 10%;
  margin-left: 5%;
  border-radius: 5px;
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
