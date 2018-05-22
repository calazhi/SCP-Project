<template>
<div class = "ui-common">
  
  <!-- 主布局 Start -->
<div class="arg-title"><i class="el-icon-news"></i> 监控指标列表</div>
<!-- <div class="border-divide"></div> -->
  <!-- List显示区 -->   
  <div>
    <el-table :data="iotBusArgList" style="width: 100%">
      <!-- <el-table-column type="index"></el-table-column>     -->
      <el-table-column label="监控指标类型" prop="indexName"></el-table-column>
      <el-table-column label="告警阈值" prop="thresholdMax"></el-table-column>
      <!-- <el-table-column label="启用状态" prop="enableFlag" :formatter="enableFlag"></el-table-column> -->
      <!-- <el-table-column label="更新人" prop="updateUser"></el-table-column> -->
      <el-table-column label="最后更新时间" prop="updateTime" :formatter="dateFormat"></el-table-column>
            
      <el-table-column label="操作" width="170" align="center">
          <template slot-scope="scope">            
            <el-button  icon="el-icon-edit" type="text" size="small"  @click="handleEdit(scope.$index, scope.row)">更新阈值</el-button>               
          </template>
      </el-table-column>
    </el-table>
  </div>

<div class="arg-title" style = 'margin-top: 88px'><i class="el-icon-news"></i> 系统配置</div> 
  <div>
    <el-switch v-model="monitorStatus" active-color="#13ce66" inactive-color="#ff4949" active-text="开启监控任务" inactive-text="停止监控任务" @change="changeMonitorJob">
    </el-switch>
  </div>

  <div style = 'margin-top: 35px'>
    <el-button type="primary" icon="el-icon-refresh"  @click="executeCacheSync" >同步缓存</el-button>
    <el-button type="primary" icon="el-icon-refresh"  @click="executeConfigSync" >同步配置</el-button>
    <el-tooltip class="item" effect="light" placement="right-start">
      <div slot="content">将死信队列数据存入数据库，直至实时数值变为‘0’<br/>（此过程将花费一些时间……）</div>
      <el-button type="primary"  icon="el-icon-edit-outline" @click="executeDeadLogDump" >清理死信队列</el-button>
    </el-tooltip> 
  </div>
 
  <!-- 主布局 End -->


  <!-- 编辑IOT订阅对话框 -->
  <el-dialog
    title="更新监控指标"
    :close-on-click-modal=false
    :close-on-press-escape=false
    :visible.sync="editIotArgDialogVisible"
    width="25%"
    :before-close="handleClose">

    <el-form :model="editIotArg" :rules="rules" ref="updateIotArg" label-width="110px" class="demo-ruleForm">
      <el-form-item label="监控指标类型：" prop="indexName">
        <el-input size="small" v-model="editIotArg.indexName" disabled></el-input>
        <!-- <span>{{ editIotArg.indexName }}</span> -->
      </el-form-item>
      <el-form-item label="告警阀值：" prop="thresholdMax">
        <el-input size="small" v-model="editIotArg.thresholdMax"></el-input>
      </el-form-item>
      <!-- <el-form-item label="是否启用" prop="enableFlag">
        <el-switch v-model="editIotArg.enableStatus">
        </el-switch>
      </el-form-item> -->

      <el-form-item class="text-right add-IotArg-button">
        <el-button type="primary" @click="submitEditForm('updateIotArg')">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</div>
</template>


<style scoped>
.arg-title {
    padding: 5px 0 10px 10px;
    border-bottom: 1px solid #cccccc;
    margin-bottom: 20px;
    font-size: 18px;
    color: #666666;
  }
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 110px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.el-table .unenable-row {
  background: oldlace;
}
.el-table .enable-row {
  background: rgb(175, 215, 255); 
}
</style>

<script>
import {getArgItems, updateArgItem, getMonitorStatus, enableMonitorJob, disableMonitorJob, syncCache, syncConfig, dumpDeadLog} from '@/views/IotBusMgmt/apis/iotbus_arg_api'
import { formatDate } from '../assets/js/tool.js'

