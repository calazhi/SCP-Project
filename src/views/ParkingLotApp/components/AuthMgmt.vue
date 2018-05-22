<template>
    <el-main>
      <div>
      <section class="from-btns">
        <el-button type="primary" @click="addAuth" >新增</el-button>      
        <el-button type="danger" @click="deleteAuth">删除</el-button>
        <el-button type="primary" @click="authUpload">导入</el-button>
        <upload title="授权导入" action="/scp-parkinglotapp/authMgmt/uploadAuth" downloadUrl="/scp-parkinglotapp/file/downloadTemplateFile?template=auth" 
          tips="请选择EXCEL文件！" ref='authUpload' @search="research">
        </upload>
      </section>
      <el-form :model="queryForm" ref="queryForm" :rules="searchRules" :inline="true" style="line-height:40px">
        <span class="label-text">车位编号</span>
        <el-form-item prop="queryParkSeatCode">
            <el-input placeholder="请输入车位编号" v-model.trim="queryForm.queryParkSeatCode" ref="queryParkSeatCode" style="width:100%"></el-input>
        </el-form-item>
        <span class="label-text">人员姓名</span>
        <el-form-item prop="queryParkSeatCode">
            <el-input placeholder="请输入人员姓名" v-model.trim="queryForm.queryOwnerName" ref="queryParkSeatCode" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="queryByNum">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="fix-table-bar">
        <el-table :data="authData" ref="authData" max-height="680" @selection-change="handleSelectionChange" border style="width: 100%">
          <el-table-column type="selection" width="60"></el-table-column>
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="ownerName" label="人员姓名" ></el-table-column>
          <el-table-column prop="authParkNames" min-width="160" label="停车场名" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="ruleName" label="规则" min-width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="parkSeatCode" label="车位编号" min-width="100" :show-overflow-tooltip="true" ></el-table-column>
          <el-table-column prop="beginTime" label="开始时间" width="160" ></el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="160" ></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column fixed="right" label="操作" fit="true" width="220">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="editAuth(scope.$index,scope.row)">修改</el-button>
              <el-button size="mini" type="primary" @click="carPay(scope.$index,scope.row)">缴费</el-button>
              <el-button size="mini" type="primary" @click="paymentRecord(scope.$index,scope.row)">记录</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
        <el-col class="toolbar">
          <el-pagination :current-page="currentPage" @size-change="handleSizeChange" @current-change="findPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" background layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="50%" :before-close="closeDialog" :close-on-click-modal="false" :close-on-press-escape="false">
          <el-form ref="addAuthform" :model="addAuthform" :rules = "addAuthRules" label-width="80px">
            <el-form-item label="人员姓名" prop="name">
              <el-input v-model="addAuthform.name" :disabled="true"></el-input>
              <i class="el-icon-search" @click="selectFrom('auth')" v-show="isAdd"></i>
            </el-form-item>
            <el-form-item label="停车场" prop="parks">
              <el-input v-model="addAuthform.parks" :disabled="true"></el-input>
              <i class="el-icon-search" @click="selectFrom('park')"></i>
            </el-form-item>
            <el-form-item label="车位" prop="parkSeatCode">
              <el-input v-model="addAuthform.parkSeatCode" :disabled="true"></el-input>
              <i class="el-icon-search" @click="selectFrom('seat')"></i>
            </el-form-item>
            <el-form-item label="车位类型" prop="parkSeatType">
              <el-select v-model="addAuthform.parkSeatType" placeholder="请选择">
                <el-option
                v-for="item in seatStyle"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规则" prop="ruleId">
              <el-select v-model="addAuthform.ruleId" placeholder="请选择" :disabled = "!isAdd">
                <el-option
                v-for="item in ruleOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" placeholder="不超过256个字符" v-model="addAuthform.remark"></el-input>
              </el-form-item> 
            <el-form-item style="text-align:right;">
              <el-button @click="cannelAuth('addAuthform')">取 消</el-button>
              <el-button type="primary" @click="saveAuth">保 存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog width="50%" :title="dialogData" :visible.sync="innerCardVisible" id="dialogPark" :class="dialogPark?'dialogPark':''" append-to-body :before-close="closeOwnerDialog">
          <owner ref="diaglo" v-show="selectName ==='auth'"></owner>
          <section v-show="selectName === 'park'">
            <div class="park-dialog">
              <el-tree :props="defaultProps" :check-strictly = "true" ref="parkTree" height="400" default-expand-all :data="parkTreeData" 
              node-key="parkingCode" show-checkbox  @check-change="handleTreeChange"></el-tree>
            </div>
          </section>
          <section v-show="selectName === 'seat'">
            <div class="org-leftTree">
              <el-tree :data="selectParkTreeData" :check-strictly = "true" ref="seatParkTree"
              :props="defaultProps" default-expand-all @node-click="orgNodeClick" style="width:800px;"></el-tree>
            </div> 
            <article class="seatTable">
              <el-form :inline="true">
                <el-form-item>
                  <el-input placeholder="请输入车位编号" v-model="formParkSeatCode" style="width:100%"></el-input>
                  <el-input type="text" style="display:none" />
                </el-form-item>
                <el-form-item> <el-button type="primary" @click="querySeat">查询</el-button></el-form-item>
              </el-form>
                <el-table :data="authSeatData" ref="authSeatForm" highlight-current-row max-height="320" 
                  @current-change="selectAuthSeat" style="width: 100%" class="seat-table">
                  <el-table-column type="index" label="序号" width="60"></el-table-column>
                  <el-table-column prop="code" label="车位编号" ></el-table-column>
                  <el-table-column prop="mode" label="适用车型" ></el-table-column>
                  <el-table-column prop="remark" label="NC_ID"></el-table-column>
                </el-table>
              <el-col class="toolbar" style="text-align:right; margin:15px 0">
                <el-pagination @size-change="authSeatSizeChange"  @current-change="seatCurrentChange" :current-page="seatCurrPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" background layout="total, sizes, prev, pager, next" :total="seatTotal">
                </el-pagination>
              </el-col> 
            </article>
          </section>
          <section slot="footer" class="dialog-footer" style="text-align:right">
            <el-button @click="closeOwnerDialog">取 消</el-button>
            <el-button type="primary" @click="selectCardBtn">确认</el-button>
          </section>
        </el-dialog>
        <!-- 缴费弹出框 -->
        <el-dialog :title="payTitle" :visible.sync="dialogPayVisible" class="pay-popwin" :before-close="closePayDialog">
          <el-form :inline="true" ref="payAuthform" :model="payAuthform" :rules = "payAuthRule" label-width="120px" v-if="dialogPay">
            <el-form-item label="人员姓名">
              <el-input v-model="payAuthform.ownerName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="车位编码">
              <el-input v-model="payAuthform.parkSeatCode" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="规则">
              <el-input v-model="payAuthform.ruleName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="开始时间" v-show="payAuthform.authEndTime != ''">
              <span v-text="payAuthform.authStartTime"  class="disabled-text"></span>
            </el-form-item>
            <el-form-item label="结束时间" v-show="payAuthform.authEndTime != ''">
              <span v-text="payAuthform.authEndTime" class="disabled-text"></span>
            </el-form-item>
            <el-form-item label="开始时间" v-show="payAuthform.authEndTime == ''" prop="beginTime">
              <div class="block">
                <el-date-picker
                  v-model="payAuthform.beginTime" :editable="false"
                  type="datetime"
                  placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="缴费单位" style=" width:100%">
              <span v-text="payAuthform.payPrice" class="disabled-text"></span>
            </el-form-item>
            <el-form-item label="缴费数量" prop="amount">
              <el-input-number v-model="payAuthform.amount" :min="1" :max="12" @change="selectPrice"></el-input-number>
            </el-form-item>
            <el-form-item label="应缴金额" prop="payMoney">
              <el-input v-model="payAuthform.payMoney" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="备注" class="pay-ramker" style="width:100%">
              <el-input type="textarea" :maxlength="256" v-model="payAuthform.remark"></el-input>
            </el-form-item>
            <el-form-item style="text-align:right;width:100%">
              <el-button @click="cannelPay">取 消</el-button>
              <el-button type="primary" @click="toPay('payAuthform')">缴 费</el-button>
            </el-form-item>
          </el-form>
          <div v-else>
            <el-table :data="recordData" border style="width: 100%" max-height="500">
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="ownerName" label="人员姓名"></el-table-column>
              <el-table-column prop="parkSeatCode" label="车位编号" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="chargeMoney" label="缴费金额(元)"></el-table-column>
              <el-table-column prop="chargeTime" label="缴费时间" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
            <el-col class="toolbar" style="text-align:right; margin:15px 0">
              <el-pagination @size-change="paymentRecordSizeChange" @current-change="paymentRecordCurrentChange" :current-page="paymentRecordCurrentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" background layout="total, sizes, prev, pager, next" :total="paymentRecordTotal">
              </el-pagination>
            </el-col>
            <span slot="footer" class="text-center">
              <el-button type="primary" @click="dialogPayVisible = false">关 闭</el-button>
            </span>
          </div>
        </el-dialog>
      </div>
    </el-main>
