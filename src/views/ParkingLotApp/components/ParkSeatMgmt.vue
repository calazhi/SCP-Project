<template>
  <div id="parkSeat" style="height:100%;">
    <el-container style="height:100%;">
      <el-aside class="park-tree">
        <el-tree :data="treeData" :props="defaultProps" ref="tree" 
        @node-click="handleNodeClick" v-if="treeData.length > 0 " style="width:900px;"></el-tree>
        <p class="tree-nodata" v-else>暂无数据</p>
      </el-aside>
      <el-main>
        <div>
          <section class="from-btns">
            <el-button type="primary" @click="addCarSeat" >新增</el-button>
            <el-button type="danger" @click="batchCarSeat">批量删除</el-button>
            <el-button type="primary" v-if="queryType==1" @click="setEnable">设为不可用</el-button>
            <el-button type="primary" v-if="queryType==0" @click="setEnable">设为正常</el-button>
            <el-button type="primary" @click="parkSeatUpload">导入</el-button>
            <upload title="车位导入" :action="'/scp-parkinglotapp/parkSeatMgmt/uploadData?defaultId='+defaultId" 
              downloadUrl="/scp-parkinglotapp/file/downloadTemplateFile?template=parkSeat" tips="请选择EXCEL文件！" ref='parkSeatUpload'  @search="research">
            </upload>
          </section>
          <el-form :inline="true">
            <el-select v-model="queryType" placeholder="全部" class="mr15" @change="typeChange">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-form-item>
              <el-input placeholder="请输入车位编号" v-model="queryValue"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryByNum">查询</el-button>
            </el-form-item>
          </el-form>
          <div class="fix-table-bar">
            <el-table :data="tableData" ref="carSeatData" @sort-change = "sortTable" 
              @selection-change="handleSelectionChange" max-height="680" border style="width: 100%">
              <el-table-column type="selection" width="60"></el-table-column>
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="code" sortable = "custom" label="车位编号" ></el-table-column>
              <el-table-column prop="mode" label="适用车型" :formatter="modeFormat"></el-table-column>
              <!-- <el-table-column prop="propertyRight" label="车位产权" :formatter="propeFormat"></el-table-column> -->
              <el-table-column prop="carportEnable" label="是否可用" :formatter="enableFormat"></el-table-column>
              <el-table-column prop="remark" label="NC_ID" min-width="100" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="editCarSeat(scope.$index,scope.row)" >修改</el-button>
                  <el-button type="danger" size="small" @click="delCarSeat(scope.$index,scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-col class="toolbar">
            <el-pagination @size-change="seatSizeChange" @current-change="seatFindPage" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </el-col>
        </div>
      </el-main>
    </el-container>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="closeDialog">
      <el-form ref="carSeatForm" :model="carSeatForm" :rules="rules" label-width="200px" id="carSeatForm">
        <el-form-item label="车位编号" prop="code">
          <el-input v-model="carSeatForm.code" style="width:60%;" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="车位组织">
          <el-popover width="400" trigger="click" v-model="treeVisible">
            <div class="org-seatpark">
              <el-tree :data="treeData" :props="defaultProps" ref="tree" @node-click="editSeatOrg"></el-tree>
            </div>
            <el-input style="width:60%;" v-model="carSeatForm.orgName" placeholder="请选择所属组织" :readonly="true" prefix-icon="el-icon-tickets" slot="reference"></el-input>
            <div class="tree-confirm">
              <el-button size="mini" @click="onCancelTreePop">取消</el-button>
              <el-button type="primary" size="mini" @click="onConfirmTreePop">确定</el-button>
            </div>
          </el-popover>
          <!-- <el-input v-model="carSeatForm.orgName" style="width:60%;" :disabled = "true"></el-input> -->
        </el-form-item>
        <el-form-item label="适用车型">
          <el-select :disabled="false" v-model="carSeatForm.mode" @change = "changeSelect">
            <el-option v-for="item in carModeOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="车位产权" prop="propertyRight">
          <el-select :disabled="false" v-model="carSeatForm.propertyRight" >
            <el-option
              v-for="item in propertOpt"
              :key="item.propValue"
              :label="item.label"
              :value="item.propValue">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="是否可用" prop="carportEnable">
          <el-select :disabled="false" v-model="carSeatForm.carportEnable">
            <el-option
              v-for="item in enableOpt"
              :key="item.enableValue"
              :label="item.label"
              :value="item.enableValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定车位探测器设备">
          <el-input v-model="carSeatForm.detectorName" style="width:60%;" :disabled = "true"></el-input>
          <i class="el-icon-search" @click="openDevice('3061')" title="选择车位探测器设备"></i>
        </el-form-item>
        <el-form-item label="绑定车牌显示器设备">
          <el-input v-model="carSeatForm.screenName" style="width:60%;" :disabled = "true"></el-input>
          <i class="el-icon-search" @click="openDevice('3062')" title="选择车牌显示器设备"></i>
        </el-form-item>
        <el-form-item label="自定义车牌显示屏显示信息">
          <section>
              <div class="label-span">
                <span>第一行</span>
                <el-input :maxlength = "10" placeholder="请输入0-10个字符" 
                style="margin-bottom:15px" v-model="carSeatForm.screenInfoFst"></el-input>
              </div>
              <div class="label-span">
                <span>第二行</span><el-input type="textarea" placeholder="请输入0-128个字符" 
                :maxlength = "128" :rows = "2" v-model="carSeatForm.screenInfoScd"></el-input>
              </div>
          </section>
          <!-- <el-input type="textarea" :maxlength = "256" :rows = "2" v-model="carSeatForm.screenInfo"></el-input> -->
        </el-form-item>	
        <el-form-item label="绑定车位锁设备" prop="lockCode">
          <el-input v-model="carSeatForm.lockCode" style="width:60%;"></el-input>
          <!-- <i class="el-icon-search" @click="openDevice('lock')" title="选择车位锁设备"></i> -->
        </el-form-item>
        <el-form-item label="绑定车位锁控制器" prop="lockControllerCode">
          <el-input v-model="carSeatForm.lockControllerCode" style="width:60%;"></el-input>
          <!-- <i class="el-icon-search" @click="openDevice('lock')" title="选择车位锁设备"></i> -->
        </el-form-item>
        <el-form-item label="NC_ID" prop="remark">
          <el-input :maxlength = "64" placeholder="请输入0到64个字符"
           v-model="carSeatForm.remark"></el-input>
        </el-form-item>				
        <el-form-item style="text-align: right">
          <el-button @click="cannelDialog('carSeatForm')">取 消</el-button>
          <!-- <el-button type="primary" @click="resetData('carSeatForm')" id="resetForm">重置</el-button> -->
          <el-button type="primary" @click="saveData('carSeatForm')">保  存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="innerTitle" :visible.sync="detectorVisible" append-to-body style="width:120%;left:-10%;" :before-close="closeDeviceDialog">
      <section>
        <div class="tree-left">
          <el-tree :data="treeData" node-key="uuid" ref="tree" highlight-current :props="defaultProps" @node-click="orgDeviceNodeClick" style="width:800px;"></el-tree>
        </div>
        <div class="table-right">         
          <el-form :inline="true">
          <el-form-item>
            <el-input placeholder="请输入设备名称" v-model="queryDeviceValue"></el-input>
            <el-input type="text" style="display:none" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryByDeviceName">查询</el-button>
          </el-form-item>
        </el-form>
          <div class="table-scroll">
            <el-table :data="dataDevice" @current-change="handleCurrentChangeDevice" highlight-current-row max-height = "400" style="width:100%">
              <el-table-column type="index" label="序号" width="80px">
              </el-table-column>
              <!-- <el-table-column type="selection" width="60px" :selectable="selectable"></el-table-column> -->
              <!-- <el-table-column prop="deviceID" :show-overflow-tooltip="true" label="设备编号" width="100px">
              </el-table-column> -->
              <el-table-column prop="deviceName" :show-overflow-tooltip="true" label="设备名" width="150px">
              </el-table-column>
              <el-table-column prop="deviceModel" :show-overflow-tooltip="true" label="型号" width="120px">
              </el-table-column>
              <el-table-column prop="deviceIP" :show-overflow-tooltip="true" label="设备IP"  width="180px">
              </el-table-column>
              <el-table-column prop="deviceStatus" label="绑定状态" :formatter="modeDeviceStatusFormat">
              </el-table-column>
            </el-table>
            <el-col class="toolbar">
            <el-pagination @size-change="deviceSizeChange" @current-change="deviceFindPage" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </el-col>
          </div>
        </div>
      </section>
      <section slot="footer" class="dialog-footer" style="text-align:right">
        <el-button @click="closeDeviceDialog">取 消</el-button>
        <el-button type="primary" @click="selectOrg">确认</el-button>
      </section>
    </el-dialog>
  </div>
