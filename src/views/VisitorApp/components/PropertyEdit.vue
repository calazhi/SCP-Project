<template>
  <el-dialog :visible.sync="dialogFormVisible" width="880px" :before-close="handleClose" :modal-append-to-body="false">
    <div slot="title">
      <span>物业人员录入</span>
    </div>
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-row>
        <el-col :span="16">
          <el-row>
            <el-col :span="12">
              <el-form-item label="人员姓名" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="证件类型" prop="idenType">
                <el-select v-model="form.idenType" placeholder="请选择证件类型">
                  <el-option v-for="item in idenType" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="民族" prop="nation">
                <el-select v-model="form.nation" placeholder="请选择民族">
                  <el-option v-for="item in list.nation" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系方式" prop="phone">
                <el-input v-model="form.phone"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
              <el-form-item label="公司" prop="company">
                <el-input v-model="form.company"></el-input>
              </el-form-item>
              <el-form-item label="部门" prop="department">
                <el-select v-model="form.department" placeholder="请选择部门" @change="getPosition(form.department, 1)">
                  <el-option v-for="item in list.department" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="密码" prop="passCode">
                <el-input v-model="form.passCode"></el-input>
              </el-form-item> -->
              <el-form-item label="员工编号" prop="employeeId">
                <el-input v-model="form.employeeId" @blur="getEmployeeId(form.employeeId)"></el-input>
              </el-form-item>
              <el-form-item label="登录账号" prop="userName" v-if="showUserName">
                <el-input v-model="form.userName" @blur="getUserName(form.userName)" :readonly="isCan"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" placeholder="请选择性别">
                  <el-option v-for="item in list.sex" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="证件号码" prop="idenNum">
                <el-input v-model="form.idenNum"></el-input>
              </el-form-item>
              <el-form-item label="生日" prop="birth">
                <el-date-picker style="width:auto" v-model="form.birth" align="right" type="date" :editable="false" placeholder="选择生日" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" :picker-options="birthPickerOption">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="籍贯" prop="origin">
                <el-input v-model="form.origin"></el-input>
              </el-form-item>
              <el-form-item label="车牌号" prop="plateNum">
                <el-input v-model="form.plateNum"></el-input>
              </el-form-item>
              <el-form-item label="项目" prop="project">
                <el-input v-model="form.project"></el-input>
              </el-form-item>
              <el-form-item label="岗位" prop="position">
                <el-select v-model="form.position" placeholder="请选择岗位">
                  <el-option v-for="item in positionList" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="确认密码" prop="repassCode">
                <el-input v-model="form.repassCode"></el-input>
              </el-form-item> -->
              <el-form-item label="入职时间" prop="hiredate">
                <el-date-picker style="width:auto" v-model="form.hiredate" align="right" type="date" :editable="false" placeholder="选择时间" format="yyyy年MM月dd日" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="账户密码" prop="passWord" v-if="showUserName">
                <el-input type="password" v-model="form.passWord"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="居住地址" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="facePic" label-width="0">
            <div class="upload-con">
              <div class="facePic-con">
                <async-img width=260 :src="defaultPic"></async-img>
              </div>
              <el-button type="primary" @click="uploadFacePic" style="margin-left:25px;">本地上传</el-button>
              <el-button type="primary" @click="CameraPhoto">拍照上传</el-button>
              <input @change="readFacePic" class="upload-pic" ref="uploadFacePicInput" type="file" accept="image/jpeg,image/png,image/gif">
              <camera-photo ref="CameraPhoto" :uploadImg="uploadImg" @changeImg="changeImg"></camera-photo>
            </div>
          </el-form-item>
          <div>
            <object ref="FP" classid="CLSID:5a4d5543-c4ec-44e3-9e56-e244f1448d4d" width="0" height="0" id="FP" codebase="HikFP_IE_Plugin.ocx"> </object>
            <el-row>
              <el-col :span="4" :offset="9">
                <el-button type="primary" @click="GetFeature" size="mini">采集指纹</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" :offset="6">
                <img :src="fingerPic" width="150px">
              </el-col>
            </el-row>
            <el-row>
              <el-col :offset="9">
                <span v-if="fingerPicInfo === 0" class="finger-pic-info-warnning">无指纹数据<br>请录入指纹</span>
                <span v-if="fingerPicInfo === 1" class="finger-pic-info-success">已录入指纹</span>
                <span v-if="fingerPicInfo === 2" class="finger-pic-info-success">指纹录入成功</span>
                <span v-if="fingerPicInfo === 3" class="finger-pic-info-error">指纹录入失败<br>请重新录入指纹</span>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="onPropertySave" :disabled="disabledButton" v-if="deleteButton">保 存</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import CameraPhoto from '@/components/CameraPhoto/CameraPhoto'
