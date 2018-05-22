<template>
  <div class="select-dialog">
    <el-dialog title='请选择一名工作人员绑定' :visible='show' @close='closeDialog'>
      <div>
        <el-radio v-for="item in securityList" v-model="selectPeople" :disabled="item.isBindDevice === '1'" :key="item.uuid" :label="item.uuid" border size="small" @change="selectRadio(item)">{{item.name}}</el-radio>
      </div>
      <div slot='footer' class='dialog-footer'>
        <el-button type='primary' v-show="this.formInfo.userId === null" @click='bindClick'>绑定</el-button>
        <el-button type='primary' v-show="this.formInfo.userId !== null" @click='removeBind'>解绑</el-button>
        <el-button type='primary' v-show="this.formInfo.userId !== null" @click='changePeople'>换人</el-button>
        <el-button @click='closeDialog'>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { postBindOperateData, getSecurityData, postRemoveBindAllData, postUpdateDeviceUserData } from '../../apis/deviceBindAPI'
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default () {
        return false
      }
    },
    selectMessege: {
      type: String,
      default: ''
    },
    rowInfo: {}
  },
  data () {
    return {
      // 选中的保安信息
      selectPeople: {},
      selRdio: {},
      // 保安列表
      securityList: [],
      formInfo: {}
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.formInfo = this.rowInfo ? this.rowInfo : {}
        this.getSecurityList()
      }
    }
  },
  mounted () {
    this.getSecurityList()
  },
  methods: {
    // 获取保安列表
    getSecurityList () {
      getSecurityData().then(res => {
        if (res.data.code === '00000') {
          this.securityList = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    //  关闭弹框
    closeDialog () {
      this.showaddDialog = false
      this.$emit('closeDialog')
      this.selRdio = ''
      this.selectPeople = {}
    },
    selectRadio (item) {
      this.selRdio = item
    },
    // 绑定
    bindClick () {
      let param = {
        deviceId: this.formInfo.deviceId,
        userId: this.selRdio.uuid
      }
      if (!param.deviceId) {
        this.$message.error('设备id为空！')
        return false
      }
      if (!param.userId) {
        this.$message.error('请选择一个保安！')
        return false
      }
      postBindOperateData(param).then(res => {
        if (res.data.code === '00000') {
          this.showaddDialog = false
          this.closeDialog()
          this.$emit('fromChild', this.selRdio)
          this.$message({
            message: res.data.message,
            type: 'success'
          })
        }
      })
    },
    // 解绑
    removeBind () {
      if (!this.formInfo.userId) {
        this.$message.error('该设备没有绑定保安，请先绑定！')
        return false
      }
      let param = [this.formInfo.uuid]
      postRemoveBindAllData(param).then(res => {
        if (res.data.code === '00000') {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.showaddDialog = false
          this.closeDialog()
          this.selRdio = ''
          this.$emit('fromChild', this.selRdio)
        } else {
          this.$message.error('该保安正在执行任务或者在处理事件，不能解绑！')
        }
        this.closeDialog()
      })
    },
    // 换人
    changePeople () {
      if (!this.formInfo.userId) {
        this.$message.error('该设备没有绑定保安，请先绑定！')
        return false
      }
      let param = {
        uuid: this.formInfo.uuid,
        deviceId: this.formInfo.deviceId,
        userId: this.selRdio.uuid,
        taskId: this.formInfo.taskId,
        beasyNormal: this.formInfo.beasyNormal,
        courtUuid: this.formInfo.courtUuid,
        createUser: this.formInfo.createUser,
        updateUser: this.formInfo.updateUser
      }
      if (!param.userId) {
        this.$message.error('请选择一个保安或解绑！')
        return false
      }
      postUpdateDeviceUserData(param).then(res => {
        if (res.data.code === '00000') {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.showaddDialog = false
          this.closeDialog()
          this.$emit('fromChild', this.selRdio)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}
</script>
<style scoped lang='less'>

</style>
<style lang='less'>
.select-dialog {
  .el-dialog {
    width: 40%;
    text-align: center;
    .el-dialog__title {
      font-size: 14px;
    }
    .el-radio-button {
      margin: 5px 10px;
    }
    .el-dialog__body {
      text-align: left;
      .el-radio.is-bordered + .el-radio.is-bordered {
        margin-left: 10px;
      }
      .el-radio {
        margin: 10px;
      }
    }
  }
}
</style>