</template>
<script>
import Upload from './Upload'
import {
  // queryParkList,
  addParkSeat,
  editParkSeat,
  batchDelSeat,
  queryParkSeatByKey,
  updateParkSeatEnable,
  getOrgInfo,
  queryDeviceByOrgId,
  carDictData,
  parkIsExist,
  checkLockIsBind
} from '@/views/ParkingLotApp/apis'
export default {
  components: {
    Upload
  },
  data () {
    var isExist = (rule, value, callback) => {
      value = encodeURI(value)
      if (this.isEdit) {
        callback()
      }
      parkIsExist(value).then(function (response) {
        let errorcode = response.code
        if (errorcode === '0') {
          if (response.data.isExist) {
            callback(new Error('该车位编号已存在!'))
          } else {
            callback()
          }
        }
      })
    }
    var isChecked = (rule, value, callback) => {
      let patrn = /^[0-9a-zA-Z]+$/
      if (value) {
        if (patrn.test(value)) {
          callback()
        } else {
          callback(new Error('只能是字母、数字'))
        }
      } else {
        callback()
      }
    }
    var isCheckedBind = (rule, value, callback) => {
      value = encodeURI(value)
      console.log('车位锁:' + this.originalLockCode)
      if (this.originalLockCode === value) {
        callback()
      }
      if (value) {
        checkLockIsBind(value).then(function (response) {
          let errorcode = response.code
          if (errorcode === '0') {
            if (response.data.lockIsBind) {
              callback(new Error('该车位锁已绑定车位!'))
            } else {
              callback()
            }
          }
        })
      } else {
        callback()
      }
    }
    return {
      originalLockCode: '',
      order: 0,
      queryValue: '',
      queryDeviceValue: '',
      defaultOrgId: '',
      currentPage: 1,
      tableData: [],
      selections: [],
      selectDevice: [],
      dataDevice: [],
      total: 0,
      pageSize: 10,
      defaultId: '',
      editOrgId: '',
      dialogVisible: false,
      leadingDialogVisible: false,
      detectorVisible: false,
      isSelectOrg: false,
      // seatLoad: true,
      deviceAbleSelect: true,
      innerTitle: '',
      treeData: [],
      dialogTitle: '新增车位',
      isEdit: false,
      treeVisible: false,
      orgType: '',
      orgName: '',
      seatOrg: '',
      queryType: '-1',
      carModeOpt: [],
      propertOpt: [
        {
          propValue: '0',
          label: '公共产权'
        },
        {
          propValue: '1',
          label: '个人产权'
        }
      ],
      carportOpt: [
        {
          carPortValue: '0',
          label: '未分配'
        },
        {
          carPortValue: '1',
          label: '已分配'
        }
      ],
      enableOpt: [
        {
          enableValue: '1',
          label: '正常'
        },
        {
          enableValue: '0',
          label: '不可用'
        }
      ],
      // defaultProps: {
      //   children: 'subParkingLots',
      //   label: 'parkingName'
      // },
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      carSeatForm: {
        id: '',
        name: '',
        orgName: '',
        code: '',
        mode: '0',
        propertyRight: '',
        location: '',
        detectorCode: '',
        screenCode: '',
        lockCode: '',
        lockControllerCode: '',
        screenInfo: '',
        screenInfoFst: '',
        screenInfoScd: '',
        remark: '',
        detectorName: '',
        screenName: '',
        lockName: '',
        carportEnable: ''
      },
      options: [
        {
          value: '-1',
          label: '全部'
        },
        {
          value: '0',
          label: '不可用'
        },
        {
          value: '1',
          label: '正常'
        }
      ],
      rules: {
        code: [
          { required: true, message: '请输入车位编号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
          { validator: isChecked, trigger: 'blur' },
          { validator: isExist, trigger: 'blur' }
        ],
        lockCode: [
          { validator: isChecked, trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' },
          { validator: isCheckedBind, trigger: 'blur' }
        ],
        lockControllerCode: [
          { validator: isChecked, trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ],
        remark: [
          { max: 256, message: '最多可输入256个字符', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.loadTreeData()
    this.getCarDictData()
  },
  methods: {
    queryByDeviceName () {
      let _this = this
      let key = _this.queryDeviceValue
      key = encodeURI(key)
      _this.dataDevice = []
      queryDeviceByOrgId(_this.currentPage, _this.pageSize, _this.defaultOrgId, key, _this.selectName).then(function (response) {
        if (response.code === '0' && response.data !== null) {
          for (let devices of response.data.rows) {
            console.log(_this.selectName)
            // if (_this.selectName === 'detector' && (devices.deviceTypeCode === '2007' || devices.deviceTypeCode === '2022' || devices.deviceTypeCode === '3040')) {
            //   _this.dataDevice.push(devices)
            // } else if (_this.selectName === 'screen' && (devices.deviceTypeCode === '3033' || devices.deviceTypeCode === '3034')) {
            //   _this.dataDevice.push(devices)
            // } else if (_this.selectName === 'lock') {
            //   _this.dataDevice.push(devices)
            // }
            _this.dataDevice.push(devices)
          }
          _this.total = response.data.total
          console.log(_this.dataDevice)
          // _this.deviceInfo.deviceName = response.data.deviceName
          // _this.deviceInfo.deviceModel = response.data.deviceModel
          // _this.deviceInfo.deviceIP = response.data.deviceIP
          // console.log(_this.deviceInfo)
        } else {
          _this.dataDevice = []
        }
      })
    },
    modeDeviceStatusFormat (row, column) {
      var state = row.deviceStatus
      if (state === true) {
        return '已绑定'
      } else if (state === false) {
        return '未绑定'
      }
      return '未绑定'
    },
    selectable (row, index) {
      return !row.deviceStatus || row.deviceTypeCode === '3061'
    },
    selectEnable (val) {
      return !val.deviceStatus || val.deviceTypeCode === '3061'
    },
    getCarDictData () { // 获取下拉框的基础数据
      let _this = this
      carDictData()
        .then(function (response) {
          let errorcode = response.code
          if (errorcode === '0') {
            _this.carModeOpt = _this.formatString(response.data.CAR_MODE_DICT)
          } else {
            _this.$message.error(response.data.errormsg)
          }
        })
        .catch(() => {})
    },
    formatString (dataString) {
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
    loadTreeData () {
      this.loading2 = true
      var _this = this
      _this.getOrgInfo()
    },
    closeDeviceDialog () {
      this.queryDeviceValue = ''
      this.detectorVisible = false
    },
    getOrgInfo () {
      let _this = this
      getOrgInfo()
        .then(function (response) {
          _this.defaultId = response.data.uuid
          if (response.code === '0') {
            _this.queryByNum()
            _this.treeData.push(response.data)
          } else {
            _this.treeData = []
            _this.tableData = []
            // _this.seatLoad = false
          }
        })
        .catch((error) => {
          console.log(error)
          _this.tableData = []
          // _this.seatLoad = false
        })
    },
    handleNodeClick (data) {
      this.isSelectOrg = true
      this.defaultId = data.uuid
      this.orgType = data.orgType
      this.orgName = data.name
      this.carSeatList(this.currentPage, this.pageSize, data.uuid)
    },
    typeChange () {  // 查询
      this.queryByNum()
    },
    // 导入
    parkSeatUpload: function () {
      if (this.isSelectOrg && this.orgType === '10' && this.orgName) {
        this.$refs['parkSeatUpload'].openDialog()
      } else {
        this.$message({
          message: '请选择停车场-小片区组织',
          type: 'warning'
        })
      }
    },
    research: function () {
      this.queryByNum()
    },
    sortTable () {
      if (this.order === 0) {
        this.order = 1
      } else {
        this.order = 0
      }
      this.queryByNum()
    },
    // 查询车位
    queryByNum () {
      var _this = this
      // _this.seatLoad = true
      let key = _this.queryValue.trim()
      key = encodeURI(key)
      queryParkSeatByKey(_this.currentPage, _this.pageSize, key, _this.queryType, _this.defaultId, _this.order).then(function (response) {
        // _this.seatLoad = false
        if (response.code === '0') {
          _this.tableData = response.data.rows
          _this.total = response.data.total
        }
      }).catch(function () {
        // _this.seatLoad = false
      })
    },
    openDevice (deveName) {
      this.selectName = deveName
      this.detectorVisible = true
      this.queryValue = ''
      this.currentPage = 1
      this.pageSize = 10
      if (deveName === '3061') {
        this.innerTitle = '选择车位探测器设备'
        this.getDeviceByOrgId(this.currentPage, this.pageSize, this.treeData[0].uuid)
      } else if (deveName === '3062') {
        this.innerTitle = '选择车牌显示器设备'
        this.getDeviceByOrgId(this.currentPage, this.pageSize, this.treeData[0].uuid)
      } else if (deveName === 'lock') {
        this.innerTitle = '选择车位锁设备'
        this.getDeviceByOrgId(this.currentPage, this.pageSize, this.treeData[0].uuid)
      }
    },
    carSeatList (currentPage, pageSize, parkId) {
      this.loading2 = true
      var _this = this
      let key = _this.queryValue
      queryParkSeatByKey(_this.currentPage, _this.pageSize, key, _this.queryType, _this.defaultId, _this.order)
        .then(function (response) {
          if (response.code === '0') {
            _this.tableData = response.data.rows
            _this.total = response.data.total
          }
        })
        .catch(
          function (error) {
            this.loading2 = false
            console.log(error)
          }.bind(this)
        )
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    changeSelect (val) {
      this.carSeatForm.mode = val
    },
    modeFormat (row, column) {
      var mode = row.mode
      var modeName = ''
      var carModeOpt = this.carModeOpt
      for (var i = 0; i < carModeOpt.length; i++) {
        if (mode === carModeOpt[i].value) {
          modeName = carModeOpt[i].label
          break
        }
      }
      return modeName
    },
    // propeFormat (row, column) {
    //   let prope = row.propertyRight
    //   if (prope === '0') {
    //     return '公共产权'
    //   } else if (prope === '1') {
    //     return '个人产权'
    //   }
    // },
    enableFormat (row, column) {
      let prope = row.carportEnable
      if (prope === '0') {
        return '不可用'
      } else if (prope === '1') {
        return '正常'
      }
    },
    cannelDialog (carSeatForm) {
      this.$refs[carSeatForm].resetFields()
      this.dialogVisible = false
    },
    addCarSeat () {
      let _this = this
      console.log(_this.orgType)
      if (_this.isSelectOrg && _this.orgType === '10' && _this.orgName) {
        _this.isEdit = false
        _this.originalLockCode = ''
        _this.carSeatForm.id = ''
        _this.carSeatForm.code = ''
        _this.carSeatForm.orgName = ''
        _this.carSeatForm.remark = ''
        _this.carSeatForm.mode = '0'
        _this.carSeatForm.propertyRight = '0'
        _this.carSeatForm.carportEnable = '1'
        _this.dialogTitle = '新增车位'
        _this.carSeatForm.orgName = _this.orgName
        _this.carSeatForm.detectorCode = ''
        _this.carSeatForm.screenInfo = ''
        _this.carSeatForm.screenInfoFst = ''
        _this.carSeatForm.screenInfoScd = ''
        _this.carSeatForm.screenCode = ''
        _this.carSeatForm.lockCode = ''
        _this.carSeatForm.detectorName = ''
        _this.carSeatForm.screenName = ''
        _this.carSeatForm.lockName = ''
        _this.carSeatForm.lockControllerCode = ''
        _this.dialogVisible = true
      } else {
        _this.$message({message: '请选择停车场-小片区组织', type: 'warning'})
      }
    },
    leadingIn () {
      var _this = this
      _this.carSeatForm.remark = ''
      _this.dialogTitle = '导入车位信息'
      _this.leadingDialogVisible = true
    },
    editCarSeat (index, rows) {
      this.isEdit = true
      this.dialogTitle = '修改车位'
      console.log('rows' + JSON.stringify(rows))
      this.originalLockCode = rows.lockCode
      this.carSeatForm.id = rows.id
      this.editOrgId = rows.orgId
      this.carSeatForm.code = rows.code
      this.carSeatForm.mode = rows.mode
      this.carSeatForm.propertyRight = rows.propertyRight
      this.carSeatForm.remark = rows.remark
      this.carSeatForm.carportEnable = rows.carportEnable
      this.carSeatForm.location = rows.location
      this.carSeatForm.detectorCode = rows.detectorCode
      this.carSeatForm.screenInfo = rows.screenInfo
      this.carSeatForm.screenInfoFst = rows.screenInfoFst || ''
      this.carSeatForm.screenInfoScd = rows.screenInfoScd || ''
      this.carSeatForm.screenCode = rows.screenCode
      this.carSeatForm.lockCode = rows.lockCode
      this.carSeatForm.detectorName = rows.detectorName
      this.carSeatForm.screenName = rows.screenName
      this.carSeatForm.lockName = rows.lockName
      this.carSeatForm.orgName = rows.orgName
      this.carSeatForm.lockControllerCode = rows.lockControllerCode || ''
      this.dialogVisible = true
    },
    // 保存数据
    saveData (seatForm) {
      var _this = this
      if (_this.carSeatForm.lockCode === 'null' || _this.carSeatForm.lockCode === null) {
        _this.carSeatForm.lockCode = ''
      }
      if (_this.carSeatForm.lockControllerCode === null || _this.carSeatForm.lockControllerCode === 'null') {
        _this.carSeatForm.lockControllerCode = ''
      }
      if ((_this.carSeatForm.lockCode === '' && _this.carSeatForm.lockControllerCode !== '') ||
         (_this.carSeatForm.lockCode !== '' && _this.carSeatForm.lockControllerCode === '')) {
        _this.$message({type: 'warning', message: '车位锁设备与控制器必须同时为空或者不为空'})
      } else {
        _this.$refs.carSeatForm.validate(valid => {
          if (valid) {
            var _params = {
              id: _this.carSeatForm.id,
              name: _this.carSeatForm.name,
              orgId: _this.defaultId,
              code: _this.carSeatForm.code,
              mode: _this.carSeatForm.mode,
              propertyRight: _this.carSeatForm.propertyRight,
              location: _this.carSeatForm.location,
              carportEnable: _this.carSeatForm.carportEnable,
              screenInfo: _this.carSeatForm.screenInfo,
              screenInfoFst: _this.carSeatForm.screenInfoFst,
              screenInfoScd: _this.carSeatForm.screenInfoScd,
              orgName: _this.carSeatForm.orgName,
              detectorCode: _this.carSeatForm.detectorCode,
              screenCode: _this.carSeatForm.screenCode,
              lockCode: _this.carSeatForm.lockCode,
              remark: _this.carSeatForm.remark,
              detectorName: _this.carSeatForm.detectorName,
              screenName: _this.carSeatForm.screenName,
              lockControllerCode: _this.carSeatForm.lockControllerCode,
              lockName: _this.carSeatForm.lockName
            }
            console.log(_params)
            console.log(_this.$refs)
            if (this.isEdit) {
              _params.orgId = _this.editOrgId
              editParkSeat({
                params: JSON.stringify(_params)
              })
                .then(function (response) {
                  if (response.code === '0') {
                    _this.$message({
                      type: 'success',
                      message: '修改成功'
                    })
                    _this.carSeatList(
                    _this.currentPage,
                    _this.pageSize,
                    _this.defaultId
                  )
                    // _this.$refs[seatForm].resetFields()
                    _this.dialogVisible = false
                  } else {
                    // _this.$alert('修改失败', '提示', {
                    //   confirmButtonText: '确定',
                    //   callback: action => {}
                    // })
                    _this.$message.error({message: response.message || '修改失败', type: 'error'})
                  }
                })
                .catch(function () {})
            } else {
              _params.orgId = _this.defaultId
              addParkSeat({
                params: JSON.stringify(_params)
              })
                .then(function (response) {
                  if (response.code === '0') {
                    _this.$message({
                      type: 'success',
                      message: '增加成功'
                    })
                    _this.carSeatList(
                      _this.currentPage,
                      _this.pageSize,
                      _this.defaultId
                    )
                    _this.$refs[seatForm].resetFields()
                    _this.dialogVisible = false
                  } else {
                    // _this.$alert('增加失败', '提示', {
                    //   confirmButtonText: '确定',
                    //   callback: action => {}
                    // })
                    _this.$message.error({message: response.message || '增加失败', type: 'error'})
                  }
                })
                .catch(function () {})
            }
          }
        })
      }
    },
    // checkLock () {
    //   if ((this.carSeatForm.lockCode === '' && this.carSeatForm.lockControllerCode !== '') ||
    //      (this.carSeatForm.lockCode !== '' && this.carSeatForm.lockControllerCode === '')) {
    //     alert('false')
    //   } else {
    //     alert('true')
    //   }
    // },
    delCarSeat (index, rows) {
      var _this = this
      _this.$confirm('是否要删除此车位信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          batchDelSeat(rows.id)
            .then(function (response) {
              if (response.code === '0') {
                _this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                _this.carSeatList(_this.currentPage, _this.pageSize, _this.defaultId)
              } else if (response.code === 'parkinglot.carport.package.plate.number.repeate') {
                _this.$alert('车位已被授权，删除失败!', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {}
                })
              } else {
                _this.$alert('删除失败', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {}
                })
              }
            })
            .catch(() => {})
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    batchCarSeat () {
      var _this = this
      let ids = []
      for (let i = 0; i < this.selections.length; i++) {
        ids.push(this.selections[i].id)
      }
      if (ids.length > 0) {
        _this.$confirm('是否要删除此车位信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          batchDelSeat(ids)
            .then(function (response) {
              if (response.code === '0') {
                _this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                _this.carSeatList(_this.currentPage, _this.pageSize, _this.defaultId)
              } else if (response.code === 'parkinglot.carport.package.plate.number.repeate') {
                _this.$alert('车位已被授权，删除失败!', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {}
                })
              } else {
                _this.$alert('删除失败', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {}
                })
              }
            })
            .catch(() => {})
        })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.$message({
          type: 'info',
          message: '请选择需要删除的车位'
        })
      }
    },
    setEnable () {
      var _this = this
      let parkSeatEnable = []
      const map = new Map()
      for (let i = 0; i < this.selections.length; i++) {
        parkSeatEnable.push(this.selections[i].id + '@' + this.selections[i].carportEnable)
      }
      console.log('map' + [...map])
      _this.$confirm('此操作将永久修改车位信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        updateParkSeatEnable(parkSeatEnable)
          .then(function (response) {
            if (response.code === '0') {
              _this.$message({
                type: 'success',
                message: '设置成功'
              })
              _this.carSeatList(_this.currentPage, _this.pageSize, _this.defaultId)
            } else if (response.code === '100') {
              _this.$message({
                type: 'fail',
                message: '选择车位包含可用或者不可用，请选择一致车位'
              })
            } else {
              _this.$alert('设置失败', '提示', {
                confirmButtonText: '确定',
                callback: action => {}
              })
            }
          })
          .catch(() => {})
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getSelectData: function () {
      return this.selections
    },
    handleSelectionChange: function (val) {
      this.selections = val
    },
    seatSizeChange (val) {
      this.pageSize = val
      this.carSeatList(this.currentPage, this.pageSize, this.defaultId)
    },
    seatFindPage (val) {
      this.currentPage = val
      this.carSeatList(this.currentPage, this.pageSize, this.defaultId)
    },
    deviceSizeChange (val) {
      this.pageSize = val
      // this.carSeatList(this.currentPage, this.pageSize, this.defaultId)
      this.getDeviceByOrgId(this.currentPage, this.pageSize, this.defaultId)
    },
    deviceFindPage (val) {
      this.currentPage = val
      this.getDeviceByOrgId(this.currentPage, this.pageSize, this.defaultId)
      // this.carSeatList(this.currentPage, this.pageSize, this.defaultId)
    },
    selectOrg () {
      if (this.selectName === '3061') {
        if (this.selectDevice) {
          this.carSeatForm.detectorCode = this.selectDevice.deviceID || this.carSeatForm.detectorCode
          this.carSeatForm.detectorName = this.selectDevice.deviceName || this.carSeatForm.detectorName
        } else {
          this.carSeatForm.detectorCode = this.carSeatForm.detectorCode
          this.carSeatForm.detectorName = this.carSeatForm.detectorName
        }
        // this.carSeatForm.detectorCode = this.selectDevice.deviceID || this.carSeatForm.detectorCode
        // this.carSeatForm.detectorName = this.selectDevice.deviceName || this.carSeatForm.detectorName
      } else if (this.selectName === '3062') {
        if (this.selectDevice) {
          this.carSeatForm.screenCode = this.selectDevice.deviceID || this.carSeatForm.screenCode
          this.carSeatForm.screenName = this.selectDevice.deviceName || this.carSeatForm.screenName
        } else {
          this.carSeatForm.screenCode = this.carSeatForm.screenCode
          this.carSeatForm.screenName = this.carSeatForm.screenName
        }
        // this.carSeatForm.screenCode = this.selectDevice.deviceID || this.carSeatForm.screenCode
        // this.carSeatForm.screenName = this.selectDevice.deviceName || this.carSeatForm.screenName
      } else if (this.selectName === 'lock') {
        if (this.selectDevice) {
          this.carSeatForm.lockCode = this.selectDevice.deviceID || this.carSeatForm.lockCode
          this.carSeatForm.lockName = this.selectDevice.deviceName || this.carSeatForm.lockName
        } else {
          this.carSeatForm.lockCode = this.carSeatForm.lockCode
          this.carSeatForm.lockName = this.carSeatForm.lockName
        }
        // this.carSeatForm.lockCode = this.selectDevice.deviceID || this.carSeatForm.lockCode
        // this.carSeatForm.lockName = this.selectDevice.deviceName || this.carSeatForm.lockName
      }
      if (this.deviceAbleSelect) {
        this.detectorVisible = false
      } else {
        this.$message({
          type: 'warning',
          message: '请选择设备'
        })
      }
    },
    handleCurrentChangeDevice (val) {
      this.deviceAbleSelect = true
      console.log(val)
      if (val && !this.selectEnable(val)) {
        this.deviceAbleSelect = false
        this.$message({
          type: 'warning',
          message: '该设备已绑定'
        })
      } else {
        this.deviceAbleSelect = true
        this.selectDevice = val
      }
    },
    orgDeviceNodeClick (data) {
      console.log(data)
      this.getDeviceByOrgId(this.currentPage, this.pageSize, data.uuid)
      this.defaultOrgId = data.uuid
      // this.queryByDeviceName(data.uuid)
    },
    closeDialog (done) {
      done()
      this.$refs['carSeatForm'].resetFields()
    },
    editSeatOrg (data) {
      this.seatOrg = data
    },
    onCancelTreePop () {
      this.treeVisible = false
    },
    onConfirmTreePop () {
      console.log(this.seatOrg)
      if (this.seatOrg.orgType === '10') {
        this.carSeatForm.orgName = this.seatOrg.name
        this.editOrgId = this.seatOrg.uuid
        this.treeVisible = false
      } else {
        this.$message({
          type: 'warning',
          message: '请选择停车场-小片区组织'
        })
      }
    },
    getDeviceByOrgId (currentPage, pageSize, orgId) {
      let _this = this
      let key = _this.queryDeviceValue
      key = encodeURI(key)
      _this.dataDevice = []
      queryDeviceByOrgId(_this.currentPage, _this.pageSize, orgId, key, _this.selectName).then(function (response) {
        if (response.code === '0' && response.data !== null) {
          for (let devices of response.data.rows) {
            console.log(_this.selectName)
            // if (_this.selectName === 'detector' && (devices.deviceTypeCode === '2007' || devices.deviceTypeCode === '2022' || devices.deviceTypeCode === '3040')) {
            //   _this.dataDevice.push(devices)
            // } else if (_this.selectName === 'screen' && (devices.deviceTypeCode === '3033' || devices.deviceTypeCode === '3034')) {
            //   _this.dataDevice.push(devices)
            // } else if (_this.selectName === 'lock') {
            //   _this.dataDevice.push(devices)
            // }
            _this.dataDevice.push(devices)
          }
          _this.total = response.data.total
          console.log(_this.dataDevice)
          // _this.deviceInfo.deviceName = response.data.deviceName
          // _this.deviceInfo.deviceModel = response.data.deviceModel
          // _this.deviceInfo.deviceIP = response.data.deviceIP
          // console.log(_this.deviceInfo)
        } else {
          _this.dataDevice = []
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/views/ParkingLotApp/assets/css/parkLotApp.less";
.toolbar {
  margin-top: 15px;
  text-align: right;
}
.tree-cont {
  float: left;
}
.table-cont {
  float: left;
}
.tree-left{
  display: inline-block;
  vertical-align: top;
  width: 30%;
  height: 500px;
  overflow: auto;
}
.table-right{
  display: inline-block;
  vertical-align: top;
  width: 68%;
}
.label-span{
  span{
    display: inline-block;
    line-height: 40px;
    margin-right: 25px;
  }
  > div{
    width: 50%;
    vertical-align: top;
  }
  
}
.org-seatpark{
  padding: 10px 0;
  max-height: 500px;
  min-height: 50px;
  overflow-y: auto;
}
.tree-confirm{
  text-align: right;
}
</style>
<style lang="less">
#parkSeat .el-dialog{
  margin-top:30px!important;
}
</style>