export default {
  name: 'iotBusArgList',
  components: {
  },
  data () {
    return {
      editIotArgDialogVisible: false,
      iotBusArgList: [],
      editIotArg: {},
      monitorStatus: true,
      rules: {
        thresholdMax: [
          // {required: true, message: '不能为空'},
          {required: true, pattern: /^[1-9]\d{0,5}$/, message: '请输入1-6位非零正整数'}
        ]
      }
    }
  },
  methods: {
    // 时间格式化
    dateFormat (row, column) {
      var time = row[column.property]
      // var timeS = time.replace(/(\d{4})-(\d{2})-(\d{2})T(.*)?\.(.*)/, '$1/$2/$3 $4')
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    // enableText (row, column) {
    //   var enableKey = row[column.property]
    //   return enableKey ? '启用' : '禁用'
    // },
    getMonitorJobStatus () {
      getMonitorStatus()
        .then(
          function (result) {
            // console.log(result[0])
            var enableStatus = result[0].status
            // console.log('hi--' + enableStatus)
            // this.monitorStatus = enableStatus
            enableStatus === '1' ? (this.monitorStatus = true) : (this.monitorStatus = false)
            // console.log(this.monitorStatus)
          }.bind(this)
        ).catch(
          function (error) {
            console.info(error)
          }
        )
    },
    executeCacheSync () {
      syncCache().then(
        this.$message({
          message: '同步缓存指令已发送',
          type: 'success'
        })
      ).catch(
        function (error) {
          console.info(error)
        }
      )
    },
    executeConfigSync () {
      syncConfig().then(
        this.$message({
          message: '同步配置指令已发送',
          type: 'success'
        })
      ).catch(
        function (error) {
          console.info(error)
        }
      )
    },
    executeDeadLogDump () {
      dumpDeadLog().then(
        this.$message({
          message: '已启动清理死信队列',
          type: 'success'
        })
        ).catch(
        function (error) {
          console.info(error)
        }
      )
    },
    changeMonitorJob () {
      // console.log('helloworld')
      if (this.monitorStatus) {
        enableMonitorJob().then(
          this.$message({
            message: '监控任务已成功开启',
            type: 'success'
          })
        ).catch(
          function (error) {
            console.info(error)
          }
        )
      } else {
        disableMonitorJob().then(
          this.$message('监控任务已停止')
        ).catch(
          function (error) {
            console.info(error)
          }
        )
      }
    },
    loadData () {
      getArgItems()
        .then(
          function (result) {
            this.iotBusArgList = result.data
            // console.log('hello' + this.iotBusArgList)
          }.bind(this)
        )
        .catch(
          function (error) {
            // this.$message.error('服务器请求超时，无法获取数据！')
            console.info(error)
          }
        )
    },
    resetForm (formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    confirmEditIotArg () {
      // this.loadingEditStep = true
      var params = this.editIotArg
      // console.log(params)
      updateArgItem(params)
        .then(
          function (result) {
            // console.log(result)
            // this.loadingEditStep = false
            this.editIotArgDialogVisible = false
            this.iotBusArgList = []
            this.loadData()
          }.bind(this)
        )
        .catch(
          function (error) {
            // this.loadingEditStep = false
            // this.$message.error('发生错误，更新失败！')
            console.info(error)
          }
        )
    },
    submitEditForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmEditIotArg()
        } else {
          console.log('error submit Edit!!')
          return false
        }
      })
    },
    handleClose (done) {
      this.editIotArgDialogVisible = false
      // this.resetForm('updateIotArg')
    },
    handleEdit (index, item) {
      // console.info(item)
      this.editIotArg = JSON.parse(JSON.stringify(item))
      // this.editIotArg = item
      this.editIotArgDialogVisible = true
    }
  },
  mounted () {
    this.loadData()
    this.getMonitorJobStatus()
  }
}
</script>