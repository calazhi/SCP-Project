<template>
  <div class="house-manager">
    <org-house-tree-view ref="orgTree" :search="search" class="org-view-tree" :exportOrgNode="exportOrgNode"></org-house-tree-view>
    <div class="tree-view-container">
      <div class="operation clearfix" style="min-width:1000px">
        <!-- 操作栏 -->
        <el-button type="primary" @click="onHouseEdit" class="primary">添加</el-button>
        <house-edit :search="search" ref="houseEdit" :exportOrgNode="exportOrgNode" @successHouseEdit="successHouseEdit"></house-edit>
        <el-button @click="onHouseUpload">导入</el-button>
        <upload title="房屋导入" action="/scp-mdmapp/house/uploadHouses" downloadUrl="/scp-mdmapp/templates/houseTemplate.xlsx" tips="请选择EXCEL文件！" ref='houseUpload' @successUpload="successUpload"></upload>
        <el-button @click="onHouseDownLoad" :headers="tokenHeaders">导出</el-button>
        <el-button type="danger" @click="onDelBatchHouse" class="danger">批量删除</el-button>
        <span class="house-num">房屋号：</span>
        <el-input v-model.trim="houseNum" placeholder="请输入房间号" class="house-num-input" :maxlength="30"></el-input>
        <span class="span">查</span>
        <el-button type="primary" @click="onLookUp" class="lookup-btn, primary">查询</el-button>
        <el-button type="primary" @click="onClearUp" class="lookup-btn, primary">重置</el-button>
      </div>
      <div class="house-list">
        <!-- 带分页表格 -->
        <div class="house-table">
          <el-table :data="tableData" stripe height="100%" @selection-change="handleSelectionChange">
            <el-table-column fixed="left" type="selection" width="55">
            </el-table-column>
            <el-table-column label="房屋号" prop="houseNum">
            </el-table-column>
            <el-table-column label="房屋名称" prop="houseName" style="min-width:400px">
            </el-table-column>
            <el-table-column label="居住人数" prop="residentNum">
            </el-table-column>
            <el-table-column label="房屋用途" prop="houseUseFor" :formatter="fingerFaceFormat">
            </el-table-column>
            <el-table-column label="面积" prop="buildingArea">
            </el-table-column>
            <el-table-column label="楼层" prop="floor">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button @click.stop="onHouseEdit(scope.row)" size="mini">
                  编辑</el-button>
                <el-button @click.stop="onDelHouse(scope.row)" size="mini" type="danger" class="danger">
                  删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination class="table-pager" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="onSizeChange" @current-change="onCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import OrgHouseTreeView from './OrgHouseTreeView'
