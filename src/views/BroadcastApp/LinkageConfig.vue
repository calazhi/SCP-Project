<template>
  <div class="container">
    <div class="clearfix">
      <el-button type="primary" @click="onAddTask">添加</el-button>
      <el-button type="danger" @click="onDelBatchTask">批量删除</el-button>
      <edit-linkage-config ref="EditLinkageConfig" @reflushData="getLinkageData" :title="propTitle"></edit-linkage-config>
      <div class="search-bar">
        <el-input placeholder="按联动规则id查询" :maxlength="32" prefix-icon="el-icon-search" v-model.trim="searchKey" class="audio-search" @keyup.enter.native="getLinkageData()" clearable>
        </el-input>
      </div>
    </div>
    <div class="table-con">
      <el-table class="audio-table" :data="tableData" height="100%" stripe border header-cell-class-name="text-align-center" @selection-change="handleSelectionChange" style="width: 100%;" :default-sort="{ prop:'updateTime', order: 'descending' }">
        <el-table-column fixed="left" v-if="hasSelect" type="selection" width="55" >
        </el-table-column>
        <el-table-column label="联动规则ID" prop="linkageId">
        </el-table-column>
        <el-table-column label="联动模式" prop="linkageMode">
        </el-table-column>
        <el-table-column label="即时任务1" prop="broadcastName1">
        </el-table-column>
        <el-table-column label="即时任务2" prop="broadcastName2">
        </el-table-column>
        <el-table-column label="备注" prop="memo">
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" sortable>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button class="control-btn" type="primary" @click="onEdit(scope.row)">编辑</el-button>
            <el-button class="control-btn" type="danger" @click="onTaskDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination class="page-bar" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :total="total" :page-sizes="pageSizes" :page-size="pageSize" layout="total,sizes,prev,pager,next,jumper">
    </el-pagination>
  </div>
</template>

<script>
import { LOG_TAG } from '@/views/BroadcastApp/assets/js/index.js'
import { formatDateTime } from '@/views/BroadcastApp/assets/js/validate.js'
import EditLinkageConfig from './components/EditLinkageConfig'
import { getLinkageList, delLinkageConfig } from '@/views/BroadcastApp/apis/index.js'
export default {
  components: {
    EditLinkageConfig
  },
  data () {
    return {
      searchKey: '',
      broadcastType: 1,
      tableData: [],
      selections: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50],
      hasSelect: {
        default: false,
        type: Boolean
      },
      tableLoading: '',
      propTitle: ''
    }
  },
  mounted: function () {
    this.getLinkageData()
  },
  methods: {
    /**
     * @description 获取列表数据
     */
    getLinkageData: function () {
      let params = {}
      params.searchKey = this.searchKey
      params.pageNo = this.currentPage
      params.pageSize = this.pageSize
      getLinkageList(Object.assign({}, params)).then(res => {
        this.total = res.data.data.total
        let tableD = res.data.data.linkageConfigVos
        tableD.forEach((item, index) => {
          if (parseInt(item.linkageMode) === 0) {
            item.linkageMode = '普通模式'
          } else if (parseInt(item.linkageMode) === 1) {
            item.linkageMode = '业主访客模式'
          } else if (parseInt(item.linkageMode) === 2) {
            item.linkageMode = '落水模式'
          }
          item.updateTime = formatDateTime(new Date(item.updateTime), 'dateTime')
        })
        this.tableData = tableD
      }).catch(err => {
        console.warn(LOG_TAG + err)
      })
    },
    /**
     * @description 打开新增任务对话框
     */
    onAddTask: function () {
      this.propTitle = '添加'
      this.$refs['EditLinkageConfig'].openDialog()
    },
    /**
     * @description 点击table组件复选框触发
     * @param Array val 所有选中行数据
     */
    handleSelectionChange: function (val) {
      this.selections = val
    },
    /**
     * @description 删除单条记录
     * @param {Object} params 所选中行的数据
     */
    onTaskDelete: function (params = {}) {
      this.$confirm('确定要刪除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        delLinkageConfig([params.uuid]).then(res => {
          if (res.data.code === '00000') {
            this.getLinkageData()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        }).catch(err => {
          console.warn(LOG_TAG + err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * @description 批量删除表格数据
     */
    onDelBatchTask: function () {
      if (this.selections.length <= 0) {
        this.$message({
          message: '请至少选择一项！',
          type: 'warning'
        })
        return
      }
      let str = ''
      let keys = []
      for (let i = 0, len = this.selections.length; i < len; i++) {
        if (this.selections[i].linkageId && i < 2) {
          str += this.selections[i].linkageId
          if (i < len - 1 && i < 1) {
            str += ','
          }
        }
        keys.push(this.selections[i].uuid)
      }
      str = this.selections.length > 2 ? (str + '等') : str
      this.$confirm('确定要刪除 ' + str + ' 的联动配置吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        // 调用批量删除的接口
        delLinkageConfig([].concat(keys))
          .then(res => {
            if (res.data.code === '00000') {
              this.getLinkageData()
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.data.data,
                type: 'warning'
              })
            }
          }).catch(err => {
            console.warn(LOG_TAG + err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * @description 分页组件当前页变化
     * @param {Number} params 选择当前页的值
     */
    handleCurrentChange: function (params) {
      this.currentPage = params
      this.getLinkageData()
    },
    /**
     * @description 分页组件单页总数变化
     * @param {Number} params 选择的单页总数的值
     */
    handleSizeChange: function (params) {
      this.pageSize = params
      this.currentPage = 1
      this.getLinkageData()
    },
    /**
     * @description 编辑修改
     * @param {Object} params 所选中行的数据
     */
    onEdit: function (params) {
      this.propTitle = '编辑'
      let par = Object.assign({}, params)
      if (par.linkageMode === '普通模式') {
        par.linkageMode = '0'
      } else if (par.linkageMode === '业主访客模式') {
        par.linkageMode = '1'
      } else if (par.linkageMode === '落水模式') {
        par.linkageMode = '2'
      }
      this.$refs['EditLinkageConfig'].initFormData(par)
      this.$refs['EditLinkageConfig'].openDialog()
    }
  }
}
</script>

<style scoped>
.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
  clear: both;
}
.clearfix {
  zoom: 1;
}
.container {
  border: 1px solid #ccc;
  padding: 15px;
  box-sizing: border-box;
  position: absolute;
  left: 225px;
  right: 40px;
  bottom: 20px;
  top: 80px;
  display: flex;
  flex-direction: column;
}
.table-con {
  margin-top: 15px;
  display: flex;
  flex: 1;
}
.audio-table {
  height: 100%;
}
.control-btn {
  padding: 7px 7px;
  margin-left: 4px;
}
.page-bar {
  padding: 0;
  margin-top: 10px;
  text-align: right;
}
.search-bar {
  float: right;
}
</style>
