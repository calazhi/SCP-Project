<template>
  <el-dialog :title="id ? '修改联动规则':'新增联动规则'" :visible="show" @close="closeDialogEdit" width="70%">
    <el-form ref="ruleForm" :model="ruleForm" :rules="ruleFormRules" :show-message="true" label-width="80px">
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <el-form-item label="设备分类" prop="deviceType">
            <el-select v-if="id" v-model="ruleForm.deviceType" clearable placeholder="请选择设备分类" @clear="clear" :disabled="isDisabled">
            </el-select>
            <el-select v-else v-model="ruleForm.deviceType" clearable placeholder="请选择设备分类" @change="getEvent" @clear="clear">
              <el-option v-for="item in deviceTypes" :key="item.id" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <el-form-item label="事件类型" prop="eventType">
            <el-select v-if="id" v-model="ruleForm.eventTypeName" clearable placeholder="请选择事件类型" :disabled="isDisabled">
            </el-select>
            <el-select v-else v-model="ruleForm.eventType" clearable placeholder="请选择事件类型">
              <el-option v-for="item in eventOptions" :key="item.id" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <el-form-item label="触发设备" prop="eventSourceCode">
            <template v-if="id">
              <el-input placeholder="选择设备" v-model="deviceName" :disabled="isDisabled">
              </el-input>
            </template>
            <template v-else>
              <el-input class="device-input" v-model="deviceInputName" @click.native.prevent="onDeviceOpen" placeholder="请选择设备"></el-input>
            </template>
          </el-form-item>
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <el-form-item label="是否有序" prop="isSequential">
            <el-select v-if="id" v-model="ruleForm.isSequential" clearable placeholder="请选择顺序" :disabled="isDisabled">
              <el-option label="是" :value="true">是</el-option>
              <el-option label="否" :value="false">否</el-option>
            </el-select>
            <el-select v-else v-model="ruleForm.isSequential" clearable placeholder="请选择顺序">
              <el-option label="是" :value="true">是</el-option>
              <el-option label="否" :value="false">否</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="linkage-rule">
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="linkage-method">
            <h3>联动方式</h3>
            <div>
              <ul class="event-list">
                <li v-for="(item, index) of linkageList" :key="item.id" :class="{'active': linkageActiveIndex===index}" @click="onSelectLinkageType(index)">
                  <span>{{item.name}}</span>
                  <div class="linkage-type-switch">
                    <el-switch v-model="linkageOpenIndexs[index]" :index="index" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    <span v-show="ruleForm.isSequential" class="btn-up" @click.stop="btnUpClick(index)">
                      <i class="el-icon-caret-top"></i>
                    </span>
                    <span v-show="ruleForm.isSequential" class="btn-down" @click.stop="btnDownClick(index)">
                      <i class="el-icon-caret-bottom"></i>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
          <div class="resource-table-content">
            <door-linkage :sourceTableData="sourceTableData" :modifyData="this.triggers[linkageActiveIndex] || []" @onUpdateData="handleUpdateData" :code="linkageList.length ? linkageList[linkageActiveIndex].code : ''">
            </door-linkage>
          </div>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onHandleSave">保 存</el-button>
      <el-button @click="closeDialogEdit">取 消</el-button>
    </div>
    <tree-component :is-check="true" :data="treeResult" :code="code" :show="deviceDialog" ref="ruleTree" @closeDeviceDialog="closeDeviceDialog"></tree-component>
  </el-dialog>
