<template>
  <div>
    <div class="cardMain">
      <div class="cardHeader align-center">
        <label>卡片入库</label>
      </div>
      <div class="cardContent">
        <div class="contentLeft">
          <!-- 卡片信息 -->
          <el-form :model="cardInfo" ref="cardInfo">
            <el-form-item prop="uniqueCode" label="物理卡号">
              <el-input v-model.trim="cardInfo.uniqueCode"/>
            </el-form-item>           
            <el-form-item prop="cardType" label="卡片类型">
              <el-select v-model.trim="cardInfo.cardType">
                <el-option label="IC卡" value="IC"></el-option>
                <el-option label="ID卡" value="ID"></el-option>                
                <el-option label="CPU卡" value="CPU"></el-option>
              </el-select>
            </el-form-item>  
            <el-form-item prop="facadeCode" label="卡面编号">
              <el-input v-model.trim="cardInfo.facadeCode" ref="focusInput" :autofocus="true"/>
            </el-form-item>                
          </el-form>
          <el-checkbox v-model="bindingFlag">绑定持卡人</el-checkbox>
          <el-radio-group v-model="queryType" v-show="bindingFlag" style="margin-left:5%">
            <el-radio :label="1">住户(业主、业主家属与租客)</el-radio>
            <el-radio :label="2">物业人员</el-radio>
          </el-radio-group>
          <!-- 用户查询条件 -->
          <div v-show="bindingFlag" style="padding-top:20px;">
            <el-form :inline="true" :model="userCondition" ref="userCondition" class="demo-form-inline" :rules="cardRules">
              <el-form-item prop="name" label="人员姓名">
                <el-input v-model.trim="userCondition.name" placeholder="请输入人员姓名"></el-input>
              </el-form-item>                     
              <el-form-item label="">
                <el-button @click="onQueryUser">查询</el-button>
              </el-form-item>
            </el-form>
          </div>        
        </div>
        <!-- 串口列表  -->
        <div class="contentRight">
          <el-table ref="portList" :data="portList" highlight-current-row @current-change="selectPort" size="mini" height="110" style="width:150px">
            <el-table-column prop="port" label="读卡器串口设置"></el-table-column>
          </el-table>
          <el-button @click="openCardPort" :disabled="this.openPort">打开</el-button>
          <el-button @click="closeCardPort"  :disabled="this.closePort">关闭</el-button>
          <el-alert v-bind:title="this.portMsg" :type="this.elAlertType" left :closable="false" style="background-color:#FFFFFF"></el-alert>
          <!-- object标签用于向网页中嵌入多媒体元素(例如图片、视频、activex、pdf等等)  
            clsid-注册表中某个类的id  
            codebase-对象的代码位置(如果是在注册表中注册过 则可以没有) -->
          <!-- object隐藏后事件触发不了，所以设了1px -->
          <object classid="clsid:B06B2398-0C9E-4CA9-B3DE-1FCF7A2F2FF0" id="cardReaderOcx" width="1px" height="1px"></object>          
        </div>
        <!--用户列表-->
        <div class="table-align" v-show="bindingFlag">
            <el-table ref="tableUser" :data="tableUser" v-bind:empty-text="this.emptyText" stripe @current-change="handleCurrentChange" element-loading-text="拼命加载中">
              <el-table-column width="24">
                <template slot-scope="scope">
                  <el-radio class="radio" v-model="radio" :label="scope.$index" @change="getCurrentRow">&nbsp;</el-radio>
                </template>
              </el-table-column>        
              <el-table-column prop="uuid" align="center" label="编号" width="280"></el-table-column>
              <el-table-column prop="name" align="center" label="姓名" width="100"></el-table-column>
              <el-table-column prop="sex" align="center" label="性别" width="60" :formatter="sexFormatter"></el-table-column>
              <el-table-column prop="phone" align="center" label="电话" width="140"></el-table-column>
              <el-table-column v-bind:prop="this.address" align="center" label="住址"></el-table-column>
            </el-table>
            <div class="block text-center margin-top-20">
              <el-pagination
                @size-change="onPageSizeChange"
                @current-change="onCurrentPageChange"
                :current-page="userInfo.currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="userInfo.pageSize"
                :total="userInfo.totalCount"
                layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </div>          
        </div>
      </div>   
      <div class="cardFooter align-center">
        <el-alert v-bind:title="this.errorMsg" type="error" center :closable="false" height="50px" style="background-color:#FFFFFF"></el-alert>
        <el-button @click="onCancel">重置</el-button>
        <el-button type="primary" @click="onSaveCardInfo">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { storeCards, queryUsers, queryManagersByName } from './apis'
