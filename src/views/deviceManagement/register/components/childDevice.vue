<template>
  <div>
    <div class="child-container">
      <span class="tech-title">{{title}}</span>
      <el-button @click="_addChildDevice" style="margin-bottom: 20px;margin-top: -30px" type="primary">添加子设备</el-button>
      <sub-device-list ref="subDeviceList"></sub-device-list>
      <el-dialog title="添加子设备" :visible.sync="isAddDialogShow" @close="_closeDialog" width="90%" top="8vh" :close-on-click-modal="false">
        <sub-device-dialog dialogType="ADD"
                           @listenToAddEvent="_addResult"
                           :mainDeviceData="currentRow"
                           ref="subDeviceialog"
                           :gatewayType="gatewayType">
        </sub-device-dialog>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  import ElButton from 'element-ui/packages/button/src/button.vue'
  import subDeviceList from './subDeviceList.vue'
  import subDeviceDialog from './subDeviceDialog.vue'

  export default {
    components: {
      ElButton,
      subDeviceList,
      subDeviceDialog
    },
    data () {
      return {
        isAddDialogShow: false,
        providerType: [],
        title: '',
        currentRow: {},
        gatewayType: [],
        mainDeviceUuid: ''
      }
    },
    methods: {
      _addChildDevice () {
        this.isAddDialogShow = true
      },
      _addResult (result) {
        this.isAddDialogShow = false
        // var message = '是否前往' + result.deviceCode + '地址进行配置?'
        // this.$confirm(message, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   // window.location = 'https://www.baidu.com'
        // }).catch()
        // 添加子设备成功列表刷新
        this.$refs.subDeviceList.loadChildDeviceTableData(1, 10, this.mainDeviceUuid)
      },
      _closeDialog () {
        if (this.$refs.subDeviceialog) {
          this.$refs.subDeviceialog.clearData()
        }
      },
      passToChild (row, providerType, gatewayType) {
        this.title = row.deviceTypeDesc + '-' + row.deviceCode
        this.providerType = providerType
        this.gatewayType = gatewayType
        this.mainDeviceUuid = row.uuid
        this.$refs.subDeviceList.loadChildDeviceTableData(1, 10, row.uuid)
        this.$refs.subDeviceList.passGetewayInfo(this.gatewayType)
        this.currentRow = row
        if (this.$refs.subDeviceialog) {
          this.$refs.subDeviceialog.passDeviceInfo(row)
        }
      }
    }
  }
</script>

