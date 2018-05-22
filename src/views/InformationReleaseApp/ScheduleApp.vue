<template>
  <div class="schedule-app">
    <div class="time-button">
      <el-button @click="onCustomtime" type="primary">添加日程</el-button>
      <el-button @click="onBatchDelete" type="danger">批量删除日程</el-button>
    </div>
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters" ref="filters">
        <el-form-item label="日程名称" prop="scheduleName">
          <el-input class="input-width" v-model.trim="filters.scheduleName" placeholder="字符长度不能超过32个" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="播放类型" prop="scheduleType">
          <el-select style="width:175px" v-model="filters.scheduleType" placeholder="请选择播放类型">
            <el-option v-for="(item,index) in schedulePlayOptions" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人" prop="createUser">
          <el-input class="input-width" v-model.trim="filters.createUser" placeholder="字符长度不能超过32个" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="publishState">
          <el-select style="width:175px" v-model="filters.publishState" placeholder="请选择发布状态" clearable>
            <el-option v-for="(item,index) in scheduleStateOptions" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="信息发布控制器" prop="equipmentFilter">
          <el-select clearable v-model="filters.equipmentFilter" placeholder="请选择">
            <el-option v-for="item in options" :key="item.deviceID" :label="item.deviceName" :value="item.deviceID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker v-model="filters.createTime" value-format="yyyy-MM-dd HH:mm:ss" :editable="false" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="timeMaterial">查询</el-button>
          <el-button type="primary" @click="onResetForm('filters')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <div class="content">
      <el-table :data="data" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="scheduleName" label="日程名称"></el-table-column>
        <el-table-column prop="weekySchedule || dailySchedule" label="播放时间" min-width="140">
          <template slot-scope="props">
            <span v-if="props.row.dailySchedule">
              {{props.row.dailySchedule}}
            </span>
            <span v-else-if="props.row.weekySchedule" v-for="(item,index) in props.row.weekySchedule" :key="index">
              {{item}}<br/>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="typeDescription" label="播放类型">
        </el-table-column>
        <el-table-column prop="deviceName" label="信息发布控制器">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column prop="createUser" label="创建人">
        </el-table-column>
        <el-table-column prop="publishState" label="状态">
        </el-table-column>
        <el-table-column label="操作" min-width="60">
          <template slot-scope="scope">
            <el-button @click="onHandleModify(scope.$index,scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="onIssueDialog(scope.$index,scope.row)">发布</el-button>
            <el-button type="text" @click="onDeleteSche(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class=' page-bar ' v-show="data&&data.length" style="margin-top:15px">
        <el-pagination style="text-align:center" small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageData.pageNo" :page-sizes="[10,15,30,50]" :page-size="pageData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageData.total">
        </el-pagination>
      </div>
    </div>
    <customtime :show="showaddDialog" @showstate='showstate ' @closeDialog="closeDialog" ref="customtime" :isSchedule="isSchedule" :senScheduleMessage="fatherScheduleId"></customtime>
    <issueDialog :show="showissueDialog" :param="param" @closeissueDialog="closeissueDialog" @showstate='showstate'></issueDialog>
  </div>
