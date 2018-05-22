
<template>
  <div class="map-app-add">
    <div class="info-item back-name">
      <i class="el-icon-back icon-back" @click="onCloseAreaPage"></i>
      <span class="span-scenename">{{ areaSceneInfo.sceneName }}</span>
      <div class="draw-btn">
        <el-button @click="onDrawStart">开始绘制</el-button>
        <el-button @click="onDrawClose">结束绘制</el-button>
      </div>
    </div>
    <div class="location-info">
      <div class="row-flow edit-content">
        <div class="form-area">
          <!--区域列表模块-->
          <div class="info-item table">
            <table class="table-list" border="0" cellspacing="0">
              <tr v-for="areaItem in areaList" :fit="true" :key="areaItem.id" class="list-item">
                <td class="column-name"> {{areaItem.areaName}}</td>
                <td class="column">
                  <el-button @click="onEditArea(areaItem.id,areaItem.areaName,areaItem.areaType)" type="text">编辑</el-button>
                </td>
                <td class="column">
                  <el-button @click="onShowArea(areaItem,$event)" type="text" class="el-button-common">显示</el-button>
                </td>
                <td class="column">
                  <el-button @click="onHideArea(areaItem,$event)" type="text" class="el-button-common el-button-hide ">隐藏</el-button>
                </td>
                <td class="column">
                  <el-button @click="onDeleteArea(areaItem)" type="text" class="button-delete">删除</el-button>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <!--地图区域-->
        <div class="map-area">
          <div id="mapAreaDiv"></div>
        </div>
      </div>
      <div class="row-flow btn-group">
        <el-button @click="onCloseAreaPage" class="btn-item">关闭</el-button>
      </div>
    </div>
    <area-edit ref="AreaEdit"></area-edit>
  </div>
</template>

