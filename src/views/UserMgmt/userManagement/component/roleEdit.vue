﻿<template>
  <div>
    <el-tabs v-model='subActiveName' @tab-click='handleSubTabClick'>
      <el-tab-pane label='角色概要' name='0'></el-tab-pane>
      <el-tab-pane label='关联用户组' name='1'></el-tab-pane>
      <el-tab-pane label='关联用户' name='2'></el-tab-pane>
      <el-tab-pane label='资源权限' name='3'></el-tab-pane>
    </el-tabs>
    <el-container style="margin-top:20px; text-align:center">
    <!-- Tab 角色概要 -->
    <el-form  ref='form' v-show="showSummary" label-width='80px' :model='form' :rules="rules" style="margin: 0 auto">
      <el-form-item label='用户类型' prop='userType' >
        <el-select 
        v-model='form.userType' 
        placeholder='请选择用户类型' 
        style="width:650px"
        disabled
        >
          <el-option
            v-for='item in userTypeList'
            :key='item.itemCode'
            :label='item.itemName'
            :value='item.itemCode'
            :disabled="true">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='角色名称' prop='roleName' class='is-required'>
        <el-input type="text" v-model='form.roleName' placeholder='请输入角色名称'></el-input>
      </el-form-item>
      <!-- 角色说明 -->
      <el-form-item label='角色说明' prop='remark' style=" display: block">
        <el-input type="textarea" v-model='form.remark' placeholder='请输入角色说明' rows="3" style="width:650px"></el-input>
      </el-form-item>
      <div style="text-align:center">
      <el-button class='cancel-btn' type='primary' @click="handleCancel('form')">取消</el-button>
      <el-button class='action-btn' style='margin-left: 10px' @click="handleSave('form')" type='primary'>保存</el-button>
      </div>
    </el-form>
    </el-container>

    <!-- Tab 关联用户组 -->
    <div v-show="showUserGroup">
      <span style="font-size:14px">添加关联用户组</span>
      <el-select filterable placeholder="请选择需要添加的关联用户组" @visible-change='getRoleUserGroupList' @change='userGroupBoxSelected' style='margin-left: 30px; width: 230px'>
        <el-option
          v-for='(item, index) in roleUserGroupList'
          :key='index'
          :label='item.usergroupName'
          :value='item.uuid'
          :userGroupId='item.uuid'>
        </el-option>
      </el-select>
      <grid-list id='usergroupTable'
        @listenToDeleteEvent='userGroupDeleteEvent' 
        :tableData='roleUsergroupData.roleUsergroupVoList' 
        :params='userGroupParams' 
        :editable='false' 
        :deletable='true'
        :showOperation='true'
        style='margin-top: 20px; height: 100%'
      ></grid-list>
      <el-pagination
        @size-change="handleUserGroupSizeChange"
        @current-change="handleUserGroupCurrentChange"
        :page-sizes="[5, 10, 15]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="roleUsergroupData.pageCount"
        style="margin-top:15px; margin-bottom:20px">
      </el-pagination>
    </div>
    <!-- Tab 关联用户 -->
    <div v-show="showUser">
      <span style="font-size:14px">添加关联用户</span>
      <el-select filterable @visible-change='getRoleUserList' placeholder="请选择需要添加的关联用户" @change='userBoxSelected' style='margin-left: 30px; width: 230px'>
        <el-option
          v-for='(item, index) in roleUserList'
          :key='index'
          :label='item.fullName'
          :value='item.uuid'
          :userId='item.uuid'>
        </el-option>
      </el-select>
      <grid-list id="userTable"
        @listenToDeleteEvent='userDeleteEvent' 
        :tableData='roleUserData.roleUserVoList' 
        :params='userParams' 
        :editable='false' 
        :deletable='true'
        :showOperation='true'
        style='margin-top: 20px'
      ></grid-list>
      <el-pagination
        @size-change="handleUserSizeChange"
        @current-change="handleUserCurrentChange"
        :page-sizes="[5, 10, 15]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="roleUserData.pageCount"
        style="margin-top:15px; margin-bottom:20px">
      </el-pagination>
    </div>
    <!-- Tab 资源权限 -->
    <div v-show="showResource">
      <span style="font-size:14px">已经分配给本角色的资源权限</span>
      <el-button-group style="margin-left:20px">
        <el-button type="info" plain  size="small" @click="handleAddApp">添加应用程序资源权限</el-button>
        <el-button type="info" plain  size="small" @click="handleAddService">添加服务权限</el-button>
        <el-button type="info" plain  size="small" @click="handleAddDevice">添加设备资源权限</el-button>
        <!-- <el-button type="info" plain  size="small" @click="handleAddRegionalData">添加区域数据权限</el-button> -->
      </el-button-group>
      <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible">
        <add-app ref="addapp" v-show="showApp" :form="form" @createAppAuthorityEvent="createAppEvent" @canelDialogEvent="cancelEvent"
        ></add-app>
        <add-service ref="addservice" v-show="showService" :form="form" @createServiceAuthorityEvent="createServiceEvent" @canelDialogEvent="cancelEvent"
        ></add-service>
        <add-device ref="adddevice" v-show="showDevice" :form="form"  @createDeviceAuthorityEvent="createDeviceEvent"  @canelDialogEvent="cancelEvent"
        ></add-device>
        <!-- <add-regional-data ref="addregionaldata" v-show="showRegionalData" :form="form" :cloudFlag="1" @createRegionalDataAuthorityEvent="createRegionalDataEvent"  @canelDialogEvent="cancelEvent"
        ></add-regional-data> -->
      </el-dialog>
      <grid-list id="resourceTable"
        @listenToDeleteEvent='resourceDeleteEvent' 
        :tableData='roleResourceData.roleAuthResourceVoList' 
        :params='resourceParams' 
        :editable='false' 
        :deletable='true'
        :showOperation='true'
        style='margin-top: 20px'
      ></grid-list>
      <el-pagination
        @size-change="handleResourceSizeChange"
        @current-change="handleResourceCurrentChange"
        :page-sizes="[5, 10, 15]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="roleResourceData.pageCount"
        style="margin-top:15px; margin-bottom:20px">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import gridList from './gridList'