import imgurl from '@/views/VisitorApp/assets/images/default_picture.png'
import AsyncImg from './AsyncImg'
import finger from '@/views/VisitorApp/assets/images/finger_pic.png'
import fingerError from '@/views/VisitorApp/assets/images/finger_pic_err.jpg'
import fingerSuccess from '@/views/VisitorApp/assets/images/finger_pic_success.jpg'
import { insertProperty, updateProperty, positionList, validPropertyByUserName, validPropertyByEmployeeId } from '@/views/VisitorApp/apis/index.js'
import { phoneVerification, nameValidator, originValidator, emailValidator, typeValidator, employeeValidator } from '@/views/VisitorApp/assets/js/validate.js'
export default {
  components: {
    AsyncImg,
    CameraPhoto
  },
  props: {
    list: {
      value: Object
    },
    deleteButton: {
      default: true,
      type: Boolean
    }
  },
  data () {
    let that = this // 暂时去掉输入验证
    // 校验证件号是否输入正确
    var validatePassport = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入证件号码'))
      } else if (that.form.idenType === '1') {
        // 身份证验证
        if (!/^[1-9]\d{5}(19|20)*[0-99]{2}(0[1-9]{1}|10|11|12)(0[1-9]{1}|1[0-9]|2[0-9]|30|31)(\d{3})([0-9]|X|x)$/.test(value)) {
          callback(new Error('请输入正确的身份证号码!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      form: {
        id: '', // 物业人员id
        qrCode: '', // 二维码
        name: '', // 物业人员姓名
        sex: '', // 性别
        plateNum: '', // 物业人员车牌号
        nation: '', // 民族
        phone: '', // 电话
        position: '',
        userName: '', // 部门选择秩序员时显示账号
        passWord: '', // 部门选择秩序员时显示账户密码
        company: '', // 物业单位
        idenType: '', // 证件类型，默认0身份证，1军人证，2护照，3学生证，4工作证件，5其他'
        department: '', // 部门
        idenNum: '', // 证件号码
        employeeId: '', // 员工编号
        hiredate: '', // 入职时间
        origin: '', // 籍贯
        email: '', // 电子邮件
        personType: '', // 人员类型--保安、清洁等
        address: '', // 居住地址
        birth: '', // 生日
        description: '', // 描述
        facePic: '', // 物业人脸信息
        createTime: '', // 创建时间
        cardId: '', // 物业卡号
        fingerPrint: '', // 指纹信息
        starTtime: '', // 授权起始时间
        endTime: '', // 授权结束时间
        status: '' // 状态 1：在岗0：离岗';
      },
      isCan: true,
      showUserName: false,
      idenType: [
        {
          id: 5,
          itemName: '身份证',
          itemCode: '111'
        }
      ],
      uploadImg: {
        imgName: 'cameraPhote.jpg',
        imgBase64: ''
      },
      fingerPic: '',
      fingerPicInfo: '',
      fingerPic1: '',
      fingerPicQuality1: '',
      fingerPic2: '',
      fingerPicQuality2: '',
      fingerPic3: '',
      fingerPicQuality3: '',
      fingerPicQuality: '',
      dialogFormVisible: false,
      disabledButton: false,
      positionList: '',
      rules: {
        name: [
          { required: true, min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' },
          { validator: nameValidator, message: '姓名格式输入不正确', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '账户密码不能为空', trigger: 'blur' }
        ],
        company: [
          { required: true, min: 2, max: 32, message: '请输入公司,长度在2到32个字符', trigger: 'blur' },
          { validator: typeValidator, message: '不能输入特殊字符', trigger: 'blur' }
        ],
        idenNum: [
          { required: true, min: 2, max: 18, message: '请输入证件号码', trigger: 'blur' },
          { validator: validatePassport, message: '证件号码输入不正确', trigger: 'blur' },
          { validator: typeValidator, message: '不能输入特殊字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'change' }
        ],
        origin: [
          { required: true, min: 1, max: 15, message: '籍贯不能为空,长度15 个字符内', trigger: 'blur' },
          { validator: originValidator, message: '不能输入特殊字符和数字', trigger: 'blur' }
        ],
        plateNum: [
          { max: 8, message: '长度不超过 8 个字符', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        nation: [
          { required: true, message: '民族不能为空', trigger: 'change' }
        ],
        idenType: [
          { required: true, message: '证件类型不能为空', trigger: 'change' }
        ],
        email: [
          { validator: emailValidator, message: '邮箱输入不正确', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '岗位不能为空', trigger: 'change' }
        ],
        employeeId: [
          { required: true, min: 2, max: 15, message: '请输入员工编号,长度在2到15字符', trigger: 'blur' },
          { validator: employeeValidator, message: '请输入数字和字母组合', trigger: 'blur' }
        ],
        hiredate: [
          { required: true, message: '入职时间不能为空', trigger: 'blur' }
        ],
        project: [
          { required: true, min: 1, max: 32, message: '请输入项目,长度在32个字符内', trigger: 'blur' },
          { validator: typeValidator, message: '不能输入特殊字符', trigger: 'blur' }
        ],
        address: [
          { required: true, min: 2, max: 32, message: '请输入住址,长度在2到32个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: phoneVerification, message: '请输入手机号码', trigger: 'blur' }
        ],
        facePic: [
          { required: true, message: '请上传物业人员头像', trigger: 'blur' }
        ]
      },
      restaurants: [
      ],
      loading: false,
      birthPickerOption: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  methods: {
    /**
     * @description 打开编辑物业页面
     * @param  Object personInfo 表格中物业信息
     */
    propertyEdit: function (personInfo) {
      this.fingerPic = personInfo.fingerPrint ? fingerSuccess : finger
      this.fingerPicInfo = personInfo.fingerPrint ? 1 : 0
      this.form = Object.assign({}, this.form, personInfo)
      this.dialogFormVisible = true
      this.disabledButton = false
      this.showUserName = false
      // 点击编辑后res.data.position存在调用岗位联动获取岗位
      if (this.form.position) {
        let params = this.form.department
        this.getPosition(params)
      }
    },
    /**
     * @description 请求物业部门岗位联动下拉数据
     * @param Num params 物业部门信息
     * @param Num key  自定义参数数字1
     */
    getPosition: function (params, key) {
      if (key) {
        this.form.position = ''
      }
      positionList(params).then(res => {
        this.positionList = res.data
      }).catch(err => {
        console.warn({
          message: err,
          type: 'warning'
        })
      })
      // 部门选择秩序员时显示单独的账号和账户密码
      if (this.form.department === '16') {
        this.showUserName = true
      } else {
        this.showUserName = false
      }
    },
    /**
     * @description 保存物业编辑页面信息
     */
    onPropertySave: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.disabledButton = true
          if (this.form.uuid) {
            // 如果this.form.uuid存在则更新物业  不存在则新增物业
            updateProperty(Object.assign({}, this.form)).then(res => {
              if (res.data.code === '00000') {
                this.$emit('reflushData') // 保存数据成功后，用事件通知父组件，刷新物业数据表格
                this.cancel()    // 重置表单
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
              } else {
                this.disabledButton = false
                this.$message({
                  message: res.data.message,
                  type: 'warning'
                })
              }
            }).catch(err => {
              this.disabledButton = false
              console.warn({
                message: err,
                type: 'warning'
              })
            })
          } else {
            insertProperty(Object.assign({}, this.form)).then(res => {     // 新增物业
              if (res.data.code === '00000') {
                this.$emit('reflushData') // 保存数据成功后，用事件通知父组件，刷新物业数据表格
                this.cancel()  // 重置表单
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
              } else {
                this.disabledButton = false
                this.$message({
                  message: res.data.message,
                  type: 'warning'
                })
              }
            }).catch(err => {
              this.disabledButton = false
              console.warn({
                message: err,
                type: 'warning'
              })
            })
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
     * @description 根据物业秩序员账号查找账号是否存在，不存在则可用
     * @param String value 表单里的物业秩序员账号
     */
    getUserName: function (value) {
      validPropertyByUserName({ 'userName': value, 'uuid': this.form.uuid }).then(res => {
        if (res.data.code === '00000') {
          return true
        } else {
          this.$message({
            message: '该账号已存在',
            type: 'warning'
          })
          return false
        }
      }).catch(err => {
        console.warn({
          message: err,
          type: 'warning'
        })
        return false
      })
    },
    /**
     * @description 根据员工编号查找是否存在，不存在则可用
     * @param String value 表单里的员工编号
     */
    getEmployeeId: function (value) {
      validPropertyByEmployeeId({ 'employeeId': value, 'uuid': this.form.uuid }).then(res => {
        if (res.data.code === '00000') {
          if (this.form.department === '16') {
            this.form.userName = this.form.employeeId
          }
          return true
        } else {
          this.$message({
            message: '该员工编号已存在',
            type: 'warning'
          })
          return false
        }
      }).catch(err => {
        console.warn({
          message: err,
          type: 'warning'
        })
        return false
      })
    },
    /**
     * @description 点击取消重置表单
     */
    cancel: function () {
      this.dialogFormVisible = false
      this.$refs['form'].resetFields()
      this.$refs.uploadFacePicInput.value = ''
      this.form = { facePic: '', userName: '', passWord: '', position: '' }
    },
    /**
     * @description 点击关闭重置表单
     */
    handleClose: function () {
      this.dialogFormVisible = false
      this.$refs['form'].resetFields()
      this.$refs.uploadFacePicInput.value = ''
      this.form = { facePic: '', userName: '', passWord: '', position: '' }
    },
    /**
     * @description 触发file类型的input的默认事件
     */
    uploadFacePic: function () {
      this.$refs.uploadFacePicInput.click()
    },
    /**
     * @description 读取上传图片的base64编码
     */
    readFacePic: function () {
      const file = this.$refs.uploadFacePicInput.files[0]
      if (file.size <= 204800) {
        if (file.type === 'image/jpeg') {
          const self = this
          var reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function (e) {
            const base64Code = this.result
            self.form.fileName = file.name
            self.form.facePic = base64Code
          }
        } else {
          this.$message({
            message: '图片格式只能为jpg',
            type: 'warning'
          })
          return false
        }
      } else {
        this.$message({
          message: '照片不能大于200KB',
          type: 'warning'
        })
        return false
      }
    },
    /**
     * @description 拍照上传
     */
    CameraPhoto: function () {
      this.$refs.CameraPhoto.OpenCamera()
    },
    changeImg: function () {
      this.form.fileName = this.uploadImg.imgName
      this.form.facePic = this.uploadImg.imgBase64
      this.defaultPic = this.uploadImg.imgBase64
    },
    // 指纹
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
    resetData: function () {
      this.fingerPic1 = ''
      this.fingerPicQuality1 = ''
      this.fingerPic2 = ''
      this.fingerPicQuality2 = ''
      this.fingerPic3 = ''
      this.fingerPicQuality3 = ''
      this.fingerPicQuality = ''
    },
    onCloseFingerDev: function () {
      var iRet = this.$refs.FP.Close()
      this.errAlert(iRet)
    },
    errAlert: function (iret) {
      if (iret === 0) {
        console.log('执行成功')
      }
      if (iret === 1) {
        console.log('通信失败')
        this.$message({
          message: '通信失败',
          type: 'warning'
        })
      }
      if (iret === 2) {
        console.log('指纹采集超时')
        this.$message({
          message: '指纹采集超时',
          type: 'warning'
        })
      }
      if (iret === 3) {
        console.log('录入指纹失败')
        this.$message({
          message: '录入指纹失败',
          type: 'warning'
        })
      }
      if (iret === 4) {
        console.log('4 参数错误')
        this.$message({
          message: '参数错误',
          type: 'warning'
        })
      }
      if (iret === 255) {
        console.log('255 未知参数错误')
        this.$message({
          message: '参数错误',
          type: 'warning'
        })
      }
    },
    GetFeature: function () {
      if (this.onInitFingerOcx()) {
        alert('开始录入指纹，三次录入请适当移动手指提高合成质量,请按“确认”按钮开始第一次录入')
        this.resetData()
        var iRet = this.$refs.FP.GetFeature(10)
        this.errAlert(iRet)
        if (iRet === 0) {
          console.log('第一指纹录入成功')
          alert('第一录入成功，请按“确认”按钮开始第二次录入')
          this.fingerPic1 = this.$refs.FP.FeatureData
          this.fingerPicQuality1 = this.$refs.FP.FeatureQuality
        } else {
          console.log('第一指纹录入失败')
          return
        }
        iRet = this.$refs.FP.GetFeature(10)
        this.errAlert(iRet)
        if (iRet === 0) {
          console.log('第二指纹录入成功')
          alert('第二录入成功，请按“确认”按钮开始第三次录入')
          this.fingerPic2 = this.$refs.FP.FeatureData
          this.fingerPicQuality2 = this.$refs.FP.FeatureQuality
        } else {
          console.log('第二指纹录入失败')
          return
        }
        iRet = this.$refs.FP.GetFeature(10)
        this.errAlert(iRet)
        if (iRet === 0) {
          console.log('第三指纹录入成功')
          this.fingerPic3 = this.$refs.FP.FeatureData
          this.fingerPicQuality3 = this.$refs.FP.FeatureQuality
        } else {
          console.log('第三指纹录入失败')
          return
        }
        this.mulEnroll()
        this.onCloseFingerDev()
      }
    },
    mulEnroll: function () {
      var iRet = this.$refs.FP.MulEnroll(this.fingerPic1, this.fingerPic2, this.fingerPic3)
      if (iRet === 0) {
        this.form.fingerPrint = this.$refs.FP.TemplateData
        this.fingerPicQuality = this.$refs.FP.FeatureQuality
        if (this.fingerPicQuality >= 50) {
          alert('录入指纹质量合格，指纹录入完毕')
          this.fingerPic = fingerSuccess
          this.fingerPicInfo = 2
        } else {
          alert('录入指纹质量不合格，请重新录入')
          this.fingerPic = fingerError
          this.fingerPicInfo = 3
        }
        console.log(this.fingerPicQuality1, this.fingerPicQuality2, this.fingerPicQuality3, this.fingerPicQuality)
      } else {
        alert('3次录入指纹合成失败，请重新录入')
        this.fingerPic = fingerError
        this.fingerPicInfo = 3
      }
    }
  },
  computed: {
    defaultPic: function () {
      return this.form.facePic === '' ? imgurl : this.form.facePic
    }
  }
}
</script>
<style lang="less" scoped>
.upload-pic {
  display: none;
}
.upload-con {
  margin-left: 20px;
  .facePic-con {
    width: 260px;
    height: 240px;
    overflow: hidden;
    margin-bottom: 10px;
  }
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
</style>
