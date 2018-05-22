<template>
  <el-dialog title="编辑" :visible.sync="dialogVisible" width="30%">
    <el-form ref="form" :model="form" label-width="130px" class="map-form">
      <el-form-item label="基础配置值:" class="el-chiose-map-style" prop="configValue">
        <div class="block">
          <el-input v-model.trim="form.configValue" class="common-input" ref="input"></el-input>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { setMapSetting } from '@/views/MapApp/apis/index.js'
export default {
  data () {
    return {
      dialogVisible: false,
      form: {
        configValue: '',
        configName: '',
        id: ''
      }
    }
  },
  methods: {
    confirm () {
      let editId = this.form.id
      let editValue = this.form.configValue
      if (this.form.configName === 'search_interval' || this.form.configName === 'search_range') {
        // 检查数据是否是整数
        let reg = /^[0-9]*[1-9][0-9]*$/
        if (!reg.test(editValue)) {
          this.$message({
            message: '请输入正整数',
            type: 'warning'
          })
          return false
        }
      }
      setMapSetting({ id: editId, configValue: editValue }).then(res => {
        if (res.data.code === '00000') {
          this.$message({
            type: 'success',
            message: '更新成功'
          })
          this.dialogVisible = false
          // 刷新列表
          this.$emit('freshTable')
        } else {
          this.$message({
            type: 'error',
            message: '更新失败，请重试'
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.common-input {
  width: 200px;
}
</style>

