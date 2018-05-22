<template>
  <el-dialog :visible.sync="dialogFormVisible" width="1000px" :before-close="handleClose">
    <div slot="title">
      <span>{{form.uuid?'人员编辑':'人员新增'}}</span>
    </div>
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-row>
        <el-col :span="16">
          <el-row>
            <el-col :span="12">
              <el-form-item label="人员姓名" prop="name">
                <el-input v-model.trim="form.name" auto-complete="off" :maxlength="64"></el-input>
              </el-form-item>
              <el-form-item required label="性别类型">
                <el-select v-model="form.sex" placeholder="请选择性别">
                  <el-option v-for="item in dictItem.sexList" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item required label="证件类型">
                <el-select v-model="form.idenType" placeholder="请选择证件类型" @change="onResestIdenNum">
                  <el-option v-for="item in dictItem.idenTypeList" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生日" prop="birth">
                <el-date-picker style="width:auto" v-model="form.birth" align="right" type="date" :editable="false" placeholder="选择生日" format="yyyy年MM月dd日" :clearable="false" :picker-options="birthPickerOption" @change="autoAge">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="电话" prop="phone">
                <el-input v-model.trim="form.phone" :maxlength="18"></el-input>
              </el-form-item>
              <el-form-item label="单位" prop="company">
                <el-input v-model.trim="form.company" :maxlength="64"></el-input>
              </el-form-item>
              <el-form-item label="部门" prop="dept">
                <el-input v-model.trim="form.dept" :maxlength="64"></el-input>
              </el-form-item>
              <el-form-item required label="重点关注">
                <el-select v-model="form.focusOnPersonnel" placeholder="请选择类型">
                  <el-option v-for="item in dictItem.focusOnPersonnelList" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item required label="人员类型">
                <el-select v-model="form.userType" placeholder="请选择人员类型">
                  <el-option v-for="item in dictItem.userTypeList" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item required label="民族">
                <el-select clearable v-model="form.nation" placeholder="请选择民族">
                  <el-option v-for="item in dictItem.nationList" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="证件号码" prop="idenNum">
                <el-input v-model.trim="form.idenNum" :maxlength="64"></el-input>
              </el-form-item>
              <el-form-item label="年龄" prop="age">
                <el-input v-model="age" disabled="true">{{age}}</el-input>
              </el-form-item>
              <el-form-item label="籍贯" prop="origin">
                <el-input v-model.trim="form.origin" auto-complete="off" clearable :maxlength="64"></el-input>
              </el-form-item>
              <el-form-item label="邮件" prop="email">
                <el-input v-model.trim="form.email" :maxlength="256"></el-input>
              </el-form-item>
              <el-form-item label="岗位" prop="station">
                <el-input v-model.trim="form.station" :maxlength="64"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-popover ref="housePopover" placement="right-start" width="303" trigger="click" v-model="modalFrame">
              <div class="house-select-popover">
                <el-tree :data="houseSelectData" :props="houseSelectProps" ref="tree" @node-click="onHouseSelectClick" @node-expand="nodeExpand"></el-tree>
              </div>
            </el-popover>
            <el-form-item label="入住房屋" prop="houseName">
              <el-input :offset="23" v-model="form.houseName" readonly v-popover:housePopover></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="description">
              <el-input resize="none" type="textarea" v-model="form.description" :rows="4" :maxlength="256"></el-input>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="8">
          <div class="right-side">
            <div class="face-pic-preview">
              <async-img :src="faceImg" ref="img"></async-img>
            </div>
            <input @change="readFacePic" class="upload-pic-input" ref="uploadFacePicInput" type="file" accept="image/jpeg">
            <div class="face-pic-operation">
              <el-button type="primary" @click="onAddPhoto" size="mini">本地上传</el-button>
              <el-button type="success" @click="onCameraPhoto" size="mini">拍照上传</el-button>
              <camera-photo ref="CameraPhoto" :uploadImg="uploadImg" @changeImg="changeImg"></camera-photo>
            </div>
            <div class="tips">
              <span>上传说明：</span>
              <p>图片应保持五官端正，面部清晰可见</P>
              <p>图片推荐尺寸206*206</p>
              <p>只支持JPG格式，文件大小200Kb以内</P>
            </div>
            <div class="finger-pic">
              <object ref="FP" classid="CLSID:5a4d5543-c4ec-44e3-9e56-e244f1448d4d" width="0" height="0" id="FP" codebase="HikFP_IE_Plugin.ocx"> </object>
              <el-button type="primary" @click="getFeature" size="mini">采集指纹</el-button>
              <img :src="preFingerPic" width="150px">
              <span v-if="fingerPicInfo === 0" class="finger-pic-info-warnning">无指纹数据<br>请录入指纹</span>
              <span v-if="fingerPicInfo === 1" class="finger-pic-info-success">已录入指纹</span>
              <span v-if="fingerPicInfo === 2" class="finger-pic-info-success">指纹录入成功</span>
              <span v-if="fingerPicInfo === 3" class="finger-pic-info-error">指纹合成质量不合格<br>请重新录入指纹</span>
              <span v-if="fingerPicInfo === 4" class="finger-pic-info-error">指纹合成失败<br>请重新录入指纹</span>
            </div>
          </div>
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
import AsyncImg from '../../components/AsyncImg'
import CameraPhoto from '@/components/CameraPhoto/CameraPhoto'
import defaultPicture from '@/views/MdmApp/assets/img/default_picture.png'
import finger from '@/views/MdmApp/assets/img/finger_pic.png'
import fingerError from '@/views/MdmApp/assets/img/finger_pic_err.jpg'
import fingerSuccess from '@/views/MdmApp/assets/img/finger_pic_success.jpg'
import { insertPerson, updatePerson, getPic, obtainOrganization } from '../../apis/person_manager'
import { LOG_TAG } from '@/views/MdmApp/assets/js/index.js'
export default {
  props: {
    search: {
      type: Function
    },
    exportHouseNode: {
      type: Object
    },
    dictItem: {
      type: Object
    }
  },
  components: {
    AsyncImg,
    CameraPhoto
  },
  data () {
    // 姓名/籍贯中英文名验证
    var nameCheck = (rule, value, callback) => {
      if (!/^[\u4e00-\u9fa5A-Za-z0-9·]+$/.test(value)) {
        callback(new Error('请输入正确中英文'))
      } else {
        callback()
      }
    }
    // 证件号验证
    var IdenNum = (rule, value, callback) => {
      // 身份证验证
      if (this.form.idenType === this.dictItem.idenTypeList[0].itemCode) {
        if (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) {
          callback(new Error('请输入正确身份证号码'))
        } else {
          callback()
        }
      } else {
        if (!/^[A-Za-z0-9]+$/.test(value)) {
          callback(new Error('证件号码只能为英文和数字'))
        } else {
          callback()
        }
      }
    }
    // 电话号码验证
    var phone = (rule, value, callback) => {
      if (!/^1[3|4|5|6|7|8|9]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    // 邮箱验证
    var CEmail = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        if (!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,32}$/.test(value)) {
          callback(new Error('请输入正确的邮箱地址'))
        } else {
          callback()
        }
      }
    }
    // 验证是否选择的是houseUuid(房屋)
    var isHouseNode = (rule, value, callback) => {
      if (this.isHouseUUid) {
        callback()
      } else {
        callback(new Error('请选择房屋'))
      }
    }
    // 公司/部门/岗位/特殊字符验证
    var max64Chinese = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        if (value.length > 64) {
          callback(new Error('超出最大字符长度64字符!'))
        } else {
          if (!/^[\u4e00-\u9fa5A-Za-z\s]+$/.test(value)) {
            callback(new Error('只能输入中英文'))
          } else {
            callback()
          }
        }
      }
    }
    // 备注
    var max256Chinese = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        if (value.length > 256) {
          callback(new Error('超出最大字符长度256字符'))
        } else {
          callback()
        }
      }
    }
    return {
      uploadImg: {
        imgName: 'cameraPhote.jpg',
        imgBase64: ''
      },
      faceImg: '',                    // 人员新增编辑照片展示src
      age: '',                        // 年龄初始化
      modalFrame: false,              // 是否展开房屋组织表
      isHouseUUid: false,             // 判定房屋地址当前类型
      houseSelectData: [],
      houseSelectProps: {
        children: 'children',
        label: 'name'
      },
      preFingerPic: '',                  // 指纹预览模板图
      fingerPicInfo: '',
      fingerPic: [],
      fingerPicQuality: [],
      fingerPicQualitys: '',
      form: {
        name: '',                     // 人员姓名
        userType: '',                 // 用户类型
        sex: '',                      // 性别
        idenType: '',                 // 证件类型
        birth: '',                    // 生日
        idenNum: '',                  // 证件号码
        nation: '',                   // 名族
        origin: '',                   // 籍贯
        phone: '',                    // 手机号码
        email: '',                    // 邮件
        company: '',                  // 公司
        dept: '',                     // 部门
        station: '',                  // 岗位
        focusOnPersonnel: '',         // 黑名单
        houseName: '',                // 房屋地址
        description: '',              // 人员备注
        houseUuid: '',                // 旧的房屋id
        houseUuidBeforeModify: '',    // 新的房屋id
        userUuid: '',
        fileName: '',                 // 照片名称
        facePicBase64: '',            // 照片base64
        fingerCode1: ''               // 指纹特征值
      },
      dialogFormVisible: false,       // 页面显隐
      isLoading: false,               // 按钮加载中
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' },
          { validator: nameCheck, trigger: 'blur' }
        ],
        idenNum: [
          { required: true, message: '请输入正确证件号码', trigger: 'blur' },
          { validator: IdenNum, required: true, trigger: 'blur' },
          { min: 8, max: 64, message: '长度在 8 到 64 个字符', trigger: 'blur' }
        ],
        email: [
          { validator: CEmail, message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入11位手机号码', trigger: 'blur' },
          { validator: phone, message: '请输入正确的11位手机号码', trigger: 'blur' }
        ],
        origin: [
          { required: true, message: '请输入籍贯', trigger: 'blur' },
          { validator: nameCheck, trigger: 'blur' }
        ],
        houseName: [
          { required: true, validator: isHouseNode, message: '请选择正确的房屋地址', trigger: 'change' }
        ],
        company: [
          { validator: max64Chinese, trigger: 'change' }
        ],
        dept: [
          { validator: max64Chinese, trigger: 'change' }
        ],
        station: [
          { validator: max64Chinese, trigger: 'change' }
        ],
        description: [
          { validator: max256Chinese, trigger: 'change' }
        ]
      },
      /**
       * @description 生日日期选择器 超出当前日期不可选 element-UI官方函数
       * @param {Date} time 禁选日期
       * @return 超出当前日期不可选
       */
      birthPickerOption: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  methods: {
    /**
     * @description 开始人员添加/编辑
     * 添加初始化内容，编辑将内容赋值
     * @param {Object} personInfo @default {}
     */
    personEdit: function (personInfo = {}) {
      this.dialogFormVisible = true
      // 生日提前处理  便于年龄自动生成函数使用
      this.form.birth = personInfo.birth || ''
      if (personInfo.uuid) {
        // 人员编辑
        if (personInfo.facePic) {
          getPic({ facePic: personInfo.facePic })
            .then(res => {
              this.faceImg = res.data
            })
            .catch(err => {
              this.$message({
                message: '服务器连接异常',
                type: 'warning'
              })
              console.warn(LOG_TAG + '图片加载err')
              console.warn(err)
            })
        } else {
          this.faceImg = defaultPicture
        }
        this.isHouseUUid = true
        this.form.houseName = personInfo.houseName
        this.form.houseUuid = personInfo.houseUuid
        this.autoAge()
      } else {
        // 人员新增
        this.form.facePicBase64 = defaultPicture
        this.faceImg = this.form.facePicBase64
        this.form.houseName = this.exportHouseNode.houseOrOrgName
        if (this.exportHouseNode.type === 'house') {
          this.form.houseUuid = this.exportHouseNode.houseUuid
          this.isHouseUUid = true
        } else {
          this.isHouseUUid = false
        }
      }
      this.preFingerPic = personInfo.fingerCode1 ? fingerSuccess : finger
      this.form.oldFingerCode1 = personInfo.fingerCode1 || ''
      this.form.fingerCode1 = ''
      this.fingerPicInfo = personInfo.fingerCode1 ? 1 : 0
      this.form.uuid = personInfo.uuid || null
      this.form.name = personInfo.name || null                                                                        // 人员姓名
      this.form.userType = personInfo.userType || this.dictItem.userTypeList[0].itemCode                              // 用户类型
      this.form.sex = personInfo.sex || this.dictItem.sexList[0].itemCode                                             // 性别
      this.form.idenType = personInfo.idenType || this.dictItem.idenTypeList[0].itemCode                              // 证件类型
      this.form.idenNum = personInfo.idenNum || ''                                                                    // 证件号码
      this.form.nation = personInfo.nation || this.dictItem.nationList[0].itemCode                                    // 民族
      this.form.origin = personInfo.origin || ''                                                                      // 籍贯
      this.form.phone = personInfo.phone || ''                                                                        // 手机号码
      this.form.email = personInfo.email || ''                                                                        // 邮件
      this.form.company = personInfo.company || ''                                                                    // 公司
      this.form.dept = personInfo.dept || ''                                                                          // 部门
      this.form.station = personInfo.station || ''                                                                    // 岗位
      this.form.focusOnPersonnel = personInfo.focusOnPersonnel || this.dictItem.focusOnPersonnelList[0].itemCode
      this.form.houseUuidBeforeModify = personInfo.houseUuid || ''                                                    // 旧房屋uuid
      this.form.description = personInfo.description || ''
    },
    /**
     * @description 自动生成年龄
     */
    autoAge: function () {
      this.age = this.form.birth ? new Date().getYear() - new Date(this.form.birth).getYear() : ''
    },
    /**
     * @description 改变证件类型重置证件号
     */
    onResestIdenNum: function () {
      this.form.idenNum = ''
    },
    /**
     * @description 人员数据 新增/编辑保存
     */
    onSave: function () {
      // 正则验证
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 禁用按钮 防止重复提交
          this.isLoading = true
          var func
          func = this.form.uuid ? updatePerson : insertPerson
          func(Object.assign({}, this.form)).then(res => {
            if (res.data.code === '00000') {
              this.$message({
                message: res.data.data,
                type: 'success'
              })
              // 刷新类型
              this.form.uuid ? this.search({}, false) : this.search({}, true)
              this.dialogFormVisible = false
              this.reset()
            } else {
              this.$message({
                message: res.data.data,
                type: 'warning'
              })
            }
            this.isLoading = false
          })
            .catch(err => {
              // 服务器异常 按键解锁
              console.warn(LOG_TAG + '人员信息保存err')
              console.warn(err)
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
     * @description 人员数据 取消按钮
     */
    onCancel: function () {
      // 隐藏对话框
      this.dialogFormVisible = false
      // 初始化
      this.reset()
    },
    /**
     * @description 人员数据 表单重置
     */
    reset: function () {
      // 初始化表格、验证提示
      this.$refs['form'].resetFields()
      // 初始化图片显示
      this.age = ''
      this.form.facePicBase64 = defaultPicture
      this.faceImg = defaultPicture
      this.$refs.uploadFacePicInput.value = ''
    },
    /**
     * @description 关闭页面
     */
    handleClose: function () {
      this.dialogFormVisible = false
      this.reset()
    },
    /**
     * @description 房屋组织树
     * @param {Object} data 当前节点房屋组织树属性信息
     * @param {Object} node 当前节点房屋组织树下级目录信息
     */
    onHouseSelectClick: function (data, node) {
      let personName = ''
      // 组装上级组织名称
      const getName = (node) => {
        personName = node.label + personName
        if (node.parent && node.parent.data.$treeNodeId) {
          getName(node.parent)
        } else {
          this.form.houseName = personName
        }
      }
      getName(node)
      this.form.orgParentUuid = data.$treeNodeId
      this.orgPopoverVisible = false
      // 判断是否选中的是房屋
      if (data.type === 'house') {
        this.form.houseUuid = data.uuid
        this.isHouseUUid = true
      } else {
        this.isHouseUUid = false
      }
    },
    /**
     * @description 打开照片上传页面
     */
    onAddPhoto: function () {
      this.$refs.uploadFacePicInput.click()
    },
    /**
     * @description 打开拍照页面
     */
    onCameraPhoto: function () {
      this.$refs.CameraPhoto.OpenCamera()
    },
    /**
     * @description 拍照结束通知父组件同步照片
     */
    changeImg: function () {
      this.form.fileName = this.uploadImg.imgName
      this.form.facePicBase64 = this.uploadImg.imgBase64
      this.faceImg = this.uploadImg.imgBase64
    },
    /**
     * @description 读取上传图片的base64编码
     */
    readFacePic: function () {
      var file = this.$refs.uploadFacePicInput.files[0]
      // 判断上传文件类型
      if (file.type === 'image/jpeg') {
        this.form.fileName = file.name
        // 判断图片是否大于200K
        if (file.size < 1024 * 200) {
          const self = this
          var reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function (e) {
            var base64Code = this.result
            self.form.facePicBase64 = base64Code
            self.faceImg = base64Code
          }
        } else {
          this.$message({
            message: '请选择小于200KB的图片',
            type: 'warning'
          })
        }
      } else {
        this.$message.error('文件格式错误、请上传JPG图片')
        return false
      }
    },
    /**
     * @description 组织房屋树处理
     * @param {Object} data 当前节点房屋组织树信息
     * @return {Object} data 当前节点房屋组织树下级目录为空
     */
    formatTree: function (data) {
      const defaultNode = {
        name: ''
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].isParent === true) {
          data[i].children = []
          data[i].children.push(defaultNode)
        }
      }
      return data
    },
    /**
     * @description 点击房屋组织树节点
     * @param {Object} data 当前节点房屋组织树属性信息
     * @param {Object} node 当前节点房屋组织树下级目录信息
     * @return {Boolean} false 不执行展开操作
     */
    nodeExpand: function (data, node) {
      if (data.hasExpanded) {
        return false
      }
      this.orgData = {
        isParent: data.isParent,
        type: data.type,
        uuid: data.uuid
      }
      obtainOrganization(this.orgData).then(res => {
        data.children = this.formatTree(res.data.data.children)
        data.hasExpanded = true
      })
    },
    resetData: function () {
      this.fingerPic = []
      this.fingerPicQuality = []
      this.fingerPicQualitys = ''
    },
    /**
    * @description 检测控件
    */
    checkOcx: function () {
      try {
        this.$refs.FP.Init()
        console.log('指纹采集初始化成功')
        return true
      } catch (err) {
        return false
      }
    },
    /**
     * @description OCX控件下载页面
     */
    ocxUrl: function () {
      this.$alert('<strong><a href="/OCX/hk-fingerprint.exe">指纹采集OCX控件检测失败，请点击下载安装控件</a></strong>', '指纹采集OCX控件下载地址', {
        dangerouslyUseHTMLString: true
      })
    },
    /**
     * @description 控件初始化
     */
    onInitFingerOcx: function () {
      if (this.checkOcx()) {
        console.log('指纹采集OCX控件已安装，初始化成功')
        return true
      } else {
        this.ocxUrl()
        return false
      }
    },
    /**
     * @description 关闭指纹采集设备
     */
    onCloseFingerDev: function () {
      var iRet = this.$refs.FP.Close()
      this.errAlert(iRet)
    },
    /**
     * @description 指纹采集结果输出
     * @param {string} iret 指纹采集结果状态码
     */
    errAlert: function (iret) {
      if (iret === 0) {
        console.log('执行成功')
      }
      if (iret === 1) {
        this.$message({
          message: '指纹采集设备通信失败,请确认已连接设备或USB权限',
          type: 'warning'
        })
        console.log('通信失败')
      }
      if (iret === 2) {
        this.$message({
          message: '指纹采集超时',
          type: 'warning'
        })
        console.log('指纹采集超时')
      }
      if (iret === 3) {
        this.$message({
          message: '录入指纹失败',
          type: 'warning'
        })
        console.log('录入指纹失败')
      }
      if (iret === 4) {
        this.$message({
          message: '参数错误',
          type: 'warning'
        })
        console.log('参数错误')
      }
      if (iret === 255) {
        this.$message({
          message: '255 未知参数错误',
          type: 'warning'
        })
        console.log('255 未知参数错误')
      }
    },
    /**
     * @description 指纹采集过程封装
     * @param {number} n 指纹采集当前状态
     * @param {string} message 指纹采集提示语
     */
    fingerPicStep: function (n, message) {
      var iRet = this.$refs.FP.GetFeature(10)
      if (iRet === 0) {
        this.fingerPic[n] = this.$refs.FP.FeatureData
        this.fingerPicQuality[n] = this.$refs.FP.FeatureQuality
        console.log('当前指纹录入成功')
        console.log(this.fingerPicQuality[n])
        !message || alert(message)
        return true
      } else {
        this.errAlert(iRet)
        return false
      }
    },
    /**
     * @description 指纹采集过程
     */
    getFeature: function () {
      if (this.onInitFingerOcx()) {
        alert('开始录入指纹，三次录入请适当移动手指提高合成质量,请按“确认”按钮开始第一次录入')
        this.resetData()
        if (!this.fingerPicStep(1, '第一录入成功，请按“确认”按钮开始第二次录入')) {
          return
        }
        if (!this.fingerPicStep(2, '第二录入成功，请按“确认”按钮开始第三次录入')) {
          return
        }
        if (!this.fingerPicStep(3, '')) {
          return
        }
        console.log(this.fingerPic[1], this.fingerPic[2], this.fingerPic[3])
        this.mulEnroll()
        this.onCloseFingerDev()
      }
    },
    /**
     * @description 指纹采集后合并生成指纹模板
     */
    mulEnroll: function () {
      var iRet = this.$refs.FP.MulEnroll(this.fingerPic[1], this.fingerPic[2], this.fingerPic[3])
      this.errAlert(iRet)
      if (iRet === 0) {
        this.form.fingerCode1 = this.$refs.FP.TemplateData
        this.fingerPicQuality = this.$refs.FP.FeatureQuality
        if (this.fingerPicQuality >= 30) {
          this.$message({
            message: '指纹质量合格，指纹录入完毕',
            type: 'success'
          })
          this.preFingerPic = fingerSuccess
          this.fingerPicInfo = 2
        } else {
          this.$message({
            message: '指纹质量不合格，请重新录入',
            type: 'warning'
          })
          this.preFingerPic = fingerError
          this.fingerPicInfo = 3
        }
      } else {
        this.$message({
          message: '3次录入指纹模板合成失败，请重新录入',
          type: 'warning'
        })
        this.preFingerPic = fingerError
        this.fingerPicInfo = 4
      }
    }
  },
  mounted: function () {
    obtainOrganization().then(res => {
      this.houseSelectData.push(res.data.data)
    })
      .catch(err => {
        console.warn(LOG_TAG + '组织树加载err')
        console.warn(err)
      })
  }
}
</script>
<style scoped>
.upload-pic-input {
  display: none;
}

.house-select-popover {
  height: 150px;
  overflow: auto;
}

.right-side {
  margin: 0 auto;
  width: 230px;
}

.face-pic-preview {
  width: 206px;
  height: 206px;
  margin: 0 auto;
  border: 1px solid #ccc;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.face-pic-preview img {
  width: 206px;
}

.face-pic-operation {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 15px;
}

.tips {
  width: 215px;
  margin: 8px auto;
  font-size: 10px;
}
.finger-pic {
  margin: 25px auto 0;
  width: 150px;
  text-align: center;
}
.finger-pic-info-warnning {
  font-size: 15px;
  font-weight: 600;
  color: #e6a23c;
}
.finger-pic-info-success {
  font-size: 15px;
  font-weight: 600;
  color: #5ac38a;
}
.finger-pic-info-error {
  font-size: 15px;
  font-weight: 600;
  color: red;
}
.el-tree {
  width: 900px;
}
</style>
