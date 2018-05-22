
<template>
  <el-dialog title="触发设备" :visible="show" @close="deviceDialogClose" :modal="false" width="60%">
    <div class="device-dialog">
      <el-row>
        <el-col :span="6">
          <div class="device-tree">
            <div class="event-source-tree">
              <div class="tree-size">
                <el-tree :default-checked-keys="defaultCheckeds" :filter-node-method="filterNode" :load="loadNode" lazy placement="bottom" :data="data" ref="tree" node-key="uuid" :props="defaultProps" @node-click="onNodeClick" :expand-on-click-node="false"></el-tree>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="device-table">
            <el-table ref="deviceTableInit" :data="deviceTable" border max-height="530" @selection-change="handleSelectionChange" :row-key="getRowKeys" tooltip-effect="light">
              <el-table-column type="selection" :reserve-selection="true" width="50" align="center"></el-table-column>
              <el-table-column prop="deviceID" label="设备ID" align="center" width="220" show-overflow-tooltip></el-table-column>
              <el-table-column prop="deviceName" label="设备名称" align="center" width="220" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="scope.row.parentDeviceID" style="text-align:left">
                    <img :src=" imgUrl.secondImg " class="device-size ">{{scope.row.deviceName}}
                  </div>
                  <div v-else style="text-align:left">
                    <img :src="imgUrl.mainImg " class="device-size">{{scope.row.deviceName}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="installAddress" label="区域" align="center" width="218" show-overflow-tooltip></el-table-column>
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
</template>
<script>
import { getOrgNextLevelData, getSourceTreeData } from '../apis/index.js'
export default {
  props: {
    show: {
      required: true,
      type: Boolean,
      default () {
        return false
      }
    },
    data: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: '请选择设备'
    },
    defaultCheckeds: {
      type: Array,
      default () {
        return []
      }
    },
    code: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      defaultProps: {              // 指定节点标签为节点对象的某个属性值
        children: 'children',
        label: 'name',
        isLeaf: this.isTreeLeaf
      },
      treeSelect: [],              // 树中选择的
      rootKey: [],                // 默认展开的节点的 key 的数组
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
  computed: {
    // 当前选择的标题
    setTitle () {
      let list = this.treeSelect.map((item) => { return item.label })
      return list.length ? list.join('、') : this.title
    }
  },
  methods: {
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
    // 逐级加载组织树
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve(this.data)
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
    // 改变选中项
    handleSelectionChange (rows) {
      this.hasSelected = []
      if (rows) {
        rows.forEach(row => {
          if (row) {
            this.hasSelected.push(row)
          }
        })
      }
    },
    // // 选中数组去重
    // removeDuplicates (array) {
    //   let arr = []
    //   for (let i = 0, l = array.length; i < l; i++) {
    //     for (let j = i + 1; j < l; j++) {
    //       if (array[i].deviceID === array[j].deviceID) {
    //         j = ++i
    //       }
    //     }
    //     arr.push(array[i])
    //   }
    //   return arr
    // },
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
    // 确认保存选中数据
    confirmSourceTree () {
      this.$emit('closeDeviceDialog', this.hasSelected)
      this.$refs.deviceTableInit && this.$refs.deviceTableInit.clearSelection()
      this.clear()
    },
    // 关闭弹窗
    deviceDialogClose () {
      this.$emit('closeDeviceDialog')
      this.$refs.deviceTableInit && this.$refs.deviceTableInit.clearSelection()
      this.clear()
    },
    // 清空选中
    clear () {
      this.deviceTable = []
      this.hasSelected = ''
      this.queryData.pageNo = 1
      this.queryData.total = 0
    },
    // 判断是否为设备
    isTreeLeaf (data, node) {
      return data.isDevice
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.toUpperCase().indexOf(value.toUpperCase()) !== -1
    }
  }
}
</script> 
<style>
.tree-size .el-tree-node > .el-tree-node__children {
  overflow: visible;
}
</style>
<style  lang='less'>
// 当组织树中有数据时，显示横向滚动条
.event-source-tree {
  .el-tree-node > .el-tree-node__children {
    overflow: visible;
  }
}
</style>
<style scoped lang='less'>
.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: #fff;
}
.event-source-tree {
  min-width: 218px;
  max-width: 220px;
  min-height: 220px;
  max-height: 550px;
  overflow: auto;
  // .eventTree {
  //   min-width: 200%;
  // }
}
.device-dialog {
  width: 100%;
  height: 100%;
  padding: 15px;
  margin: -20px 0 -20px 0;
  .device-tree {
    width: 240px;
    height: 550px;
    border: 1px solid #999;
    padding: 20px;
  }
  .device-table {
    border: 1px solid #999;
    width: 710px;
    height: 550px;
    padding: 20px;
    margin-left: 45px;
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
    .dialog-footer {
      margin-top: 10px;
    }
  }
  .el-dropdown-link {
    display: inline-block;
    width: 200px;
    height: 38px;
    .select-text {
      display: inline-block;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    i.el-icon--right {
      height: 100%;
      line-height: 40px;
      position: absolute;
      top: 0;
      right: 15px;
    }
  }
}
</style>


