<template>
	<div id="rule">
    <section class="from-btns">
			<el-button type="primary" @click="showAddRuleDialog">新增</el-button>
      <el-button type="danger" @click="deleteSelectRules">批量删除</el-button>
		</section>
    <div>
      <el-form :inline="true" >
        <el-form-item>
          <el-input placeholder="请输入规则名称" v-model="queryRuleName" id="ruleName" value="" ></el-input>
          <el-input type="text" style="display:none" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryRules">查询</el-button>
        </el-form-item>		
      </el-form>
    </div>
    <div class="fix-table-bar">
      <el-table border fit :data="tableData" @selection-change="selectRuleIds" max-height="680" highlight-current-row style="width: 100%;font-size: 13px;"> 
        <el-table-column type="selection" width="60"></el-table-column>
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="ruleName" label="规则名称" min-width="150" :show-overflow-tooltip="true"></el-table-column> 
        <el-table-column prop="openWayDisc" label="放行方式"></el-table-column>        
        <el-table-column prop="allowTempCarIn" label="允许外部车辆进场" :formatter="selectFormat"></el-table-column>  
        <el-table-column prop="allowRegistrationCarIn" label="允许登记车辆进场" :formatter="selectFormat"></el-table-column> 
        <el-table-column prop="fullCarportAllowCarIn" label="车场临停车位已满允许进场" width="180" :formatter="selectFormat"></el-table-column>
        <el-table-column prop="monthCar" label="月保车" :formatter="ybcFormat"></el-table-column> 
        <el-table-column prop="monthCarEndTurnTemp" label="月保车过期" width="120" :formatter="ybcEndFormat"></el-table-column> 
        <el-table-column prop="privateParkSeatFullTurnTemp" label="个人车位已满转临停车" width="160" :formatter="selectFormat"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.$index,scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
		<el-col class="toolbar">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" background layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-col>		
		<el-dialog :visible.sync="ruledialog" :title="dialogTitle" :before-close="closeDialog">
      <el-form :model="ruleInfo" ref="ruleInfo" :rules = "ruleForm" label-width="80px" class="deptInfo-ruleForm">
        <el-form-item label="规则名称" prop="ruleFormName">
          <el-input type="text" v-model="ruleInfo.ruleFormName" style="width: 40%"></el-input>
        </el-form-item >
        <el-form-item label="规则描述" prop="ruleFormDiscription">
          <el-input type="textarea" placeholder="请输入0到256个字符"
          :rows = "6" v-model="ruleInfo.ruleFormDiscription" style="width: 80%"></el-input>
        </el-form-item>   
        <el-form-item label="放行方式">
          <el-select v-model="ruleInfo.openFormWay" placeholder="请选择" :disabled="false">
            <el-option
              v-for="item in openWaySelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item >
        <el-checkbox v-model="ruleInfo.monthCar" :disabled="isEdit">月保/产权车</el-checkbox>
        <div class="month-car-div" v-if="ruleInfo.monthCar == true">
          <div class="month-inline">
            <article>
              <span>月保车过期</span>
              <el-select v-model="ruleInfo.monthCarEndTurnTemp">
                <el-option
                  v-for="item in monthCarOverOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </article>
            <el-checkbox v-model="ruleInfo.privateParkSeatFullTurnTemp" disabled>个人车位已满转临停车</el-checkbox>
          </div>
          <div>
            <article>
              <span>缴费单位</span>
              <el-select v-model="ruleInfo.payUnit">
                <el-option
                  v-for="item in payUnitOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </article>
          <el-form-item label="缴费金额" prop="payMoney" class="price-inline">
            <el-input type="tel" v-model="ruleInfo.payMoney" style="width: 100px"></el-input>
            元
          </el-form-item> 
          </div>
        </div>
        <div v-else style="padding-left:50px; padding-top:20px;">
          <el-checkbox v-model="ruleInfo.allowTempCarIn" @change="allowCarChange">允许外部车辆进场</el-checkbox>
          <el-checkbox v-model="ruleInfo.allowRegistrationCarIn">允许登记车进场</el-checkbox>
          <el-checkbox v-model="ruleInfo.fullCarportAllowCarIn">车场临停车位已满允许进场</el-checkbox>
        </div>
        <el-form-item class="toolbar">
          <el-button @click="cannelRule">取 消</el-button>
          <el-button type="primary" @click="saveRule">保 存</el-button>
        </el-form-item>	          
      </el-form>
		</el-dialog>
	</div>
