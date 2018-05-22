<template>
  <el-dialog :visible.sync="dialogFormVisible" width="960px" :before-close="onCloseDialog">
    <div slot="title">
      <span>{{ title }}</span>
    </div>
    <el-form ref="taskForm" :model="taskForm" :rules="rules" class="form">
      <el-row>
        <el-col :span="3">
          <span class="tit_name">联动规则ID</span>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="linkageId">
            <el-input v-model.trim="taskForm.linkageId" :maxlength="32" :disabled="title === '编辑' ? true : false"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-col :span="6">
            <span class="tit_name">联动模式</span>
          </el-col>
          <el-col :span="13">
            <el-form-item>
              <el-select placeholder="请选择联动模式" clearable v-model="taskForm.linkageMode" @change="handleLinkageChange">
                <el-option label="普通模式" value='0'>
                </el-option>
                <el-option label="业主访客模式" value='1'>
                </el-option>
                <el-option label="落水模式" value='2'>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="12">
          <p class="warn-msg" v-show="taskForm.linkageMode === '2'">注意: 落水模式下，联动广播播放的设备为广播任务默认配置的设备</p>
        </el-col>

      </el-row>

      <el-row v-if="taskForm.linkageMode === '0' || taskForm.linkageMode === '普通模式'">
        <el-col :span="3">
          <span class="tit_name">普通模式</span>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-select v-model="taskForm.broadcastId1" placeholder="请选择即时任务" clearable filterable>
              <el-option v-for="item in taskList" :key="item.uuid" :label="item.broadcastName" :value="item.uuid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="taskForm.linkageMode === '1' || taskForm.linkageMode === '业主访客模式'">
        <el-col :span="12">
          <el-col :span="6">
            <span class="tit_name">业主广播</span>
          </el-col>
          <el-col :span="13">
            <el-form-item>
              <el-select v-model="taskForm.broadcastId1" placeholder="请选择即时任务" clearable filterable class="owner-task">
                <el-option v-for="item in taskList" :key="item.uuid" :label="item.broadcastName" :value="item.uuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="6">
            <span class="tit_name">访客广播</span>
          </el-col>
          <el-col :span="13">
            <el-form-item>

              <el-select v-model="taskForm.broadcastId2" placeholder="请选择即时任务" clearable filterable>
                <el-option v-for="item in taskList" :key="item.uuid" :label="item.broadcastName" :value="item.uuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-row v-if="taskForm.linkageMode === '2' || taskForm.linkageMode === '落水模式'">
        <el-col :span="12">
          <el-col :span="6">
            <span class="tit_name">靠近播放任务</span>
          </el-col>
          <el-col :span="13">
            <el-form-item>
              <el-select v-model="taskForm.broadcastId1" placeholder="请选择即时任务" clearable filterable class="owner-task">
                <el-option v-for="item in taskList" :key="item.uuid" :label="item.broadcastName" :value="item.uuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="6">
            <span class="tit_name">落水播放任务</span>
          </el-col>
          <el-col :span="13">
            <el-form-item>
              <el-select v-model="taskForm.broadcastId2" placeholder="请选择即时任务" clearable filterable>
                <el-option v-for="item in taskList" :key="item.uuid" :label="item.broadcastName" :value="item.uuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <span class="tit_name">备注</span>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-input v-model.trim="taskForm.memo" :maxlength="128" class="linkageId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="onSave">保 存</el-button>
      <el-button @click="onCloseDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>