import HouseEdit from './HouseEdit'
import Upload from '../../components/Upload'
import { getHouseList, deleteHouse, batchDeleteHouse, houseDownload } from '../../apis/house_manager'
export default {
  data () {
    return {
      tokenHeaders: { 'FrontType': 'scp-admin-ui', 'Authorization': sessionStorage.token },
      // 焦点组织节点
      exportOrgNode: {
        // 焦点组织的uuid
        uuid: '',
        // 焦点组织上级根节点的uuid
        rootUuid: '',
        // 焦点组织上级根节点的组织名称
        rootName: '',
        // 焦点组织节点的组织名称
        orgName: ''
      },
      uuid: null,
      // 组织节点uuid
      orgUuid: null,
      // 批量删除时组织节点uuid的集合数组
      selections: [],
      // 父组织节点uuid
      parentUuid: '',
      // 默认显示第一页
      total: 1,
      // 当前页为第一页
      currentPage: 1,
      // 默认每页显示10条信息
      pageSize: 10,
      // 房屋列表数据集合数组
      tableData: [],
      // 组织树焦点组织key
      searchKey: '',
      // 房屋号
      houseNum: '',
      // 房屋名称
      houseName: '',
      loading: false,
      props: {
        orgSelectClick: {
          type: Function,
          default: function () { }
        }
      }
    }
  },
  components: {
    // 房屋列表界面组织树组件
    OrgHouseTreeView,
    // 添加/编辑界面组件
    HouseEdit,
    // 上传、模板下载界面组件
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
     * @description 分页组件单页总数变化
     * @param Number val 选择的单页总数得值
     */
    onSizeChange: function (val) {
      this.pageSize = val
      this.currentPage = 1
      this.search({ orgUuid: this.exportOrgNode.uuid })
    },
    /**
     * @description 分页组件当前页变化
     * @param Number val 选择当前页的值
     */
    onCurrentChange: function (val) {
      this.currentPage = val
      this.search({ orgUuid: this.exportOrgNode.uuid })
    },
    /**
     * @description 开始房屋添加/编辑
     *
     * @param {Object} houseInfo @default {} 判断房屋用途，选择参数：若为1，则是自住，否则为出租
     */
    fingerFaceFormat: function (row, column) {
      var fingerFace = row[column.property]
      if (fingerFace === '1') {
        return '自住'
      } else if (fingerFace === '2') {
        return '出租'
      } else {
        return '其他'
      }
    },
    /**
     * @description 开始房屋添加/编辑
     *
     * @param {Object} houseInfo @default {} 房屋信息，引入子组件houseEdit
     */
    onHouseEdit: function (houseInfo = {}) {
      const houseInfoTmp = Object.assign({}, houseInfo)
      this.$refs['houseEdit'].houseEdit(houseInfoTmp)
    },
    /**
     * @description 开始房屋添加/编辑
     *
     * @param {Object} houseInfo @default {} 房屋信息成功，立刻刷新房屋列表
     */
    successHouseEdit: function () {
      let condition = {}
      // 房间号
      condition.houseNum = this.houseNum || null
      // 房间号上级挂载组织uuid
      condition.orgUuid = this.exportOrgNode.uuid || this.parentUuid || this.rootUuid
      // 当前页数
      condition.currentPage = this.currentPage
      // 每页显示信息条数
      condition.pageSize = this.pageSize
      getHouseList(condition)
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
     * @description 房屋删除，双层判断，先判断父节点组织Uuid是否为根节点'0',在判断code返回值是否为'00000'，依次返回相应的状态提示信息
     *
     * @param {Object} houseInfo @default {} 房屋信息
     */
    onDelHouse: function (houseInfo = {}) {
      this.$confirm('您确定要刪除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then((res) => {
        // 判断上级组织是否为根组织，若是怎不可删除，否则正常删除
        if (this.parentUuid !== '0') {
          deleteHouse({ uuid: houseInfo.uuid }).then(res => {
            if (res.data.code === '00000') {
              this.$message({
                message: res.data.data,
                type: 'success'
              })
              // 删除成功后刷新界面
              this.search({ orgUuid: this.exportOrgNode.uuid || this.parentUuid || this.rootUuid })
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
     * @description 房屋查询
     *
     * @param {Object} houseInfo @default {} 户主信息;添加一个参数houseNum,按照房屋号重新搜索数据，再次刷新
     */
    onLookUp: function (options) {
      // 用户输入验证是否合法
      let condition = {}
      condition.houseNum = this.houseNum
      // 用户输入进行正则验证，只能输入数字
      if (/[^\d]/g.test(this.houseNum)) {
        this.$message({
          message: '只能输入数字!',
          type: 'warning'
        })
        this.houseNum = ''
        return
      }
      // 用户输入合规再按照搜索条件查询
      condition.orgUuid = this.exportOrgNode.uuid || this.exportOrgNode.rootUuid
      // 每页显示信息条数
      condition.pageSize = this.pageSize
      // 当前页数
      condition.currentPage = this.currentPage
      // 请求接口，刷新界面显示搜索结果
      getHouseList(condition)
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
       * @description 户主查询信息重置
       *
       * @param {Object} houseInfo @default {} 户主重置信息，刷新全部信息
       */
    onClearUp: function (options) {
      // 重置搜索输入框内容
      this.houseNum = ''
      let condition = {}
      // 焦点组织节点uuid,若无则为根节点uuid
      condition.orgUuid = this.exportOrgNode.uuid || this.exportOrgNode.rootUuid
      // 每页显示信息条数
      condition.pageSize = this.pageSize
      // 当前页数
      condition.currentPage = this.currentPage
      // 调用接口，刷新界面
      getHouseList(condition)
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
     * @description 房屋批量删除
     *
     * @param {Array} houseInfo @default [] 房屋信息，双层判断，先判断父节点组织Uuid是否为根节点'0',在判断code返回值是否为'00000'，依次返回相应的状态提示信息
     */
    onDelBatchHouse: function (houseInfo = {}) {
      var parentUuid = this.orgParentUuid
      // 将选中行重新组成一个数组
      const houseList = [].concat(this.selections)
      // 声明一个uuid的数组集合，用于存放被选中的数组uuid
      let ids = []
      ids.parentUuid = parentUuid
      // 判断uuid的数组集合长度，校验用户是否有选中至少一项删除项
      if (houseList.length <= 0) {
        this.$message({
          message: '请至少选择一项！',
          type: 'warning'
        })
        return
      }
      // 选中项uuid组成新的数组元素存放进空数组ids中
      for (let i = 0, length = houseList.length; i < length; i++) {
        ids.push(houseList[i].uuid)
      }
      // 弹出提示信息，等待用户确认，进行下一步删除操作
      this.$confirm('您确定要刪除组织信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then((res) => {
        // 判断是否用户有选中根组织节点,若无，允许删除操作
        if (this.parentUuid !== '0') {
          // ids为所有选中项uuid组成的数组集合
          batchDeleteHouse(ids).then(res => {
            if (res.data.code === '00000') {
              this.$message({
                message: res.data.data,
                type: 'success'
              })
              // 删除成功后，刷新界面，若焦点组织未被删除，则根据焦点组织uuid刷新，若焦点组织被删除，则根据其父组织uuid刷新，否则根据根节点uuid刷新
              this.search({ orgUuid: this.exportOrgNode.uuid || this.parentUuid || this.exportOrgNode.rootUuid })
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
    * @description 导入模块
    *
    * @param {condition} orgList @default [] elementUI组织树自带函数，详情请查阅elementUI中导入部分
    */
    onHouseUpload: function () {
      this.$refs['houseUpload'].openDialog()
    },
    /**
     * @description 导入成功
     *
     * @param {condition} orgList @default [] 子组件导入成功后，通知父组件进行相应的操作，这里是触发刷新数据
     */
    successUpload: function () {
      // 导入成功后，信息增加，需重新刷新界面
      let condition = {}
      // 若有焦点组织，则根据焦点组织uuid刷新，否则根据根节点uuid刷新
      condition.orgUuid = this.exportOrgNode.uuid || this.exportOrgNode.rootUuid
      // 每页显示信息条数
      condition.pageSize = this.pageSize
      // 当前页数
      condition.currentPage = this.currentPage
      // 调用列表刷新接口
      getHouseList(condition)
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
     * @param {condition} orgList @default [] 具有pagesize与pageNum两个参数，请求所有符合要求的数据，调用接口getHouseList,获取房屋列表
     */
    search: function (options) {
      let condition = {}
      condition.pageSize = this.pageSize
      condition.houseNum = this.houseNum
      condition.currentPage = this.currentPage
      // condition.uuid = this.exportOrgNode.uuid || this.exportOrgNode.rootUuid
      if (options) {
        condition.currentPage = this.currentPage
        this.orgUuid = condition.orgUuid = options.orgUuid || this.orgUuid
      }
      getHouseList(condition)
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
     * @description 下载，导出功能
     *
     * @param {condition} orgList @default [] 导入功能，elementUI导出模块自带函数，详情请查阅elementUI导出模块
     */
    onHouseDownLoad: function () {
      let params = {}
      params.orgUuid = this.exportOrgNode.uuid || this.exportOrgNode.rootUuid
      params.houseNum = this.houseNum
      houseDownload(params)
        .then(res => {
          let fileName = '房屋表.xlsx'
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
          console.warn('房屋导出下载err')
          console.warn(err)
        })
    }
  },
  /**
    * @description 组织树节点展开选择
    *
    * @param {condition} orgList @default [] elementUI组织树自带函数，详情请查阅elementUI中tree部分
    */
  filterNode: function (value, data) {
    if (!value) return true
    return data.name.indexOf(value) !== -1
  },
  /**
    * @description 组织树获取
    *
    * @param {condition} orgList @default [] 进入房屋界面，先获取左侧组织树
    */
  mounted: function () {
    this.search()
  }
}
</script>
<style lang='less' scoped>
.house-manager {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  min-height: 500px;
}
.house-list {
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
.house-table {
  flex: 1;
  position: relative;
}
.house-table .el-table {
  position: absolute;
  width: 100%;
  height: 100%;
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
