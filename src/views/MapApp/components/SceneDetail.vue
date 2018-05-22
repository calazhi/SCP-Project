<template>

  <el-dialog :visible.sync="dialogFormVisible" width="900px" class="dialog" :close-on-click-modal="false">
    <div class="title-div">
      <span class="title">{{sceneDetailTmp.sceneName}}</span>
    </div>
    <div class="head">
      <el-form ref="sceneDetailTmp" :model="sceneDetailTmp" label-width="80px">
        <div class="box">
          <div class="font-info" v-show="sceneDetailTmp.locationPoints!==undefined&&sceneDetailTmp.locationPoints!==''">
            <el-form-item class="item-font" label="场景类型: " prop="scene_type">{{sceneDetailTmp.sceneType}}</el-form-item>
            <el-form-item class="item-font" label="所属组织: " prop="org_code">{{sceneDetailTmp.orgName}}</el-form-item>
            <el-form-item class="item-font" label="切图范围: " prop="imgSize" v-show="sceneDetailTmp.width">{{sceneDetailTmp.width}} * {{sceneDetailTmp.height}}</el-form-item>
            <el-form-item class="item-font" label="比例尺: " prop="scale">{{sceneDetailTmp.scale}}</el-form-item>
            <el-form-item class="item-font" label="旋转角度:" v-if="sceneDetailTmp.arcAngle||sceneDetailTmp.arcAngle">{{Number(sceneDetailTmp.arcAngle * 180 / Math.PI).toFixed(8)}}</el-form-item>
            <el-form-item class="item-font center" label="中心点位:" v-if="sceneDetailTmp.centerLon||sceneDetailTmp.centerLat">{{sceneDetailTmp.centerLon}},{{sceneDetailTmp.centerLat}}</el-form-item>
          </div>
          <div class="font-point" v-if="sceneDetailTmp.locationPoints!==undefined&&sceneDetailTmp.locationPoints!==''&&sceneDetailTmp.locationPoints!==null">
            <!--GPS坐标展示-->
            <div class="reallyPosition">
              <span>
                <el-form-item label="实际位置1:">
                  <i>{{sceneDetailTmp.locationPoints[0].gpsLongitude}},</i>
                  <i>{{sceneDetailTmp.locationPoints[0].gpsLatitude}}</i>
                </el-form-item>
              </span>
              <span>
                <el-form-item label="实际位置2:">
                  <i>{{sceneDetailTmp.locationPoints[1].gpsLongitude}},</i>
                  <i>{{sceneDetailTmp.locationPoints[1].gpsLatitude}}</i>
                </el-form-item>
              </span>
              <span>
                <el-form-item label="实际位置3:">
                  <i>{{sceneDetailTmp.locationPoints[2].gpsLongitude}},</i>
                  <i>{{sceneDetailTmp.locationPoints[2].gpsLatitude}}</i>
                </el-form-item>
              </span>
            </div>
            <!--点位坐标展示-->
            <div class="img-point">
              <span>
                <el-form-item label="切片点位1:">
                  <i>{{sceneDetailTmp.locationPoints[0].pointX}},</i>
                  <i>{{sceneDetailTmp.locationPoints[0].pointY}}</i>
                </el-form-item>
              </span>
              <span>
                <el-form-item label="切片点位2:">
                  <i>{{sceneDetailTmp.locationPoints[1].pointX}},</i>
                  <i>{{sceneDetailTmp.locationPoints[1].pointY}}</i>
                </el-form-item>
              </span>
              <span>
                <el-form-item label="切片点位3:">
                  <i>{{sceneDetailTmp.locationPoints[2].pointX}},</i>
                  <i>{{sceneDetailTmp.locationPoints[2].pointY}}</i>
                </el-form-item>
              </span>
            </div>
          </div>
        </div>
        <div class="map-area">
          <div id="mapDiv"></div>
        </div>
      </el-form>
    </div>
    <div class="foot">
      <el-button @click="onCancle" type="primary">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  poops: [],
  data () {
    return {
      dialogFormVisible: false,
      sceneType: '',
      mapUrl: '',
      mapObj: null,
      sceneDetailTmp: {
        orgCode: '',
        sceneName: '',
        sceneType: '',
        height: null,
        width: null,
        scale: null,
        locationPoints: [
          {
            gpsLongitude: null,
            gpsLatitude: null,
            pointX: null,
            pointY: null
          },
          {
            gpsLongitude: null,
            gpsLatitude: null,
            pointX: null,
            pointY: null
          },
          {
            gpsLongitude: null,
            gpsLatitude: null,
            pointX: null,
            pointY: null
          }
        ]
      }
    }
  },
  created: function () {
  },
  watch: {
    dialogFormVisible: function (value) {
      let that = this
      console.info(value)
      if (value === true) {
        setTimeout(function () {
          that.initMap()
        }, 200)
      }
    }
  },
  methods: {
    destroyMap: function () {
      this.mapObj.getMap().setTarget(null)
      this.mapObj.destroy()
      this.mapObj = {}
    },
    /**
    *@description 取消操作
    */
    onCancle: function () {
      this.dialogFormVisible = false
      this.$emit('change', '0')
    },
    initMap: function () {
      let sceneDetailTmp = this.sceneDetailTmp
      console.log('sceneDetailTmp: ')
      console.log(sceneDetailTmp)
      try {
        // eslint-disable-next-line
        this.mapObj = new hdmap.initMap({
          gisEngine: 'tile',
          sizeW: sceneDetailTmp.width,
          sizeH: sceneDetailTmp.height,
          domId: 'mapDiv',
          mapUrl: sceneDetailTmp.url,
          maxZoom: sceneDetailTmp.maxZoom,
          minZoom: sceneDetailTmp.minZoom,
          centerGPS: [sceneDetailTmp.centerLon, sceneDetailTmp.centerLat],
          arcAngle: sceneDetailTmp.arcAngle,
          scale: sceneDetailTmp.scale,
          scaleType: sceneDetailTmp.scaleType,
          zoom: 1,
          center: [0, 0]
        })
      } catch (err) {
        console.log(err)
      }
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
.map-app {
  box-sizing: border-box;
  position: absolute;
  top: 90px;
  bottom: 20px;
  left: 225px;
  right: 20px;
}
.filter-tree {
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: 300px;
}
/* MapApp.less公共样式end */
div {
  box-sizing: border-box;
}
.box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 10px;
  width: 80%;
  margin: 0 auto;
}
.dialog {
  top: 5px;
  padding: 0 20px;
  .title-div {
    text-align: center;
    margin-bottom: 15px;
  }
}
el-dialog {
  padding: 0 60px 10px 0;
}

/* 弹性布局 */
.font-info {
  width: 100%;
  height: 68px;
  .item-font {
    box-sizing: border-box;
    display: block;
    width: 31%;
    padding-left: 8px;
    float: left;
    margin-bottom: 0;
  }
  .center {
    width: 36%;
  }
}
.font-point {
  width: 100%;
  margin-top: 0px;
  .reallyPosition,
  .img-point {
    width: 100%;
    margin-top: 10px;
    height: 40px;
    span {
      box-sizing: border-box;
      display: block;
      width: 31%;
      height: 40px;
      padding-left: 8px;
      float: left;
      i {
        display: block;
        height: 20px;
        line-height: 20px;
        font-style: normal;
      }
    }
  }
}
.item-font {
  width: 33%;
}
.head,
.foot {
  border-top: 1px solid #ccc;
  margin-top: 20px;
}
.head {
  position: relative;
  margin-top: 0px;
}
.foot {
  position: absolute;
  bottom: 5px;
  right: 20px;
}
.map-area {
  box-sizing: border-box;
  padding: 20px;
  height: 450px;
  #mapDiv {
    width: 100%;
    height: 100%;
    background: #ccc;
  }
}
.dialog .title {
  margin: auto;
  font-size: 18px;
  font-weight: 700;
}
</style>


