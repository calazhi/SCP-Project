<template>
  <div class="map-app">
    <div class="row-flow main">
      <div class="content-center">
        <div class="top">
          <el-button :type="btnType" @click="onParkingEdit" :data-flag="editFlag">{{msg}}</el-button>
          <el-button type="primary" @click="onParkingDelete">删除</el-button>
          <el-button type="primary" @click="onParkingSave">完成</el-button>
        </div>
        <div id="mapParkingDiv" @drop="onDrop($event)" @dragover="onAllowDrop($event)"></div>
      </div>
      <div class="content-left">
        <form class="form scence-form">
          <div class="row-item">
            <span class="name-span">车场类型</span>
            <el-select @change="onAreaTypeCheck()" v-model="parkAreaType" clearable placeholder="请选择">
              <el-option v-for="item in parkAreaTypes" :value="item.itemCode" :label="item.itemName" :key="item.id">{{ item.itemName }}</el-option>
            </el-select>
          </div>
          <div class="row-item">
            <span class="name-span">车场名称</span>
            <el-input placeholder="请输入内容" v-model.trim="parkAreaName"></el-input>
          </div>
          <div class="row-item">
            <el-button type="primary" @click="onAreaTypeCheck()">查询</el-button>
            <el-button type="primary" @click="onAreaTypeReset()">重置</el-button>
          </div>
        </form>
        <div class="park-list">
          <span v-for="(item, $index) in sceneListInfo" :key="item.id" @click="onParkSelect(item, $index)" :class="{'active':currentScene === $index }" :title="item.sceneName">{{ item.sceneName }}</span>
        </div>
      </div>
      <div class="content-right">
        <el-form action="" class="form area-form">
          <div class="row-item">
            <span class="name-span">所属组织</span>
            <el-popover ref="orgPopover" placement="top-end" width="184" v-model="isShowPopover">
              <OrgTreeView ref="orgTree" @node-click="onHandleNodeClick"></OrgTreeView>
            </el-popover>
            <el-input v-model="OrgName" placeholder="请选择组织" readonly v-popover:orgPopover @focus="propOrgDara"></el-input>
          </div>
          <div class="row-item">
            <el-button type="primary" @click="onParkingQuery">查询</el-button>
            <el-button type="primary" @click="onParkingReset">重置</el-button>
          </div>
        </el-form>
        <div class="lot-list">
          <span draggable="true" :title="item.carportCode" @dragstart="onDrag($event, item)" v-for="(item, $index) in parkInfoList" :key="$index" @click="onParkingClick(item)">{{ item.carportCode }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrgTree, getDictionary, getSceneList, getSceneInfo, getParkList, addArea, getAreaList, deleteArea, updateArea } from '@/views/MapApp/apis/index.js'
