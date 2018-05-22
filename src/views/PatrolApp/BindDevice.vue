<template>
  <div class="bind-box">
    <div class="center-box">
      <el-table class="table-box" ref="multipleTable" :data="bindTabelDate" tooltip-effect="dark" border>
        <el-table-column label="序号" prop="index" type="index" align="center" header-align="center" width="80px"></el-table-column>
        <el-table-column label="设备名称" prop="scope" align="center" header-align="center">
          <template slot-scope="scope">
            <span class="icon icon-device"></span>
            <span class="table-text">{{scope.row.deviceName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="保安选择" prop="scope" align="center" header-align="center">
          <template slot-scope="scope">
            <div class="pointer-box" @click="openDialog(scope.row, scope.$index)">
              <span class="icon icon-people"></span>
              <span class="table-text">{{scope.row.userName}}</span>
              <span class="icon icon-add"></span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗 -->
    <security-select :show="showaddDialog" :rowInfo="rowInfo" @closeDialog="closeDialog" @fromChild="fromChild"></security-select>
  </div>
</template>
<script>
import { getDeviceListData } from './apis/deviceBindAPI'
import SecuritySelect from './components/dialogs/SecuritySelect'
export default {
  components: {
    SecuritySelect
  },
  data () {
    return {
      pageData: {
        pageNo: 1,
        pageSize: 10,
        total: 10
      },
      showaddDialog: false,
      bindTabelDate: [],
      fromChildSelect: {},
      indexFlag: -1,
      rowInfo: {}
    }
  },
  mounted () {
    this.queryList()
  },
  methods: {
    // 获取设备列表
    queryList () {
      let param = {
        pageSize: 10,
        pageNo: 1,
        beginDate: '',
        endDate: '',
        deviceId: '',
        userId: '',
        courtUuid: '',
        createTime: '',
        updateTime: '',
        createUser: '',
        updateUser: '',
        taskName: '',
        deviceName: '',
        userName: '',
        hasTask: ''
      }
      getDeviceListData(param).then(res => {
        if (res.data.code === '00000') {
          this.bindTabelDate = res.data.data.rows
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 打开选择保安弹窗
    openDialog (row, index) {
      this.rowInfo = row
      if (row.taskId === null && row.beasyNormal !== 1) {
        this.indexFlag = index
        this.showaddDialog = true
      } else {
        this.$message.error('该设备正在执行任务或保安处理事件中！')
      }
    },
    // 接收子组件传递过来的值
    fromChild (select) {
      this.queryList()
      this.fromChildSelect = select
      this.bindTabelDate[this.indexFlag].security = this.fromChildSelect.peopleName
    },
    //  关闭弹框
    closeDialog () {
      this.showaddDialog = false
    },
    handleSizeChange (val) {
      this.pageData.pageSize = val
      // this.getPatrolParamList()
    },
    handleCurrentChange (val) {
      this.pageData.pageNo = val
      // this.getPatrolParamList()
    }
  }
}
</script>

<style lang="less" scoped>
.bind-box {
  margin: 0;
  .center-box {
    width: 60%;
    margin: 0 auto;
    .table-box {
      width: 100%;
      margin: 30px 0;
      .el-table td,
      .el-table th {
        padding: 0;
      }
      .cell {
        span {
          display: inline-block;
          vertical-align: middle;
        }
        .table-text {
          min-width: 120px;
        }
      }
      .icon {
        display: inline-block;
        width: 23px;
        height: 23px;
        background-size: 23px 23px;
        background-repeat: no-repeat;
        background-position: center center;
        margin: 0 15px;
      }
      .icon-device {
        background-image: url("assets/images/phone.png");
      }
      .icon-people {
        background-image: url("assets/images/people.png");
      }
      .icon-add {
        background-image: url("assets/images/add.png");
      }
      .pointer-box {
        cursor: pointer;
        color: #409eff;
      }
    }
  }
  .pagination-box {
    margin: 20px 0;
  }
  .text-a-left {
    text-align: left;
  }
  .text-a-right {
    text-align: right;
  }
}
</style>
<style lang="less">
.bind-box {
  .center-box {
    .el-table td {
      padding: 0;
      .cell > .pointer-box {
        padding: 12px 0;
        cursor: pointer;
      }
    }
    .el-table__body-wrapper {
      overflow: hidden;
    }
  }
}
</style>
