<template>
  <el-dialog :visible.sync="dialogFormVisible" width="950px" :before-close="onCloseDialog">
    <div slot="title">
      <span>定时任务{{ title }}</span>
    </div>
    <el-form ref="taskForm" :model="taskForm" :rules="rules" label-width="90px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="任务名称" prop="broadcastName">
            <el-input v-model.trim="taskForm.broadcastName" auto-complete="off" :maxlength="20"></el-input>
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
          <input @change="readFacePic" class="upload-pic-input" ref="uploadFacePicInput" type="file" accept="image/jpeg">
        </form>
      </el-row>
      <el-row>
        <div class="ca-container clearfix">
          <div class="left-con">
            <el-tree ref="tree" node-key="id" :data="treeData" :props="defaultProps" default-expand-all :expand-on-click-node="true" show-checkbox :default-checked-keys="InitTreeChecked">
            </el-tree>
          </div>
          <div class="right-con">
            <el-table ref="multipleTable" :data="sceneList" tooltip-effect="dark" max-height="223" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column label="场景名称" width="140" prop="sceneName">
                <template slot-scope="scope">{{ scope.row.sceneName }}</template>
              </el-table-column>
              <el-table-column label="更新日期" width="190" prop="updateTime">
                <template slot-scope="scope">{{ scope.row.updateTime }}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-row>
      <el-row>
        <el-col :span="10" v-if="false">
          <el-form-item label="结束日期" prop="endTime">
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="启动时间" prop="dailyStartTime">
            <el-time-picker class="datepick" v-model="taskForm.dailyStartTime" :editable="false" placeholder="选择启动时间" value-format="HH:mm:ss" v-if="timePickShow">
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="终止时间" prop="dailyEndTime">
            <el-time-picker class="datepick" v-model="taskForm.dailyEndTime" :editable="false" placeholder="选择终止时间" value-format="HH:mm:ss" v-if="timePickShow">
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <p class="task-time-length"> 预计任务时长 :
            <span> {{ taskTimeLength }}</span>
          </p>
          <p class="task-time-length"> 实际任务时长 :
            <span> {{ realTimeLength }} </span>
          </p>
        </el-col>
        <el-col :span="20" v-if="false">
          <el-form-item label="单次播放" prop="startupTime">
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="重复周期" prop="duplicateIds">
          <el-checkbox-group v-model="taskForm.duplicateIds" @change="duplicateChange" :disabled="checkboxGroupDisable">
            <el-checkbox label="0" name="type" ref="everyday" :checked="everyDayChecked" @change="handleEvdchange">每天</el-checkbox>
            <el-checkbox label="7" name="type" :disabled="weekDaydisabled">星期日</el-checkbox>
            <el-checkbox label="1" name="type" :disabled="weekDaydisabled">星期一</el-checkbox>
            <el-checkbox label="2" name="type" :disabled="weekDaydisabled">星期二</el-checkbox>
            <el-checkbox label="3" name="type" :disabled="weekDaydisabled">星期三</el-checkbox>
            <el-checkbox label="4" name="type" :disabled="weekDaydisabled">星期四</el-checkbox>
            <el-checkbox label="5" name="type" :disabled="weekDaydisabled">星期五</el-checkbox>
            <el-checkbox label="6" name="type" :disabled="weekDaydisabled">星期六</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row>

      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="onSave" :loading="saveLoading">保 存</el-button>
      <el-button @click="onCloseDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>

import { addTimingTask, getSceneList, getTaskDetail, updateRealtimeTask } from '@/views/BroadcastApp/apis/index.js'
import { formatDateTime, validPositiveInt, validTaskName, secondToDate } from '@/views/BroadcastApp/assets/js/validate.js'
import { listDeviceList } from '@/views/BroadcastApp/assets/js/list_devices.js'
import { LOG_TAG } from '@/views/BroadcastApp/assets/js/index.js'
import AsyncImg from './AsyncImg'
import defaultPicture from '@/views/BroadcastApp/assets/images/default_picture.png'

