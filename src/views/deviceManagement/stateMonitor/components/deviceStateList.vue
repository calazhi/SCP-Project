<template>
  <div>
    <el-button size="small" type="info" round plain icon="el-icon-refresh" style="margin-left:90%;margin-bottom: 20px"  @click="_refresh">刷新</el-button>
    <el-table
      class="deviceMgmTable"
      :data="deviceTableData"
      style="width:100%"
      stripe
      border
      highlight-current-row
      @select="_getCurRow"
      @select-all="_getCurRow">
      <el-table-column label="设备状态监控：">
        <el-table-column
          :resizable="false"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="deviceCode"
          label="设备编码"
          width="200">
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="deviceTypeDesc"
          label="设备类型"
          width="150">
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="deviceName"
          label="设备名称"
          show-overflow-tooltip
          width="180">
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="gatewayName"
          label="网关标识"
          width="200">
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="deviceIp"
          label="设备IP"
          show-overflow-tooltip
          width="150">
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="devicePort"
          label="设备端口"
          width="150">
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="isRegisteredDesc"
          label="注册状态"
          width="125">
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="isOnlineDesc"
          label="离在线状态"
          width="125">
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="deviceStatusDesc"
          label="设备状态"
          width="100">
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="updateTimeDesc"
          label="更新时间"
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
  import {getLocalTime} from '../../register/assets/js/tool'
  import {getDeviceListForStatus, getDeviceSelectListForStatus} from '../apis/index'

  export default {
    data () {
      return {
        currentPage: 1,
        total: 0,
        pageSize: 10,
        deviceTableData: [],
        currentRow: {},
        selectData: {},
        // 临时修改-------------------------
        gatewayType: [{'label': '', 'value': ''}, {'label': '国标扩展网关', 'value': 'APP6003'}, {'label': '轻量级网关', 'value': 'APP1961'}, {'label': '广播网关', 'value': 'APP3333'}]
        // --------------------
      }
    },
    components: {
    },
    methods: {
      loadDeviceStateTableData (page, pageSize, params) {
        this.currentPage = page
        if (!params) {
          getDeviceListForStatus(page, pageSize)
            .then(
              function (result) {
                this._handleResult(result)
              }.bind(this)
            )
            .catch(
              () => {
                this.deviceTableData = []
                this.total = 0
              }
            )
        } else {
          this.selectData = params
          params['currentPage'] = page
          params['pageSize'] = pageSize
          getDeviceSelectListForStatus(params)
            .then(
              function (result) {
                this._handleResult(result)
              }.bind(this)
            )
            .catch(
              () => {
                this.deviceTableData = []
                this.total = 0
              }
            )
        }
      },
      _handleResult (result) {
        var tableData = result.listDmDevice
        if (tableData) {
          for (let i = 0; i < tableData.length; i++) {
            var item = tableData[i]
            tableData[i]['isOnlineDesc'] = (item.isOnline) ? '在线' : '离线'
            tableData[i]['isRegisteredDesc'] = (item.isRegistered) ? '已注册' : '未注册'
            if (item.deviceStatus === 'ON') { tableData[i]['deviceStatusDesc'] = '开' }
            if (item.deviceStatus === 'OFF') { tableData[i]['deviceStatusDesc'] = '关' }
            tableData[i]['updateTimeDesc'] = getLocalTime(tableData[i]['updateTime'])
            // 临时修改-------------------------
            this.gatewayType.forEach(value => {
              if (value.value === tableData[i]['gatewayId']) {
                tableData[i]['gatewayDesc'] = value.label
              }
            })
          }
          this.deviceTableData = tableData
          this.total = result.pageCount
        } else {
          this.deviceTableData = []
          this.total = 0
        }
      },
      _getCurRow (selection, row) {
        this.$emit('listenToRowSelected', selection)
      },
      _handlePageChange (val) {
        this.loadDeviceStateTableData(val, this.pageSize, this.selectData)
      },
      _handleSizeChange (val) {
        this.pageSize = val
        this.currentPage = 1
        if (!this.selectData) {
          this.loadDeviceStateTableData(1, val)
        } else {
          this.loadDeviceStateTableData(1, val, this.selectData)
        }
        this.$emit('listenCountOfPage', val)
      },
      _refresh () {
        this.currentPage = 1
        this.$emit('listenToRefresh')
        this.loadDeviceStateTableData(1, this.pageSize, this.selectData)
      }
    },
    mounted () {
      this.loadDeviceStateTableData(1, this.pageSize)
    }
  }
</script>

