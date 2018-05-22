<template>
  <div class="tree-container" tree-container>
    <el-input placeholder="组织模糊查询" @keypress.enter.native="getOrgTree" prefix-icon="el-icon-search" v-model.trim="filterText" class="fuzzy-search-tree" :maxlength="30">
    </el-input>
    <el-tree ref="tree" class="file-tree" :data="tData" node-key="uuid" :default-expanded-keys="defaultExpandKeys" :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClick" :filter-node-method="filterNode" :highlight-current="true" default-expand-all></el-tree>
  </div>
</template>
<script>
export default {
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    treeDatas () {
      this.tData = this.treeDatas.tData
    }
  },
  data () {
    return {
      // 监测者
      filterText: '',
      key: '',
      // 组织数据
      treeDatas: {
        tData: []
      },
      // 组织树数组
      tData: [],
      // 根节点uuid
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 默认展开组织树
      defaultExpandKeys: []
    }
  },
  methods: {
    /**
    * @description 组织树节点展开刷新当前节点下所有组织
    * @param {condition} orgList @default [] 单机组织树一次,展开一层级
    */
    onClickNode: function (data, node) {
    },
    /**
    * @description 过滤组织节点
    * @param {object} data:组织节点对象
    * @param {object} value:组织名称
    */
    filterNode: function (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    /**
    * @description 过滤组织
    * @param {object} data:组织节点对象
    * @param {object} value:组织名称
    */
    filterOrg: function () {
      this.$refs.tree.filter(this.searchKey)
    },
    /**
    * @description 点击组织树节点时，获取组织树节点当前的组织名称
    * @param {object} data:组织树点击选中的组织节点对象，node选中节点
    * @param {object} node:node选中节点
    */
    handleNodeClick: function (data) {
      this.$emit('node-click', data)
    },
    /**
    * @description 组织树刷新
    * @param {condition} orgList @default [] 刷新组织树
    */
    getArrangerTree: function () {
      this.loading = true
    }
  },
  /**
    * @description 刚进入组织界面，便主动加载左侧的组织树
    * @param {condition} orgList @default [] 刷新组织树
    */
  mounted: function () {
  }
}
</script>
<style lang='less' scoped>
.tree-container {
  display: flex;
  flex-flow: column;
  width: 100%;
  float: left;
  height: 300px;
  border: 1px solid #dddee1;
  box-sizing: border-box;
  overflow: auto;
}
.el-tree {
  width: 900px;
}
</style>


