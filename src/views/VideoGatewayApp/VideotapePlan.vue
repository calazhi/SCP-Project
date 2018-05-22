<template>
  <div class="video-tape-main">
    <div class="tree-aside">
      <el-tree :data="tree.data" node-key="uuid" :props="tree.props" @node-click="treeNodeClick" ref="addressTree" :default-expanded-keys="[tree.rootKey]" :expand-on-click-node="false" :highlight-current="true">
      </el-tree>
    </div>
    <div class="tree-main">
      <el-form :inline="true">
        <el-form-item label="当前组织:" label-width="80px">
          <el-input :readonly="true" v-model="tree.curNodeName" style="width:280px;"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="btnResetSelected">清除已选</el-button>
      <el-table class="videotape-plan" :data="tapeDeviceList" border style="margin-top:30px" @selection-change="selectChange">
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column align="center" prop="subDeviceName" label="监控点名称" :formatter="getMonitorName"></el-table-column>
        <el-table-column align="center" prop="deviceName" label="设备名称"></el-table-column>
        <el-table-column align="center" prop="deviceIP" label="设备ip"></el-table-column>
        <el-table-column align="center" prop="devicePort" label="设备端口"></el-table-column>
        <el-table-column align="center" prop="templateId" label="录像计划模板" :formatter="getSetStatusLabel"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="btnAssign(scope.$index, scope.row)">配置</el-button>
            <el-button size="mini" @click="btnReset(scope.$index, scope.row)">清除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="videotap-page">
        <el-pagination @current-change="loadData" layout="total, sizes,prev,pager,next,jumper" :total="page.total" :page-size="page.pageSize" :page-sizes="page.sizeArr" @size-change="handleSizeChange">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="录像计划配置" :visible.sync="dialog.visible" :close-on-click-modal="false" :append-to-body="true">
      <el-form :model="tapeDevice" ref="tapeDeviceForm" :rules="dialogRules" label-width="116px">
        <el-form-item label="基本信息"></el-form-item>
        <el-form-item label="监控点名称">
          <el-input :value="tapeDevice.subDeviceName" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input :value="tapeDevice.deviceName" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="设备ip">
          <el-input :value="tapeDevice.deviceIP" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="设备端口">
          <el-input :value="tapeDevice.devicePort" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="计划配置"></el-form-item>
        <el-form-item label="录像计划模板" prop="templateId">
          <el-select v-model="tapeDevice.templateId" clearable placeholder="请选择">
            <el-option v-for="(value,key) in templateList" :label="value" :value="key" :key="key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="assignTemplate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { confirmDelete } from '@/views/VideoGatewayApp/apis/common.js'
import { postTapeDeviceData, postClearTapePlanData, postSetTapePlanData, getOrganizationsData } from '@/views/VideoGatewayApp/apis/videotapePlan.js'
import { getTemplateData } from './apis/videoTemp.js'
import { copyObject } from '../../packages/utils/util'

