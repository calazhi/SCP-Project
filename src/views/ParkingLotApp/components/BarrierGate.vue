<template>
  <div class="main">
      <div class="barriergate-table">
        <div><span>道闸设备列表</span></div>
        <el-table ref="deviceTable" :data="deviceList" highlight-current-row @current-change="selectDevice" @selection-change="handleDeviceChange" border max-height="280" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="deviceCode" label="设备编号"></el-table-column>
            <el-table-column prop="deviceName" label="设备名称"></el-table-column>
            <el-table-column prop="deviceIP" label="设备IP"></el-table-column>
            <el-table-column prop="deviceStatus" label="设备状态" :formatter="formatStatus"></el-table-column>
            <el-table-column prop="parkingLot" label="车场名"></el-table-column>
            <el-table-column prop="gate" label="通道名"></el-table-column>
            <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                    <el-button @click="handleSycnDev(scope.row)" type="text">重新同步</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="btn">
          <el-button type="primary" @click="syncDevices">批量同步</el-button>
        </div>
      </div>
      <div class="barriergate-table">
        <div><span>设备授权列表</span></div>
        <el-form ref="listQuery" :inline="true" :model="listQuery">
            <el-form-item label="同步状态：">
                <el-select v-model="listQuery.status" placeholder="全部">
                    <el-option v-for="item in syncStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="凭证号：">
                <el-input v-model="listQuery.credenceFuzzy"></el-input>
            </el-form-item>
            <el-form-item label="人员姓名：">
                <el-input v-model="listQuery.ownerNameFuzzy"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryAuth">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="authTable" :data="authList" @selection-change="handleAuthChange" border max-height="280" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="voucherNo" label="凭证号"></el-table-column>
            <el-table-column prop="voucherType" label="凭证类型"></el-table-column>
            <el-table-column prop="ownerName" label="人员姓名"></el-table-column>
            <el-table-column prop="startTime" label="生效时间"></el-table-column>
            <el-table-column prop="endTime" label="失效时间"></el-table-column>
            <el-table-column prop="operation" label="操作状态"></el-table-column>
            <el-table-column prop="syncStatus" label="同步状态"></el-table-column>
            <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                    <el-button @click="handleSycnAuth(scope.row)" type="text">重新同步</el-button>
                </template>
            </el-table-column>                        
        </el-table>  
        <div class="text-right">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
              :current-page="listQuery.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="listQuery.pageSize" :total="totalPage"
              background layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>     
        <div class="btn">
          <el-button type="primary" @click="syncAuths">批量同步</el-button>
        </div>                           
      </div>
  </div>
