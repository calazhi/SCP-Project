<template>
  <div class='ui-common'>
    <div class="flex-c flex-1">
    <el-form :inline="true" :model="listQuery" ref="listQuery" class="demo-form-inline">
      <div class="search-container">
        <el-form-item label="资源类别">
          <el-select v-model="listQuery.q_resourceType" placeholder="请选择" @change="changeResourceType" class="user_el-select">
            <el-option v-for="resourceType in resourceTypeOptions" :key="resourceType.itemCode" :label="resourceType.itemName" :value="resourceType.itemCode"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showQueryApp">
          <span class="sub-title" style="margin-left:24px">{{appLabelTitle}}&nbsp;&nbsp;</span>
          <el-select v-model="listQuery.q_appCode" placeholder="请选择应用" class="user_el-select">
            <el-option v-for="appCodeType in appCodeOptions" :key="appCodeType.appCode" :label="appCodeType.resourceName" :value="appCodeType.appCode"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showQueryParm">
          <span class="sub-title" style="margin-left:24px">{{labelTitle}}&nbsp;&nbsp;</span>
          <el-input @keyup.enter.native="handleFilter" class="user_el-input" placeholder="请输入内容" v-model="listQuery.q_resourceName"> </el-input>
        </el-form-item>
        <div class="btn-container">
          <el-form-item>
            <el-button @click="resetForm('listQuery')" type="primary" class="cancel-btn">清空</el-button>
            <el-button class="action-btn" type="primary" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </div>
      </div>
      <div>
        <el-button icon="el-icon-circle-plus-outline" style="margin-center: 10px"  @click="handleCreate" plain type="primary">添加</el-button>
      </div>
    </el-form>
    <div class="border-divide"></div>
    <div class="table-container">
      <resource-list :tableData="resourceList" :params="resourceListParam" style="margin-top: 15px" 
        @listenDeleteEvent="resourceDeleteEvent" @listenEditEvent="resourceEditEvent">
      </resource-list>
    </div>
    
    <div>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="listQuery.page"
          :page-sizes="[10, 20, 50]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :before-close="handleClose" :close-on-click-modal="false">
      <resource-edit ref="resourceEditVue" :tableData="resourceList" :resource="resourceForm" @gridDeleteEvent="resourceDeleteEvent" @gridEditEvent="resourceSaveEvent"
      :resourceTypeSelect="resourceTypeOptions" :isAddFlag="addFlag" :actionTypeSelect="actionTypeOptions" :deviceTypeSelect="deviceTypeOptions" :providerCodeTypeSelect="providerCodeTypeOptions"
      @gridCreateEvent="resourceCreateEvent" @canelDialogEvent="handleClose" :appCodeSelect="appCodeOptions"> </resource-edit>
    </el-dialog>
    <el-dialog :title="dialogStatus" :visible.sync="dialogCreateFormVisible" :before-close="handleClose" :close-on-click-modal="false">
      <resource-create ref="resourCreateVue" @gridDeleteEvent="resourceDeleteEvent" @gridEditEvent="resourceSaveEvent"
      :resourceTypeSelect="resourceTypeOptions" :isAddFlag="addFlag" :actionTypeSelect="actionTypeOptions" :deviceTypeSelect="deviceTypeOptions" :providerCodeTypeSelect="providerCodeTypeOptions"
      @gridCreateEvent="resourceCreateEvent" @canelDialogEvent="handleClose" :appCodeSelect="appCodeOptions" :defaultResourceTypeParm="defaultResourceType"> </resource-create>
    </el-dialog>
  </div>
  </div>
</template>

<script>
import resourceList from './component/resourceList.vue'
import resourceEdit from './component/resourceEdit.vue'
import resourceCreate from './component/resourceCreate.vue'
import {
  getResourceListByPage,
  createResource,
  getResourceDetail,
  deleteResource,
  getResourceTypeOptions,
  getAppCodeOptions,
  getActionTypeOptions,
  updateResource,
  getDeviceTypeOptions,
  getProviderCodeTypeOptions
} from '@/views/UserMgmt/userManagement/apis'