export default {
  name: 'videotapePlan',
  data () {
    return {
      tapeDeviceList: [],
      tapeDevice: {},
      resourceCode: '', // 所属组织Id 50ee7595f5994a3e9807f2a00889fc56
      selection: [],
      templateList: {},
      tree: {
        rootKey: '',
        curNodeName: '',
        data: [],
        props: {
          children: 'children',
          label: 'name',
          isLeaf: this.isTreeLeaf
        },
        visible: false
      },
      page: {
        total: 0,
        pageSize: 20,
        sizeArr: [10, 20, 50],
        curPage: 1
      },
      dialog: {
        visible: false,
        curIndex: 0
      },
      dialogRules: {
        templateId: [{ required: true, message: '请选择录像计划模板', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    // 获取组织树
    getOrganizationsData().then((rs) => {
      if (rs) {
        this.tree.rootKey = rs.uuid
        this.tree.data = [rs]
      } else this.tree.data = []
    })
    // 获取模板数据
    getTemplateData().then(rs => {
      rs.forEach(item => { this.templateList[item.uuid] = item.templateName })
    })
  },
  methods: {
    // 分页请求
    loadData (pageNo) {
      if (!this.resourceCode) return
      let reqData = {
        orgId: this.resourceCode,
        pageNo: pageNo,
        pageSize: this.page.pageSize
      }
      postTapeDeviceData(reqData).then(
        result => {
          this.tapeDeviceList = result.rows
          this.page.total = result.total
          this.page.curPage = pageNo
        }
      )
    },
    // 跳页
    handleSizeChange (pageSize) {
      this.page.pageSize = pageSize
      this.loadData(1)
    },
    // 根据组织获取数据
    treeNodeClick (data, node) {
      this.resourceCode = data.uuid
      this.tree.curNodeName = data.name
      this.loadData(1)
    },
    // 设置录像模板
    assignTemplate () {
      this.$refs['tapeDeviceForm'].validate(
        (valid) => {
          if (valid) {
            let reqData = {
              'recordPlanUuid': this.tapeDevice.recordPlanUuid || '',
              'deviceCode': this.tapeDevice.deviceID,
              'deviceName': this.tapeDevice.deviceName,
              'deviceIp': this.tapeDevice.deviceIP,
              'devicePort': this.tapeDevice.devicePort,
              'cameraName': this.tapeDevice.subDeviceName,
              'cameraCode': this.tapeDevice.subDeviceID,
              'templateId': this.tapeDevice.templateId
            }
            postSetTapePlanData(reqData).then(
              result => {
                this.dialog.visible = false
                // this.tapeDeviceList[this.dialog.curIndex].templateId = this.tapeDevice.templateId
                this.loadData(this.page.curPage)
                this.$message({ type: 'success', message: '配置成功' })
              }
            ).catch(() => {
            })
          } else {
            return false
          }
        }
      )
    },
    // 点击配置按钮
    btnAssign (index, item) {
      this.dialog.visible = true
      this.tapeDevice = copyObject(this.tapeDeviceList[index])
      let isSet = this.getSetStatus(this.tapeDevice)
      if (!isSet) this.tapeDevice.templateId = ''
      this.dialog.curIndex = index
      if (this.$refs['tapeDeviceForm']) this.$refs['tapeDeviceForm'].resetFields()
    },
    // 清除用户已选
    btnResetSelected () {
      if (this.selection.length <= 0) {
        this.$message({ type: 'warning', message: '请勾选录像计划' })
        return
      }
      this.clearTapePlan('确认清除所选录像配置', this.selection)
    },
    // 点击行内清除按钮
    btnReset (index, item) {
      if (!this.getSetStatus(item)) {
        this.$message({ type: 'warning', message: '设备未配置录像计划' })
        return
      }
      this.clearTapePlan('确认清除配置', [item])
    },
    // 清除录像计划配置
    clearTapePlan (confirmMessage, itemList) {
      this.confirmDelete(confirmMessage, () => {
        let reqData = []
        itemList.forEach(
          item => {
            if (this.getSetStatus(item)) reqData.push(item.recordPlanUuid)
          }
        )
        if (reqData.length <= 0) return
        postClearTapePlanData(reqData).then(
          result => {
            if (!result || result <= 0) {
              this.$message({ type: 'warning', message: '清除失败' })
            } else {
              this.$message({ type: 'success', message: '清除成功' })
              this.tapeDeviceList.forEach(
                item => {
                  if (result.indexOf(item.recordPlanUuid) !== -1) {
                    item.templateId = ''
                    item.recordPlanUuid = ''
                  }
                })
            }
          }
        ).catch(
          () => {
            this.$message({ type: 'warning', message: '清除失败' })
          })
      })
    },
    // 勾选状态
    selectChange (val) {
      this.selection = val
    },
    // 模板配置状态
    getSetStatus (item) {
      return item.recordPlanUuid && item.templateId && item.recordPlanStatus === 1
    },
    // 录像计划是否配置模板
    getSetStatusLabel (row, column, cellValue) {
      let isSeted = this.getSetStatus(row)
      return isSeted ? '已配置' : '未配置'
    },
    // 获取监控点名称
    getMonitorName (row, column, cellValue) {
      return row.subDeviceName
    },
    // 是否叶子
    isTreeLeaf (data, node) {
      return !data.children
    },
    confirmDelete: confirmDelete
  }
}
</script>
<style scoped lang="less">
.video-tape-main {
  height: 100%;
  position: relative;
  left: 40px;
}
.videotape-plan {
  width: 100%;
}
.videotap-page {
  text-align: center;
  margin-top: 15px;
}
.tree-aside {
  position: absolute;
  width: 220px;
  top: 20px;
  left: -60px;
  overflow: auto;
  .el-tree-node > .el-tree-node__children {
    overflow: visible;
  }
  height: 100%;
  overflow: auto;
}
.tree-main {
  margin-left: 180px;
  height: 100%;
  overflow: auto;
  padding-right: 40px;
}
</style>
<style type="text/css" lang="less">
.tree-aside {
  .el-tree-node > .el-tree-node__children {
    overflow: visible;
  }
}
</style>
