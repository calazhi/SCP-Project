<template>
  <div class="container patro-param">
    <div v-show="showParamApp">
      <el-row :gutter="20" class="row-box">
        <div>
          <el-form label-width="80px " :model="ruleForm" :rules="rules" ref="patrolParam" class="form-one">
            <el-col :span="6">
              <el-form-item label="路线名称：" label-width="100px" class="plan-name" prop="paramName">
                <el-input v-model.trim="ruleForm.paramName" auto-complete="off" @keyup.native.enter="queryList" :maxlength="32"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备：" prop="queryDevice">
                <el-select placeholder="请选择" v-model="ruleForm.queryDevice">
                  <el-option v-for="item in deviceList" :key="item.deviceID" :label="item.deviceName" :value="item.deviceID"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <el-button class="el-button-add el-button--primary" @click="queryList">查询</el-button>
          </div>
          <div class="grid-content bg-purple">
            <el-button class="el-button-add el-button--primary" @click="resetForm">重置</el-button>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <el-button class="el-button-add el-button--primary" type="button" @click="addPatrolPram">添加</el-button>
          </div>
          <div class="grid-content bg-purple">
            <el-button type="danger" class="el-button-add el-button--primary" @click="deleteRow">删除</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="parame-table">
        <el-row class="row-box patrolParam-table">
          <el-table :data="patrolParmData" border @selection-change="handleSelectionChange" align="center">
            <el-table-column label="" type="selection" class="el-table-column-all" header-align="center"></el-table-column>
            <el-table-column label="序号" type="index" header-align="center" width="100px"></el-table-column>
            <el-table-column label="路线名称" prop="scope" header-align="center">
              <template slot-scope="scope">
                <a href="javascript:;" class="pointer-box" @click="handleEdit(scope.$index, scope.row)">{{scope.row.paramName}}</a>
              </template>
            </el-table-column>
            <el-table-column label="设备" prop="deviceName" header-align="center"> </el-table-column>
            <el-table-column label="时长" prop="timeLong" header-align="center"></el-table-column>
            <el-table-column label="备注" prop="remark" header-align="center"></el-table-column>
            <!-- <el-table-column label="操作" prop="scope" header-align="center"> 
               <template slot-scope="scope">
                <el-button size="mini" @click="drawPath(scope.$index, scope.row)">画线</el-button>
              </template>
            </el-table-column> -->
          </el-table>
          <div class="block pagination-box">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageData.pageNo" :page-sizes="[5, 10, 20, 30]" :page-size="pageData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageData.total">
            </el-pagination>
          </div>
        </el-row>
      </div>
    </div>
    <parameter-save ref="paramSave" :queryId="infoId" :show="show" :deviceList="deviceList" @closeDialog="closeSave" :refresh="refresh"></parameter-save>
    <!-- <draw-line v-show="showMap" ref="DrawLine" :showMap="showMap" :pointrelationInfo="pointrelationInfo" :rowInfo="rowInfo" @fromDrawLine="fromDrawLine" :refresh="refresh"></draw-line> -->
  </div>
