<template>
  <div class="pager-table" v-loading="loading">
    <el-table height="100%" ref="table" :data="visitorData" stripe border header-cell-class-name="text-align-center" @selection-change="handleSelectionChange" style="width: 100%;">
      <el-table-column fixed="left" v-if="hasSelect" type="selection" width="55">
      </el-table-column>
      <slot name="table-column"></slot>
    </el-table>
    <el-pagination class="table-pager" :current-page="currentPage" :total="total" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChange" @current-change="currentChange">
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    hasSelect: {
      default: false,
      type: Boolean
    },
    tableLoading: {
      default: false,
      type: Boolean
    },
    total: {
      default: 0,
      type: Number
    },
    currentPage: {
      default: 1,
      type: Number
    },
    visitorData: Array  // 从父组件传入的表格数据
  },
  data () {
    return {
      selections: {
        selectionsUuid: [],
        selectionsVisitorUuid: []
      },
      pageSize: 10,
      loading: false,
      tableData: []
    }
  },
  methods: {
    /**
     * @description 点击table组件复选框触发
     * @param Array val 所有选中行数据
     */
    handleSelectionChange: function (val) {
      this.selections.selectionsUuid = []
      this.selections.selectionsVisitorUuid = []
      let arrUuid = []
      let arrVisitorUuid = []
      for (var i = 0; i < val.length; i++) {
        arrUuid.push(val[i].uuid)
        arrVisitorUuid.push(val[i].visitorUuid)
      }
      for (var j = 0; j < arrUuid.length; j++) {
        if (this.selections.selectionsUuid.indexOf(arrUuid[j]) === -1) {
          this.selections.selectionsUuid.push(arrUuid[j])
        }
      }
      for (var m = 0; m < arrVisitorUuid.length; m++) {
        if (this.selections.selectionsVisitorUuid.indexOf(arrVisitorUuid[m]) === -1) {
          this.selections.selectionsVisitorUuid.push(arrVisitorUuid[m])
        }
      }
      this.$emit('tableSelected', this.selections)
    },
    /**
     * @description 分页组件单页总数变化
     * @param Number val 选择的单页总数得值
     */
    sizeChange: function (val) {
      let condition = {}
      this.pageSize = val
      condition.currentPage = 1
      condition.pageSize = val
      this.getData(condition)
    },
    /**
     * @description 分页组件当前页变化
     * @param Number val 选择当前页的值
     */
    currentChange: function (val) {
      let condition = {}
      condition.currentPage = val
      condition.pageSize = this.pageSize
      this.getData(condition)
    },
    getData: function (options) {
      // 通过事件，告诉父组件，翻页请求数据
      this.$emit('turnPage', options)
    }
  }
}
</script>
<style scoped>
.pager-table {
  display: flex;
  flex-flow: column;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
.table-pager {
  padding: 0;
  margin-top: 10px;
  text-align: right;
}
</style>


