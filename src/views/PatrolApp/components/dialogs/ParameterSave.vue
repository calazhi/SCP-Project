<template>
  <div class="paramter-save-dailog">
    <el-dialog :visible="show" @close="closeDialog">
      <el-form :model="patrolParam" :rules="rules" ref="patrolParam" class="demo-ruleForm" :show-message="showMsg">
        <el-form-item label="路线名称" :label-width="formLabelWidth" prop="paramName">
          <el-input size="small" v-model.trim="patrolParam.paramName" @blur="chackName" clearable :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="设备" :label-width="formLabelWidth" prop="deviceId">
          <el-select size="small" v-model="patrolParam.deviceId" placeholder="请选择设备">
            <el-option v-for="item in deviceList" :key="item.deviceID" :label="item.deviceName" :value="item.deviceID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时长(分钟)" :label-width="formLabelWidth" prop="timeLong">
          <el-input size="small" v-model.trim="patrolParam.timeLong"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="patrolParam.remark" auto-complete="off" :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <el-row :gutter="20" class="row-box">
        <el-col :span="3">
          <span>巡查点：</span>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button class="el-button--primary" size="small" type="button" @click="openChoose">选择</el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button class="el-button--primary" size="small" type="button" @click="delTable">删除</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <span class="tips">(最大间隔总和不能大于巡查路线时长，首个间隔时间为距离开始时间的间隔时间)</span>
      </el-row>
      <!-- table -->
      <el-table class="table-box" :data="list" border ref="multipleTable" @selection-change="handleSelectionChange" tooltip-effect="dark" style="width: 100%" height="300">
        <el-table-column width="80px" label="" type="selection" header-align="center"></el-table-column>
        <el-table-column width="100px" label="次序" type="index" prop="index" header-align="center"></el-table-column>
        <el-table-column label="名称" prop="pointName" header-align="center"></el-table-column>
        <el-table-column label="操作" header-align="center">
          <template slot-scope="scope">
            <el-button class="el-button" size="small" type="button" @click="upClick(scope.$index, scope.row)">上移</el-button>
            <el-button class="el-button" size="small" type="button" @click="downClick(scope.$index, scope.row)">下移</el-button>
          </template>
        </el-table-column>
        <el-form :rules="rules" ref="tableRule" class="demo-ruleForm" :show-message="showMsg">
          <el-form-item prop="interval">
            <el-table-column label="最大间隔时间(min)" header-align="center">
              <template slot-scope="scope">
                <el-input type="number" min="1" max="1440" size="small" v-model.number="scope.row.interval" placeholder="请输入间隔时间(min)" @blur="intervalRule(scope.row.interval)"></el-input>
              </template>
            </el-table-column>
          </el-form-item>
        </el-form>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('patrolParam')">保 存</el-button>
        <el-button @click="closeDialog('patrolParam')">取 消</el-button>
      </div>
    </el-dialog>
    <patrol-choose :show="show" :innerDialog="innerDialog" @closeDialog="closeChoose" @patrolChooseSave="patrolChooseSave"></patrol-choose>
  </div>
</template>
<script>

import PatrolChoose from './PatrolChoose.vue'
import { postModifyParamData, postAddParamData, getInfoData, getCheckParamNameData } from '../../apis/paramAPI'

