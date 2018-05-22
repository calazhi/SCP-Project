<template>
  <el-dialog :visible.sync="dialogFormVisible" width="950px" :before-close="onCloseDialog">
    <div slot="title">
      <span>即时任务{{ title }}</span>
    </div>
    <el-form ref="taskForm" :model="taskForm" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="任务名称" prop="broadcastName">
            <el-input v-model.trim="taskForm.broadcastName" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="任务等级" prop="taskLevel">
            <el-input v-model.trim="taskForm.taskLevel" auto-complete="off" :maxlength="2" placeholder="请输入1~20,数字越小代表等级越高" @change="taskLevelChange"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="重复次数" prop="repetitions">
            <el-input v-model.trim="taskForm.repetitions" auto-complete="off" :maxlength="10"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="imgUpload">
        <div class="upload-btn">
          <el-button type="primary" @click="onAddPhoto" size="small">本地上传</el-button>
          <el-button type="primary" @click="onResetImg(1)" size="small">重置</el-button>
          <div class="tips">
            <span>上传说明：</span>
            <p>图片推荐尺寸200*200</p>
            <p>只支持JPG格式，文件大小200Kb以内</p>
          </div>
        </div>
        <div class="face-pic-preview">
          <async-img :src="faceImg" ref="img"></async-img>
        </div>
        <form ref="picForm" class="upload-pic-input">
          <input @change="readFacePic" ref="uploadFacePicInput" id="uploadFacePicInput" type="file" accept="image/jpeg" />
        </form>
      </el-row>
      <!-- 中间媒体选择区域 -->
      <el-row>
        <div class="ca-container clearfix">
          <div class="left-con">
            <div class="choose-con">
              <span>备选媒体</span>
              <el-checkbox class="all-choose-btn" :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllChange" size="mini">全选
              </el-checkbox>
              <el-checkbox-group class="list-con" v-model="chooseTasks" @change="checkTaskItemChange" ref="alternativeAudio" @scroll.native="scrollLoad" id="alternativeAudio">
                <el-checkbox class="ck-item" v-for="item in taskDatas" :label="item" :key="item.audioClipName">{{item.audioClipName}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <el-button class="control-btn" type="primary" icon="el-icon-arrow-right" size="mini" @click="onSelectAudios"></el-button>
            <div class="choose-con">
              <span>已选媒体</span>
              <div class="con-button">
                <el-button type="primary" size="mini" @click="onDeleteItems">删除</el-button>
                <el-button type="primary" size="mini" @click="onClearAll">重置</el-button>
              </div>
              <el-checkbox-group class="list-con" v-model="chooseTasks2" @change="checkTaskItemChange">
                <el-checkbox class="ck-item" v-for="item in taskForm.chooseTaskData" :label="item" :key="item.audioClipName">{{item.audioClipName}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="right-con">
            <el-tree ref="tree" :data="treeData" :props="defaultProps" show-checkbox node-key="id" :default-expand-all="true" :expand-on-click-node="false" :default-checked-keys="InitTreeChecked">
            </el-tree>
          </div>
        </div>
      </el-row>
      <el-row>
        <el-col :span="6">
          <p class="task-time-length"> 任务时长 :
            <span> {{ taskTimeLength }}</span>
          </p>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="onSave" :loading="saveLoading">保 存</el-button>
      <el-button @click="onCloseDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>

import { addRealtimeTask, getTaskDetail, updateRealtimeTask } from '@/views/BroadcastApp/apis/index.js'
import { validPositiveInt, validTaskName, secondToDate } from '@/views/BroadcastApp/assets/js/validate.js'
import { listDeviceList } from '@/views/BroadcastApp/assets/js/list_devices.js'
import { LOG_TAG, getAudioData } from '@/views/BroadcastApp/assets/js/index.js'
import AsyncImg from './AsyncImg'
import defaultPicture from '@/views/BroadcastApp/assets/images/default_picture.png'
export default {
  components: {
    AsyncImg
  },
  computed: {
    taskTimeLength () {
      let result = 0
      let repetitions = this.taskForm.repetitions
      this.taskForm.chooseTaskData.forEach((item) => {
        result += item.timeLength
      })
      if (!isNaN(repetitions)) {
        result = repetitions * result
        return secondToDate(result)
      }
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
    let taskLevelPass = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请输入等级数字'))
      } else {
        if (!validPositiveInt(value)) {
          callback(new Error('请输入正整数'))
        } else if (value > 20) {
          callback(new Error('等级不能大于20'))
        } else {
          callback()
        }
      }
    }
    let repetitionsPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入重复次数'))
      } else {
        if (!validPositiveInt(value)) {
          callback(new Error('请输入正整数'))
        } else {
          callback()
        }
      }
    }
    let broadcastNamePass = (rule, value, callback) => {
      if (!validTaskName(value)) {
        callback(new Error('请输入正确的任务名称'))
      } else {
        callback()
      }
    }
    return {
      currentPage: 1,
      pageSize: 10,
      flagScrollH: 0,
      InitTreeChecked: [],
      taskForm: {
        broadcastName: '',
        repetitions: '',
        taskLevel: '',
        broadcastType: 0,
        chooseTaskData: [],
        audioClipIds: [],
        recovery: 1,
        createUser: 'test',
        taskPicName: '',
        taskPicBase64: '',
        picUrl: ''
      },
      saveLoading: false,
      faceImg: '',
      broadcastId: '',
      searchKey: '',
      defaultOpenKeys: [1, 2],
      treeData: [],
      chooseTreeData: [],
      defaultProps: {
        id: 'id',
        children: 'children',
        label: 'label'
      },
      dialogFormVisible: false,
      rules: {
        broadcastName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          { validator: broadcastNamePass, trigger: 'blur' }
        ],
        repetitions: [
          { required: true, message: '请输入重复次数', trigger: 'blur' },
          { validator: repetitionsPass, trigger: 'blur' }
        ],
        taskLevel: [
          { required: true, message: '请输入整数1~20 (数字越大代表等级越高)', trigger: 'blur' },
          { validator: taskLevelPass, trigger: 'blur' }
        ]
      },
      chooseTasks: [],
      taskDatas: [],
      chooseTasks2: [],
      isIndeterminate: true,
      checkAll: false,
      audioTotal: 0,
      xmlFile: ''
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
    /**
     * @description 初始化任务详情
     * @param {Object} params 所选中行的数据
     */
    initFormData: function (params) {
      // 调用详情查询的接口
      getTaskDetail(params).then(res => {
        let result = res.data.data[0]
        this.broadcastId = result.uuid
        this.taskForm.broadcastName = result.broadcastName
        this.taskForm.repetitions = result.repetitions
        this.taskForm.taskLevel = result.taskLevel
        let audioClips = result.audioClip
        this.taskForm.chooseTaskData = []
        this.taskForm.chooseTaskData = audioClips
        this.xmlFile = result.xmlFile
        this.faceImg = result.picUrl
        this.taskForm.picUrl = result.picUrl
        let treeD = []
        let devcList = result.broadcastAreaLink
        // 获取已选的子设备id
        devcList.forEach((item, index) => {
          if (item.playAreaId.length > 0) {
            let subDeviceInfo = item.subDeviceInfo.split(',')
            subDeviceInfo.forEach((cur, _idx) => {
              if (cur !== null && cur !== '') {
                treeD.push(cur.split(':')[0])
              }
            })
          }
        })
        this.InitTreeChecked = []
        // 重新渲染组织树
        this.getDeviList()
        this.InitTreeChecked = treeD
      }).catch(err => {
        console.warn(LOG_TAG + err)
      })
    },
    /**
     * @description 打开对话框
     */
    openDialog: function () {
      if (this.treeData.length === 0) {
        this.getDeviList()
      }
      if (this.taskDatas.length === 0) {
        this.getAudioData()
      }
      this.dialogFormVisible = true
    },
    /**
     * @description 获取设备列表
     */
    getDeviList: listDeviceList,
    /**
     * @description 关闭对话框
     */
    onCloseDialog: function () {
      this.dialogFormVisible = false
      this.taskForm.chooseTaskData = []
      this.$refs['tree'].setCheckedNodes([])
      this.$refs['taskForm'].resetFields()
      this.onResetImg(1)
    },
    /**
     * @description 重置图片信息
     */
    onResetImg: function (param) {
      this.faceImg = defaultPicture
      this.taskForm.taskPicBase64 = ''
      this.taskForm.picUrl = ''
      this.taskForm.taskPicName = ''
      if (param === 1) {
        // 清空file文件
        this.$refs['picForm'].reset()
      }
    },
    /**
     * @description 读取上传图片的base64编码
     */
    readFacePic: function () {
      let file = this.$refs.uploadFacePicInput.files[0]
      // 判断上传文件类型
      if (file.type === 'image/jpeg') {
        this.taskForm.taskPicName = file.name
        // 判断图片是否大于200K
        if (file.size < 1024 * 200) {
          const self = this
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function (e) {
            let base64Code = this.result
            self.taskForm.taskPicBase64 = base64Code
            self.faceImg = base64Code
            self.taskForm.picUrl = ''
          }
        } else {
          this.$message.warning('请选择小于200KB的图片')
        }
      } else {
        this.$message.warning('文件格式错误、请上传JPG图片')
        return false
      }
    },
    /**
     * @description 保存
     */
    onSave: function () {
      let treeChecked = this.$refs['tree'].getCheckedNodes(true)
      // 获取设备区域选择结果
      let newPlayAreaIds = []
      let parentIds = []
      let deciIdx = 0
      // 转化为接口参数规定的数据结构
      treeChecked.forEach((item, index) => {
        if (parentIds.indexOf(item.parentId) === -1) {
          if (parentIds.length === 0) {
            deciIdx = 0
          } else {
            deciIdx = deciIdx + 1
          }
          newPlayAreaIds[deciIdx] = {}
          newPlayAreaIds[deciIdx].controllerId = item.parentId
          newPlayAreaIds[deciIdx].controllerName = item.parentName
          newPlayAreaIds[deciIdx].playAreaId = []
          newPlayAreaIds[deciIdx].subDeviceInfo = []
          newPlayAreaIds[deciIdx].playAreaId.push(item.subDeviceInstallAddress)
          newPlayAreaIds[deciIdx].subDeviceInfo.push(item.subDeviceInfo)
          parentIds.push(item.parentId)
        } else {
          newPlayAreaIds[deciIdx].playAreaId.push(item.subDeviceInstallAddress)
          newPlayAreaIds[deciIdx].subDeviceInfo.push(item.subDeviceInfo)
        }
      })
      this.taskForm.deviceInfo = newPlayAreaIds
      this.$refs['taskForm'].validate((valid) => {
        if (valid && this.taskForm.chooseTaskData.length !== 0) {
          this.taskForm.audioClipIds = []
          let dataT = this.taskForm.chooseTaskData
          dataT.forEach((item, index) => {
            this.taskForm.audioClipIds.push(item.uuid)
          })
          if (treeChecked.length < 1) {
            this.$message({
              type: 'warning',
              message: '请选择播放区域'
            })
            return false
          } else if (this.taskForm.chooseTaskData.length === 0) {
            this.$message({
              message: '请至少添加一个播放媒体',
              type: 'warning'
            })
            return false
          } else {
            // 新增保存传的参数
            let params = Object.assign({}, this.taskForm)
            params.repetitions = parseInt(this.taskForm.repetitions)
            params.taskLevel = parseInt(this.taskForm.taskLevel)
            // 修改保存传的参数
            let paramsEdit = Object.assign({}, params, {
              broadcastId: this.broadcastId,
              xmlFile: this.xmlFile
            })
            if (this.title === '添加') {
              this.saveLoading = true
              // 调用任务新增接口
              addRealtimeTask(Object.assign({}, params)).then(res => {
                if (res.data.code === '00000') {
                  this.$message({
                    message: '新增任务成功',
                    type: 'success'
                  })
                  this.$emit('reflushData')
                  this.onCloseDialog()
                  this.saveLoading = false
                } else {
                  this.$message({
                    message: res.data.message,
                    type: 'warning'
                  })
                  this.saveLoading = false
                }
              }).catch(err => {
                console.warn(LOG_TAG + err)
                this.saveLoading = false
              })
            } else if (this.title === '编辑') {
              this.saveLoading = true
              // 调用任务编辑接口
              updateRealtimeTask(Object.assign({}, paramsEdit)).then(res => {
                if (res.data.code === '00000') {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.$emit('reflushData')
                  this.onCloseDialog()
                  this.saveLoading = false
                } else {
                  this.$message({
                    message: res.data.message,
                    type: 'warning'
                  })
                  this.saveLoading = false
                }
              }).catch(err => {
                console.warn(LOG_TAG + err)
                this.saveLoading = false
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
     * @description 从'备选媒体'中选择任务到'已选媒体'
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
        if (this.title === '添加') {
          for (let i = 0, len = this.chooseTasks.length; i < len; i++) {
            if (this.taskForm.chooseTaskData.indexOf(this.chooseTasks[i]) === -1) {
              this.taskForm.chooseTaskData.push(this.chooseTasks[i])
            }
          }
        } else if (this.title === '编辑') {
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
     * @description 删除已选媒体
     */
    onDeleteItems: function () {
      if (this.chooseTasks2.length === 0) {
        this.$message({
          message: '至少选择一个要删除的媒体',
          type: 'warning'
        })
        return false
      }
      for (let val in this.chooseTasks2) {
        let idx = this.taskForm.chooseTaskData.indexOf(this.chooseTasks2[val])
        if (idx !== -1) {
          this.taskForm.chooseTaskData.splice(idx, 1)
        }
      }
    },
    /**
     * @description 清空
     */
    onClearAll: function () {
      this.taskForm.chooseTaskData = []
    },
    /**
     * @description 打开照片上传页面
     */
    onAddPhoto: function () {
      this.$refs.uploadFacePicInput.click()
    },
    /**
     * @description 任务等级的提示
     */
    taskLevelChange: function () {
      let level = this.taskForm.taskLevel
      if (level >= 1 && level <= 3) {
        this.$message.warning('非事件联动任务建议不要设置为1~3的等级')
      }
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
  width: 60%;
  height: 230px;
  display: flex;
  flex-flow: row;
  align-items: center;
  border-right: 1px solid #dddee1;
}
.right-con {
  display: flex;
  flex-flow: column;
  float: right;
  width: 35%;
  height: 230px;
  overflow-y: auto;
  box-sizing: border-box;
  border: 1px solid #dddee1;
}
.choose-con {
  width: 45%;
  padding: 10px;
  overflow: hidden;
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
.all-choose-btn {
  float: right;
}
.con-button {
  float: right;
}
.upload-pic-input {
  display: none;
}
.face-pic-preview {
  width: 170px;
  height: 170px;
  margin: 0 auto;
  border: 1px solid #ccc;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;
}
.face-pic-preview img {
  width: 170px;
}
.imgUpload {
  position: absolute;
  top: 70px;
  right: 50px;
}
.upload-btn {
  float: left;
  margin-right: 16px;
  margin-top: 6px;
}
.tips {
  width: 165px;
  margin: 8px auto;
  font-size: 10px;
}
.task-time-length {
  margin-left: 20px;
  line-height: 20px;
}
.task-time-length span {
  color: #409eff;
}
</style>