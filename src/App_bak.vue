<template>
 <el-container id="app">
  <el-header>恒大集团智慧小区平台</el-header>
  <el-container>
    <el-aside width="210px" >

<el-menu default-active="2"
      class="el-menu-vertical-demo"
      :router="menurouter"
      @open="handleOpen"
      @close="handleClose"
  >
      <el-submenu index="1" collapse="false"  >
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>测试导航一</span>
        </template>
        <el-menu-item-group>
          <template slot="title">分组一</template>
          <el-menu-item index="index">views/demo/index</el-menu-item>
          <el-menu-item index="index1">views/demo/index1</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-setting"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
      <el-menu-item index="index">
        <i class="el-icon-menu"></i>
        <span slot="title">测试views/demo/index</span>
      </el-menu-item>
      <el-menu-item index="index1">
        <i class="el-icon-setting"></i>
        <span slot="title">测试views/demo/index1</span>
      </el-menu-item>
      <el-menu-item index="userlist">
        <i class="el-icon-setting"></i>
        <span slot="title">测试views/demo/index2</span>
      </el-menu-item>
      <el-menu-item index="deviceManagementindex">
        <i class="el-icon-setting"></i>
        <span slot="title">测试views/views/deviceManagement/index</span>
      </el-menu-item>


    </el-menu>

    </el-aside>
    <el-container>
      <el-main>
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
    return {
      // screeHeight: 0
      menurouter: true
    }
  },
  mounted () {
    // this.screeHeight = document.body.clientHeight - 60
    // this.$set(this.$refs['app'], 'height', this.screeHeight)
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" >
body {
  padding: 0;
  margin: 0;
  height: 100%;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

.el-header,
.el-footer {
  text-align: center;
  line-height: 60px;
  background-image: linear-gradient(to right,#1278f6,#00b4aa);
}


/*
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 100%;
}


.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  line-height: 160px;
}


*/
/*text-align: center; */
/*
body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
*/
</style>
