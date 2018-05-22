<template>
  <div>
    <!-- 功能项 -->
    <el-row :gutter="20">
      <el-col :span="3">
        <el-input v-model="pName" size="medium" placeholder="请输入巡查点名称"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" size="medium" @click="queryDate()">查 询</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" size="medium" @click="dialogAdd = true">添 加</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="danger" size="medium" @click="delData">删 除</el-button>
      </el-col>
    </el-row>
    <!-- 列表项 -->
    <el-table class="table-box" :data="patrolTable" style="width: 90%" @selection-change="handleSelectionChange" border>
      <el-table-column width="180" type="selection" align="center">
      </el-table-column>
      <el-table-column prop="index" type="index" label="序号" width="180" align="center">
      </el-table-column>
      <el-table-column label="名称" width="180" align="center" @click="dialogAmend = true">
        <span slot-scope="scope" @click="amend(scope.$index, scope.row)" type="text" style="color:blue;cursor:pointer">
          {{ scope.row.pointName }}
        </span>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="page-box" @size-change="handleSizeChange" background @current-change="handleCurrentChange" align='center' :current-page="pageData.pageNo" :page-sizes="[10,20,30,40,50]" :page-size="pageData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageData.total"></el-pagination>
    <!-- 添加弹出框 -->
    <el-dialog :visible.sync="dialogAdd" width="30%">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="addData">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹出框 -->
    <el-dialog :visible.sync="dialogAmend" width="30%">
      <el-form>
        <el-form-item label="uuid" :hidden="true" :label-width="formLabelWidth">
          <el-input v-model="uuid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="chlidName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="chlidMark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAmend = false">取 消</el-button>
        <el-button type="primary" @click="promo">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listByCriteria, insertPatrolPoint, deletePatrolPoint, updatePatrolPoint } from './apis/patrolpointapp'
export default {
  data () {
    return {
      pageData: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      dialogAdd: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogAmend: false,
      pointer: '',
      mark: '',
      chlidName: '',
      chlidMark: '',
      uuid: '',
      name: '',
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
      length: '',
      formLabelWidth: '120px',
      patrolTable: [],
      multipleSelection: [],
      checked: '',
      pName: '',
      selectList: []
    }
  },
  methods: {
    // 巡查点列表
    queryList () {
      let params = {
        'pageNo': this.pageData.pageNo,
        'pageSize': this.pageData.pageSize,
        'pointName': this.pName
      }
      listByCriteria({ params }).then(rs => {
        if (rs.data.code === '0') {
          this.patrolTable = rs.data.data.rows
          this.pageData.total = rs.data.data.total
        }
      })
    },
    // 巡查点查询
    queryDate () {
      if (this.pName === '') {
        this.$message({
          message: '请输入巡查点',
          type: 'warning'
        })
        this.queryList()
      } else {
        this.queryList()
        this.pName = ''
      }
    },
    // pageSize 改变时会触发Events
    handleSizeChange (val) {
      this.pageData.pageSize = val
      this.queryList()
    },
    // currentPage 改变时会触发Events
    handleCurrentChange (val) {
      this.pageData.pageNo = val
      this.queryList()
    },
    // 点击添加
    addData () {
      if (this.form.name === '') {
        this.$message({
          message: '名称为必填项',
          type: 'warning'
        })
      } else {
        let params = {
          // 请求必须发送的参数courtUuid、mapId
          'courtUuid': 1,
          'mapId': 2,
          'pointName': this.form.name,
          'remark': this.form.remark
        }
        this.patrolTable.push(params)
        this.dialogAdd = false
        this.form.name = ''
        this.form.remark = ''
        this.form.uuid = ''
        this.form.mapId = ''
        insertPatrolPoint(params).then(rs => {
          if (rs.status === 200) {
            this.queryList()
          }
        })
      }
    },
    // 当选择项发生变化时触发
    handleSelectionChange (val) {
      this.selectList = []
      let selList = val
      selList.forEach(item => {
        this.selectList.push(item.uuid)
      })
      this.multipleSelection = val
    },
    // 点击删除
    delData () {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.multipleSelection.length === 0) {
          this.$message({
            message: '请选中删除项！',
            type: 'warning'
          })
        } else {
          let params = {
            patrolPointId: this.selectList
          }
          deletePatrolPoint(params).then(rs => {
            if (rs.status === 200) {
              if (rs.data.code === '0') {
                this.$message({
                  message: rs.data.message,
                  type: 'success'
                })
                this.queryList()
              } else {
                this.$message({
                  message: rs.data.message,
                  type: 'warning'
                })
                this.queryList()
              }
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击巡查点
    amend (index, row) {
      this.dialogAmend = true
      this.uuid = row.uuid
      this.pointer = row.pointName
      this.chlidName = row.pointName
      this.mark = row.remark
      this.chlidMark = row.remark
    },
    // 点击修改
    promo () {
      if (this.chlidName === '') {
        this.$message({
          message: '名称不能为空',
          type: 'warning'
        })
      } else if (this.chlidName === this.pointer && this.chlidMark === this.mark) {
        this.$message({
          message: '取消修改',
          type: 'warning'
        })
      } else {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.amendAxios()
      }
      // 关闭修改弹窗
      this.dialogAmend = false
    },
    amendAxios () {
      let params = {
        'courtUuid': 1,
        'mapId': 2,
        'pointName': this.chlidName,
        'uuid': this.uuid,
        'remark': this.chlidMark
      }
      updatePatrolPoint(params).then(rs => {
        if (rs.status === 200) {
          this.queryList()
          for (var i = 0; i < this.patrolTable.length; i++) {
            if (this.patrolTable[i].uuid === this.uuid) {
              this.patrolTable[i].pointName = this.chlidName
              this.patrolTable[i].remark = this.chlidMark
            }
          }
        }
      })
    }
  },
  mounted () {
    this.queryList()
  }
}
</script>
<style scoped lang='less'>
.table-box {
  margin-top: 20px;
}
.page-box {
  margin: 20px 0;
}
.el-form {
  margin-right: 50px;
}
</style>
