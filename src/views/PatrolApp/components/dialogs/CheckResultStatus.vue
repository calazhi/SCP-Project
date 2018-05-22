<template>
  <div class='Checkout-Result-Status'>
    <el-dialog title="" :visible="show" width="50%" @close="closeEvent">
      <div class="explainReason">
        <el-input v-model="abnormalReason" class="inputOne" placeholder="" :editable="false" v-show="status === '1'" :disabled="true"></el-input>
      </div>
      <div class="tableBox">
        <el-table ref="checkResultForm" :data="checkResultForm" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" :border="true">
          <el-table-column type="index" prop="date" label="序号" width="120" align="center">
          </el-table-column>
          <el-table-column prop="pointName" label="名称" show-overflow-tooltip align="center">
          </el-table-column>
          <el-table-column prop="pointTime" label="打点时间" show-overflow-tooltip align="center">
          </el-table-column>
          <el-table-column label="结果" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <span :class="getPoinStatusClass(scope.$index, scope.row)">
                {{formatStatus(scope.$index, scope.row)}}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeEvent" class="savePlan">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getResultData } from '../../apis/planChannel'
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default () {
        return false
      },
      dialogtext: {}
    },
    selectMessege: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      status: false,
      abnormalReason: '',
      checkResultForm: [],
      uuid: '',
      data: []
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.uuid = this.selectMessege.uuid ? this.selectMessege.uuid : ''
        this.abnormalReason = this.selectMessege.abnormalReason
        this.status = this.selectMessege.carryStatus
        if (this.uuid) {
          this.checkResult()
        }
      }
    }
  },
  methods: {
    closeEvent () {
      this.$emit('closePlan')
    },
    handleSelectionChange () {
    },
    checkResult () {
      let params = { 'taskId': this.uuid }
      getResultData(params).then((rs) => {
        if (rs.data.code === '00000') {
          this.checkResultForm = rs.data.data.rows
          this.pageData.total = rs.data.data.total
        } else {
          this.checkResultForm = []
        }
      })
    },
    // 后台数据对应显示逻辑
    formatStatus (index, row) {
      let statusText = ['未巡查', '已巡查', '超时未巡查 预警中', '超时已巡查', '预警已解除']
      return statusText[parseInt(row.historyPointStatus)]
    },
    // 预警项条件内的变色
    getPoinStatusClass (index, row) {
      let InsetStatus = row.historyPointStatus
      if (InsetStatus === '1') {
        return 'clickStyleBlack'
      }
      if (InsetStatus === '0' || InsetStatus === '2' || InsetStatus === '3' || InsetStatus === '4') {
        return 'clickStyleRed'
      }
    },
    handleSizeChange (val) {
      this.pageData.pageSize = val
      this.checkResult()
    },
    handleCurrentChange (val) {
      this.pageData.pageNo = val
      this.checkResult()
    }
  }
}
</script>
<style scoped lang='less'>
.Checkout-Result-Status {
  .tableBox {
    max-height: 530px;
    overflow: auto;
  }
  .dialog-footer {
    text-align: center;
  }
  .pages-crew {
    text-align: center;
  }
  .explainReason {
    margin-bottom: 1%;
  }
  .inputOne {
    min-width: 300px;
  }
  .clickStyleBlack {
    color: #666666;
  }
  .clickStyleRed {
    color: red;
  }
}
</style>
