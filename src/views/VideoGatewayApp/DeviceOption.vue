<template>
  <div>
    <el-form :inline="true" :model="searchData" ref="searchForm">
      <el-form-item label="设备名称">
        <el-input v-model="cameraName" clearable placeholder="请输入设备名称" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDeviceList()">查询</el-button>
      </el-form-item>
      <el-table :data="deviceList" border style="margin-top:30px" ref="deviceList">
        <el-table-column align="center" prop="deviceName" label="设备名称"></el-table-column>
        <el-table-column align="center" prop="deviceTypeName" label="设备类型"></el-table-column>
        <el-table-column align="center" prop="deviceIP" label="IP地址"></el-table-column>
        <el-table-column align="center" prop="devicePort" label="端口"></el-table-column>
        <el-table-column align="center" prop="installAddress" label="安装地址"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="deviceBind(scope.$index, scope.row)">绑定设备</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="video-pagination">
        <el-pagination @size-change="onPageSizeChange" @current-change="handleCurrentChange" :current-page="curPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalDevice">
        </el-pagination>
      </div>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" @close="closeDialog" :close-on-click-modal="false" width="680px">
      <div class="dialog-header">
        设备名称：{{this.deviceName}}
      </div>
      <div class="box">
        <el-row>
          <el-col :span="10">
            <div class="box-left">
              <ul>
                <li v-for="item in devices" :key="item.deviceID" @click="chooseCamara(item)" :class="{'actived':item.deviceID===curDeviceID}">
                  <span><img src="./assets/images/camera.png"> </span>
                  <span class="box-left-li">{{item.deviceName}}</span>
                </li>
              </ul>
            </div>
            <div class="left-button">
              <el-button type="primary" plain @click="chooseOrg">选择组织</el-button>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="box-middle">
              <div class="icon-delate">
                <el-button type="primary" plain icon="el-icon-arrow-left" @click="delateCamaraBtn">删除</el-button>
              </div>
              <div class="icon-choose">
                <el-button type="primary" plain @click="chooseCurCamara">选择
                  <i class="el-icon-arrow-right el-icon-right"></i>
                </el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="10" style="text-align: center">
            <div class="box-left">
              <div style="text-align:left">
                <el-checkbox v-model="chooseOption" v-show="this.curBindCamaraName">{{this.curBindCamaraName}}</el-checkbox>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-dialog width="30%" :visible.sync="innerVisible" append-to-body>
        <div class="tree-box">
          <div class="tree-box-header">查找其他设备-选择组织</div>
          <div class="tree-box-mid">
            <el-tree :data="tree.data" node-key="uuid" :props="tree.props" @node-click="treeNodeClick" :default-expanded-keys="[tree.rootKey]" :expand-on-click-node="false">
            </el-tree>
          </div>
          <div>
            <el-button type="primary" @click="confirmNode">确定</el-button>
          </div>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import { getSuperBrainPageList, getChannelListByOrgId, postInsertCamara, postUpdateCamara, postDelateCamara, postQueryCamara } from '@/views/VideoGatewayApp/apis/deviceOption.js'
import { getOrganizationsData } from '@/views/VideoGatewayApp/apis/videotapePlan.js'
import { copyObject } from '../../packages/utils/util'

