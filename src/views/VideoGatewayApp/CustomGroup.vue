<template>
  <el-container>
    <aside class="aside-box">
      <ul class="group-name-lists">
        <li v-for="(item,index) in groupNameList" :key="item.customGroupId" @click="groupItemClick(item,index)">
          <div class="group-name-edit-btn">
            <i class="el-icon-edit" @click="btnUpdate(item,index)"></i>
            <i v-if="item.groupFlag==1" class="el-icon-delete" @click="btnDelete(item,index)"></i>
          </div>
          <span class="group-name-text" :class="{'actived': index===curGroupIndex}">{{item.customGroupName}}</span>
        </li>
      </ul>
    </aside>
    <main class="el-main main-box">
      <el-button type="primary" @click="btnAdd" style="width:204px;">添加</el-button>
      <div class="camera-list-box">
        <div v-for="item in cameraList" :key="item.cameraId" class="camera-list-item">
          <i class="icon-camera"></i>
          {{item.cameraName}}
        </div>
      </div>
    </main>
    <el-dialog :title="isAdding?'添加自定义组':'修改自定义组'" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="btnHideEditBox" width="900px">
      <el-form :inline="true">
        <el-form-item label="分组名称">
          <el-input v-model="groupName" :readonly="!isAdding && editItem.groupFlag!==1" placeholder="请输入自定义分组名称" style="width:360px" :maxlength="30"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addGroup" v-if="isAdding">保存</el-button>
          <el-button type="primary" @click="updateGroup" v-if="isEditing">保存</el-button>
          <el-button type="primary" @click="btnHideEditBox">取消</el-button>
        </el-form-item>
      </el-form>
      <div class="dialog-main-contain">
        <div class="edit-box">
          <div class="tree-box">
            <el-tree show-checkbox node-key="uuid" :props="tree.props" ref="cameraTree" :default-expanded-keys="[tree.rootKey]" :render-content="renderTree" :load="getCameraByOrgId" lazy>
            </el-tree>
          </div>
          <div class="select-btn-box">
            <div>
              <el-button icon="el-icon-d-arrow-right" @click="btnInsertCamera" style="width:80px"></el-button>
            </div>
            <div>
              <el-button icon="el-icon-d-arrow-left" @click="btnRemoveSelected" style="width:80px;margin-top:90px"></el-button>
            </div>
          </div>
          <div class="selected-box">
            <el-checkbox-group v-model="checkedCamera" @change="checkedCameraChange">
              <div v-for="(item,index) in cameraOfGroup" :key="item.cameraId" class="camera-item">
                <div class="camera-item-map">
                  <el-checkbox :label="item.cameraId" class="camera-item-checkbox">
                    <i class="icon-camera-tree-video"></i>{{item.cameraName}}
                  </el-checkbox>
                </div>
                <span v-show="false" class="btn-up" @click="btnUpClick(index)">∧</span>
              </div>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
import { getGroupListData, getCameraTreeData, getCameraTreeNodeData, postGroupAddData, postGroupDeleteData, postGroupUpdateData } from './apis/customGroup.js'
import { confirmDelete } from './apis/common.js'
import { copyObject } from '../../packages/utils/util'

