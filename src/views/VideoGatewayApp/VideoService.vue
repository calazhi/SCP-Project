<template>
  <div>
    <div>
      <el-button type="primary" @click="onSelectAllDelete" :disabled="this.selection.length===0" title="至少勾选一条数据才能使用">批量删除</el-button>
      <el-button type="primary" @click="onAddBtn">添加</el-button>
    </div>
    <el-table class="video-service" highlight-current-row :data="serviceList" border @selection-change="onSelectChange" ref="elTable" element-loading-text="拼命加载中">
      <el-table-column align="center" type="selection" ref='selectBox'></el-table-column>
      <el-table-column align="center" prop="streamMediaName" label="设备名称"></el-table-column>
      <el-table-column align="center" prop="ip" label="IP地址"></el-table-column>
      <el-table-column align="center" prop="port" label="端口"></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="status" label="是否在线"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="onUpdateBtn(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" @click="onDeleteBtn(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="loadData" @size-change="onHandleSizeChange" :current-change="loadData" :page-sizes="[10, 20, 50]" :page-size="page.size" layout="total, sizes, prev,pager,next,jumper" background :total="page.total">
    </el-pagination>
    <el-dialog :title="dialog.isAdd?'添加流媒体服务器':'设置流媒体服务器'" :visible.sync="dialog.visible" :close-on-click-modal="false" width="36%">
      <el-form class="add-dialog-content" :model="serviceOption" ref="serviceForm" :rules="serviceRules" label-width="100px">
        <el-form-item label="所属组织" prop="orgId">
          <el-popover width="490" trigger="click" v-model="tree.visible">
            <div class="tooltip-service">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
              <el-tree :data="tree.data" node-key="uuid" show-checkbox :props="tree.props" ref="addressTree" :check-strictly="true" :filter-node-method="filterNode" :default-expanded-keys="[tree.rootKey]">
              </el-tree>
            </div>
            <el-input v-model="orgName" placeholder="请选择所属组织" :readonly="true" prefix-icon="el-icon-tickets" slot="reference"></el-input>
            <div class="tree-confirm">
              <el-button size="mini" type="text" @click="onCancelTreePop">取消</el-button>
              <el-button type="primary" size="mini" @click="onConfirmTreePop">确定</el-button>
            </div>
          </el-popover>
        </el-form-item>
        <el-form-item label="名称" prop="streamMediaName">
          <el-input v-model.trim="serviceOption.streamMediaName" clearable placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="ip" prop="ip">
          <el-input v-model="serviceOption.ip" clearable placeholder="请输入流媒体IP地址" :disabled="dialog.isAdd?false:true"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="serviceOption.port" clearable placeholder="端口"></el-input>
        </el-form-item>
        <el-form-item label="应用编码" prop="appCode">
          <el-input v-model="serviceOption.appCode" clearable placeholder="应用编码"></el-input>
        </el-form-item>
        <el-form-item label="TUTK序列号" prop="tutkUuid">
          <el-input v-model="serviceOption.tutkUuid" clearable placeholder="TUTK序列号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button v-if="dialog.isAdd" type="primary" @click="onAddConfirm">确 定</el-button>
        <el-button v-else type="primary" @click="onSetConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { serviceTypeArr, isValidIP } from '@/views/VideoGatewayApp/apis/common.js'
