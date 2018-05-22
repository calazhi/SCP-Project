<template>
  <div class="container">
    <div class="clearfix">
      <el-button type="primary" @click="onAddScene">添加</el-button>
      <el-button type="danger" @click="onDelBatchTask">批量删除</el-button>
      <add-edit-scene ref="addEditScene" @reflushData="getTaskData" :title="propTitle"></add-edit-scene>
      <div class="search-bar">
        <el-input placeholder="按定场景名称模糊查询" :maxlength="20" prefix-icon="el-icon-search" v-model.trim="searchKey" class="audio-search" @keyup.enter.native="getTaskData" clearable>
        </el-input>
      </div>
    </div>
    <div class="table-con">
      <el-table class="audio-table" :data="tableData" height="100%" stripe border header-cell-class-name="text-align-center" @selection-change="handleSelectionChange" style="width: 100%;" :default-sort="{ prop:'updateTime', order: 'descending' }">
        <el-table-column fixed="left" v-if="hasSelect" type="selection" width="55">
        </el-table-column>
        <el-table-column label="场景名称" prop="sceneName">
        </el-table-column>
        <el-table-column label="场景时长" prop="timeLength" sortable>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" sortable>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button class="control-btn" type="primary" @click="onEditScene(scope.row)">编辑</el-button>
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
import AddEditScene from './components/AddEditScene'
import { getSceneList, delScene } from '@/views/BroadcastApp/apis/index.js'
import { secondToDate } from '@/views/BroadcastApp/assets/js/validate.js'
export default {
  components: {
    AddEditScene
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
    this.getTaskData()
  },
  methods: {
    /**
     * @description 获取列表数据
     */
    getTaskData: function () {
      let condition = {}
      condition.pageNo = this.currentPage
      condition.pageSize = this.pageSize
      condition.searchKey = this.searchKey
      this.tableLoading = true
      getSceneList(Object.assign({}, condition))
        .then(res => {
          if (res.data.code === '00000') {
            this.total = res.data.data.total
            let tableD = res.data.data.scene
            tableD.forEach((item, index) => {
              item.timeLength = secondToDate(item.timeLength)
            })
            this.tableLoading = false
            this.tableData = tableD
          }
        }).catch(err => {
          console.warn(LOG_TAG + err)
          this.tableLoading = false
        })
    },
    /**
     * @description 打开新增场景对话框
     */
    onAddScene: function () {
      this.propTitle = '添加场景'
      this.$refs['addEditScene'].openDialog()
    },
    /**
     * @description 打开编辑对话框
     * @param {Object} params 所选中行的数据
     */
    onEditScene: function (params = {}) {
      this.propTitle = '编辑场景'
      let sceneInfo = params.uuid
      this.$refs['addEditScene'].initFormData(Object.assign({}, { sceneIds: [sceneInfo] }))
      this.$refs['addEditScene'].openDialog()
    },
    /**
     * @description 点击table组件复选框触发
     * @param {Array} val 所有选中行数据
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
        delScene({ 'sceneIds': [params.uuid] }).then(res => {
          if (res.data.code === '00000') {
            this.getTaskData()
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
     * @description 分页组件当前页变化
     * @param {Number} params 选择当前页的值
     */
    handleCurrentChange: function (params) {
      this.currentPage = params
      this.getTaskData()
    },
    /**
     * @description 分页组件单页总数变化
     * @param {Number} params 选择的单页总数的值
     */
    handleSizeChange: function (params) {
      this.pageSize = params
      this.currentPage = 1
      this.getTaskData()
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
        if (this.selections[i].sceneName && i < 3) {
          str += this.selections[i].sceneName
          if (i < len - 1 && i < 2) {
            str += ','
          }
        }
        keys.push(this.selections[i].uuid)
      }
      str = this.selections.length > 3 ? (str + '等') : str
      this.$confirm('确定要刪除 ' + str + ' 的场景吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        // 调用批量删除的接口
        delScene({ 'sceneIds': keys })
          .then(res => {
            if (res.data.code === '00000') {
              this.getTaskData()
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
.search-bar {
  float: right;
}
.audio-search {
  width: 200px;
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
</style>
