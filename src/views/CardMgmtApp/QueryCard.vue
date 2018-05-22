<template>
  <div id="cardDetail">
    <el-form :inline="true" :model="listQuery" ref="listQuery" class="demo-form-inline">
      <div>
      <el-row>
      <el-col :span="10">
        <el-form-item label="物理卡号">
          <el-input placeholder="请输入物理卡号" v-model="listQuery.uniqueCode"/>
        </el-form-item>
        <el-form-item label="卡面编号">
          <el-input placeholder="请输入卡面编号" v-model="listQuery.facadeCode"/>
        </el-form-item>
        </el-col>
      <el-col :span="10">
        <el-form-item label="卡类型">
          <el-select v-model="listQuery.cardType" placeholder="请选择卡类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="ID卡" value="ID"></el-option>
            <el-option label="IC卡" value="IC"></el-option>
            <el-option label="CPU卡" value="CPU"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡状态">
          <el-select v-model="listQuery.cardStatus" placeholder="请选择卡状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="待发行" value="BLANK"></el-option>
            <el-option label="已发行" value="USED"></el-option>
            <el-option label="已挂失" value="LOST"></el-option>
            <el-option label="已注销" value="DISCARDED"></el-option>
          </el-select>
        </el-form-item>
       </el-col>
      <el-col :span="3">
        <el-form-item>
          <el-button type="primary" @click="onQueryList">查询</el-button>
        </el-form-item>
       </el-col>
       </el-row>
      </div>
      <div>
      <el-row>
      <el-col :span="10">
        <el-form-item label="入库时段">
          <el-date-picker v-model="listQuery.validTime" type="datetime" @change="dateSelected($event, 'validTime')" placeholder="选择日期"/>
        </el-form-item>
        <el-form-item label="—" class="datePickerDistance" id="dateSeparator"/>
        <el-form-item>
          <el-date-picker v-model="listQuery.expireTime" type="datetime" @change="dateSelected($event, 'expireTime')" placeholder="选择日期"/>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="持卡人">
          <el-input placeholder="请输入持卡人编号" v-model="listQuery.ownerName"/>
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item>
          <el-button @click="onResetCondition">重置</el-button>
        </el-form-item>
       </el-col>
       </el-row>
      </div>
    </el-form>
    
   <el-table :data="tableData" style="width: 100%"  max-height="580" element-loading-text="拼命加载中">
      <el-table-column type="index" align="center" label="序号"/>
      <el-table-column prop="uniqueCode" align="center" label="物理卡号" />
      <el-table-column prop="facadeCode" align="center" label="卡面编号" />
      <el-table-column prop="cardType" align="center" label="卡类型" :formatter="cardTypeFormatter"/>
      <el-table-column prop="cardStatus" align="center" label="卡状态" :formatter="cardStatusFormatter"/>
      <el-table-column prop="ownerName" align="center" label="持卡人" />
      <el-table-column prop="validTime" align="center" label="生效时间" />
      <el-table-column prop="expireTime" align="center" label="失效时间" />
      <el-table-column prop="createTime" align="center" label="入库时间" />
      <el-table-column prop="createUser" align="center" label="入库操作人" />
      <el-table-column label="操作" align="center" fixed="right">
      <template slot-scope="scope">
        <span v-if="scope.row.operatorFlag === 'USED' && scope.row.ownerUuid !== null && scope.row.ownerUuid !== ''">
          <el-button
          class="operateButton"
          @click="handleDiscard(scope.$index, scope.row)">注销</el-button>
          <el-button
          class="operateButton"
          @click="handleLost(scope.$index, scope.row)">挂失</el-button>
          <el-button
          class="operateButton"
          @click="handleBackCard(scope.$index, scope.row)">退卡</el-button>
        </span>
        <span v-if="scope.row.operatorFlag === 'USED' && (scope.row.ownerUuid === null || scope.row.ownerUuid === '')">
          <el-button
          class="operateButton"
          @click="handleDiscard(scope.$index, scope.row)">注销</el-button>
        </span>
        <span v-if="scope.row.operatorFlag === 'LOST'">
          <el-button
          class="operateButton"
          @click="handleDiscard(scope.$index, scope.row)">注销</el-button>
          <el-button
          class="operateButton"
          @click="handleRecovery(scope.$index, scope.row)">解挂</el-button>
        </span>
        <span v-if="scope.row.operatorFlag === 'BLANK'">
          <el-button
          class="operateButton"
          @click="handleDiscard(scope.$index, scope.row)">注销</el-button>
          <el-button
          class="operateButton"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </span>
      </template>
    </el-table-column>
    </el-table>
    <div class="block text-center margin-top-20">
      <el-pagination
        @size-change="onPageSizeChange"
        @current-change="onCurrentPageChange"
        :current-page="listQuery.currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listQuery.totalAccount">
      </el-pagination>
    </div>
    <div id="dialogCardBindInfo">
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form :model="cardLostForm" label-position="center" label-width="25%">
        <el-form-item label="卡片物理编号：">
          <el-input v-model="cardLostForm.uniqueCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="卡片卡面编号：" >
          <el-input v-model="cardLostForm.facadeCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="卡片所有人姓名：" >
          <el-input v-model="cardLostForm.ownerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="卡片所有人性别：" >
          <el-input v-model="cardLostForm.ownerSex" disabled></el-input>
        </el-form-item>
        <el-form-item label="卡片所有人电话：" >
          <el-input v-model="cardLostForm.ownerPhone" disabled></el-input>
        </el-form-item>
        <el-form-item label="卡片所有人地址：" >
          <el-input v-model="cardLostForm.ownerAddress" type="textarea" disabled></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit(dialogConfirmButton)">{{dialogConfirmButton}}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/javascript">
