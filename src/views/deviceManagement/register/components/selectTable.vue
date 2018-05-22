<template>
  <el-table :data="tableData"
            border
            highlight-current-row
            :show-header=false
            :show-footer=false
            stripe
            @select="_getCurRow">
    <el-table-column type="selection" width="30">
    </el-table-column>
    <el-table-column prop="deviceName" label="名称">
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    props: {
      tableData: {
        type: Array
      }
    },
    methods: {
      _getCurRow (selection, row) {
        this.$emit('clickBindingRowEvent', selection)
      }
    },
    watch: {
      tableData (curVal, oldVal) {
        this.tableData = curVal
      }
    }
  }
</script>


