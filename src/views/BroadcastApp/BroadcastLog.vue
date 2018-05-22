<template>
  <div class="container">
    <div class="clearfix">
      <div class="search-bar">
        <el-form ref="taskForm" class="task-name">
          <el-row>
            <el-form-item prop="broadcastName" style="float:left;margin-right:10px;">
              <el-input placeholder="任务名称" :maxlength="20" v-model.trim="searchKey" class="audio-search" clearable>
              </el-input>
            </el-form-item>
            <el-form-item style="float:left;margin-right:10px;">
              <el-select v-model="status" placeholder="请选择播放状态" clearable>
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="float:left;margin-right:10px;">
              <el-date-picker v-model="startEndTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :editable="false">
              </el-date-picker>
            </el-form-item>
            <div style="float:left;margin-right:10px;">
              <el-button type="primary" @click="getTaskData" size="medium">查询</el-button>
            </div>
            <div style="float:left;margin-right:10px;">
              <el-button type="primary" @click="onResetParams" size="medium">重置</el-button>
            </div>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="table-con">
      <el-table class="audio-table" :data="formData" height="100%" stripe border header-cell-class-name="text-align-center" style="width: 100%;" :default-sort="{ prop:'createTime', order: 'descending' }">
        <el-table-column label="任务名称" prop="broadcastName">
        </el-table-column>
        <el-table-column label="任务类型" prop="broadcastType" :filters="[{ text: '即时任务', value: '即时任务' }, { text: '定时任务', value: '定时任务' }]" :filter-method="filterTag" filter-placement="bottom-start">
        </el-table-column>
        <el-table-column label="上报时间" prop="createTime" sortable>
        </el-table-column>
        <el-table-column label="设备名称" prop="controllerName">
        </el-table-column>
        <el-table-column label="分区编号" prop="playAreaId">
        </el-table-column>
        <el-table-column label="播放状态" prop="status">
        </el-table-column>
      </el-table>
    </div>
    <el-pagination class="page-bar" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :total="total" :page-sizes="pageSizes" :page-size="pageSize" layout="total,sizes,prev,pager,next,jumper">
    </el-pagination>
  </div>
</template>

<script>
import { LOG_TAG } from '@/views/BroadcastApp/assets/js/index.js'
import { getLogMsg } from '@/views/BroadcastApp/apis/index.js'
import { formatDateTime } from '@/views/BroadcastApp/assets/js/validate.js'
export default {
  data () {
    return {
      startEndTime: ['', ''],
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
      formData: [],
      status: '',
      statusOptions: [
        {
          value: '1',
          label: '成功'
        },
        {
          value: '9',
          label: '失败'
        }
      ]
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
      condition.broadcastName = this.searchKey
      condition.pageNo = this.currentPage
      condition.pageSize = this.pageSize
      condition.status = this.status
      condition.startTime = this.startEndTime[0]
      condition.endTime = this.startEndTime[1]
      if (condition.startTime !== '') {
        let start = new Date(condition.startTime)
        condition.startTime = formatDateTime(start, 'dateTime')
      }
      if (condition.endTime !== '') {
        let end = new Date(condition.endTime)
        condition.endTime = formatDateTime(end, 'dateTime')
      }
      getLogMsg(Object.assign({}, condition))
        .then(res => {
          if (res.data.code === '00000') {
            this.total = res.data.data.total
            let tableD = res.data.data.listLog
            tableD.forEach((item, index) => {
              if (item.broadcastType === 1) {
                item.broadcastType = '定时任务'
              } else if (item.broadcastType === 0) {
                item.broadcastType = '即时任务'
              }
              if (item.status === 1) {
                item.status = '成功'
              } else if (item.status === 9) {
                item.status = '失败'
              }
            })
            this.formData = tableD
          }
        }).catch(err => {
          console.warn(LOG_TAG + err)
        })
    },
    /**
     * @description 重置查询条件
     */
    onResetParams: function () {
      this.searchKey = ''
      this.status = ''
      this.startEndTime = ['', '']
      this.getTaskData()
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
     * @description 筛选任务类型
     */
    filterTag (value, row) {
      return row.broadcastType === value
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
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.search-bar {
  float: left;
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
.page-bar {
  padding: 0;
  margin-top: 10px;
  text-align: right;
}
.task-name {
  overflow: hidden;
  margin-right: 6px;
}
</style>
