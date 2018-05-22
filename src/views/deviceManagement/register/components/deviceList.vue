<template>
  <div>
    <el-button size="small" type="info" round plain icon="el-icon-refresh" style="margin-left:90%;margin-bottom: 20px"  @click="_refresh">刷新</el-button>
    <el-table
      class="deviceMgmTable"
      ref="singleTable"
      :data="mainDeviceTableData"
      :default-sort = "{prop: 'order', order: 'ascending'}"
      highlight-current-row
      stripe
      border
      @current-change="handleCurrentChange"
      style="width: 100%">
      <el-table-column label="主设备信息列表：">
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
          prop="deviceTypeDesc"
          label="设备类型"
          width="100">
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="deviceName"
          label="设备名称"
          show-overflow-tooltip
          width="100">
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="providerName"
          label="设备厂商"
          width="80">
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="orgName"
          label="组织名称"
          width="150">
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="gatewayName"
          label="网关标识"
          width="140">
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="deviceIp"
          label="设备IP"
          width="140">
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="devicePort"
          label="设备端口"
          width="80">
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="isRegistered"
          label="注册状态"
          width="100">
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="isOnline"
          label="离在线状态"
          width="100">
        </el-table-column>
        <el-table-column
          :resizable="false"
          prop="updateTime"
          label="更新时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="text" size="medium"  @click="_editDevice(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
            <el-button type="text" size="medium"  @click="_deleteDevice(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
            <el-button class="deviceActionBtn" type="text" size="small"  @click="_showChildDevice(scope.$index, scope.row)">子设备</el-button>
            <el-button class="deviceActionBtn" type="text" size="small"  @click="_bindingDevice(scope.$index, scope.row)">绑定设备</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 20px">
      <div class="r_page">
        <el-pagination
          @size-change="_handleSizeChange"
          @current-change="_handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <child-device v-show="isChildShow" ref="childDevice" style="margin-top: 100px"></child-device>
    <binding-device v-show="isBindingShow" ref="bindingDevice" style="margin-top: 100px"></binding-device>
    <el-dialog title="编辑主设备" :visible.sync="isEditDialogShow" @close="_closeDialog" width="90%" top="8vh" :close-on-click-modal="false">
      <main-device-dialog @listenToEditEvent="_editResult"
                          :uuid="uuid"
                          dialogType="EDIT"
                          :gatewayType="gatewayType"
                          ref="mainDeviceDialog">
      </main-device-dialog>
    </el-dialog>
  </div>
</template>
<script>
  import childDevice from './childDevice.vue'
  import mainDeviceDialog from './mainDeviceDialog.vue'
  import bindingDevice from './bindingDevice.vue'
  import {getDeviceList, deleteParentDevice, getDeviceSelectList} from '../apis/index.js'
  import {getLocalTime} from '../assets/js/tool.js'

  export default {
    data () {
      return {
        currentPage: 1,
        total: 1,
        pageSize: 10,
        mainDeviceTableData: [],
        isChildShow: false,
        isEditDialogShow: false,
        currentRow: {},
        uuid: '',
        providerType: [],
        selectData: {},
        gatewayType: [],
        isBindingShow: false
      }
    },
    components: {
      childDevice,
      mainDeviceDialog,
      bindingDevice
    },
    methods: {
      loadMainDeviceTableData (page, pageSize, selectData) {
        this.currentPage = page
        this.isBindingShow = false
        if (!selectData) {
          // 请求主设备列表信息
          getDeviceList(page, pageSize)
            .then(
              function (result) {
                var tableData = result.listDmDevice
                for (let i = 0; i < tableData.length; i++) {
                  var item = tableData[i]
                  tableData[i]['isOnline'] = (item.isOnline) ? '在线' : '离线'
                  tableData[i]['isRegistered'] = (item.isRegistered) ? '已注册' : '未注册'
                  tableData[i]['updateTime'] = getLocalTime(tableData[i]['updateTime'])
                  // this.gatewayType.forEach(value => {
                  //   if (value.value === tableData[i]['gatewayId']) {
                  //     tableData[i]['gatewayDesc'] = value.label
                  //   }
                  // })
                }
                this.mainDeviceTableData = tableData
                this.total = result.pageCount
              }.bind(this)
            )
            .catch(
              () => {
                this.mainDeviceTableData = []
              }
            )
        } else {
          // 请求查找主设备列表信息
          this.isChildShow = false
          this.selectData = selectData
          selectData['currentPage'] = page
          selectData['pageSize'] = pageSize
          getDeviceSelectList(selectData)
            .then(
              function (result) {
                var tableData = result.listDmDevice
                if (tableData) {
                  for (let i = 0; i < tableData.length; i++) {
                    var item = tableData[i]
                    tableData[i]['isOnline'] = (item.isOnline) ? '在线' : '离线'
                    tableData[i]['isRegistered'] = (item.isRegistered) ? '已注册' : '未注册'
                    tableData[i]['updateTime'] = getLocalTime(tableData[i]['updateTime'])
                    this.gatewayType.forEach(value => {
                      if (value.value === tableData[i]['gatewayId']) {
                        tableData[i]['gatewayDesc'] = value.label
                      }
                    })
                  }
                  this.mainDeviceTableData = tableData
                } else {
                  this.mainDeviceTableData = []
                }
                this.total = result.pageCount
              }.bind(this)
            )
            .catch(
              () => {
                this.mainDeviceTableData = []
              }
            )
        }
      },
      passProviderType (param) {
        this.providerType = param
      },
      passGatewayType (param) {
        this.gatewayType = param
      },
      _handlePageChange (val) {
        this.currentPage = val
        if (!this.selectData.pageSize) {
          this.loadMainDeviceTableData(val, this.pageSize)
        } else {
          this.loadMainDeviceTableData(val, this.pageSize, this.selectData)
        }
      },
      handleCurrentChange (row) {
        this.currentRow = row
      },
      _refresh () {
        this.currentPage = 1
        this.loadMainDeviceTableData(1, this.pageSize, this.selectData)
      },
      _showChildDevice (index, row) {
        this.isBindingShow = false
        this.isChildShow = true
        this.$refs.childDevice.passToChild(row, this.providerType, this.gatewayType)
      },
      _bindingDevice (index, row) {
        this.isBindingShow = true
        this.isChildShow = false
        if (this.$refs.bindingDevice) {
          this.$refs.bindingDevice.loadBindingDeviceList(row.uuid, row.orgId)
        }
      },
      _handleSizeChange (val) {
        this.pageSize = val
        this.currentPage = 1
        if (!this.selectData) {
          this.loadMainDeviceTableData(1, val)
        } else {
          this.loadMainDeviceTableData(1, val, this.selectData)
        }
        this.$emit('listenCountOfPage', val)
      },
      _closeDialog () {
        if (this.$refs.mainDeviceDialog) {
          this.$refs.mainDeviceDialog.clearData()
        }
      },
      _deleteDevice (index, row) {
        // 删除接口
        this.$confirm('是否确定删除该主设备及相关子设备?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isChildShow = false
          this.isBindingShow = false
          deleteParentDevice(row.uuid)
            .then(
              function (result) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.loadMainDeviceTableData(1, this.pageSize, this.selectData)
              }.bind(this)
            )
            .catch(
              function () {
                this.$message.error('删除失败')
              }.bind(this)
            )
        }).catch()
      },
      _editDevice (index, row) {
        this.uuid = row.uuid
        if (this.$refs.mainDeviceDialog) {
          this.$refs.mainDeviceDialog.passToDialogUuid(this.uuid)
        }
        this.isEditDialogShow = true
      },
      _editResult (result) {
        this.isEditDialogShow = false
        // var message = '是否前往' + result.deviceCode + '地址进行配置?'
        // this.$confirm(message, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   // window.location = 'https://www.baidu.com'
        // }).catch()
        this.loadMainDeviceTableData(1, this.pageSize, this.selectData)
      }
    },
    mounted () {
      this.loadMainDeviceTableData(1, this.pageSize)
    }
  }
</script>
