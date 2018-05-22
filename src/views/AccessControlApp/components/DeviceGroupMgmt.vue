<template>
  <el-container  class="dialog-padding">
    <el-row width="48%">
    <el-col :span="3"><el-button type="primary" @click="handleAddGroup" style="margin-bottom:0.5cm">新建分组</el-button></el-col>
    <el-table :data="deviceGroup" @row-click="handleShowEquips" max-height="700" highlight-current-row border class="table-format">
      <el-table-column width="50" type="index"></el-table-column>
      <el-table-column prop="uuid" v-if="false"></el-table-column>
      <el-table-column label="组名" prop="groupName"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>    
          <el-button type="text"  @click="removeEquipGroupById(scope.$index, scope.row)">删除</el-button> 
        </template>
      </el-table-column>
    </el-table>
    </el-row>

  <el-row>
    <el-col :span="3"><el-button type="danger" :disabled="this.sels.length === 0" style="margin-bottom:0.5cm" @click="removeDevices">删除组内设备</el-button></el-col>
    <el-table :data='devices' v-loading="groupDeviceLoading" element-loading-text="拼命加载中" @selection-change="selsChange" max-height="700" class="table-format" border >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="设备名称" prop="deviceName"></el-table-column>
      <el-table-column label="设备编码" prop="deviceID"></el-table-column>
      <el-table-column label="父设备编码" prop="parentDeviceID"></el-table-column>
      <el-table-column label="所属组织" prop="orgName"></el-table-column>
    </el-table>
  </el-row>

  <el-dialog :title="title" :visible.sync="dialogVisible" width="90%" :before-close="closeDialog">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :rules="rules" :model="insertForm" ref="insertForm">
          <el-form-item label="设备组名称" class="groupInput" prop="groupName">
            <el-input placeholder="请输入设备组名称" v-model="insertForm.groupName"></el-input>
          </el-form-item>
          <el-form-item label="备注" class="groupInput" prop="groupRemark">
            <el-input placeholder="请输入备注" v-model="insertForm.groupRemark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="dialogVisible=false">取消</el-button>
            <el-button type="primary" @click="handleSaveGroup" :disabled="this.adevices.length === 0">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="3" class="tree-aside">
        <el-input placeholder="组织树过滤" v-model="treeFilterText" clearable></el-input>
        <el-tree class="filter-tree" :filter-node-method="filterTreeNode" :data="orgTree" :props="defaultProps" ref='orgTree' highlight-current @node-click="getuDeviceList"></el-tree>
      </el-col>

      <el-col :span="10">
        <el-row>

          <el-col :span="24" class="col-height">
            <el-form :inline="true" :model="formDevice">
              <el-form-item label="设备名称">
                <el-input v-model="formDevice.deviceName" placeholder="请输入设备名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="设备编码">
                <el-input v-model="formDevice.deviceID" placeholder="请输入设备编码" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button icon="el-icon-search" circle @click="searchDevice">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-col>

          <el-col :span="24">
            <el-table :data="udevices" border stripe height="550" v-loading="orgDeviceLoading" element-loading-text="拼命加载中" @selection-change="devicesChange" ref="multipleTable">
              <el-table-column type="selection"></el-table-column>
              <el-table-column prop="gatewayServiceID" v-if="false"></el-table-column>
              <el-table-column prop="deviceTypeCode" v-if="false"></el-table-column>
              <el-table-column label="设备名称" prop="deviceName" width="132px" show-overflow-tooltip></el-table-column>
              <el-table-column label="设备编码" prop="deviceID" width="200px" show-overflow-tooltip></el-table-column>
              <el-table-column label="父设备编码" prop="parentDeviceID" width="200px" show-overflow-tooltip></el-table-column>
              <el-table-column label="所属区域" prop="orgName" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-col>

          <el-col :span="24" style="text-align:center; padding-top:8px">
            <el-button type="primary" @click="handleAddDevices" :disabled="this.selectDevices.length === 0">添加选中设备</el-button>
          </el-col>

        </el-row>
      </el-col>

      <el-col style="margin-left:10px;width:700px">
        <el-row>
          <el-col :span="24" class="col-height">
            <h3>已选设备</h3>
          </el-col>
          <el-col :span="24">
            <el-table :data="adevices" border stripe height="550" @selection-change="removeDevicesChange">
              <el-table-column type="selection"></el-table-column>
              <el-table-column prop="gatewayServiceID" v-if="false"></el-table-column>
              <el-table-column prop="deviceTypeCode" v-if="false"></el-table-column>
              <el-table-column label="设备名称" prop="deviceName" width="132px" show-overflow-tooltip></el-table-column>
              <el-table-column label="设备编码" prop="deviceID" width="200px" show-overflow-tooltip></el-table-column>
              <el-table-column label="父设备编码" prop="parentDeviceID" width="200px" show-overflow-tooltip></el-table-column>
              <el-table-column label="所属区域" prop="orgName"></el-table-column>
            </el-table>
          </el-col>

          <el-col :span="24" style="text-align:center; padding-top:8px">
            <el-button type="primary" @click="handleRemoveDevices" :disabled="this.rDevices.length === 0">移除选中设备</el-button>
          </el-col>

        </el-row>
      </el-col>

    </el-row>
 </el-dialog>

