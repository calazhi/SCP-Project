<template>
  <div class="tree-container">
    <el-tree class="filter-tree" :data="treeData" node-key="uuid" :default-expanded-keys="defaultExpandKeys" :props="defaultProps" ref="tree" @node-click="onClickNode" @node-expand="nodeExpand"></el-tree>
  </div>
</template>
<script>
import { obtainOrganization } from '../../apis/person_manager'
import { LOG_TAG } from '@/views/MdmApp/assets/js/index.js'
export default {
  props: {
    search: {
      type: Function
    },
    exportHouseNode: {
      type: Object
    }
  },
  data () {
    return {
      treeData: [],
      orgData: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultExpandKeys: []
    }
  },
  methods: {
    /**
     * @description 判断当前节点房屋组织树信息状态  是否有下级目录  下一级数据未请求处理
     * @param {Object} data 当前节点房屋组织树信息
     */
    formatTree: function (data) {
      const defaultNode = {
        name: ''
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i].isParent === true) {
          data[i].children = []
          data[i].children.push(defaultNode)
        }
      }
      return data
    },
    /**
     * @description 点击房屋组织树节点
     * @param {Object} data 当前节点房屋组织树属性信息
     * @param {Object} node 当前节点房屋组织树下级目录信息
     */
    onClickNode: function (data, node) {
      let exportName = ''
      const getName = (node) => {
        exportName = node.label + exportName
        if (node.parent && node.parent.data.$treeNodeId) {
          getName(node.parent)
        } else {
          this.exportHouseNode.houseOrOrgName = exportName
        }
      }
      getName(node)
      this.exportHouseNode.houseUuid = data.type === 'house' ? data.uuid : ''   // index搜索使用 || 传给 PersonEdit 默认不触发 判断选中组织类型
      this.exportHouseNode.orgUuid = data.type === 'house' ? '' : data.uuid     // index搜索使用 || 传给 PersonEdit 判断选中组织类型
      this.exportHouseNode.type = data.type                                     // 传给 PersonEdit 判断选中组织类型
      this.search(this.exportHouseNode)
    },
    /**
     * @description 展开房屋组织树节点
     * @param {Object} data 当前节点房屋组织树属性信息
     * @param {Object} node 当前节点房屋组织树下级目录信息
     */
    nodeExpand: function (data, node) {
      if (data.hasExpanded) {
        return false
      }
      this.orgData = {
        isParent: data.isParent,
        type: data.type,
        uuid: data.uuid
      }
      obtainOrganization(this.orgData)
        .then(res => {
          data.children = this.formatTree(res.data.data.children)
          data.hasExpanded = true
        })
        .catch(err => {
          this.$message({
            message: '服务器连接异常',
            type: 'warning'
          })
          console.warn(LOG_TAG + '组织树加载err')
          console.warn(err)
        })
    }
  },
  mounted: function () {
    obtainOrganization()
      .then(res => {
        this.treeData.push(res.data.data)
        this.exportHouseNode.orgUuid = res.data.data.uuid
        this.defaultExpandKeys.push(res.data.data.uuid)
        this.formatTree(res.data.data.children)
        this.loading = false
      })
      .catch(err => {
        console.warn(LOG_TAG + '组织树加载err')
        console.warn(err)
      })
  }
}
</script>
<style scoped>
.tree-container {
  display: flex;
  flex-flow: column;
  width: 200px;
  float: left;
  height: 100%;
  border: 1px solid #dddee1;
  box-sizing: border-box;
  overflow: auto;
}

.filter-tree {
  height: 700px;
}

.el-tree {
  width: 900px;
  flex: 1;
}
.fuzzy-search {
  margin: 10px;
  width: 178px;
}
</style>


