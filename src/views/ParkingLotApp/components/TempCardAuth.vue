<template>
  <section class="short-park">   
    <el-button type="primary" @click="TempAuth">授权</el-button>
    <div style="display:inline-lock; " class="form-cont">
      <el-form :inline="true">
        <el-form-item label="物理卡号">
          <el-input placeholder="请输入物理卡号" v-model="authCardNo" style="width:360px"></el-input>
          <el-input type="text" style="display:none" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryCardByNo">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="fix-table-bar">
      <el-table border :fit="true" :data="cardAuthData" ref="cardAuthData" max-height="680" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="cardNo" label="物理卡号"></el-table-column>
        <el-table-column prop="cardType" label="卡类型"></el-table-column>
        <el-table-column prop="parkName" label="停车场名称" width="600" :formatter = "formatPark"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button  size="mini" type="primary" @click="handleEdit(scope.$index,scope.row)">修改授权</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
		<el-col class="toolbar">
			<el-pagination @size-change="handleSizeAuthChange" @current-change="findAuthPage" :current-page="currentAuthPage" 
        :page-sizes="[10, 20, 50, 100]" :page-size="pageAuthSize" background layout="total, sizes, prev, pager, next, jumper" :total="totalAuth">
			</el-pagination>
		</el-col>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" style="width:120%;left:-10%; top:-10%;">
      <div class="park-tree">
        <p>选择车场</p>
        <el-tree :data="parkTreeData" show-checkbox node-key="parkingCode" ref="tree" highlight-current check-strictly
        :props="defaultProps" @check-change="handleNodeClick">
        </el-tree>
      </div>
      <div class="card-cont" style="min-height:450px">
        <el-form :inline="true">
          <el-form-item>
            <el-input placeholder="请输入物理卡号" v-model="queryCardNo" style="width:400px"></el-input>
            <el-input type="text" style="display:none" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryByNo">查询</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-table :data="cardTableData" v-loading="listLoading" @selection-change = "selectCardCharge" min-height="400" max-height="400">
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="cardNo" label="物理卡号"  width="300"></el-table-column>
            <el-table-column prop="cardType" label="卡类型"></el-table-column>
          </el-table>
        </div>
        <el-col class="toolbar">
          <el-pagination @size-change="handleSizeChange" @current-change="findPage" 
          :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background 
          layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>       
      </div>
      <section class="auth-btn">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAccredit">确定授权</el-button>
      </section>
    </el-dialog>
    <el-dialog title="临停卡授权修改" :visible.sync="dialogVisibleEdit">
      <p class="edit-dialog">物理卡号： <span v-text="editCard"></span></p>
      <p style="margin-left:50px;">选择车场</p>
      <div class="edit-park-tree">
        <el-tree :data="parkTreeData" show-checkbox node-key="parkingCode" ref="editTree" highlight-current check-strictly
          default-expand-all :default-checked-keys="authParkCode" :props="defaultProps" @check-change="editNodeClick">
        </el-tree>
      </div>
      <section class="auth-btn">
        <el-button @click="dialogVisibleEdit = false">取消</el-button>
        <el-button type="primary" @click="editAuthSave">保存</el-button>
      </section>
    </el-dialog>
  </section>
