<template>
  <div class="container add-audio-con">
    <div class="hbar clearfix">
      <el-button type="primary" @click="onAddAudio">添加</el-button>
      <el-button type="danger" @click="onDelBatchAudio">批量删除</el-button>
      <add-mutip-audio ref="addAudio" @addAudioSucc="getAudioData"></add-mutip-audio>
      <div class="search-bar">
        <el-input placeholder="按音频名称模糊查询" :maxlength="20" prefix-icon="el-icon-search" v-model.trim="searchKey" @keyup.enter.native="getAudioData" class="audio-search" clearable>
        </el-input>
      </div>
    </div>
    <div class="table-con clearfix">
      <el-table class="audio-table" :data="tableData" height="100%" stripe border header-cell-class-name="text-align-center" @selection-change="handleSelectionChange" style="width: 100%" :default-sort="{ prop:'createTime', order: 'descending' }">
        <el-table-column fixed="left" v-if="hasSelect" type="selection" width="55">
        </el-table-column>
        <el-table-column label="音频名称" prop="audioClipName">
        </el-table-column>
        <el-table-column label="文件格式" prop="audioClipFormat">
        </el-table-column>
        <el-table-column label="音频时长" prop="timeLength" sortable>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" sortable>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button class="control-btn" type="danger" @click="onAudioDelete(scope.row)">删除</el-button>
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
import AddMutipAudio from './components/AddMutipAudio'
import { getAudioList, delMutipAudioClip } from '@/views/BroadcastApp/apis/index.js'
import { secondToDate } from '@/views/BroadcastApp/assets/js/validate.js'
export default {
  components: {
    AddMutipAudio
  },
  data () {
    return {
      searchKey: '',
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
      tableLoading: false
    }
  },
  mounted: function () {
    this.getAudioData()
  },
  methods: {
    /**
     * @description 打开添加框
     */
    onAddAudio: function () {
      this.$refs['addAudio'].openDialog()
    },
    /**
     * @description 获取音频列表数据
     */
    getAudioData: function () {
      let condition = {}
      condition.pageNo = this.currentPage
      condition.pageSize = this.pageSize
      condition.searchKey = this.searchKey
      this.tableLoading = true
      getAudioList(Object.assign({}, condition))
        .then(res => {
          if (res.data.code === '00000') {
            let tableD = res.data.data.audioClip
            tableD.forEach((item, index) => {
              item.timeLength = secondToDate(item.timeLength)
            })
            this.tableData = tableD
            this.total = res.data.data.total
            this.tableLoading = false
          }
        }).catch(err => {
          console.warn(LOG_TAG + err)
          this.tableLoading = false
        })
      this.tableLoading = false
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
    onAudioDelete: function (params = {}) {
      this.$confirm('确定要刪除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        delMutipAudioClip({ 'uuids': [params.uuid], 'audioClipFileIds': [params.audioClipFileId] })
          .then(res => {
            if (res.data.code === '00000') {
              this.getAudioData()
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
      this.getAudioData()
    },
    /**
     * @description 分页组件单页总数变化
     * @param {Number} params 选择的单页总数的值
     */
    handleSizeChange: function (params) {
      this.pageSize = params
      this.currentPage = 1
      this.getAudioData()
    },
    /**
     * @description 批量删除表格数据
     */
    onDelBatchAudio: function () {
      if (this.selections.length <= 0) {
        this.$message({
          message: '请至少选择一项！',
          type: 'warning'
        })
        return
      }
      let str = ''
      let keysUuid = []
      let keyAudioClipFileId = []
      for (let i = 0, len = this.selections.length; i < len; i++) {
        if (this.selections[i].audioClipName && i < 3) {
          str += this.selections[i].audioClipName
          if (i < len - 1 && i < 2) {
            str += ','
          }
        }
        keysUuid.push(this.selections[i].uuid)
        keyAudioClipFileId.push(this.selections[i].audioClipFileId)
      }
      str = this.selections.length > 3 ? (str + '等') : str
      this.$confirm('确定要刪除 "' + str + '" 的广播音频吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        // 调用批量删除的接口
        delMutipAudioClip({ 'uuids': keysUuid, 'audioClipFileIds': keyAudioClipFileId })
          .then(res => {
            if (res.data.code === '00000') {
              this.getAudioData()
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

<style lang="less" scoped>
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
.hbar {
  /deep/.add-audio-con {
    .el-upload--text {
      width: 120px;
      height: 45px;
      border: none;
    }
    .el-upload-list__item-name {
      height: 30px;
      line-height: 30px;
    }
    .el-button--small {
      padding: 15px 25px;
    }
  }
}
</style>
