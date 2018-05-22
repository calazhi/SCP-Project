<template>
  <div class="add-dialogs">
    <el-dialog :title="senMessage?'修改节目':'添加节目'" :visible="show" width="1142px" center @close="closeEvent()" top="4vh">
      <div>
        <el-form :model="ruleFormadd" :rules="rulesadd" ref="ruleFormadd" label-width="100px" class="demo-ruleForm">
          <el-form-item style='display:inline-block;margin-left:42px' label=" 节目名称" prop="itemName">
            <el-input style="width:300px" v-model.trim="ruleFormadd.itemName" placeholder="字符长度不能超过32个" :maxlength="32"></el-input>
          </el-form-item>
          <el-form-item style='display:inline-block' label="播放时间/秒" prop="itemTime">
            <el-input style="width:300px" v-model.number="ruleFormadd.itemTime" placeholder="播放时间必须在一分钟到一周的范围内" :maxlength="32"></el-input>
          </el-form-item>
          <p class="form-tip">提示信息:同一个节目不能添加多个音频、视频
          </p>
          <el-row :gutter="20" style="margin-top:15px">
            <el-col :span="7">
              <el-form-item style='display:inline-block;margin-left:42px' label="选择模板" prop="itemStyle">
                <el-select style="width:150px" v-model="ruleFormadd.itemStyle" @change="changeValue">
                  <el-option v-for="(item,index) in backStage" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item style='display:inline-block' label="选择分辨率" prop="resolutionValue">
                <el-select style="width:150px" v-model="ruleFormadd.resolutionValue" @change="changeResolution" placeholder="1920X1080">
                  <el-option v-for="(item,index) in resolutionOptions" :key="index" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item v-if="!senMessage" class="equipmentValue-style" label="信息发布控制器" prop="equipmentValue">
                <el-select v-model="ruleFormadd.equipmentValue" multiple placeholder="请选择" :disabled='disabled'>
                  <el-option v-for="item in options" :key="item.deviceID" :label="item.deviceName" :value="item.deviceID">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="senMessage" class="equipmentValue-style" label="信息发布控制器" prop="editEquipmentValue">
                <el-input v-model="ruleFormadd.editEquipmentValue" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <div class="grid-content" style="min-height:10px"></div>
            </el-col>
          </el-row>
          <template>
            <div style="overflow:hidden;text-align: center">
              <div class="content">
                <div class="little-box" @click="onShowCustom(item)" v-for="(item,index) in backStageInside" :key="index" :style="{ 'width': item.width/xRate+ 'px', 'height': item.height/yRate+ 'px', 'left': item.positionX/xRate+ 'px', 'top': item.positionY/yRate+ 'px'}">
                  <p class="item-box" v-if="item.isShowText">
                    {{item.childWords}}
                  </p>
                  <p class="item-box" v-else>
                    点击添加素材
                  </p>
                </div>
              </div>
            </div>
          </template>
          <el-form-item class="item-button">
            <el-button style="margin-right:20px" type="primary" @click="onSubmitForm('ruleFormadd')">确定</el-button>
            <el-button @click="resetForm('ruleFormadd')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <custom :show="showaddDialog" @closeDialog2="closeCustom" @showdioalogmessage="showdioalogmessage" @showmessage="showmessage" :senSonMessage="sonAll"></custom>
  </div>
