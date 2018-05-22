<template>
  <div class="map-app-add">
    <!--场景基本信息配置页-->
    <div class="row-flow">
      <el-steps :active="step" finish-status="success" simple style="margin-top: 20px;">
        <el-step title="场景基本信息"></el-step>
        <el-step title="场景地图定位信息"></el-step>
      </el-steps>
    </div>
    <scene-base-info ref="SceneBaseInfo" v-show="step===1" :sceneInfo="sceneInfo" :onCanclePage="onCanclePage"></scene-base-info>
    <!--场景比例尺计算页-->
    <scene-location-info ref="SceneLocationInfo" v-show="step!==1" :sceneInfo="sceneInfo" :onCanclePage="onCanclePage"></scene-location-info>
  </div>
</template>
<script>
import { getSceneInfo } from '@/views/MapApp/apis/index.js'
import SceneBaseInfo from '@/views/MapApp/components/SceneBaseInfo'
import SceneLocationInfo from '@/views/MapApp/components/SceneLocationInfo'
import { LOG_TAG } from '@/views/MapApp/assets/js/index.js'
export default {
  props: {
    currentParams: {
      type: Object
    }
  },
  components: {
    SceneBaseInfo, SceneLocationInfo
  },
  data () {
    return {
      // 当前场景
      sceneInfo: {},
      // 页面控制及状态显示 1-基本信息 2-定位信息
      step: 1
    }
  },
  methods: {
    /**
    *@description 场景定位信息配置入口
    */
    enterLocationInfo: function () {
      this.step = 2
      this.$refs['SceneLocationInfo'].setLocationInfo(this.sceneInfo)
    },
     /**
    *@description 场景基本信息添加入口
    *@param sceneInfo-场景信息
    */
    addSceneInfo: function () {
      this.step = 1
      this.$refs['SceneBaseInfo'].addSceneBase()
    },
     /**
    *@description 场景基本信息编辑入口
    *@param sceneInfo-场景信息
    */
    editSceneInfo: function (sceneInfo) {
      this.step = 1
      this.sceneInfo = sceneInfo
      this.$refs['SceneBaseInfo'].editSceneInfo(sceneInfo)
    },
    /**
    *@description 场景信息查询加页面跳转
    *@param sceneId-场景id
    *@param page-页面跳转标识符 'base'-基本信息 'location'-定位信息
    */
    getSceneInfoForEdit: function (sceneId, page) {
      getSceneInfo({ sceneId: sceneId }).then(res => {
        if ((res.data.code === '00001') || (res.data.code === '00000')) {
          this.sceneInfo = res.data.data
          if (page === 'base') {
            this.editSceneInfo(this.sceneInfo)
            this.$refs['SceneLocationInfo'].resetForm()
          } else {
            this.enterLocationInfo(this.sceneInfo)
            this.$refs['SceneBaseInfo'].resetForm()
          }
        } else {
          this.$message({
            message: '网络忙，请重新尝试！',
            type: 'warning'
          })
        }
      }).catch(err => {
        console.warn(LOG_TAG + 'getSceneInfo接口调用err')
        console.warn(err)
      })
    },
    /**
     *@description 进入定位信息页面
     *@param sceneInfo-场景信息
    */
    setLocationInfo: function (sceneInfo) {
      this.mapInit(sceneInfo.url)
      this.initsceneGPS(sceneInfo)
    },
    /**
     *@description 取消事件及保存后续-重置表单并更新列表
    */
    onCanclePage () {
      this.step = 1
      this.$parent.status = '0'
      this.$refs['SceneBaseInfo'].resetForm()
      this.$refs['SceneLocationInfo'].resetForm()
      this.$parent.onGetPageData()
    }
  }
}
</script>
<style lang="less" scoped>
/* MapApp.less公共样式start */
@origin: 10px;
.pull-left {
  float: left;
}
.pull-right {
  float: right;
}
.row-flow {
  width: 100%;
}
.clearfix {
  clear: both;
}
.common-input {
  width: @origin*28;
}
.map-app-add {
  margin: 0 auto;
  padding-top: 40px;
  padding-bottom: 40px;
  /deep/.btn-group {
    .btn-item {
      width: 84px;
      float: right;
      margin: 0 20px 0 0;
    }
  }
}
.color-style {
  color: red;
}
</style>