export default {
  data () {
    // 卡面编号验证规则
    // var facadeCodeValidate = (rule, value, callback) => {
    //   if (!/^[a-zA-Z0-9]+$/.test(value)) {
    //     callback(new Error('卡面编号只能为数字和英文字符!'))
    //   } else {
    //     callback()
    //   }
    // }
    // 查询条件校验
    var queryValidate = (rule, value, callback) => {
      if (/[%]/g.test(value)) {
        callback(new Error('查询条件中不能包含%'))
      } else {
        callback()
      }
    }
    return {
      isIE: false, // 是否IE浏览器
      // 卡片信息
      cardInfo: {
        uniqueCode: '',
        facadeCode: '',
        cardType: 'IC',
        ownerUuid: '',
        ownerName: '',
        ownerType: ''
      },
      // 用户查询条件
      userCondition: {
        name: '',
        currentPage: 1,
        pageSize: 10
      },
      // 查询用户结果
      userInfo: {
        uuid: '',
        name: '',
        sex: '',
        phone: '',
        houseName: '',
        currentPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      iccardObj: null, // 读卡器OCX控件
      portList: [], // 串口列表
      tableUser: [], // 用户列表
      currentPort: null, // 当前选中串口
      openPort: true, // 串口打开按钮disabled
      closePort: true, // 串口关闭按钮disabled
      cardNo: '', // 当前暂存的卡号
      intervalId: '', // 定时器id
      portMsg: '', // 串口相关信息
      queryType: 1, // 查询人员类型
      address: 'houseName',
      selectedUser: null, // 当前选中行
      sendUser: null, // 发送给后台的数据
      bindingFlag: false, // 是否绑定持卡人
      // sexType: ['', '男', '女'],
      errorMsg: '', // 错误信息
      elAlertType: 'error', // 警告标签类型
      radio: '', // 单选按钮
      emptyText: '请输入用户姓名进行查询', // 表格空数据时显示
      // 查询特殊字符校验
      cardRules: {
        name: [
          { validator: queryValidate, trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.loadData()
    this.getBrowserType()
    if (this.isIE) {
      try {
        this.openPort = false
        this.getCardPortList()
        this.intervalId = setInterval(this.readCard, 200)
      } catch (error) {
        this.downloadOCX()
      }
    } else {
      this.portMsg = '请使用IE浏览器'
    }
  },
  // 离开页面销毁定时器
  destroyed () {
    if (this.intervalId !== '') {
      clearInterval(this.intervalId)
    }
  },
  methods: {
    loadData () {
    },
    downloadOCX () {
      this.$alert('<strong><a href="/OCX/js-iccardreader.zip">读卡器OCX控件未安装，请点击下载并安装</a></strong>', '读卡器OCX控件下载', {
        dangerouslyUseHTMLString: true
      })
    },
    // 判断是否ie浏览器
    getBrowserType () {
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        this.isIE = true
      }
    },
    // 获取串口列表
    getCardPortList () {
      this.iccardObj = document.getElementById('cardReaderOcx')
      var portArr = this.iccardObj.getSerialList().split(';')
      for (var i = 0; i < portArr.length; i++) {
        var port = {'port': portArr[i]}
        this.portList.push(port)
      }
    },
    // 选择串口
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
    // 读卡器串口选择
    selectPort: function (val) {
      this.currentPort = val
    },
    // 定时读卡
    readCard () {
      let that = this
      let temp = that.iccardObj.getCardNo()
      if (that.cardNo !== temp) {
        that.cardNo = temp
        if (that.cardNo !== '') {
          that.cardInfo.uniqueCode = that.cardNo
        }
      }
    },
    // 关闭串口
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
    sexFormatter: function (row, column) {
      var sex = row.sex
      if (sex === '1') {
        return '男'
      } else if (sex === '2') {
        return '女'
      } else {
        return '未知'
      }
    },
    // 提交
    onSaveCardInfo () {
      if (this.cardInfo.uniqueCode === '') {
        this.$message({
          message: '请读取物理卡号',
          type: 'warning',
          showClose: true
        })
        return
      }
      if (this.cardInfo.facadeCode === '') {
        this.$message({
          message: '请输入卡面编号',
          type: 'warning',
          showClose: true
        })
        return
      }
      // 校验
      let reg = new RegExp(/^[a-zA-Z0-9]{1,16}$/)
      if (!reg.test(this.cardInfo.uniqueCode)) {
        this.$message({
          message: '物理卡号只能为1到16位数字或字母',
          type: 'error',
          showClose: true
        })
        return
      }
      if (!reg.test(this.cardInfo.facadeCode)) {
        this.$message({
          message: '卡面编号只能为1到16位数字或字母',
          type: 'error',
          showClose: true
        })
        return
      }
      if (this.bindingFlag === true && this.sendUser === null) {
        this.$message({
          message: '请绑定持卡人',
          type: 'warning',
          showClose: true
        })
        return
      }
      // 提交前确认
      this.$confirm('是否确认当前操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.bindingFlag) {
          this.cardInfo.ownerUuid = this.sendUser.uuid
          this.cardInfo.ownerName = this.sendUser.name
          if (this.queryType === 2) {
            this.cardInfo.ownerType = 5
          } else {
            this.cardInfo.ownerType = this.sendUser.userType
          }
        }
        storeCards(this.cardInfo).then(function (response) {
          if (response.code === '00000') {
            this.$message({
              message: '卡片入库成功',
              type: 'success',
              showClose: true
            })
            this.commonReset()
          } else {
            this.$alert('卡片入库失败', '提示', {
              confirmButtonText: '确定'
            })
            // 显示失败错误信息
            this.errorMsg = response.message
          }
        }.bind(this))
      })
    },
    // 重置
    onCancel () {
      this.commonReset()
      this.cardInfo.cardType = 'IC'
    },
    // 公共重置
    commonReset () {
      this.cardInfo.uniqueCode = ''
      this.cardInfo.facadeCode = ''
      this.cardInfo.ownerUuid = ''
      this.cardInfo.ownerName = ''
      this.cardInfo.ownerType = ''
      this.cardNo = ''
      this.userCondition.name = ''
      this.errorMsg = ''
      this.$refs.tableUser.setCurrentRow(null)
      this.selectedUser = null
      this.sendUser = null
      this.radio = ''
      this.$refs.focusInput.focus()
    },
    // 查询用户
    onQueryUser () {
      // 每次清除上次选人
      this.tableUser = null
      this.radio = ''
      this.sendUser = null
      this.$refs['userCondition'].validate((valid) => {
        if (valid) {
          // 住户
          if (this.queryType === 1) {
            queryUsers(this.userCondition).then(function (response) {
              this.address = 'houseName'
              console.log('返回结果为：' + JSON.stringify(response))
              if (response.code === '00000') {
                // let tableU = response.data.result
                // tableU.map(function (item, index, arr) {
                //   item.sex = this.sexType[item.sex]
                // }, this)
                // this.tableUser = tableU
                this.userInfo.totalCount = response.data.totalCount
                this.tableUser = response.data.result
              }
              this.emptyText = '暂无数据'
            }.bind(this))
          } else { // 物业
            queryManagersByName(this.userCondition).then(function (response) {
              this.address = 'address'
              console.log('返回结果为：' + JSON.stringify(response))
              if (response.code === '00000') {
                // let tableU = response.data.rows
                // tableU.map(function (item, index, arr) {
                //   item.sex = this.sexType[item.sex]
                // }, this)
                // this.tableUser = tableU
                this.userInfo.totalCount = response.data.rowCount
                this.tableUser = response.data.rows
              }
              this.emptyText = '暂无数据'
            }.bind(this))
          }
        }
      })
    },
    // 获取人员选中行
    handleCurrentChange: function (val) {
      this.selectedUser = val
    },
    // 点击单选按钮获取人员信息
    getCurrentRow () {
      this.sendUser = this.selectedUser
    },
    // 查询分页设置
    onPageSizeChange (val) {
      this.userCondition.pageSize = val
      this.onQueryUser()
    },
    onCurrentPageChange (val) {
      this.userCondition.currentPage = val
      this.onQueryUser()
    }
  }
}
</script>

<style scoped>
  .cardMain {
    margin: 20px 20%;
    border: solid 1px #b4bccc;
  }
  .cardContent {
    float: left;
    width: 100%;
  }
  .contentLeft {
    margin-left: 10%;
    float: left;
    width: 60%;
  }
  .contentRight {
    float: left;
    text-align: left;
    width: 25%;
  }
  .cardHeader {
    margin: 0px 0px 20px;
    height: 50px;
    line-height: 50px;
    background-color: #409EFF;
  }
  .cardFooter {
    margin-top: 10px;
    margin: 30px 0px;
  }
  .align-center {
    text-align: center;
  }
  .align-left {
    margin-left: 20%
  }
  .table-align {
    margin: 0 5% 0 5%;
  }
 .el-form-item__content div {
    width: 300px;
  }
  .el-input {
    width: 60%
  }
  div.el-col-10{
    text-align: left;
    width: 50%
  }
  #cancelBtn {
    text-align: center;
    margin-left: 50%;
  }
  .commitBtn {
    margin-right: 50px;
  }
</style>
