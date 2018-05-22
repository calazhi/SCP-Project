<template>
  <div class="delete-wrapper">
    <el-button type="primary" @click="deleteEvents">一键清除预警</el-button>
  </div>
</template>
<script>
  import { deleteWarningEvent, deteleCruiseEvent } from './apis/index'
  export default {
    name: 'DeleteWarningEvent',
    methods: {
      deleteEvents () {
        this.$confirm('您确定删除所有预警事件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteWarningEvent().then(res => {
            console.log(res.data.message)
            this.$message({
              message: res.data.message,
              duration: 1000
            })
          }).catch(err => {
            console.log(err)
          })
          deteleCruiseEvent().then(res => { // 清除巡更事件
            setTimeout(() => {
              this.$message({
                message: res.data.message,
                duration: 2000
              })
            }, 1500)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消清除预警事件'
          })
        })
      }
    }
  }
</script>
<style scoped>
.delete-wrapper{
  text-align:center;
  margin-top:200px;
}
</style>
