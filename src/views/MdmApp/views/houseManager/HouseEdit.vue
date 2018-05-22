<template>
  <el-dialog :visible.sync="dialogFormVisible" @open="onClearValidate" width="600px">
    <div slot="title">
      <span class="pull-left">{{form.uuid?'房屋编辑':'房屋添加'}}</span>
    </div>
    <el-form ref='form' :model="form" label-width="100px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-popover v-model="orgPopoverVisible" ref="orgPopover" placement="right-start" width="154" trigger="click">
            <div class="org-select-popover">
              <el-tree :data="orgSelectData" :props="orgSelectProps" :expand-on-click-node="false" @node-click="onHouseSelectClick"></el-tree>
            </div>
          </el-popover>
          <el-form-item label="上级组织" prop="orgParentName">
            <el-input v-model="form.orgParentName" readonly auto-complete="off" v-popover:orgPopover :title="form.orgParentName"></el-input>
          </el-form-item>
          <el-form-item label="房屋用途" prop="houseUseFor">
            <el-select v-model="form.houseUseFor" placeholder="请选择房屋用途">
              <el-option v-for="item in houseUseArr" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房产证编号" prop="houseCertificate">
            <el-input v-model.trim="form.houseCertificate" auto-complete="off" :maxlength="100" placeholder="请输入房产证编号"></el-input>
          </el-form-item>
          <el-form-item class="building-area" label="房屋面积" prop="buildingArea">
            <el-input v-model.trim="form.buildingArea" auto-complete="off" :maxlength="30" placeholder="请输入房屋面积"></el-input>
            <span class="unit">平方米</span>
          </el-form-item>
          <el-form-item label="紧急电话" prop="emergencyPhone">
            <el-input v-model.trim="form.emergencyPhone" auto-complete="off" placeholder="请输入紧急联系电话"></el-input>
          </el-form-item>
          <el-form-item label="NC_ID" prop="ncId">
            <el-input v-model.trim="form.ncId" auto-complete="off"  :maxlength="255" placeholder="请输入NC_ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="房屋号" prop="houseNum">
            <el-input v-model.trim="form.houseNum" auto-complete="off" :maxlength="30" placeholder="请输入房屋号"></el-input>
          </el-form-item>
          <el-form-item label="居住人数" prop="residentNum">
            <el-input v-model.trim="form.residentNum" auto-complete="off" :maxlength="30" placeholder="请输入居住人数"></el-input>
          </el-form-item>
          <el-form-item label="土地证编号" prop="landCertificate">
            <el-input v-model.trim="form.landCertificate" auto-complete="off" :maxlength="100" placeholder="请输入土地证编号"></el-input>
          </el-form-item>
          <el-form-item label="楼层" prop="floor">
            <el-input v-model.trim="form.floor" auto-complete="off" :maxlength="30" placeholder="请输入楼层"></el-input>
          </el-form-item>
          <el-form-item label="付款方式" prop="payment">
            <el-select v-model="form.payment" no-data-text="请选择"  placeholder="请选择支付方式">
              <el-option v-for="item in payStationArr" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSave" :loading="isLoading">确 定</el-button>
      <el-button @click="onCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { insertHouse, updateHouse, getHouseType } from '../../apis/house_manager'
