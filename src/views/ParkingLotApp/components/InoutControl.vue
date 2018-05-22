<template>
  <div class="inoutControl">
    <section>
      <el-button type="primary" @click="artificRel('in')">人工放行-进场</el-button>
      <el-button type="primary" @click="artificRel('out')">人工放行-出场</el-button>
      <el-button type="primary" @click="anomalyDis" ref='anomalyDis'>场内车辆</el-button>
      <el-dialog :visible.sync="dialogVisibleExcep" class="in-record" title="场内车辆" :before-close='closeExcp'>
        <div class="filter-back">
          <iframe id='iframebar0' src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0 class="filter-iframe"></iframe>
        </div>
        <car-in-record ref="CarInRecord" :CarInRecord="inoutData" :inCarLoad="inCarLoad"></car-in-record>
        <div style="text-align:center;width:100%; position: relative; z-index:999">
          <el-button @click="closeExcp">关闭</el-button>
        </div>
      </el-dialog>
    </section>
    <section class="inout-cont">
      <div class="left-cont">
        <section class="img-inout">
          <div class="object-main">
            <div class="object-cont">
              <ocx-preview v-show="ocxShow" ref="playMixin"></ocx-preview>
            </div>
            <div class="object-cont" id="deviceLength">
              <ocx-previewp v-show="ocxShow" ref="playMixin"></ocx-previewp>
            </div>
          </div>
        </section>
        <section class="table-cont">
          <el-table :data="inoutData" border max-height="350">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="carNum" label="车牌号码" width="100"></el-table-column>
            <el-table-column prop="cardNo" label="卡号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="direct" label="进出口类型" :formatter="typeFormat"></el-table-column>
            <el-table-column prop="carType" label="车辆类型" :formatter="carTypeFormat"></el-table-column>
            <el-table-column prop="channelName" label="出入口通道" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="ownerName" label="人员姓名" width="80" :show-overflow-tooltip="true"></el-table-column> 
            <el-table-column prop="inTime" label="入场时间" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="outTime" label="出场时间" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="ruleName" label="规则" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="cash" label="收费金额(元)" :formatter="cashFormat"></el-table-column>
            <!-- <el-table-column prop="inImg" label="入场图片">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleCheck(scope.$index, scope.row, 'in')">查看图片</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="outImg"
              label="出场图片">
              <template slot-scope="scope">
                <el-button v-show="scope.row.direct === 1" size="mini" type="primary" @click="handleCheck(scope.$index, scope.row, 'out')">查看图片</el-button>
              </template>
            </el-table-column> -->
            <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
        </section>
      </div>
      <div class="right-cont">
        <article class="device-img">
          <div v-for="channel in channelData" :key="channel.id">
            <p>
              <img src="../assets/images/img003.png" v-if="channel.isOnLine === 'false'">
              <img src="../assets/images/imgOnline.png" v-else>
            </p>
            <p v-text="channel.deviceName"></p>
          </div>
        </article>
        <article class="park-right">
          <el-table :data="parkData" border style="width: 100%; " max-height="500">
            <el-table-column prop="parkName" label="车场名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="totalParkSeat" label="临停总车位数"></el-table-column>
            <el-table-column prop="surplusParkSeat" label="临停剩余车位数"></el-table-column>
          </el-table>
        </article>
      </div>
    </section>
    <el-dialog :visible.sync="dialogCutOfVisible" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" class="detail-main" :title="cutOfTitle">
      <div class="filter-back">
        <iframe id='iframebar' src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0 class="filter-iframe"></iframe>
      </div>
      <div class="filterMain">
      <el-tabs type="border-card" v-model="tabIndexVal" @tab-click="tabChangeClick">  <!-- // v-if="isOutPark" v-show="detailForm.length > 0" -->
        <el-tab-pane v-for="(item, index) in detailForm" :key="index" :label="item.channelName" :name="getPaneName(index)">
          <el-form ref="item" :model="item" label-width="120px" @keyup.enter.native="getCutOff(index)" >
            <div class="img-cutoff">
              <img :src="item.fastdfsHttpAddress+item.recordInImage" alt="入场图片" />
              <img :src="item.fastdfsHttpAddress+item.recordOutImage" v-show="item.direct==1" alt="出场图片" />
            </div>
            <ul>
              <li v-if="item.cardNo"><label>卡号</label><span v-text="item.cardNo" ></span></li>
              <li v-else><label>车牌号</label><input v-model="item.carNum" @input="validCarNo(index)">
                <el-button :disabled="cutOffDiab || !validCarNum" size="small" 
                @click="editCarNum(index)" type="primary">车牌矫正</el-button><span class="errorSpan" v-show="!validCarNum">请输入正确的车牌号!</span></li>
              <li class="list-inline">
                <label>车型</label>
                <el-select v-model="item.carMode" placeholder="车型" @change="updateCarMode(index)" >
                  <el-option
                    v-for="item in optionMode"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </li>
              <li class="list-inline"><label>规则</label><span v-text="item.ruleName"></span></li>
              <li class="list-inline"><label>进场时间</label><span v-text="item.inTime"></span></li>
              <li class="list-inline" v-show="item.direct==1"><label>出场时间</label><span v-text="item.outTime" ></span></li>
              <li v-show="item.direct==1"><label>停车时长</label><span v-text="item.timeLength" ></span></li>
              <li v-show="item.direct==1" ><label>应缴金额</label><span v-text="item.cash"></span>元</li>
              <li v-show="item.direct==1"><label>实缴金额</label><input v-model="item.amountCash" class="cash-price" @input="changePrice(index)" />元
                <!-- <span v-show="priceTips" class="price-tips">请输入正确的金额</span> -->
              </li>
              <li v-show="item.direct==1"><label>找零</label><span>{{item.billChange}}</span></li>
              <li><label>备注</label><input type="text" :maxlength="256" v-model="item.remark" class="remark-class" style="width: 40%"/></li>
            </ul>
            <el-form-item>
              <el-button size="small" type="primary" :disabled="cutOffDiab || !validCarNum" @click="getCutOff(index)">开 闸</el-button>
              <el-button size="small" :disabled="cutOffDiab" @click="channelCutOff(index)">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" :title="artRelTitle" :before-close="closeDialog">
      <div class="filter-back">
        <iframe id='iframebar' src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0 class="filter-iframe"></iframe>
      </div>
      <div class="filterMain">
      <el-form ref="artRelForm" :model="artRelForm" :rules="formRules" label-width="120px">
        <div style="min-height:400px;">
        <el-form-item label="放行类别" prop = "passType" >
          <el-select v-model="artRelForm.passType" placeholder="请选择" style="width:50%" @change="choiseStyle">
            <el-option label="非机动车" value="0"></el-option>
            <el-option label="机动车" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" v-if="isPriveCar" prop = "carNum">
          <el-input v-model="artRelForm.carNum" @change="carNumUp" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="车型" prop = "carMode"  v-show="isPriveCar">
          <el-select v-model="artRelForm.carMode"  @change = "changeSelect" placeholder="车型" style="width:50%">
            <el-option v-for="item in optionMode" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道" prop="channel">
          <el-select v-model="artRelForm.channel" placeholder="通道" style="width:50%" v-if="isDirect===0">
            <el-option v-for="item in channelInOpt" :key="item.key" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-model="artRelForm.channel" placeholder="通道" style="width:50%" v-else>
            <el-option v-for="item in channelOutOpt" :key="item.key" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="artRelForm.remark" style="width:50%"></el-input>
        </el-form-item>
        </div>
        <el-form-item style="text-align:right;width:100%">
          <el-button @click="cannelBtn">取 消</el-button>
          <el-button type="primary" @click="saveData('artRelForm')">确认</el-button>
        </el-form-item>
      </el-form>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogConfieVisible" title="" id="dialogConfieVisible">
      <div class="filter-back">  
        <iframe src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0 class="filter-iframe"></iframe>
      </div>
      <div class="filterMain">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CarInRecord from './CarInRecord'