import { getStreamMediaData, postSetStreamMediaData, postDeleteStreamMediaData, postAddStreamMediaData, getEditStreamMediaData, getAddedOrgData } from '@/views/VideoGatewayApp/apis/videoService.js'
import { getOrganizationsData } from '@/views/VideoGatewayApp/apis/videotapePlan.js'
import { copyObject } from '../../packages/utils/util'
export default {
  name: 'videoService',
  data () {
    return {
      selection: [], // 已钩选的行
      serviceList: [], // 流媒体服务器列表
      serviceOption: this.emptyServiceOption(),
      orgName: '', // 所属组织名字
      filterText: '', // 组织树关键词过滤文本
      serviceTypeArr: serviceTypeArr,
      createTime: Math.round(new Date().getTime()),
      updateTime: Math.round(new Date().getTime()),
      orgsDisabled: [],
      curOrgsDisabled: [],
      tree: {
        rootKey: '',
        data: [],
        props: {
          children: 'children',
          label: 'name',
          isLeaf: this.isTreeLeaf,
          disabled: this.disableOrgItem
        },
        visible: false
      },
      dialog: {
        visible: false,
        isAdd: true,
        curIndex: 0
      },
      page: {
        total: 0,
        size: 20,
        curPageNo: 1
      },
      serviceRules: {  // 表单校验规则,参考element-ui的form校验规则
        orgId: [{ required: true, message: '请选择所属组织', trigger: 'change' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        streamMediaName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        ip: [
          { required: true, message: '请输入流媒体IP地址', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!isValidIP(value)) {
                callback(new Error('IP地址格式不正确'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        port: [
          { required: true, message: '请输入端口', trigger: 'blur' },
          {
            validator: (rule, val, callback) => {
              let reg = /^([1-9]\d*$|^0)$/
              if (!reg.test(val) || val < 0 || val % 1 !== 0 || val < 1 || val > 65535) {
                callback(new Error('不能为特殊字符且必须为1~65535间整数'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        appCode: [{ required: true, message: '请输入应用编码', trigger: 'blur' }],
        tutkUuid: [{ required: true, message: '请输入TUTK序列号', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.loadData(this.page.curPageNo)
    getOrganizationsData().then((rs) => {
      if (rs) {
        this.tree.rootKey = rs.uuid
        this.tree.data = [rs]
      } else {
        this.tree.data = []
      }
    })
  },
  methods: {
    loadData (pageNo) { // 获取流媒体配置
      let reqData = {
        pageNo: pageNo,
        pageSize: this.page.size
      }
      getStreamMediaData(reqData).then( // 获取流媒体列表
        result => {
          this.serviceList = result.rows
          this.page.total = result.total
          this.page.start = result.start
          this.page.end = result.end
          this.curPageNo = pageNo
          this.page.pages = result.pages
          this.serviceList.sort((a, b) => {
            return b.createTime - a.createTime
          })
          for (let i = 0; i < this.serviceList.length; i++) {
            let item = this.serviceList[i]
            item['createTime'] = this.formatDate(item['createTime'])
            item['status'] = (item.status === 0) ? '在线' : '离线'
          }
        }
      )
    },
    onSetConfirm () { // 设置流媒体确认提交
      this.$refs['serviceForm'].validate(
        (valid) => {
          if (valid) {
            this.getTreeRequestData()
            let editTime = Math.round(new Date().getTime())
            this.serviceOption.updateTime = this.formatDate(editTime)
            postSetStreamMediaData(this.serviceOption).then( // 设置流媒体
              result => {
                this.dialog.visible = false
                this.loadData(this.page.curPageNo)
                this.$message({ type: 'success', message: '修改成功' })
                this.filterText = ''
              }
            ).catch(
              () => {
                this.$message({ type: 'warning', message: '修改失败！请刷新' })
              }
              )
          } else {
            return false
          }
        }
      )
    },
    onAddConfirm () { // 添加流媒体确认提交
      this.$refs['serviceForm'].validate(
        (valid) => {
          if (valid) {
            this.getTreeRequestData()
            this.serviceOption.port = parseInt(this.serviceOption.port)
            delete this.serviceOption.uuid
            postAddStreamMediaData(this.serviceOption).then( // 添加流媒体
              result => {
                this.dialog.visible = false
                this.$message({ type: 'success', message: '添加成功' })
                this.loadData(this.curPageNo)
              }
            ).catch(
              (error) => {
                this.$message({ type: 'warning', message: error.response.data })
              }
              )
          } else {
            return false
          }
        }
      )
    },
    onAddBtn (pageNo) { // 点击添加按钮
      this.getDisableItem().then(() => {
        this.curOrgsDisabled = copyObject(this.orgsDisabled)
      })
      this.ResetForm()
      this.dialog.visible = true
      this.dialog.isAdd = true
    },
    onSelectAllDelete () { // 批量删除
      if (this.selection.length <= 0) {
        this.$alert('请选择一条或多条记录，不勾选不能删除！', '提示', {
          confirmButtonText: '确定',
          type: 'error',
          center: true,
          callback: () => { return false }
        })
      } else {
        this.$confirm('确认删除当前页所有数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          let reqData = this.selection.map(item => item.uuid)
          postDeleteStreamMediaData(reqData).then(
            result => {
              this.loadData(this.page.curPageNo)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          ).catch(
            () => { this.$message({ type: 'warning', message: '删除失败!' }) })
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          })
          this.$refs.elTable.clearSelection()
        })
      }
    },
    onSelectChange (val) { // 列表勾选变化时
      this.selection = val
    },
    onUpdateBtn (index, item) { // 点击编辑按钮
      let pro1 = this.getDisableItem().then(() => {
        this.curOrgsDisabled = copyObject(this.orgsDisabled)
      })
      this.dialog.visible = true
      this.dialog.isAdd = false
      if (this.$refs['serviceForm']) this.$refs['serviceForm'].resetFields()
      this.serviceOption = copyObject(this.serviceList[index])
      this.serviceOption.orgId = ''
      this.dialog.curIndex = index
      let reqData = {
        uuid: this.serviceOption.uuid // 向后台请求的编辑对象，主要获取uuid,发送数据
      }
      let orgList = []
      let pro2 = getEditStreamMediaData(reqData).then(// 编辑流媒体配置
        result => {
          orgList = result.streamMediaOrgDtoList || []
        }
      )
      Promise.all([pro1, pro2]).then(() => {
        let orgNameArr = []
        let orgIdArr = []
        orgList.forEach(
          item => {
            orgNameArr.push(item.orgName)
            orgIdArr.push(item.orgId)
            this.curOrgsDisabled.splice(this.curOrgsDisabled.indexOf(item.orgId), 1)
          }
        )
        this.$refs.addressTree.setCheckedKeys(orgIdArr)
        let checkedNodes = this.$refs.addressTree.getCheckedNodes()
        this.orgName = checkedNodes.map(item => item.name).join('、')
        this.serviceOption.orgId = orgIdArr
      })
    },
    onDeleteBtn (index, row) { // 点击删除按钮
      let streamMediaName = row.streamMediaName
      this.$confirm('确认删除' + streamMediaName + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let reqData = [row.uuid]
        postDeleteStreamMediaData(reqData).then(
          result => {
            this.serviceList.splice(index, 1)
            this.page.total--
            this.loadData(this.page.curPageNo)
            this.$message({ type: 'success', message: '删除成功!' })
          }
        ).catch(
          () => { this.$message({ type: 'warning', message: '删除失败!' }) })
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '已取消删除'
        })
        this.$refs.elTable.clearSelection()
      })
    },
    getServiceTypeLabel (row, column, cellValue) {
      return serviceTypeArr[cellValue]
    },
    onHandleSizeChange (val) { // 手动更改分组分页
      this.page.size = val
      this.loadData(1)
    },
    ResetForm () { // 重置表格数据
      this.orgName = ''
      this.filterText = ''
      this.serviceOption = this.emptyServiceOption()
      if (this.$refs['addressTree']) this.$refs['addressTree'].setCheckedKeys([])
      if (this.$refs['serviceForm']) this.$refs['serviceForm'].resetFields()
    },
    emptyServiceOption () {
      return { // 流媒体配置字段
        'uuid': '',
        'orgId': [],
        'streamMediaOrgList': [],
        'ip': '',
        'port': '',
        'status': '',
        'appCode': 'APP9516',
        'tutkUuid': 'MJSR4TR9AS47RBR7111A',
        'createTime': this.formatDate(this.createTime), // 创建时间戳
        'updateTime': this.formatDate(this.updateTime), // 编辑时间戳
        'streamMediaName': ''
      }
    },
    isTreeLeaf (data, node) {
      return !data.children
    },
    disableOrgItem (data, node) {
      return this.curOrgsDisabled.indexOf(data.uuid) !== -1
    },
    getDisableItem () { // 获取已经存在设备，并禁用
      let promise = getAddedOrgData().then(
        result => {
          this.orgsDisabled = result || []
        }
      )
      return promise
    },
    getTreeRequestData () { // 获取组织树
      let checkedNodes = this.$refs.addressTree.getCheckedNodes()
      let orgArr = []
      for (let i = 0; i < checkedNodes.length; i++) {
        let item = checkedNodes[i]
        orgArr.push({
          orgId: item.uuid,
          orgName: item.name
        })
      }
      this.serviceOption.streamMediaOrgList = orgArr
    },
    onConfirmTreePop () { // 树弹窗确认
      let checkedNodes = this.$refs.addressTree.getCheckedNodes()
      this.orgName = checkedNodes.map(item => item.name).join('、')
      this.serviceOption.orgId = checkedNodes.map(item => item.uuid)
      this.$set(this.tree, 'visible', false)
      this.filterText = ''
    },
    onCancelTreePop () { // 树弹窗取消
      this.$set(this.tree, 'visible', false)
    },
    serviceListSort (a, b) {
      return b.createTime - a.createTime
    },
    filterNode (value, data) { // 组织树中关键字过滤
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    formatDate (nows) { // 时间戳格式化
      let now = new Date(nows)
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      month = month < 10 ? ('0' + month) : month
      let day = now.getDate()
      day = day < 10 ? ('0' + day) : day
      let hour = now.getHours()
      hour = hour < 10 ? ('0' + hour) : hour
      let minute = now.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      let second = now.getSeconds()
      second = second < 10 ? ('0' + second) : second
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    }
  },
  watch: { // 监听过滤文本
    filterText (val) {
      this.$refs.addressTree.filter(val)
    }
  }
}
</script>
<style  lang='less'>
.tooltip-service {
  .el-tree-node > .el-tree-node__children {
    overflow: visible;
  }
}
</style>
<style  lang='less' scoped>
.add-dialog-content {
  margin: 0 20px;
}
.tree-confirm {
  text-align: right;
  margin: 8px 0px 0px 0px;
}
.el-table {
  margin-top: 30px;
  width: 100%;
}
.el-popover {
  top: 150px !important;
}
.el-pagination {
  text-align: center;
  margin-top: 20px;
}
.searchBox {
  display: inline-block;
  width: 20%;
  margin-left: 20px;
}
.tooltip-service {
  overflow: auto;
  max-height: 560px;
}
</style>