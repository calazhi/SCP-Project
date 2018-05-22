<template>
  <div>
    <div class="event-app">
      <div class="event-form">
        <el-form ref="eventForm" class="el-form" :model="eventForm" label-width="80px">
          <el-row>
            <el-form-item label="事件类型" prop="eventType" class="form-item">
              <el-select v-model="eventForm.eventType" placeholder="请选择事件类型" @change="doChange" class="item">
                <el-option v-for="item in eventTypes" :key="item.id" :label="item.label" :value="item.id">{{item.label}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="凭证类型" prop="permissionType" class="form-item">
              <el-select v-model="eventForm.permissionType" placeholder="请选择事件类型" class="item" :disabled="isdisabled">
                <el-option label="全部" :value="0">全部</el-option>
                <el-option label="卡片" :value="2">卡片</el-option>
                <el-option label="指纹" :value="6">指纹</el-option>
                <el-option label="人脸识别" :value="7">人脸识别</el-option>
                <el-option label="二维码" :value="8">二维码</el-option>
                <el-option label="蓝牙" :value="9">蓝牙</el-option>
                <el-option label="动态密码" :value="11">动态密码</el-option>
                <el-option label="NFC" :value="12">NFC</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="人员姓名" prop="holderName" class="form-item">
              <el-input v-model.trim="eventForm.holderName" :disabled="holderDisabled" placeholder="输入内容不能超过20个字符" :maxlength="20" class="item"></el-input>
            </el-form-item>
            <el-form-item class="form-item">
              <el-button type="primary " @click.stop="submitForm('eventForm')">查询</el-button>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="梯控设备" prop="machineName" class="form-item">
              <el-input v-model.trim="eventForm.machineName" class="item" placeholder="输入内容不能超过20个字符" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="开始时间 " prop="createTime" class="form-item">
              <el-date-picker v-model="eventForm.createTime" value-format="yyyy-MM-ddTHH:mm:ss" :editable="false" type="datetime" placeholder="选择开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间 " prop="stopTime" class="form-item">
              <el-date-picker v-model="eventForm.stopTime" value-format="yyyy-MM-ddTHH:mm:ss" :editable="false" type="datetime" placeholder="选择结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="form-item">
              <el-button type="primary" @click="resetForm('eventForm')">重置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <el-table class="event-table" :data="tableData" tooltip-effect="light" border v-cloak>
        <el-table-column type="index" label="序号" width="50" :resizable="false" align="center">
        </el-table-column>
        <el-table-column prop="eventType" label="事件类型" :resizable="false" :formatter="formatEventType" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="开始时间" :resizable="false" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="stopTime" key="stopTime" v-if="eventForm.eventType===4" label="结束时间" :resizable="false" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="code" label="凭证码" key="code" v-if="eventForm.eventType===0||eventForm.eventType===1||eventForm.eventType===2||eventForm.eventType===3" :resizable="false" show-overflow-tooltip align="center">
          <template slot-scope="props">
            <a v-if="props.row.permissionType ===7 && props.row.code" class="linkfacePic" @click="openfacePic(props.row.code)">点击查看人脸</a>
            <a v-else>{{props.row.code}}</a>
          </template>
        </el-table-column>
        <el-table-column prop=" permissionType" key="permissionType" v-if="eventForm.eventType===0||eventForm.eventType===1||eventForm.eventType===2||eventForm.eventType===3" label="凭证类型" :formatter="formatPermissionType" :resizable="false " show-overflow-tooltip align="center ">
        </el-table-column>
        <el-table-column prop="holderName" key="holderName" v-if="eventForm.eventType===0||eventForm.eventType===1||eventForm.eventType===2||eventForm.eventType===3 || eventForm.eventType===4" label="人员姓名" :resizable="false " show-overflow-tooltip align="center ">
        </el-table-column>
        <el-table-column prop="robot" key="robot" v-if="eventForm.eventType===6||eventForm.eventType===7||eventForm.eventType===8||eventForm.eventType===9" label="机器人" :resizable="false " show-overflow-tooltip align="center ">
        </el-table-column>
        <el-table-column prop="machineName" label="梯控设备" :resizable="false " show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="entranceName" key="entranceName" v-if="eventForm.eventType===4 || eventForm.eventType===5" :label="eventForm.eventType===4?'门禁设备名称':eventForm.eventType===5?'室内机名称':''" :resizable="false " show-overflow-tooltip align="center ">
        </el-table-column>
        <el-table-column prop="floor" key="floor" v-if="eventForm.eventType===6 || eventForm.eventType===8 || eventForm.eventType===10 || eventForm.eventType===20 " :label="eventForm.eventType===6?'当前楼层':eventForm.eventType===8?'点亮楼层':eventForm.eventType===10?'目的楼层':eventForm.eventType===20?'轿厢楼层':''" :resizable="false " show-overflow-tooltip align="center ">
        </el-table-column>
        <el-table-column prop="state" key="state" v-if="eventForm.eventType===20 " label="轿厢状态" :resizable="false " show-overflow-tooltip align="center ">
          <template slot-scope="props">
            <a v-if="props.row.doorstatus ===80">故障</a>
            <a v-else></a>
          </template>
        </el-table-column>
        <el-table-column prop="doorstatus" key="doorstatus" v-if="eventForm.eventType===20 " label="轿厢门状态" :resizable="false " show-overflow-tooltip align="center ">
          <template slot-scope="props">
            <a v-if="props.row.doorstatus ===80">故障</a>
            <a v-else></a>
          </template>
        </el-table-column>
        <el-table-column prop="eventStatus" label="呼梯状态" key="eventStatus" v-if="eventForm.eventType===4||eventForm.eventType===5||eventForm.eventType===6||eventForm.eventType===7||eventForm.eventType===8||eventForm.eventType===9||eventForm.eventType===10" :resizable="false" show-overflow-tooltip align="center">
          <template slot-scope="props">
            <a v-if="props.row.eventStatus ===0">指令已下发</a>
            <a v-else-if="props.row.eventStatus ===1">指令执行成功</a>
            <a v-else-if="props.row.eventStatus ===2">指令执行失败</a>
            <a v-else></a>
          </template>
        </el-table-column>
      </el-table>
      <div class='event-pagination' v-show="tableData && tableData.length ">
        <el-pagination class="el-page " @size-change="handleSizeChange " @current-change="handleCurrentChange " :current-page.sync="pageNo " :page-sizes="[10, 15, 30, 50] " :page-size="pageSize " layout="total, sizes, prev, pager, next, jumper " :total="total ">
        </el-pagination>
      </div>
      <el-dialog title="人脸图片" :visible.sync="facePicVisible" width="350px" height="400px">
        <img :src="facePicPath" class="facePicSize" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { postLadderLogData } from './apis/index'
const eventTypes = [{ label: '无此卡号', id: 0 }, { label: '黑名单', id: 1 }, { label: '卡片权限过期', id: 2 }, { label: '合法卡', id: 3 }, { label: '呼梯事件', id: 4 }, { label: '室内呼梯事件', id: 5 }, { label: '云端内呼梯事件', id: 6 }, { label: '云端延迟关门事件', id: 7 }, { label: '云端点亮目的楼层事件', id: 8 }, { label: '主动查询电梯状态事件', id: 9 }, { label: '前端应用呼梯 ', id: 10 }, { label: '异常事件 ', id: 20 }]
const ERROK = '00000'
export default {
  data () {
    return {
      facePicVisible: false,
      tableData: [],
      eventTypes: eventTypes,
      eventForm: {
        eventType: 0,
        permissionType: 0,
        holderName: '',
        machineName: '',
        createTime: '',
        stopTime: ''
      },
      options: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      isdisabled: false,
      facePicPath: '',
      holderDisabled: false
    }
  },
  mounted () {
    this.queryList()
  },
  methods: {
    // 获取权限事件数据
    queryList () {
      postLadderLogData({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        eventType: this.eventForm.eventType,
        permissionType: this.eventForm.permissionType === 0 ? '' : this.eventForm.permissionType,
        holderName: this.eventForm.holderName,
        machineName: this.eventForm.machineName,
        startTime: this.eventForm.createTime,
        endTime: this.eventForm.stopTime
      })
        .then(res => {
          // 判断结果是否不为空
          if (res.data.code === ERROK) {
            if (res.data.data.ladderEventLogVos && res.data.data.ladderEventLogVos.length) {
              this.tableData = res.data.data.ladderEventLogVos
              this.total = res.data.data.totalCount
            } else {
              this.tableData = []
              this.total = 0
            }
          } else {
            this.$message({
              message: res.data.message ? res.data.message : '请求数据失败',
              type: 'error'
            })
            this.tableData = []
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 选择异常事件禁止卡号输入并且清空
    doChange () {
      this.tableData = []
      if (this.eventForm.eventType === 5 || this.eventForm.eventType === 6 || this.eventForm.eventType === 7 || this.eventForm.eventType === 8 || this.eventForm.eventType === 9 || this.eventForm.eventType === 10 || this.eventForm.eventType === 20) {
        this.eventForm.permissionType = 0
        this.eventForm.holderName = ''
        this.isdisabled = true
        this.holderDisabled = true
      } else if (this.eventForm.eventType === 4 || this.eventForm.eventType === 5 || this.eventForm.eventType === 6 || this.eventForm.eventType === 7 || this.eventForm.eventType === 8 || this.eventForm.eventType === 9 || this.eventForm.eventType === 10) {
        this.eventForm.permissionType = 0
        this.isdisabled = true
        this.holderDisabled = false
      } else {
        this.isdisabled = false
        this.holderDisabled = false
      }
      this.pageNo = 1
      this.queryList()
    },
    // 点击查看人脸
    openfacePic (code) {
      this.facePicVisible = true
      this.facePicPath = code
    },
    // 搜索
    submitForm (formName) {
      if (this.eventForm.stopTime && (this.eventForm.createTime > this.eventForm.stopTime)) {
        this.eventForm.stopTime = ''
        this.$message({
          message: '开始时间不能大于结束时间',
          type: 'warning'
        })
      } else if (this.eventForm.machineName.trim().length > 20) {
        this.$message({
          message: '输入梯控设备不能超多20个字符',
          type: 'warning'
        })
      } else if (this.eventForm.machineName.trim() && !/^[\u4e00-\u9fa5_a-zA-Z0-9\s]+$/.test(this.eventForm.machineName.trim())) {
        this.$message({
          message: '输入梯控设备只能为中文、英文、数字和下划线',
          type: 'warning'
        })
      } else if (this.eventForm.holderName.trim() && !/^[\u4e00-\u9fa50-9A-Za-z]+$/.test(this.eventForm.holderName.trim())) {
        this.$message({
          message: '输入持卡人只能为中文、英文和数字',
          type: 'warning'
        })
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.pageNo = 1
            this.queryList()
          } else {
            return false
          }
        })
      }
    },
    // 凭证码转换
    formatcode (row) {
      console.log(row)
    },
    // 凭证类型转换
    formatPermissionType (row) {
      return row.permissionType === 2 ? '卡片'
        : row.permissionType === 6 ? '指纹'
          : row.permissionType === 7 ? '人脸识别'
            : row.permissionType === 8 ? '二维码'
              : row.permissionType === 9 ? '蓝牙'
                : row.permissionType === 11 ? '动态密码'
                  : row.permissionType === 12 ? 'NFC'
                    : ''
    },
    // 事件类型显示转化
    formatEventType (row) {
      return row.eventType === 0 ? '无此卡号'
        : row.eventType === 1 ? '黑名单'
          : row.eventType === 2 ? '卡片权限过期'
            : row.eventType === 3 ? '合法卡'
              : row.eventType === 4 ? '呼梯事件'
                : row.eventType === 5 ? '室内呼梯事件'
                  : row.eventType === 6 ? '云端内呼梯事件'
                    : row.eventType === 7 ? '云端延迟关门事件'
                      : row.eventType === 8 ? '云端点亮目的楼层事件'
                        : row.eventType === 9 ? '主动查询电梯状态事件'
                          : row.eventType === 10 ? '前端应用呼梯 '
                            : row.eventType === 20 ? '异常事件'
                              : ''
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.tableData = []
      this.eventForm.cardId = ''
      this.eventForm.machineName = ''
      this.eventForm.createTime = ''
      this.eventForm.stopTime = ''
      this.pageNo = 1
      this.pageSize = 10
      this.queryList()
    },
    // 通过每页的条数向后端获取数据
    handleSizeChange (val) {
      this.pageSize = val
      this.queryList()
    },
    // 显示当前页数
    handleCurrentChange (val) {
      this.pageNo = val
      this.queryList()
    }
  }
}
</script>
<style lang="less" scoped>
[v-cloak] {
  display: none;
}
.event-app {
  .event-form {
    width: 100%;
    height: 100%;
    margin-top: 30px;
    .el-form {
      overflow: hidden;
    }
    .form-item {
      float: left;
      width: 25%;
    }
    .item {
      width: 220px;
    }
  }
  .event-table {
    width: 100%;
  }
  .event-pagination {
    margin-top: 20px;
    .el-page {
      text-align: center;
    }
  }
  .linkfacePic {
    padding: 0 10px;
    color: blue;
    cursor: pointer;
  }
  .facePicSize {
    width: 100%;
    height: 100%;
  }
}
</style>
<style lang="less">
.event-app {
  input:-ms-input-placeholder.el-input__inner {
    color: #c0c4cc;
  }
  .el-table__body-wrapper {
    overflow-x: hidden;
  }
}
</style>