</template>
<script>
import ParameterSave from './components/dialogs/ParameterSave'
// import DrawLine from './DrawLine.vue'
// import { getPatrolParamAppData, postDelParamData, getDviceListData, getParamRelationData } from './apis/paramAPI'
import { getPatrolParamAppData, postDelParamData, getDviceListData } from './apis/paramAPI'
export default {
  data () {
    var checkparamName = (rule, value, callback) => {
      setTimeout(() => {
        if (value.trim() && !/^[\u4e00-\u9fa50-9A-Za-z]+$/.test(value.trim())) {
          callback(new Error('输入姓名只能为中文、英文和数字'))
        } else {
          callback()
        }
      }, 100)
    }
    // 路线名称
    return {
      sceneList: [],
      patrolParmData: [],
      showParamApp: true,
      show: false,
      showMap: false,
      showstate: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      // 设备列表
      deviceList: [],
      formLabelWidth: '120px',
      ruleForm: {
        paramName: '',
        queryDevice: ''
      },
      // queryDevice: '',
      multipleSelection: [],
      pageData: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      flag: 'add',
      infoId: '',
      paramInfo: {},
      rowInfo: {},
      pointrelationInfo: {},
      rules: {
        paramName: [
          { validator: checkparamName, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getPatrolParamList()
    this.getDvicesList()
  },
  methods: {
    refresh () {
      this.queryList()
    },
    // 添加巡查参数配置
    addPatrolPram () {
      // 清空添加页面表单
      this.$refs.paramSave.clearData()
      this.infoId = ''
      this.show = true
      this.flag = 'add'
    },
    // 关闭弹窗
    closeSave () {
      this.show = false
      // this.infoId = ''
      this.queryList()
    },
    // 重置
    resetForm () {
      this.$refs['patrolParam'].resetFields()
      // this.ruleForm.paramName = ''
      // this.ruleForm.queryDevice = ''
      this.pageData.pageNo = 1
      this.pageData.pageSize = 10
    },
    // 获取设备列表
    getDvicesList () {
      getDviceListData().then(res => {
        if (res.data.code === '00000') {
          this.deviceList = res.data.data
        } else {
          this.$message.error('获取设备列表失败')
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 获取巡查参数list
    getPatrolParamList () {
      if (this.ruleForm.paramName.trim() && !/^[\u4e00-\u9fa50-9A-Za-z]+$/.test(this.ruleForm.paramName.trim())) {
        this.$message({
          message: '路线名称只能输入中文、英文和数字',
          type: 'warning'
        })
        this.ruleForm.paramName = ''
        return false
      }
      let param = {
        pageNo: this.pageData.pageNo,
        pageSize: this.pageData.pageSize,
        paramName: this.ruleForm.paramName,
        deviceId: this.ruleForm.queryDevice
      }
      getPatrolParamAppData(param).then((rs) => {
        this.patrolParmData = []
        if (rs.data.code === '00000') {
          if (rs.data.data != null) {
            this.patrolParmData = rs.data.data.rows
            this.pageData.total = rs.data.data.total
          } else {
            this.patrolParmData = []
            this.pageData.total = 0
          }
        } else {
          this.patrolParmData = []
          this.$message.error('获取数据失败')
        }
      })
    },
    // 查询
    queryList () {
      this.getPatrolParamList()
    },
    // 删除
    deleteRow () {
      let param = {}
      param.patrolParamIds = this.multipleSelection
      if (param.patrolParamIds.length === 0) {
        this.$message({
          type: 'info',
          message: '请选择要删除的项目'
        })
      } else {
        this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          postDelParamData(param).then(res => {
            if (res.data.code === '00000') {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              // 请求最新列表
              this.getPatrolParamList()
            } else {
              this.$message.error(res.data.message)
            }
          }).catch(err => {
            this.$message.error(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 更新
    handleEdit (index, row) {
      this.show = true
      this.flag = 'modify'
      this.infoId = row.uuid
    },
    // 画线
    // drawPath (index, row) {
    //   let param = {
    //     patrolParamId: row.uuid
    //   }
    //   getParamRelationData(param).then(res => {
    //     if (res.data.code === '00000') {
    //       this.pointrelationInfo = res.data.data
    //       this.showParamApp = false
    //       this.showMap = true
    //     } else {
    //       this.$message.error(res.data.message)
    //     }
    //   })
    //   this.rowInfo = row
    // },
    // 接收从DrawLine组件传递过来的值
    fromDrawLine () {
      this.queryList()
      this.showParamApp = true
      this.showMap = false
    },
    // 表格选中项
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach(i => {
        this.multipleSelection.push(i.uuid)
      })
    },
    handleSizeChange (val) {
      this.pageData.pageSize = val
      this.getPatrolParamList()
    },
    handleCurrentChange (val) {
      this.pageData.pageNo = val
      this.getPatrolParamList()
    }
  },
  components: {
    // DrawLine,
    ParameterSave
  }
}
</script>
<style scoped lang="less">
.patro-param {
  margin: 10px;
  .row-box {
    margin: 10px 0;
    .grid-content {
      display: inline-block;
    }
    .pagination-box {
      text-align: center;
      padding: 20px 0;
    }
  }
  .table-btn {
    margin-top: 25px;
  }
  .el-input {
    width: 150px;
    margin: 0 100px 0 15px;
  }
  .el-select {
    width: 200px;
    margin: 0 100px 0 15px;
  }
  .el-button-add {
    margin-right: 15px;
  }
  .patrolParam-table {
    width: 100%;
    .el-table {
      width: 100%;
      margin-top: 10px;
      th,
      td {
        .cell {
          text-align: center;
        }
      }
      .pointer-box {
        cursor: pointer;
        color: #409eff;
      }
    }
  }
}
</style>
<style lang="less">
.patro-param {
  .el-dialog {
    width: 800px;
  }
  .el-table--border td,
  .el-table--border th {
    text-align: center;
  }
}
.parame-table {
  .el-table__body-wrapper {
    overflow-x: hidden;
  }
}
</style>


