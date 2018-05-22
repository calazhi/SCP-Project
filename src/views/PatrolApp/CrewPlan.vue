<template>
  <div class="CrewPlan">
    <div class="CrewPlan-one">
      <el-form label-width="80px " :model="check" onsubmit="return false" class="form-one" :rules="rules">
        <el-form-item label="计划名称" label-width="100px" class="plan-name" prop="searchName">
          <el-input v-model.trim="check.searchName" auto-complete="off" @keyup.native.enter="addCrewPlan" placeholder="" :maxlength="32"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="button-one" @click="addCrewPlan">查询</el-button>
      <el-button type="primary" class="button-two" @click="resetPerson">重置</el-button>
      <el-button type="primary" class="button-three" @click="AddPlan">添加</el-button>
      <el-button type="danger" class="button-four" @click="removeRows">删除</el-button>
    </div>
    <div class="CrewPlan-two">
      <el-table ref="multipleTable" :data="data" tooltip-effect="dark" class="table" @selection-change="handleSelectionChange" :border="true">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" prop="date" label="序号" width="120" align="center">
        </el-table-column>
        <el-table-column prop="planName" label="计划名称" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span @click="opendialog(scope.$index,scope.row)" style="color:#409EFF; cursor:pointer">{{scope.row.planName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="patrolParam.paramName" label="路线" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" show-overflow-tooltip align="center">
        </el-table-column>
      </el-table>
      <div class='pages-crew' v-show="data.length">
        <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageData.pageNo" :page-sizes="[10, 20, 30]" :page-size="pageData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageData.total">
        </el-pagination>
      </div>
      <AddPlan :show="showaddDialog" :selectMessege="uuid" :dialogtext="dialogtext" @closePlan='closePlan'></AddPlan>
      <AddPlanRows :show="addRows" :selectMessege="uuid" :dialogtext="dialogtext" @closePlan1='closePlan1'></AddPlanRows>
    </div>
  </div>
</template>

<script>
import { getPatrolData, postDeletPlanData } from './apis/planChannel'
import AddPlan from './components/dialogs/AddPlan'
import AddPlanRows from './components/dialogs/AddPlanRows'
export default {
  name: 'CrewPlan',
  components: { AddPlan, AddPlanRows },
  data () {
    // 计划名称正则
    let plannameCheck = (rule, value, callback) => {
      if (value.trim() && !/^[\u4e00-\u9fa50-9A-Za-z]+$/.test(value.trim())) {
        callback(new Error('输入只能为中文、英文和数字,名称中间不能有空格'))
      } else {
        callback()
      }
    }
    return {
      data: [],
      showaddDialog: false,
      addRows: false,
      pageData: {
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      dialogtext: {
      },
      check: {
        searchName: ''
      },
      planIds: [],
      uuid: '',
      multipleSelection: [],
      rules: {
        searchName: [
          { required: true, validator: plannameCheck }
        ]
      }
    }
  },
  mounted () {
    this.addCrewPlan()
  },
  methods: {
    // 页面获取排班信息
    addCrewPlan () {
      if (this.check.searchName.trim() && !/^[\u4e00-\u9fa50-9A-Za-z]+$/.test(this.check.searchName.trim())) {
        this.$message({
          message: '输入姓名只能为中文、英文和数字',
          type: 'warning'
        })
        this.check.searchName = ''
        return false
      }
      let params = { 'pageNo': this.pageData.pageNo, 'pageSize': this.pageData.pageSize, 'planName': this.check.searchName }
      getPatrolData(params).then(rs => {
        if (rs.data.code === '00000') {
          this.data = rs.data.data.rows
          this.pageData.total = rs.data.data.total
        } else {
          this.data = []
        }
      })
    },
    AddPlan () {
      this.dialogtext = ''
      this.addRows = true
    },
    // 重置
    resetPerson () {
      this.pageData.pageNo = 1
      this.check.searchName = ''
    },
    // 删除
    removeRows () {
      this.planIds = []
      if (this.multipleSelection && this.multipleSelection.length) {
        this.$confirm('确定删除数据吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.multipleSelection.forEach((e) => {
            this.planIds.push(e.uuid)
          })
          postDeletPlanData(this.planIds).then((res) => {
            if (res.data.code === '00000') {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.addCrewPlan()
            } else {
              this.$message.error('删除失败')
            }
          })
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.$message({
          message: '您还没选择删除序号',
          type: 'warning'
        })
      }
    },
    // 计划名称
    opendialog (index, row) {
      this.uuid = row.uuid
      this.showaddDialog = true
    },
    // 关闭弹窗
    closePlan () {
      this.uuid = ''
      this.showaddDialog = false
      this.addCrewPlan()
    },
    closePlan1 () {
      this.uuid = ''
      this.addRows = false
      this.pageData.pageNo = 1
      this.searchName = ''
      this.addCrewPlan()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 通过每页的条数向后端获取数据
    handleSizeChange (val) {
      this.pageData.pageSize = val
      this.addCrewPlan()
    },
    // 显示当前页数
    handleCurrentChange (val) {
      this.pageData.pageNo = val
      this.addCrewPlan()
    },
    showstate (mstate) {
    },
    updated () {
    }
  }
}
</script>
<style scoped lang='less'>
.CrewPlan {
  margin-top: 20px;
  .CrewPlan-one {
    input.el-input__inner {
      width: 100px;
    }
  }
  .CrewPlan-two {
    margin-top: 20px;
  }
  .form-one {
    display: inline-block;
  }
  .button-two {
    margin-left: 3%;
    margin-right: 35%;
  }
  .pages-crew {
    text-align: center;
    padding-top: 1%;
  }
  .button-three {
    margin-right: 3%;
  }
}
</style>
<style lang='less'>
.CrewPlan-two {
  .el-table__body-wrapper {
    overflow-x: hidden;
  }
}
@import url("./assets/css/common.less");
</style>