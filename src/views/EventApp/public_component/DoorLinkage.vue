<template>
  <div class='door-linkage'>
    <!-- <el-row>
      <el-col :span="lWidth-sWidth"> -->
    <div class="event-btns">
      <span type="info" @click="openAddDialog">＋ 添加</span>
      <span type="info" @click="handleDel">× 删除</span>
    </div>
    <el-table :data="sourceTableData" border @selection-change="handleSelectionChange" ref="sourceTable" max-height="380">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="deviceID" label="设备ID" align="center"></el-table-column>
      <el-table-column prop="deviceName" label="设备名称" align="center"></el-table-column>
      <el-table-column prop="installAddress" label="区域" align="center"></el-table-column>
    </el-table>
    <el-dialog class="linkage-mode-source-dialog" title="添加联动设备" :visible="dialogVisible" width="1150px" @close="deviceDialogClose" :modal="false" :code="code">
      <div class="device-dialog">
        <el-row>
          <el-col :span="6">
            <div class="device-tree">
              <div class="event-source-tree">
                <div class="tree-size">
                  <el-tree :default-checked-keys="defaultCheckeds" :filter-node-method="filterNode" :load="loadNode" lazy placement="bottom" :data="treeData" ref="tree" node-key="uuid" :props="defaultProps" @node-click="onNodeClick"></el-tree>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="device-table">
              <el-table ref="deviceTableInit" :data="deviceTable" border max-height="535" @selection-change="handleSelectionChangeDevice" :row-key="getRowKeys" tooltip-effect="light">
                <el-table-column type="selection" :reserve-selection="true" width="50" align="center"></el-table-column>
                <el-table-column prop="deviceID" label="设备ID" align="center" width="220" show-overflow-tooltip></el-table-column>
                <el-table-column prop="deviceName" label="设备名称" align="center" width="220" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div v-if="scope.row.parentDeviceID" style="text-align:left">
                      <img :src=" imgUrl.secondImg " class="device-size ">{{scope.row.deviceName}}
                    </div>
                    <div v-else style="text-align:left">
                      <img :src="imgUrl.mainImg " class="device-size ">{{scope.row.deviceName}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="installAddress" label="区域" align="center" width="209" show-overflow-tooltip></el-table-column>
              </el-table>
              <el-pagination class="el-page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryData.pageNo" :page-size="queryData.pageSize" :page-sizes="[10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="queryData.total"></el-pagination>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type='primary' @click="confirmSourceTree">确认</el-button>
        <el-button @click="deviceDialogClose">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
import { copyObject } from '../../../packages/utils/util'
import { getSourceTreeData, getOrgNextLevelData } from '../apis/index'
export default {
  name: 'DoorLinkage',
  props: {
    modifyData: {
      type: Array,
      default: []
    },
    code: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,      // 弹窗的打开和关闭
      hasSelected: [],           // 当前选中项
      deviceId: '',              // 当前选中的设备id
      treeData: [],              // 获取的当前组织树数据
      checkedNodes: [],          // 已选中的树节点
      defaultCheckeds: [],       // 默认选中的树节点
      sourceTableData: [],       // 列表数据
      rootKey: [],               // 默认展开的节点的 key 的数组
      defaultProps: {            // 指定节点标签为节点对象的某个属性值
        children: 'children',
        label: 'name',
        isLeaf: this.isTreeLeaf  // 是否为叶子
      },
      deviceTable: [],
      // 查询对象
      queryData: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      levelUuid: '',
      imgUrl: {
        mainImg: require('./../assets/images/equipmentMain.png'),
        secondImg: require('./../assets/images/equipment.png')
      },
      getRowKeys (row) {
        return row.deviceID
      }
    }
  },
  methods: {
    // 资源列表删除勾选的资源点
    handleDel () {
      this.sourceTableData = _.differenceWith(this.sourceTableData, this.hasSelected, _.isEqual)
      this.$emit('onUpdateData', this.sourceTableData)
    },
    // 打开资源添加弹窗
    openAddDialog () {
      this.dialogVisible = true
      let param = { uuid: '' }
      getSourceTreeData(param).then(res => {
        this.treeData = [res.data.data]
      }).catch(err => {
        console.log(err)
      })
    },
    // 逐级加载组织树
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve(this.treeData)
      }
      setTimeout(() => {
        let params = {
          uuid: node.data.uuid
        }
        getSourceTreeData(params)   // 请求下级子数据
          .then((res) => {
            if (res.data.code === '00000') {
              resolve(res.data.data || [])
            }
          })
          .catch()
      }, 500)
    },
    // 关闭弹窗
    deviceDialogClose () {
      this.dialogVisible = false
      this.$refs.deviceTableInit && this.$refs.deviceTableInit.clearSelection()
      this.clearData()
    },
    // 改变选中项
    handleSelectionChange (data) {
      this.hasSelected = data
    },
    // 当选中项改变时触发
    onCheckChange () {
      this.checkedNodes = this.$refs.tree.getCheckedNodes(true).filter(rs => { return rs.isDevice })
    },
    clearData () {
      this.deviceTable = []
      this.hasSelectedData = []
      this.queryData.total = 0
      this.queryData.pageNo = 1
    },
    // 点击确认将数据渲染在表格中
    confirmSourceTree () {
      this.sourceTableData = copyObject(this.hasSelectedData)
      this.$emit('onUpdateData', this.sourceTableData)
      this.dialogVisible = false
      this.$refs.deviceTableInit && this.$refs.deviceTableInit.clearSelection()
      this.clearData()
    },
    // // 选中数组去重
    // removeDuplicates (array) {
    //   let r = []
    //   for (let i = 0, l = array.length; i < l; i++) {
    //     for (let j = i + 1; j < l; j++) {
    //       if (array[i].deviceID === array[j].deviceID) {
    //         j = ++i
    //       }
    //     }
    //     r.push(array[i])
    //   }
    //   return r
    // },
    // 树节点点击事件
    onNodeClick (data) {
      this.levelUuid = data.uuid
      this.onCurrentPageData()
    },
    // 分页获取数据
    onCurrentPageData () {
      let params = {
        uuid: this.levelUuid,
        code: this.code,
        pageNo: this.queryData.pageNo,
        pageSize: this.queryData.pageSize
      }
      // 请求下级子数据
      getOrgNextLevelData(params)
        .then((res) => {
          if (res.data.code === '00000') {
            this.deviceTable = res.data.data.deviceList
            this.queryData.total = res.data.data.totalCount
          }
        })
        .catch()
    },
    // 改变选中项
    handleSelectionChangeDevice (rows) {
      this.hasSelectedData = []
      if (rows) {
        rows.forEach(row => {
          if (row) {
            this.hasSelectedData.push(row)
          }
        })
      }
    },
    handleSizeChange (val) {
      this.queryData.pageSize = val
      this.queryData.pageNo = 1
      this.onCurrentPageData()
    },
    handleCurrentChange (val) {
      // 显示当前页数
      this.queryData.pageNo = val
      this.onCurrentPageData()
    },
    // 判断是否为树子级
    isTreeLeaf (data, node) {
      return data.isDevice
    },
    //  树节点过滤模糊查询
    filterNode (value, data) {
      if (!value) return true
      return data.name.toUpperCase().indexOf(value.toUpperCase()) !== -1
    }
  },
  watch: {
    modifyData (val) {
      this.$nextTick(() => {
        this.sourceTableData = val
      })
    }
  }
}
</script>
<style>
.device-size {
  width: 20px;
  vertical-align: middle;
  text-align: center;
  margin-right: 10px;
  margin-left: 30px;
}
</style>
<style scoped lang='less'>
.door-linkage {
  .event-btns {
    height: 40px;
    line-height: 40px;
    background-color: #666;
    text-align: left;
    color: #fff;
    span {
      cursor: pointer;
      margin-left: 15px;
    }
  }
  .device-dialog {
    width: 100%;
    height: 100%;
    padding: 20px;
    margin: -30px 0 20px -2px;
    .device-tree {
      width: 240px;
      height: 550px;
      border: 1px solid #999;
      padding: 20px;
      margin-left: 5px;
      .el-dropdown-link {
        display: inline-block;
        width: 200px;
        height: 38px;
        margin: 0 0 20px 5px;
      }
    }
    .event-source-tree {
      min-width: 218px;
      max-width: 220px;
      min-height: 220px;
      max-height: 550px;
      overflow: auto;
    }
    .device-table {
      border: 1px solid #999;
      width: 700px;
      height: 550px;
      padding: 20px;
      margin-left: 50px;
      .device-size {
        width: 20px;
        vertical-align: middle;
        text-align: center;
        margin-right: 10px;
        margin-left: 35px;
      }
      .el-page {
        text-align: center;
        height: 30px;
      }
    }
  }
  .audio-select {
    text-align: center;
    line-height: 50px;
    padding: 10px;
    height: 380px;
    border: 1px solid #999;
    margin: 8px 8px 8px 18px;
    .el-tabs--border-card {
      width: 100%;
      height: 80%;
    }
  }
  .dialog-footer {
    display: inline-block;
    margin-top: 20px;
  }
}
</style>
<style lang='less'>
.linkage-mode-source-dialog {
  .el-dialog__body {
    text-align: center;
    height: 516px;
  }
  .tree-size {
    height: 100%;
    overflow: auto;
  }
}
</style>