export default {
  props: {
    refresh: {
      type: Function,
      default: null
    },
    show: {
      required: true,
      type: Boolean,
      default () {
        return false
      }
    },
    queryId: {
      type: String,
      default: ''
    },
    deviceList: ''
  },
  components: {
    PatrolChoose
  },
  data () {
    // 路线名称正则
    let plannameCheck = (rule, value, callback) => {
      if (this.patrolParam.paramName.trim() && !/^[\u4e00-\u9fa50-9A-Za-z]+$/.test(this.patrolParam.paramName.trim())) {
        callback(new Error('输入只能为中文、英文和数字,名称中间不能有空格'))
      } else {
        callback()
      }
    }
    return {
      bigFlag: true,
      nullFlag: false,
      paramData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      innerDialog: false,
      tableSelection: [],
      value: '',
      // 添加、修改接口参数
      patrolParam: {
        paramId: '',
        paramName: '',
        deviceId: '',
        remark: '',
        timeLong: '',
        courtUuid: ''
      },
      list: [
        {
          uuid: '',
          pointId: '',
          paramId: '',
          interval: '',
          orderNo: '',
          courtUuid: ''
        }
      ],
      changeName: '',
      showMsg: true,
      rules: {
        paramName: [
          { required: true, message: '请输入路线名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度不能超过50个字符', trigger: 'blur' },
          { validator: plannameCheck, trigger: 'blur' }
        ],
        deviceId: [
          { required: true, message: '请选择设备', trigger: 'change' }
        ],
        timeLong: [
          { required: true, validator: this.testTimeLong, trigger: 'blur' }
        ],
        interval: [
          { required: true, validator: this.intervalRule, trigger: 'blur, change' }
        ]
      },
      paramInfo: {},
      infoId: ''
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.infoId = this.queryId ? this.queryId : ''
        if (this.queryId) {
          this.getDetailInfo()
        }
      }
    }
  },
  methods: {
    // 时长验证规则
    testTimeLong (rule, value, callback) {
      if (value === '') {
        return callback(new Error('时长不能为空'))
      }
      setTimeout(() => {
        if (!/^[0-9]+$/.test(value)) {
          callback(new Error('时长只能输入整数'))
        } else {
          if (value > 0 && value <= 1440) {
            callback()
          } else {
            callback(new Error('时长只能在1-1440的范围内'))
          }
        }
      }, 100)
    },
    // 间隔验证规则
    intervalRule (value) {
      if (value === '') {
        this.$message({
          message: '间隔时间不能为空',
          type: 'warning'
        })
      } else if (!Number.isInteger(value)) {
        this.$message({
          message: '时长只能输入整数',
          type: 'warning'
        })
      } else if (value > 0 && value <= 1440) {
        this.showMsg = true
      } else {
        this.$message({
          message: '时长只能在1-1440的范围内',
          type: 'warning'
        })
      }
    },
    refreshList () {
      if (this.refresh) {
        this.refresh()
      }
    },
    // 巡查路线重名检测
    chackName () {
      if (this.patrolParam.paramName && (this.paramInfo.paramName !== this.patrolParam.paramName)) {
        let param = {
          paramName: this.patrolParam.paramName
        }
        getCheckParamNameData(param).then(res => {
          if (res.data.data !== 0) {
            this.$message.error('巡查路线名称不可重复！')
            this.patrolParam.paramName = ''
          }
        })
      }
    },
    // 请求详情 & 赋值
    getDetailInfo () {
      getInfoData(this.infoId).then(res => {
        if (res.data.code === '00000') {
          this.paramInfo = res.data.data
          this.patrolParam.paramId = this.paramInfo.uuid
          this.patrolParam.paramName = this.paramInfo.paramName
          this.patrolParam.deviceId = this.paramInfo.deviceId
          this.patrolParam.timeLong = this.paramInfo.timeLong
          this.patrolParam.remark = this.paramInfo.remark
          this.patrolParam.courtUuid = this.paramInfo.courtUuid
          // 处理巡查点信息
          this.list = []
          if (this.paramInfo.patrolPoints) {
            this.paramInfo.patrolPoints.forEach(i => {
              let pointInfo = {}
              pointInfo.uuid = i.uuid
              pointInfo.paramId = i.paramId
              pointInfo.interval = i.interval
              pointInfo.orderNo = i.orderNo
              pointInfo.courtUuid = i.courtUuid
              pointInfo.createTime = i.createTime
              pointInfo.updateTime = i.updateTime
              pointInfo.createUser = i.createUser
              pointInfo.updateUser = i.updateUser
              pointInfo.pointName = i.pointName
              this.list.push(pointInfo)
            })
          }
        } else {
          this.paramInfo = {}
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 清空表单和table
    clearData () {
      // this.$refs['patrolParam'].resetFields()
      this.patrolParam.paramId = ''
      this.patrolParam.paramName = ''
      this.patrolParam.deviceId = ''
      this.patrolParam.timeLong = ''
      this.patrolParam.remark = ''
      this.patrolParam.courtUuid = ''
      this.patrolParam.remark = ''
      this.list = []
      this.infoId = ''
      this.paramInfo = {}
    },
    // 提交更改 & 表单验证
    submitForm () {
      this.$refs['patrolParam'].validate((valid) => {
        if (valid) {
          this.ParameterSave()
        } else {
          return false
        }
      })
    },
    // 保存添加或更新
    ParameterSave () {
      // 处理list
      let forList = []
      this.bigFlag = true
      this.nullFlag = false
      let sum = 0
      this.list.forEach((i, index) => {
        sum = sum + Math.floor(i.interval)
        let resobj = {}
        resobj.paramId = i.paramId
        resobj.pointId = i.uuid
        resobj.interval = i.interval ? Math.floor(i.interval) : ''
        resobj.orderNo = index + 1
        resobj.courtUuid = i.courtUuid
        resobj.createTime = i.createTime
        resobj.updateTime = i.updateTime
        resobj.createUser = i.createUser
        resobj.updateUser = i.updateUser
        if (i.interval === '') {
          forList = []
          this.nullFlag = true
          return false
        }
        forList.push(resobj)
        if (i.interval <= 0) {
          this.bigFlag = false
          return false
        }
      })
      // 判空提示
      if (this.list.length === 0) {
        this.$message.error('请选择巡查点！')
        return false
      }
      if (forList.length === 0 || this.nullFlag) {
        this.$message.error('间隔时间不能为空！')
        return false
      }
      if (!this.bigFlag) {
        this.$message.error('间隔时间必须大于0')
        return false
      }
      // 判断间隔总和是否超出时长
      if (sum > this.patrolParam.timeLong) {
        this.$message.error('间隔时间总和不能大于时长')
        return false
      }
      // 处理param
      let param = {
        uuid: this.patrolParam.paramId,
        paramName: this.patrolParam.paramName,
        deviceId: this.patrolParam.deviceId,
        remark: this.patrolParam.remark,
        timeLong: this.patrolParam.timeLong
      }
      param.list = forList

      if (this.paramInfo.uuid === undefined) {
        param.uuid = null
        // 请求添加接口
        postAddParamData(param).then(res => {
          if (res.data.code === '00000') {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.$emit('closeDialog', param)
            this.clearData()
          } else {
            this.$message.error(res.data.message)
          }
        })
      } else {
        // 请求更新接口
        postModifyParamData(param).then((rs) => {
          if (rs.data.code === '00000') {
            this.$message({
              message: rs.data.message,
              type: 'success'
            })
            this.$emit('closeDialog', param)
            this.clearData()
          } else {
            this.$message.error(rs.data.message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      }
    },
    // 关闭弹窗
    closeDialog () {
      this.$emit('closeDialog')
      this.clearData()
      this.$refs['patrolParam'].resetFields()
    },
    // 打开选择弹窗
    openChoose () {
      this.innerDialog = true
      this.show = true
      this.prevPages = 1
    },
    // 关闭选中弹窗
    closeChoose () {
      this.innerDialog = false
    },
    // 表格选中
    handleSelectionChange (val) {
      this.tableSelection = val
    },
    // 删除表格项目
    delTable () {
      // 从form的list里面截取掉对应位置的项目
      this.tableSelection.forEach(j => {
        let list = this.list
        this.list.forEach((i, index) => {
          if (j.uuid === i.uuid) {
            list.splice(index, 1)
          }
        })
      })
    },
    // 上移
    upClick (index) {
      if (index === 0) {
        return false
      } else {
        this.list.splice(index - 1, 0, this.list.splice(index, 1)[0])
      }
    },
    // 下移
    downClick (index) {
      if (index === this.list.length) {
        return false
      } else {
        this.list.splice(index + 1, 0, this.list.splice(index, 1)[0])
      }
    },
    // 接收子组件传递的值
    patrolChooseSave (select) {
      let getList = select
      this.list.forEach(item => {
        select.forEach((i, index) => {
          if (item.uuid === i.uuid) {
            getList.splice(index, 1)
          }
        })
      })
      this.list = this.list.concat(select)
    }
  }
}
</script>
<style lang="less">
.paramter-save-dailog {
  .el-dialog {
    margin-top: 10vh !important;
  }
}
</style>

<style lang="less" scoped>
.paramter-save-dailog {
  .table-btn {
    margin: 10px 0;
  }
  .tips {
    display: inline-block;
    color: red;
    margin-bottom: 10px;
  }
  .el-table {
    text-align: center;
    tbody {
      max-height: 100px;
      overflow-y: auto;
    }
  }
  .el-button {
    margin-left: 20px;
  }
  .el-select {
    width: 100%;
  }
  .el-table-btn {
    width: 80%;
  }
  .patrolPointBtn {
    margin-top: 20px;
  }
  .el-table-up,
  .el-table-down {
    position: absolute;
    width: 10px;
    height: 60px;
    white-space: pre-wrap;
  }
  .el-table-up {
    bottom: 300px;
    right: 20px;
  }
  .el-table-down {
    bottom: 200px;
    right: 20px;
  }
  .row-box {
    margin-bottom: 20px;
  }
}
</style>



