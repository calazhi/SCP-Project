<template>
  <el-dialog :visible.sync="dialogFormVisible" width="950px" :before-close="onCloseDialog">
    <div slot="title">
      <span>{{ title }}</span>
    </div>
    <el-form ref="taskForm" :model="taskForm" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="场景名称" prop="sceneName">
            <el-input v-model.trim="taskForm.sceneName" auto-complete="off" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 中间媒体选择区域 -->
      <el-row>
        <div class="ca-container clearfix">
          <div class="left-con">
            <div class="choose-con">
              <span>备选媒体</span>
              <el-checkbox class="all-choose-btn" :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllChange" size="mini">全选
              </el-checkbox>
              <el-checkbox-group class="list-con" v-model="chooseTasks" @change="checkTaskItemChange" id="alternativeAudio" ref="alternativeAudio" @scroll.native="scrollLoad">
                <el-checkbox class="ck-item" v-for="item in taskDatas" :key="item.audioClipName" :label="item">{{item.audioClipName}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <el-button class="control-btn" type="primary" icon="el-icon-arrow-right" size="mini" @click="onSelectAudios"></el-button>
            <div class="choose-con">
              <span>已选媒体</span>
              <div class="con-button">
                <el-button type="primary" size="mini" @click="onDeleteItems">删除</el-button>
                <el-button type="primary" size="mini" @click="onClearAll">重置</el-button>
              </div>
              <el-checkbox-group class="list-con" v-model="chooseTasks2">
                <el-checkbox class="ck-item" v-for="item in taskForm.chooseTaskData" :key="item.audioClipName" :label="item">{{item.audioClipName}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </el-row>
      <el-row>
        <el-col :span="6">
          <p class="task-time-length"> 场景时长 :
            <span> {{ sceneTimeLength }}</span>
          </p>
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

import { addScene, detailScene, updScene } from '@/views/BroadcastApp/apis/index.js'
import { validTaskName, secondToDate } from '@/views/BroadcastApp/assets/js/validate.js'
import { LOG_TAG, getAudioData } from '@/views/BroadcastApp/assets/js/index.js'
export default {
  computed: {
    sceneTimeLength () {
      let result = 0
      this.taskForm.chooseTaskData.forEach((item) => {
        result += item.timeLength
      })
      return secondToDate(result)
    }
  },
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    let sceneNamePass = (rule, value, callback) => {
      if (!validTaskName(value)) {
        callback(new Error('请输入正确的场景名称'))
      } else {
        callback()
      }
    }
    return {
      pageSize: 10,
      currentPage: 1,
      flagScrollH: 0,
      taskForm: {
        sceneName: '',
        chooseTaskData: [],
        audioClipIds: []
      },
      searchKey: '',
      defaultOpenKeys: [1, 2],
      audioClipIdsAll: [],
      defaultProps: {
        id: 'id',
        children: 'children',
        label: 'label'
      },
      dialogFormVisible: false,
      rules: {
        sceneName: [
          { required: true, message: '请输入场景名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          { validator: sceneNamePass, trigger: 'blur' }
        ]
      },
      chooseTasks: [],
      chooseTasks2: [],
      taskDatas: [],
      audioIds: [],
      isIndeterminate: true,
      checkAll: false,
      audioTotal: 0
    }
  },
  methods: {
    /**
     * @description 获取备选音频列表
     */
    getAudioData: getAudioData,
    /**
     * @description 滚动条翻页加载音频
     */
    scrollLoad: function () {
      let altAudio = document.getElementById('alternativeAudio')
      if (altAudio.scrollHeight - altAudio.clientHeight === altAudio.scrollTop && altAudio.scrollTop > this.flagScrollH) {
        this.flagScrollH = altAudio.scrollTop
        this.currentPage++
        if (this.currentPage <= (this.audioTotal / 10) + 1) {
          this.getAudioData()
        }
      }
    },
    openDialog: function () {
      if (this.taskDatas.length === 0) {
        this.getAudioData()
      }
      this.dialogFormVisible = true
    },
    onCloseDialog: function () {
      this.$refs['taskForm'].resetFields()
      this.chooseTasks = []
      this.chooseTasks2 = []
      this.taskForm.chooseTaskData = []
      this.dialogFormVisible = false
    },
    /**
     * @description 新增场景保存
     */
    onSave: function () {
      this.$refs['taskForm'].validate((valid) => {
        if (valid) {
          if (this.taskForm.chooseTaskData.length === 0) {
            this.$message({
              message: '请至少添加一个播放媒体',
              type: 'warning'
            })
            return false
          } else {
            let dataD = this.taskForm.chooseTaskData
            this.taskForm.audioClipIds = []
            dataD.forEach((item, index) => {
              this.taskForm.audioClipIds.push(item.uuid)
            })
            // 添加保存传的参数
            let params = Object.assign({}, {
              audioClipIds: this.taskForm.audioClipIds,
              sceneName: this.taskForm.sceneName
            })
            // 修改保存传的参数
            let paramsEdit = Object.assign({}, params, {
              sceneId: this.taskForm.sceneId
            })
            if (this.title === '添加场景') {
              // 调用新增场景接口
              addScene(params).then(res => {
                if (res.data.code === '00000') {
                  this.$emit('reflushData')
                  this.$message({
                    message: '新增场景成功',
                    type: 'success'
                  })
                  this.onCloseDialog()
                } else {
                  this.$message({
                    message: res.data.message,
                    type: 'warning'
                  })
                }
              }).catch(err => {
                console.warn(LOG_TAG + err)
              })
            } else if (this.title === '编辑场景') {
              // 调用修改接口
              updScene(paramsEdit).then(res => {
                if (res.data.code === '00000') {
                  this.$emit('reflushData')
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.onCloseDialog()
                } else {
                  this.$message({
                    message: res.data.message,
                    type: 'warning'
                  })
                }
              }).catch(err => {
                console.warn(LOG_TAG + err)
              })
            }
          }
        } else {
          this.$message({
            message: '内容未填写完整',
            type: 'warning'
          })
          return false
        }
      })
    },
    /**
     * @description 复选框  全选
     * @param {Array} val
     */
    checkAllChange: function (val) {
      this.chooseTasks = val ? this.taskDatas : []
      this.isIndeterminate = false
    },
    /**
     * @description 复选框 选项更改
     * @param {Array} val
     */
    checkTaskItemChange: function (val) {
      let nowCount = val.length
      this.checkAll = nowCount === this.taskDatas.length
      this.isIndeterminate = nowCount > 0 && nowCount < this.taskDatas.length
    },
    /**
     * @description 从‘备选媒体’中选择任务到‘已选媒体’里
     */
    onSelectAudios: function () {
      if (this.chooseTasks.length < 1) {
        this.$message({
          message: '至少选择一个要添加的媒体',
          type: 'warning'
        })
        return false
      } else if (this.taskForm.chooseTaskData.length === 0) {
        this.taskForm.chooseTaskData = [].concat(this.chooseTasks)
        this.chooseTasks2 = []
        this.chooseTasks = []
        this.isIndeterminate = true
      } else {
        if (this.title === '添加场景') {
          for (let i = 0, len = this.chooseTasks.length; i < len; i++) {
            if (this.taskForm.chooseTaskData.indexOf(this.chooseTasks[i]) === -1) {
              this.taskForm.chooseTaskData.push(this.chooseTasks[i])
            }
          }
        } else if (this.title === '编辑场景') {
          let flag = 0
          for (let i = 0, len = this.chooseTasks.length; i < len; i++) {
            flag = 0
            for (let j = 0, leng = this.taskForm.chooseTaskData.length; j < leng; j++) {
              if (this.taskForm.chooseTaskData[j].uuid === this.chooseTasks[i].uuid) {
                flag = 1
              }
              if (j === leng - 1 && flag === 0) {
                this.taskForm.chooseTaskData.push(this.chooseTasks[i])
              }
            }
          }
        }
        this.chooseTasks2 = []
        this.chooseTasks = []
        this.isIndeterminate = true
      }
    },
    /**
     * @description 删除已选音频
     */
    onDeleteItems: function () {
      if (this.chooseTasks2.length === 0) {
        this.$message({
          message: '至少选择一个要删除的媒体',
          type: 'warning'
        })
        return false
      } else {
        for (let val in this.chooseTasks2) {
          let idx = this.taskForm.chooseTaskData.indexOf(this.chooseTasks2[val])
          if (idx !== -1) {
            this.taskForm.chooseTaskData.splice(idx, 1)
          }
        }
      }
    },
    /**
     * @description 清空已选音频
     */
    onClearAll: function () {
      this.taskForm.chooseTaskData = []
    },
    /**
     * @description 打开编辑对话框
     * @param {Object} params 所选中行的数据
     */
    initFormData: function (params = {}) {
      // 获取已选音频名称
      this.taskForm.sceneId = params.sceneIds[0]
      detailScene(Object.assign({}, params)).then(res => {
        if (res.data.code === '00000') {
          let audioClips = res.data.data[0].audioClip
          this.taskForm.chooseTaskData = []
          this.taskForm.chooseTaskData = audioClips
          this.taskForm.sceneName = res.data.data[0].sceneName
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        }
      }).catch(err => {
        console.warn(LOG_TAG + err)
      })
      this.taskForm.sceneName = params.sceneName
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
.ca-container {
  position: relative;
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #dddee1;
}
.left-con {
  float: left;
  width: 100%;
  height: 230px;
  display: flex;
  flex-flow: row;
  align-items: center;
}
.choose-con {
  width: 45%;
  padding: 10px;
}
.list-con {
  border: 1px solid #dddee1;
  padding: 10px;
  margin-top: 10px;
  height: 160px;
  overflow-y: auto;
  box-sizing: border-box;
}
.ck-item {
  margin-left: 0px;
  display: block;
}
.con-button {
  float: right;
}
.all-choose-btn {
  float: right;
}
.task-time-length {
  margin-left: 20px;
  line-height: 20px;
}
.task-time-length span {
  color: #409eff;
}
</style>