</template>
<script>
import TreeComponent from './Tree.vue'
import DoorLinkage from './DoorLinkage.vue'
import { getLinkageRuleDeviceData, getLinkageRuleByCodeData, getSourceTreeData, getLinkageModeData, postLinkageRuleSaveData, getLinkageRuleInfoData, postLinkageRuleUpdateData } from '../apis/index'
export default {
  name: 'ruleDialog',
  components: {
    TreeComponent,
    DoorLinkage
  },
  props: {
    show: {
      required: true,
      type: Boolean,
      default () {
        return false
      }
    },
    id: {
      type: String,
      defautl () {
        return ''
      }
    }
  },
  data () {
    return {
      ruleFormRules: {
        eventType: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
        deviceType: [{ required: true, message: '请选择设备', trigger: 'change' }],
        isSequential: [{ required: true, message: '请选择顺序', trigger: 'change' }]
      },
      isDisabled: false,
      treeResult: [],
      deviceTypes: [],         // 设备类型分类
      eventOptions: [],        // 事件类型分类
      ruleForm: {
        deviceType: '',        // 设备类型
        triggerId: '',         // 当前行id
        isSequential: false,   // 是否有序
        eventType: '',         // 事件类型
        eventSourceCode: ''    // 当前设备的code码
      },
      sourceTableData: [],
      linkageList: [],         // 联动方式列表
      linkageActiveIndex: 0,   // 选中项
      linkageOpenIndexs: [],   // 开关打开的index
      triggers: [],            // 联动参数集合
      ruleParams: {            // 修改联动参数集合
        triggers: []
      },
      deviceName: '',          // 设备名称
      disabled: true,
      code: '',                // 当前设备类型code码
      deviceDialog: false,     // 触发设备弹窗显示
      deviceInputName: ''      // 选中触发设备名称
    }
  },
  methods: {
    // 初始化数据
    initData () {
      getLinkageModeData().then(rs => { // 获取联动方式列表
        if (rs.data.code === '00000') {
          this.linkageList = rs.data.data || []
          this.triggers.length = this.linkageOpenIndexs.length = this.linkageList.length
          getLinkageRuleDeviceData().then(res => {  // 当页面加载时获取联动规则中的设备类型
            if (res.data.code === '00000') {
              this.deviceTypes = res.data.data
              if (this.id) {
                let params = { triggerId: this.id }
                getLinkageRuleInfoData(params).then(rs => { // 点击修改联动规则时通过triggerId获取当前行数据
                  if (rs.data.code === '00000') {
                    this.ruleParams = rs.data.data
                    let ruleParams = this.ruleParams
                    let triggers = ruleParams.triggers || []
                    this.isDisabled = true
                    this.getEvent(ruleParams.deviceType, ruleParams)
                    if (ruleParams.deviceName) { // 打开修改页面时将所有的以保存数据全部填回
                      this.$nextTick(() => {
                        this.deviceName = ruleParams.deviceName
                        this.ruleForm = {
                          eventTypeName: ruleParams.eventTypeName,
                          eventType: ruleParams.eventType,
                          eventSourceCode: ruleParams.eventSourceCode,
                          isSequential: ruleParams.isSequential,
                          deviceType: ruleParams.deviceType,
                          triggerRuleId: this.id
                        }
                        this.linkageList.forEach((item, index) => {
                          item.order = this.linkageList.length
                          triggers.forEach(subItem => { // 为当前接收的联动方式排序
                            if (item.value === subItem.method) {
                              item.order = subItem.order
                            }
                          })
                        })
                        this.linkageList.sort((a, b) => a.order - b.order)
                        this.linkageList.forEach((item, index) => {
                          triggers.forEach(subItem => { // 当前联动方式下对应的设备列表以及广播内容
                            if (item.value === subItem.method) {
                              this.linkageOpenIndexs[index] = true
                              this.triggers[index] = JSON.parse(subItem.params.sourceLists)
                            }
                          })
                        })
                      })
                    }
                  }
                })
              }
            }
          })
        }
      })
    },
    // 修改
    handleUpdateData (data) {
      let linkageActiveIndex = this.linkageActiveIndex
      this.triggers[linkageActiveIndex] = data
    },
    // 打开触发设备弹窗
    onDeviceOpen () {
      this.deviceDialog = true
    },
    // 关闭触发设备弹窗
    closeDeviceDialog (data) {
      this.deviceDialog = false
      if (data) {
        this.deviceData = data
        this.deviceInputName = data.map((item) => { return item.deviceName }).join(',')
        this.ruleForm.eventSourceCode = data.map((item) => { return item.deviceID }).join(',')
      }
    },
    // 传递设备获取事件类型
    getEvent (value, editData) {
      if (this.ruleForm.deviceType) {
        this.treeResult = []
        this.eventOptions = []
        this.ruleForm.eventType = ''
        this.ruleForm.eventSourceCode = ''
        this.$refs.ruleTree.clear()
        this.deviceInputName = ''
        this.code = value
        getLinkageRuleByCodeData({ code: value }).then(res => { // 通过code码获取当前事件类型
          if (res.data.code === '00000') {
            this.eventOptions = res.data.data
            this.$nextTick(() => {
              if (editData) this.ruleForm.eventType = editData.eventType
            })
          } else {
            this.eventOptions = []
            this.$message({
              message: res.data.message ? res.data.message : '请求数据失败',
              type: 'error'
            })
          }
        }).catch(err => {
          console.log(err)
        })
        getSourceTreeData({ uuid: '' }).then(res => { // 获取联动规则添加页面组织树
          if (res.data.code === '00000') {
            this.treeResult = [res.data.data]
            this.$nextTick(() => {
              if (this.$refs.tree && editData) {
                this.$refs.tree.setCurrentKey(editData.eventSourceCode)
              }
            })
          } else {
            this.treeResult = []
            this.$message({
              message: res.data.message ? res.data.message : '请求数据失败',
              type: 'error'
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 清空选中
    clearSelect () {
      this.linkageOpenIndexs.length = 0 // 当页面关闭时，开关处于关闭状态
      this.linkageActiveIndex = 0
      this.ruleForm.deviceType = ''
      this.ruleForm.eventType = ''
      this.isDisabled = false
      this.triggers = []
      this.treeResult = []
      this.eventOptions = []
      this.deviceName = ''
      this.ruleForm.eventSourceCode = ''
      this.deviceInputName = ''
      this.$refs.ruleTree.clear()
    },
    // 切换联动规则
    onSelectLinkageType (index) {
      this.linkageActiveIndex = index
    },
    // 点击向上挪动按钮
    btnUpClick (index) {
      if (index === 0) return
      let preItem = this.linkageList.splice(index, 1)
      this.linkageList.splice(index - 1, 0, preItem[0])
      let tempItem = this.triggers.splice(index, 1)
      this.triggers.splice(index - 1, 0, tempItem[0])
      let lastOpenState = this.linkageOpenIndexs[index - 1]
      this.linkageOpenIndexs[index - 1] = this.linkageOpenIndexs[index]
      this.linkageOpenIndexs[index] = lastOpenState
      if (this.linkageActiveIndex === index) {
        this.linkageActiveIndex = index - 1
      } else if (this.linkageActiveIndex === index - 1) {
        this.linkageActiveIndex = index
      }
    },
    // 点击向下挪动按钮
    btnDownClick (index) {
      if (index === this.linkageList.length - 1) return
      let preItem = this.linkageList.splice(index, 1)
      this.linkageList.splice(index + 1, 0, preItem[0])
      let tempItem = this.triggers.splice(index, 1)
      this.triggers.splice(index + 1, 0, tempItem[0])
      let lastOpenState = this.linkageOpenIndexs[index + 1]
      this.linkageOpenIndexs[index + 1] = this.linkageOpenIndexs[index]
      this.linkageOpenIndexs[index] = lastOpenState
      if (this.linkageActiveIndex === index) {
        this.linkageActiveIndex = index + 1
      } else if (this.linkageActiveIndex === index + 1) {
        this.linkageActiveIndex = index
      }
    },
    // 保存
    onHandleSave () {
      if (!this.isDisabled) {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.ruleForm)
            let triggers = []
            this.linkageList.forEach((item, index) => { // 将联动方式添加的所有参数保存
              let trigger = this.triggers[index] || []
              this.linkageOpenIndexs[index] && triggers.push({
                order: index,
                method: item.value,
                to: item.to,
                params: {
                  deviceId: trigger.map(rs => { return rs.deviceID }).join(','),
                  sourceLists: JSON.stringify(trigger)
                  // broadcastUuid: this.broadcastUuid
                }
              })
            })
            let creator = this.username
            params.creator = creator
            params.triggers = triggers
            params.triggers.forEach((item, index) => { item.order = (index + 1) })
            postLinkageRuleSaveData(params).then(res => { // 将所获取到的所有参数保存到数据库
              if (res.data.code === '00000') {
                this.$message({
                  message: '联动规则新增成功',
                  type: 'success'
                })
                this.closeInnerDialog()
                this.clear()
              }
            }).catch(() => {

            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        // 当修改页面打开时，改变修改的参数并保存
        let params = Object.assign({}, this.ruleForm)
        let triggers = []
        this.linkageList.forEach((item, index) => {
          let trigger = this.triggers[index] || []
          if (trigger.length > 0) {
            this.linkageOpenIndexs[index] && triggers.push({
              order: index,
              method: item.value,
              to: item.to,
              params: {
                deviceId: trigger.map(rs => { return rs.deviceID }).join(','),
                sourceLists: JSON.stringify(trigger)
                // broadcastUuid: this.broadcastUuid
              }
            })
          }
        })
        params.triggers = triggers
        params.triggers.forEach((item, index) => { item.order = index + 1 })
        postLinkageRuleUpdateData(params).then(res => {
          if (res.data.code === '00000') {
            this.$message({
              message: '修改联动规则成功',
              type: 'success'
            })
            this.closeInnerDialog()
          }
        }).catch(() => {

        })
      }
    },
    // 清空数据
    clear () {
      this.treeResult = []
      this.eventOptions = []
      // this.$refs.ruleTree.onCheckChange([])
      this.$refs.ruleTree.clear()
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.eventSourceCode = ''
      this.deviceInputName = ''
    },
    // 关闭弹窗
    closeDialog () {
      this.$emit('closeDialog')
      this.$refs['ruleForm'].resetFields()
      this.clearSelect()
      if (!this.id) {
        if (this.$refs.ruleTree) {
          this.$refs.ruleTree.clear()
        }
      }
    },
    // 取消时调用关闭弹窗
    closeDialogEdit () {
      this.$emit('closeDialogEdit')
      this.$refs['ruleForm'].resetFields()
      this.clearSelect()
      if (!this.id) {
        if (this.$refs.ruleTree) {
          this.$refs.ruleTree.clear()
        }
      }
    },
    // 保存成功关闭内层弹窗
    closeInnerDialog () {
      if (!this.id) {
        this.$refs.ruleTree.clear()
      }
      this.clearSelect()
      this.closeDialog()
      this.$refs['ruleForm'].resetFields()
    }
  },
  computed: {
    // 获取当前登录的管理员姓名
    username () {
      let username = localStorage.getItem('login_username')
      return username || this.name || 'admin'
    },
    // 改变列表宽度，控制是否显示广播联动页面
    sWidth () {
      if (this.linkageList[this.linkageActiveIndex] && this.linkageList[this.linkageActiveIndex].code === '08') {
        return 6
      } else {
        return 0
      }
    }
  },
  // 监听当页面传递的值存在时初始化数据
  watch: {
    show (val) {
      if (val) {
        this.initData()
      }
    }
  }
}
</script>
<style scoped lang='less'>
ul {
  list-style-type: none;
  padding: 0;
}
.linkage-rule {
  border: 1px solid #999;
  .linkage-method {
    height: 420px;
    margin: 8px;
    border: 1px solid #999;
    h3 {
      text-align: center;
      line-height: 42px;
      font-size: 20px;
      color: #666;
      font-weight: normal;
    }
    .event-list {
      display: block;
      margin: 0 10px 5px 10px;
      li {
        cursor: pointer;
        text-align: center;
        height: 40px;
        line-height: 38px;
        margin-bottom: 1px;
        font-size: 14px;
        letter-spacing: 3px;
        padding: 0 50px;
        position: relative;
        background: #ccc;
        box-sizing: border-box;
        &:hover,
        &.active {
          background: #409eff;
          color: #fff;
        }
        &:hover {
          background: #2c85dd;
        }
      }
    }
    .linkage-type-switch {
      display: block;
      position: absolute;
      left: 190px;
      top: -2px;
      .btn-up {
        position: absolute;
        top: -7px;
        left: 60px;
        font-size: 20px;
      }
      .btn-down {
        position: absolute;
        top: 12px;
        left: 60px;
        font-size: 20px;
      }
    }
  }
  .resource-table-content {
    height: 420px;
    margin: 8px 8px 8px 0;
    border: 1px solid #999;
  }
}
.hidden-rule {
  height: 1px;
  width: 100px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>