export default {
  components: {
    AsyncImg
  },
  computed: {
    taskTimeLength () {
      // 根据所选场景及重复次数计算的任务时长
      let scenesChoose = this.chooseScene
      let scenesTimeLength = 0
      scenesChoose.forEach((item) => {
        scenesTimeLength += item.timeLength
      })
      let repetitions = this.taskForm.repetitions
      if (!isNaN(repetitions)) {
        this.projTaskTime = repetitions * scenesTimeLength
        return secondToDate(repetitions * scenesTimeLength)
      }
    },
    realTimeLength () {
      // 根据启动和终止时间计算的任务时长
      let start = this.taskForm.dailyStartTime
      let end = this.taskForm.dailyEndTime
      let dailyStartTime = new Date('January 10,2018' + ' ' + start).getTime()
      let dailyEndTime = new Date('January 10,2018' + ' ' + end).getTime()
      let realTime = (dailyEndTime - dailyStartTime) / 1000
      if (start && end) {
        if (realTime > this.projTaskTime) {
          return secondToDate(this.projTaskTime)
        } else {
          return realTime > 0 ? secondToDate(realTime) : secondToDate(0)
        }
      } else {
        return secondToDate(0)
      }
    }
  },
  mounted: function () {
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
      pageSize: 10,
      currentPage: 1,
      taskForm: {
        broadcastName: '',
        repetitions: '',
        taskLevel: '',
        broadcastType: 1,
        startupTime: '',
        endTime: '',
        dailyStartTime: '',
        dailyEndTime: '',
        duplicateIds: [],
        sceneIds: [],
        recovery: 1,
        createUser: 'test',
        taskPicName: '',
        taskPicBase64: '',
        picUrl: ''
      },
      xmlFile: '',
      saveLoading: false,
      faceImg: '',
      broadcastId: '',
      searchKey: '',
      loadable: true,
      defaultOpenKeys: [1, 2],
      startupTimeDisable: false,
      checkboxGroupDisable: false,
      treeData: [],
      InitTreeChecked: [],
      defaultProps: {
        id: 'id',
        children: 'children',
        label: 'label'
      },
      chooseScene: [],
      sceneList: [
      ],
      sceneTotal: 0,
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
          { required: true, message: '请输入整数1~20 (数字越小代表等级越高)', trigger: 'blur' },
          { validator: taskLevelPass, trigger: 'blur' }
        ],
        dailyStartTime: [
          { required: true, message: '请输入启动时间', trigger: 'blur' }
        ],
        dailyEndTime: [
          { required: true, message: '请输入终止时间', trigger: 'blur' }
        ],
        duplicateIds: [
          { required: true, message: '请选择重复周期', trigger: 'blur' }
        ]
      },
      chooseTasks: [],
      taskDatas: [],
      chooseTasks2: [],
      checkAll: false,
      everyDayChecked: false,
      weekDaydisabled: false,
      sceneChooseList: [],
      projTaskTime: 0,
      timePickShow: false
    }
  },
  methods: {
    /**
     * @description 获取场景列表
     */
    getSceneData: function () {
      let condition = {}
      condition.pageNo = 0
      condition.pageSize = 0
      condition.searchKey = ''
      getSceneList(Object.assign({}, condition))
        .then(res => {
          if (res.data.code === '00000') {
            this.sceneTotal = res.data.data.total
            let tableD = res.data.data.scene
            tableD.forEach((item, index) => {
              item.updateTime = item.updateTime.substr(0, 10)
            })
            this.sceneList = tableD
            let sceneChooseList = this.sceneChooseList
            this.sceneList.forEach(row => {
              sceneChooseList.forEach((it, idx) => {
                if (it.uuid === row.uuid) {
                  this.$nextTick(() => {
                    this.$refs['multipleTable'].toggleRowSelection(row, true)
                  })
                }
              })
            })
          }
        }).catch(err => {
          console.warn(LOG_TAG + err)
        })
    },
    /**
     * @description 分页组件单页总数变化
     * @param {Number} params 选择的单页总数的值
     */
    handleSizeChange: function (params) {
      this.pageSize = params
      this.currentPage = 1
      this.getSceneData()
    },
    /**
     * @description 分页组件当前页变化
     * @param {Number} params 选择当前页的值
     */
    handleCurrentChange: function (params) {
      this.currentPage = params
      this.getSceneData()
    },
    /**
     * @description 打开对话框
     */
    openDialog: function () {
      if (this.treeData.length === 0) {
        this.getDeviList()
      }
      this.dialogFormVisible = true
      if (this.sceneList.length === 0) {
        this.getSceneData()
      }
      setTimeout(() => {
        this.timePickShow = true
      }, 300)
    },
    /**
     * @description 重置form并关闭对话
     */
    onCloseDialog: function () {
      this.weekDaydisabled = false
      this.everyDayChecked = false
      this.$refs['taskForm'].resetFields()
      this.$refs['tree'].setCheckedNodes([])
      this.$refs['multipleTable'].clearSelection()
      this.dialogFormVisible = false
      this.sceneChooseList = []
      this.chooseScene = []
      this.onResetImg(1)
      this.timePickShow = false
    },
    /**
     * @description 获取设备列表
     */
    getDeviList: listDeviceList,
    /**
     * @description 场景列表选项监听
     */
    handleSelectionChange (val) {
      this.chooseScene = val
    },
    /**
     * @description 验证时间合理性
     */
    validDailyTime: function () {
      let dailyStartTime = new Date('January 20,2018' + ' ' + this.taskForm.dailyStartTime).getTime()
      let dailyEndTime = new Date('January 20,2018' + ' ' + this.taskForm.dailyEndTime).getTime()
      if (dailyEndTime - dailyStartTime < 60000 * 5) { // 时间差至少5分钟
        this.$message({
          message: '终止时间必须大于启动时间5分钟以上',
          type: 'warning'
        })
        return false
      } else {
        return true
      }
    },
    /**
     * @description 新增任务保存
     */
    onSave: function () {
      let treeChecked = [].concat(this.$refs['tree'].getCheckedNodes(true))
      let newPlayAreaIds = []
      let parentIds = []
      let deciIdx = 0
      // 将已选的树节点信息转化为接口参数规定的数据结构
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
        if (valid) {
          if (treeChecked.length < 1) {
            this.$message({
              type: 'warning',
              message: '请选择播放区域'
            })
            return false
          } else if (!this.validDailyTime()) {
            return false
          } else if (this.taskForm.duplicateIds.length < 1) {
            this.$message({
              type: 'warning',
              message: '请选择重复周期'
            })
            return false
          } else {
            let chooseScene = this.chooseScene
            if (chooseScene.length < 1) {
              this.$message({
                type: 'warning',
                message: '请选择场景'
              })
              return false
            } else {
              let params = Object.assign({}, this.taskForm)
              let dateT = formatDateTime(new Date(), 'date')
              // 格式化日期字段
              if (typeof params.dailyStartTime === 'object') {
                params.dailyStartTime = formatDateTime(params.dailyStartTime, 'time')
              }
              if (typeof params.dailyEndTime === 'object') {
                params.dailyEndTime = formatDateTime(params.dailyEndTime, 'time')
              }
              if (params.dailyStartTime.length < 10) {
                params.dailyStartTime = dateT + ' ' + params.dailyStartTime
              }
              if (params.dailyEndTime.length < 10) {
                params.dailyEndTime = dateT + ' ' + params.dailyEndTime
              }
              params.endTime = params.dailyEndTime
              params.startupTime = params.dailyStartTime
              params.sceneIds = []
              chooseScene.forEach((item, index) => {
                params.sceneIds.push(item.uuid)
              })
              params.repetitions = parseInt(this.taskForm.repetitions)
              params.taskLevel = parseInt(this.taskForm.taskLevel)
              if (params.duplicateIds[0] === '0') {
                params.duplicateIds = ['1', '2', '3', '4', '5', '6', '7']
              }
              // 编辑接口的参数
              let paramsEdit = Object.assign({}, params, {
                'broadcastId': this.broadcastId,
                xmlFile: this.xmlFile
              })
              if (this.title === '添加') {
                this.saveLoading = true
                // 调用任务新增接口
                addTimingTask(Object.assign({}, params)).then(res => {
                  if (res.data.code === '00000') {
                    this.$emit('reflushData')
                    this.$message({
                      message: '新增任务成功',
                      type: 'success'
                    })
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
                  console.warn(LOG_TAG + err.response.data.message)
                  this.saveLoading = false
                })
              } else if (this.title === '编辑') {
                this.saveLoading = true
                // 调用修改接口
                updateRealtimeTask(paramsEdit).then(res => {
                  if (res.data.code === '00000') {
                    this.$emit('reflushData')
                    this.$message({
                      message: '编辑成功',
                      type: 'success'
                    })
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
                  console.warn(LOG_TAG + err.response.data.message)
                  this.saveLoading = false
                })
              }
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
     * @description 选择每天或者星期几
     */
    handleEvdchange: function () {
      this.taskForm.duplicateIds = []
      this.everyDayChecked = !this.everyDayChecked
    },
    /**
     * @description 重复周期选项发生变化
     */
    duplicateChange: function () {
      if (this.taskForm.duplicateIds.length === 7) {
        this.taskForm.duplicateIds = ['0']
        this.weekDaydisabled = true
        this.everyDayChecked = true
      } else {
        if (this.everyDayChecked === true) {
          this.weekDaydisabled = true
          this.taskForm.duplicateIds = ['0']
        } else {
          this.weekDaydisabled = false
        }
      }
    },
    /**
     * @description 初始化弹出框任务详细信息
     * @param {Object} taskInfo
     */
    initFormData: function (taskInfo = {}) {
      let _task = taskInfo
      getTaskDetail(_task).then(res => {
        if (res.data.code === '00000') {
          let result = res.data.data[0]
          this.sceneChooseList = []
          this.sceneChooseList = result.scene
          this.broadcastId = result.uuid
          this.taskForm.broadcastName = result.broadcastName
          this.taskForm.repetitions = result.repetitions
          this.taskForm.taskLevel = result.taskLevel
          this.taskForm.dailyStartTime = result.dailyStartTime.substring(11)
          this.taskForm.dailyEndTime = result.dailyEndTime.substring(11)
          this.xmlFile = result.xmlFile
          let duplicateIds = result.duplicateId.split(',')
          this.faceImg = result.picUrl
          this.taskForm.picUrl = result.picUrl
          if (duplicateIds.length === 7) {
            duplicateIds = ['0']
            this.weekDaydisabled = true
            this.everyDayChecked = true
          }
          this.taskForm.duplicateIds = duplicateIds
          // 初始化组织树
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
          // 设置已选场景
          this.sceneList = []
          this.getSceneData()
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        }
      }).catch(err => {
        console.warn(LOG_TAG + err)
      })
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
  width: 50%;
  height: 248px;
  display: flex;
  flex-flow: column;
  overflow-y: auto;
  border-right: 1px solid #dddee1;
  overflow-x: auto;
}
.right-con {
  display: flex;
  flex-flow: column;
  float: right;
  width: 46%;
  height: 224px;
  overflow-y: auto;
  box-sizing: border-box;
  border: 1px solid #dddee1;
  margin-top: 14px;
  border-bottom: 0 none;
}
.pagination-con {
  padding-left: 10px;
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