</el-container>

</template>

<script>
import { listDeviceGroup, deleteDeviceGroupById, listDevicesByOrgId, loadOrgTree, insertDeviceGroup, batchDeleteDevices
, listDevicesByGroupId, updateDeviceGroup, isGroupNameExists } from '@/views/AccessControlApp/apis'

export default {
  data () {
    let isExist = (rule, value, callback) => {
      if (this.orgGroupName === this.insertForm.groupName) {
        callback()
      }
      value = encodeURI(value)
      isGroupNameExists(value).then(res => {
        let code = res.code
        if (code === '00000') {
          if (res.data === true) {
            callback(new Error('该设备组名称已存在！'))
          } else {
            callback()
          }
        }
      })
    }
    return {
      orgTree: [],
      dialogVisible: false,
      title: '新建设备组',
      deviceGroup: [],
      devices: [],
      udevices: [],
      sels: [],
      groupId: '',
      orgGroupName: '',
      defaultProps: {
        orgId: 'uuid',
        children: 'children',
        label: 'name'
      },
      insertForm: {
        groupId: '',
        groupName: '',
        groupRemark: ''
      },
      formDevice: {
        deviceName: '',
        deviceID: ''
      },
      selectType: 'deviceName',
      adevices: [],
      selectDevices: [],
      rDevices: [],
      rules: {
        groupName: [
          { required: true, message: '请填写设备组名称', trigger: 'change' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'change' },
          { validator: isExist, trigger: 'blur' }
        ],
        groupRemark: [
          { max: 30, message: '最长不能超过30字符', trigger: 'change' }
        ]
      },
      groupDeviceLoading: false, // 查询设备组内设备loading
      orgDeviceLoading: false, // 根据组织ID查询设备列表loading
      treeFilterText: '' // 组织树过滤关键字
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    // 加载数据
    loadData () {
      let _this = this
      listDeviceGroup()
      .then(res => {
        let code = res.code
        if (code === '00000') {
          _this.deviceGroup = res.data
        } else {
          _this.$message.error(res.data.message)
        }
      })
    },

    // 新建设备组
    handleAddGroup () {
      let _this = this
      _this.title = '新建设备组'
      _this.adevices = []
      _this.orgGroupName = ''
      _this.insertForm.groupName = ''
      _this.insertForm.groupRemark = ''
      _this.dialogVisible = true
      _this.udevices = []
      _this.formDevice.deviceName = ''
      _this.formDevice.deviceID = ''
      loadOrgTree()
      .then(res => {
        let code = res.code
        if (code === '00000') {
          _this.orgTree = res.data
        } else {
          _this.$message({
            type: 'warning',
            message: '加载组织树异常:' + res.message
          })
        }
      })
    },

    // 保存设备组
    handleSaveGroup () {
      let _this = this
      _this.$refs.insertForm.validate((valid) => {
        if (valid) {
          if (_this.title === '新建设备组') {
            insertDeviceGroup({
              groupName: _this.insertForm.groupName,
              groupRemark: _this.insertForm.groupRemark,
              deviceList: _this.adevices
            }).then(res => {
              let code = res.code
              if (code === '00000') {
                this.resetForm()
                _this.$message({
                  type: 'success',
                  message: '新建设备组成功！'
                })
                _this.dialogVisible = false
                _this.loadData()
              } else {
                _this.$message({
                  type: 'error',
                  message: '新建设备组失败，错误码:' + res.message
                })
              }
            })
          } else {
            console.log('子设备列表为：' + JSON.stringify(_this.adevices))
            updateDeviceGroup({
              groupId: _this.insertForm.groupId,
              groupName: _this.insertForm.groupName,
              groupRemark: _this.insertForm.groupRemark,
              deviceList: _this.adevices
            }).then(res => {
              let code = res.code
              if (code === '00000') {
                this.resetForm()
                _this.$message({
                  type: 'success',
                  message: '修改设备组成功！'
                })
                _this.dialogVisible = false
                _this.loadData()
                // 重新加载组内设备
                listDevicesByGroupId(_this.groupId)
                .then(res => {
                  let code = res.code
                  if (code === '00000') {
                    _this.devices = res.data
                  } else {
                    _this.$message({
                      type: 'warning',
                      message: '加载组内设备异常:' + res.message
                    })
                  }
                })
              } else {
                _this.$message({
                  type: 'error',
                  message: '修改设备组失败:' + res.message
                })
              }
            })
          }
        }
      })
    },

    // 修改设备组
    handleEdit (index, row) {
      let _this = this
      _this.title = '修改设备组'
      _this.dialogVisible = true
      _this.orgGroupName = row.groupName
      _this.insertForm.groupId = row.uuid
      _this.insertForm.groupName = row.groupName
      _this.insertForm.groupRemark = row.remark
      _this.udevices = []
      _this.formDevice.deviceName = ''
      _this.formDevice.deviceID = ''
      loadOrgTree()
      .then(res => {
        let code = res.code
        if (code === '00000') {
          _this.orgTree = res.data
        } else {
          _this.$message({
            type: 'error',
            message: '加载组织树异常:' + res.message
          })
        }
      })
      listDevicesByGroupId(row.uuid)
      .then(res => {
        let code = res.code
        if (code === '00000') {
          this.adevices = res.data
        } else {
          _this.$message({
            type: 'error',
            message: '加载组内所有设备异常:' + res.message
          })
        }
      }
      )
    },

    // 单击设备组显示组内所有设备
    handleShowEquips (row) {
      this.groupDeviceLoading = true
      this.groupId = row.uuid
      let _this = this
      listDevicesByGroupId(row.uuid)
      .then(res => {
        let code = res.code
        if (code === '00000') {
          _this.devices = res.data
        } else {
          _this.$message({
            type: 'warning',
            message: '加载组内设备异常:' + res.message
          })
        }
        _this.groupDeviceLoading = false
      }).catch(err => {
        _this.groupDeviceLoading = false
        console.error('----->查询组内设备异常err=' + JSON.stringify(err))
      })
    },

    // 根据单元获取设备列表
    getuDeviceList (node) {
      let _this = this
      _this.orgDeviceLoading = true
      listDevicesByOrgId(node.uuid)
      .then(res => {
        let code = res.code
        if (code === '00000') {
          _this.udevices = res.data
        } else {
          _this.$message({
            type: 'warning',
            message: '获取该单元设备异常:' + res.message
          })
        }
        _this.orgDeviceLoading = false
      })
      .then(() => {
        let arr = []
        for (let device of _this.adevices) {
          arr.push(device.deviceID)
        }
        for (let i in _this.udevices) {
          if (arr.indexOf(_this.udevices[i].deviceID) !== -1) {
            setTimeout(() => { _this.$refs.multipleTable.toggleRowSelection(_this.udevices[i]) }, 200)
          }
        }
      }).catch(err => {
        _this.orgDeviceLoading = false
        console.error('----->根据组织ID查询设备列表异常err=' + JSON.stringify(err))
      })
    },

    // 删除设备组
    removeEquipGroupById (index, row) {
      let _this = this
      _this.$confirm('确定要删除名为：' + row.groupName + ' 的设备组吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDeviceGroupById(row.uuid)
        .then(res => {
          let code = res.code
          if (code === '00000') {
            _this.$message({
              type: 'success',
              message: '删除成功！'
            })
            _this.loadData()
            _this.devices = []
          } else {
            _this.$message({
              type: 'warning',
              message: '删除失败:' + res.message
            })
          }
        })
        .catch(
        )
      })
    },

    // 删除组内设备
    removeDevices () {
      let _this = this
      let deleteId = []
      for (let sel of _this.sels) {
        deleteId.push(sel.deviceID)
      }
      if (deleteId.length === _this.devices.length) {
        _this.$message({
          type: 'warning',
          message: '不允许删除组内所有设备'
        })
        return
      }
      _this.$confirm('确定要删除所选设备吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDeleteDevices(_this.groupId, deleteId)
        .then(res => {
          let code = res.code
          if (code === '00000') {
            _this.$message({
              type: 'success',
              message: '删除成功！'
            })
            // 重新加载组内设备
            listDevicesByGroupId(_this.groupId)
            .then(res => {
              let code = res.code
              if (code === '00000') {
                _this.devices = res.data
              } else {
                _this.$message({
                  type: 'warning',
                  message: '加载组内设备异常:' + res.message
                })
              }
            })
          } else {
            _this.$message({
              type: 'warning',
              message: '删除失败:' + res.message
            })
          }
        }
        )
      })
    },

   // 选中项改变时执行
    selsChange (sels) {
      this.sels = sels
    },

    // 组内设备选中项变化时
    devicesChange (sels) {
      this.selectDevices = sels
    },

    // 添加设备
    handleAddDevices () {
      this.adevices = this.adevices.concat(this.selectDevices)
      let hash = {}
      this.adevices = this.adevices.reduce((item, next) => {
        if (!hash[next.deviceID]) {
          hash[next.deviceID] = true
          item.push(next)
        }
        return item
      }, [])
    },

    // 已选设备选中项变化时
    removeDevicesChange (sels) {
      this.rDevices = sels
    },

    // 移除选中设备
    handleRemoveDevices () {
      this.adevices = this.adevices.filter(item => { return this.rDevices.every(data => data.deviceID !== item.deviceID) })
    },

    // 查询设备
    searchDevice () {
      if (this.formDevice.deviceName || this.formDevice.deviceID) {
        for (let i in this.udevices) {
          if (this.formDevice.deviceName && !this.formDevice.deviceID) {
            if (this.udevices[i]['deviceName'].indexOf(this.formDevice.deviceName) > -1) {
              let selection = this.udevices.splice(i, 1)
              this.udevices.unshift(selection[0])
            }
          } else if (!this.formDevice.deviceName && this.formDevice.deviceID) {
            if (this.udevices[i]['deviceID'].indexOf(this.formDevice.deviceID) > -1) {
              let selection = this.udevices.splice(i, 1)
              this.udevices.unshift(selection[0])
            }
          } else {
            if (this.udevices[i]['deviceName'].indexOf(this.formDevice.deviceName) > -1 && this.udevices[i]['deviceID'].indexOf(this.formDevice.deviceID) > -1) {
              let selection = this.udevices.splice(i, 1)
              this.udevices.unshift(selection[0])
            }
          }
        }
      }
    },

    // 重置表单
    resetForm () {
      this.$refs.insertForm.resetFields()
    },

    // 关闭dialog前重置表单
    closeDialog (done) {
      done()
      this.resetForm()
    },
    // 组织树过滤
    filterTreeNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
  },
  watch: {
    // 组织树过滤关键字
    treeFilterText (val) {
      this.$refs.orgTree.filter(val)
    }
  }
}
</script>

<style scoped>
  .groupInput {
    text-align:center;
    font-size:16px;
    height:40px;
    line-height:40px;
    padding-left: 60px;
  } 
  .tree-aside {
    max-height: 630px;
    overflow-x: auto;
    overflow-y: auto;
  }
  .el-tree {
    height: 100%
  }
  .col-height {
    height: 60px;
    margin-bottom: -10px;
  }
</style>

<style lang="less">
  .dialog-padding {
    .el-dialog__body {
      padding: 10px
    }
    .table-format {
      .el-table__header-wrapper{
        .el-table__header{
          width:auto!important;
        }
      }
    }
  }
</style>

