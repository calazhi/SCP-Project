<template>
  <div class="map-app">
    <div class="row-flow main">
      <div class="content-left">
        <div class="search-sence-area">
          <el-form label-width="80px" class="search-form">
            <el-form-item label="场景类型" class="common-input">
              <el-select v-model="sceneParam.sceneType" placeholder="请选择场景类型">
                <el-option v-for="item in SceneTypes" :label="item.itemName" :value="item.itemCode" :key="item.itemCode"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="list-fence">
          <p>围栏列表</p>
          <ul>
            <li v-for="(fenceListItem) in fenceList" :key="fenceListItem.id">
              <div class="fence-list">
                <div class="fence-name" :title="fenceListItem.areaName">
                  <span>{{fenceListItem.areaName}}</span>
                </div>
                <div class="fence-edit">
                  <el-button @click="onAreashow(fenceListItem,$event)" type="text" size="small">显示</el-button>
                  <el-button @click="onAreaHide(fenceListItem,$event)" type="text" size="small">隐藏</el-button>
                  <el-button @click="onAreaEdit(fenceListItem,$event)" type="text" size="small">编辑</el-button>
                  <el-button @click="onAreaDel(fenceListItem, $event)" type="text" size="small">删除</el-button>
                </div>
              </div>
              <div class="device-list">
                <el-button type="text" size="small">设备编码:</el-button>
                <p :title="fenceListItem.deviceId">{{fenceListItem.deviceId}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="content-center">
        <div class="button-group">
          <el-button type="primary" @click="onDrawStart()">开始绘制</el-button>
          <el-button type="primary" @click="onDrawClose()">绘制结束</el-button>
        </div>
        <div id="tilemap"></div>
      </div>
    </div>
    <fence-edit ref='FenceEdit' @customEvent="onFenceListSearch()"></fence-edit>
  </div>
</template>

<script>
import { getSceneList, getDictionary, getSceneInfo, getAreaList, getAreaInfo, deleteArea, getDeviceInfo } from '@/views/MapApp/apis/index.js'
import hdmap from 'hdmap'
import FenceEdit from '@/views/MapApp/components/FenceEdit.vue'
import { mapOptionFormat, extendObj, LOG_TAG } from '@/views/MapApp/assets/js/index.js'
import { formatArea } from '@/views/MapApp/assets/js/utils.js'
export default {
  components: {
    FenceEdit
  },
  data () {
    return {
      // 场景参数
      sceneParam: {
        sceneName: '',
        sceneType: ''
      },
      // 场景类型
      SceneTypes: [],
      // 围栏列表
      sceneList: [],
      // 地图缓存数组
      cacheMapList: [],
      // 地图对象
      mapObj: null,
      // 点位信息
      borderPoints: [],
      // 点位信息数组
      borderPoint: {
        gpsLongitude: 0,
        gpsLatitude: 0,
        pointX: 0,
        pointY: 0,
        pointType: 2
      },
      points: [],
      // GPS信息
      GPSInfo: [],
      // 围栏列表
      fenceList: [],
      // 场景Id
      sceneId: '',
      areaType: '5',
      areaStatus: '101',
      beginDraw: '0'
    }
  },
  mounted: function () {
    // 初始化弹框隐藏
    this.$refs['FenceEdit'].dialogFormVisible = false
    getDictionary().then((res) => {
      // 选取场景类型sceneType.itemCode为1,2的电子围栏
      let list = res.data.data.dictCodeType.sceneType
      let arr = []
      for (let i = 0; i < list.length; i++) {
        if (list[i].itemCode === '1') {
          arr.push(list[i])
        }
      }
      this.SceneTypes = arr
      // 初始化选择sceneType.itemCode为1的电子围栏
      this.sceneParam.sceneType = this.SceneTypes[0].itemCode
      // 初始化获取场景列表
      getSceneList(this.sceneParam).then((res) => {
        this.sceneList = res.data.data
        this.sceneId = this.sceneList[0].id
        // 初始化加载围栏列表
        let params = {}
        params.sceneId = this.sceneId
        params.areaType = this.areaType
        getAreaList(params).then(res => {
          this.fenceList = res.data.data
        }).catch(err => {
          console.warn(LOG_TAG + 'getAreaList接口调用err')
          console.warn(err)
        })
        // 初始化加载场景信息
        let option = {}
        option.sceneId = this.sceneId
        getSceneInfo(option).then((res) => {
          // TODO 切换地图
          let options = res.data.data
          this.onMapCreate(options)
        }).catch(err => {
          console.warn(LOG_TAG + 'getSceneInfo获取场景信息err')
          console.warn(err)
        })
      }).catch(err => {
        console.warn(LOG_TAG + 'getSceneList接口调用err')
        console.warn(err)
      })
    }).catch(err => {
      console.warn(LOG_TAG + 'getDictionary接口调用err')
      console.warn(err)
    })
  },
  methods: {
    /**
     * @description 初始化地图
     * @param option Object 地图信息
     */
    onMapCreate (options) {
      if (this.mapObj) {
        this.mapObj.getMap().setTarget(null)
      }
      // 已经初始化的地图可以直接获取地图对象，进行地图的替换即可
      if (this.cacheMapList[options.id]) {
        this.mapObj = this.cacheMapList[options.id]
        this.mapObj.getMap().setTarget('tilemap')
        return
      }
      // 如果没有初始化过，才需要进行地图的初始化
      let formatedOption = mapOptionFormat(options)
      let mapOption = extendObj(formatedOption, {
        gisEngine: 'tile',
        sizeW: options.width,
        sizeH: options.height,
        domId: 'tilemap',
        mapUrl: options.url,
        zoom: 2,
        maxZoom: options.maxZoom,
        minZoom: options.minZoom,
        center: [0, 0],
        centerGPS: [options.centerLon, options.centerLat],
        scale: options.scale,
        scaleType: options.scaleType,
        arcAngle: options.arcAngle // 弧度值
      })
      // eslint-disable-next-line
      this.cacheMapList[options.id] = new hdmap.initMap(mapOption)
      this.mapObj = this.cacheMapList[options.id]
      this.mapObj.getMap().setTarget('tilemap')
    },
    /**
     * @description 开始绘制
     */
    onDrawStart: function () {
      // 判断是否有地图被选中
      if (this.sceneId === '') {
        this.$message({
          message: '请先选择地图！',
          type: 'warning'
        })
        return
      }
      // 如果已经点击开始绘制，将beginDraw复制为'1'
      this.beginDraw = '1'
      this.mapObj.openDrawLineTool({ color: '#ff0033', width: 2 }, null, null, function (e) {
      }, null, false)
    },
    /**
     * @description 结束绘制
     */
    onDrawClose: function () {
      console.log(LOG_TAG + 'onDrawClose begin')
      // 判断是否有地图被选中
      if (this.sceneId === '') {
        this.$message({
          message: '请先选择地图！',
          type: 'warning'
        })
        return
      }
      // 判断是否点击了开始绘制按钮，为'1'继续执行后面的代码，为'0'则return
      if (this.beginDraw !== '1') {
        this.$message({
          message: '请先点击开始绘制按钮！',
          type: 'warning'
        })
        return
      }
      // 将是否开始绘制状态改成'0'
      this.beginDraw = '0'
      this.borderPoints = []
      this.mapObj.closeDrawLineTool()
      let optionLine = {
        id: '111',
        name: '111',
        lineType: '111',
        borderPoints: []
      }
      let feat = this.mapObj.showDrawLine(optionLine, { color: '#ff0033', width: 2 })
      if (!feat) {
        this.$message({
          message: '请先在地图上画线！',
          type: 'warning'
        })
        return
      }
      optionLine.borderPoints = feat.getGeometry().getCoordinates()
      this.points = optionLine.borderPoints
      for (let i = 0; i < this.points.length; i++) {
        // 坐标转换
        this.borderPoint.pointX = this.points[i][0]
        this.borderPoint.pointY = this.points[i][1]
        let GPSInfo = [0, 0]
        try {
          this.GPSInfo = this.mapObj.transBitmapToWGS(this.points[i])
        } catch (e) {
          this.GPSInfo = [0, 0]
          console.warn(LOG_TAG + 'e')
          console.warn(e)
        }
        this.borderPoints.push({
          gpsLongitude: GPSInfo[0],
          gpsLatitude: GPSInfo[1],
          pointX: this.borderPoint.pointX,
          pointY: this.borderPoint.pointY,
          pointType: 2
        })
      }
      // 将直线从图层上移除
      this.mapObj.removeLine(optionLine)
      // 向子组件传递参数
      this.$refs['FenceEdit'].addoptions.borderPoints = this.borderPoints
      this.$refs['FenceEdit'].addoptions.sceneId = this.sceneId
      this.$refs['FenceEdit'].addoptions.areaType = this.areaType
      this.$refs['FenceEdit'].addoptions.areaName = ''
      this.$refs['FenceEdit'].addoptions.deviceId = ''
      this.$refs['FenceEdit'].addoptions.deviceName = ''
      this.$refs['FenceEdit'].addoptions.areaStatus = this.areaStatus
      this.$refs['FenceEdit'].OrgName = ''
      this.$refs['FenceEdit'].dialogFormVisible = true
      // 判断是新增还是编辑状态
      this.$refs['FenceEdit'].addOrEdit = 0
    },
    /**
    * @description 显示围栏列表方法
    */
    onFenceListSearch: function () {
      let params = {}
      params.sceneId = this.sceneId
      params.areaType = this.areaType
      getAreaList(params).then(res => {
        this.fenceList = res.data.data
      }).catch(err => {
        console.warn(LOG_TAG + 'getAreaList接口调用err')
        console.warn(err)
      })
    },
    /**
     * @description 显示围栏方法
     * @param fenceListItem Object 围栏信息
     */
    onAreashow: function (fenceListItem, $event) {
      let data = {}
      data.areaId = fenceListItem.id
      getAreaInfo(data).then(res => {
        let aitem = res.data.data
        let arr = []
        arr.push(aitem)
        let newarr = formatArea(arr)
        let lineStyle = { color: '#ff0033', width: 2 }
        let optionLine = {
          id: newarr[0].id,
          name: newarr[0].areaName,
          lineType: newarr[0].areaType,
          borderPoints: newarr[0].borderPoints[0]
        }
        this.mapObj.addLine(optionLine, lineStyle)
        let centerPoint = hdmap.utils.getWarningPosition(optionLine)
        this.mapObj.popupDefault(centerPoint, aitem.areaName)
        this.mapObj.setCenter(centerPoint)
      }).catch(err => {
        console.warn(LOG_TAG + 'getAreaInfo接口调用err')
        console.warn(err)
      })
    },
    /**
     * @description 隐藏围栏方法
     * @param fenceListItem Object 围栏信息
     */
    onAreaHide: function (fenceListItem, $event) {
      let data = {}
      data.areaId = fenceListItem.id
      getAreaInfo(data).then(res => {
        let aitem = res.data.data
        let arr = []
        arr.push(aitem)
        let newarr = formatArea(arr)
        let optionLine = {
          id: newarr[0].id,
          name: newarr[0].areaName,
          lineType: newarr[0].areaType,
          borderPoints: newarr[0].borderPoints[0]
        }
        this.mapObj.removeLine(optionLine)
        this.mapObj.closePopup()
      }).catch(err => {
        console.warn(LOG_TAG + 'getAreaInfo接口调用err')
        console.warn(err)
      })
    },
    /**
     * @description 编辑围栏方法
     * @param fenceListItem Object 围栏信息
     */
    onAreaEdit: function (fenceListItem, $event) {
      this.$refs['FenceEdit'].dialogFormVisible = true
      // 判断是新增还是编辑状态
      this.$refs['FenceEdit'].addOrEdit = 1
      this.$refs['FenceEdit'].addoptions.areaType = this.areaType
      this.$refs['FenceEdit'].addoptions.areaStatus = this.areaStatus
      this.$refs['FenceEdit'].OrgName = ''
      let data = {}
      data.areaId = fenceListItem.id
      // 获取区域信息
      getAreaInfo(data).then(res => {
        this.$refs['FenceEdit'].addoptions.deviceId = res.data.data.deviceId
        this.$refs['FenceEdit'].addoptions.areaName = res.data.data.areaName
        this.$refs['FenceEdit'].addoptions.areaId = res.data.data.id
        let option = {}
        option.deviceId = res.data.data.deviceId
        // 获取设备信息
        getDeviceInfo(option).then(res => {
          this.$refs['FenceEdit'].addoptions.deviceName = res.data.data.deviceName
        })
      }).catch(err => {
        console.warn(LOG_TAG + 'getAreaInfo接口调用err')
        console.warn(err)
      })
    },
    /**
     * @description 删除围栏方法
     * @param fenceListItem Object 围栏信息
     */
    onAreaDel: function (fenceListItem, $event) {
      let obj = { areaIds: [] }
      obj.areaIds.push(fenceListItem.id)
      this.$confirm('确定要刪除该电子围栏吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        // 调用隐藏围栏方法
        this.onAreaHide(fenceListItem, $event)
        // 删除围栏
        deleteArea(obj).then(res => {
          if (res.status === 200) {
            // 更新围栏列表
            this.onFenceListSearch()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
        }).catch(err => {
          console.warn(LOG_TAG + 'deleteArea接口调用err')
          console.warn(err)
        })
      }).catch(err => {
        console.warn(LOG_TAG + '取消删除')
        console.warn(err)
      })
    }
  }
}
</script>
<style lang="less" scoped>
* {
  box-sizing: border-box;
}
@origin: 10px;
.row-flow {
  width: 100%;
}
.common-input {
  width: @origin*28;
}
.map-app {
  display: flex;
  flex-direction: column;
  border: 1px solid #cccccc;
  position: absolute;
  top: 90px;
  bottom: 20px;
  left: 225px;
  right: 20px;
  .main {
    display: flex;
    flex: 1;
    .content-center {
      border-left: 1px solid #cccccc;
      border-right: 1px solid #cccccc;
      height: 100%;
      flex: 1;
      position: relative;
      min-width: 400px;
      overflow: hidden;
      .button-group {
        margin: 20px;
      }
      #tilemap {
        width: 100%;
        height: 750px;
        background-color: #ccc;
      }
    }
    .content-left {
      height: 100%;
      width: 350px;
      .search-form {
        overflow: hidden;
        padding: @origin 0;
        .common-input {
          margin: 15px auto;
        }
        .search-toolbar {
          margin-top: 20px;
          padding: 5px 0 5px 110px;
          width: 100%;
          height: 40px;
        }
      }
      .list-fence {
        ul {
          height: 350px;
          overflow-y: auto;
          padding-left: 20px;
          padding-right: 20px;
          li {
            border-bottom: solid 1px #aaa;
            margin-top: 10px;
            padding-top: 5px;
            padding-bottom: 5px;
            overflow: hidden;
          }
          .fence-list {
            overflow: hidden;
          }
          .fence-name {
            float: left;
            width: 140px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .fence-edit {
            margin-top: -2px;
            float: right;
          }
          .device-list {
            overflow: hidden;
            .el-button {
              float: left;
            }
            p {
              margin-top: 5px;
              float: right;
              width: 200px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
    .search-sence-area {
      flex: 0 0 200px;
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>