</template>
<script>
import { getScreenConfigData, postItemAddData, getItemMessageData, postEditorItemData, getChooseEquipmentData, getResolutionData } from '../apis/index'
import custom from './Custom'
export default {
  name: 'material',
  components: { custom },
  props: {
    show: {
      type: Boolean,
      required: true,
      default () {
        return false
      }
    },
    senMessage: {
      type: String,
      required: true,
      default () {
        return ''
      }
    },
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      deviceId: '',
      patchStore: [],
      disabled: false,
      terminalList: [],
      options: [],
      resolutionOptions: [],
      imageWidth: '1920',
      imageHeight: '1080',
      itemId: '',
      selectId: 1,
      getSenMessage: '',
      sonAll: {
        sonId: '',
        typeId: ''
      },
      xRate: 1920 / 960,
      yRate: 1920 / 540,
      ruleFormadd: {
        itemName: '',
        itemTime: '',
        itemStyle: 1,
        resolutionValue: '1920X1080',
        equipmentValue: [],
        editEquipmentValue: ''
      },
      rulesadd: {
        itemName: [
          { required: true, message: '请输入节目名称', trigger: 'blur' }
        ],
        itemTime: [
          { required: true, validator: this.checkPlayTime, trigger: 'blur' }
        ],
        itemStyle: [
          { required: true, message: '', trigger: 'blur' }
        ],
        resolutionValue: [
          { required: true, message: '', trigger: 'blur' }
        ],
        equipmentValue: [
          { required: true, message: '请选择信息发布控制器', trigger: 'blur' }
        ],
        editEquipmentValue: [
          { required: true, message: '请选择信息发布控制器', trigger: 'blur' }
        ]
      },
      currentObj: '',
      boxObj: '',
      backStage: [],
      backStageInside: [],
      showaddDialog: false,
      activeItemId: ''
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.queryData()
        this.onChooseEquipment()
        this.getResolution()
        if (!this.isAdd) {
          this.disabled = true // 编辑
        } else {
          this.disabled = false // 添加
        }
      }
    }
  },
  methods: {
    // 获取分辨率
    getResolution () {
      getResolutionData({}).then(res => {
        if (res.data.code === '00000') {
          this.resolutionOptions = res.data.data
        }
      }).catch(() => {
      })
    },
    // 生成屏幕配置样式
    queryData () {
      getScreenConfigData({
      }).then(res => {
        if (res.data.code === '00000') {
          if (res.data.data && res.data.data.length) {
            this.backStage = res.data.data
            this.backStageInside = res.data.data[this.selectId - 1].config// 改变当前模板的样式
            if (!this.isAdd) {
              this.getSenMessage = this.senMessage
              this.itemId = this.senMessage
              this.getIdMessage()
            }
          } else {
            this.backStage = []
          }
        } else {
          this.backStage = []
          this.$message({
            showClose: true,
            message: '数据加载失败',
            type: 'error'
          })
        }
      }).catch(() => {
      })
    },
    // 根据id获取节目信息
    getIdMessage () {
      getItemMessageData({ id: this.getSenMessage }).then(res => {
        if (res.data.code === '00000') {
          this.ruleFormadd.editEquipmentValue = res.data.data.deviceName
          this.ruleFormadd.itemName = res.data.data.programName
          this.ruleFormadd.itemTime = res.data.data.page.playTime
          this.backStageInside = res.data.data.page.windowsList
          this.imageWidth = res.data.data.imageWidth
          this.imageHeight = res.data.data.imageHeight
          this.ruleFormadd.resolutionValue = this.imageWidth + 'X' + this.imageHeight
          this.deviceId = res.data.data.deviceId
          this.backStage.forEach(elment => {
            if (elment.id === res.data.data.page.id) {
              elment.config = Object.assign(elment.config, res.data.data.page.windowsList)
            }
          })
          this.selectId = res.data.data.page.id
          this.ruleFormadd.itemStyle = res.data.data.page.id
          this.backStageInside.forEach(element => {
            // element['isShowText'] = true
            this.$set(element, 'isShowText', true)
          })
        } else {
          this.$message({
            showClose: true,
            message: '数据加载失败',
            type: 'error'
          })
        }
      }).catch(() => {
      })
    },
    // 节目获取主设备
    onChooseEquipment () {
      getChooseEquipmentData({ isOnline: true }).then(res => {
        if (res.data.code === '00000') {
          this.options = res.data.data
          if (res.data.data && res.data.data.length) {
            if (this.isAdd) {
              this.ruleFormadd.equipmentValue = []
              this.ruleFormadd.equipmentValue.push(res.data.data[0].deviceID)
              this.patchStore = []
              this.patchStore.push(res.data.data[0].deviceID)
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 重置按钮
    resetForm (formNameadd) {
      this.$refs[formNameadd].clearValidate()
      if (this.isAdd) {
        this.ruleFormadd.equipmentValue = []
        this.ruleFormadd.equipmentValue = this.patchStore
      }
      this.ruleFormadd.itemName = ''
      this.ruleFormadd.itemTime = ''
      this.sonAll.sonId = ''
      this.sonAll.typeId = ''
      this.getSenMessage = ''
      this.backStage.forEach((item) => {
        item.config.forEach((elment, index) => {
          this.$set(elment, 'isShowText', false)
        })
      })
    },
    // 提交按钮
    onSubmitForm (formName) {
      this.terminalList = []
      if (this.ruleFormadd.equipmentValue.length) {
        for (let i = 0; i < this.ruleFormadd.equipmentValue.length; i++) {
          this.terminalList.push({ 'terminalNo': this.ruleFormadd.equipmentValue[i] })
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let times = 0
          this.backStage.forEach((item) => {
            if (item.id === this.selectId) {
              item.config.forEach((elment, index) => {
                if (elment.isShowText) {
                  times++
                }
              })
            }
          })
          if (times === this.backStageInside.length) {
            if (!this.isAdd) {
              this.editItem()
            } else {
              this.additem()
            }
          } else {
            this.$message({
              showClose: true,
              message: '屏幕分区素材不能为空',
              type: 'error'
            })
          }
        } else {
          return false
        }
      })
    },
    // 节目添加
    additem () {
      let param = {
        programName: this.ruleFormadd.itemName,
        imageWidth: this.imageWidth,
        imageHeight: this.imageHeight,
        terminalList: this.terminalList,
        page: {
          playTime: this.ruleFormadd.itemTime,
          id: this.selectId,
          windowsList: this.backStageInside
        }
      }
      postItemAddData(param).then(res => {
        if (res.data.code === '00000') {
          this.$emit('showstate')
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
          this.$emit('closeDialog')
          this.resetForm('ruleFormadd')
        } else {
          this.$message({
            showClose: true,
            message: res.data.message ? res.data.message : '添加失败',
            type: 'error'
          })
        }
      }).catch(() => {
      })
    },
    // 编辑节目
    editItem () {
      let param = {
        id: this.itemId,
        programName: this.ruleFormadd.itemName,
        imageWidth: this.imageWidth,
        imageHeight: this.imageHeight,
        deviceId: this.deviceId,
        page: {
          playTime: this.ruleFormadd.itemTime,
          id: this.selectId,
          windowsList: this.backStageInside
        }
      }
      postEditorItemData(param).then(res => { // 提交编辑好的节目
        if (res.data.code === '00000') {
          this.$emit('showstate')
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
          this.$emit('closeDialog')
          this.resetForm('ruleFormadd')
        } else {
          this.$message({
            showClose: true,
            message: res.data.message ? res.data.message : '修改失败',
            type: 'error'
          })
        }
      }).catch(() => {
      })
    },
    // 切换模板
    changeValue (value) {
      this.ruleFormadd.itemStyle = value
      this.selectId = value
      this.backStageInside = this.backStage[value - 1].config
    },
    // 切换分辨率
    changeResolution (value) {
      let resArray = value.split('x')
      this.imageWidth = resArray[0]
      this.imageHeight = resArray[1]
    },
    // 关闭按钮
    closeEvent () {
      this.getSenMessage = ''
      this.resetForm('ruleFormadd')
      this.$emit('closeDialog')
    },
    // 点击添加节目
    onShowCustom (item) {
      if (!this.isAdd) {
        this.sonAll.sonId = this.getSenMessage
        this.sonAll.typeId = item.id
      } else {
        this.sonAll.sonId = ''
        this.sonAll.typeId = ''
      }
      this.currentObj = item
      this.activeItemId = item.id
      this.showaddDialog = true
    },
    // 接收来自子组件的关闭命令
    closeCustom () {
      this.activeItemId = ''
      this.showaddDialog = false
      this.sonAll.sonId = ''
      this.sonAll.typeId = ''
    },
    // 把子组件的下拉素材选中信息放在当前点击添加节目区域里
    showmessage (mdata) {
      this.backStage.forEach(e => {
        if (e.id === this.selectId) {
          e.config.forEach(elment => {
            if (elment.id === this.currentObj.id) {
              elment['childWords'] = mdata
              this.$set(elment, 'isShowText', true)
            }
          })
        }
      })
    },
    // 接收来自子组件页面中的post参数
    showdioalogmessage (dioalogdata) {
      this.backStage.forEach((item) => {
        if (item.id === this.selectId) {
          item.config.forEach((elment, index) => {
            if (elment.id === this.activeItemId) {
              this.backStageInside[index] = Object.assign(this.backStageInside[index], dioalogdata)
            }
          })
        }
      })
      this.activeItemId = ''
      this.showaddDialog = false
    },
    // 字体大小
    checkPlayTime (rule, value, callback) {
      if (value === '') {
        return callback(new Error('播放时间不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value >= 60 && value <= 604800) {
            callback()
          } else {
            callback(new Error('播放时间必须在一分钟到一周的范围内'))
          }
        }
      }, 100)
    }
  }
}
</script>
<style lang="less" scoped>
.choose-style {
  margin-right: 12px;
  margin-left: 22px;
}
.form-tip {
  display: inline-block;
  margin-left: 62px;
  color: #f56c6c;
}
.content {
  display: inline-block;
  width: 960px;
  height: 540px;
  margin-top: 20px;
  border: 1px solid gray;
  position: relative;
  .little-box {
    position: absolute;
    border: 1px solid #409eff;
    text-align: center;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    .item-box {
      width: auto;
      height: auto;
      display: inline-block;
    }
  }
}
.item-button {
  text-align: center;
  margin-left: -100px;
  margin-top: 15px;
}
</style>
<style lang="less">
.add-dialogs {
  .el-dialog--center .el-dialog__body {
    text-align: left;
  }
  .equipmentValue-style {
    display: inline-block;
    .el-form-item__label {
      width: 120px !important;
    }
    .el-form-item__content {
      margin-left: 120px !important;
    }
  }
}
</style>
