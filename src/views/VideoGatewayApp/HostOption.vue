<template>
  <div class="hostOption">
    <el-col :span="24">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :inline="true" label-width="80px">
        <el-form-item label="报警主机" prop="deviceName">
          <el-select v-model="ruleForm.deviceName" placeholder="请选择报警主机" @change="handleQuerry">
            <el-option v-for="item in alldata" :key="item.deviceId" :label="item.deviceName" :value="item.deviceId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="防区名称" class="selectHostOption" prop="defenceArea">
          <el-input style="width:180px" v-model.trim="ruleForm.defenceArea" @keyup.native.enter="handleQuerry" placeholder="字符长度不能超过32个" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuerry">查询</el-button>
          <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
          <el-button type="primary" @click="handleDeployDefence">布防</el-button>
          <el-button type="primary" @click="handleDisarm">撤防</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <div class="hostOption-table">
      <el-table ref="multipleTable" :data="data" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column type="index" label="序号" align="center" width="100">
        </el-table-column>
        <el-table-column prop="defenseZoneCode" label="防区编号" align="center">
        </el-table-column>
        <el-table-column prop="defenseZoneName" label="防区名称" align="center">
        </el-table-column>
        <el-table-column prop="defenseZoneNum" label="防区号" align="center">
        </el-table-column>
        <el-table-column prop="subOrgName" label="资源位置" align="center">
        </el-table-column>
        <el-table-column prop="alarmHostName" label="报警主机名称" align="center">
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="150">
        </el-table-column>
      </el-table>
    </div>
    <div class='page-bar' v-show="data && data.length">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageData.pageNo" :page-sizes="[5, 10, 15]" :page-size="pageData.pageSize" layout=" total, sizes,prev, pager, next, jumper" :total="pageData.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getalarmList, postHostData, postDefence } from './apis/hostOption'
export default {
  data () {
    // 防区名称正则验证
    let defenceArea = (rule, value, callback) => {
      if (value && !/^[\u4e00-\u9fa50-9A-Za-z]+$/.test(value)) {
        callback(new Error('防区名称只能为中文、英文和数字,并且中间不能有空格'))
      } else {
        callback()
      }
    }
    return {
      defenceType: '',
      data: [],
      alldata: [],
      defenseZoneChoseList: [],
      pageData: {
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      ruleForm: {
        deviceName: '',
        defenceArea: ''
      },
      rules: {
        defenceArea: [
          { validator: defenceArea, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getAlarmLists()
    this.handleQuerry()
  },
  methods: {
    // handleBlur () { // 输入框长度超过32个弹框提示
    //   if (this.ruleForm.defenceArea.length > 32) {
    //     this.$message({
    //       showClose: true,
    //       duration: 3000,
    //       message: '防区名称字符长度不能超过32个',
    //       type: 'error'
    //     })
    //   }
    //   this.ruleForm.defenceArea = ''
    // },
    getAlarmLists () { // 获取下拉选项菜单列表
      getalarmList().then(res => {
        if (res.data.code === '00000') {
          this.alldata = res.data.data
          if (res.data.data && res.data.data.length) {
            this.alldata.unshift({ deviceName: '全部' })
          }
        }
      })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pageData.pageSize = val
      this.handleQuerry()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pageData.pageNo = val
      this.handleQuerry()
    },
    handleQuerry () { // 点击查询按钮
      let param = {
        pageSize: this.pageData.pageSize,
        pageNo: this.pageData.pageNo
      }
      if (this.ruleForm.deviceName) { // 报警主机有选中值时传此参数,全部或者不选时不传此参数
        param.deviceCodeList = [this.ruleForm.deviceName]
      }
      if (this.ruleForm.defenceArea) { // 防区筛选条件传参
        param.defenseZoneName = this.ruleForm.defenceArea
      }
      postHostData(param).then(res => {
        if (res.data.code === '00000') {
          this.pageData.total = res.data.data.total
          this.data = res.data.data.rows
        } else {
          this.$message({
            showClose: true,
            message: '数据加载失败',
            type: 'error',
            duration: 1000
          })
        }
      })
    },
    resetForm (formName) { // 点击重置按钮
      this.$refs[formName].resetFields()
      this.handleQuerry()
    },
    // 选中列表里的所有文件
    handleSelectionChange (val) { // 多选框中的选中事件
      this.defenseZoneChoseList = val
    },
    toggleSelection () { // 取消勾选项
      this.$refs.multipleTable.clearSelection()
    },
    handleDeployDefence () { // 点击布防按钮
      this.defenceType = '1'
      this.handleDefenceMethods()
    },
    handleDisarm () { // 点击撤防按钮
      this.defenceType = '0'
      this.handleDefenceMethods()
    },
    handleDefenceMethods () {
      let selectedList = []
      this.defenseZoneChoseList.forEach((element, index) => {
        selectedList.push({ defenseZoneCode: element.defenseZoneCode, alarmHostCode: element.alarmHostCode, defenseZoneNum: element.defenseZoneNum })
      })
      if (selectedList.length === 0) {
        let msg = this.defenceType === '1' ? '您还没有选中需要布防的内容' : '您还没有选中需要撤防的内容'
        this.$message({
          type: 'error',
          message: msg,
          showClose: true,
          duration: 1000
        })
        return false
      }
      let param = {
        defenseZoneChoseList: selectedList
      }
      if (this.defenceType === '1') {
        param.controlType = 1
      } else if (this.defenceType === '0') {
        param.controlType = 0
      }
      postDefence(param).then(rs => {
        if (rs.data.code === '00000') {
          this.$message({
            type: 'success',
            message: '命令已下发，请稍后重新查询状态',
            showClose: true,
            duration: 1000
          })
          this.toggleSelection()
        } else {
          let msg = this.defenceType === '1' ? '布防失败' : '撤防失败'
          this.$message({
            type: 'error',
            message: msg,
            showClose: true,
            duration: 1000
          })
          this.toggleSelection()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.hostOption {
  .selectHostOption {
    margin-right: 100px;
  }
  .page-bar {
    margin-top: 30px;
    text-align: center;
  }
  .hostOption-table {
    margin-top: 80px;
  }
}
</style>