import addApp from './addApp'
import addService from './addService'
import addDevice from './addDevice'
// import addRegionalData from './addRegionalData'
import {
  updateRole,
  getRoleUserGroup,
  createRoleUserGroup,
  deleteRoleUserGroup,
  getRoleUser,
  createRoleUser,
  deleteRoleUser,
  deleteRoleResource,
  getRoleUserGroupFilter,
  getRoleUserFilter,
  updateRoleUserGroupList,
  updateRoleUserList,
  updateRoleResourceList,
  createAuthority,
  createService,
  createDevice,
  checkRoleName,
  getRoleAssResource
} from '@/views/UserMgmt/userManagement/apis'

export default {
  props: {
    roleUserData: {
      roleUserVoList: undefined,
      pageCount: undefined
    },
    roleUsergroupData: {
      roleUsergroupVoList: undefined,
      pageCount: undefined
    },
    roleResourceData: {
      roleAuthResourceVoList: undefined,
      pageCount: undefined
    },
    form: {
      roleName: undefined,
      remark: undefined,
      uuid: undefined,
      userType: undefined
    },
    userTypeList: undefined
  },
  components: {
    gridList,
    addApp,
    addService,
    addDevice
  },
  methods: {
    getRoleUserGroupList () {
      getRoleUserGroup(this.form.userType)
        .then(
          function (result) {
            this.tmpRoleUserGroupList = result
            getRoleUserGroupFilter(this.form.uuid)
              .then(
                function (result) {
                  this.userGroupFilterList = result.roleUsergroupVoList
                  if (result.pageCount > 0) {
                    for (var i = 0; i < this.userGroupFilterList.length; i++) {
                      this.disableUserGroup(this.userGroupFilterList[i].usergroupUuid)
                    }
                  }
                  this.roleUserGroupList = this.tmpRoleUserGroupList.filter(function (item) { return !item.isDisabled })
                }.bind(this)
              )
              .catch(function (error) {
                console.log(error)
              })
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error)
        })
    },
    disableUserGroup (usergroupUuid) {
      for (var i = 0; i < this.tmpRoleUserGroupList.length; i++) {
        if (usergroupUuid === this.tmpRoleUserGroupList[i].uuid) {
          this.tmpRoleUserGroupList[i].isDisabled = true
        }
      }
    },
    disableUser (userUuid) {
      for (var i = 0; i < this.tmpRoleUserList.length; i++) {
        if (userUuid === this.tmpRoleUserList[i].uuid) {
          this.tmpRoleUserList[i].isDisabled = true
        }
      }
    },
    getRoleUserList () {
      getRoleUser(this.form.userType)
        .then(
          function (result) {
            this.tmpRoleUserList = result
            getRoleUserFilter(this.form.uuid)
              .then(
                function (result) {
                  this.userFilterList = result.roleUserVoList
                  if (result.pageCount > 0) {
                    for (var i = 0; i < this.userFilterList.length; i++) {
                      this.disableUser(this.userFilterList[i].userUuid)
                    }
                  }
                  this.roleUserList = this.tmpRoleUserList.filter(function (item) { return !item.isDisabled })
                }.bind(this)
              )
              .catch(function (error) {
                console.log(error)
              })
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error)
        })
    },
    userGroupBoxSelected (data) {
      this.postRoleUserGroup.usergroupUuid = data
      this.postRoleUserGroup.roleUuid = this.form.uuid
      this.postRoleUserGroup = JSON.stringify(this.postRoleUserGroup)
      this.postRoleUserGroup = JSON.parse(this.postRoleUserGroup)
      createRoleUserGroup(this.postRoleUserGroup)
        .then(
          function (result) {
            this.query.roleId = this.postRoleUserGroup.roleUuid
            updateRoleUserGroupList(this.query)
              .then(
                function (result) {
                  this.roleUsergroupData = result
                }.bind(this)
              )
              .catch(
                function (error) {
                  console.log(error)
                }
              )
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error)
        })
    },
    userBoxSelected (data) {
      this.postRoleUser.userUuid = data
      this.postRoleUser.roleUuid = this.form.uuid
      this.postRoleUser = JSON.stringify(this.postRoleUser)
      this.postRoleUser = JSON.parse(this.postRoleUser)
      createRoleUser(this.postRoleUser)
        .then(
          function (result) {
            this.query.roleId = this.postRoleUser.roleUuid
            updateRoleUserList(this.query)
              .then(
                function (result) {
                  this.roleUserData = result
                }.bind(this)
              )
              .catch(
                function (error) {
                  console.log(error)
                }
              )
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error)
        })
    },
    handleUserGroupSizeChange (val) {
      this.query.pageSize = val
      this.query.roleId = this.form.uuid
      updateRoleUserGroupList(this.query)
        .then(
          function (result) {
            this.roleUsergroupData = result
          }.bind(this)
        )
        .catch(
          function (error) {
            console.log(error)
          }
        )
    },
    // 改变当前页
    handleUserGroupCurrentChange (val) {
      this.query.currentPage = val
      this.query.roleId = this.form.uuid
      updateRoleUserGroupList(this.query)
        .then(
          function (result) {
            this.roleUsergroupData = result
          }.bind(this)
        )
        .catch(
          function (error) {
            console.log(error)
          }
        )
    },
    handleUserSizeChange (val) {
      this.query.pageSize = val
      this.query.roleId = this.form.uuid
      updateRoleUserList(this.query)
        .then(
          function (result) {
            this.roleUserData = result
          }.bind(this)
        )
        .catch(
          function (error) {
            console.log(error)
          }
        )
    },
    handleUserCurrentChange (val) {
      this.query.currentPage = val
      this.query.roleId = this.form.uuid
      updateRoleUserList(this.query)
        .then(
          function (result) {
            this.roleUserData = result
          }.bind(this)
        )
        .catch(
          function (error) {
            console.log(error)
          }
        )
    },
    handleResourceSizeChange (val) {
      this.query.pageSize = val
      this.query.roleId = this.form.uuid
      updateRoleResourceList(this.query)
        .then(
          function (result) {
            this.roleResourceData = result
          }.bind(this)
        )
        .catch(
          function (error) {
            console.log(error)
          }
        )
    },
    // 改变当前页
    handleResourceCurrentChange (val) {
      this.query.currentPage = val
      this.query.roleId = this.form.uuid
      updateRoleResourceList(this.query)
        .then(
          function (result) {
            this.roleResourceData = result
          }.bind(this)
        )
        .catch(
          function (error) {
            console.log(error)
          }
        )
    },
    handleSubTabClick (tab, event) {
      this.showSummary = tab.name === '0'
      this.showUserGroup = tab.name === '1'
      this.showUser = tab.name === '2'
      this.showResource = tab.name === '3'
    },
    userGroupDeleteEvent (data) {
      this.usergroupRoleUuid = data.usergroupRoleUuid
      deleteRoleUserGroup(this.usergroupRoleUuid)
        .then(
          function (result) {
            this.$emit('userGroupDeleteEvent', data)
            this.query.roleId = this.form.uuid
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            updateRoleUserGroupList(this.query)
              .then(
                function (result) {
                  this.roleUsergroupData = result
                }.bind(this)
              )
              .catch(
                function (error) {
                  console.log(error)
                }
              )
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error)
          this.$message.error(error.response.data.message)
        })
    },
    userDeleteEvent (data) {
      this.userRoleUuid = data.userRoleUuid
      deleteRoleUser(this.userRoleUuid)
        .then(
          function (result) {
            this.$emit('userDeleteEvent', data)
            this.query.roleId = this.form.uuid
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            updateRoleUserList(this.query)
              .then(
                function (result) {
                  this.roleUserData = result
                }.bind(this)
              )
              .catch(
                function (error) {
                  console.log(error)
                }
              )
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error)
          this.$message.error(error.response.data.message)
        })
    },
    resourceDeleteEvent (data) {
      this.authorityUuid = data.authorityUuid
      deleteRoleResource(this.authorityUuid)
        .then(
          function (result) {
            this.$emit('resourceDeleteEvent', data)
            this.query.roleId = this.form.uuid
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            updateRoleResourceList(this.query)
              .then(
                function (result) {
                  this.roleResourceData = result
                  this.$refs.addapp.refresh()
                  this.$refs.addservice.refresh()
                  this.$refs.adddevice.refresh()
                }.bind(this)
              )
              .catch(
                function (error) {
                  console.log(error)
                  this.$message.error(error.response.data.message)
                }
              )
          }.bind(this)
        )
        .catch(function (error) {
          console.log(error)
        })
    },
    handleAddApp (data) {
      this.dialogStatus = '添加' + this.form.roleName + '角色的应用程序权限'
      this.dialogFormVisible = true
      this.showApp = true
      this.showDevice = false
      this.showService = false
      if (this.$refs.addapp != null && this.$refs.addapp !== undefined) {
        this.$refs.addapp.reset()
      }
    },
    handleAddService (data) {
      this.dialogStatus = '添加' + this.form.roleName + '角色的应用服务权限'
      this.dialogFormVisible = true
      this.showApp = false
      this.showDevice = false
      this.showService = true
      if (this.$refs.addservice != null && this.$refs.addservice !== undefined) {
        this.$refs.addservice.reset()
      }
    },
    handleAddDevice (data) {
      this.dialogStatus = '添加' + this.form.roleName + '角色的设备资源权限'
      this.dialogFormVisible = true
      this.showApp = false
      this.showDevice = true
      this.showService = false
      if (this.$refs.adddevice != null && this.$refs.adddevice !== undefined) {
        this.$refs.adddevice.reset()
      }
    },
    handleSave (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.roleName = this.trim(this.form.roleName)
          updateRole(this.form)
            .then(
              function (result) {
                this.$emit('listenToEditEvent', this.form)
                this.$emit('listenToCloseEvent')
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
        }
      })
    },
    handleCancel (form) {
      this.$emit('listenToCloseEvent')
    },
    createAppEvent (data) {
      createAuthority(data)
        .then(
          function (result) {
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
            this.$refs.addapp.refresh()
            this.query.roleId = this.form.uuid
            getRoleAssResource(this.query)
              .then(
                function (result) {
                  this.roleResourceData = result
                }.bind(this)
              )
              .catch(
                function (error) {
                  console.log(error)
                }
              )
          }.bind(this)
        )
        .catch(
          function (error) {
            console.log(error)
          }
        )
      this.dialogFormVisible = false
      this.showApp = false
    },
    createServiceEvent (data) {
      createService(data)
          .then(
            function (result) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
              this.$refs.addservice.refresh()
              this.query.roleId = this.form.uuid
              getRoleAssResource(this.query)
                .then(
                  function (result) {
                    this.roleResourceData = result
                  }.bind(this)
                )
                .catch(
                  function (error) {
                    console.log(error)
                  }
                )
            }.bind(this)
          )
      this.dialogFormVisible = false
      this.showService = false
    },
    createDeviceEvent (data) {
      createDevice(data)
          .then(
            function (result) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
              this.$refs.adddevice.refresh()
              this.query.roleId = this.form.uuid
              getRoleAssResource(this.query)
                .then(
                  function (result) {
                    this.roleResourceData = result
                  }.bind(this)
                )
                .catch(
                  function (error) {
                    console.log(error)
                  }
                )
            }.bind(this)
          )
          .catch(
            function (error) {
              console.log(error)
            }
          )
      this.dialogFormVisible = false
      this.showDevice = false
    },
    cancelEvent () {
      this.dialogFormVisible = false
      this.showApp = false
      this.showService = false
      this.showDevice = false
      if (this.$refs.addapp != null && this.$refs.addapp !== undefined) {
        this.$refs.addapp.reset()
      }
      if (this.$refs.adddevice != null && this.$refs.adddevice !== undefined) {
        this.$refs.adddevice.reset()
      }
      if (this.$refs.addservice != null && this.$refs.addservice !== undefined) {
        this.$refs.addservice.reset()
      }
    },
    changeRoleEditDiaLogEvent () {
      if (this.$refs.addapp != null && this.$refs.addapp !== undefined) {
        this.$refs.addapp.reset()
      }
      if (this.$refs.adddevice != null && this.$refs.adddevice !== undefined) {
        this.$refs.adddevice.reset()
      }
      if (this.$refs.addservice != null && this.$refs.addservice !== undefined) {
        this.$refs.addservice.reset()
      }
    },
    trim (string) {
      return string.replace(/(^\s*)|(\s*$)/g, '')
    }
  },
  mounted: function () {
    this.subActiveName = 0
  },
  watch: {
    'form.uuid': function (newVal, oldVal) {
      this.subActiveName = '0'
      this.showSummary = true
      this.showUserGroup = false
      this.showUser = false
      this.showResource = false
    },
    deep: true
  },
  data () {
    // 角色名的唯一性
    var validateRoleName = (rule, value, callback) => {
      let trimmedValue = this.trim(value)
      let trimmedValueLength = trimmedValue.length
      if (trimmedValue === '') {
        callback(new Error('角色名称不能为空'))
      } else if (trimmedValueLength > 32 || trimmedValueLength < 2) {
        callback(new Error('长度在 2 到 32 个字符'))
      } else {
        let userType = this.form.userType
        let roleUuid = this.form.uuid
        checkRoleName(roleUuid, trimmedValue, userType)
        .then(
          function (result) {
            if (!result) {
              callback(new Error('角色名称已存在'))
            } else {
              callback()
            }
          }
        )
      }
    }
    return {
      rules: {
        roleName: [
          { required: true, message: '请填写角色名称', trigger: 'blur' },
          // { min: 2, max: 32, message: '长度在 2 到 32 个字符' },
          // { pattern: /^\s[a-zA-Z\s\d\u4e00-\u9fa5]+\s$/, message: '角色名只能为字母、数字、中间空格和汉字' },
          // { pattern: /^[a-zA-Z\s\d\u4e00-\u9fa5]+$/, message: '角色名只能为字母、数字、空格和汉字' },
          { validator: validateRoleName }
        ],
        remark: [
          { min: 3, max: 256, message: '长度在 3 到 256 个字符' }
        ]
      },
      userTypeList: undefined,
      roleNameFlag: true,
      showSummary: true,
      showUserGroup: false,
      showUser: false,
      showResource: false,
      roleName: undefined,
      subActiveName: '0',
      tabTitle: '角色概要',
      textMap: {
        '0': '角色概要',
        '1': '关联用户组',
        '2': '关联用户',
        '3': '资源权限'
      },
      query: {
        currentPage: 1,
        pageSize: 5,
        roleId: undefined
      },
      postRoleUserGroup: {
        roleUuid: undefined,
        usergroupUuid: undefined
      },
      postRoleUser: {
        roleUuid: undefined,
        userUuid: undefined
      },
      listUsergroupQuery: {
        courtUuid: '',
        userType: ''
      },
      selectedName: null,
      roleUserGroupList: undefined,
      tmpRoleUserGroupList: undefined,
      tmpRoleUserList: undefined,
      roleUserList: undefined,
      dialogStatus: undefined,
      dialogFormVisible: false,
      showApp: false,
      showService: false,
      showDevice: false,
      // showRegionalData: false,
      formData: undefined,
      userGroupParams: [
        {
          title: '用户组名称',
          prop: 'usergroupName'
        },
        {
          title: '直属用户',
          prop: 'dirctUsers'
        }
      ],
      userParams: [
        {
          title: '姓名',
          prop: 'fullName'
        },
        {
          title: '登录 ID',
          prop: 'userName'
        },
        {
          title: '职务',
          prop: 'position'
        },
        {
          title: '部门',
          prop: 'departmentName'
        },
        {
          title: '手机号',
          prop: 'primaryPhone'
        },
        {
          title: '身份证号码',
          prop: 'idenNum'
        }
      ],
      resourceParams: [
        {
          title: '资源类别',
          prop: 'resourceTypeName'
        },
        {
          title: '资源名称',
          prop: 'resourceName'
        },
        {
          title: 'URI',
          prop: 'resourceUrl'
        },
        {
          title: '操作类型',
          prop: 'actionTypeName'
        },
        // {
        //   title: '安装位置',
        //   prop: 'houseOrgName'
        // },
        {
          title: '逻辑地址',
          prop: 'logicalAddress'
        }
      ]
    }
  }
}
</script>

