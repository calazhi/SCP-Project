<template>
  <div>
    <el-button size="small" type="info" round plain icon="el-icon-refresh" style="margin-left:90%;margin-bottom: 20px"  @click="_refresh">刷新</el-button>
    <el-table
      class="deviceMgmTable"
      :data="deviceTableData"
      style="width:100%"
      highlight-current-row
      stripe
      border
      @row-click="_handleCurrentChange">
      <el-table-column label="设备参数配置：">
        <el-table-column
          :resizable="false"
          type="index"
          label="序号"
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
    <tech-table-list v-show="isShowDetaiAttrs" @listenToParamCollected="_collectedResult" ref="techTableList"></tech-table-list>
  </div>
</template>

<script>
  import {getLocalTime} from '../../register/assets/js/tool'
  import {getDeviceListForConfig} from '../apis/index'
  import techTableList from './techTableList'

  export default {
    data () {
      return {
        currentPage: 1,
        total: 0,
        pageSize: 10,
        deviceTableData: [],
        selectData: {},
        isShowDetaiAttrs: false,
        attrDomainList: [],
        // 临时修改-------------------------
        gatewayType: [{'label': '', 'value': ''}, {'label': '国标扩展网关', 'value': 'APP6003'}, {'label': '轻量级网关', 'value': 'APP1961'}, {'label': '广播网关', 'value': 'APP3333'}]
        // --------------------
      }
    },
    components: {
      techTableList
    },
    methods: {
      loadDeviceConfigTableData (page, pageSize, params) {
        this.currentPage = page
        if (!params) {
          params = {'currentPage': page, 'pageSize': pageSize}
        } else {
          this.selectData = params
          params['currentPage'] = page
          params['pageSize'] = pageSize
        }
        getDeviceListForConfig(params)
          .then(
            function (result) {
              this._handleResult(result)
              this.isShowDetaiAttrs = false
              if (this.$refs.techTableList) {
                this.$refs.techTableList.clearData()
              }
            }.bind(this)
          )
          .catch(
            () => {
              this.deviceTableData = []
              this.total = 0
            }
          )
      },
      _handleResult (result) {
        var tableData = result.pagedData
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
          this.attrDomainList = result.attrDomainList
          this.total = result.totalCount
        } else {
          this.deviceTableData = []
          this.total = 0
        }
      },
      _handleCurrentChange (row) {
        this.isShowDetaiAttrs = true
        var attrList = row.attributeList
        for (let i = 0; i < attrList.length; i++) {
          if (attrList[i].attrDataType === 'select') {
            var list = []
            for (let j = 0; j < this.attrDomainList.length; j++) {
              var attr = attrList[i]
              var attrDomain = this.attrDomainList[j]
              if (attr['attrUuid'] === attrDomain['attrUuid']) {
                attrDomain['label'] = attrDomain.domainValue
                attrDomain['value'] = attrDomain.domainValueCode
                list.push(attrDomain)
                attrList[i]['selectData'] = list
              }
            }
          }
        }
        row['attributeList'] = attrList
        this.$refs.techTableList.loadDetailParamTable(row)
        this.$emit('listenToRowSelected', row)
      },
      _collectedResult (data) {
        this.$emit('listenToRowSelected', data)
      },
      _handlePageChange (val) {
        this.loadDeviceConfigTableData(val, this.pageSize, this.selectData)
      },
      _handleSizeChange (val) {
        this.pageSize = val
        this.currentPage = 1
        if (!this.selectData) {
          this.loadDeviceConfigTableData(1, val)
        } else {
          this.loadDeviceConfigTableData(1, val, this.selectData)
        }
        this.$emit('listenCountOfPage', val)
      },
      _refresh () {
        this.currentPage = 1
        this.$emit('listenToRefresh')
        this.loadDeviceConfigTableData(1, this.pageSize, this.selectData)
      }
    },
    mounted () {
      this.loadDeviceConfigTableData(1, this.pageSize)
    }
  }
</script>
