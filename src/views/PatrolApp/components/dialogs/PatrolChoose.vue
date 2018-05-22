<template>
  <el-dialog :visible="innerDialog" :center="true" size="tiny" width="500px" @close="closeDialog" title="巡查点列表" append-to-body>
    <el-row :gutter="20" class="row-box">
      <el-col :span="16">
        <el-form>
          <el-form-item label="巡查点名称" prop="pointName">
            <el-input class="query-input" size="small" :maxlength="32" v-model.trim="pointName" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-button class="el-button el-button--primary" size="small" @click="queryList">查询</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table ref="multipleTable" :data="partChooseData" reserve-selection="clearSelection" border width="100%" height="400" @selection-change="handleSelectionChange">
      <el-table-column label="" type="selection" class="el-table-column-all" header-align="center"></el-table-column>
      <el-table-column type="index" label="序号" width="100px" header-align="center"></el-table-column>
      <el-table-column prop="pointName" label="名称" header-align="center"></el-table-column>
    </el-table>
    <div class="block pagination-box">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageData.pageNo" :page-size="10" layout="total, prev, pager, next" :total="pageData.total"></el-pagination>
    </div>
    <el-row :gutter="20" class="row-box">
      <el-col :span="6">
        <el-button type="primary" @click="patrolChooseSave">保 存</el-button>
      </el-col>
      <el-col :span="6">
        <el-button @click="cancle">取 消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getByCriteriaData } from '../../apis/paramAPI'
export default {
  props: {
    show: {
      required: true,
      type: Boolean,
      default () {
        return false
      }
    },
    innerDialog: false
  },
  data () {
    return {
      partChooseData: [],
      pointList: [],
      tabLabel: '园区',
      pageData: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      pointName: ''
    }
  },
  watch: {
    innerDialog (val) {
      if (val) {
        this.pointName = ''
        this.pageData.pageNo = 1
        this.getPatrolChoose()
      }
    }
  },
  methods: {
    // 查询
    queryList () {
      this.getPatrolChoose()
    },
    toggleSelection () {
      this.$refs.multipleTable.clearSelection()
    },
    // 关闭dailog
    closeDialog () {
      this.$emit('closeDialog')
      this.toggleSelection()
    },
    // 保存
    patrolChooseSave () {
      if (this.pointList.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择巡查点！'
        })
        return false
      }
      this.$emit('closeDialog')
      this.$emit('patrolChooseSave', this.pointList)
      this.toggleSelection()
    },
    // 取消
    cancle () {
      this.$emit('closeDialog')
    },
    // 获取巡查点list
    getPatrolChoose () {
      let param = {
        pageNo: this.pageData.pageNo,
        pageSize: this.pageData.pageSize,
        pointName: this.pointName
      }
      getByCriteriaData(param).then((rs) => {
        if (rs.data.code === '00000') {
          this.partChooseData = rs.data.data.rows
          this.pageData.total = rs.data.data.total
        } else {
          this.partChooseData = []
        }
      })
    },
    // 表格选中
    handleSelectionChange (val) {
      this.pointList = []
      val.forEach(item => {
        item.interval = 10
      })
      this.pointList = val
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageData.pageSize = val
      if (this.pointList.length >= 1) {
        this.$confirm('是否保存选中内容?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.$emit('patrolChooseSave', this.pointList)
          this.toggleSelection()
          this.getPatrolChoose()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '未保存！'
          })
          this.getPatrolChoose()
        })
      } else {
        this.getPatrolChoose()
      }
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageData.pageNo = val
      if (this.pointList.length >= 1) {
        this.$confirm('是否保存选中内容?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.$emit('patrolChooseSave', this.pointList)
          this.toggleSelection()
          this.getPatrolChoose()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '未保存！'
          })
          this.getPatrolChoose()
        })
      } else {
        this.getPatrolChoose()
      }
    }
  }
}
</script>
<style scoped lang="less">
.el-dialog {
  .query-input {
    width: 150px;
  }
  .el-table {
    text-align: center;
    tr,
    td,
    th {
      text-align: center;
    }
  }
  .row-box {
    margin: 10px 0;
  }
  .pagination-box {
    text-align: center;
    padding: 20px 0;
  }
}
</style>


