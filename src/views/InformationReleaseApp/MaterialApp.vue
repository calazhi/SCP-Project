<template>
  <div class="material-app">
    <div class="handle-control">
      <el-row>
        <el-button @click="onShowUpload" type="primary" icon="el-icon-upload">上传素材</el-button>
        <el-button @click="onBatchDelete" type="danger">批量删除素材</el-button>
      </el-row>
    </div>
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters" ref="filters">
        <el-form-item label="素材名称" prop="name">
          <el-input v-model.trim="filters.name" placeholder="字符长度不能超过32个" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="素材类型" prop="materialType">
          <el-select clearable v-model="filters.materialType" placeholder="素材类型">
            <el-option v-for="(item,index) in materialOptions" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人" prop="creater">
          <el-input v-model.trim="filters.creater" placeholder="字符长度不能超过32个" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker v-model="filters.createTime" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="queryData">查询</el-button>
          <el-button type="primary" @click="onResetForm('filters')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="data" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" label="序号" width="100">
      </el-table-column>
      <el-table-column prop="mediaName" label="素材名称" width="200">
      </el-table-column>
      <el-table-column prop="mediaTypeDescription" label="素材类型">
      </el-table-column>
      <el-table-column prop="size" label="大小">
      </el-table-column>
      <el-table-column prop="duration" label="时长(单位/秒)">
      </el-table-column>
      <el-table-column prop="mediaUrl" label="素材地址">
        <template slot-scope="scope">
          <!-- :download="scope.row.mediaUrl" -->
          <a :href="scope.row.mediaUrl" target="_blank">点击查看</a>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="创建人">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="onDelMaterial(scope.$index,scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-bar" v-show="data&&data.length">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageData.pageNo" :page-sizes="[10,15,30,50]" :page-size="pageData.pageSize" layout=" total, sizes,prev, pager, next, jumper" :total="pageData.total">
      </el-pagination>
    </div>
    <materialUpload :show="showUploadDialog" @closeDialog="closeDialog" @showmaterialapp="showmaterialapp" :uploadServerData="uploadServerData"></materialUpload>
  </div>
</template>
<script>
import { getMaterialDeleteData, postMaterialsData, postMaterialBatchDeleteData, getUploadServerData, getMaterialsTypeData } from './apis/index'
import materialUpload from './dialogs/MaterialUpload'
export default {
  name: 'material',
  components: { materialUpload },
  data () {
    return {
      materialOptions: [],
      uploadServerData: {
        uploadServerurl: '',
        uploadServermodule: ''
      },
      deletes: [],
      filters: {
        name: '',
        materialType: '',
        creater: '',
        createTime: ''
      },
      data: [],
      pageData: {
        pageSize: 10,
        pageNo: 1,
        total: 0
      },
      showUploadDialog: false
    }
  },
  mounted () {
    this.queryData()
    this.getMaterialsType()
  },
  methods: {
    queryData () {
      // 查询素材列表
      if (this.filters.createTime === null) {
        this.filters.createTime = ''
      }
      let param = {
        mediaName: this.filters.name,
        pageNo: this.pageData.pageNo,
        pageSize: this.pageData.pageSize,
        startTime: this.filters.createTime[0],
        endTime: this.filters.createTime[1],
        type: this.filters.materialType,
        creater: this.filters.creater
      }
      postMaterialsData(param).then(res => {
        if (res.data.code === '00000') {
          if (res.data.data.data && res.data.data.data.length) {
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
    // 获取素材类型
    getMaterialsType () {
      getMaterialsTypeData({}).then(res => {
        if (res.data.code === '00000') {
          this.materialOptions = res.data.data
        }
      }).catch(() => {
      })
    },
    // 获取素材上传服务器信息
    getUploadConfig () {
      getUploadServerData({}).then(res => {
        if (res.data.code === '00000') {
          this.uploadServerData.uploadServerurl = res.data.data.url
          this.uploadServerData.uploadServermodule = res.data.data.module
          this.showUploadDialog = true
        }
      }).catch(() => {
      })
    },
    // 重置按钮
    onResetForm (formNameadd) {
      this.$refs['filters'].resetFields()
      this.queryData()
    },
    // 打开上传素材页面
    onShowUpload () {
      this.getUploadConfig()
    },
    // 关闭上传素材页面
    closeDialog () {
      this.showUploadDialog = false
    },
    // 关闭上传素材页面并刷新素材管理页列表
    showmaterialapp () {
      this.queryData()
      this.showUploadDialog = false
    },
    // 删除单个素材
    onDelMaterial (index, rowData) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getMaterialDeleteData({ mediaId: rowData.materialId }).then(rs => {
          if (rs.data.code === '00000') {
            this.queryData()
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
    // pageSize 改变时会触发
    handleSizeChange (val) {
      this.pageData.pageSize = val
      this.queryData()
    },
    // currentPage 改变时会触发
    handleCurrentChange (val) {
      this.pageData.pageNo = val
      this.queryData()
    },
    // 选中列表里的所有文件
    handleSelectionChange (val) {
      this.deletes = []
      val.forEach((element, index) => {
        this.deletes.push(element.materialId)
      })
    },
    // 批量删除素材
    onBatchDelete () {
      if (this.deletes.length === 0) {
        this.$message({
          type: 'error',
          message: '您还没有选中需要删除的素材内容!'
        })
      } else {
        this.$confirm('批量选中的数据将作永久删除，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          postMaterialBatchDeleteData({ ids: this.deletes }).then(rs => {
            if (rs.data.code === '00000') {
              this.queryData()
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
.toolbar {
  padding-bottom: 0px;
}
.page-bar {
  margin-top: 10px;
  text-align: center;
}
.handle-control {
  margin-bottom: 15px;
}
</style>
<style lang="less">
.material-app {
  input:-ms-input-placeholder.el-input__inner {
    color: #c0c4cc;
  }
  .el-date-editor :-ms-input-placeholder.el-range-input {
    color: #c0c4cc;
  }
  .el-table__body-wrapper {
    overflow: hidden;
  }
}
</style>

