<template>
  <div class = "ui-common">
    <div>
      <!-- 资源类别 -->
      <el-form align="left" :inline="true">
          <el-form-item label="资源类别">
              <el-select v-model="appResource" @visible-change='getResourceTypeList' placeholder="请选择资源类别">
                  <el-option v-for="appResourceOpt in resourceList" :key="appResourceOpt.itemCode" :label="appResourceOpt.itemName" :value="appResourceOpt.itemCode"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="　　设备类型">
              <el-select v-model="device" @visible-change='getDeviceList' placeholder="请选择设备类型">
                  <el-option v-for="deviceOpt in deviceList" :key="deviceOpt.itemCode" :label="deviceOpt.itemName" :value="deviceOpt.itemCode"> </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="　　供应商">
              <el-select v-model="provider" @visible-change='getProviders' placeholder="请选择供应商">
                  <el-option v-for="providerOpt in providerList" :key="providerOpt.itemCode" :label="providerOpt.itemName" :value="providerOpt.itemCode"> </el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="action-btn" type="primary" @click="handleSearch" style="margin-left:20px;">搜索</el-button>
          </el-form-item>
       </el-form>
    </div>

    <!-- 组织树 -->
    <!-- <div style='margin-top:20px'>
      <span style="font-size:14px">组织树</span>
      <div id='orgTree'>
        <el-tree
          :data="treeData"
          :props="treeProps"
          show-checkbox 
          node-key="id"
          highlight-current
          style="margin-top:10px; border:solid 1px lightgray; padding-top: 10px; padding-bottom: 10px"
          :default-expand-all="false"
          @check-change="handleCheckChange"
          >
        </el-tree>
      </div>
    </div> -->

      <!-- 设备清单 -->
      <div v-show="showGrid">
        <el-table
          ref="multipleTable"
          :data="tableData"
          @selection-change="handleSelectionChange">
          <el-table-column
            label="选择"
            type="selection">
          </el-table-column>
          <el-table-column        
            v-for="(item, index) in params"
            :label="item.title"
            :prop="item.prop"
            :key="index">
          </el-table-column>
        </el-table>
        <el-pagination layout="total, sizes, prev, pager, next, jumper" 
                      :total="total"
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :page-sizes="[5,10,20]"
                      :page-size="pageSize"
                      :current-page="currentPage"
                      style="margin-top:10px">
        </el-pagination>

        <!-- 操作类型清单 -->
         <el-row style="margin-top:20px" >
          <el-col>
            <el-form align="left" :inline="true">
              <el-form-item label="添加操作类型">
                <el-select v-model="actionSelectedType" placeholder="请选择设备资源的操作类型" multiple style="width: 240px;">
                  <el-option v-for="action in tableDataHandleType" :key="action.itemCode" :label="action.itemName" :value="action.itemCode"> </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <!-- 操作 -->
        <el-row align="center">
          <el-col align="center">
          <span class="dialog-footer">
            <el-button class='cancel-btn' @click='cancelEvent' type='primary'>取消</el-button>
            <el-button class='action-btn' @click='handleSave' type='primary'>保存</el-button>
          </span>
          </el-col>
        </el-row>
      </div>
    </div>
</template>

<script>
import {
  getResourceTypeOptions,
  getActionTypeOptions,
  getProviderList,
  getDeviceList,
  getDeviceListPage
} from '@/views/UserMgmt/userManagement/apis'

