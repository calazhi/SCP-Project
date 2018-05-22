
<template>
  <div>
    <el-button size="small" type="info" round plain icon="el-icon-refresh" style="margin-left:90%;margin-bottom: 20px"  @click="_refresh">刷新</el-button>
    <el-table
      class="deviceMgmTable"
      ref="multipleTable"
      :data="childDeviceTableData"
      style="width: 100%"
      highlight-current-row
      stripe
      border
      @current-change="handleCurrentChange">
      <el-table-column label="子设备信息列表：">
        <el-table-column
          :resizable="false"
          prop="deviceCode"
          label="设备编码"
          width="200">
          <!--<template slot-scope="scope">{{ scope.row.date }}</template>-->
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
          width="150">
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="gatewayName"
          label="网关标识"
          width="150">
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="deviceIp"
          label="设备IP"
          show-overflow-tooltip
          width="120">
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="devicePort"
          label="设备端口"
          width="90">
        </el-table-column>
        <el-table-column
          :resizable="false"
          property="updateTime"
          label="更新时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="110">
          <template slot-scope="scope">
            <el-button type="text" size="medium"  @click="_editDevice(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
            <el-button type="text" size="medium"  @click="_deleteDevice(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        style="margin-top: 20px"
        @size-change="_handleSizeChange"
        @current-change="_handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="编辑子设备" :visible.sync="isEditDialogShow" @close="_closeDialog" width="90%" top="8vh" :close-on-click-modal="false">
      <sub-device-dialog dialogType="EDIT"
                         ref="subDeviceDialogEdit"
                         :childUuid="childUuid"
                         @listenToEditEvent="_editResult"
                         :gatewayType="gatewayType">
      </sub-device-dialog>
    </el-dialog>
  </div>
</template>

<script>
  import subDeviceDialog from './subDeviceDialog.vue'
  import {getSubDeviceList, deleteSubDevice} from '../apis/index.js'
  import {getLocalTime} from '../assets/js/tool.js'

  export default {
    data () {
      return {
        currentPage: 1,
        total: 2,
        pageSize: 10,
        childDeviceTableData: [],
        deleteData: {},
        isEditDialogShow: false,
        deviceTypeList: [],
        deviceType: [],
        childUuid: '',
        currentRow: {},
        uuid: {},
        gatewayType: []
      }
    },
    components: {
      subDeviceDialog
    },
    methods: {
      loadChildDeviceTableData (page, pageSize, uuid) {
        this.uuid = uuid
        // 请求主设备列表信息
        if (uuid !== '') {
          getSubDeviceList(uuid, page, pageSize)
            .then(
              function (result) {
                if (result.listDmDevice) {
                  var tableData = result.listDmDevice
                  for (let i = 0; i < tableData.length; i++) {
                    tableData[i]['updateTime'] = getLocalTime(tableData[i]['updateTime'])
                    // this.gatewayType.forEach(value => {
                    //   if (value.value === tableData[i]['gatewayId']) {
                    //     tableData[i]['gatewayDesc'] = value.label
                    //   }
                    // })
                  }
                  this.childDeviceTableData = tableData
                } else {
                  this.childDeviceTableData = []
                }
                this.total = result.pageCount
              }.bind(this)
            )
            .catch(
              () => {
                this.childDeviceTableData = []
              }
            )
        }
      },
      passGetewayInfo (param) {
        this.gatewayType = param
      },
      _handlePageChange (val) {
        this.currentPage = val
        this.loadChildDeviceTableData(val, this.pageSize, this.uuid)
      },
      _handleSizeChange (val) {
        this.pageSize = val
        this.loadChildDeviceTableData('1', val, this.uuid)
      },
      _closeDialog () {
        if (this.$refs.subDeviceDialogEdit) {
          this.$refs.subDeviceDialogEdit.clearData()
        }
      },
      handleCurrentChange (row) {
        this.currentRow = row
      },
      _refresh () {
        this.currentPage = 1
        this.loadChildDeviceTableData(1, this.pageSize, this.uuid)
      },
      _deleteDevice (index, row) {
        // 删除子设备接口
        this.$confirm('是否确定删除该设备?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSubDevice(row.uuid)
            .then(
              function (result) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.loadChildDeviceTableData(1, this.pageSize, this.uuid)
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
        this.isEditDialogShow = true
        this.childUuid = row.uuid
        if (this.$refs.subDeviceDialogEdit) {
          this.$refs.subDeviceDialogEdit.passToDialogChildUuid(this.childUuid)
        }
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
        this.loadChildDeviceTableData(1, this.pageSize, this.uuid)
      }
    }
  }
</script>