export default {
  name: 'customGroup',
  data () {
    return {
      groupNameList: [],
      groupName: '',
      curGroupId: '',
      curGroupIndex: -1,
      btnUpShowIndex: -1,
      checkedCamera: [], // 右边钩选的摄像头
      cameraOfGroup: [], // 组下的摄像头
      cameraList: [], //  组下的摄像头显示
      isAdding: false,
      isEditing: false,
      dialogVisible: false,
      editItem: {},
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
    this.searchGroupName()
  },
  methods: {
    confirmDelete: confirmDelete,
    // 获取所有的自定义组
    searchGroupName () {
      let reqData = { customGroupName: '' } // 组名为空,返回全部数据
      getGroupListData(reqData).then(
        result => {
          result = result || []
          result.sort((a, b) => {
            return b.groupFlag - a.groupFlag
          })
          this.groupNameList = result
          if (this.curGroupId) {
            this.focusByUuid(this.curGroupId)
          } else {
            if (this.groupNameList.length > 0) this.focusByUuid(this.groupNameList[0].customGroupId)
          }
        }
      )
    },
    // 增加自定义组
    addGroup () {
      if (!this.groupName) {
        this.$message({ type: 'warning', message: '请输入组名称' })
        return
      }
      if (this.isSameName(this.groupName)) {
        this.$message({ type: 'warning', message: '组名称已存在' })
        return
      }
      this.orderCameraOfGroup()
      let reqData = {
        customGroupId: '',
        customGroupName: this.groupName,
        videos: this.cameraOfGroup,
        groupFlag: 1
      }
      postGroupAddData(reqData).then(
        result => {
          this.searchGroupName()
          this.btnHideEditBox()
          this.$message({ type: 'success', message: '添加成功!' })
        }
      ).catch(() => {
      })
    },
    // 修改自定义组
    updateGroup () {
      if (!this.curGroupId) return
      if (!this.groupName) {
        this.$message({ type: 'warning', message: '请输入组名称' })
        return
      }
      if (this.editItem.groupFlag === 2 && this.cameraOfGroup.length > 10) {
        this.$message({ type: 'warning', message: '摄像头个数不能超过10个' })
        return
      }
      if (this.editItem.groupFlag === 3 && this.cameraOfGroup.length > 9) {
        this.$message({ type: 'warning', message: '摄像头个数不能超过9个' })
        return
      }
      this.orderCameraOfGroup()
      let reqData = {
        customGroupId: this.curGroupId,
        customGroupName: this.groupName,
        videos: this.cameraOfGroup,
        groupFlag: this.editItem.groupFlag
      }
      postGroupUpdateData(reqData).then(
        result => {
          this.searchGroupName()
          this.btnHideEditBox()
          this.$message({ type: 'success', message: '修改成功!' })
        }
      ).catch(() => {
      })
    },
    // 删除自定义组
    deleteGroup () {
      if (!this.curGroupId) return
      let reqData = { customGroupId: this.curGroupId }
      postGroupDeleteData(reqData).then(
        result => {
          this.searchGroupName()
          this.curGroupId = ''
          this.curGroupIndex = -1
          this.$message({ type: 'success', message: '删除成功!' })
        }
      ).catch(() => {
      })
    },
    // 点击组列表中的组
    groupItemClick (item, index) {
      this.curGroupId = item.customGroupId
      this.curGroupIndex = index
      if (item.videos) this.cameraList = copyObject(item.videos)
      else this.cameraList = []
      this.cameraList.sort((a, b) => a.order - b.order)
    },
    // 点击修改按钮
    btnUpdate (item, index) {
      this.dialogVisible = true
      this.isEditing = true
      this.groupName = item.customGroupName
      this.cameraOfGroup = item.videos ? copyObject(item.videos) : []
      this.editItem = item
      this.cameraOfGroup.sort((a, b) => a.order - b.order)
      this.setTreeChecked(true)
    },
    btnDelete (item, index) {
      this.confirmDelete('确认删除自定义组', this.deleteGroup)
    },
    // 点击添加按钮
    btnAdd () {
      this.isAdding = true
      this.groupName = ''
      this.cameraOfGroup = []
      if (this.$refs['cameraTree']) this.$refs['cameraTree'].setCheckedKeys([], true)
      this.dialogVisible = true
    },
    // 惰性加载树节点下的视频
    getCameraByOrgId (node, resolve) {
      if (node.level === 0) {
        getCameraTreeData().then(
          result => {
            if (result) {
              this.tree.rootKey = result.uuid
              resolve([result])
              this.setTreeChecked(true)
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
            this.setTreeChecked(false, result.children)
          }
        )
      }
    },
    // 钩选组织树的摄像头
    setTreeChecked (init, newItems) {
      this.$nextTick(() => {
        let checkedArr = this.cameraOfGroup.map(item => item.cameraId)
        if (!init) {
          let newCheckeds = []
          newItems.forEach((item) => {
            if (checkedArr.indexOf(item.uuid) !== -1) newCheckeds.push(item.uuid)
          })
          let checkedKeys = this.$refs['cameraTree'].getCheckedKeys()
          checkedArr = checkedKeys.concat(newCheckeds)
        }
        this.$refs['cameraTree'].setCheckedKeys(checkedArr, false)
      })
    },
    // 移出右边选中的摄像头
    btnRemoveSelected () {
      let idArr = this.checkedCamera
      let tempArr = this.cameraOfGroup.filter(item => idArr.indexOf(item.cameraId) === -1)
      this.cameraOfGroup = tempArr
      this.checkedCamera = []
      let treeChecked = tempArr.map(item => item.cameraId)
      this.$refs['cameraTree'].setCheckedKeys(treeChecked, true)
    },
    // 往右边填充左边已选择的摄像头
    btnInsertCamera () {
      let treeNodeChecked = this.$refs['cameraTree'].getCheckedNodes(true)
      let idArr = this.cameraOfGroup.map(item => item.cameraId)
      treeNodeChecked.forEach(node => {
        if (node.type === 'camera' && idArr.indexOf(node.uuid) === -1) {
          this.cameraOfGroup.push({
            'cameraId': node.uuid,
            'cameraName': node.name,
            'order': 0
          })
        }
      })
      let treeChecked = this.cameraOfGroup.map(item => item.cameraId)
      this.$refs['cameraTree'].setCheckedKeys(treeChecked, true)
    },
    // 过滤组名称
    groupNameFilter (queryString) {
      return (groupItem) => {
        return (groupItem.customGroupName.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 是否叶子
    isTreeLeaf (data, node) {
      return data.type === 'camera'
    },
    checkedCameraChange () {
    },
    // 排序
    orderCameraOfGroup () {
      this.cameraOfGroup.forEach(
        (item, index) => {
          item.order = index
        }
      )
    },
    // 判断组名是否已存在
    isSameName (name) {
      let filtered = this.groupNameList.filter(
        item => item.customGroupName === name
      )
      return filtered.length > 0
    },
    // 关闭编辑窗口回调函数
    btnHideEditBox () {
      this.isAdding = false
      this.isEditing = false
      this.dialogVisible = false
    },
    // 点击向上挪动按钮
    btnUpClick (index) {
      if (index === 0) return
      let preItem = this.cameraOfGroup.splice(index, 1)
      this.cameraOfGroup.splice(index - 1, 0, preItem[0])
    },
    // 添加或修改后根据uuid选中
    focusByUuid (uuid) {
      if (!uuid) return
      this.groupNameList.forEach(
        (item, index) => {
          if (item.customGroupId === uuid) {
            if (item.videos) this.cameraList = copyObject(item.videos)
            else this.cameraList = []
            this.cameraList.sort((a, b) => a.order - b.order)
            this.curGroupIndex = index
            this.curGroupId = uuid
          }
        }
      )
    },
    // 点击组织后加载视频
    renderTree (h, { node, data, store }) {
      let icon = data.type === 'camera' ? h('i', { class: 'icon-camera-tree-video' }) : ''
      return h('div', {}, [icon, data.name])
    }
  }
}
</script>
<style>
.selected-box .icon-camera-tree-video,
.tree-box .icon-camera-tree-video {
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
.tree-box .el-tree-node > .el-tree-node__children {
  overflow: visible;
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
.dialog-main-contain {
  margin-top: 10px;
  width: 820px;
}
.tree-box {
  width: 380px;
  float: left;
  border: solid 1px #e6e6e6;
  height: 480px;
  padding: 8px;
  overflow: auto;
}
.select-btn-box {
  text-align: center;
  padding-top: 60px;
  width: 160px;
  float: left;
}
.selected-box {
  padding: 8px;
  width: 240px;
  float: left;
  padding-top: 8px;
  border: solid 1px #e6e6e6;
  height: 480px;
  overflow: auto;
  .camera-item {
    position: relative;
  }
  .camera-item-map {
    overflow: hidden;
    width: 190px;
  }
  .camera-item-checkbox {
    margin: 0px;
    height: 24px;
  }
  .btn-up {
    position: absolute;
    height: 20px;
    width: 20px;
    right: 0px;
    top: 0px;
    font-size: 14px;
    display: block;
    text-align: center;
    line-height: 24px;
    color: #fff;
    background: #409eff;
    display: none;
    cursor: pointer;
  }
  .camera-item:hover .btn-up {
    display: block;
  }
}
.edit-box:after {
  content: ".";
  clear: both;
  display: block;
  height: 0;
  visibility: hidden;
}
.group-name-lists {
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
  li:hover .group-name-edit-btn {
    display: block;
  }
  .group-name-edit-btn {
    position: absolute;
    width: 65px;
    text-align: left;
    right: 2px;
    padding-left: 0px;
    padding-right: 0px;
    top: 0px;
    display: none;
    font-size: 18px;
    i {
      display: inline-block;
      height: 28px;
      line-height: 28px;
      width: 30px;
      color: #333;
      text-align: center;
    }
    i:hover {
      color: #409eff;
    }
  }
  .group-name-text {
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
.camera-list-box {
  padding: 20px;
  margin-left: 0px;
  margin-top: 36px;
  border: solid 1px #e6e6e6;
  .camera-list-item {
    line-height: 30px;
    height: 30px;
    color: #333;
    float: left;
    margin-left: 12px;
    min-width: 30px;
    white-space: nowrap;
  }
}
.icon-camera {
  background-image: url(./assets/images/camera.png);
  font-style: normal;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  height: 18px;
  width: 18px;
}
.camera-list-box:after {
  content: ".";
  clear: both;
  display: block;
  height: 0;
  visibility: hidden;
}
</style>