import { getAllTask, addConfig, updateConfig } from '@/views/BroadcastApp/apis/index.js'
import { LOG_TAG } from '@/views/BroadcastApp/assets/js/index.js'
export default {
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    let linkageIdPass = (rule, value, callback) => {
      let reg = /^[0-9a-zA-Z]+$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确格式的ID'))
      } else {
        callback()
      }
    }
    return {
      currentPage: 1,
      pageSize: 10,
      options: [],
      taskForm: {
        createUser: 'xxx',
        linkageId: '',
        linkageMode: '',
        broadcastId1: '',
        broadcastId2: '',
        memo: ''
      },
      uuid: '',
      searchKey: '',
      dialogFormVisible: false,
      taskList: [],
      checkAll: false,
      rules: {
        linkageId: [
          { required: true, message: '请输入联动规则ID', trigger: 'blur' },
          { min: 32, max: 32, message: '长度为32个字符', trigger: 'blur' },
          { validator: linkageIdPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * @description 打开对话框
     */
    openDialog: function () {
      this.getTaskList()
      this.dialogFormVisible = true
    },
    /**
     * @description 获取下拉单任务列表
     */
    getTaskList: function () {
      let params = {}
      params.broadcastType = 0
      params.searchKey = ''
      if (this.taskList.length === 0) {
        getAllTask(Object.assign({}, params))
          .then(res => {
            if (res.data.code === '00000') {
              let tableD = res.data.data.broadcast
              this.taskList = tableD
            }
          }).catch(err => {
            console.warn(LOG_TAG + err)
          })
      }
    },
    /**
     * @description 关闭对话框
     */
    onCloseDialog: function () {
      this.dialogFormVisible = false
      this.$refs['taskForm'].resetFields()
      this.taskForm = {
        linkageId: '',
        linkageMode: '',
        broadcastId1: '',
        broadcastId2: '',
        memo: ''
      }
    },
    /**
     * @description 监听联动模式
     */
    handleLinkageChange: function () {
      this.taskForm.broadcastId1 = ''
      this.taskForm.broadcastId2 = ''
    },
    /**
     * @description 进入编辑
     * @param {Object} params 所选中行的数据
     */
    initFormData: function (params) {
      this.taskForm = {
        linkageId: params.linkageId,
        linkageMode: params.linkageMode,
        broadcastId1: params.broadcastId1,
        broadcastId2: params.broadcastId2,
        memo: params.memo
      }
      this.uuid = params.uuid
    },
    /**
     * @description 保存前校验
     * @param {Number} box 第一或第二个下拉框
     */
    beforeSave: function () {
      if (this.taskForm.linkageMode === '') {
        this.$message.warning('请选择联动模式')
        return false
      } else if (this.taskForm.linkageMode === '0') {
        if (this.taskForm.broadcastId1 === '') {
          this.$message.warning('请选择即时任务')
          return false
        } else {
          return true
        }
      } else if (this.taskForm.linkageMode === '1' || this.taskForm.linkageMode === '2') {
        if (this.taskForm.broadcastId2 === '' || this.taskForm.broadcastId1 === '') {
          this.$message.warning('请选择即时任务')
          return false
        } else {
          return true
        }
      }
    },
    /**
     * @description 保存
     */
    onSave: function () {
      this.$refs['taskForm'].validate((valid) => {
        if (valid) {
          if (this.beforeSave()) {
            if (this.title === '添加') {
              addConfig(Object.assign({}, this.taskForm)).then(res => {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
                this.$emit('reflushData')
                this.onCloseDialog()
              }).catch(err => {
                console.warn(LOG_TAG + err)
              })
            } else if (this.title === '编辑') {
              updateConfig(Object.assign({}, this.taskForm, { uuid: this.uuid })).then(res => {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.$emit('reflushData')
                this.onCloseDialog()
              }).catch(err => {
                console.warn(LOG_TAG + err)
              })
            }
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
  clear: both;
}
.clearfix {
  zoom: 1;
}
.owner-task {
  margin-right: 10px;
}
.ck-item {
  margin-left: 0px;
  display: block;
}
.all-choose-btn {
  float: right;
}
.con-button {
  float: right;
}
.tit_name {
  display: inline-block;
  text-align: right;
  line-height: 40px;
}
.form {
  margin-left: 50px;
}
.form .el-form-item__error {
  left: 120px;
}
.warn-msg {
  color: #ffa824;
  line-height: 40px;
}
</style>