export default {
  data () {
    return {
      resourceList: [],
      resourceListParam: undefined,
      total: 0,
      dialogFormVisible: false,
      dialogCreateFormVisible: false,
      dialogStatus: undefined,
      defaultResourceType: undefined,
      resourceForm: {
        resourceType: '',       // 资源类别
        resourceName: '',       // 资源名称
        resourceUrl: '',        // 资源URL
        appCode: '',            // 程序代码
        serviceId: '',          // 服务代码
        menuCode: '',           // 菜单
        parentResourceUuid: '', // 上级菜单主键
        parentResourceName: '', // 上级菜单名称
        parentResourceCode: '', // 上级菜单代码
        deviceCode: '',         // 设备代码
        deviceType: '',         // 设备类型
        providerCode: '',       // 供应商
        houseOrgCode: '',       // 设备组织 (位置)
        logicalAddress: '',     // 逻辑地址 (IP地址)
        uuid: '',               // 表主键
        button: false,
        icon: undefined,
        sort: undefined,
        parentResource: {
          uuid: '',
          resourceName: '',
          menuCode: ''
        },
        houseOrgCodeList: []
      },
      dictData: {
        resourceTypeDict: 'COURT_RESC_TYPE',
        actionType: 'COURT_ACT_TYPE'
      },
      listQuery: {
        page: 1,
        limit: 10,
        q_resourceType: '2',
        q_resourceName: '',
        q_logicalAddress: '',
        q_appCode: ''
      },
      formLabelWidth: '120px',
      resourceTypeOptions: undefined,
      appCodeOptions: undefined,
      deviceTypeOptions: undefined,
      providerCodeTypeOptions: undefined,
      actionTypeOptions: undefined,
      addFlag: false,
      menuListParm: undefined,
      appCodeListParm: undefined,
      serviceListParm: undefined,
      deviceGroupListParm: undefined,
      deviceListParm: undefined,
      labelTitle: undefined,
      appLabelTitle: undefined,
      showQueryParm: true,
      showQueryApp: true
    }
  },
  components: {
    resourceList,
    resourceEdit,
    resourceCreate
  },
  mounted () {
    this.loadData()
    this.initListParm()
    this.loadSelectData()
    this.labelTitle = '菜单名称'
    this.appLabelTitle = '所属应用'
  },
  methods: {
    initListParm () {
      this.menuListParm = [{
        title: '所属应用',
        prop: 'appName',
        width: 180
      }, {
        title: '菜单名称',
        prop: 'resourceName',
        width: 210
      }, {
        title: '菜单代码',
        prop: 'menuCode',
        width: 270
      }, {
        title: 'URI',
        prop: 'resourceUrl',
        width: 250
      }, {
        title: 'ICON',
        prop: 'icon',
        width: 110
      }, {
        title: '类型',
        prop: 'button',
        width: 77
      }, {
        title: '排序',
        prop: 'sort',
        width: 77
      }, {
        title: '已授权角色',
        prop: 'roleNames',
        width: 380
      }]

      this.appCodeListParm = [{
        title: '应用名称',
        prop: 'appName'
      }, {
        title: '应用代码',
        prop: 'appCode'
      }, {
        title: '排序',
        prop: 'sort'
      }, {
        title: '已授权角色',
        prop: 'roleNames'
      }]

      this.serviceListParm = [
        {
          title: '所属应用',
          prop: 'appName'
        }, {
          title: '服务名称',
          prop: 'resourceName'
        }, {
          title: '服务URI',
          prop: 'resourceUrl'
        }, {
          title: '已授权角色',
          prop: 'roleNames'
        }]

      this.deviceGroupListParm = [{
        title: '设备组名称',
        prop: 'resourceName'
      }, {
        title: '设备类型',
        prop: 'deviceTypeName'
      }, {
        title: '供应商',
        prop: 'providerCodeName'
      }, {
        title: '已授权角色',
        prop: 'roleNames'
      }]

      this.deviceListParm = [{
        title: '设备名称',
        prop: 'resourceName'
      }, {
        title: '设备代码',
        prop: 'deviceCode'
      }, {
        title: '逻辑地址',
        prop: 'logicalAddress'
      }, {
        title: '已授权角色',
        prop: 'roleNames'
      }]
      this.resourceListParam = this.menuListParm
    },
    // 加载数据
    loadData () {
      getResourceListByPage(this.listQuery)
        .then(
          function (result) {
            let buttonName = ''
            for (let i = 0; i < result.resource.length; i++) {
              buttonName = result.resource[i].button
              if (buttonName === false) {
                result.resource[i].button = '菜单'
              } else {
                result.resource[i].button = '按钮'
              }
            }
            this.resourceList = result.resource
            this.total = result.pageCount
          }.bind(this)
        )
        .catch(
          function (error) {
            console.log(error)
          }
        )
      // 获取应用程序下拉框信息
      getAppCodeOptions()
        .then(
            function (result) {
              this.appCodeOptions = result
            }.bind(this)
          )
        .catch(
          function (error) {
            console.log(error)
          }
        )
    },
    loadSelectData () {
      // 获取操作类型字典项
      getActionTypeOptions(this.dictData)
        .then(
            function (result) {
              this.actionTypeOptions = result
            }.bind(this)
          )
        .catch(
          function (error) {
            console.log(error)
          }
        )
      // 获取资源类型下拉框信息
      getResourceTypeOptions(this.dictData)
        .then(
            function (result) {
              this.resourceTypeOptions = result
            }.bind(this)
          )
        .catch(
          function (error) {
            console.log(error)
          }
        )
      // 获取设备类型下拉框信息
      getDeviceTypeOptions(this.dictData)
        .then(
            function (result) {
              this.deviceTypeOptions = result
            }.bind(this)
          )
        .catch(
          function (error) {
            console.log(error)
          }
        )
      // 获取设备供应商下拉框信息
      getProviderCodeTypeOptions()
        .then(
            function (result) {
              this.providerCodeTypeOptions = result
            }.bind(this)
          )
        .catch(
          function (error) {
            console.log(error)
          }
        )
    },
    // 初始新增资源信息
    initResourceInfo () {
      this.resourceForm = {
        resourceType: undefined,       // 资源类别
        resourceName: undefined,       // 资源名称
        resourceUrl: undefined,        // 资源URL
        appCode: undefined,            // 程序代码
        serviceId: undefined,          // 服务代码
        menuCode: undefined,           // 菜单
        deviceCode: undefined,         // 设备代码
        deviceType: undefined,         // 设备类型
        providerCode: undefined,       // 供应商
        houseOrgCode: undefined,      // 设备组织(位置)
        logicalAddress: undefined,     // 逻辑地址(IP地址)
        uuid: undefined                 // 表主键
      }
    },
    // 重置搜选宽内容
    resetForm: function () {
      this.listQuery = {
        'page': 1,
        'limit': 10,
        'q_resourceType': '2',
        'q_resourceName': '',
        'q_logicalAddress': '',
        'q_appCode': ''
      }
      this.handleFilter()
    },
    // 改变分页大小
    handleSizeChange (val) {
      this.listQuery.page = 1
      this.listQuery.limit = val
      this.loadData()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.loadData()
    },
    handleFilter () {
      if (this.listQuery.q_resourceType === '1') {
        this.showQueryParm = false
        this.showQueryApp = true
        this.resourceListParam = this.appCodeListParm
        this.listQuery.q_resourceName = ''
        this.appLabelTitle = '应用名称'
      } else if (this.listQuery.q_resourceType === '2') {
        this.labelTitle = '菜单名称'
        this.appLabelTitle = '所属应用'
        this.showQueryParm = true
        this.showQueryApp = true
        this.resourceListParam = this.menuListParm
      } else if (this.listQuery.q_resourceType === '3') {
        this.labelTitle = '服务名称'
        this.appLabelTitle = '所属应用'
        this.showQueryParm = true
        this.showQueryApp = true
        this.resourceListParam = this.serviceListParm
      } else if (this.listQuery.q_resourceType === '4') {
        this.labelTitle = '设备组名称'
        this.appLabelTitle = '所属应用'
        this.showQueryParm = true
        this.showQueryApp = false
        this.resourceListParam = this.deviceGroupListParm
      } else if (this.listQuery.q_resourceType === '5') {
        this.labelTitle = '设备名称'
        this.appLabelTitle = '所属应用'
        this.showQueryParm = true
        this.showQueryApp = false
        this.resourceListParam = this.deviceListParm
      }
      this.listQuery.page = 1
      this.loadData()
    },
    // 新增资源
    handleCreate () {
      this.initResourceInfo()  // 调用初始信息
      this.defaultResourceType = this.listQuery.q_resourceType
      if (this.$refs.resourCreateVue) {
        this.$refs.resourCreateVue.initCreateResource()
        this.$refs.resourCreateVue.handleChange(this.defaultResourceType)
      }
      this.dialogStatus = '添加资源'
      this.dialogFormVisible = false
      this.dialogCreateFormVisible = true
      this.addFlag = false
    },
    resourceDeleteEvent (row) {
      var dataResourse = this.resourceList[row]
      this.$confirm('确定删除此项？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delete(dataResourse.uuid, row)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除资源实体
    delete (uuid, row) {
      deleteResource(uuid)
        .then(
          function (result) {
            this.handleFilter()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }.bind(this)
        )
        .catch(
          function (error) {
            this.$message.error(error.response.data.message)
          }
        )
    },
    resourceEditEvent (data) {
      getResourceDetail(data.uuid)
        .then(
          function (result) {
            this.resourceForm = result
            if (result.parentResource) {
              this.resourceForm.parentResourceUuid = result.parentResource.uuid
              this.resourceForm.parentResourceName = result.parentResource.resourceName
              this.resourceForm.parentResourceCode = result.parentResource.menuCode
            }
            if (this.$refs.resourceEditVue) {
              this.$refs.resourceEditVue.handleChange(this.resourceForm.resourceType)
              this.$refs.resourceEditVue.setCheckNodes(result.houseOrgCodeList)
              this.$refs.resourceEditVue.initMenuTree(result.appCode)
            }
            this.dialogStatus = '编辑资源'
            this.dialogFormVisible = true
            this.dialogCreateFormVisible = false
            this.addFlag = true
          }.bind(this)
        )
        .catch(
          function (error) {
            console.log(error)
          }
        )
    },
    resourceSaveEvent (data) {
      updateResource(data)
        .then(
          function (result) {
            this.dialogFormVisible = false
            this.dialogCreateFormVisible = false
            this.handleFilter()
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
          }.bind(this)
        )
        .catch(
          function (error) {
            console.log(error)
          }
        )
    },
    // 新增资源实体
    resourceCreateEvent (data) {
      createResource(data)
        .then(
          function (result) {
            this.dialogFormVisible = false
            this.dialogCreateFormVisible = false
            this.handleFilter()
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
          }.bind(this)
        )
        .catch(
          function (error) {
            console.log(error)
          }
        )
    },
    handleClose () {
      if (this.addFlag) {
        this.$refs.resourceEditVue.changeResourceRoleVueFlag()
      }
      this.initResourceInfo()
      this.dialogFormVisible = false
      this.dialogCreateFormVisible = false
      this.handleFilter()
    },
    changeResourceType () {
      if (this.listQuery.q_resourceType === '1') {
        this.showQueryParm = false
        this.showQueryApp = true
        this.listQuery.q_resourceName = ''
        this.listQuery.q_appCode = ''
        this.appLabelTitle = '应用名称'
      } else if (this.listQuery.q_resourceType === '2') {
        this.labelTitle = '菜单名称'
        this.appLabelTitle = '所属应用'
        this.showQueryParm = true
        this.showQueryApp = true
        this.listQuery.q_appCode = ''
        this.listQuery.q_resourceName = ''
      } else if (this.listQuery.q_resourceType === '3') {
        this.labelTitle = '服务名称'
        this.appLabelTitle = '所属应用'
        this.showQueryParm = true
        this.showQueryApp = true
        this.listQuery.q_appCode = ''
        this.listQuery.q_resourceName = ''
      } else if (this.listQuery.q_resourceType === '4') {
        this.labelTitle = '设备组名称'
        this.appLabelTitle = '所属应用'
        this.showQueryParm = true
        this.showQueryApp = false
        this.listQuery.q_appCode = ''
        this.listQuery.q_resourceName = ''
      } else if (this.listQuery.q_resourceType === '5') {
        this.labelTitle = '设备名称'
        this.appLabelTitle = '所属应用'
        this.showQueryParm = true
        this.showQueryApp = false
        this.listQuery.q_appCode = ''
        this.listQuery.q_resourceName = ''
      }
    }
  }
}
</script>
<style>
  @import "assets/css/usermanagement.less"
</style>