</template>
<script>
import { listRules, addRule, editRule, deleteRule, getRuleOpenWayData, ruleIsExist } from '@/views/ParkingLotApp/apis'
export default {
  data () {
    var isExist = (rule, value, callback) => {
      value = encodeURI(value)
      if (this.originalRuleName === this.ruleInfo.ruleFormName) {
        callback()
      }
      ruleIsExist(value).then(function (response) {
        let errorcode = response.code
        if (errorcode === '0') {
          if (response.data.isExist) {
            callback(new Error('该规则已存在!'))
          } else {
            callback()
          }
        }
      })
    }
    let queryValid = (rule, value, callback) => {
      let regexp = new RegExp("[`·~!@#$%+^&*\\-_()=|{}'/\\\\:;'\"\",\\[\\].<>/?！#￥……&*（）——【】‘’；：”“。，、？]")
      if (regexp.test(value)) {
        callback(new Error('请勿输入特殊字符'))
      } else {
        callback()
      }
    }
    var checkPrice = (rule, value, callback) => {
      let express = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (!express.test(value)) {
        callback(new Error('请输入正确的金额!'))
      } else if (value > 50000) {
        callback(new Error('金额不能超过5万!'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      ruleName: '',
      total: 10,
      selections: [],
      ruledialog: false,
      // ruleLoading: true,
      isEdit: false,
      queryRuleName: '',
      dialogTitle: '',
      originalRuleName: '',
      ruleInfo: {
        id: '',
        ruleFormName: '',
        ruleFormDiscription: '',
        openFormWay: '',
        openWayDisc: '',
        fullCarportAllowCarIn: '',
        allowTempCarIn: '',
        allowRegistrationCarIn: '',
        monthCar: '',
        monthCarEndTurnTemp: '',
        privateParkSeatFullTurnTemp: '',
        payUnit: '',
        payMoney: ''
      },
      openWaySelect: [],
      value: '',
      ruleForm: {
        ruleFormName: [
          { required: true, message: '请输入规则名称', trigger: 'blur' },
          { max: 50, message: '最大长度为50字符', trigger: 'blur' },
          { validator: queryValid, trigger: 'blur' },
          { validator: isExist, trigger: 'blur' }
        ],
        ruleFormDiscription: [
          { max: 256, message: '最多可输入256个字符', trigger: 'change' }
        ],
        payMoney: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          {validator: checkPrice, trigger: 'blur'}
        ]
      },
      monthCarOverOptions: [
        {
          value: 0,
          label: '可正常进出'
        }, {
          value: 1,
          label: '转临停'
        }, {
          value: 2,
          label: '不让进'
        }
      ],
      payUnitOptions: [
        {
          value: 'MONTH',
          label: '月'
        }, {
          value: 'YEAR',
          label: '年'
        }
      ]
    }
  },
  mounted () {
    this.loadListData(this.currentPage, this.pageSize, this.ruleName)
    this.setOpenWayData()
  },
  methods: {
    loadListData (currentPage, pageSize, ruleName) {
      let _this = this
      // _this.ruleLoading = true
      ruleName = encodeURI(ruleName.trim())
      listRules(currentPage, pageSize, ruleName)
        .then(function (response) {
          let code = response.code
          // _this.ruleLoading = false
          if (code === '0') {
            _this.tableData = response.data.rows
            _this.total = response.data.total
          } else if (code === '500') {
            _this.$message.error(response.message)
          } else {
            _this.$message.error(response.message)
          }
        })
        .catch(function (error) {
          // _this.ruleLoading = false
          console.log(error)
        }
        )
    },
    // 查询规则名称
    queryRules () {
      this.loadListData(this.currentPage, this.pageSize, this.queryRuleName)
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.loadListData(this.currentPage, pageSize, this.ruleName)
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      this.loadListData(currentPage, this.pageSize, this.ruleName)
    },
    // 新增按钮
    showAddRuleDialog () {
      let _this = this
      _this.isEdit = false
      _this.dialogTitle = '新增规则'
      _this.ruleInfo.id = ''
      _this.ruleInfo.ruleFormName = ''
      _this.ruleInfo.ruleFormDiscription = ''
      _this.ruleInfo.openFormWay = '0'
      _this.ruleInfo.openWayDisc = ''
      _this.ruleInfo.fullCarportAllowCarIn = ''
      _this.ruleInfo.monthCar = ''
      _this.ruleInfo.allowTempCarIn = false
      _this.ruleInfo.allowRegistrationCarIn = true
      _this.ruleInfo.monthCarEndTurnTemp = 0
      _this.ruleInfo.privateParkSeatFullTurnTemp = true
      _this.ruleInfo.payUnit = 'MONTH'
      _this.ruleInfo.payMoney = ''
      _this.ruledialog = true
      _this.originalRuleName = ''
    },
    allowCarChange () {
      if (this.ruleInfo.allowTempCarIn) {
        this.ruleInfo.allowRegistrationCarIn = true
      }
    },
    setOpenWayData () {
      let _this = this
      getRuleOpenWayData()
        .then(function (response) {
          var errorcode = response.code
          if (errorcode === '0') {
            _this.openWaySelect = _this.formatString(response.data.OPEN_WAY)
          } else {
            _this.$message.error(response.message)
          }
        })
        .catch(() => {})
    },
    deleteSelectRules () {
      let ids = []
      let _this = this
      for (let i = 0; i < _this.selections.length; i++) {
        ids.push(_this.selections[i].id)
      }
      if (ids.length > 0) {
        _this.$confirm('是否要删除此规则信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          deleteRule(ids)
          .then(function (response) {
            let code = response.code
            if (code === '0') {
              _this.$message({
                type: 'success',
                message: '批量删除规则成功'
              })
              _this.loadListData(_this.currentPage, _this.pageSize, _this.ruleName)
            } else {
              _this.$message({
                type: 'fail',
                message: '批量删除规则失败'
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
          message: '请选择需要删除的规则'
        })
      }
    },
    // 保存
    saveRule () {
      let _this = this
      let params_ = {
        id: _this.ruleInfo.id,
        ruleName: _this.ruleInfo.ruleFormName,
        openWay: _this.ruleInfo.openFormWay,
        fullCarportAllowCarIn: _this.ruleInfo.fullCarportAllowCarIn,
        allowTempCarIn: _this.ruleInfo.allowTempCarIn,
        allowRegistrationCarIn: _this.ruleInfo.allowRegistrationCarIn,
        monthCar: _this.ruleInfo.monthCar,
        monthCarEndTurnTemp: _this.ruleInfo.monthCarEndTurnTemp,
        privateParkSeatFullTurnTemp: _this.ruleInfo.privateParkSeatFullTurnTemp,
        payMoney: _this.ruleInfo.payMoney,
        payUnit: _this.ruleInfo.payUnit,
        ruleDiscription: _this.ruleInfo.ruleFormDiscription
      }
      if (_this.dialogTitle === '新增规则') {
        _this.$refs.ruleInfo.validate(valid => {
          if (valid) {
            addRule({
              params: JSON.stringify(params_)
            }).then(function (response) {
              let code = response.code
              if (code === '0') {
                _this.$message({
                  message: '新增成功！',
                  type: 'success'
                })
                _this.loadListData(_this.currentPage, _this.pageSize, _this.ruleName)
              } else {
                _this.$message.error({
                  message: response.message,
                  type: 'fail'
                })
              }
              _this.ruledialog = false
            })
          }
        })
      } else {
        _this.$refs.ruleInfo.validate(valid => {
          if (valid) {
            editRule({
              params: JSON.stringify(params_)
            }).then(function (response) {
              let code = response.code
              if (code === '0') {
                _this.$message({
                  message: '修改规则成功！',
                  type: 'success'
                })
                _this.loadListData(_this.currentPage, _this.pageSize, _this.ruleName)
              } else {
                _this.$message.error({
                  message: response.message,
                  type: 'fail'
                })
                _this.loadListData(_this.currentPage, _this.pageSize, _this.ruleName)
              }
              _this.ruledialog = false
            })
          }
        })
      }
    },
    // 编辑
    handleEdit (index, row) {
      console.log(row)
      let _this = this
      _this.isEdit = true
      _this.dialogTitle = '修改规则'
      _this.ruleInfo.id = row.id
      _this.ruleInfo.ruleFormName = row.ruleName
      _this.originalRuleName = row.ruleName
      _this.ruleInfo.ruleFormDiscription = row.ruleDiscription
      if (row.openWay != null) {
        _this.ruleInfo.openFormWay = row.openWay.toString()
      }
      _this.ruleInfo.payUnit = row.payUnit
      _this.ruleInfo.payMoney = row.payMoney
      _this.ruleInfo.monthCarEndTurnTemp = row.monthCarEndTurnTemp
      if (row.fullCarportAllowCarIn === 1) {
        _this.ruleInfo.fullCarportAllowCarIn = true
      } else {
        _this.ruleInfo.fullCarportAllowCarIn = false
      }
      if (row.monthCar === 1) {
        _this.ruleInfo.monthCar = true
      } else {
        _this.ruleInfo.monthCar = false
        _this.ruleInfo.payUnit = 'MONTH'
      }
      if (row.privateParkSeatFullTurnTemp === 1) {
        _this.ruleInfo.privateParkSeatFullTurnTemp = true
      } else {
        _this.ruleInfo.privateParkSeatFullTurnTemp = false
      }
      if (row.allowTempCarIn === 1) {
        _this.ruleInfo.allowTempCarIn = true
      } else {
        _this.ruleInfo.allowTempCarIn = false
      }
      if (row.allowRegistrationCarIn === 1) {
        _this.ruleInfo.allowRegistrationCarIn = true
      } else {
        _this.ruleInfo.allowRegistrationCarIn = false
      }
      _this.ruledialog = true
    },
    // 删除
    handleDelete (index, row) {
      let _this = this
      let ids = []
      ids.push(row.id)
      _this.$confirm('是否要删除此规则信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        deleteRule(ids)
          .then(function (response) {
            var code = response.code
            if (code === '0') {
              _this.$message({
                message: '删除规则成功！',
                type: 'success'
              })
              _this.loadListData(_this.currentPage, _this.pageSize, _this.ruleName)
            } else {
              _this.$message.error({
                message: response.message,
                type: 'fail'
              })
            }
          })
      })
    },
    selectRuleIds: function (selects) {
      this.selections = selects
    },
    // 状态格式化
    selectFormat: function (row, column, cellValue) {
      if (cellValue === 1) {
        return '是'
      } else {
        return '否'
      }
    },
    // 月保车过期
    ybcEndFormat: function (row, column, cellValue) {
      var monthCar = row.monthCar
      if (monthCar === 1 && cellValue === 0) {
        return '可正常进出'
      } else if (cellValue === 1) {
        return '转临停'
      } else if (cellValue === 2) {
        return '不让进出'
      } else {
        return '非月保车'
      }
    },
    // 月保车格式化
    ybcFormat: function (row, column, cellValue) {
      if (cellValue === 1) {
        return '月保车'
      } else {
        return '临停车'
      }
    },
    cannelRule () {
      this.ruledialog = false
      this.resetForm()
    },
    closeDialog (done) {
      done()
      this.resetForm()
    },
    resetForm () {
      this.$refs['ruleInfo'].resetFields()
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
    }
  }
}
</script>
<style lang="less" scoped>
  @import "~@/views/ParkingLotApp/assets/css/parkLotApp.less";
.month-car-div {
  margin-left: 40px;
  margin-top: 20px;
  .month-inline{
    margin-bottom: 20px;
  }
  article{
    > span{
      display: inline-block;
      width: 80px;
    }
    display: inline-block;
    width: 320px;
  }
  .form-inline{
    margin-bottom: 20px;
  }
.price-inline{
    display: inline-block;
    margin-bottom: 0
  }
}
</style>