</template>
<script>
import { postSchedulePageData, getDeleteScheduleData, postBatchDeleteScheduleData, getChooseEquipmentData, getScheduleStateData, getSchedulePlayTypeData } from './apis/index'
import customtime from './dialogs/CustomTime'
import issueDialog from './dialogs/Issue'
export default {
  name: 'materialFather',
  components: { customtime, issueDialog },
  data () {
    return {
      schedulePlayOptions: [],
      scheduleStateOptions: [],
      options: [],
      isSchedule: false,
      fatherScheduleId: '',
      deletes: [],
      param: {
        scheduleId: '',
        scheduleName: '',
        deviceId: '',
        releaseType: 'byTerminal'
      },
      modifyParam: {
        id: ''
      },
      filters: {
        scheduleName: '',
        createUser: '',
        scheduleType: '',
        publishState: '',
        equipmentFilter: '',
        createTime: ''
      },
      data: [],
      showaddDialog: false,
      showissueDialog: false,
      showmodifyDialog: false,
      pageData: {
        pageSize: 10,
        pageNo: 1,
        total: 0
      }
    }
  },
  mounted () {
    this.getScheduleState()
    this.onChooseEquipment()
    this.timeMaterial()
    this.getSchedulePlayType()
  },
  methods: {
    // 点击发布按钮
    onIssueDialog (index, rowData) {
      this.showissueDialog = true
      this.param.scheduleId = rowData.id
      this.param.deviceId = rowData.deviceId
      this.param.releaseType = 'byTerminal'
      this.param.scheduleName = rowData.scheduleName
    },
    // 关闭发布对话框
    closeissueDialog () {
      this.showissueDialog = false
      this.fatherScheduleId = ''
    },
    // 关闭编辑对话框
    closemodifyDialog () {
      this.showmodifyDialog = false
    },
    // 节目获取主设备
    onChooseEquipment () {
      getChooseEquipmentData({ isOnline: false }).then(res => {
        if (res.data.code === '00000') {
          this.options = res.data.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取日程状态
    getScheduleState () {
      getScheduleStateData({}).then(res => {
        if (res.data.code === '00000') {
          this.scheduleStateOptions = res.data.data
        }
      }).catch(() => {
      })
    },
    // 获取日程播放类型
    getSchedulePlayType () {
      getSchedulePlayTypeData({}).then(res => {
        if (res.data.code === '00000') {
          this.schedulePlayOptions = res.data.data
        }
      }).catch(() => {
      })
    },
    // 删除日程
    onDeleteSche (index, rowData) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getDeleteScheduleData({ id: rowData.id }).then(rs => {
          if (rs.data.code === '00000') {
            this.timeMaterial()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: rs.data.message ? rs.data.message : '删除失败!'
            })
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    // 获取日程列表
    timeMaterial () {
      if (this.filters.createTime === null) {
        this.filters.createTime = ''
      }
      let param = {
        pageSize: this.pageData.pageSize,
        pageNo: this.pageData.pageNo,
        scheduleName: this.filters.scheduleName,
        createUser: this.filters.createUser,
        startTime: this.filters.createTime[0],
        endTime: this.filters.createTime[1],
        scheduleType: this.filters.scheduleType,
        publishState: this.filters.publishState,
        singleDeviceId: this.filters.equipmentFilter
      }
      postSchedulePageData(param).then(res => {
        if (res.data.code === '00000') {
          if (res.data.data.data && res.data.data.data.length) {
            res.data.data.data.forEach(el => {
              if (el.weekySchedule) {
                el.weekySchedule = el.weekySchedule.split(',')
              }
            })
            this.data = res.data.data.data
            this.pageData.total = res.data.data.total
          } else {
            this.data = []
            this.pageData.total = 0
          }
        } else {
          this.data = []
          this.pageData.total = 0
          this.$message({
            showClose: true,
            message: '数据加载失败',
            type: 'error'
          })
        }
      }).catch(() => {
      })
    },
    // 重置按钮
    onResetForm (formNameadd) {
      this.$refs['filters'].resetFields()
      this.timeMaterial()
    },
    // 点击添加日程出现对话框
    onCustomtime () {
      this.showaddDialog = true
      this.isSchedule = true
    },
    // 关闭添加日程对话框
    closeDialog () {
      this.showaddDialog = false
    },
    // 编辑按钮
    onHandleModify (index, row) {
      this.isSchedule = false
      this.fatherScheduleId = row.id
      this.showaddDialog = true
      this.modifyParam.id = row.id
    },
    // 点击分页按钮 pageSize改变时出发
    handleSizeChange (val) {
      this.pageData.pageSize = val
      this.timeMaterial()
    },
    // currentPage 改变时会触发
    handleCurrentChange (val) {
      this.pageData.pageNo = val
      this.timeMaterial()
    },
    // 父子传值 重新调取分页列表
    showstate (mstate) {
      this.timeMaterial()
    },
    // 选中列表里的所有文件
    handleSelectionChange (val) {
      this.deletes = []
      val.forEach((element, index) => {
        this.deletes.push(element.id)
      })
    },
    // 批量删除日程
    onBatchDelete () {
      if (this.deletes.length === 0) {
        this.$message({
          type: 'error',
          message: '您还没有选中需要删除的日程内容!'
        })
      } else {
        this.$confirm('批量选中的数据将作永久删除，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          postBatchDeleteScheduleData({ ids: this.deletes }).then(rs => {
            if (rs.data.code === '00000') {
              this.timeMaterial()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: rs.data.message ? rs.data.message : '删除失败!'
              })
            }
          }).catch(() => {
          })
        }).catch(() => {
        })
      }
    }
  }
}
</script>
<style scoped>
.time-button {
  margin-bottom: 20px;
}
.content {
  width: 100%;
  height: auto;
}
.input-width {
  width: 175px;
}
.page-bar {
  margin-top: 15px;
}
.toolbar {
  padding-bottom: 0px;
}
</style>
<style lang="less">
.schedule-app {
  input:-ms-input-placeholder.el-input__inner,
  .el-date-editor :-ms-input-placeholder.el-range-input {
    color: #c0c4cc;
  }
  .el-table__body-wrapper {
    overflow-x: hidden;
  }
}
</style>
