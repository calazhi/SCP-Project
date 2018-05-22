<template>
  <el-table :data="tableList"
            border
            highlight-current-row
            :show-footer="false"
            height="300"
            @current-change="_getCurRow">
    <el-table-column prop="fileName" label="固件名称">
    </el-table-column>
    <el-table-column prop="firmwareVersion" label="固件版本">
    </el-table-column>
    <el-table-column prop="fileSize" label="固件大小">
    </el-table-column>
    <el-table-column prop="filePath2" label="固件存储路径">
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
      data () {
        return {
          tableList: []
        }
      },
      methods: {
        _getCurRow (row) {
          if (row) {
            this.$emit('listenToRowSelected', row)
          }
        },
        // 刷新
        loadFirmwareTableList (list) {
          this.tableList = list
        }
      },
      mounted () {
        this.tableList = this.tableData
      }
    }
</script>
