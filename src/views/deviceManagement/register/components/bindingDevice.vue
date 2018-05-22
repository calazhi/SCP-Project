<template>
  <div class="item-container">
    <div class="binding-container">
      <span class="sub-title">设备绑定:</span>
      <select-table :tableData="bindingedList" @clickBindingRowEvent="_reciveBindingData"></select-table>
      <div class="edit-container">
        <div class="edit"><el-button type="primary" @click="_queryBindingDevice">查询可绑定设备</el-button></div>
        <div class="edit"><el-button type="primary" @click="_addBindingDevice">添加</el-button></div>
        <div class="edit"><el-button type="primary" @click="_deleteBindingDevice">删除</el-button></div>
      </div>
    </div>
    <div class="add-container" v-show="isAddShow">
      <span class="sub-title">添加设备:</span>
      <select-table :tableData="selectedBindinglist" @clickBindingRowEvent="_reciveOptionData"></select-table>
      <el-button type="primary" @click="_selectOrgani" style="height: 45px; margin-left: 35px">选择其他设备-选择组织</el-button>
      <el-dialog
        class="deviceOrgDialog"
        title="查找其他设备-选择组织"
        :visible.sync="showDialog"
        :close-on-click-modal="false"
        @close="_close"
        :modal="false"
        :modal-append-to-body="true"
        width="45%">
        <org-tree @changeDialogStatus="_changeSatus" ref="orgTree"></org-tree>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import selectTable from './selectTable.vue'
  import ElButton from 'element-ui/packages/button/src/button.vue'
  import ElRow from 'element-ui/packages/row/src/row'
  import orgTree from './orgTree'
  import {getBindingDeviceList, getSelectedBindinglist, removeDeviceBinding, addDeviceBinding, getOrgList} from '../apis/index.js'

  export default {
    props: {
      title: {
        type: String
      }
    },
    data () {
      return {
        isAddShow: false,
        showDialog: false,
        bindingedList: [],
        selectedBindinglist: [],
        curSelectList: [],
        orgId: '',
        orgList: {},
        curOptionList: [],
        uuid: ''
      }
    },
    components: {
      ElRow,
      ElButton,
      selectTable,
      orgTree
    },
    methods: {
      _selectOrgani () {
        this.showDialog = true
        if (this.$refs.orgTree) {
          this.$refs.orgTree._loadALlOrgs()
        }
      },
      _queryBindingDevice () {
        this.isAddShow = true
        this.curOptionList = []
        // 主设备this.orgId请求组织list
        //  this._getOrgList(this.orgId)
        // 临时修改
        this.orgList = {'id': this.uuid, 'listOrgId': [this.orgId]}
        this._getSelectedBindinglist(this.orgList)
      },
      _changeSatus (data) {
        this.orgId = data.orgId
        this.showDialog = false
        this.curOptionList = []
        // 选择组织获得的orgId请求组织list
        // this._getOrgList(this.orgId)
        // 临时修改
        this.orgList = {'id': this.uuid, 'listOrgId': [this.orgId]}
        this._getSelectedBindinglist(this.orgList)
      },
      _getOrgList (orgId) {
        getOrgList(orgId)
          .then(
            function (result) {
              var list = []
              list.push(result.uuid)
              this.orgList = {'id': this.uuid, 'listOrgId': list}
              this._getSelectedBindinglist(this.orgList)
            }.bind(this)
          )
          .catch()
      },
      _getSelectedBindinglist (param) {
        getSelectedBindinglist(param)
          .then(
            function (result) {
              if (result) {
                this.selectedBindinglist = result
              } else {
                this.selectedBindinglist = []
              }
            }.bind(this)
          )
          .catch(
            () => {
              this.selectedBindinglist = []
            }
          )
      },
      _close () {
        this.$refs.orgTree.clear()
      },
      _reciveBindingData (selection) {
        this.curSelectList = selection
        console.log(this.curSelectList)
      },
      _reciveOptionData (selection) {
        this.curOptionList = selection
        console.log(this.curOptionList)
      },
      loadBindingDeviceList (uuid, orgId) {
        this.orgId = orgId
        this.uuid = uuid
        getBindingDeviceList(uuid)
          .then(
            function (result) {
              if (result.slaveDeviceList) {
                this.bindingedList = result.slaveDeviceList
              } else {
                this.bindingedList = []
              }
            }.bind(this)
          )
          .catch(
            () => {
              this.bindingedList = []
            }
          )
        if (this.isAddShow) {
          // this._getOrgList(this.orgId)
          // 临时修改
          this.orgList = {'id': this.uuid, 'listOrgId': [this.orgId]}
          this._getSelectedBindinglist(this.orgList)
        }
      },
      _deleteBindingDevice () {
        // 利用curSelectList删除已绑定设备
        var list = []
        this.curSelectList.forEach((value, index, array) => {
          list.push(value.deviceId)
        })
        if (list.length > 0) {
          this.$confirm('是否确定删除该绑定设备?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var param = {'id': this.uuid, 'ids': list}
            removeDeviceBinding(param)
              .then(
                function (result) {
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  })
                  // 刷新已綁定列表
                  this.loadBindingDeviceList(this.uuid, this.orgId)
                  // 刷新可綁定列表
                  this._getSelectedBindinglist(this.orgList)
                  this.curSelectList = []
                }.bind(this)
              )
              .catch(
                function () {
                  this.$message.error('删除失败')
                }.bind(this)
              )
          }).catch()
        } else {
          this.$message({
            message: '请先勾选需删除的数据',
            type: 'warning'
          })
        }
      },
      _addBindingDevice () {
        // 利用curOptionList添加新绑定设备
        var list = []
        this.curOptionList.forEach((value, index, array) => {
          list.push(value.deviceId)
        })
        if (list.length > 0) {
          var param = {'id': this.uuid, 'ids': list}
          addDeviceBinding(param)
            .then(
              function (result) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                // 刷新已綁定列表
                this.loadBindingDeviceList(this.uuid, this.orgId)
                // 刷新可綁定列表
                this._getSelectedBindinglist(this.orgList)
                this.curOptionList = []
              }.bind(this)
            )
            .catch(
              function () {
                this.$message.error('添加失败')
              }.bind(this)
            )
        } else {
          this.$message({
            message: '请先勾选需添加的数据',
            type: 'warning'
          })
        }
      }
    }
  }
</script>

