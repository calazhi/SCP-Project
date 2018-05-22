<template>
  <div id="index" style="font-size: 60px; position:relative; top:50%; line-height:50px; margin-top:-25px; ">
    <el-row type="flex" justify="center">
      <el-col :span="24">
        <div style="width:100%;  text-align:center; color:#999">
          欢迎进入恒大集团智慧小区平台
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script type="text/javascript">
export default {
  data () {
    return {}
  },
  mounted () {
    this.open()
  },
  methods: {
    open () {
      const h = this.$createElement

      this.$notify({
        title: '欢迎光临',
        message: h('i', { style: 'color: teal' }, '欢迎进入恒大集团智慧小区平台'),
        offset: 200
      })
    }
  }
}
</script>