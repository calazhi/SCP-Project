<template>
  <el-dialog :visible.sync="dialogFormVisible" width="880px" :before-close="handleClose" :modal-append-to-body="false">
    <div slot="title">
      <span>访客授权</span>
    </div>
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-row>
        <el-col :span="16">
          <el-row>
            <el-col :span="12">
              <!-- <el-form-item label="访客姓名" prop="name">
                <el-autocomplete v-model="form.name" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelectVisitor" :disabled="isCan" popper-class="my-visitor">
                  <template slot-scope="{ item }">
                    <div class="visitor-name">{{ item.name }}</div>
                    <span class="visitor-phone">{{ item.phone }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item> -->
              <el-form-item label="访客姓名" prop="name">
                <el-input v-model="form.name" :disabled="isCan" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="访客单位" prop="company">
                <el-input v-model="form.company" :disabled="isCan"></el-input>
              </el-form-item>
              <el-form-item label="证件类型" prop="idenType">
                <el-select v-model="form.idenType" placeholder="请选择证件类型" :disabled="isCan">
                  <el-option v-for="item in list.idenType" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="重点关注" prop="focusOnPersonnel">
                <el-select v-model="form.focusOnPersonnel" placeholder="请选择">
                  <el-option v-for="item in list.focusOnPersonnel" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="拜访原由" prop="reasonType">
                <el-input v-model="form.reasonType" :disabled="isCan"></el-input>
              </el-form-item>
              <el-form-item label="被访者姓名" prop="personName">
                <el-autocomplete v-model="form.personName" :fetch-suggestions="querySearchPerson" placeholder="请输入被访者姓名" @select="handleSelectPerson" popper-class="my-autocomplete" :disabled="isCan">
                  <template slot-scope="props">
                    <div class="person-name">{{ props.item.name }}</div>
                    <span class="person-addr">{{ props.item.houseName }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" placeholder="请选择性别" :disabled="isCan">
                  <el-option v-for="item in list.sex" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系方式" prop="phone">
                <el-input v-model="form.phone" :disabled="isCan"></el-input>
              </el-form-item>
              <el-form-item label="证件号码" prop="idenNum">
                <el-input v-model="form.idenNum" :disabled="isCan"></el-input>
              </el-form-item>
              <el-form-item label="人员类型" prop="visitorType">
                <el-select v-model="form.visitorType" placeholder="请选择人员类型" :disabled="isCan">
                  <el-option v-for="item in list.visitorType" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="拜访人数" prop="visitorCnt">
                <el-input v-model="form.visitorCnt" :disabled="isCan"></el-input>
              </el-form-item>
              <el-form-item label="来访车牌" prop="plateNum">
                <el-input v-model="form.plateNum" :disabled="isCan"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="被访房屋地址" prop="houseAddr">
              <el-input :offset="23" v-model="form.houseAddr" disabled></el-input>
            </el-form-item>
            <el-form-item label="有效日期">
              <el-date-picker style="width:100%" v-model="effectDate" @change="changeDate" :disabled="isCan" value-format="yyyy-MM-dd HH:mm:ss" align="center" type="datetimerange" :editable="false" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" :picker-options="birthPickerOption">
              </el-date-picker>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="facePic" label-width="0">
            <div class="upload-con">
              <div class="facePic-con">
                <async-img width=260 :src="defaultPic"></async-img>
              </div>
              <el-button type="primary" @click="uploadFacePic" v-show="isShow" style="margin-left:25px;">选择文件</el-button>
              <el-button type="primary" @click="CameraPhoto" v-show="isShow">拍照上传</el-button>
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
              <el-col :span="12" :offset="2">
                <img :src="fingerPic" width="150px">
              </el-col>
              <el-col :span="10" style="padding-top:60px;">
                <span v-if="fingerPicInfo === 0" class="finger-pic-info-warnning">无指纹数据<br>请录入指纹</span>
                <span v-if="fingerPicInfo === 1" class="finger-pic-info-success">已录入指纹</span>
                <span v-if="fingerPicInfo === 2" class="finger-pic-info-success">指纹录入成功</span>
                <span v-if="fingerPicInfo === 3" class="finger-pic-info-error">指纹录入失败<br>请重新录入指纹</span>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

      <el-row style="height:20px;"><hr/></el-row>
      <el-row>
        <el-col :span="8" :offset="2">授权方式:
          <span style="color:red;">{{form.info}}</span>
        </el-col>
      </el-row>
      <el-row class="authority-row">
        <el-col :span="6" :offset="4">
          <input type="checkbox" v-model="form.facePicType" :true-value="1" @change="checkedFace" />人 脸
        </el-col>
        <el-col :span="12">
          <el-button size="mini" type="success" v-if="currentFacePic">成功</el-button>
          <div v-else>
            <el-button size="mini" type="info">未授权</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row class="authority-row">
        <el-col :span="6" :offset="4">
          <input type="checkbox" v-model="form.qrType" :true-value="1" />二维码
        </el-col>
        <el-col :span="12">
          <div v-if="qrCode">
            <el-button size="mini" type="success">成功</el-button>
            <!-- 点击查看二维码图片 -->
            <el-popover ref="popover" placement="right" width="250" trigger="click" v-model="isShowPopover">
              <template>
                <div id='code'>{{qrCode}}</div>
                <canvas id="canvas"></canvas>
              </template>
            </el-popover>
            <el-button v-popover:popover size="mini" type="success">查看</el-button>
          </div>
          <div v-else>
            <el-button size="mini" type="info">未授权</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 注释部分代码可能后面会有需求 -->
      <!-- <el-row class="authority-row">
        <el-col :span="6" :offset="4">
          <input type="checkbox" v-model="form.ladderType" :true-value="1" />梯 控
        </el-col>
        <el-col :span="12">
          <el-button size="mini" type="success" v-if="currentLadderFlag">成功</el-button>
          <div v-else>
            <el-button size="mini" type="primary" @click="getLadderFlag(form.ladderType)">重新授权</el-button>
          </div>
        </el-col>
      </el-row>-->
      <el-row class="authority-row">
        <el-col :span="6" :offset="4">
          <input type="checkbox" v-model="form.fingerType" :true-value="1" />指纹
        </el-col>
        <el-col :span="12">
          <div v-if="currentFingerPrint">
            <el-button size="mini" type="success">成功</el-button>
          </div>
          <div v-else>
            <el-button size="mini" type="info">未授权</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row class="authority-row">
        <el-col :span="2" :offset="4">
          <input v-model="form.card" :true-value="1" type="checkbox" @change="checkedCard" />门禁刷卡
        </el-col>
        <el-col :span="6" :offset="4">
          <div v-if="cardId">
            <el-button size="mini" type="success">成功</el-button>
            <el-button size="mini" type="danger" v-if="form.returnCardFlag">已退卡</el-button>
          </div>
          <div v-else>
            <el-button size="mini" type="info">未授权</el-button>
          </div>
        </el-col>
        <el-col :span="6" v-show="form.card||form.cardId">
          卡号：
          <el-input v-model="form.cardId" placeholder="请输入卡号" prop="cardId" style="width:130px;" size="mini"></el-input>
        </el-col>
      </el-row>
      <!-- 读卡设备串口列表 -->
      <div style="height:110px;" v-show="form.card">
        <el-col :span="6" :offset="4">
          <el-table ref="portList" :data="cardNum" highlight-current-row @current-change="selectPort" size="mini" height="110" style="width:150px">
            <el-table-column prop="port" label="读卡器串口设置"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="4" :offset="2" style="padding-top:50px;">
          <el-button @click="openCardPort" :disabled="openPort" size="mini">打开</el-button>
          <el-button @click="closeCardPort" :disabled="closePort" size="mini">关闭</el-button>
          <el-alert v-bind:title="portMsg" :type="elAlertType" left :closable="false" style="background-color:#FFFFFF"></el-alert>
        </el-col>
        <span style="color:red;">请确认卡片已在"卡片管理"入库</span><br/>
        <el-button size="mini" type="primary" @click="onvalidateCard">点击确认</el-button>
      </div>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="onVisitorSave" :disabled="disabledButton">保 存</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Vue from 'vue'
import CameraPhoto from '@/components/CameraPhoto/CameraPhoto'
import imgurl from '@/views/VisitorApp/assets/images/default_picture.png'
import AsyncImg from './AsyncImg'
import finger from '@/views/VisitorApp/assets/images/finger_pic.png'
import fingerError from '@/views/VisitorApp/assets/images/finger_pic_err.jpg'
import fingerSuccess from '@/views/VisitorApp/assets/images/finger_pic_success.jpg'
import { getTypeNodeMap, addVisitorInfoTest, searchVisitorInfo, validateCard } from '@/views/VisitorApp/apis/index.js'
import { phoneVerification, nameValidator, typeValidator, visitorCntValidator } from '@/views/VisitorApp/assets/js/validate.js'
import QRCode from 'qrcode'
Vue.use(QRCode)
export default {
  components: {
    AsyncImg,
    CameraPhoto
  },
  props: {
    cardNum: {
      default: [],
      type: Array
    },
    iccardObj: {
      default: null,
      type: Object
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
      isInited: false,
      isFormInited: false,
      isShowPopover: false,
      form: {
        name: '',
        company: '',
        sex: '',
        idenType: '',
        focusOnPersonnel: '',
        phone: '',
        idenNum: '',
        visitorUuid: '',
        facePic: '',
        faceId: '',
        fileName: '',
        reasonType: '',
        visitorCnt: 1,
        plateNum: '',
        personName: '',
        status: 0,
        houseAddr: '',
        uuid: '',
        personType: '',
        personId: '',
        houseId: '',
        startTime: '',
        endTime: '',
        fingerPrint: '', // 指纹信息
        // 授权信息
        cardId: '',
        qrType: '',
        facePicType: 1,
        ladderType: '',
        fingerType: '',
        card: '',
        visitorType: '',
        info: '',
        returnCardFlag: ''
      },
      cardId: '',
      qrCode: '',
      currentFacePic: '',
      currentLadderFlag: '',
      currentFingerPrint: '',
      effectDate: [],
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
      list: '',
      birthPickerOption: {    // 有效日期
        disabledDate (time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        }
      },
      rules: {
        name: [
          { required: true, min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' },
          { validator: nameValidator, message: '姓名格式输入不正确', trigger: 'blur' }
        ],
        idenNum: [
          { required: true, min: 8, max: 18, message: '请输入证件号码,长度在8到18位', trigger: 'blur' },
          { validator: validatePassport, message: '证件号码输入不正确', trigger: 'blur' },
          { validator: typeValidator, message: '不能输入特殊字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: phoneVerification, message: '手机号码输入不正确', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'change' }
        ],
        visitorType: [
          { required: true, message: '访客类型不能为空', trigger: 'change' }
        ],
        idenType: [
          { required: true, message: '证件类型不能为空', trigger: 'change' }
        ],
        focusOnPersonnel: [
          { required: true, message: '重点关注类型不能为空', trigger: 'change' }
        ],
        company: [
          { max: 32, message: '长度不超过 32 个字符', trigger: 'blur' }
        ],
        facePic: [
          { required: true, message: '请上传访客头像', trigger: 'blur' }
        ],
        visitorCnt: [
          { required: true, message: '拜访人数不能为空', trigger: 'blur' },
          { validator: visitorCntValidator, message: '请输入正整数', trigger: 'blur' }
        ],
        personName: [
          { required: true, message: '请输入被访者姓名', trigger: 'blur' }
        ],
        reasonType: [
          { required: true, min: 1, max: 32, message: '原由不能为空,不超过32个字符', trigger: 'blur' },
          { validator: typeValidator, message: '不能输入特殊字符', trigger: 'blur' }
        ],
        plateNum: [
          { max: 8, message: '长度不超过 8 个字符', trigger: 'blur' }
        ],
        cardId: [
          { max: 15, message: '长度不超过 15 个字符', trigger: 'blur' }
        ]
      },
      isCan: true,
      isShow: true,
      restaurantVisitor: [],
      restaurants: [],
      loading: false,
      currentPort: null,   // 当前选中串口
      openPort: false, // 串口打开按钮disabled
      closePort: true, // 串口关闭按钮disabled
      cardNo: '', // 当前暂存的卡号
      portMsg: '', // 串口相关信息
      elAlertType: 'error' // 警告标签类型
    }
  },
  methods: {
    /**
     * @description 打开编辑访客页面
     * @param  Object personInfo 表格中访客信息
     */
    visitorEdit: function (personInfo) {
      this.fingerPic = personInfo.fingerPrint ? fingerSuccess : finger
      this.fingerPicInfo = personInfo.fingerPrint ? 1 : 0
      this.restaurants = []
      this.isCan = Boolean(personInfo.name)
      this.isShow = Boolean(!personInfo.name)
      this.disabledButton = false
      this.form = Object.assign({}, this.form, personInfo)
      this.dialogFormVisible = true
      // 请求访客下拉数据
      getTypeNodeMap(Object.assign({}, personInfo)).then(res => {
        this.list = res.data
      }).catch(err => {
        console.warn({
          message: err,
          type: 'warning'
        })
      })
      // 服务器端返回的多选框的值  存在显示成功  不存在显示失败
      this.currentFacePic = personInfo.currentFacePic
      this.qrCode = personInfo.qrCode
      // 执行二维码生成事件
      this.isInited && this.openQrCode()
      this.cardId = personInfo.cardId
      this.currentLadderFlag = personInfo.currentLadderFlag
      this.currentFingerPrint = personInfo.currentFingerPrint
      // 让多选框为空
      if (personInfo.name) {
        this.form.facePicType = ''
      } else {
        this.form.facePicType = 1
      }
      this.form.card = ''
      this.form.qrType = ''
      this.form.ladderType = ''
      this.form.fingerType = ''
      // 有效日期设置
      if (personInfo.startTime === undefined || (personInfo.startTime === '' && personInfo.endTime === '')) {
        let startd = new Date()
        let endd = new Date()
        endd.setTime(startd.getTime() + 3600 * 1000 * 24)
        this.effectDate = [startd, endd]
      }
      if (personInfo.startTime !== '' && personInfo.startTime !== undefined) {
        this.effectDate = [personInfo.startTime, personInfo.endTime]
        // 判断日期是否失效
        if (new Date().getTime() > new Date(personInfo.endTime.replace(/-/g, '/')).getTime()) {
          this.form.info = '授权信息已过期'
          this.disabledButton = true
        }
      } else {
        this.form.startTime = this.formatDateTime(this.effectDate[0])
        this.form.endTime = this.formatDateTime(this.effectDate[1])
      }
    },
    /**
     * @description 日期格式化
     * @param Object date 日期
     */
    formatDateTime: function (date) {
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let minute = date.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      let second = date.getSeconds()
      second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    /**
     * @description 保存访客编辑页面信息
     */
    onVisitorSave: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.disabledButton = true
          addVisitorInfoTest(Object.assign({}, this.form)).then(res => {
            this.form.uuid = res.data.data[0].uuid
            if (res.data.code === '00000') {
              this.form.faceId = res.data.data[0].faceId
              this.form.visitorUuid = res.data.data[0].uuid
              this.form.facePic = res.data.data[0].facePic
              this.qrCode = ''               // 让多选框值都为空
              this.currentFacePic = ''
              this.cardId = ''
              this.currentLadderFlag = ''
              this.currentFingerPrint = ''
              this.$emit('refData') // 保存数据成功后，用事件通知父组件刷新页面
              this.cancel()
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
          this.$message({
            message: '内容未填写完整',
            type: 'warning'
          })
          return false
        }
      })
    },
    /**
     * @description 点击取消重置表单
     */
    cancel: function () {
      this.dialogFormVisible = false
      this.isInited = false
      this.$refs['form'].resetFields()
      this.$refs.uploadFacePicInput.value = ''
      this.form = { facePic: '', card: '', fingerType: '', facePicType: 1, visitorCnt: 1 }
      this.closeCard()
    },
    /**
     * @description 点击关闭重置表单
     */
    handleClose: function () {
      this.dialogFormVisible = false
      this.isInited = false
      this.$refs['form'].resetFields()
      this.$refs.uploadFacePicInput.value = ''
      this.form = { facePic: '', card: '', fingerType: '', facePicType: 1, visitorCnt: 1 }
      this.closeCard()
    },
    /**
     * @description 读卡设备重置
     */
    closeCard: function () {
      this.openPort = false
      this.closePort = true
      this.currentPort = null
      this.cardNo = ''
      this.portMsg = ''
      this.cardId = ''
      this.form.cardId = ''
      this.$refs.portList.setCurrentRow()
    },
    /**
     * @description 有效日期改变时的事件
     * @param Array date 日期
     */
    changeDate: function (date) {
      this.form.startTime = this.effectDate[0]
      this.form.endTime = this.effectDate[1]
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
    // /**
    //  *@description 根据访客名字匹配信息
    //  */
    // querySearchAsync (queryString, cb) {
    //   listByName({ 'name': queryString }).then(res => {
    //     this.restaurantVisitor = res.data.data
    //     cb(this.restaurantVisitor)
    //     if (this.isFormInited) {
    //       this.form = { 'name': queryString, facePic: this.form.facePic, facePicType: 1, visitorCnt: 1, card: '', fingerType: '', startTime: this.form.startTime, endTime: this.form.endTime }
    //     } else {
    //       this.isFormInited = true
    //     }
    //   })
    //     .catch(err => {
    //       console.warn({
    //         message: err,
    //         type: 'warning'
    //       })
    //     })
    // },
    // /**
    //  * @description 根据访客名字匹配输入建议信息
    //  * @param Object item 匹配出来的建议信息列表
    //  */
    // handleSelectVisitor (item) {
    //   this.form = Object.assign({}, this.form, item)
    //   this.form.visitorUuid = item.uuid
    //   this.form.uuid = ''
    // },
    /**
     *@description 输入被访者姓名时，查询与此被访者相关的信息：房屋地址、房屋id
     */
    querySearchPerson (queryString, cb) {
      if (queryString === '' || queryString === undefined) {
        const emptyArr = []
        cb(emptyArr)
      } else {
        searchVisitorInfo({ 'personName': queryString }).then(res => {
          this.restaurants = res.data.data
          cb(this.restaurants)
        })
          .catch(err => {
            console.warn({
              message: err,
              type: 'warning'
            })
          })
      }
    },
    /**
     * @description 根据被访客名字匹配输入建议信息
     * @param Object item 匹配出来的建议信息列表
     */
    handleSelectPerson (item) {
      this.form.personName = item.name
      this.form.houseAddr = item.houseName
      this.form.personId = item.uuid
      this.form.houseId = item.houseUuid
      this.form.personType = item.personType
    },
    /**
     * @description 选中门禁卡或者人脸   带选梯控
     */
    checkedCard: function () {
      if (this.form.card || this.form.facePicType) {
        if (this.currentLadderFlag) {
          this.form.ladderType = ''
        } else {
          this.form.ladderType = '1'
        }
      } else {
        this.form.ladderType = ''
      }
    },
    /**
     * @description 选中门禁卡或者人脸   带选梯控
     */
    checkedFace: function () {
      if (this.form.facePicType || this.form.card) {
        if (this.currentLadderFlag) {
          this.form.ladderType = ''
        } else {
          this.form.ladderType = '1'
        }
      } else {
        this.form.ladderType = ''
      }
    },
    /**
     * @description 选择串口
     */
    openCardPort () {
      if (this.currentPort == null) {
        this.portMsg = '请先选择串口'
        return
      }
      try {
        var result = this.iccardObj.openSerial(this.currentPort.port)
        if (result) {
          this.portMsg = '串口打开成功'
          this.elAlertType = 'success'
          this.openPort = true
          this.closePort = false
        } else {
          this.elAlertType = 'error'
          this.portMsg = '串口打开失败'
        }
      } catch (e) {
        console.log(e.name + ': ' + e.message)
        this.$alert('读卡器控件错误，请联系管理员', '提示', {
          confirmButtonText: '确定'
        })
      }
    },
    /**
     * @description 关闭串口
     */
    closeCardPort () {
      try {
        var result = this.iccardObj.closeSerial()
        if (result) {
          this.portMsg = '串口关闭成功'
          this.elAlertType = 'success'
          this.openPort = false
          this.closePort = true
        } else {
          this.elAlertType = 'error'
          this.portMsg = '串口关闭失败'
        }
      } catch (e) {
        console.log(e.name + ': ' + e.message)
        this.$alert('读卡器控件错误，请联系管理员', '提示', {
          confirmButtonText: '确定'
        })
      }
    },
    /**
     * @description 读卡器串口选择
     * @param String val 日期
     */
    selectPort: function (val) {
      this.currentPort = val
    },
    /**
     * @description 定时读卡
     */
    readCard () {
      let that = this
      let temp = that.iccardObj.getCardNo()
      if (that.cardNo !== temp) {
        that.cardNo = temp
        if (that.cardNo !== '') {
          that.form.cardId = that.cardNo
        }
      }
    },
    /**
     * @description 点击确认卡片是否可用
     */
    onvalidateCard () {
      validateCard({ 'cardId': this.form.cardId, 'uuid': this.form.uuid }).then(res => {
        if (res.data.code === '00000') {
          if (this.form.cardId !== '') {
            this.$message({
              message: '该卡号可用',
              type: 'success'
            })
          }
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        }
      }).catch(err => {
        console.warn({
          message: err,
          type: 'warning'
        })
      })
    },
    /**
     * @description 查看二维码
     */
    openQrCode: function () {
      var canvas = document.getElementById('canvas')
      QRCode.toCanvas(canvas, this.qrCode, function (error) {
        if (error) {
          console.log(error)
        } else {
          console.log('success!')
        }
      })
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
    /**
     * @description 指纹数据重置
     */
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
  },
  watch: {
    // 监听二维码popover里canvas的dom,执行二维码生成事件
    isShowPopover (newVal, oldVal) {
      if (!this.isInited) {
        this.isInited = true
        this.openQrCode()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.authority-row {
  height: 40px;
}
// .my-visitor {
//   li {
//     line-height: normal;
//     padding: 3px;
//     .visitor-name {
//       text-overflow: ellipsis;
//       overflow: hidden;
//     }
//     .visitor-phone {
//       font-size: 16px;
//       color: #b4b4b4;
//     }
//     .highlighted .visitor-phone {
//       color: #ddd;
//     }
//   }
// }
.my-autocomplete {
  li {
    line-height: normal;
    padding: 5px;
    .person-name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .person-addr {
      font-size: 14px;
      color: #b4b4b4;
    }
    .highlighted .person-addr {
      color: #ddd;
    }
  }
}
.el-form-item {
  margin-bottom: 17px;
}
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