<style scoped>
  #usergroupTable >>> colgroup col:nth-child(1) {
    width: 30%;
  }
  #usergroupTable >>> colgroup col:nth-child(2) {
    width: 60%;
  }
  #usergroupTable >>> colgroup col:nth-child(3) {
    width: 10%;
  }

  #userTable >>> colgroup col:nth-child(1) {
    width: 12%
  }
  #userTable >>> colgroup col:nth-child(2) {
    width: 12%
  }
  #userTable >>> colgroup col:nth-child(3) {
    width: 15%
  }
  #userTable >>> colgroup col:nth-child(4) {
    width: 15%
  }
  #userTable >>> colgroup col:nth-child(5) {
    width: 16%
  }
  #userTable >>> colgroup col:nth-child(6) {
    width: 20%
  }
  #userTable >>> colgroup col:nth-child(7) {
    width: 10%
  }

  #resourceTable >>> colgroup col:nth-child(1) {
    width: 15%
  }
  #resourceTable >>> colgroup col:nth-child(2) {
    width: 25%
  }
  #resourceTable >>> colgroup col:nth-child(3) {
    width: 25%
  }
  #resourceTable >>> colgroup col:nth-child(4) {
    width: 10%
  }
  #resourceTable >>> colgroup col:nth-child(5) {
    width: 15%
  }
  #resourceTable >>> colgroup col:nth-child(6) {
    width: 10%
  }
  /* #resourceTable >>> colgroup col:nth-child(7) {
    width: 10%
  } */
</style>