import ocxPreview from './OcxPreview'
import ocxPreviewp from './OcxPreviewp'
import {
  queryParkAndParkSeatInfo, // 查询车场车位信息
  getParkDeviceByLocalIp, // 查询设备IP
  getArtificialRelease,
  getChannelByIp,
  getCutOffData,
  updataCarNum,
  updateOutCarNum,
  getParkinglotAppWebSocketUrl,
  getLpnDevice,
  getParkinglotAppLocalIp,
  updateCarMode,
  carDictData
} from '@/views/ParkingLotApp/apis'
export default {
  data () {
    var checkCarNum = (rule, value, callback) => {
      if (!this.validCarNumRule.test(value)) {
        callback(new Error('请输入正确的车牌号!'))
      } else {
        callback()
      }
    }
    return {
      currentPage: 1,
      total: 0,
      pageSize: '10',
      showLen: 100,
      // loading2: true,
      tempCar: '',
      changeCarNo: '',
      validCarNum: true,
      dialogVisible: false,
      dialogVisibleExcep: false,
      dialogImgVisible: false,
      dialogCutOfVisible: false,
      dialogConfieVisible: false,
      isOutPark: false,
      isPriveCar: false,
      ocxShow: true,
      ocxPreviewShow: false,
      deviceLength: 1,
      // isOutContral: false,
      isDirect: 0,
      inoutData: [],
      chanCarNo: [],
      inCarLoad: 1,
      currChnCar: '',
      parkData: [],
      channelData: [], // 通道设备
      monitDevice: [], // 监控设备
      cutOfTitle: '进场-车牌或卡号',
      artRelTitle: '人工放行-进场',
      cutOffDiab: false,
      billChange: '',
      // imgUrl: '',
      detailForm: [],
      tabIndexVal: '',
      artRelForm: {
        carNum: '',
        passType: '',
        carMode: '0',
        direct: '',
        channel: '',
        remark: ''
      },
      formRules: {
        passType: [
          { required: true, message: '请选择放行类别', trigger: 'change' }
        ],
        carNum: [
          { required: true, message: '请输入车牌号', trigger: 'change' },
          { validator: checkCarNum, trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        carMode: [
          { required: true, message: '请选择车型', trigger: 'change' }
        ],
        channel: [
          { required: true, message: '请选择通道', trigger: 'change' }
        ],
        remark: [
          { max: 256, message: '最多可输入256个字符', trigger: 'change' }
        ]
      },
      channelInOpt: [],
      channelOutOpt: [],
      optionMode: [],
      websocket: '',
      localIp: '',
      parkinglotAppLocalIp: '',
      computerName: '',
      webSocketServerUrl: '',
      closeVue: false,
      validCarNumRule: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-HJ-NP-Z]{1}[A-HJ-NP-Z]{1}[A-HJ-NP-Z0-9]{3,5}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
    }
  },
  components: {
    CarInRecord,
    ocxPreview,
    ocxPreviewp
  },
  mounted () {
    let _this = this
    if (!!window.ActiveXObject || 'ActiveXObject' in window) { // 判断是否有ActiveX  有则为IE浏览器
      getParkinglotAppLocalIp().then(function (response) {
        _this.parkinglotAppLocalIp = response
        console.info('ip:' + _this.parkinglotAppLocalIp)
        var WshShell = new window.ActiveXObject('WScript.Shell')
        _this.computerName = WshShell.ExpandEnvironmentStrings('%COMPUTERNAME%')
        console.info('computerName:' + _this.computerName)
        _this.getDeviceLne()
        _this.startWebSockt()
        _this.getChannel(0)
        _this.getChannel(1)
        _this.loadDevice()
        _this.loadParkSeat()
      })
    } else {
      _this.$message({
        message: '出入口管控请用IE浏览器打开',
        type: 'warning'
      })
    }
    // _this.getStreaming()
    // _this.BtnPlay()
    // window.setInterval(function () {
    //   _this.getHeartbeat()
    // }, 10000)
    this.getCarDictData()
  },
  beforeDestroy () {
    this.closeVue = true
    this.websocket && this.websocket.close() // 组件销毁之前关闭websocket
  },
  methods: {
    changeOcxPreviewShow () {
      this.ocxPreviewShow = false
    },
    changeSelect (val) {
      this.artRelForm.carMode = val
    },
    getCarDictData () { // 获取下拉框的基础数据
      let _this = this
      carDictData()
        .then(function (response) {
          let errorcode = response.code
          if (errorcode === '0') {
            _this.optionMode = _this.formatString(response.data.CAR_MODE_DICT)
          } else {
            _this.$message.error(response.data.errormsg)
          }
        })
        .catch(() => {})
    },
    formatString (dataString) { // 格式化下拉框基础数据
      let keyArrs = []
      let valuArrs = []
      let dataArrObj = []
      for (let keyArr in dataString) {
        keyArrs.push('"' + keyArr + '"')
      }
      for (let valueArr in dataString) {
        valuArrs.push('"' + dataString[valueArr] + '"')
      }
      for (let i = 0; i < keyArrs.length; i++) {
        let arrObj = '{value:' + keyArrs[i] + ',label:' + valuArrs[i] + '}'
        dataArrObj.push(this.myEval(arrObj))
      }
      return dataArrObj
    },
    myEval (str) {
      let Fn = Function
      return new Fn('return ' + str)()
    },
    getDeviceLne () { // 获取设备个数
      getLpnDevice(this.computerName).then(res => {
        this.deviceLength = res.data.length
        if (res.data.length === 1) {
          document.getElementById('deviceLength').style.display = 'none'
        }
      }).catch(err => {
        console.log(err)
      })
    },
    loadParkSeat () { // 获取车位
      var _this = this
      // _this.loading2 = true
      queryParkAndParkSeatInfo()
        .then(function (response) {
          // _this.loading2 = false
          _this.parkData = response.data
        })
        .catch(
        function (error) {
          // this.loading2 = false
          console.log(error)
        }
        )
    },
    loadDevice () {
      var _this = this
      _this.channelData = []
      getParkDeviceByLocalIp(_this.computerName)
        .then(function (response) {
          if (response.code === '0') {
            for (let i = 0; i < response.data.length; i++) {
              if (response.data[i].deviceTypeCode === '2005') {
                _this.channelData.push(response.data[i])
              } else {
                _this.monitDevice.push(response.data[i])
              }
            }
          }
        })
        .catch(
        function (error) {
          console.log(error)
        }
        )
    },
    getChannel (direct) { // 获取通道信息
      let _this = this
      getChannelByIp(direct, this.computerName)
        .then(function (response) {
          if (response.code === '0') {
            let len = response.data.length
            if (direct === 0) {
              _this.isDirect = 0
              for (let i = 0; i < len; i++) {
                _this.channelInOpt.push({ 'value': response.data[i].uuid + response.data[i].direct, 'label': response.data[i].name })
              }
            } else if (direct === 1) {
              _this.isDirect = 1
              for (let i = 0; i < len; i++) {
                _this.channelOutOpt.push({ 'value': response.data[i].uuid + response.data[i].direct, 'label': response.data[i].name })
              }
            }
          }
        })
        .catch(
        function (error) {
          console.log(error)
        }
        )
    },
    artificRel (val) { // 点击人工放行
      this.artRelForm.passType = ''
      this.isPriveCar = false
      this.artRelForm.channel = ''
      if (val === 'in') {
        this.artRelTitle = '人工放行-进场'
        this.artRelForm.direct = 0
        this.isDirect = 0
      } else {
        this.artRelTitle = '人工放行-出场'
        this.artRelForm.direct = 1
        this.isDirect = 1
      }
      this.artRelForm.carNum = ''
      this.artRelForm.carMode = '0'
      this.artRelForm.channel = ''
      this.artRelForm.remark = ''
      this.dialogVisible = true
      // this.getChannel(this.artRelForm.direct)
    },
    anomalyDis () {
      var _this = this
      _this.inCarLoad = _this.inCarLoad + 1
      _this.dialogVisibleExcep = true
    },
    closeExcp () {
      this.$refs.CarInRecord.queryCarNum = ''
      this.dialogVisibleExcep = false
    },
    // handleCheck (index, row, type) {
    //   this.dialogImgVisible = true
    //   if (type === 'in' && row.recordInImage) {
    //     this.imgUrl = row.fastdfsHttpAddress + row.recordInImage
    //   }
    //   if (type === 'out' && row.recordOutImage) {
    //     this.imgUrl = row.fastdfsHttpAddress + row.recordOutImage
    //   }
    // },
    saveData (formData) { // 人工放行保存数据
      var _this = this
      var _parmas = {
        passType: _this.artRelForm.passType,
        category: _this.artRelForm.category,
        carNum: _this.artRelForm.carNum,
        carMode: _this.artRelForm.carMode,
        channelId: _this.artRelForm.channel.substr(0, _this.artRelForm.channel.length - 1),
        direct: _this.artRelForm.channel.substr(_this.artRelForm.channel.length - 1),
        remark: _this.artRelForm.remark
      }
      this.$refs[formData].validate((valid) => {
        if (valid) {
          getArtificialRelease({
            params: JSON.stringify(_parmas)
          }).then(function (response) {
            if (response.code !== '0') {
              _this.$message({
                message: '人工放行失败！',
                type: 'fail'
              })
            }
            _this.dialogVisible = false
          })
        }
      })
    },
    typeFormat (row) {
      let recordType = row.direct
      if (recordType === 0) {
        return '入场'
      } else if (recordType === 1) {
        return '出场'
      }
    },
    carTypeFormat (row) {
      let carType = row.carType
      if (carType === 1) {
        return '特殊车'
      } else {
        return '普通车'
      }
    },
    cashFormat (row) {
      let recordType = row.direct
      if (recordType === 0) {
        return ''
      } else {
        return row.cash
      }
    },
    startWebSockt () {  // 进出口信息推送
      var _this = this
      let websocketUrl = getParkinglotAppWebSocketUrl()
      if (websocketUrl !== '') {
        _this.webSocketServerUrl = 'ws://' + websocketUrl + '/webSocket/egsc_scp_parkinglotapp/readData' + '?' + _this.computerName
      } else {
        _this.webSocketServerUrl = 'ws://' + _this.parkinglotAppLocalIp + ':9081' + '/webSocket/egsc_scp_parkinglotapp/readData' + '?' + _this.computerName
      }
      console.info(_this.webSocketServerUrl)
      _this.websocket && _this.websocket.close()
      _this.websocket = new WebSocket(_this.webSocketServerUrl)
      _this.websocket.onopen = function () {
        var message = {
          test: 'hello'
        }
        _this.websocket.send(JSON.stringify(message))
      }
      _this.websocket.onmessage = function (event) {
        let eventData = JSON.parse(event.data)
        let dataArr = ''
        let len = _this.inoutData.length
        let formLen = _this.detailForm.length
        console.info('eventData: ' + JSON.stringify(eventData))
        if (eventData.websocket_connection_message) {
          let wcm = JSON.parse(eventData.websocket_connection_message)
          if (wcm.state === 0) {
            _this.$message({
              message: '出入口管控连接成功',
              type: 'success'
            })
          } else if (wcm.state === -1) {
            _this.$message({
              message: '出入口管控已打开',
              type: 'warnning'
            })
          }
        } else if (eventData.park_inout_record_message) {
          dataArr = JSON.parse(eventData.park_inout_record_message)
          _this.chanCarNo = []
          console.info('弹出: ' + JSON.stringify(_this.detailForm))
          if (_this.detailForm.length > 0) {
            // 获取当前所有弹出框的卡号+channelId或车牌号+channelId
            for (let i = 0; i < formLen; i++) {
              if (_this.detailForm[i].cardNo) {
                _this.chanCarNo.push(_this.detailForm[i].cardNo + _this.detailForm[i].channelId)
              } else {
                _this.chanCarNo.push(_this.detailForm[i].carNum + _this.detailForm[i].channelId)
              }
            }
            // 数组去重
            _this.chanCarNo = Array.from(new Set(_this.chanCarNo))
          }
          if (dataArr.cardNo && dataArr.cardNo !== '') {
            _this.currChnCar = dataArr.cardNo + dataArr.channelId
          } else {
            _this.currChnCar = dataArr.carNum + dataArr.channelId
            _this.validCarNum = true
          }
          console.info('当前牌通道: ' + _this.currChnCar)
          // 非自动开闸，进出场车辆在当前弹框未打开
          if ((dataArr.openWay !== 1) && _this.chanCarNo.indexOf(_this.currChnCar) === -1) {
            _this.dialogCutOfVisible = true
            console.log(JSON.stringify(dataArr))
            _this.setDialogTitle(dataArr)
            _this.detailForm.push(dataArr)
            // _this.billChange = ''
            _this.tabIndexVal = _this.currChnCar
            // 进出场聚焦，进出-备注，出场缴费金额
            setTimeout(() => {
              _this.focusForm(dataArr.direct)
            }, 100)
          }
          // 进出场数据不重复，放到临时记录表中
          if (_this.chanCarNo.indexOf(_this.currChnCar) === -1) {
            _this.inoutData.unshift(dataArr)
          }
          // 临时记录表长度大于showLen去掉最后一个
          if (len >= _this.showLen) {
            _this.inoutData.splice(_this.showLen, 1)
          }
        } else if (eventData.park_seat_idle_change_message) {
          // 重新加载停车临停车位信息
          console.log('park_seat_idle_change_message: ' + JSON.parse(eventData.park_seat_idle_change_message))
          _this.loadParkSeat()
        } else if (eventData.park_device_status_message) {
          // 重新加载设备信息
          console.log('park_device_status_message: ' + JSON.parse(eventData.park_device_status_message))
          _this.loadDevice()
        } else {
          console.log('未知消息不做处理')
        }
      }
      _this.websocket.onerror = function (event) {
        console.log('onerror --' + event)
        // 当websocket连接异常时，出入口管控窗口未关闭提示警告信息
        if (_this.closeVue === false) {
          _this.dialogConfieVisible = true

          _this.$alert('页面与停车场后台断开连接，请重新打开出入口管控页面', '警告', {
            confirmButtonText: '关闭',
            type: 'warning',
            center: true
          })
          .then(() => {
            _this.dialogConfieVisible = false
          })
        }
      }
    },
    getCutOff (index) {  // 开闸
      let _this = this
      if (_this.cutOffDiab === true) {
        return
      }
      let params_ = _this.detailForm[index]
      let carNum = params_.carNum
      // 凭证属于车牌号才判断
      if (params_.credenceType === 5 && _this.tempCar !== carNum) {
        _this.$message.error('车牌号已改变，但未矫正，请矫正或还原车牌号')
        return
      }
      // 凭证类型为5，是车牌号才验证车牌号是否合法
      if (params_.credenceType === 5 && !_this.validCarNumRule.test(carNum)) {
        _this.$message.error('请输入正确的车牌号!')
        return
      }
      // 出场时实缴金额是否大于应缴金额，应缴金额为0不用计算
      if ((_this.detailForm[index] && _this.detailForm[index] !== '') && (params_.direct === 0 || params_.cash === 0 || params_.amountCash - params_.cash >= 0)) {
        _this.cutOffDiab = true
        getCutOffData({
          params: JSON.stringify(params_)
        }).then(function (response) {
          let errorcode = response.code
          _this.cutOffDiab = false
          if (errorcode === '0') {
            _this.$message({
              message: '开闸成功',
              type: 'success'
            })
            _this.channelCutOff(index)
          } else {
            _this.$message({
              message: '开闸失败',
              type: 'error'
            })
          }
        })
          .catch(() => {
            _this.cutOffDiab = false
          })
      } else {
        this.$message.error('请输入正确的金额')
      }
    },
    validCarNo (index) {
      this.detailForm[index].carNum = this.detailForm[index].carNum.toUpperCase()
      if (this.validCarNumRule.test(this.detailForm[index].carNum)) {
        this.validCarNum = true
      } else {
        this.validCarNum = false
      }
      this.tabIndexVal = this.detailForm[index].carNum + this.detailForm[index].channelId
    },
    editCarNum (index) { // 矫正车牌
      // console.log('index : ' + index)
      let _this = this
      let params_ = _this.detailForm[index]
      console.log('detailForm ' + JSON.stringify(params_))
      if (params_.direct === 1) { // 出场矫正车牌
        updateOutCarNum({
          params: JSON.stringify(params_)
        }).then(function (response) {
          let errorcode = response.code
          if (errorcode === '0') {
            console.log(response.data)
            _this.updataTable(response.data)
            _this.tabChangeClick(index)
            _this.updataForm(index, response.data)
            _this.$message({
              message: '车牌矫正成功',
              type: 'success'
            })
          } else {
            _this.$message({
              message: '车牌矫正错误',
              type: 'error'
            })
          }
        })
      } else if (params_.direct === 0) {
        updataCarNum({
          params: JSON.stringify(params_)
        }).then(function (response) {
          let errorcode = response.code
          // _this.detailForm[index] = response.data
          if (errorcode === '0') {
            _this.tabChangeClick(index)
            console.log(_this.detailForm[index])
            _this.updataForm(index, response.data)
            _this.updataTable(response.data)
            _this.$message({
              message: '车牌矫正成功',
              type: 'success'
            })
          } else {
            _this.$message({
              message: '车牌矫正错误',
              type: 'error'
            })
          }
        })
      }
    },
    updateCarMode (index) { // 车型更新
      let _this = this
      let params_ = _this.detailForm[index]
      // 出场时矫正车型，更新价格
      if (params_.direct === 1) {
        updateCarMode({
          params: JSON.stringify(params_)
        }).then(function (response) {
          console.log(response)
          let errorcode = response.code
          // _this.detailForm[index] = response.data
          if (errorcode === '0') {
            _this.tabChangeClick(index)
            console.log(_this.detailForm[index])
            _this.updataTable(response.data)
            _this.updataForm(index, response.data)
            _this.$message({
              message: '车型修改成功',
              type: 'success'
            })
          } else {
            _this.$message({
              message: '车型修改失败',
              type: 'error'
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      }
    },
    cannelBtn () {
      this.dialogVisible = false
      this.$refs['artRelForm'].resetFields()
    },
    updataTable (resData) { // 更新表格数据
      console.info('update table data,resData: ')
      let _this = this
      for (let i = 0; i < _this.inoutData.length; i++) {
        if ((resData.direct === 0 && resData.inTime === _this.inoutData[i].inTime) ||
        (resData.direct === 1 && resData.outTime === _this.inoutData[i].outTime)) {
          _this.inoutData[i].carNum = resData.carNum
          _this.inoutData[i].inTime = resData.inTime
          _this.inoutData[i].outTime = resData.outTime
          _this.inoutData[i].ruleName = resData.ruleName
          _this.inoutData[i].ownerId = resData.ownerId
          _this.inoutData[i].channelId = resData.channelId
          _this.inoutData[i].channelName = resData.channelName
          _this.inoutData[i].recordInImage = resData.recordInImage
          _this.inoutData[i].recordOutImage = resData.recordOutImage
          _this.inoutData[i].carType = resData.carType
          _this.inoutData[i].cash = resData.cash
          break
        }
      }
    },
    updataForm (index, resData) { // 跟新表单数据
      this.detailForm[index].carType = resData.carType
      this.detailForm[index].carMode = resData.carMode
      this.detailForm[index].carNum = resData.carNum
      this.detailForm[index].authId = resData.authId
      this.detailForm[index].channelId = resData.channelId
      this.detailForm[index].channelName = resData.channelName
      this.detailForm[index].inTime = resData.inTime
      this.detailForm[index].outTime = resData.outTime
      this.detailForm[index].recordOutImage = resData.recordOutImage
      this.detailForm[index].recordInImage = resData.recordInImage
      this.detailForm[index].ruleName = resData.ruleName
      this.detailForm[index].ruleId = resData.ruleId
      this.detailForm[index].timeLength = resData.timeLength
      this.detailForm[index].remark = resData.remark
      this.detailForm[index].direct = resData.direct
      this.detailForm[index].cash = resData.cash
      // this.detailForm[index].amountCash = resData.amountCash
      this.detailForm[index].ownerId = resData.ownerId
      this.detailForm[index].ownerName = resData.ownerName
      this.detailForm[index].broadcastMessage = resData.broadcastMessage
      this.detailForm[index].carportType = resData.carportType
      this.detailForm[index].parkAccessCurId = resData.parkAccessCurId
      this.detailForm[index].parkAccessHisId = resData.parkAccessHisId
      this.detailForm[index].credenceType = resData.credenceType
      this.detailForm[index].occupyFlag = resData.occupyFlag
      if (Number(this.detailForm[index].amountCash) - Number(resData.cash) >= 0) {
        this.detailForm[index].billChange = (Number(this.detailForm[index].amountCash) - Number(resData.cash)).toFixed(2) + '元'
        console.log('billChange' + this.detailForm[index].billChange)
      } else {
        this.detailForm[index].billChange = ''
      }
    },
    closeDialog (done) {
      done()
      this.$refs['artRelForm'].resetFields()
    },
    choiseStyle (val) {
      if (val === '0') {
        this.isPriveCar = false
      } else if (val === '1') {
        this.isPriveCar = true
      }
    },
    channelCutOff (i) { // 取消
      if (this.detailForm.length === 1) {
        this.detailForm.splice(i, 1)
        this.dialogCutOfVisible = false
      } else {
        console.log('i : ' + i)
        let targetName = this.getPaneName(i)
        // console.log('targetName : ' + targetName)
        let tabs = this.detailForm
        let activeName = this.tabIndexVal
        // console.log(tabs)
        console.log('activeName : ' + activeName)
        let tabName = ''
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            tabName = this.getTabName(tab)
            if (tabName === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = this.getTabName(nextTab)
              }
              this.setDialogTitle(nextTab)
            }
          })
        }
        this.tabIndexVal = activeName
        this.detailForm = tabs.filter(tab => tab.name !== targetName)
        this.detailForm.splice(i, 1)
      }
    },
    tabChangeClick (tab, event) {
      let index
      if (tab.index) {
        index = tab.index
      } else {
        index = tab
      }
      // this.detailForm[index].billChange = ''
      this.setDialogTitle(this.detailForm[index])
    },
    changePrice (index) { // 实交金额输入
      let regexp = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/
      if (regexp.test(Number(this.detailForm[index].amountCash))) {
        if (this.detailForm[index].amountCash >= 0 && (Number(this.detailForm[index].amountCash) >= this.detailForm[index].cash)) {
          this.detailForm[index].billChange = parseFloat((Number(this.detailForm[index].amountCash) - this.detailForm[index].cash)).toFixed(2) + ' 元'
        } else {
          this.detailForm[index].billChange = ''
        }
      } else {
        this.$message.error('请输入正确的金额')
        this.detailForm[index].billChange = ''
      }
    },
    setDialogTitle (setDialogData) { // 设置弹窗表单数据
      // console.log('setDialogData : ' + setDialogData.recordInImage)
      this.validCarNum = true
      this.tabIndexVal = this.getTabName(setDialogData)
      if (setDialogData.direct === 1) {
        this.isOutPark = true
        // 车牌号
        if (setDialogData.carNum && setDialogData.carNum !== '' && setDialogData.credenceType === 5) {
          this.cutOfTitle = '出场-' + setDialogData.carNum
          this.tempCar = setDialogData.carNum
        } else if (setDialogData.cardNo !== '' && (setDialogData.credenceType === 2 || setDialogData.credenceType === 3)) {
          this.cutOfTitle = '出场-' + setDialogData.cardNo
        } else if (setDialogData.ownerName) {
          this.cutOfTitle = '出场-' + setDialogData.ownerName
        } else {
          this.cutOfTitle = '出场-无牌车'
        }
      } else {
        this.isOutPark = false
        // 车牌号
        if (setDialogData.carNum && setDialogData.carNum !== '' && setDialogData.credenceType === 5) {
          this.cutOfTitle = '入场-' + setDialogData.carNum
          this.tempCar = setDialogData.carNum
        } else if (setDialogData.cardNo !== '' && (setDialogData.credenceType === 2 || setDialogData.credenceType === 3)) {
          this.cutOfTitle = '入场-' + setDialogData.cardNo
        } else if (setDialogData.ownerName) {
          this.cutOfTitle = '入场-' + setDialogData.ownerName
        } else {
          this.cutOfTitle = '入场-无牌车'
        }
      }
    },
    getHostName () { // 获取计算机名
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        var WshShell = new window.ActiveXObject('WScript.Shell')
        var computerName = WshShell.ExpandEnvironmentStrings('%COMPUTERNAME%')
        this.computerName = computerName
        // console.info('computerName:' + computerName)
      }
    },
    carNumUp () {
      this.artRelForm.carNum = this.artRelForm.carNum.toUpperCase()
    },
    focusForm (direct) {
      // 进场
      if (direct === 0) {
        let elements = document.getElementsByClassName('remark-class')
        document.getElementsByClassName('remark-class')[elements.length - 1].focus()
      } else {
        let elements = document.getElementsByClassName('cash-price')
        document.getElementsByClassName('cash-price')[elements.length - 1].focus()
      }
    },
    getPaneName (index) {
      let paneName = ''
      if (this.detailForm[index].cardNo) {
        paneName = this.detailForm[index].cardNo + this.detailForm[index].channelId
      } else {
        paneName = this.detailForm[index].carNum + this.detailForm[index].channelId
      }
      return paneName
    },
    getTabName (tab) {
      let tabName = ''
      if (tab.cardNo) {
        tabName = tab.cardNo + tab.channelId
      } else {
        tabName = tab.carNum + tab.channelId
      }
      return tabName
    }
  }
}
</script>
<style lang="less" scoped>
@border: 1px solid #dcdfe6;
.inout-cont {
  margin-top: 20px;
  overflow: hidden;
  .left-cont {
    float: left;
    width: calc(~"100% - 500px");
    .img-inout {
      height: 450px;
      position: relative;
    }
    .table-cont {
      height: 360px;
      overflow-y: auto;
    }
  }
  .right-cont {
    float: right;
    width: 500px;
    padding-left: 50px;
    box-sizing: border-box;
    .device-img {
      overflow: hidden;
      margin-bottom: 30px;
      div {
        float: left;
        text-align: center;
        width: 50%;
        p {
          padding: 5px;
        }
      }
    }
    .park-right {
      max-height: 500px;
      overflow-y: auto;
    }
  }
  .el-table > .el-table__body-wrapper {
    overflow: auto;
  }
}
.check-img {
  padding: 15px;
  text-align: center;
  img {
    width: 640px;
    height: 480px;
  }
}

.detail-main {
  .img-cutoff {
    text-align: center;
    min-height: 100px;
    img {
      width: 480px;
      height: 360px;
      margin: 0 10px;
    }
  }
  margin-top: 20px;
  .el-tabs--border-card > .el-tabs__header .el-tabs__item {
    width: 80px;
    padding: 0 10px;
  }
  ul {
    li {
      list-style: none;
      margin-bottom: 15px;
      min-height: 21px;
      input {
        height: 30px;
        line-height: 30px;
        border: @border;
        padding-left: 10px;
        width: 120px;
        margin-right: 10px;
      }
      .cash-price {
        width: 60px;
      }
      label {
        display: inline-block;
        width: 120px;
        text-align: right;
        margin-right: 15px;
      }
      textarea {
        vertical-align: middle;
        border: @border;
      }
    }
    .list-inline {
      display: inline-block;
      width: 500px;
    }
  }
}
.filterMain {
  position: relative;
  z-index: 999;
  min-height: 500px;
}
.obj-style {
  width: 280px;
  height: 250px;
  background: #f2f2f2;
  filter: alpha(opacity=30);
  margin-right: 4px;
}
.filter-back {
  width: 100%;
  height: 100%;
  z-index: 99;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  filter: alpha(opacity=30);
}
.filter-iframe {
  position: absolute;
  visibility: inherit;
  top: 0px;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 55;
  filter: alpha(opacity=30);
}
.price-tips {
  color: #f56c6c;
  margin-left: 20px;
}
.object-cont {
  display: inline-block;
}
.object-main {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  text-align: center;
  .object-cont {
    display: inline-block;
    padding: 10px;
  }
}
.errorSpan{
  color: #f56c6c;
  margin-left: 30px;
}
</style>
<style lang="less">
.detail-main {
  top: 0 !important;
  margin-top: 0px !important;
  .el-dialog {
    margin-top: 20px !important;
    width: 60%;
  }
}
.park-right{
  .el-table__header{
    width:auto!important;
  }
}
.inout-cont{
  .table-cont {
    .el-table__header{
      width:auto!important;
    }
  }
}
#dialogConfieVisible .el-dialog{
  opacity: 0;
}
</style>