import { getOrgTree } from '../../apis/org_manager'
export default {
  props: {
    search: {
      type: Function,
      default: function () { }
    },
    exportOrgNode: {
      type: Object
    }
  },
  data () {
    // 房屋号验证规则
    var houseNumValidator = (rule, value, callback) => {
      if (value === '' || null) {
        callback()
      } else if (typeof (value) === 'string') {
        const isMobile = /^\d{3,4}$/
        if (!isMobile.test(value)) {
          callback(new Error('请输入正确的房屋号!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    // 房屋面积验证规则
    var buildingAreaValidator = (rule, value, callback) => {
      if (value === '' || null) {
        callback()
      } else if (typeof (value) === 'string') {
        if (value < 10000 && value > 0) {
          const isMobile = /^(\d+\.\d{1,4}|\d+)$/
          if (!isMobile.test(value)) {
            callback(new Error('请输入非负数或保留两位小数!'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请输入大于0且小于10000的房屋面积'))
        }
      } else {
        callback()
      }
    }
    // 土地证编号验证规则
    var landCertificateValidator = (rule, value, callback) => {
      if (value === '' || null) {
        callback()
      } else if (typeof (value) === 'string') {
        const isMobile = /^\w+$/
        if (!isMobile.test(value)) {
          callback(new Error('请输入英文和非负整数!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    // 房产证编号验证规则
    var houseCertificateValidator = (rule, value, callback) => {
      if (value === '' || null) {
        callback()
      } else if (typeof (value) === 'string') {
        const isMobile = /^\w+$/
        if (!isMobile.test(value)) {
          callback(new Error('请输入英文和非负整数!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    // 紧急联系电话验证规则
    var emergencyPhoneValidate = (rule, value, callback) => {
      if (value === '' || null) {
        callback()
      } else if (typeof (value) === 'string') {
        const isMobile = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/
        if (!isMobile.test(value)) {
          callback(new Error('请输入正确的手机号码!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    // 居住人数验证
    var residentNumValidate = (rule, value, callback) => {
      if (typeof (value) === 'string' && value.length > 0) {
        if (parseInt(value) <= 99 && parseInt(value) >= 1) {
          const isMobile = /^(-|\+)?\d+$/
          if (!isMobile.test(value)) {
            callback(new Error('只允许输入数字!'))
          } else {
            callback()
          }
        } else {
          callback(new Error('只允许输入1-99的居住人数!'))
        }
      } else {
        callback()
      }
    }
    // 楼层验证
    var floorValidate = (rule, value, callback) => {
      if (typeof (value) === 'string' && value.length > 0) {
        if (parseInt(value) <= 99 && parseInt(value) >= 1) {
          const isMobile = /^(-|\+)?\d+$/
          if (!isMobile.test(value)) {
            callback(new Error('只允许输入数字!'))
          } else {
            callback()
          }
        } else {
          callback(new Error('只允许输入1-99的楼层数!'))
        }
      } else {
        callback()
      }
    }
    return {
      orgPopoverVisible: false,
      orgSelectData: [], // 上级组织选择列表
      orgSelectProps: { // 上级组织树配置属性
        children: 'children',
        label: 'name'
      },
      isLoading: false,
      lastCurrentName: '', // 当前的组织名称
      dialogFormVisible: false, // 显隐dialog
      payStationArr: null, // 支付方式
      houseUseArr: null, // 房屋用途
      form: { // 表单信息
        uuid: null,
        nc: '',
        oldNcId: '',
        orgUuid: null, // 组织uuid
        orgParentName: '', // 上级组织名称
        houseNum: '', // 房屋号
        houseUseFor: '', // 房屋用途code
        residentNum: '', // 居住人数
        houseCertificate: '', // 房产证编号
        landCertificate: '', // 土地证编号
        buildingArea: '', // 房屋面积
        emergencyPhone: '', // 紧急电话
        floor: '', // 楼层
        payment: ''
      },
      rules: { // Form表单字段验证规则
        orgParentName: [ // 上级组织名称验证规则，必填项
          { required: true, message: '请选择上级组织', trigger: 'change' }
        ],
        houseNum: [ // 房屋号验证规则，选填项
          { required: true, message: '请输入3-4位数字', trigger: 'blur' },
          { validator: houseNumValidator, message: '请输入3-4位数字', trigger: 'blur' }
        ],
        buildingArea: [ // 房屋面积验证规则，选填项
          { validator: buildingAreaValidator, message: '请输入大于0且小于10000的正数', trigger: 'blur' }
        ],
        houseUseFor: [ // 房屋用途规则，必填项
          { required: true, message: '请选择房屋用途', trigger: 'blur' }
        ],
        houseCertificate: [ // 房产证编号验证规则，选填项
          { message: '长度需小于 100 个字符', trigger: 'blur' },
          { validator: houseCertificateValidator, message: '房产证编号只允许输入数字或英文', trigger: 'blur' }
        ],
        landCertificate: [ // 土地证编号验证规则，选填项
          { message: '长度需小于 100 个字符', trigger: 'blur' },
          { validator: landCertificateValidator, message: '土地证编号只允许输入数字或英文', trigger: 'blur' }
        ],
        emergencyPhone: [ // 手机号码验证规则，必填项
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: emergencyPhoneValidate, trigger: 'change' }
        ],
        payment: [ // 付款方式，必填项
          { required: true, message: '请选择付款方式', trigger: 'blur' }
        ],
        floor: [ // 楼层验证规则，选填项
          { required: true, message: '请填写楼层数', trigger: 'blur' },
          { validator: floorValidate, trigger: 'blur' }
        ],
        residentNum: [ // 居住人数验证规则，选填项
          { required: true, message: '请填写居住人数', trigger: 'blur' },
          { validator: residentNumValidate, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * @description 开始房屋添加/编辑，添加初始化内容，编辑将内容赋值
     *
     * @param {Object} houseInfo @default {} 房屋信息
     */
    houseEdit: function (houseInfo = {}) {
      console.log(this.houseUseArr)
      // 打开添加或编辑界面，请求组织树信息
      this.getParentOrgList()
      // 添加或编辑时，当前组织节点的名称为信息回显时房屋名称或焦点组织名称或者根节点组织名称
      var orgCurrentName = houseInfo.houseName || this.exportOrgNode.orgName || this.exportOrgNode.rootName
      // 调用字符串截取方法，去除房屋号
      orgCurrentName = orgCurrentName.split('-')
      // 房屋列表每行uuid
      this.form.uuid = houseInfo.uuid || null
      // 房屋列表每行的组织uuid
      this.form.orgUuid = houseInfo.orgUuid || this.exportOrgNode.uuid || this.exportOrgNode.rootUuid
      // 房屋列表每行组织名称上级组织的uuid
      this.form.orgParentUuid = houseInfo.orgParentUuid || ''
      // 快照保存上次保存的组织名称或是当前组织名称
      this.form.orgParentName = this.lastCurrentName || orgCurrentName[0]
      // 房屋号
      this.form.houseNum = houseInfo.houseNum || ''
      // 房屋用途
      this.form.houseUseFor = houseInfo.houseUseFor || this.houseUseArr[0].itemCode
      // 居住人数，最少为1人
      this.form.residentNum = houseInfo.residentNum || '1'
      // 房产证编号为上次保存的快照或为空
      this.form.houseCertificate = houseInfo.houseCertificate || ''
      // 土地证编号为上次保存的快照或为空
      this.form.landCertificate = houseInfo.landCertificate || ''
      // 房屋面积为回显数据或为空
      this.form.buildingArea = houseInfo.buildingArea || null
      // 手机号为回显数据或为空
      this.form.emergencyPhone = houseInfo.emergencyPhone || ''
      this.form.ncId = houseInfo.ncId || ''
      this.form.oldNcId = houseInfo.ncId || ''
      // 楼层数
      this.form.floor = houseInfo.floor || '1'
      // 支付方式
      this.form.payment = houseInfo.payment || this.payStationArr[0].itemCode
      this.dialogFormVisible = true
    },
    /**
     * @description 保存任务信息，确定操作，在添加或者编辑完成时向后台数据库发送请求，完成数据的添加或编辑，返回信息提示，告知用户
     *
     * @param
     */
    onSave: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 禁用按钮 防止重复提交
          this.isLoading = true
          this.dialogFormVisible = false
          var func
          // 调用接口，判断是添加或编辑
          func = this.form.uuid ? updateHouse : insertHouse
          func(Object.assign({}, this.form)).then(res => {
            if (res.data.code === '00000') {
              this.$message({
                message: res.data.data,
                type: 'success'
              })
              // 当返回正确code码时，按钮锁定，模态框关闭，发送成功信息到父组件，以便父组件进行下一步操作
              this.dialogFormVisible = false
              // 保存编辑后改变的组织名称
              this.lastCurrentName = this.form.name
              this.form.oldNcId = this.form.ncId
              this.form.ncId = ''
              this.$emit('successHouseEdit', true)
              this.isLoading = false
            } else {
              // 当返回错误code码时，按钮不锁定，提示用户警告信息
              this.$message({
                message: res.data.data,
                type: 'warning'
              })
              this.isLoading = false
            }
          }).catch(err => {
            // 当服务器发生异常是抓错
            console.log(err)
            this.$message({
              message: '服务器连接异常',
              type: 'warning'
            })
            this.isLoading = false
          })
        } else {
          this.isLoading = false
          this.$message({
            message: '内容未填写正确',
            type: 'warning'
          })
          return false
        }
      })
    },
    /**
     * @description 关闭任务添加弹出框
     * @param
     */
    onCancel: function () {
      this.dialogFormVisible = false
    },
    /**
     * @description 打开模态框清除表单验证，表单值初始化时会促使表单验证启动，故在模态框打开时清除表单验证
     *
     * @param
     */
    onClearValidate: function () {
      // 需要模态框打开时clearValidate才会生效
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    /**
     * @description 请求组织树，添加或编辑时，需要选择组织树，需重新获取组织树的信息
     *
     * @param
     */
    getParentOrgList: function () {
      getOrgTree().then(res => {
        this.orgSelectData.splice(0, this.orgSelectData.length)
        this.orgSelectData.push(res.data.data)
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @description 获取上级组织名称，添加或者编辑时，需要获取当前房屋上级的组织树名称，回显数据或者默认选择
     * @param data:组织节点对象信息
     * @param node:组织节点
     */
    onHouseSelectClick: function (data, node) {
      this.form.orgParentUuid = data.uuid
      let parentName = ''
      // 组装上级组织名称
      const getName = (node) => {
        parentName = node.label + parentName
        if (node.parent && node.parent.data.$treeNodeId) {
          getName(node.parent)
        } else {
          this.form.orgParentName = parentName
        }
        this.form.orgParentName = parentName
      }
      getName(node)
      this.form.orgUuid = data.uuid
      this.orgPopoverVisible = false
    }
  },
  /**
     * @description 在进入主数据界面就开始加载组织树信息，挂在vue生命周期开始的阶段，在dom加载完毕立刻执行此操作
     *
     * @param
     */
  mounted: function () {
    // 获取房屋组织列表
    this.getParentOrgList()
    // 支付方式
    getHouseType({ itemType: '13' }).then(res => {
      this.payStationArr = res.data.data
    }).catch(err => {
      console.log(err)
    })
    // 房屋用途
    getHouseType({ itemType: '14' }).then(res => {
      this.houseUseArr = res.data.data
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>
<style lang='less' scoped>
.el-form-item {
  text-align: left;
}

.org-select-popover {
  height: 200px;
  overflow: auto;
}

.building-area .el-input {
  width: 130px;
}

.building-area .unit {
  position: absolute;
  right: 0;
}
.el-tree {
  width: 900px;
}
</style>

