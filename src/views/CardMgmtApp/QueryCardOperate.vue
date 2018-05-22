<template>
  <div id="cardDetail">
    <el-form :inline="true" :model="listQuery" ref="listQuery" class="demo-form-inline">
      <div>
      <el-row>
      <el-col :span="10">
        <el-form-item label="物理卡号">
          <el-input placeholder="请输入物理卡号" v-model.trim="listQuery.uniqueCode"/>
        </el-form-item>
        <el-form-item label="卡面编号">
          <el-input placeholder="请输入卡面编号" v-model.trim="listQuery.facadeCode"/>
        </el-form-item>
        </el-col>
      <el-col :span="10">
        <el-form-item label="卡片类型">
          <el-select v-model="listQuery.cardType" placeholder="请选择卡片类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="ID卡" value="ID"></el-option>
            <el-option label="IC卡" value="IC"></el-option>
            <el-option label="CPU卡" value="CPU"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡务类型">
          <el-select v-model="listQuery.operateType" placeholder="请选择卡务类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="入库" value="REGISTER"></el-option>
            <el-option label="发行" value="ISSUE"></el-option>
            <el-option label="挂失" value="LOSE"></el-option>
            <el-option label="解挂" value="DIS-LOSE"></el-option>
            <el-option label="退还" value="RETURN"></el-option>
            <el-option label="注销" value="DISCARD"></el-option>
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
        <el-form-item label="操作时段">
          <el-date-picker v-model="listQuery.validTime" type="datetime" @change="dateSelected($event, 'validTime')" placeholder="选择日期"/>
        </el-form-item>
        <el-form-item label="—" class="datePickerDistance" id="dateSeparator"/>
        <el-form-item>
          <el-date-picker v-model="listQuery.expireTime" type="datetime" @change="dateSelected($event, 'expireTime')" placeholder="选择日期"/>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="持卡人" style="margin-left:2%;">
          <el-input placeholder="请输入持卡人名称" v-model.trim="listQuery.ownerName"/>
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
      <el-table-column prop="operateType" align="center" label="卡务类型" :formatter="operateTypeFormatter"/>
      <el-table-column prop="ownerName" align="center" label="持卡人" />
      <el-table-column prop="operateTime" align="center" label="操作时间" />
      <el-table-column prop="operatorName" align="center" label="操作人" />
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
  </div>
</template>

<script type="text/javascript">
import { queryCardOperateList } from './apis'
export default {
  mounted () {
    this.loadData()
  },
  data () {
    return {
      loading2: true,
      tableData: [],
      listQuery: {
        uniqueCode: '',
        facadeCode: '',
        cardType: '',
        operateType: '',
        validTime: '',
        expireTime: '',
        ownerName: '',
        currentPage: 1,
        pageSize: 10,
        totalAccount: 0
      }
    }
  },
  methods: {
    onQueryList () {
      console.log(JSON.stringify(this.listQuery))
      queryCardOperateList(this.listQuery).then(function (response) {
        console.log('返回结果为: ' + JSON.stringify(response))
        if (response.code === '00000') {
          // 处理日期格式
          var listData = response.data.list
          for (var i = 0; i < listData.length; i++) {
            listData[i].operateTime = this.dateFormat(listData[i].operateTime)
            listData[i].createTime = this.dateFormat(listData[i].createTime)
            listData[i].updateTime = this.dateFormat(listData[i].updateTime)
          }
          this.tableData = listData
          this.listQuery.totalAccount = response.data.pageCount
        }
      }.bind(this))
    },
    onResetCondition () {
      this.listQuery.uniqueCode = ''
      this.listQuery.facadeCode = ''
      this.listQuery.cardType = ''
      this.listQuery.operateType = ''
      this.listQuery.validTime = ''
      this.listQuery.expireTime = ''
      this.listQuery.ownerName = ''
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
    operateTypeFormatter (row, column, cellValue) {
      if (row.operateType === 'REGISTER') {
        return '入库'
      }
      if (row.operateType === 'ISSUE') {
        return '发行'
      }
      if (row.operateType === 'LOSE') {
        return '挂失'
      }
      if (row.operateType === 'DIS-LOSE') {
        return '解挂'
      }
      if (row.operateType === 'RETURN') {
        return '退还'
      }
      if (row.operateType === 'DISCARD') {
        return '注销'
      }
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
    margin:2px;
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