<script>
import {
  deleteArea,
  getAreaList,
  getAreaInfo
} from '@/views/MapApp/apis/index.js'
import hdmap from 'hdmap'
import AreaEdit from '@/views/MapApp/components/AreaEdit'
import { formatArea } from '@/views/MapApp/assets/js/utils.js'
import { mapOptionFormat, extendObj, LOG_TAG } from '@/views/MapApp/assets/js/index.js'
export default {
  components: {
    AreaEdit
  },
  props: ['areaSceneInfo'],
  data () {
    return {
      sceneId: '',
      scene_type: '',
      areaName: '',
      // 点位信息
      borderPoints: [],
      // 点位信息数组
      borderPoint: {
        gpsLongitude: 123.113432,
        gpsLatitude: 45.124322,
        pointX: 100,
        pointY: 200,
        pointType: 1
      },
      areaList: [],
      mapObj: {},
      addOrEdit: 0,
      option: {
        id: 234,
        name: 'test',
        areaType: '0111',
        visible: true
      }
    }
  },
  mounted: function () {
    var _this = this
    _this.mapInit()
    this.$refs['AreaEdit'].addoptions.sceneId = this.areaSceneInfo.id
  },
  methods: {
    /**
     * @description 区域关闭
     */
    onCloseAreaPage: function () {
      this.$parent.status = '0'
    },
    /**
     * @description 区域新增
     */
    addArea: function () {
      this.onDrawStart()
      this.$refs['AreaEdit'].areSceneId = this.sceneId
      this.$refs['AreaEdit'].areSceneType = this.sceneType
    },
    /**
     * @description 区域编辑
     * @param {string} aid 区域ID
     * @param {string} anmae 区域名称
     * @param {number} atype 区域类型
     */
    onEditArea: function (aid, aname, atype) {
      switch (this.areaSceneInfo.sceneType) {
        // 小区全图
        case 1: this.$refs['AreaEdit'].currentAreaType = 2
          break
        // 停车场主图
        case 2: this.$refs['AreaEdit'].currentAreaType = 3
          break
      }
      var data = { areaId: aid }
      var _this = this
      getAreaInfo(data).then(res => {
        var re = res.data.data
        _this.$refs['AreaEdit'].addoptions.areaName = re.areaName
        _this.$refs['AreaEdit'].addoptions.areaType = re.areaType
        _this.$refs['AreaEdit'].addoptions.areaId = re.id
        _this.$refs['AreaEdit'].addoptions.linkSceneId = re.linkSceneId
        _this.$refs['AreaEdit'].addoptions.sceneId = re.sceneId
        _this.$refs['AreaEdit'].addoptions.orgName = re.orgName
        _this.$refs['AreaEdit'].addoptions.orgCode = re.orgCode
        _this.$refs['AreaEdit'].dialogFormVisible = true
        _this.$refs['AreaEdit'].curLinkedScene = re.linkSceneId
        _this.$refs['AreaEdit'].curParentArea = re.id
        _this.$refs['AreaEdit'].orgType = ''
        _this.$refs['AreaEdit'].initParamEdit()
        _this.addOrEdit = 1
      }).catch(err => {
        console.warn(LOG_TAG + 'getAreaInfo接口调用err')
        console.warn(err)
      })
    },
    /**
     * @description 区域删除
     * @param {Object} objArea 区域信息
     */
    onDeleteArea: function (objArea) {
      var obj = { areaIds: [] }
      obj.areaIds.push(objArea.id)
      var _this = this
      this.$confirm('楼栋区域上的设备点位信息也会清除掉，确定要刪除区域 ' + objArea.areaName + ' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        deleteArea(obj).then(res => {
          var data = { sceneId: this.areaSceneInfo.id }
          if (res.status === 200) {
            getAreaList(data).then(res => {
              var alist = formatArea(res.data.data)
              let areaList = []
              // 只显示areaType=1,2,3的区域，过滤掉电子围栏，车位，巡更路线，园区周界四种区域类型
              for (let i = 0; i < alist.length; i++) {
                if (parseInt(alist[i].areaType) === 1 || parseInt(alist[i].areaType) === 2 || parseInt(alist[i].areaType) === 3) {
                  areaList.push(alist[i])
                }
              }
              _this.areaList = areaList
              _this.dialogFormVisible = false
              this.$message({
                message: '数据删除成功',
                type: 'success'
              })
              _this.mapObj.removeArea({ id: objArea.id })
              _this.mapObj.closePopup()
            })
          }
        }).catch(err => {
          console.warn(LOG_TAG + 'deleteArea接口调用err')
          console.warn(err)
          this.$message({
            message: '数据删除失败',
            type: 'warning'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     * @description 区域显示
     * @param {json} areaItem 区域信息
     * @param $event
     */
    onShowArea: function (areaItem, $event) {
      let that = this
      var aid = areaItem.id
      var data = { 'areaId': aid }
      getAreaInfo(data).then(res => {
        var aitem = res.data.data
        var arr = []
        arr.push(aitem)
        var newarr = formatArea(arr)
        newarr[0].visible = true
        var styleObj = { 'fillColor': 'rgba(100,149,237,0.2)', 'strokeColor': '#1E90FF', 'strokeWidth': '2' }
        that.mapObj.addArea(newarr[0], styleObj)
        let centerPoint = hdmap.utils.getAreaCenter(newarr[0].borderPoints[0])
        if (!isNaN(centerPoint[0]) && !isNaN(centerPoint[1])) {
          that.mapObj.popupDefault(centerPoint, aitem.areaName)
          that.mapObj.setCenter(centerPoint)
        } else {
          that.$message({
            message: '后台返回的区域信息有问题，请重试！',
            type: 'warning'
          })
        }
      }).catch(err => {
        console.warn(deleteArea + 'getAreaInfo接口调用err')
        console.warn(err)
      })
    },
    /**
     * @description 区域隐藏
     * @param {json} areaItem 区域信息
     * @param $event
     */
    onHideArea: function (areaItem, $event) {
      var aid = areaItem.id
      this.mapObj.removeArea({ id: aid })
      this.mapObj.closePopup()
    },
    /**
     * @description 开始绘制区域
     */
    onDrawStart: function () {
      this.borderPoint = {}
      this.borderPoints = []
      this.mapObj.openDrawShapeTool('Polygon', function (e) {
        console.log(LOG_TAG + 'begin draw')
      }, null, false)
    },
    /**
     * @description 区域绘制结束
     */
    onDrawClose () {
      switch (this.areaSceneInfo.sceneType) {
        // 小区全图上绘制楼栋
        case 1: this.$refs['AreaEdit'].currentAreaType = 2
          break
        // 停车场主图上绘制停车场副图
        case 2: this.$refs['AreaEdit'].currentAreaType = 3
          break
      }
      this.mapObj.closeDrawShapeTool()
      var feat = this.mapObj.showDrawShape(this.option)
      if (!feat) {
        console.warn(LOG_TAG + 'draw a polygon frist')
        return
      }
      // 获取点位
      this.points = feat.getGeometry().getCoordinates()
      this.$refs['AreaEdit'].points = this.points
      if (this.points[0].length === 0) {
        this.$message({
          message: '请先在地图上绘制区域！',
          type: 'warning'
        })
        return
      }
      for (var i = 0; i < this.points[0].length; i++) {
        // 坐标转换
        console.log(LOG_TAG + '坐标转化')
        this.borderPoint.pointX = this.points[0][i][0]
        this.borderPoint.pointY = this.points[0][i][1]
        let GPSInfo = [0, 0]
        try {
          this.GPSInfo = this.mapObj.transBitmapToWGS(this.points[0][i])
        } catch (e) {
          this.GPSInfo = [0, 0]
        }
        // 组织数据borderPoints
        this.borderPoints.push({
          gpsLongitude: GPSInfo[0],
          gpsLatitude: GPSInfo[1],
          pointX: this.borderPoint.pointX,
          pointY: this.borderPoint.pointY,
          pointType: 1
        })
      }
      this.mapObj.removeArea(this.option)
      this.addOrEdit = 0
      this.$refs['AreaEdit'].addoptions.borderPoints = this.borderPoints
      this.$refs['AreaEdit'].areSceneId = this.sceneId
      this.$refs['AreaEdit'].addoptions.sceneId = this.areaSceneInfo.id
      this.$refs['AreaEdit'].addoptions.areaName = ''
      this.$refs['AreaEdit'].addoptions.orgName = ''
      this.$refs['AreaEdit'].addoptions.areaType = ''
      this.$refs['AreaEdit'].addoptions.linkSceneId = ''
      this.$refs['AreaEdit'].dialogFormVisible = true
      this.$refs['AreaEdit'].isRcShow = true
      this.$refs['AreaEdit'].stype = ''
      this.$refs['AreaEdit'].curLinkedScene = ''
      this.$refs['AreaEdit'].curParentArea = ''
      this.$refs['AreaEdit'].initParamEdit()
    },
    /**
     * @description 地图初始化
     */
    mapInit: function () {
      console.log(LOG_TAG + 'mapInit begin')
      var _this = this
      let formatedOption = mapOptionFormat(this.areaSceneInfo)
      let mapOption = extendObj(formatedOption, {
        gisEngine: 'tile',
        sizeW: _this.areaSceneInfo.width,
        sizeH: _this.areaSceneInfo.height,
        domId: 'mapAreaDiv',
        mapUrl: _this.areaSceneInfo.url,
        maxZoom: _this.areaSceneInfo.maxZoom,
        minZoom: _this.areaSceneInfo.minZoom,
        centerGPS: [_this.areaSceneInfo.centerLon, _this.areaSceneInfo.centerLat],
        arcAngle: _this.areaSceneInfo.arcAngle,
        scale: _this.areaSceneInfo.scale,
        scaleType: _this.areaSceneInfo.scaleType,
        zoom: 2,
        center: [0, 0],
        popupDom: {
          popup: 'popup',
          popupcloser: 'popup-closer',
          popupcontent: 'popup-content'
        }
      })
      try {
        // eslint-disable-next-line
        this.mapObj = new hdmap.initMap(mapOption)
        this.mapObj.regEventListener('singleclick', function (args) {
          if (args.feature) {
            // 调用area接口获取最新区域信息
            getAreaInfo({ areaId: args.feature.id }).then(res => {
              _this.areaName = res.data.data.areaName
              /** @augments
               *  @augments{Array} coordinate 区域中心点位
               * @augments{String} 弹窗展示的信息
               */
              _this.mapObj.popupDefault(args.coordinate, _this.areaName)
            })
          }
        })
      } catch (error) {
        console.log(error)
      }
      // 调用区域列表接口
      getAreaList({ sceneId: this.areaSceneInfo.id }).then(res => {
        _this.areaList = []
        let alist = formatArea(res.data.data)
        for (let i = 0; i < alist.length; i++) {
          if (parseInt(alist[i].areaType) === 1 || parseInt(alist[i].areaType) === 2 || parseInt(alist[i].areaType) === 3) {
            _this.areaList.push(alist[i])
          }
        }
      }).catch(err => {
        console.warn(LOG_TAG + 'getAreaList接口调用err')
        console.warn(err)
      })
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

.map-app-add {
  margin: 0 auto;
  padding-top: 50px;
  padding-bottom: 40px;
  .info-item.bt {
    position: relative;
    top: -30px;
  }
  .info-item.table {
    max-height: 500px;
    overflow: auto;
    margin-top: 20px;
    .list-item:nth-child(odd) {
      background: #f0f0f0;
    }
    .list-item {
      height: 40px;
    }
  }
}
.column {
  min-width: 30px;
  background: none;
  cursor: default;
  i {
    font-style: normal;
  }
  .el-button-common {
    margin-left: 7px;
    display: inline-block;
  }
  .el-button-hide {
    padding-right: 10px;
  }
}
.column-name {
  width: 50px;
  text-indent: 5px;
}
td:first-child {
  min-width: 145px;
}
.btn-group {
  margin-top: 10px;
  .btn-item {
    float: right;
    margin: 0 20px 0 0;
  }
}

.location-info {
  .edit-content {
    display: flex;
    .form-area {
      padding-top: 20px;
      height: 100%;
      flex: 0 0 320px;
      overflow: auto;
      order: -1;
      .info-item {
        line-height: 30px;
        margin-bottom: 22px;
        font-size: 14px;
        color: #606266;
      }
    }
    .map-area {
      flex: 1;
      box-sizing: border-box;
      background: #ccc;
      height: 600px;
      #mapAreaDiv {
        width: 100%;
        height: 100%;
        background: #ccc;
      }
    }
  }
}

.back-name {
  .icon-back {
    display: inline-block;
    vertical-align: middle;
    font-size: 30px;
    margin-right: 15px;
    cursor: pointer;
  }
  .span-scenename {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    font-size: 18px;
  }
  .draw-btn {
    margin: 10px 0 5px 0;
  }
}
.button-delete {
  color: #ff0000;
}
</style>