export default {
  props: {
    form: {
      roleName: undefined,
      remark: undefined,
      uuid: undefined
    }
  },
  data () {
    return {
      appResourceList: undefined,
      appResource: '',
      resourceList: undefined,
      deviceList: undefined,
      device: '',
      providerList: undefined,
      provider: '',
      operationType: undefined,
      checkList: [],
      items: [],
      operationCheckList: undefined,
      treeData: undefined,
      nodeData: undefined,
      showGrid: true,
      tabPlaceholder: undefined,
      selectedName: null,
      tableData: undefined,
      tableDataHandleType: undefined,
      actionSelectedType: undefined,
      deviceCount: undefined,
      roleServiceList: undefined,
      defaultAppResourceCode: '',
      total: 0,
      currentPage: 1,
      pageSize: 5,
      providerVal: '5',
      treeProps: {
        label: 'label',
        children: 'children'
      },
      dictData: {
        resourceTypeDict: 'COURT_RESC_TYPE',
        actionType: 'COURT_ACT_TYPE'
      },
      listParam: {
        currentPage: '1',
        pageSize: '5',
        roleDeviceQueryRequestVo: {
          resourceType: '',
          deviceType: '',
          providerCode: '',
          roleUuid: this.form.uuid
        }
      },
      emptyProviderData: {
        itemCode: '',
        itemItem: ''
      },
      emptydeviceTypeData: {
        itemCode: '',
        itemItem: ''
      },
      paramsType: [
        {
          title: '操作类型',
          prop: 'itemName'
        }
      ],
      params: [
        {
          title: '设备资源名称',
          prop: 'resourceName'
        },
        {
          title: '设备类型',
          prop: 'deviceTypeName'
        },
        {
          title: '供应商',
          prop: 'providerCodeName'
        }
        // ,
        // {
        //   title: '安装位置',
        //   prop: 'location'
        // }
      ]
    }
  },
  mounted () {
    this.loadData()
    this.appResource = '4'
  },
  methods: {
    loadData () {
      this.getResourceTypeList()
      this.getDeviceList()
      this.getProviders()
      this.getActionTypeOptionsList()
    },
    // 资源类型
    getResourceTypeList () {
      // 设备组，设备筛选
      var filterArray = []
      getResourceTypeOptions(this.dictData)
        .then(
          function (result) {
            for (var i = 0; i < result.length; i++) {
              var tmp = result[i]
              if (tmp['itemCode'].toString() === '4' || tmp['itemCode'].toString() === '5') {
                filterArray.push(tmp)
              }
            }
            this.resourceList = filterArray
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error)
        })
    },
    // 操作类型
    getActionTypeOptionsList () {
      getActionTypeOptions(this.dictData)
        .then(
          function (result) {
            this.tableDataHandleType = result
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error)
        })
    },
    getDeviceList () {
      getDeviceList()
        .then(
          function (result) {
            this.deviceList = result
            result.unshift(this.emptydeviceTypeData)
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error)
        })
    },
    getProviders () {
      getProviderList(this.providerVal)
        .then(
          function (result) {
            this.providerList = result
            result.unshift(this.emptyProviderData)
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error)
        })
    },
    // 保存数据
    handleSave (data) {
      var savedata = {
        actionTypeList: [],
        resourceUuidList: [],
        roleUuid: this.form.uuid
      }
      this.items = []

      // 保存选择的设备
      if (this.multipleSelection && (this.multipleSelection.length > 0)) {
        for (let index = 0; index < this.multipleSelection.length; index++) {
          var node = this.multipleSelection[index]
          this.items.push(node.uuid.toString())
        }
      } else {
        if (this.appResource === '4') {
          this.$msgbox({
            title: '消息',
            message: '请选择至少一个设备组'}
          )
        } else {
          this.$msgbox({
            title: '消息',
            message: '请选择至少一个指定设备'}
          )
        }
        return
      }
      // 保存所选择的操作权限
      savedata.actionTypeList = this.actionSelectedType
      savedata.resourceUuidList = this.items
      this.$emit('createDeviceAuthorityEvent', savedata)
    },
    handleClick (row) {
      console.log(row)
    },
    handleSearch () {
      // 搜索
      this.listParam.roleDeviceQueryRequestVo.uuid = this.form.uuid
      this.listParam.roleDeviceQueryRequestVo.roleUuid = this.form.uuid
      this.listParam.roleDeviceQueryRequestVo.resourceType = this.appResource
      this.listParam.roleDeviceQueryRequestVo.deviceType = this.device
      this.listParam.roleDeviceQueryRequestVo.providerCode = this.provider
      this.listParam.pageSize = this.pageSize
      this.listParam.currentPage = this.currentPage
      getDeviceListPage(this.listParam)
        .then(
          function (result) {
            this.tableData = result.resourceVoList
            this.total = result.total
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error)
        })
    },
    // 改变分页大小
    handleSizeChange (val) {
      this.pageSize = val
      this.listParam.pageSize = this.pageSize
      this.listParam.currentPage = this.currentPage
      this.handleSearch()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.currentPage = val
      this.listParam.pageSize = this.pageSize
      this.listParam.currentPage = this.currentPage
      this.handleSearch()
    },
    cancelEvent () {
      this.$emit('canelDialogEvent')
    },
    handleTypeSelectionChange (val) {
      this.multipleTableHandleType = val
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCheckChange (data, checked, indeterminate) {
      if (checked) {
        this.nodeData = data
      }
    },
    handleCheckedChange (value) {
      this.operationType = value
    },
    refresh () {
      this.handleSearch()
      this.actionSelectedType = []
    },
    reset () {
      this.appResource = '4'
      this.device = ''
      this.provider = ''
      this.total = 0
      this.pageSize = 5
      if (this.tableData.length > 0) {
        this.tableData = []
      }
      this.actionSelectedType = []
    }
  },
  created: function () {
    this.loadData()
  }
}
</script>

<style scoped>
#multipleTableHandleType {
  overflow: auto;
  max-height: 250px;  
}
.el-select{
  width: 150px;
}
#typeTable {
    width: 200px
  }
</style>