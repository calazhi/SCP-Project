<template>
  <el-container class="screen-container">
    <aside class="aside-box">
      <ul class="screen-name-lists">
        <li v-for="(item,index) in screenList" :key="item.monitorId" @click="screenItemClick(item,index)">
          <span class="screen-name-text" :class="{'actived': index===curScreenIndex}">{{item.name}}</span>
        </li>
      </ul>
    </aside>
    <main class="el-main main-box">
      <el-form>
        <el-table :data="screenChannel" border>
          <el-table-column align="center" prop="childMonitorId" label="窗口序号"></el-table-column>
          <el-table-column align="center" prop="orgName" label="组织名称"></el-table-column>
          <el-table-column align="center" prop="deviceName" label="摄像头名称"></el-table-column>
          <el-table-column align="center" prop="subDeviceName" label="监控点名称"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="btnAssign(scope.$index, scope.row)">配置</el-button>
              <el-button size="mini" @click="clearOption(scope.$index, scope.row)">清除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="channel-page">
          <el-pagination @current-change="loadPage" layout="total, sizes,prev,pager,next,jumper" :total="pageTotal" :page-size="pageSize" :page-sizes="sizeArr" @size-change="handleSizeChange">
          </el-pagination>
        </div>
      </el-form>
    </main>
    <el-dialog title="屏幕通道设置" :visible.sync="dialogVisible" :close-on-click-modal="false" width="700px">
      <el-form :model="editItem" :rules="dialogRules" label-width="116px">
        <el-form-item label="监控点名称" prop="subDeviceName">
          <el-input :value="editItem.subDeviceName" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="组织" prop="subDeviceName">
          <div class="screen-tree-box">
            <el-tree node-key="uuid" :props="tree.props" ref="cameraTree" :default-expanded-keys="[tree.rootKey]" :render-content="renderTree" :load="getCameraByOrgId" lazy @node-click="treeNodeClick">
            </el-tree>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="assignChannel">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import { getScreenList, getScreenOption, deleteScreenOption, updateScreenOption } from './apis/screenOption.js'
import { getCameraTreeData, getCameraTreeNodeData } from './apis/customGroup.js'
import { confirmDelete } from '@/views/VideoGatewayApp/apis/common.js'
import { copyObject } from '../../packages/utils/util'

export default {
  name: 'screenOption',
  data () {
    return {
      screenList: [],
      screenChannel: [],
      curScreenIndex: -1,
      curMonitorId: '',
      pageSize: 20,
      pageTotal: 0,
      curPage: 0,
      sizeArr: [10, 20, 50],
      dialogVisible: false,
      editItem: {},
      dialogRules: {
        subDeviceName: [{ required: true, message: '请选择监控点', trigger: 'blur' }]
      },
      tree: {
        rootKey: '',
        data: [],
        props: {
          children: 'children',
          label: 'name',
          isLeaf: this.isTreeLeaf
        }
      }
    }
  },
  mounted () {
    this.fnGetScreenList()
  },
  methods: {
    confirmDelete: confirmDelete,
    // 获取电视墙屏幕列表
    fnGetScreenList () {
      let reqData = {}
      getScreenList(reqData).then(
        result => {
          this.screenList = result || []
          if (this.screenList.length > 0) this.screenItemClick(this.screenList[0], 0)
        }
      )
    },
    // 点击电视墙屏幕列表
    screenItemClick (item, index) {
      this.curScreenIndex = index
      this.curMonitorId = item.mainMonitorId
      this.loadPage(1)
    },
    // 分页获取电视墙屏幕通道
    loadPage (pageNo) {
      let reqData = {
        'monitorId': this.curMonitorId,
        'pageSize': this.pageSize,
        'pageNo': this.pageNo
      }
      getScreenOption(reqData).then(
        result => {
          this.pageTotal = result.total
          this.curPage = pageNo
          this.screenChannel = result.rows || []
        }
      )
    },
    // 跳页
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.loadPage(1)
    },
    // 清除通道设置
    clearOption (index, item) {
      this.confirmDelete('确认清除配置', () => {
        let reqData = {
          'cameraCode': item.cameraCode,
          'monitorId': item.monitorId,
          'childMonitorId': item.childMonitorId
        }
        deleteScreenOption(reqData).then(
          result => {
            this.$message({ type: 'success', message: '清除成功' })
          }
        )
      })
    },
    // 打开编辑窗口
    btnAssign (index, item) {
      this.dialogVisible = true
      this.editItem = copyObject(item)
    },
    // 关闭编辑窗口
    closeDialog () {
      this.dialogVisible = false
    },
    // 保存设置
    assignChannel () {
      let reqData = {
        'cameraCode': this.editItem.cameraCode,
        'monitorId': this.editItem.monitorId,
        'childMonitorId': this.editItem.childMonitorId
      }
      updateScreenOption(reqData).then(
        result => {
          this.closeDialog()
          this.$message({ type: 'success', message: '配置成功' })
        }
      )
    },
    // 是否叶子
    isTreeLeaf (data, node) {
      return data.type === 'camera'
    },
    // 点击组织后加载视频
    renderTree (h, { node, data, store }) {
      let icon = data.type === 'camera' ? h('i', { class: 'icon-camera-tree-video' }) : ''
      return h('div', {}, [icon, data.name])
    },
    // 惰性加载树节点下的视频
    getCameraByOrgId (node, resolve) {
      if (node.level === 0) {
        getCameraTreeData().then(
          result => {
            if (result) {
              this.tree.rootKey = result.uuid
              resolve([result])
            } else {
              resolve([])
            }
          }
        )
      } else {
        if (!node.data) {
          resolve([])
          return
        }
        let reqData = { orgId: node.data.uuid }
        getCameraTreeNodeData(reqData).then(
          result => {
            resolve(result.children || [])
          }
        )
      }
    },
    // 树节点点击
    treeNodeClick (item, node) {
      if (node.isLeaf) {
        this.editItem.cameraCode = item.uuid
        this.editItem.subDeviceName = item.name
      }
    }
  }
}
</script>
<style>
.screen-tree-box.el-tree-node > .el-tree-node__children {
  overflow: visible;
}
.screen-container .el-dialog__body {
  padding-bottom: 10px;
}
.screen-tree-box .icon-camera-tree-video {
  background-image: url(./assets/images/camera.png);
  font-style: normal;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  height: 14px;
  width: 14px;
  margin-right: 2px;
}
</style>
<style lang="less" scoped>
.aside-box {
  width: 280px;
  padding-right: 14px;
}
.main-box {
  padding-left: 24px;
}
.screen-name-lists {
  padding: 16px 0px 0px 0px;
  li {
    display: block;
    height: 28px;
    line-height: 28px;
    margin-bottom: 6px;
    text-align: left;
    cursor: pointer;
    color: #333;
    font-size: 14px;
    position: relative;
  }
  .screen-name-text {
    display: inline-block;
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    height: 28px;
    border: 1px solid #ccc;
    text-align: center;
    padding: 0px 2px;
    &.actived {
      color: #fff;
      background: #409eff;
      border-color: #409eff;
    }
  }
}
.channel-page {
  text-align: center;
  margin-top: 15px;
}
.screen-tree-box {
  width: 526px;
  float: left;
  border: solid 1px #e6e6e6;
  height: 480px;
  padding: 8px;
  overflow: auto;
}
</style>