</template>
<script>
import {listBarrierGate, queryBarrierGateAuth, syncDev, syncAuth} from '@/views/ParkingLotApp/apis'
export default {
  data () {
    return {
      deviceList: [],   // 设备列表
      authList: [],   // 授权列表
      syncStatusList: [   // 同步状态定义
        {value: '', label: '全部'},
        {value: 'SEND', label: '下发中'},
        {value: 'SUCCESS', label: '下发成功'},
        {value: 'FAILED', label: '下发失败'},
        {value: '1', label: '数据错误'},
        {value: '2', label: '凭证存储满'},
        {value: '3', label: '凭证已经存在'},
        {value: '4', label: '与图片服务器断开'},
        {value: '5', label: '子设备不在线'},
        {value: '6', label: '指纹模组不在线'},
        {value: '7', label: '指纹质量差'},
        {value: '8', label: '指纹模板错误'},
        {value: '9', label: '指纹ID错误'},
        {value: '10', label: '指纹ID已存在'}
      ],
      checkedDevice: [], // 选中的道闸设备
      checkedAuth: [], // 选中的授权信息
      listQuery: {  // 授权查询条件
        ownerNameFuzzy: '',
        devCode: '', // 设备编码
        status: '', // 同步状态
        credenceFuzzy: '', // 车牌号或卡号
        currentPage: 1, // 列表当前页
        pageSize: 10   // 每页数据条数
      },
      totalPage: 0    // 总页数
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      let that = this
      // 查询道闸设备
      listBarrierGate().then(function (response) {
        that.deviceList = response.data
      })
    },
    // 查询授权
    queryAuth: function () {
      let that = this
      queryBarrierGateAuth(that.listQuery).then(function (response) {
        that.authList = response.data.result
        that.totalPage = response.data.totalCount
      })
    },
    // 选择设备查询授权
    selectDevice: function (row) {
      let that = this
      that.listQuery.status = ''
      that.listQuery.credenceFuzzy = ''
      that.listQuery.devCode = row.deviceCode
      that.queryAuth()
    },
    // 多选道闸
    handleDeviceChange: function (val) {
      this.checkedDevice = val
    },
    // 多选授权
    handleAuthChange: function (val) {
      this.checkedAuth = val
    },
    // 向后台发送道闸同步信息
    syncDev: function (val) {
      let that = this
      syncDev(val).then(function (response) {
        if (response.code === '0') {
          that.$message({
            message: '同步成功',
            type: 'success'
          })
          that.queryAuth()
        } else {
          that.$message({
            message: '同步失败',
            type: 'error'
          })
        }
      })
    },
    // 向后台同步授权
    syncAuth: function (val) {
      let that = this
      syncAuth(val).then(function (response) {
        if (response.code === '0') {
          that.$message({
            message: '同步成功',
            type: 'success'
          })
          that.queryAuth()
        } else {
          that.$message({
            message: '同步失败',
            type: 'error'
          })
        }
      })
    },
    // 单个同步道闸
    handleSycnDev: function (row) {
      let that = this
      let idArr = [row.deviceCode]
      that.syncDev(idArr)
    },
    // 批量同步道闸
    syncDevices: function () {
      let that = this
      if (that.checkedDevice.length < 1) {
        this.$message({
          message: '请选择需要同步的数据',
          type: 'warning'
        })
        return false
      }
      let idArr = []
      for (let v of that.checkedDevice) {
        idArr.push(v.deviceCode)
      }
      that.syncDev(idArr)
    },
    // 单个同步授权
    handleSycnAuth: function (row) {
      let that = this
      let idArr = [row.id]
      that.syncAuth(idArr)
    },
    // 批量同步授权
    syncAuths: function () {
      let that = this
      if (that.checkedAuth.length < 1) {
        this.$message({
          message: '请选择需要同步的数据',
          type: 'warning'
        })
        return false
      }
      let idArr = []
      for (let v of that.checkedAuth) {
        idArr.push(v.id)
      }
      that.syncAuth(idArr)
    },
    handleSizeChange: function (val) {
      let that = this
      that.listQuery.pageSize = val
      that.queryAuth()
    },
    handleCurrentChange: function (val) {
      let that = this
      that.listQuery.currentPage = val
      that.queryAuth()
    },
    // 格式化设备状态
    formatStatus: function (row, column) {
      let devStatus = row.deviceStatus
      if (devStatus === 'true') {
        return '在线'
      } else if (devStatus === 'false') {
        return '离线'
      } else {
        return '未知'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  margin: 5px 25px 0px 25px;
  .barriergate-table {
    margin-top: 5px;
    .btn {
      text-align: right;
      margin: 5px 0px 5px;
    }
    .el-form {
      margin-top: 10px;
    }
    .el-table {
      margin: 5px 0px 5px;    
    }  
    // .el-table{
    //   .el-table__body-wrapper{
    //     td{
    //       padding:10px 0;
    //     }
    //   }
  }      
}
</style>
<style lang="less">
.barriergate-table {
  .el-table{
    .el-table__body-wrapper{
      td{
        padding:3px 0;
      }
    }
  }
}
.barriergate-table {
  .el-table{
    .el-table__header{
      width:auto!important;
    }
  }
}
</style>

