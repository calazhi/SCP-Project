<template>
  <div>
    <el-dialog :visible="visible" @close="closeEvent">
      <el-form :model="form">
        <el-form-item label="人员" :label-width="formLabelWidth">
          <div>{{person}}</div>
        </el-form-item>
        <el-form-item label="时间" :label-width="formLabelWidth">
          <div>{{times}}</div>
        </el-form-item>
        <el-form-item label="任务" :label-width="formLabelWidth">
          <div>{{childMsg}}</div>
        </el-form-item>
        <!-- 处理结果 -->
        <el-form-item label="原因" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="reason" :rows="4" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmitEvent">确 定</el-button>
        <el-button @click="closeEvent">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { TimeoutQuery, BoundaryQuery } from '../../apis/eventHandler'
export default {
  data () {
    return {
      form: {
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '80px',
      reason: ''
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
      default () {
        return false
      }
    },
    childMsg: String,
    times: '',
    person: String,
    diffserv: String,
    deviceId: '',
    uuid: '',
    uuidNumber: String
  },
  mounted () {
    this.addSubmitEvent()
  },
  methods: {
    closeEvent () {
      this.$emit('closeDialog')
      this.reason = ''
    },
    addSubmitEvent () {
      if (this.diffserv === 'timeoutAlarmEvent') {
        // 传入的参数
        let params = {
          'uuid': this.uuid,
          'deviceId': this.deviceId,
          'lateReason': this.reason,
          'historyPointStatus': '5'
        }
        TimeoutQuery(params).then(dd => {
          if (dd.data.code === '00000') {
            // 关闭弹框
            this.$emit('closeDialog')
            // 接受结果反馈给超时预警页面
            this.$emit('child-say', this.reason, this.uuid)
            // 清楚框内的数据
            this.reason = ''
          } else {
            this.$message({
              message: '更改失败!',
              time: 3,
              type: 'warning'
            })
          }
        })
      }
      if (this.diffserv === 'boundaryAlermEvent') {
        // 传入的参数
        let params = {
          'uuid': this.uuidNumber,
          'deviceId': this.deviceId,
          'reason': this.reason,
          'alarmStatus': '7'
        }
        BoundaryQuery(params).then(rs => {
          if (rs.data.message === '修改成功') {
            // 关闭弹框
            this.$emit('closeDialog')
            // 接受结果反馈给超时预警页面
            this.$emit('child', this.reason, this.uuidNumber)
            // 清楚框内的数据
            this.reason = ''
          } else {
            this.$message({
              message: '更改失败!',
              time: 3,
              type: 'warning'
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.dialog-footer {
  text-align: center;
}
.dialog-footer .el-button {
  margin: 0 15%;
  width: 15%;
}
.el-form-item__content {
  margin-left: 20px;
}
</style>