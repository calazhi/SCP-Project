<template>
  <el-table
    :data="tableData"
    max-height="680"
    >
    <el-table-column
      v-for="(item, index) in params"
      :prop="item.prop"
      :label="item.title"
      :key="index"
      :width="item.width">
    </el-table-column>
    <el-table-column
      label="操作"
      width="80">
      <template slot-scope="scope">
        <span @click="handleClickEdit(scope.$index)" content="编辑" style="cursor:pointer; margin-right:10px" class="el-icon-edit">
        </span>
        <span @click="handleClickDelete(scope.$index)" content="删除" style="cursor:pointer" class="el-icon-delete">
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    props: {
      params: undefined,
      tableData: undefined
    },
    data () {
      return {
      }
    },
    methods: {
      handleClickDelete (row) {
        this.$emit('listenDeleteEvent', row)
      },
      handleClickEdit (row) {
        this.$emit('listenEditEvent', this.tableData[row])
      }
    },
    created () {
    }
  }
</script>