export default {
  name: 'videoDevice',
  data () {
    return {
      searchData: { // 请求参数
        deviceName: ''
      },
      totalDevice: 0,
      pageSize: 20,
      curPage: 1,
      deviceList: [],  // 设备列表
      dialogVisible: false,
      deviceName: '',
      superBrainSubDeviceId: '',
      innerVisible: false,
      tree: {
        rootKey: '',
        curNodeName: '',
        data: [],
        props: {
          children: 'children',
          label: 'name'
        }
      },
      curOrgId: '',
      devices: [], // 设备列表
      curCamaraName: '',
      curDeviceID: '',
      chooseOption: true,
      cameraId: '',
      curCamara: {},
      curBindCamara: {},
      curBindCamaraName: '',
      cameraName: ''
    }
  },
  mounted () {
    this.getDeviceList()
  },
  methods: {
    // 获取设备列表
    getDeviceList () {
      let params = {
        'cameraName': this.cameraName,
        'pageSize': this.pageSize,
        'pageNo': this.curPage
      }
      getSuperBrainPageList(params).then(
        rs => {
          if (rs.data.code === '00000') {
            this.deviceList = rs.data.data.rows
            this.totalDevice = rs.data.data.total
          } else {
            this.$message({
              message: rs.message,
              type: 'warning'
            })
          }
        }
      )
    },
    // 跳转页面
    onPageSizeChange (val) {
      this.pageSize = val
      this.getDeviceList()
    },
    handleCurrentChange (val) {
      this.curPage = val
      this.getDeviceList()
    },
    // 打开编辑窗口
    deviceBind (index, item) {
      // console.log(item)
      this.dialogVisible = true
      this.deviceName = item.deviceName
      this.superBrainSubDeviceId = item.deviceID
      this.curOrgId = item.orgID
      this.loadDevice()
      this.queryCamara()
    },
    // 查询已绑定的摄像头
    queryCamara () {
      let params = {
        'superBrainSubDeviceId': this.superBrainSubDeviceId
      }
      postQueryCamara(params).then(
        rs => {
          if (rs.data.code === '00000') {
            this.curBindCamara = rs.data.data
            if (rs.data.data) {
              this.curBindCamaraName = rs.data.data.cameraName
            } else {
              this.curBindCamaraName = ''
            }
          } else {
            this.$message({
              message: rs.message,
              type: 'warning'
            })
          }
        }
      )
    },
    // 关闭编辑窗口
    closeDialog () {
      this.dialogVisible = false
      this.devices = []
    },
    // 打开内层diolog
    chooseOrg () {
      this.innerVisible = true
      this.getTreeData()
    },
    // 获取组织树
    getTreeData () {
      getOrganizationsData().then((rs) => {
        if (rs) {
          this.tree.rootKey = rs.uuid
          this.tree.data = [rs]
        } else this.tree.data = []
      })
    },
    // 点击树节点
    treeNodeClick (data, node) {
      this.curOrgId = data.uuid
    },
    // 确定
    confirmNode () {
      this.loadDevice()
    },
    // 根据组织树获取设备
    loadDevice () {
      let params = {
        orgId: this.curOrgId
      }
      getChannelListByOrgId(params).then(
        rs => {
          if (rs.data.code === '00000') {
            this.devices = rs.data.data
            this.innerVisible = false
          } else {
            this.$message({
              message: rs.message,
              type: 'warning'
            })
          }
        }
      )
    },
    // 点击选中摄像头
    chooseCamara (item) {
      this.curCamaraName = item.deviceName
      this.curDeviceID = item.deviceID
      this.curCamara = copyObject(item)
    },
    // 选择按钮
    chooseCurCamara () {
      if (this.curBindCamaraName === '') {
        this.insertCamara()
      } else {
        this.updateCamara()
      }
    },
    // 新增关联关系
    insertCamara () {
      let params = {
        'superBrainChannelName': this.deviceName,
        'superBrainSubDeviceId': this.superBrainSubDeviceId,
        'cameraId': this.curCamara.deviceID,
        'cameraName': this.curCamara.deviceName
      }
      postInsertCamara(params).then(
        rs => {
          if (rs.data.code === '00000') {
            this.curBindCamara = this.curCamara
            this.curBindCamaraName = this.curBindCamara.deviceName
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: rs.message,
              type: 'warning'
            })
          }
        }
      )
    },
    // 修改关联关系
    updateCamara () {
      let params = {
        'superBrainChannelName': this.deviceName,
        'superBrainSubDeviceId': this.superBrainSubDeviceId,
        'cameraId': this.curCamara.deviceID,
        'cameraName': this.curCamara.deviceName
      }
      postUpdateCamara(params).then(
        rs => {
          if (rs.data.code === '00000') {
            this.curBindCamara = this.curCamara
            this.curBindCamaraName = this.curBindCamara.deviceName
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: rs.message,
              type: 'warning'
            })
          }
        }
      )
    },
    // 删除关联关系
    delateCamara () {
      let params = {
        'superBrainSubDeviceId': this.superBrainSubDeviceId
      }
      postDelateCamara(params).then(
        rs => {
          if (rs.data.code === '00000') {
            this.curBindCamara = {}
            this.curBindCamaraName = ''
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: rs.message,
              type: 'warning'
            })
          }
        }
      )
    },
    delateCamaraBtn () {
      if (this.curBindCamaraName !== '') {
        if (this.chooseOption === true) {
          this.delateCamara()
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.video-pagination {
  text-align: center;
  margin-top: 15px;
}
.dialog-header {
  text-align: center;
  font-family: "微软雅黑";
  font-size: 20px;
  margin-bottom: 20px;
}
.box {
  width: 540px;
  margin: auto;
  .left-button {
    text-align: center;
    margin-top: 10px;
  }
  .box-left {
    width: 200px;
    height: 460px;
    border: 1px solid #ccc;
    margin: auto;
    overflow: auto;
    padding: 6px;
    ul > li {
      line-height: 24px;
      cursor: pointer;
      &.actived {
        background: #409eff;
        color: #fff;
      }
    }
    img {
      width: 18px;
      height: 18px;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .box-middle {
    .icon-delate {
      margin-top: 185px;
    }
    .icon-choose {
      margin-top: 10px;
    }
  }
}
.dialog-footer {
  text-align: center;
}
.tree-box {
  width: 250px;
  margin: auto;
  text-align: center;
  .tree-box-header {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .tree-box-mid {
    width: 250px;
    height: 400px;
    border: 1px solid #aaa;
    margin-bottom: 10px;
    overflow: auto;
    padding: 6px;
  }
}
</style>