import { mapOptionFormat, extendObj, LOG_TAG } from '@/views/MapApp/assets/js/index.js'
import hdmap from 'hdmap'
import parkLotImg from '@/views/MapApp/assets/images/park_lot.png'
import OrgTreeView from '@/components/TreeView'
export default {
  components: {
    OrgTreeView
  },
  data () {
    return {
      currentScene: 0,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dragImg: null,
      parkAreaTypes: [],
      parkInfoList: [],
      parkAreaType: '2',
      parkAreaName: '',
      orga: {},
      treeDatas: {
        tData: []
      },
      editFlag: false,
      msg: '开启车位编辑',
      sceneListInfo: [],
      OrgName: '',
      orgId: '',
      exportOrgNode: {},
      isShowPopover: false,
      filterText: '',
      dragObj: {},
      mapObj: null,
      curSceneId: '',
      cacheMapList: [],
      parkIdarr: [],
      curEditareas: [],
      selectCar: '',
      areaStyleObj: { 'fillColor': 'orange', 'strokeColor': 'red', 'strokeWidth': '2' },
      btnType: 'primary',
      cacheParkInfo: ''
    }
  },
  mounted: function () {
    this.dragImg = new Image()
    this.dragImg.src = parkLotImg
    this.onAreaTypeCheck()
    getOrgTree().then((res) => {
      this.exportOrgNode.rootUuid = res.data.data.uuid
      this.treeDatas.tData.splice(0, this.treeDatas.tData.length)
      this.treeDatas.tData.push(res.data.data)
      this.loading = false
    }).catch(e => {
      console.warn(LOG_TAG + '获取组织树失败')
      console.warn(e)
    })
    getSceneList({
      sceneName: '',
      sceneType: '2'
    }).then((res) => {
      // TODO 初始化地图
      if (res.data.data && res.data.data.length > 0) {
        this.curSceneId = res.data.data[0].id
        var data = { 'sceneId': res.data.data[0].id }
        this.mapFresh(data)
      }
    }).catch(err => {
      console.warn(LOG_TAG + 'getSceneList接口调用err')
      console.warn(err)
    })
    getDictionary().then((res) => {
      // 选取场景类型为停车场的 2
      var list = res.data.data.dictCodeType.sceneType
      var len = list.length
      var arr = []
      for (var i = 0; i < len; i++) {
        if (list[i].itemCode === '2') {
          arr.push(list[i])
        }
      }
      this.parkAreaTypes = arr
    }).catch(e => {
      console.warn(LOG_TAG + '获取字典表失败')
      this.parkAreaType = ''
      console.warn(e)
    })
  },
  methods: {
    /**
    * @description 停车场 停车场类型重置
    */
    onAreaTypeReset: function () {
      // this.parkAreaType = ''
      this.parkAreaName = ''
      this.onAreaTypeCheck()
    },
    /**
     * @description 停车场 车位选中
     */
    onParkingClick: function (item) {
      if (!this.mapObj) {
        return
      }
      let deviceName = item.carportCode
      let that = this
      if (that.curSceneId) {
        getAreaList({
          sceneId: that.curSceneId,
          areaType: 7
        }).then(res => {
          let arr = res.data.data
          let len = arr.length
          for (let i = 0; i < len; i++) {
            if (deviceName === arr[i].areaName) {
              let centerPos = arr[i].borderJson.center
              if (centerPos[0] === null) {
                that.$message({
                  message: '当前设备在场景中有对应的车位，但是坐标数据有误，无法显示！',
                  type: 'warning'
                })
              } else {
                that.mapObj.popupDefault(centerPos, deviceName)
              }
              return
            }
          }
        }).catch(err => {
          console.warn(LOG_TAG + '调用getAreaList失败')
          console.warn(err)
        })
      } else {
        that.$message({
          message: '请先选中场景！',
          type: 'warning'
        })
      }
    },
    /**
     * @description 停车场 初始化地图
     * @param {Object} option 地图初始化的对象参数
     */
    createMap: function (option) {
      console.log(LOG_TAG + 'createMap begin')
      this.areaSceneInfo = option
      let that = this
      // 获取小区真实地图图片
      let mapImageUrl = option.url
      let mapWidth = option.width
      let mapHeight = option.height
      if (this.mapObj) {
        this.mapObj.closeDrawShapeTool()
        this.mapObj.clearDrawShape()
        this.mapObj.closePopup()
        this.mapObj.getMap().setTarget(null)
      }
      // 已经初始化的地图可以直接获取地图对象，进行地图的替换即可
      if (this.cacheMapList[option.id]) {
        this.mapObj = this.cacheMapList[option.id]
        this.mapObj.getMap().setTarget('mapParkingDiv')
        this.mapObj.closeDrawShapeTool()
        this.mapObj.clearDrawShape()
        return
      }
      // 如果没有初始化过，才需要进行地图的初始化
      let formatedOption = mapOptionFormat(option)
      let mapOption = extendObj(formatedOption, {
        gisEngine: 'tile',
        domId: 'mapParkingDiv',
        mapUrl: mapImageUrl,
        sizeW: mapWidth,
        sizeH: mapHeight,
        maxZoom: option.maxZoom,
        minZoom: option.minZoom,
        zoom: 2,
        center: [0, 0],
        centerGPS: [option.centerLon, option.centerLat],
        scale: option.scale,
        scaleType: option.scaleType,
        arcAngle: option.arcAngle
      })
      // eslint-disable-next-line
      this.cacheMapList[option.id] = new hdmap.initMap(mapOption)
      this.mapObj = this.cacheMapList[option.id]
      this.mapObj.getMap().setTarget('mapParkingDiv')
      this.mapObj.closeDrawShapeTool()
      this.mapObj.clearDrawShape()
      // 给地图注册点击事件
      this.mapObj.regEventListener('singleclick', function (e) {
        that.mapObj.closeDrawShapeTool()
        that.mapObj.clearDrawShape()
        that.mapObj.closePopup()
        if (e.feature) {
          let pointsArr = e.feature.borderPoints[0]
          let len = pointsArr.length
          let newArr = []
          if (len === 5) {
            // 引用类型，单个赋值，取前四个坐标
            for (let i = 0; i < len - 1; i++) {
              newArr[i] = pointsArr[i]
            }
            let centerPos = hdmap.utils.getGeometryCenter(newArr)
            that.mapObj.popupDefault(centerPos, e.feature.name)
            if (that.btnType === 'success') {
              e.feature.areaTypesOf = 'parking'
              if (that.selectCar === '' && that.cacheParkInfo === '') {
                that.mapObj.editDrawShape(e.feature)
                that.selectCar = e.feature
                that.cacheParkInfo = e.feature
              } else if (e.feature.rotate !== e.feature.originRotate) {
                e.feature.rotate = e.feature.originRotate
                that.mapObj.editDrawShape(e.feature)
                that.selectCar = e.feature
              } else if (e.feature.rotate === e.feature.originRotate) {
                that.mapObj.editDrawShape(e.feature)
                that.selectCar = e.feature
              }
            }
          }
        } else {
          that.mapObj.closePopup()
        }
      })
    },
    /**
     * @description 停车场 右边车位列表
     */
    onParkingQuery: function () {
      var data = { 'orgId': this.orgId }
      var that = this
      if (!this.orgId) {
        this.$message({
          message: '请选择组织树',
          type: 'warning'
        })
      } else {
        getParkList(data).then(res => {
          that.parkInfoList = res.data.data
        }).catch(err => {
          console.log(LOG_TAG + '调用getParkList失败')
          console.warn(err)
        })
      }
    },
    /**
     * @description 停车场 车位列表信息重置
     */
    onParkingReset: function () {
      this.OrgName = ''
      this.orgId = ''
    },
    /**
     * @description 停车场 车位编辑
     */
    onParkingEdit: function () {
      if (!this.editFlag) {
        if (this.mapObj) {
          this.editFlag = true
          this.msg = '关闭车位编辑'
          this.btnType = 'success'
        } else {
          this.$message({
            message: '请先选择场景',
            type: 'warning'
          })
        }
        // 关闭车位编辑
      } else {
        this.editFlag = false
        this.msg = '开启车位编辑'
        this.btnType = 'primary'
        this.mapObj.closeDrawShapeTool()
        this.mapObj.clearDrawShape()
        this.selectCar = ''
      }
    },
    /**
     * @description 停车场 车位删除
     */
    onParkingDelete: function () {
      let that = this
      // 获取到当前区域的id
      let deleteCarIdList = []
      if (that.mapObj) {
        deleteCarIdList.push(this.selectCar.originId)
        console.log(LOG_TAG + 'Here is selectCar')
        if (that.selectCar !== '' && that.btnType === 'success') {
          deleteArea({ areaIds: deleteCarIdList }).then(res => {
            that.mapObj.removeArea(that.selectCar)
            that.$message({
              message: '删除成功',
              type: 'success'
            })
            that.selectCar = ''
            that.mapObj.closeDrawShapeTool()
            that.mapObj.clearDrawShape()
            that.btnType = 'primary'
            that.msg = '开启车位编辑'
            that.editFlag = false
          }).catch(e => {
            console.log(LOG_TAG + 'delete fail')
            console.warn(e)
            that.$message({
              message: '删除失败',
              type: 'warning'
            })
          })
        } else if (that.btnType === 'success') {
          that.$message({
            message: '请选择车位',
            type: 'warning'
          })
        } else {
          that.$message({
            message: '请先开启车位编辑，选择车位',
            type: 'warning'
          })
        }
        that.mapObj.closePopup()
      } else {
        that.$message({
          message: '请先选择停车场',
          type: 'warning'
        })
      }
    },
    /**
     * @description 停车场 编辑车位保存
     */
    onParkingSave: function () {
      let that = this
      if (that.btnType === 'primary') {
        that.$message({
          message: '请先开启编辑！',
          type: 'warning'
        })
      } else {
        // 如果有选中车位
        if (that.selectCar.id) {
          let editedDate = that.mapObj.showDrawShape({
            id: that.selectCar.id,
            name: that.selectCar.name,
            areaType: 7
          })
          let obj = editedDate
          if (obj === null) {
            that.$message({
              message: '你没有选中车位！',
              type: 'warning'
            })
          } else {
            obj.visible = true
            let len = obj.extProperties.borderPoints[0].length
            let newArr = []
            for (let i = 0; i < len - 1; i++) {
              newArr[i] = obj.extProperties.borderPoints[0][i]
            }
            let centerPos = hdmap.utils.getGeometryCenter(newArr)
            let commitDate = {
              areaId: obj.originId,
              areaName: obj.extProperties.areaName,
              areaType: 7,
              borderJson: {
                borderPoints: obj.extProperties.borderPoints,
                center: centerPos,
                rotate: obj.rotate
              },
              deviceId: that.selectCar.id
            }
            // 调用updateArea接口
            updateArea(commitDate).then(res => {
              if (res.data.code === '00000') {
                that.$message({
                  message: '更新成功！',
                  type: 'success'
                })
                that.selectCar.borderPoints = obj.extProperties.borderPoints
                that.selectCar.rotate = obj.rotate
                that.selectCar.originRotate = obj.rotate
                that.mapObj.addArea(that.selectCar, that.areaStyleObj)
                that.selectCar = ''
              } else {
                that.$message.error('更新失败！')
                that.mapObj.removeArea({ id: that.selectCar.id })
                that.selectCar.rotate = that.selectCar.originRotate
                that.mapObj.addArea(that.selectCar, that.areaStyleObj)
              }
            }).catch(err => {
              console.warn(LOG_TAG + '调用updateArea失败')
              console.warn(err)
              that.mapObj.removeArea({ id: that.selectCar.id })
              that.selectCar.rotate = that.selectCar.originRotate
              that.mapObj.addArea(that.selectCar, that.areaStyleObj)
            })
            that.btnType = 'primary'
            that.msg = '开启车位编辑'
            that.editFlag = false
          }
        } else {
          that.$message({
            message: '你没有选中车位！',
            type: 'warning'
          })
          that.selectCar = ''
        }
      }
    },
    /**
     * @description 停车场 区域类型检查
     */
    onAreaTypeCheck: function () {
      var sceneType = this.parkAreaType
      var sceneName = this.parkAreaName
      if (!sceneType && !sceneName) {
        this.$message({
          message: '请选择场景类型或填写车场名称',
          type: 'warning'
        })
      } else {
        var data = { 'sceneType': sceneType, 'sceneName': sceneName }
        getSceneList(data).then((res) => {
          if (res.data.code === '00000') {
            this.sceneListInfo = res.data.data
          }
        }).catch(err => {
          console.warn(LOG_TAG + '调用getSceneList失败')
          console.warn(err)
        })
      }
    },
    /**
     * @description 停车场 车场选择
     */
    onParkSelect: function (item, $index) {
      this.selectCar = ''
      this.currentScene = $index
      var sceneId = item.id
      this.curSceneId = sceneId

      // 开始去获取地图
      var data = { 'sceneId': sceneId }
      this.mapFresh(data)
    },
    /**
     * @description 停车场 地图刷新
     * @param {Object} data 场景信息
     */
    mapFresh: function (data) {
      console.log(LOG_TAG + 'mapFresh begin')
      let that = this
      getSceneInfo(data).then(res => {
        if (res.data.data) {
          var sdata = { sceneId: data.sceneId, areaType: 7 }
          that.createMap(res.data.data)
          // 获取该场景的全部车位
          getAreaList(sdata).then(res => {
            var parkLotInfo = res.data.data
            var len = parkLotInfo.length
            var areas = []
            for (let k = 0; k < len; k++) {
              let obj = {}
              obj.originId = parkLotInfo[k].id
              obj.id = parkLotInfo[k].deviceId
              let parkBorderPoints = parkLotInfo[k].borderJson.borderPoints
              // 判断坐标数组形式是否正确，将其转成正确格式
              if (parkBorderPoints && parkBorderPoints.length === 5) {
                parkBorderPoints = [parkLotInfo[k].borderJson.borderPoints]
              } else if (parkBorderPoints.length === 1) {
                if (parkBorderPoints[0].length === 5) {
                  parkBorderPoints = parkLotInfo[k].borderJson.borderPoints
                }
              }
              if (parkBorderPoints[0].length !== 5) {
                console.log(LOG_TAG + '车位顶点坐标个数有问题！')
              } else {
                obj.borderPoints = parkBorderPoints
                obj.areaName = parkLotInfo[k].areaName
                obj.name = parkLotInfo[k].areaName
                obj.areaType = parkLotInfo[k].areaType
                obj.originRotate = parkLotInfo[k].borderJson.rotate
                obj.rotate = parkLotInfo[k].borderJson.rotate
                obj.areaTypesOf = 'parking'
                obj.visible = true
                // 获取车位信息添加车位
                that.mapObj.addArea(obj, that.areaStyleObj)
                areas.push(obj)
              }
            }
            that.curEditareas = areas
          }).catch(err => {
            console.warn(LOG_TAG + '调用getAreaList失败')
            console.warn(err)
          })
        } else {
          console.log(LOG_TAG + '场景信息为空')
        }
      }).catch(err => {
        console.warn(LOG_TAG + '调用getSceneInfo失败')
        console.warn(err)
      })
    },
    /**
     * @description 停车场 右侧车位拖拽开始dragstart函数
     * @param {Object} $event Event 对象
     * @param {Object} item 拖动的车位信息
     */
    onDrag: function ($event, item) {
      this.dragObj = item
      this.parkIdarr.push(item.carportCode)
      // 设置拖拽时显示的图片
      // var isIE = (typeof document.createElement('span').dragDrop === 'function')
      // if (!isIE) {
      //   $event.dataTransfer.setDragImage(this.dragImg, 20, 40)
      // }
      try {
        $event.dataTransfer.setDragImage(this.dragImg, 20, 40)
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * @description 停车场 车位拖拽结束的dragend事件
     * @param {Object} $event Event对象
     */
    onDrop: function ($event) {
      let that = this
      if (!this.mapObj) {
        this.$message({
          message: '请先选择场景',
          type: 'warning'
        })
        return
      }
      var parkingInfo = this.dragObj
      let coordinate = this.mapObj.getMap().getEventCoordinate($event)
      let points = hdmap.utils.getParkingCoordinates(coordinate)
      let obj = {
        id: '',
        name: parkingInfo.carportCode,
        areaType: '7',
        borderPoints: points,
        areaTypesOf: 'parking',
        originRotate: 0,
        visible: true
      }
      var _center = hdmap.utils.getGeometryCenter(points[0])
      var addobj = {
        areaName: parkingInfo.carportCode,
        areaType: 7,
        borderJson: {
          borderPoints: points,
          rotate: 0,
          center: _center
        },
        deviceId: parkingInfo.carportCode,
        sceneId: this.curSceneId
      }
      console.log(LOG_TAG + '新增区域提交的参数：：：')
      addArea(addobj).then(res => {
        // 车位已经存在
        if (res.data.code === '00001') {
          let msg = res.data.message
          that.$message({
            message: msg,
            type: 'warning'
          })
          // 车位不存在
        } else {
          console.log(LOG_TAG + '该车位可用！！！')
          obj.id = parkingInfo.carportCode
          obj.originId = res.data.data.id
          that.mapObj.addArea(obj, that.areaStyleObj)
          that.$message({
            message: '车位添加成功！',
            type: 'success'
          })
          that.curEditareas.push(obj)
          that.btnType = 'success'
          that.msg = '关闭车位编辑'
          that.editFlag = true
        }
      }).catch(e => {
        console.warn(e)
      })
    },
    /**
     * @description 停车场 dragover事件
     * @param {Object} $event Event对象
     */
    onAllowDrop: function ($event) {
      $event.preventDefault()
    },
    /**
     * @description ElementUI 的功能函数
     */
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    /**
     * @description ElementUI 的功能函数
     */
    onHandleNodeClick: function (data) {
      this.orga = data
      this.orgId = data.uuid
      this.OrgName = data.name
      this.isShowPopover = false
      this.filterText = ''
    },
    /**
  *@description 输入框focus时，进行传值
  */
    propOrgDara () {
      console.log('父组件propOrgDara')
      this.$refs['orgTree'].treeDatas = this.treeDatas
    }
  },
  watch: {
    /**
     * @description 关键字过滤
     */
    filterText (val) {
      this.$refs.tree.filter(val)
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
  margin-left: 0;
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

.map-app {
  /* 头、中部、脚纵向显示 */
  display: flex;
  flex-direction: column;
  border: 1px solid #cccccc;
  min-width: 1000px;
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
      .top {
        width: 100%;
        height: 40px;
        margin-top: 20px;
        background: none;
        padding-left: 40px;
      }
      #mapParkingDiv {
        width: 96%;
        height: 720px;
        margin: 25px auto;
        background: #ccc;
      }
    }
    .content-left {
      order: -1;
    }
    .content-right,
    .content-left {
      display: flex;
      flex-direction: column;
      height: 100%;
      flex: 0 0 300px;
      .form {
        width: 100%;
        height: 200px;
        border-bottom: 1px solid #ccc;
        .row-item {
          width: 100%;
          height: 40px;
          margin-top: 20px;
          background: none;
          text-align: center;
          .el-input,
          .el-select {
            width: 70%;
          }
          display: inline-block;
          .name-span {
            width: auto;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            color: #666;
            margin-right: 5px;
          }
        }
      }
      .scence-form {
        flex: 0 0 200px;
      }
      .area-form {
        flex: 0 0 140px;
      }
    }

    .content-left .park-list,
    .content-right .lot-list {
      width: 90%;
      height: 690px;
      background: none;
      margin: 15px auto;
      overflow-y: scroll;
    }
    .content-right .lot-list {
      height: 750px;
    }
    .content-left .park-list span,
    .content-right .lot-list span {
      display: block;
      height: 40px;
      line-height: 40px;
      width: 200px;
      text-decoration: none;
      font-size: 14px;
      color: #666;
      border-bottom: 1px solid #ccc;
      text-indent: 10px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .content-left .park-list span:hover,
    .content-right .lot-list span:hover {
      background: #3098ef;
      color: #fff;
    }
    .content-left .park-list span.active {
      background: #3098ef;
      color: #fff;
    }
  }
}
</style>