</template>
<script>
import Upload from './Upload'
import owner from '@/views/ParkingLotApp/components/dialogs/Owner'
import {
  queryAuth,
  addAuth,
  editAuth,
  deleteAuthById,
  getMonthRule,
  getPayMent,
  toPay,
  queryParkList,
  getOrgInfo,
  queryUnAuthParkSeat,
  paymentRecord,
  getParkTreeSeat
} from '@/views/ParkingLotApp/apis'

export default {
  components: { owner, Upload },
  data () {
    let queryValid = (rule, value, callback) => {
      let regexp = new RegExp("[`·~!@#$%+^&*\\-_()=|{}'/\\\\:;'\"\",\\[\\].<>/?！#￥……&*（）——【】‘’；：”“。，、？]")
      if (regexp.test(value)) {
        callback(new Error('请勿输入特殊字符'))
      } else {
        callback()
      }
    }
    return {
      authData: [],
      parkTreeData: [],
      authSeatData: [],
      recordData: [],
      orgTreeData: [],
      selectParkTreeData: [],
      queryValueCar: '',
      carStatus: '',
      payAuthform: {
        authId: '',      //  id
        ownerName: '',   //  人员姓名
        ownerId: '',     //  人员ID
        seatCode: '',    //  车位编号
        rule: '',        //  规则
        startTime: '',   //  服务开始时间
        endTime: '',     //  服务结束时间
        beginTime: '',   // 第一次缴费，授权开始时间
        payPrice: '',    //  金额
        paypriceVal: '', //  金额值
        payUnit: '', // 缴费单位
        amount: '',       //  数量
        payMoney: ''    //  应缴金额
      },
      addAuthform: {
        name: '',
        car: '',
        parks: '',
        parksCodes: '',
        parkSeatCode: '',
        parkSeatType: '',
        ruleId: '',
        remark: ''
      },
      authStyle: 0,
      seatStyle: [{
        value: '1',
        label: '月保车位'
      }, {
        value: '2',
        label: '产权车位'
      }],
      ruleOpt: [],
      payStyle: [{
        value: '1',
        label: '微信'
      }, {
        value: '2',
        label: '支付宝'
      }],
      authId: '',
      queryForm: {
        queryOwnerName: '',
        queryParkSeatCode: ''
      },
      seatByPark: '',
      formParkSeatCode: '',
      total: 0,
      sizes: 10,
      currentPage: 1,
      seatCurrPage: 1,
      seatSize: 10,
      seatTotal: 0,
      dialogFormVisible: false,
      dialogPayVisible: false,
      innerCardVisible: true,
      dialogPark: false,
      selectName: 'auth',
      dialogTitle: '新增授权',
      innerTitle: '选择人员',
      payTitle: '缴费',
      dialogData: '选择卡号',
      dialogPay: true,
      selectAuth: [],
      selectParkCode: [],
      selectCardVal: [],
      selectParkData: [],
      selectCarData: [],
      selectSeatData: {},
      parkOrgId: '',
      ownerId: '',
      isAdd: false,
      innerVisible: false,
      addAuthRules: {
        name: [
          { required: true, message: '请选择人员', trigger: 'change' }
        ],
        parks: [
          { required: true, message: '请选择授权停车场', trigger: 'change' }
        ],
        parkSeatCode: [
          { required: true, message: '请选择授权车位', trigger: 'change' }
        ],
        parkSeatType: [
          { required: true, message: '请选择车位类型', trigger: 'change' }
        ],
        ruleId: [
          { required: true, message: '请输选择授权规则', trigger: 'change' }
        ],
        remark: [
          { max: 256, message: '最多可输入256个字符', trigger: 'change' }
        ]
      },
      payAuthRule: {
        beginTime: [
          { required: true, message: '请输入开始时间', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          {pattern: /^[0-9]*[1-9][0-9]*$/, message: '只能输入数字'}
        ]
      },
      searchRules: {
        queryOwnerName: [
          {validator: queryValid, trigger: 'change'}
        ],
        queryParkSeatCode: [
          {validator: queryValid, trigger: 'change'}
        ]
      },
      defaultProps: {
        children: 'subParkingLots',
        label: 'parkingName'
      },
      orgTreeProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      paymentRecordPageSize: 10,
      paymentRecordCurrentPage: 1,
      paymentRecordTotal: 0,
      paymentRecordAuthId: ''
    }
  },
  mounted () {
    this.loadAuthList(this.currentPage, this.sizes, this.queryForm.queryOwnerName, this.queryForm.queryParkSeatCode) // 获取权限数据
    this.getMonthRule()  // 获取月卡规则
    this.loadParkData() // 获取车场
    this.getOrgInfo()  // 获取组织树
    this.innerCardVisible = false
  },
  methods: {
    loadAuthList (currentPage, sizes, queryOwnerName, queryParkSeatCode) {
      let _this = this
      queryOwnerName = queryOwnerName.trim()
      queryParkSeatCode = queryParkSeatCode.trim()
      queryAuth(currentPage, sizes, queryOwnerName, queryParkSeatCode)
        .then(function (response) {
          var errorcode = response.code
          if (errorcode === '0') {
            _this.authData = response.data.rows
            _this.total = response.data.total
          } else {
            _this.$message.error(response.data.errormsg)
          }
        })
        .catch(function (error) {
          console.log(error)
        }
      )
    },
    queryByNum () {
      this.$refs['queryForm'].validate((valid) => {
        if (valid) {
          this.loadAuthList(this.currentPage, this.sizes, this.queryForm.queryOwnerName, this.queryForm.queryParkSeatCode)
        }
      })
    },
    getMonthRule () {
      let _this = this
      getMonthRule()
        .then(function (response) {
          var errorcode = response.code
          if (errorcode === '0') {
            _this.ruleOpt = _this.formatString(response.data.MONTH_CAR_RULE)
          } else {
            _this.$message.error(response.data.errormsg)
          }
        })
    },
    getOrgInfo () { // 获取组织树
      let _this = this
      getOrgInfo()
        .then(function (response) {
          _this.defaultId = response.data.uuid
          if (response.code === '0') {
            _this.orgTreeData = response.data
          }
        })
        .catch(() => {})
    },
    handleSelectionChange (val) {
      this.selectAuth = val
    },
    selectAuthSeat (val) {
      this.selectSeatData = val
    },
    addAuth () {
      this.addAuthform.ruleId = ''
      this.addAuthform.remark = ''
      this.addAuthform.parkSeatType = '1'
      this.dialogTitle = '新增授权'
      this.selectParkCode = []
      this.dialogFormVisible = true
      this.choiseCard = false
      this.authStyle = 0
      this.isAdd = true
    },
    deleteAuth () {
      let _this = this
      let authIds = []
      for (let i = 0; i < _this.selectAuth.length; i++) {
        authIds.push(_this.selectAuth[i].id)
      }
      if (authIds.length < 1) {
        _this.$message('请选择需要删除的授权信息')
        return false
      }
      _this
        .$confirm('是否要删除此授权信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          deleteAuthById(authIds)
            .then(function (response) {
              var errorcode = response.code
              if (errorcode === '0') {
                _this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                _this.loadAuthList(_this.currentPage, _this.sizes, _this.queryForm.queryOwnerName, _this.queryForm.queryParkSeatCode)
              } else {
                _this.$alert('删除失败', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {}
                })
              }
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    saveAuth () {
      let _this = this
      let parks = ''
      if (_this.selectParkCode.length !== 0) {
        parks = _this.selectParkCode.toString()
      } else {
        parks = _this.addAuthform.parksCodes
      }
      let paramsData = {
        id: '', // 授权ID
        ownerId: _this.ownerId, // 人员ID
        parks: parks, // 授权车场编号
        parkSeatCode: _this.addAuthform.parkSeatCode, // 授权车位编号
        parkSeatType: _this.addAuthform.parkSeatType, // 授权车位类型,1:月保,2：产权
        ruleId: _this.addAuthform.ruleId, // 规则ID
        remark: _this.addAuthform.remark // 备注
      }
      console.log('data ' + JSON.stringify(paramsData))
      if (_this.dialogTitle === '新增授权') {
        _this.$refs.addAuthform.validate((valid) => {
          if (valid) {
            addAuth({
              params: JSON.stringify(paramsData)
            }).then(function (response) {
              var errorcode = response.code
              if (errorcode === '0') {
                _this.dialogFormVisible = false
                _this.resetForm()
                _this.$message({
                  message: '保存成功！',
                  type: 'success'
                })
                _this.loadAuthList(_this.currentPage, _this.sizes, _this.queryForm.queryOwnerName, _this.queryForm.queryParkSeatCode)
              } else {
                _this.dialogFormVisible = false
                _this.$message.error(response.message || '授权失败!')
              }
            })
          }
        })
      } else {
        paramsData.id = _this.authId
        _this.$refs.addAuthform.validate((valid) => {
          if (valid) {
            editAuth({
              params: JSON.stringify(paramsData)
            }).then(function (response) {
              var errorcode = response.code
              if (errorcode === '0') {
                _this.dialogFormVisible = false
                _this.resetForm()
                _this.$message({
                  message: '修改成功！',
                  type: 'success'
                })
                _this.loadAuthList(_this.currentPage, _this.sizes, _this.queryForm.queryOwnerName, _this.queryForm.queryParkSeatCode)
                _this.selectParkData = []
              } else {
                _this.resetForm()
                _this.dialogFormVisible = false
                _this.$message.error(response.message || '修改授权信息失败!')
              }
            })
          }
        })
      }
    },
    editAuth (index, row) {
      console.log('row' + JSON.stringify(row))
      // 清空selectParkCode
      this.selectParkTreeData = []
      this.selectParkCode = []
      this.authId = row.id
      this.addAuthform.name = row.ownerName
      this.addAuthform.parks = row.authParkNames
      this.addAuthform.parksCodes = row.authParkCodes
      this.addAuthform.parkSeatCode = row.parkSeatCode
      this.addAuthform.parkSeatType = row.parkSeatType
      this.addAuthform.remark = row.remark
      this.addAuthform.ruleId = row.ruleId
      this.ownerId = row.ownerId
      this.dialogTitle = '修改授权'
      this.dialogFormVisible = true
      this.isAdd = false
    },
    carPay (index, row) {
      console.log(row)
      let _this = this
      _this.dialogPayVisible = true
      _this.dialogPay = true
      _this.payTitle = '缴费'
      getPayMent(row.id)
        .then(function (response) {
          _this.payAuthform = response.data
          _this.payAuthform.paypriceVal = response.data.billingUnitPrice
          _this.payAuthform.payPrice = (response.data.billingUnitPrice).toFixed(2) + ' ' + response.data.unitDesc // 缴费金额
          _this.payAuthform.payUnit = response.data.payUnit // 缴费单位
          _this.payAuthform.payMoney = response.data.billingUnitPrice
        })
        .catch(function (error) {
          console.log('获取缴费信息失败,error：' + error)
          _this.payAuthform.payPrice = ''
          _this.payAuthform.paypriceVal = ''
          _this.$message.error(error || '获取缴费信息失败')
        })
    },
    selectPrice (val) {
      if ((typeof Number(val) === 'number') && (typeof Number(this.payAuthform.payPrice) === 'number')) {
        this.payAuthform.payMoney = (Number(this.payAuthform.paypriceVal) * Number(val)).toFixed(2)
      }
    },
    toPay (payAuthform) { // 去缴费
      let _this = this
      let paramsData = {
        authId: _this.payAuthform.authId,
        authStartTime: _this.payAuthform.authStartTime,
        authEndTime: _this.payAuthform.authEndTime,
        beginTime: _this.payAuthform.beginTime,
        payUnit: _this.payAuthform.payUnit,
        amount: _this.payAuthform.amount,
        remark: _this.payAuthform.remark,
        payMoney: _this.payAuthform.payMoney
      }
      // _this.payAuthform
      console.log(JSON.stringify(paramsData))
      console.log(_this.$refs)
      _this.$refs['payAuthform'].validate((valid) => {
        if (paramsData.authStartTime !== '') {
          valid = true
        }
        console.log('valid : ' + valid)
        if (valid) {
          toPay({
            params: JSON.stringify(paramsData)
          }).then(function (response) {
            var errorcode = response.code
            if (errorcode === '0') {
              _this.dialogPayVisible = false
              _this.loadAuthList(_this.currentPage, _this.sizes, _this.queryForm.queryOwnerName, _this.queryForm.queryParkSeatCode)
              _this.$message({
                message: '缴费成功！',
                type: 'success'
              })
            } else {
              _this.dialogPayVisible = false
              _this.$message.error('缴费失败!')
            }
            _this.$refs[payAuthform].resetFields()
          })
        }
      })
    },
    loadParkData () {
      let _this = this
      queryParkList()
        .then(function (response) {
          if (response.code === '0') {
            _this.parkTreeData = response.data
          } else {
            _this.$message.error('查询失败!')
          }
        })
    },
    loadSeatData (currentPage, pageSize, orgId, formParkSeatCode) {
      let _this = this
      queryUnAuthParkSeat(currentPage, pageSize, orgId, formParkSeatCode.trim())
      .then(function (response) {
        let errorcode = response.code
        if (errorcode === '0') {
          _this.authSeatData = response.data.rows
          _this.seatTotal = response.data.total
        } else {
          _this.authSeatData = []
          _this.seatTotal = 0
          _this.$message.error(response.message)
        }
      })
    },
    handleTreeChange (data, ch, ca) {
      // console.log(data)
      // console.log(ch)
      // console.log(ca)
      let codes = []
      console.log(this.$refs.parkTree.getCheckedNodes())
      for (let i = 0; i < this.$refs.parkTree.getCheckedNodes().length; i++) {
        codes.push(this.$refs.parkTree.getCheckedNodes()[i].parkingCode)
      }
      console.log(codes)
      if (data.parentParkingCode && ch) {
        codes.push(data.parentParkingCode, data.parkingCode)
        this.$refs.parkTree.setCheckedKeys(codes)
      }
      this.selectParkData = this.$refs.parkTree.getCheckedNodes()
    },
    orgNodeClick (data) {
      // console.log(data)
      // console.info(data.parkOrgId)
      // console.info(this.formParkSeatCode)
      this.seatByPark = data.parkOrgId
      this.loadSeatData(this.seatCurrPage, this.seatSize, this.seatByPark, this.formParkSeatCode)
    },
    authSeatSizeChange (val) {
      this.seatSize = val
      this.loadSeatData(this.seatCurrPage, this.seatSize, this.seatByPark, this.formParkSeatCode)
    },
    seatCurrentChange (val) {
      this.seatCurrPage = val
      this.loadSeatData(this.seatCurrPage, this.seatSize, this.seatByPark, this.formParkSeatCode)
    },
    // 导入
    authUpload: function () {
      this.$refs['authUpload'].openDialog()
    },
    research: function () {
      this.loadAuthList(this.currentPage, this.sizes, this.queryForm.queryOwnerName, this.queryForm.queryParkSeatCode)
    },
    noSelectTip () {
      this.$confirm('还没选择确定关闭窗口?', '提示', {
        onfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.innerVisible = false
      }).catch(() => {
        this.innerVisible = true
      })
    },
    selectFrom (fromName) { // 选择车场
      this.selectName = fromName
      this.dialogPark = true
      // console.log(this.$refs.parkTree)
      if (fromName === 'park') {
        this.dialogData = '选择车场'
        console.info(this.$refs.parkTree)
        if (this.addAuthform.parks && this.$refs.parkTree) {
          // console.log('name' + this.addAuthform.parks)
          // console.log('code' + typeof this.addAuthform.parksCodes)
          // let parkArr = this.addAuthform.parks.split(',')
          // console.log('parkArr' + parkArr)
          let parksCodes
          if (typeof this.addAuthform.parksCodes === 'string') {
            parksCodes = this.addAuthform.parksCodes.split(',')
          } else {
            parksCodes = this.addAuthform.parksCodes
          }
          this.$refs.parkTree.setCheckedKeys(parksCodes)
        } else {
          if (this.$refs.parkTree) {
            this.$refs.parkTree.setCheckedKeys([])
          }
        }
        // console.log(this.addAuthform.parks)
      } else if (fromName === 'auth') {
        this.dialogData = '选择人员'
        if (this.$refs.diaglo) {
          this.$refs.diaglo.queryOwers()
          this.$refs.diaglo.currentPage = 1
          this.$refs.diaglo.sizes = 10
        }
      } else if (fromName === 'seat') {
        if (this.addAuthform.parksCodes) {
          this.dialogData = '选择车位'
          this.authSeatData = []
          this.seatTotal = 0
          this.getAuthTree()
          this.seatByPark = ''
        } else {
          this.$message('请先选中要授权的车场')
          return false
        }
      }
      this.innerCardVisible = true
    },
    querySeat () {
      if (this.seatByPark) {
        this.loadSeatData(this.seatCurrPage, this.seatSize, this.seatByPark, this.formParkSeatCode)
      } else {
        this.$message('请先选择停车场')
      }
    },
    choiseStyle (val) {
      if (val === 0) {
        this.choiseCard = false
      } else {
        this.choiseCard = true
      }
    },
    getAuthTree () {
      let _this = this
      getParkTreeSeat(this.addAuthform.parksCodes)
        .then(function (response) {
          _this.selectParkTreeData = response.data
        })
    },
    selectCardBtn () {
      if (this.selectName === 'auth') {
        this.$refs.diaglo.queryValue = ''
        if (this.$refs.diaglo && this.$refs.diaglo.selectAuto && this.$refs.diaglo.selectAuto.ownerName) {
          this.addAuthform.name = this.$refs.diaglo.selectAuto.ownerName
          this.ownerId = this.$refs.diaglo.selectAuto.ownerId
        } else {
          this.noSelectTip()
        }
      } else if (this.selectName === 'park') { // 车场
        let oldPark = this.addAuthform.parks
        let oldParkCode = this.addAuthform.authParkCodes
        this.addAuthform.parks = ''
        this.selectParkCode = []
        let parkOrgIds = []
        console.log('this.selectParkData' + JSON.stringify(this.selectParkData))
        for (let park of this.selectParkData) {
          this.addAuthform.parks += ',' + park.parkingName
          parkOrgIds.push(park.parkOrgId)
          this.selectParkCode.push(park.parkingCode)
        }
        // console.log(this.selectParkCode)
        this.selectParkCode = Array.from(new Set(this.getParentTree(this.parkTreeData, this.selectParkCode)))
        // console.log('ids : ' + this.selectParkCode)
        this.addAuthform.parks = (this.addAuthform.parks).substr(1) || oldPark
        this.parkOrgId = parkOrgIds.toString()
        this.addAuthform.parksCodes = this.selectParkCode || oldParkCode
        console.log(this.addAuthform.parksCodes)
      } else if (this.selectName === 'seat') {
        let oldSeat = this.addAuthform.parkSeatCode
        if (oldSeat && oldSeat !== '') {
          if (this.selectSeatData && this.selectSeatData.code) {
            this.addAuthform.parkSeatCode = this.selectSeatData.code
          } else {
            this.addAuthform.parkSeatCode = oldSeat
          }
        } else {
          this.addAuthform.parkSeatCode = this.selectSeatData.code || ''
        }
      }
      this.innerCardVisible = false
    },
    paymentRecord (index, row) { // 缴费记录
      this.dialogPayVisible = true
      this.dialogPay = false
      this.payTitle = '缴费记录'
      this.paymentRecordCurrentPage = 1
      this.paymentRecordPageSize = 10
      this.paymentRecordAuthId = row.id
      this.loadPaymentRecord(this.paymentRecordCurrentPage, this.paymentRecordPageSize, this.paymentRecordAuthId)
    },
    loadPaymentRecord (currentPage, pageSize, authId) {
      var _this = this
      // _this.recodeLoad = true
      paymentRecord(currentPage, pageSize, authId)
      .then(function (response) {
        // _this.recodeLoad = false
        let errorcode = response.code
        if (errorcode === '0') {
          _this.recordData = response.data.rows
          _this.paymentRecordTotal = response.data.total
        } else {
          _this.$message.error('获取缴费记录异常')
        }
      })
    },
    paymentRecordSizeChange (paymentRecordPageSize) {
      this.paymentRecordPageSize = paymentRecordPageSize
      this.loadPaymentRecord(this.paymentRecordCurrentPage, paymentRecordPageSize, this.paymentRecordAuthId)
    },
    paymentRecordCurrentChange (paymentRecordCurrentPage) {
      this.paymentRecordCurrentPage = paymentRecordCurrentPage
      this.loadPaymentRecord(paymentRecordCurrentPage, this.paymentRecordPageSize, this.paymentRecordAuthId)
    },
    findPage (val) {
      this.currentPage = val
      this.loadAuthList(this.currentPage, this.sizes, this.queryForm.queryOwnerName, this.queryForm.queryParkSeatCode)
    },
    handleSizeChange (val) {
      this.sizes = val
      this.loadAuthList(this.currentPage, this.sizes, this.queryForm.queryOwnerName, this.queryForm.queryParkSeatCode)
    },
    closeDialog (done) {
      done()
      this.resetForm()
    },
    cannelAuth (formName) {
      this.resetForm()
      this.dialogFormVisible = false
    },
    resetForm () {
      this.$refs.addAuthform.resetFields()
      this.addAuthform.name = ''
      this.addAuthform.parks = ''
      this.addAuthform.parksCodes = ''
      this.addAuthform.parkSeatCode = ''
    },
    cannelPay () {
      this.dialogPayVisible = false
      this.resetPayForm()
    },
    closePayDialog (done) {
      done()
      this.resetPayForm()
    },
    resetPayForm () {
      if (this.$refs.payAuthform) {
        this.$refs.payAuthform.resetFields()
      }
    },
    closeOwnerDialog () {
      console.log(this.$refs.diaglo)
      this.$refs.diaglo.queryValue = ''
      this.innerCardVisible = false
    },
    blurInput () {
      this.queryForm.queryOwnerName = this.queryForm.queryOwnerName
    },
    getParentTree (data, codes) {
      let temp = data
      let treeId = []
      function getTreeId (data, code) {
        let parCode
        for (let dataItem of data) {
          if (dataItem.parkingCode === code) {
            treeId.push(dataItem.parkingCode)
            parCode = dataItem.parentParkingCode
            getTreeId(temp, parCode)
          } else {
            getTreeId(dataItem.subParkingLots, code)
          }
        }
      }
      function getTreeCodes (codes) {
        for (let code of codes) {
          getTreeId(data, code)
        }
        return treeId
      }
      return getTreeCodes(codes)
    },
    formatPark (parkData) {
      let newParks = []
      let codes = []
      for (let i = 0; i < parkData.length; i++) {
        codes.push(parkData[i].parkingCode)
      }
      for (let i = 0; i < parkData.length; i++) {
        if (parkData[i].parentParkingCode === '' || codes.indexOf(parkData[i].parentParkingCode) === -1) {
          newParks.push(parkData[i])
        }
      }
      return newParks
    },
    formatString (dataString) {
      var keyArrs = []
      var valuArrs = []
      var dataArrObj = []
      for (var keyArr in dataString) {
        keyArrs.push('"' + keyArr + '"')
      }
      for (var valueArr in dataString) {
        valuArrs.push('"' + dataString[valueArr] + '"')
      }
      for (let i = 0; i < keyArrs.length; i++) {
        var arrObj = '{value:' + keyArrs[i] + ',label:' + valuArrs[i] + '}'
        dataArrObj.push(this.myEval(arrObj))
      }
      return dataArrObj
    },
    myEval (str) {
      var Fn = Function
      return new Fn('return ' + str)()
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/views/ParkingLotApp/assets/css/parkLotApp.less";
.el-input{
  width: 60%
}
.pay-popwin .el-input{
  width: 100%
}
.pay-checkbox{
  margin-left: 80px;
  margin-bottom: 10px;
}
.price-unit{
  font-style: normal;
  font-size: 18px;
}
.pay-ramker .el-textarea{
  width: 550px;
}
.disabled-text{
  display: inline-block;
  width: 202px
}
.park-dialog{
  height: 400px;
  overflow: auto;
}
</style>
<style lang="less">
.seatTable {
  .seat-table{
    .el-table__body-wrapper{
      max-height: 270px!important;
    }
  }
}
.auth-car-table{
  .el-table__body-wrapper{
    max-height:350px!important;
  }
}
#dialogPark .el-dialog{
  opacity: 0;
}
#dialogPark.dialogPark .el-dialog{
  opacity: 1;
}
.pay-popwin{
  .el-table__header-wrapper .el-table__header{
    width:auto!important;
  }
}
</style>