</template>
<script>
import { getCard, queryParkList, updateCardAuth, getAuthTempCard, updateAuthTempCard } from '@/views/ParkingLotApp/apis'
export default {
  data () {
    return {
      cardAuthData: [],
      cardTableData: [],
      parkTreeData: [],
      selectCard: [],
      authParkCode: [],
      queryCarNum: '',
      listLoading: true,
      loadingTree: true,
      dialogVisible: false,
      dialogVisibleEdit: false,
      currentPage: 1,
      currentAuthPage: 1,
      pageSize: 10,
      pageAuthSize: 10,
      total: 0,
      currentPageAuth: 1,
      pageSizeAuth: 10,
      authCardNo: '',
      totalAuth: 0,
      queryCardNo: '',
      dialogTitle: '临停卡授权',
      editCard: '',
      selectParkCode: [],
      editAuthCodes: '',
      defaultProps: {
        children: 'subParkingLots',
        label: 'parkingName'
      }
    }
  },
  mounted () {
    this.getTempCard()
    // this.loadData(this.currentPage, this.pageSize, this.queryCardNo)
    this.queryParkTree()
  },
  methods: {
    getTempCard () {
      let _this = this
      getAuthTempCard(_this.currentPageAuth, _this.pageSizeAuth, _this.authCardNo.trim())
      .then(function (response) {
        _this.cardAuthData = response.data.rows
        _this.totalAuth = response.data.total
        // console.log(response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    loadData (currentPage, pageSize, queryCardNo) {
      let _this = this
      queryCardNo = encodeURI(queryCardNo)
      getCard(currentPage, pageSize, queryCardNo)
      .then(function (response) {
        _this.cardTableData = response.data.rows
        _this.total = response.data.total
        _this.listLoading = false
        console.log(response.data)
      })
      .catch(function (error) {
        _this.listLoading = false
        console.log(error)
      })
    },
    formatPark (row, column, cellValue) {
      return cellValue.join('， ')
    },
    queryParkTree () {
      var _this = this
      _this.loadingTree = true
      queryParkList()
        .then(
          function (response) {
            _this.loadingTree = false
            if (response.code === '0') {
              _this.noData = true
              _this.parkTreeData = response.data
            } else {
              _this.noData = true
            }
          }
        )
        .catch(function (error) {
          _this.loadingTree = true
          console.log(error)
        })
    },
    handleNodeClick (data, ch) {
      let codes = []
      console.log(this.$refs.tree.getCheckedNodes())
      for (let i = 0; i < this.$refs.tree.getCheckedNodes().length; i++) {
        codes.push(this.$refs.tree.getCheckedNodes()[i].parkingCode)
      }
      console.log(codes)
      if (data.parentParkingCode && ch) {
        codes.push(data.parentParkingCode, data.parkingCode)
        this.$refs.tree.setCheckedKeys(codes)
      }
      this.selectParkCode = this.$refs.tree.getCheckedNodes()
      // this.selectParkCode = this.$refs.tree.getCheckedNodes()
      // console.log(this.selectParkCode)
    },
    queryByNo () {
      this.loadData(this.currentPage, this.pageSize, this.queryCardNo)
    },
    queryCardByNo () {
      this.getTempCard()
    },
    selectCardCharge (val) {
      this.selectCard = val
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.loadData(this.currentPage, this.pageSize, this.queryCardNo)
    },
    findPage (val) {
      this.currentPage = val
      this.loadData(this.currentPage, this.pageSize, this.queryCardNo)
    },
    handleSizeAuthChange (val) {
      this.pageSizeAuth = val
      this.getTempCard()
    },
    findAuthPage (val) {
      this.currentPageAuth = val
      this.getTempCard()
    },
    saveAccredit () {
      let _this = this
      let cardNums = []
      let parkArr = []
      for (let i = 0; i < _this.selectParkCode.length; i++) {
        parkArr.push(_this.selectParkCode[i].parkingCode)
      }
      for (let i = 0; i < _this.selectCard.length; i++) {
        cardNums.push(_this.selectCard[i].cardNo)
      }
      // parkArr = Array.from(new Set(this.getParentTree(this.parkTreeData, parkArr)))
      if (cardNums.length > 0 && parkArr.length > 0) {
        parkArr = parkArr.toString()
        updateCardAuth(parkArr, cardNums).then(
            function (response) {
              if (response.code === '0') {
                _this.$message({
                  type: 'success',
                  message: '授权成功'
                })
              } else {
                _this.$alert('授权失败', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {}
                })
              }
              _this.dialogVisible = false
              _this.loadData(_this.currentPage, _this.pageSize, _this.queryCardNo)
              _this.getTempCard()
            }
          ).catch(() => {})
      } else {
        this.$message({
          message: '请选择需授权的车场或卡号',
          type: 'warning'
        })
      }
    },
    TempAuth () { // 授权
      this.dialogVisible = true
      this.currentPage = 1
      this.pageSize = 10
      this.queryCardNo = ''
      this.loadData(this.currentPage, this.pageSize, this.queryCardNo)
      this.$refs.tree.setCheckedKeys([])
    },
    handleEdit (index, row) {
      this.dialogVisibleEdit = true
      this.editCard = row.cardNo
      this.authParkCode = row.parkCode
      console.log(this.$refs.editTree)
      if (this.$refs.editTree) {
        this.$refs.editTree.setCheckedKeys(this.authParkCode)
      }
      // console.log(row)
    },
    editNodeClick (data, ch) {
      let codes = []
      console.log(this.$refs.editTree.getCheckedNodes())
      for (let i = 0; i < this.$refs.editTree.getCheckedNodes().length; i++) {
        codes.push(this.$refs.editTree.getCheckedNodes()[i].parkingCode)
      }
      console.log(codes)
      if (data.parentParkingCode && ch) {
        codes.push(data.parentParkingCode, data.parkingCode)
        this.$refs.editTree.setCheckedKeys(codes)
      }
      // this.selectParkCode = this.$refs.editTree.getCheckedNodes()
    },
    editAuthSave () {
      console.log(this.$refs.editTree.getCheckedKeys())
      let _this = this
      if (_this.$refs.editTree.getCheckedKeys().length > 0) {
        _this.editAuthCodes = (this.$refs.editTree.getCheckedKeys()).join(',')
        updateAuthTempCard(_this.editAuthCodes, _this.editCard)
        .then(function (response) {
          _this.dialogVisibleEdit = false
          _this.getTempCard()
        })
        .catch(function (error) {
          console.log(error)
        })
      } else {
        this.$message({
          message: '请选择需授权的车场',
          type: 'warning'
        })
      }
    },
    getParentTree (data, codes) { // 获取树的父节点
      let temp = data
      let treeId = []
      function getTreeId (data, code) {
        let parCode
        for (let dataItem of data) {
          if (dataItem.parkingCode === code) {
            treeId.push(dataItem.parkingCode)
            parCode = dataItem.parentParkingCode
            getTreeId(temp, parCode)
          } else {
            getTreeId(dataItem.subParkingLots, code)
          }
        }
      }
      function getTreeCodes (codes) {
        for (let code of codes) {
          getTreeId(data, code)
        }
        return treeId
      }
      return getTreeCodes(codes)
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/views/ParkingLotApp/assets/css/parkLotApp.less";
.form-cont{
  display: inline-block;
  vertical-align: top;
  margin-left: 40px;
}
</style>
<style>
.edit-park-tree .el-tree__empty-text{
  left: 80px;
}
</style>



