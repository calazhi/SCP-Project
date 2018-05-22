<template>
  <div>
    <el-button size="small" type="info" round plain icon="el-icon-refresh" style="margin-left:90%;margin-bottom: 20px"  @click="_refresh">刷新</el-button>
    <el-table
      class="deviceMgmTable"
      :data="updateHistoryTableData"
      style="width:100%"
      highlight-current-row>
      <el-table-column label="固件升级历史：">
        <el-table-column
          :resizable="false"
          label="序号"
          type="index"
          width="70">
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="requestTime"
          label="升级发起时间"
          width="200"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="statusUpdateTime"
          label="升级完成时间"
          width="200"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="fotaStatus"
          label="升级状态"
          show-overflow-tooltip
          width="150">
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="firmwareVersion"
          label="固件版本"
          width="150">
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="deviceCode"
          label="设备编码"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="deviceTypeDesc"
          label="设备类型"
          width="200">
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="fileSize"
          label="固件大小"
          width="150">
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="fileName"
          label="固件名称"
          show-overflow-tooltip>
        </el-table-column>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 20px">
      <div class="r_page">
        <el-pagination
          @current-change="_handlePageChange"
          @size-change="_handleSizeChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {getFotaRecordList} from '../apis/index'
  import {getLocalTime} from '../../register/assets/js/tool'

  export default {
    data () {
      return {
        updateHistoryTableData: [],
        currentPage: 1,
        total: 0,
        pageSize: 10
      }
    },
    methods: {
      loadHistoryTable (currentPage, pageSize) {
        // 请求历史信息
        this.currentPage = currentPage
        getFotaRecordList(currentPage, pageSize)
          .then((result) => {
            var tableData = result.listFotaRecordVo
            for (let i = 0; i < tableData.length; i++) {
              if (tableData[i]['requestTime']) {
                tableData[i]['requestTime'] = getLocalTime(tableData[i]['requestTime'])
              }
              if (tableData[i]['statusUpdateTime']) {
                tableData[i]['statusUpdateTime'] = getLocalTime(tableData[i]['statusUpdateTime'])
              }
            }
            this.updateHistoryTableData = tableData
            this.total = result.totalCount
          })
      },
      _refresh () {
        this.loadHistoryTable(1, this.pageSize)
      },
      _handlePageChange (val) {
        this.loadHistoryTable(val, this.pageSize)
      },
      _handleSizeChange (val) {
        this.pageSize = val
        this.loadHistoryTable(1, val)
      }
    },
    mounted () {
      this.loadHistoryTable(1, this.pageSize)
    }
  }
</script>

