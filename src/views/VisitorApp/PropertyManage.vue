<template>
  <div class="property-container el-container">
    <div class="property-view-content">
      <el-button type="primary" @click="onPropertyEdit">添加</el-button>
      <el-button type="primary" @click="onDownLoad">导出</el-button>
      <property-edit ref="propertyEdit" @reflushData="getPropertyTableData" :list="typeList" :deleteButton="deleteButton"></property-edit>
      <div class="property-con clearfix">
        <el-form :model="propertyForm" :rules="rules" ref="propertyForm" class="property-form" label-width="100px">
          <el-form-item prop="name" label="人员姓名" class="property-form-item">
            <el-input v-model.trim="propertyForm.name"></el-input>
          </el-form-item>
          <el-form-item prop="department" label="部门" class="property-form-item">
            <el-select v-model="propertyForm.department" placeholder="请选择部门" @change="getPosition(propertyForm.department)" size="100px">
              <el-option v-for="item in typeList.department" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="idenNum" label="证件号码" class="property-form-item">
            <el-input v-model.trim="propertyForm.idenNum"></el-input>
          </el-form-item>
          <el-form-item prop="position" label="岗位" class="property-form-item">
            <el-select v-model="propertyForm.position" placeholder="请选择岗位" size="100px">
              <el-option v-for="item in positionList" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="phone" label="电话号码" class="property-form-item">
            <el-input v-model.trim="propertyForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="人员" class="property-form-item">
            <el-radio-group v-model="propertyForm.deleteFlag">
              <el-radio :label="1">在职人员</el-radio>
              <el-radio :label="0">离职人员</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="property-btnbar">
          <el-button type="primary" @click="onSearchProperty">查询</el-button>
          <el-button type="primary" @click="onResetSearchKey">重置</el-button>
        </div>
      </div>

      <div class="property-table">
        <pager-table class="visit-pb" ref="pagerTable" :visitor-data="visitorData" :total="total" @turnPage="getPropertyTableData" @tableSelected="selectionProperty" hasSelect>
          <template slot="table-column">
            <el-table-column label="人员姓名" prop="name" width="130">
            </el-table-column>
            <el-table-column label="性别" prop="sex" :formatter="filtersSex" width="70">
            </el-table-column>
            <el-table-column label="公司" prop="company" width="200">
            </el-table-column>
            <el-table-column label="证件类型" prop="idenType" :formatter="filtersidenType" width="130">
            </el-table-column>
            <el-table-column label="证件号码" prop="idenNum">
            </el-table-column>
            <el-table-column label="居住地址" prop="address">
            </el-table-column>
            <el-table-column label="联系方式" prop="phone" width="150">
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="primary" @click="onPropertyEdit(scope.row)" size="mini">
                  <span>{{deleteButton?'编辑':'查看'}}</span>
                </el-button>
                <el-button type="danger" v-if="deleteButton" @click="onRemove(scope.row.uuid)" size="mini" style="padding:7px 12px;">
                  <span>删除</span>
                </el-button>
              </template>
            </el-table-column>
          </template>
        </pager-table>
      </div>
    </div>
  </div>
</template>
<script>

import PagerTable from './components/PagerTable'
import PropertyEdit from './components/PropertyEdit'
import { getProperty, deleteProperty, getTypeNodeMap, positionList, personTemplate, propertyResume } from '@/views/VisitorApp/apis/index.js'