import { queryCardList, queryCardBindInfo, handleCardLost, handleRecovery, handleBackCard, handleDelete, discardCard } from './apis'
export default {
  mounted () {
    this.loadData()
  },
  data () {
    return {
      loading2: true,
      tableData: [],
      listQuery: {
        uuid: '',
        uniqueCode: '',
        facadeCode: '',
        cardType: '',
        cardStatus: '',
        validTime: '',
        expireTime: '',
        ownerName: '',
        createUser: '',
        currentPage: 1,
        pageSize: 10,
        totalAccount: 0
      },
      dialogFormVisible: false,
      cardLostForm: {
        uuid: '',
        uniqueCode: '',
        facadeCode: '',
        ownerName: '',
        ownerSex: '',
        ownerPhone: '',
        ownerAddress: ''
      },
      dialogConfirmButton: '',
      dialogTitle: '卡片操作'
    }
  },
  methods: {
    onQueryList () {
      console.log(JSON.stringify(this.listQuery))
      console.log(JSON.stringify(this.trimObjProperty(this.listQuery)))
      queryCardList(this.listQuery).then(function (response) {
        console.log('返回结果为: ' + JSON.stringify(response))
        if (response.code === '00000') {
          // 处理日期格式
          var listData = response.data.list
          for (var i = 0; i < listData.length; i++) {
            listData[i].validTime = this.dateFormat(listData[i].validTime)
            listData[i].expireTime = this.dateFormat(listData[i].expireTime)
            listData[i].createTime = this.dateFormat(listData[i].createTime)
            listData[i].operatorFlag = listData[i].cardStatus
          }
          this.tableData = listData
          this.listQuery.totalAccount = response.data.pageCount
        }
      }.bind(this))
    },
    onResetCondition () {
      this.listQuery.uuid = ''
      this.listQuery.uniqueCode = ''
      this.listQuery.facadeCode = ''
      this.listQuery.cardType = ''
      this.listQuery.cardStatus = ''
      this.listQuery.validTime = ''
      this.listQuery.expireTime = ''
      this.listQuery.ownerName = ''
      this.listQuery.createUser = ''
    },
    loadData () {
      this.onQueryList()
    },
    onPageSizeChange (val) {
      this.listQuery.pageSize = val
      this.onQueryList()
    },
    onCurrentPageChange (val) {
      this.listQuery.currentPage = val
      this.onQueryList()
    },
    cardTypeFormatter (row, column, cellValue) {
      if (row.cardType === 'ID') {
        return 'ID卡'
      }
      if (row.cardType === 'IC') {
        return 'IC卡'
      }
      if (row.cardType === 'CPU') {
        return 'CPU卡'
      }
    },
    cardStatusFormatter (row, column, cellValue) {
      if (row.cardStatus === 'BLANK') {
        return '待发行'
      }
      if (row.cardStatus === 'USED') {
        return '已发行'
      }
      if (row.cardStatus === 'LOST') {
        return '已挂失'
      }
      if (row.cardStatus === 'DISCARDED') {
        return '已注销'
      }
      if (row.cardStatus === 'RETURNED') {
        return '已退还'
      }
    },
    handleDelete (index, row) {
      var _this = this
      var condition = {
        uniqueCode: row.uniqueCode,
        cardType: row.cardType
      }
      _this
        .$confirm('是否确认删除该未发行卡片记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          handleDelete(condition)
            .then(function (response) {
              var errorcode = response.code
              if (errorcode === '00000') {
                _this.$alert('删除成功', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    _this.loadData()
                  }
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
        .catch(() => {})
    },
    // 挂失
    handleLost (index, row) {
      var getCardInfoCondition = {}
      getCardInfoCondition.uuid = row.ownerUuid
      getCardInfoCondition.ownerType = row.ownerType
      queryCardBindInfo(getCardInfoCondition).then(function (response) {
        if (response.code === '00000') {
          this.dialogConfirmButton = '挂失'
          this.dialogTitle = '卡片挂失'
          this.dialogFormVisible = true
          this.cardLostForm.uuid = row.uuid
          this.cardLostForm.uniqueCode = row.uniqueCode
          this.cardLostForm.facadeCode = row.facadeCode
          this.cardLostForm.ownerName = response.data.name
          this.cardLostForm.ownerSex = (response.data.sex === '1' ? '男' : '女')
          this.cardLostForm.ownerPhone = response.data.phone
          this.cardLostForm.ownerAddress = response.data.address
        } else {
          this.$alert('' + response.message, '操作失败', {
            confirmButtonText: '确定'
          })
        }
      }.bind(this))
    },
    // 注销,白卡也可以注销
    handleDiscard (index, row) {
      var getCardInfoCondition = {}
      getCardInfoCondition.uuid = row.ownerUuid
      getCardInfoCondition.ownerType = row.ownerType
      if (row.ownerType == null) {
        this.dialogConfirmButton = '注销'
        this.dialogTitle = '卡片注销'
        this.dialogFormVisible = true
        this.cardLostForm.uuid = row.uuid
        this.cardLostForm.uniqueCode = row.uniqueCode
        this.cardLostForm.facadeCode = row.facadeCode
        this.cardLostForm.ownerName = ''
        this.cardLostForm.ownerSex = ''
        this.cardLostForm.ownerPhone = ''
        this.cardLostForm.ownerAddress = ''
        return
      }
      queryCardBindInfo(getCardInfoCondition).then(function (response) {
        if (response.code === '00000') {
          this.dialogConfirmButton = '注销'
          this.dialogTitle = '卡片注销'
          this.dialogFormVisible = true
          this.cardLostForm.uuid = row.uuid
          this.cardLostForm.uniqueCode = row.uniqueCode
          this.cardLostForm.facadeCode = row.facadeCode
          this.cardLostForm.ownerName = response.data.name
          this.cardLostForm.ownerSex = (response.data.sex === '1' ? '男' : '女')
          this.cardLostForm.ownerPhone = response.data.phone
          this.cardLostForm.ownerAddress = response.data.address
        } else {
          this.$alert('' + response.message, '操作失败', {
            confirmButtonText: '确定'
          })
        }
      }.bind(this))
    },
    // 解挂
    handleRecovery (index, row) {
      var getCardInfoCondition = {}
      getCardInfoCondition.uuid = row.ownerUuid
      getCardInfoCondition.ownerType = row.ownerType
      queryCardBindInfo(getCardInfoCondition).then(function (response) {
        if (response.code === '00000') {
          this.dialogConfirmButton = '解挂'
          this.dialogTitle = '卡片解挂'
          this.dialogFormVisible = true
          this.cardLostForm.uuid = row.uuid
          this.cardLostForm.uniqueCode = row.uniqueCode
          this.cardLostForm.facadeCode = row.facadeCode
          this.cardLostForm.ownerName = response.data.name
          this.cardLostForm.ownerSex = (response.data.sex === '1' ? '男' : '女')
          this.cardLostForm.ownerPhone = response.data.phone
          this.cardLostForm.ownerAddress = response.data.address
        } else {
          this.$alert('' + response.message, '操作失败', {
            confirmButtonText: '确定'
          })
        }
      }.bind(this))
    },
    // 退卡
    handleBackCard (index, row) {
      var getCardInfoCondition = {}
      getCardInfoCondition.uuid = row.ownerUuid
      getCardInfoCondition.ownerType = row.ownerType
      queryCardBindInfo(getCardInfoCondition).then(function (response) {
        if (response.code === '00000') {
          this.dialogConfirmButton = '退卡'
          this.dialogTitle = '卡片退卡'
          this.dialogFormVisible = true
          this.cardLostForm.uuid = row.uuid
          this.cardLostForm.uniqueCode = row.uniqueCode
          this.cardLostForm.facadeCode = row.facadeCode
          this.cardLostForm.ownerName = response.data.name
          this.cardLostForm.ownerSex = (response.data.sex === '1' ? '男' : '女')
          this.cardLostForm.ownerPhone = response.data.phone
          this.cardLostForm.ownerAddress = response.data.address
        } else {
          this.$alert('' + response.message, '查询卡片退卡信息失败', {
            confirmButtonText: '确定'
          })
        }
      }.bind(this))
    },
    // 挂失、解挂、注销、退卡提交处理
    dialogSubmit (submitType) {
      var submitData = {}
      submitData.uuid = this.cardLostForm.uuid
      if (submitType === '挂失') {
        this.dialogFormVisible = false
        handleCardLost(submitData).then(function (response) {
          if (response.code === '00000') {
            this.$alert('卡片挂失成功', '', {
              confirmButtonText: '确定'
            })
          } else {
            this.$alert('' + response.message, '卡片挂失失败', {
              confirmButtonText: '确定'
            })
          }
        }.bind(this)).then(this.onQueryList)
      }
      if (submitType === '解挂') {
        this.dialogFormVisible = false
        handleRecovery(submitData).then(function (response) {
          if (response.code === '00000') {
            this.$alert('卡片解挂成功', '', {
              confirmButtonText: '确定'
            })
          } else {
            this.$alert('' + response.message, '卡片解挂失败', {
              confirmButtonText: '确定'
            })
          }
        }.bind(this)).then(this.onQueryList)
      }
      if (submitType === '注销') {
        this.dialogFormVisible = false
        discardCard(submitData).then(function (response) {
          if (response.code === '00000') {
            this.$alert('卡片注销成功', '', {
              confirmButtonText: '确定'
            })
          } else {
            this.$alert('' + response.message, '卡片注销失败', {
              confirmButtonText: '确定'
            })
          }
        }.bind(this)).then(this.onQueryList)
      }
      if (submitType === '退卡') {
        submitData.uuid = this.cardLostForm.uniqueCode
        this.dialogFormVisible = false
        handleBackCard(submitData).then(function (response) {
          if (response.code === '00000') {
            this.$alert('卡片退卡成功', '', {
              confirmButtonText: '确定'
            })
          } else {
            this.$alert('' + response.message, '卡片退卡失败', {
              confirmButtonText: '确定'
            })
          }
        }.bind(this)).then(this.onQueryList)
      }
    },
    // 遍历对象属性，将字符串属性去除前后空格，表单输入框类控件需要取值前去空格
    trimObjProperty (obj) {
      console.log('去除空格前：' + JSON.stringify(obj))
      if (obj === null || obj === undefined) {
        return
      }
      // 去除前后空格
      for (var pro in obj) {
        if (typeof (obj[pro]) === 'string') {
          obj[pro] = this.trim(obj[pro])
        }
      }
      console.log('去除空格后：' + JSON.stringify(obj))
    },
    trim (str) {
      return String(str).replace(/(^\s*)|(\s*$)/g, '')
    },
    ltrim (str) {
      return String(str).replace(/(^\s*)/g, '')
    },
    rtrim (str) {
      return String(str).replace(/(\s*$)/g, '')
    },
    dateFormat (timestamp) {
      var date = new Date(timestamp)
      var year = date.getFullYear() + '-'
      var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var minutes = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      var seconds = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      return year + month + day + hour + minutes + seconds
    },
    getStartTime () {
      var date = new Date()
      var year = date.getFullYear() + '-'
      var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      return year + month + day + '00:00:00'
    },
    dateSelected (val, flag) {
      console.log('val=' + val)
      if (val !== '') {
        var currentYear = new Date(val).getFullYear()
        if (currentYear - 2999 > 0) {
          this.$alert('选择的查询日期不能超过2999年', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.listQuery[flag] = ''
            }
          })
        }
      }
    }
  }
}
</script>

<style scoped="scoped">
  #cardDetail {
    margin-top: 20px;
    border-top: 2px solid #409EFF;
    padding-top: 20px;
  }
  .el-form-item__content div {
    width: 200px;
  }
  #dateSeparator {
    text-align: center;
    margin: 0px 18px;
  }
  .datePickerDistance {
    margin-left: 5px;
    margin-right: 5px;
  }
  .operateButton{
    padding:5px 4px;
    margin:5px 1px;
    color: #fff;
    background-color: #67c23a;
    border-color: #409EFF;
    font-size: 12px;
  }
  #dialogCardBindInfo div{
    text-align: center;
  }
  #dialogCardBindInfo div.el-form-item{
    text-align: left;
    margin-left: 10%;
  }
  #dialogCardBindInfo .el-form-item__content>div{
    width: 70%;
  }
</style>