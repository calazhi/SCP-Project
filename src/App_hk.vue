<template>
 <el-container id="app">
  <el-header :height="hHeight">恒大集团智慧小区平台</el-header>
  <el-container>
     <el-aside>
      <el-menu default-active="1-4-1" class="el-menu-vertical-hd" :collapse="isCollapse" router>
        <el-menu-item index="/scp-videogatewayapp/event-logs">
          <i class="el-icon-menu"></i>
          <span slot="title">事件日志管理</span>
        </el-menu-item>
        <el-menu-item index="/scp-videogatewayapp/event-triggers">
          <i class="el-icon-menu"></i>
          <span slot="title">联动规则管理</span>
        </el-menu-item>
        <el-menu-item index="/scp-videogatewayapp/event-triggerlogs">
          <i class="el-icon-setting"></i>
          <span slot="title">联动语录管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main :style="screeHeight">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container> 
</el-container>
</template>
<script>
export default {
  name: 'app',
  data () {
    let h = 'height:' + (window.innerHeight - 90) + 'px'
    return {
      hHeight: '90px',
      asideWidth: '220px',
      screeHeight: h,
      isCollapse: false
    }
  },
  mounted () {
    window.onresize = () => {
      return (() => {
        this.screeHeight = 'height:' + (window.innerHeight - 90) + 'px' // 页面初始化
        this.$store.dispatch('setWindowHeight', window.innerHeight)
      })()
    }
  }
}
</script>
<style>
body {
  padding: 0;
  margin: 0;
  height: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100%;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 90px;
}

.el-menu-vertical-hd:not(.el-menu--collapse) {
  width: 220px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>