export default {
  components: {
    PagerTable,
    PropertyEdit
  },
  data () {
    return {
      propertyForm: {
        name: '',
        position: '',
        idenNum: '',
        phone: '',
        department: '',
        deleteFlag: 1    // 逻辑删除标记： 0-已删除 1-未删除'
      },
      selections: {    // 表格选中行数据
        selectionsUuid: [],
        selectionsVisitorUuid: []
      },
      rules: {
        name: [
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        idenNum: [
          { message: '请输入证件号码', trigger: 'blur' },
          { min: 1, max: 18, message: '长度在 1 到 18 个字符', trigger: 'blur' }
        ],
        phone: [
          { message: '请输入手机号码', trigger: 'blur' },
          { min: 1, max: 11, message: '长度在 1 到 11 个字符', trigger: 'blur' }
        ]
      },
      typeList: '',
      positionList: '',
      searchKey: '',
      visitorData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      deleteButton: true
    }
  },
  mounted: function (personInfo) {
    /**
    * @description  查询刷新页面
    * @param  Object 页数和每页条数
    */
    this.getPropertyTableData({ 'currentPage': this.currentPage, 'pageSize': this.pageSize })
    // 查询时请求物业下拉数据
    getTypeNodeMap(Object.assign({}, personInfo)).then(res => {
      this.typeList = res.data
    }).catch(err => {
      console.warn({
        message: err,
        type: 'warning'
      })
    })
  },
  methods: {
    /**
    * @description  查询刷新页面
    * @param Object params 页数和每页条数
    */
    getPropertyTableData: function (params) {
      if (params) {
        this.pageSize = params.pageSize
        this.currentPage = params.currentPage
      }
      // 查询物业接口
      getProperty(Object.assign({}, this.propertyForm, params)).then(res => {
        if (res.data.code === '00000') {
          this.visitorData = res.data.data[0].rows
          this.currentPage = res.data.data[0].currentPage
          this.total = res.data.data[0].rowCount
        } else {
          this.visitorData = res.data.data[0].rows
        }
      }).catch(err => {
        console.warn({
          message: err,
          type: 'warning'
        })
      })
      if (this.propertyForm.deleteFlag === 0) {
        this.deleteButton = false
      } else {
        this.deleteButton = true
      }
    },
    /**
    * @description  请求物业部门岗位联动下拉数据
    * @param Number params 物业部门信息
    */
    getPosition: function (params) {
      if (this.propertyForm.department) {
        this.propertyForm.position = ''
      }
      positionList(params).then(res => {
        this.positionList = res.data
      }).catch(err => {
        console.warn({
          message: err,
          type: 'warning'
        })
      })
    },
    /**
    * @description  查询物业信息
    */
    onSearchProperty: function () {
      this.$refs['propertyForm'].validate((valid) => {
        if (valid) {
          this.getPropertyTableData({ 'currentPage': this.currentPage, 'pageSize': this.pageSize })
        }
      })
    },
    /**
    * @description  重置物业表单
    */
    onResetSearchKey: function () {
      for (let key in this.propertyForm) {
        this.propertyForm[key] = ''
      }
    },
    /**
     * @description 点击table组件复选框触发
     * @param Array val 所有选中行数据
     */
    selectionProperty: function (val) {
      this.selections.selectionsUuid = val.selectionsUuid
      this.selections.selectionsVisitorUuid = val.selectionsVisitorUuid
    },
    /**
    * @description  导出功能
    */
    onDownLoad: function () {
      this.$confirm('导出物业人员信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        personTemplate(2, '/scp-visitorapp/property/exportExcel?name=' + encodeURI(this.propertyForm.name) + '&phone=' + this.propertyForm.phone + '&position=' + encodeURI(this.propertyForm.position) + '&department=' + encodeURI(this.propertyForm.department) + '&idenNum=' + this.propertyForm.idenNum + '&deleteFlag=' + this.propertyForm.deleteFlag + '&selectedIds=' +
          this.selections.selectionsUuid).then(
          this.$message({
            type: 'success',
            message: '导出成功!'
          })
          )
        this.selections.selectionsUuid = []
        this.selections.selectionsVisitorUuid = []
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消导出'
        })
      })
    },
    /**
     * @description 物业录入/编辑物业数据
     * @param Object propertyInfo 表格中物业信息
     */
    onPropertyEdit: function (propertyInfo = {}) {
      const propertyInfoTmp = Object.assign({}, propertyInfo)
      this.$refs['propertyEdit'].propertyEdit(propertyInfoTmp)
    },
    /**
     * @description 物业人员删除或者复职
     * @param  String data 表格中物业信息
     */
    onRemove: function (data) {
      if (this.deleteButton) {
        this.$confirm('确定要删除该条信息吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProperty({ uuid: data }).then(res => {
            if (res.data.code === '00000') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getPropertyTableData({ 'currentPage': this.currentPage, 'pageSize': this.pageSize })
            }
          }).catch(err => {
            console.warn({
              message: err,
              type: 'warning'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        propertyResume({ uuid: data }).then(res => {
          if (res.data.code === '00000') {
            this.$message({
              type: 'success',
              message: '复职成功'
            })
            this.getPropertyTableData({ 'currentPage': this.currentPage, 'pageSize': this.pageSize })
          }
        }).catch(err => {
          console.warn({
            message: err,
            type: 'warning'
          })
        })
      }
    },
    /**
     * @description 人员性别格式化
     * @param  Object row 表格中每行信息
     * @param  Object column 表格中每行信息
     * @returns 数字对应的中文
     */
    filtersSex: function (row, column) {
      var fingerFace = row.sex
      return fingerFace === '1' ? '男' : '女'
    },
    /**
     * @description 证件类型格式化
     * @param  Object row 表格中每行信息
     * @param  Object column 表格中每行信息
     * @returns 数字对应的中文
     */
    filtersidenType: function (row, column) {
      var fingerFace = row.idenType
      switch (fingerFace) {
        case '111':
          return '身份证'
        case '335':
          return '驾驶证'
        case '133':
          return '学生证'
        case '114':
          return '军官证'
        case '414':
          return '护照'
        case '990':
          return '其他'
      }
    }
  }
}
</script>
<style scoped>
.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
  clear: both;
}
.clearfix {
  zoom: 1;
}
.property-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 850px;
  padding: 10px;
  border: 1px solid #dddee1;
}
.property-view-content {
  position: relative;
  float: left;
  width: 100%;
  height: 100%;
  margin-left: 20px;
}
.property-con {
  width: 100%;
  margin-top: 15px;
  padding: 15px;
  padding-bottom: 0px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
.property-form {
  width: 70%;
  float: left;
}
.property-form-item {
  width: 50%;
  float: left;
}
.property-btnbar {
  float: right;
}
.property-table {
  position: relative;
  width: 100%;
  height: 65%;
  margin-top: 10px;
}
</style>