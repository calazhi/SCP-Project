<template>
  <div class="main">
      <div>
        <el-form ref="listQuery" :model="listQuery" :inline="true">
          <el-form-item label="字典类型">
            <template>
                <el-select v-model="listQuery.typeCode" @change="handleSelect" placeholder="请选择">
                    <el-option v-for="item in dicTypes" :key="item.typeCode" :label="item.itemName" :value="item.typeCode"></el-option>
                </el-select>
            </template>                     
          </el-form-item>
          <el-button type="primary" @click="addData">新增</el-button>     
        </el-form>        
      </div>
      <!-- 字典列表 -->
      <div class="dicTable">
        <el-table :data="dicTable" border max-height="680" style="width: 100%">
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="itemCode" label="编码"></el-table-column>
          <el-table-column prop="itemName" label="名称"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleModify(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>         
      </div>
      <div class="text-right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
            :current-page="listQuery.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="listQuery.pageSize" :total="totalPage"
            background layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>       
      <!-- 新增对话框 -->
      <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" center width="600px" :before-close="closeDialog">
        <el-form :model="form" ref="form" :inline="true" :rules="addRules">
          <el-form-item label="名称" prop="itemName">
            <el-input v-model.trim="form.itemName" autofocus></el-input>
          </el-form-item>
          <el-button type="primary" @click="handleEdit">确 定</el-button>          
          <el-button @click="cancleEdit">取 消</el-button>
        </el-form>
      </el-dialog>
  </div>
</template>

<script>
import { listSysCodeType, getSysCode, addSysCode, updateSysCode } from '@/views/ParkingLotApp/apis'
export default {
  data () {
    let itemNameValid = (rule, value, callback) => {
      let regexp = /^[\u4E00-\u9FA5A-Za-z0-9]{0,64}$/
      if (!regexp.test(value)) {
        callback(new Error('名称只能输入汉字、字母或数字!'))
      } else {
        callback()
      }
    }
    return {
      dicTypes: [], // 字典列表
      listQuery: {  // 查询条件
        typeCode: '', // 字典类型
        currentPage: 1,  // 当前页
        pageSize: 10  // 分页大小
      },
      totalPage: 0, // 总页数
      dicTable: [],   // 字典数据
      dialogFormVisible: false,  // 新增对话框显示
      formTitle: '', // 表单标题
      editType: 0,  // 表单编辑类型：0新增1修改
      form: {
        typeCode: '',  // 类型
        itemCode: '',  // 编码
        itemName: ''  // 名称
      },
      addRules: {
        itemName: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { max: 32, message: '最大长度为32字符', trigger: 'blur' },
          { validator: itemNameValid, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    // 加载字典类型
    loadData () {
      let that = this
      listSysCodeType().then(function (response) {
        that.dicTypes = response.data
      })
    },
    handleSelect (val) {
      this.listQuery.typeCode = val
      this.querySysCode()
    },
    // 查询字典数据
    querySysCode () {
      let that = this
      getSysCode(that.listQuery).then(function (response) {
        that.dicTable = response.data.result
        that.totalPage = response.data.totalCount
      })
    },
    // 新增
    addData () {
      if (this.listQuery.typeCode === '') {
        this.$message({
          message: '请选择字典类型',
          type: 'warning'
        })
        return
      }
      this.editType = 0
      this.formTitle = '新增'
      this.form.typeCode = this.listQuery.typeCode
      this.form.itemCode = ''
      this.form.itemName = ''
      this.dialogFormVisible = true
    },
    // 修改
    handleModify (row) {
      this.editType = 1
      this.formTitle = '修改'
      this.form.typeCode = this.listQuery.typeCode
      this.form.itemCode = row.itemCode
      this.form.itemName = row.itemName
      this.dialogFormVisible = true
    },
    // 确定修改
    handleEdit () {
      let that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          that.dialogFormVisible = false
          if (that.editType === 0) {  // 新增
            addSysCode(that.form).then(function (response) {
              if (response.data > 0) {
                that.$message({
                  message: '添加成功',
                  type: 'success'
                })
              } else {
                that.$message({
                  message: '添加失败',
                  type: 'error'
                })
              }
              that.querySysCode()
            })
          } else if (that.editType === 1) { // 修改
            updateSysCode(that.form).then(function (response) {
              if (response.data > 0) {
                that.$message({
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: '修改失败',
                  type: 'error'
                })
              }
              that.querySysCode()
            })
          }
        }
      })
    },
    // 取消修改
    cancleEdit () {
      this.dialogFormVisible = false
      this.form.itemCode = ''
      this.form.itemName = ''
      this.$refs.form.resetFields()
    },
    handleSizeChange: function (val) {
      let that = this
      that.listQuery.pageSize = val
      that.querySysCode()
    },
    handleCurrentChange: function (val) {
      let that = this
      that.listQuery.currentPage = val
      that.querySysCode()
    },
    closeDialog (done) {
      done()
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  margin: 0px 40px 10px 40px;
  .dicTable {
    height: 700px;
    margin: 5px 0px;
  }
  .btn {
    text-align: right;
  }  
}
</style>
<style>
.dicTable .el-table__header{
  width: auto!important;
}
</style>


