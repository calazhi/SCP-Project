<template>
  <el-dialog :visible="show" @close="closeEvent" title="选择人员" width="80%">
    <el-row class="person-row">
      <el-col class="get-person">
        <el-form :inline="true" ref="searchForm" :model="searchForm" onsubmit="return false">
          <el-form-item label="姓名" label-width="80">
            <el-input v-model.trim="searchForm.searchName" @keyup.native.enter="onSearchPerson" :maxlength="20" placeholder="输入姓名不能超过20个字符"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.personType" placeholder="请选择活动区域" @change="doChangeType">
              <el-option label="业主" :value="1">业主</el-option>
              <el-option label="物主" :value="5">物业</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearchPerson">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="resetPerson('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="add-person">
        <h3>已选择的人员列表</h3>
      </el-col>
    </el-row>
    <el-row class="person-row">
      <el-col class="personLeft">
        <el-table height="450" :data="data" border class="add-table" tooltip-effect="light">
          <el-table-column type="index" label="序号" :resizable="false" width="80" align="center"></el-table-column>
          <el-table-column prop="holderName" width="100" :resizable="false" label="姓名" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column v-if="searchForm.personType===1" prop="orgVo.houseName" label="楼幢信息" :resizable="false" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column v-if="searchForm.personType===5" prop="position" label="物主职位" :resizable="false" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="act" width="80" label="操作" :resizable="false" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="onSelectClick(scope.row)">
                添加
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="person-pagination" v-show="data.length">
          <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageData.currentPage" :page-size="pageData.pageSize" :page-sizes="[10, 15, 30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="pageData.totalCount">
          </el-pagination>
        </div>
      </el-col>
      <el-col>
        <el-table :data="selectData" height="450" border class="add-table">
          <el-table-column type="index" label="序号" :resizable="false" width="80" align="center"></el-table-column>
          <el-table-column prop="holderName" width="100" :resizable="false" label="姓名" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="position" :resizable="false" label="楼幢信息 / 物主职位" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="act" width="80" :resizable="false" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click.native.prevent="onDeleteRow(scope.$index, selectData)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div slot="footer" class="person-pagination">
      <el-button @click="clearAll">清 空</el-button>
      <el-button type="primary" @click="savePerson (true)">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getPersonTableData } from '../apis/index'
const ERROK = '00000'
export default {
  props: {
    show: {
      required: true,
      type: Boolean,
      default: false
    },
    selectPerson: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      data: [],
      isState: 0,
      pageData: {
        pageSize: 10,
        currentPage: 1,
        totalCount: 0
      },
      selectData: [],
      searchForm: {
        searchName: '',
        personType: 1
      }
    }
  },
  methods: {
    // 获取人员数据
    getPersonList () {
      getPersonTableData({
        personName: this.searchForm.searchName ? this.searchForm.searchName : '',
        personType: this.searchForm.personType,
        currentPage: this.pageData.currentPage,
        pageSize: this.pageData.pageSize
      }).then((res) => {
        if (res.data.code === ERROK) {
          if (res.data.data.resultList && res.data.data.resultList.length) {
            this.pageData.totalCount = res.data.data.totalCount
            this.data = res.data.data.resultList
          } else {
            this.pageData.totalCount = 0
            this.data = []
          }
        } else {
          this.data = []
          this.$message({
            message: res.data.message ? res.data.message : '请求数据失败',
            type: 'error'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 通过每页的条数向后端获取数据
    handleSizeChange (val) {
      this.pageData.pageSize = val
      this.getPersonList()
    },
    // 显示当前页数
    handleCurrentChange (val) {
      this.pageData.currentPage = val
      this.getPersonList()
    },
    // 添加
    onSelectClick (row) {
      // 一次最多只能添加100个人员
      if (this.selectData.length > 99) {
        this.$message({
          message: '一次最多只能添加100条,多余的请分次添加！',
          type: 'warning'
        })
      } else {
        for (let i = 0; i < this.selectData.length; i++) {
          if (this.selectData[i].uuid === row.uuid) {
            this.selectData.splice(i, 1)
          }
        }
        if (row.personType !== '5') {
          row.position = row.orgVo.houseName
        }
        // （添加功能）
        this.selectData.push(row)
      }
    },
    // 移除
    onDeleteRow (index, rows) {
      rows.splice(index, 1)
    },
    // 保持人员数据
    savePerson () {
      let persons = []
      let holderNames = []
      let selectPerson = this.selectData
      if (this.selectData && this.selectData.length > 0) {
        for (let i = 0; i < this.selectData.length; i++) {
          persons.push({
            personId: this.selectData[i].uuid,
            personType: this.selectData[i].personType
          })
          holderNames.push(this.selectData[i].holderName)
        }
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.isState = 0
        this.$emit('onSavePerson', { persons, holderNames, selectPerson })
        this.selectData = []
      } else {
        this.$message({
          message: '您还没选择人员',
          type: 'warning'
        })
      }
    },
    // 选择人员职位
    doChangeType () {
      this.data = []
      this.pageData.currentPage = 1
      this.getPersonList()
    },
    // 搜索
    onSearchPerson () {
      if (this.searchForm.searchName.trim().length > 20) {    // 限制长度不能超过20
        this.$message({
          message: '输入姓名不能超多20个字符',
          type: 'warning'
        })
      } else {
        if (this.searchForm.searchName.trim() && !/^[\u4e00-\u9fa50-9A-Za-z]+$/.test(this.searchForm.searchName.trim())) {   // 姓名无符号中文验证  ？？？ 英文名？？？
          this.$message({
            message: '输入姓名只能为中文、英文和数字',
            type: 'warning'
          })
        } else {
          this.pageData.currentPage = 1
          this.getPersonList()
        }
      }
    },
    // 重置
    resetPerson (formName) {
      this.$refs[formName].resetFields()
      this.data = []
      this.searchForm.searchName = ''
      this.searchForm.personType = 1
      this.pageData.currentPage = 1
      this.pageData.pageSize = 10
      this.getPersonList()
    },
    // 关闭弹框
    closeEvent () {
      this.data = []
      this.searchForm.searchName = ''
      this.searchForm.personType = 1
      this.pageData.currentPage = 1
      this.selectData = []
      let isStated = this.isState
      this.$emit('closePerson', { isStated })
    },
    // 清空
    clearAll () {
      this.selectData = []
      this.isState = 1
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.getPersonList()
        this.isState = 0
        this.selectData = this.selectPerson.length ? this.selectPerson : []
      }
    }
  }
}
</script> 
<style lang='less' scoped>
.person-row {
  display: flex;
  width: 100%;
  .get-person {
    flex: 1;
    padding-left: 2%;
  }
  .add-person {
    flex: 1;
    padding-left: 2%;
  }
}
.add-table {
  width: 96%;
}
.person-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>