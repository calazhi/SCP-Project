<template>
  <div class="map-app">
    <div class="row-flow main">
      <div class="content-left">
        <div class="search-sence-area">
          <el-form label-width="80px" class="search-form">
            <!--场景类型模块-->
            <el-form-item label="场景类型" label-width="80px">
              <el-select v-model="sceneParam.sceneType" placeholder="请选择场景类型" @change="onTypeChange()">
                <el-option v-for="item in SceneTypes" :label="item.itemName" :value="item.itemCode" :key="item.itemCode"></el-option>
              </el-select>
            </el-form-item>
            <!--场景名称模块-->
            <el-form-item label="场景名称">
              <el-input style="width:217px" v-model="sceneParam.sceneName" maxLength="" placeholder="请输入场景名称"></el-input>
            </el-form-item>
            <!--按钮模块-->
            <div class="search-toolbar">
              <el-button type="primary" @click.stop="onTypeChange()">查询</el-button>
              <el-button type="primary" @click="onSceneReset()">重置</el-button>
            </div>
          </el-form>
        </div>
        <!--场景列表模块-->
        <div class="list-area">
          <ul>
            <li :title="sceneItem.sceneName" v-for="sceneItem in sceneList" :key="sceneItem.id" class="list-item" :class="{ active: sceneItem.id == sceneId }" @click="onSceneShow(sceneItem.id)">
              {{ sceneItem.sceneName }}
            </li>
          </ul>
        </div>
      </div>
      <!--地图模块-->
      <div class="content-center">
        <div id="mapDiv"></div>
      </div>
      <div class="content-right">
        <el-form class="form" ref="form" label-width="80px">
          <!--设备类型模块-->
          <el-form-item label="设备类型">
            <el-select v-model="deviceType" placeholder="请选择设备类型" :disabled='isDisabledC' @change="onDeviceTypeChange">
              <el-option v-for="item in deviceTypes" :key="item.deviceTypeCode" :label="item.deviceTypeDesc" :value="item.deviceTypeCode"></el-option>
            </el-select>
            <el-button class="refresh" size="small" type="info" round plain icon="el-icon-refresh" @click="_refresh">刷新</el-button>
          </el-form-item>
        </el-form>
        <!--点位操作按钮模块-->
        <div class="button-group">
          <el-button type="primary" @click="patchMap()">批量预览</el-button>
          <el-button type="primary" @click="addClick()" :disabled='isDisabledA'>批量新增</el-button>
          <el-button type="primary" @click="deleteClick()" :disabled='isDisabledB'>批量删除</el-button>
        </div>
        <!--设备列表模块-->
        <div class="tables">
          <el-table ref="multipleTable" :data="deviceList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" @row-click="popupPointInfo">
            <el-table-column type="selection" :selectable='checkboxInit' width="45">
            </el-table-column>
            <el-table-column prop="deviceCode" label="设备类型" width="80">
            </el-table-column>
            <el-table-column label="设备名称" class="deviceName" width="150">
              <template slot-scope="scope">
                <!--主设备以‘2’开头-->
                <span v-if="scope.row.deviceCode.indexOf('2') !== 0" style="padding-left:20px;">{{scope.row.deviceName}}</span>
                <span v-else>{{scope.row.deviceName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="配置地图" width="140">
              <template slot-scope="scope">
                <span v-if="scope.row.status === '在当前地图已配置'" style="color: red">{{scope.row.status}}</span>
                <span v-else-if="scope.row.status === '在其他地图已配置'" style="color: blue">{{scope.row.status}}</span>
                <span v-else-if="scope.row.status === 'GPS'" style="font-weight:700">{{scope.row.status}}</span>
                <span v-else>{{scope.row.status}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!--引入点位信息编辑页-->
    <marker-info ref="MarkerInfo" @customEvent="addMarker()" @deviceStoreEvent="changeDeviceStore()" @deviceTableRefrash="_refresh"></marker-info>
  </div>
</template>

<script>
import { getSceneList, getDeviceList, deleteMarker, getDictionary, getSceneInfo, getMarkerList } from '@/views/MapApp/apis/index.js'
import hdmap from 'hdmap'
import MarkerInfo from '@/views/MapApp/components/MarkerInfo.vue'
import { mapOptionFormat, markerListFormat, extendObj, scaleMap, LOG_TAG } from '@/views/MapApp/assets/js/index1.js'
import { getImgByType } from '@/views/MapApp/assets/js/image_manager.js'
import { getMarkerTypeByDeviceCode, addFilter } from '@/views/MapApp/assets/js/device_marker.js'
import { assignDevice } from '@/views/MapApp/assets/js/assign_device.js'
import warnImg from '@/views/MapApp/assets/images/warn.png'
const manyDeviceCode = ['2005', '2020', '2038']
export default {
  components: {
    MarkerInfo
  },
  data () {
    return {
      multipleSelection: [],
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
      // 场景Id
      sceneId: '',
      // 当前场景ID
      currentSceneId: '',
      firstSceneId: '',
      deviceList: [],
      deviceType: '',
      deviceTypes: [],
      deviceTypesSquare: [],
      deviceTypesCar: [],
      zooms: [],
      minZoom: '',
      markerTypes: [],
      floorTypes: [],
      currentLayer: 'commonLayer',
      // 当前点位列表
      markerList: [],
      markerListB: [],
      markerListC: [],
      isDisabledA: false,
      isDisabledB: false,
      isDisabledC: false,
      // 映射的设备列表
      mapDeviceList: [],
      mapDeviceStore: []
    }
  },
  mounted: function () {
    getDictionary()
      .then((res) => {
        let dictionary = res.data.data
        // 在数据词典里查询楼层类型
        this.floorTypes = dictionary.dictCodeType.floorType
        // 在数据词典里查询点位类型
        for (let i = 0; i < dictionary.dictCodeType.markerType.length; i++) {
          let temp = ['1', '2', '4', '5', '6', '8', '9']
          if (temp.indexOf(dictionary.dictCodeType.markerType[i].itemCode) !== -1) {
            this.markerTypes.push(dictionary.dictCodeType.markerType[i])
          }
        }
        for (let j = 0; j < dictionary.deviceType.length; j++) {
          let temps = ['2001', '2002', '2003', '2004', '2022', '2019', '2010', '2005', '2009', '2011', '2020', '2021']
          // 从数据词典查询(小区全图)设备类型
          if (temps.indexOf(dictionary.deviceType[j].deviceTypeCode) !== -1) {
            this.deviceTypesSquare.push(dictionary.deviceType[j])
          }
          this.deviceTypes = this.deviceTypesSquare
          // 从数据词典查询(停车场)设备类型
          if (temps.indexOf(dictionary.deviceType[j].deviceTypeCode) !== -1) {
            this.deviceTypesCar.push(dictionary.deviceType[j])
          }
        }
        // 选取场景类型sceneType.itemCode为1,2的小区全图和停车场
        let list = res.data.data.dictCodeType.sceneType
        let arr = []
        for (let k = 0; k < list.length; k++) {
          if (list[k].itemCode === '1' || list[k].itemCode === '2') {
            arr.push(list[k])
          }
        }
        this.SceneTypes = arr
        // 初始化选择sceneType.itemCode为1的小区全图
        this.sceneParam.sceneType = this.SceneTypes[0].itemCode
        // 初始化获取场景列表
        getSceneList(this.sceneParam)
          .then((res) => {
            this.sceneList = res.data.data
            this.sceneId = this.sceneList[0].id
            // 把小区全图的id保存起来
            this.firstSceneId = this.sceneId
            // 初始化加载场景信息
            let options = {}
            options.sceneId = this.sceneId
            getSceneInfo(options)
              .then((res) => {
                // TODO 切换地图
                this.onMapCreate(res.data.data)
                // 加载第一种类型的设备
                this.deviceType = '2001'
                this.onDeviceTypeChange()
              })
              .catch(err => {
                console.warn(LOG_TAG + 'getSceneInfo获取场景信息err')
                console.warn(err)
              })
          })
          .catch(err => {
            console.warn(LOG_TAG + 'getSceneList接口调用err')
            console.warn(err)
          })
      })
      .catch(err => {
        console.warn(LOG_TAG + 'getDictionary接口调用err')
        console.warn(err)
      })
  },
  methods: {
    /**
     *@description 查看设备的点位信息
     **/
    popupPointInfo (row, event, column) {
      let sceneId = this.currentSceneId
      if (row.status === '在当前地图已配置') {
        // 调用getMarkerList 接口传入sceneId,deviceId
        getMarkerList({ sceneId: sceneId, deviceId: row.deviceId }).then(res => {
          if (res.data.code === '00000') {
            // 遍历根据 sceneId 拿markerId,存在设备对应多个点位，通用方法遍历
            res.data.data.forEach(item => {
              if (item.sceneId === sceneId) {
                this.mapObj.popupDefault([item.positionX, item.positionY], item.markerName)
              }
            })
          }
        })
      }
    },
    /**
     * @augments MarkerInfo页面触发此函数,批量新增时点位渲染到地图
     *  */
    addMarker () {
      // 在引擎上添加点位
      this.markerListC = []
      console.log('this.multipleSelection: ')
      console.log(this.multipleSelection)
      for (let p = 0; p < this.multipleSelection.length; p++) {
        let markerObj = {}
        let gps2 = [Number(this.multipleSelection[p].gps[0]), Number(this.multipleSelection[p].gps[1])]
        let pos2 = this.mapObj.transfromWGSToBitMap(gps2)
        markerObj.id = this.multipleSelection[p].deviceId
        markerObj.markerType = getMarkerTypeByDeviceCode(this.multipleSelection[0].deviceCode)
        markerObj.imgUrl = getImgByType(markerObj.markerType)
        markerObj.markerName = this.multipleSelection[p].deviceName
        markerObj.position = pos2
        this.markerListC.push(markerObj)
      }
      this.mapObj.addMarkers(this.markerListC, scaleMap)
      // 更新设备列表状态
      this.onDeviceTypeChange()
    },
    /**
     * @augments 点击事件，获取所有选择的点位信息存入markerList
     * */
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.mapDeviceList = this.multipleSelection
      // 批量点位信息的汇总
      this.markerList = []
      let gps2 = []
      for (let p = 0; p < this.multipleSelection.length; p++) {
        let markerObj = {}
        if (this.multipleSelection[p].gps && this.multipleSelection[p].gps !== '') {
          gps2 = [Number(this.multipleSelection[p].gps[0]), Number(this.multipleSelection[p].gps[1])]
        }
        let pos2 = this.mapObj.transfromWGSToBitMap(gps2)
        markerObj.sceneId = this.sceneId
        markerObj.markerName = this.multipleSelection[p].deviceName
        markerObj.deviceId = this.multipleSelection[p].deviceId
        markerObj.longitude = gps2[0]
        markerObj.latitude = gps2[1]
        markerObj.positionX = pos2[0]
        markerObj.positionY = pos2[1]
        this.markerList.push(markerObj)
      }
      console.log('勾选的时候获取的this.markerList: ')
      console.log(this.markerList)
    },
    /**
     * @augments 点位批量删除
     */
    deleteClick () {
      // 判断点位的合法性
      let that = this
      let mapDeviceList = this.mapDeviceList
      // let deleteMarkerList = []
      if (!mapDeviceList || mapDeviceList.length === 0) {
        this.$message({
          message: '请选择要删除的设备',
          type: 'warning'
        })
        return false
      }
      /**
       * 针对status 进行判断,  不能删除的情况status：GPS,在其他地图已配置
      */
      for (let i = 0; i < mapDeviceList.length; i++) {
        if (!(mapDeviceList[i].status === '在当前地图已配置')) {
          this.$message({ message: '存在设备未映射点位或者不在当前地图，请检查', type: 'warning' })
          return false
        }
      }
      this.$confirm('确定要刪除该点位吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        let markerVo = {}
        markerVo.deviceIds = []
        markerVo.markerIds = []
        for (let k = 0; k < mapDeviceList.length; k++) {
          // 根据deviceId拿到markerId
          // deleteMarkerList.push(mapDeviceList[k].deviceMarkers[0].id)
          markerVo.markerIds.push(mapDeviceList[k].deviceMarkers[0].id)
        }
        // 从数据库中删除点位
        deleteMarker(markerVo)
          .then((res) => {
            if (res.status === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              that.onDeviceTypeChange()
              // 将点位从图上清除, 考虑车闸和电梯
              // 需要改造，直接传入deviceId删除点位，无需遍历点位
             // let manyDeviceCode = ['2005', '2020', '2038']
              for (let j = 0; j < mapDeviceList.length; j++) {
                if (manyDeviceCode.indexOf(mapDeviceList[j].deviceCode) === -1) {
                  that.mapObj.removeMarkerBylayerKey(mapDeviceList[j].deviceId, that.currentLayer)
                  that.mapObj.closePopup()
                } else {
                  // 遍历，判断场景ID=== sceneId
                  mapDeviceList[j].deviceMarkers.forEach(item => {
                    if (that.currentSceneId === item.sceneId) {
                      that.mapObj.removeMarkerBylayerKey(mapDeviceList[j].deviceId, that.currentLayer)
                      that.mapObj.closePopup()
                    }
                  })
                }
              }
            }
          })
          .catch(err => {
            console.warn(LOG_TAG + 'deleteMarker接口调用err')
            console.warn(err)
          })
      }).catch(err => {
        console.warn(LOG_TAG + '取消删除')
        console.warn(err)
      })
      this._refresh()
    },
    // 设备列表刷新
    _refresh: function () {
      this.onDeviceTypeChange()
    },
    /**
     * @augments点位批量映射
     * */
    patchMap: function () {
      let newMapDeviceList = this.mapDeviceList
      // 只有当status：GPS时，才可预览
      for (let i = 0; i < newMapDeviceList.length; i++) {
        if (!(newMapDeviceList[i].status === 'GPS')) {
          this.$message({
            message: '存在设备已配置，请重新选择预览',
            type: 'warning'
          })
          return false
        }
      }
      this.mapDeviceStore.push(newMapDeviceList)
      let oldMapDeviceList = this.mapDeviceStore.length > 1 ? this.mapDeviceStore[this.mapDeviceStore.length - 2] : []
      // 先清除图层上的点位，再addMarker显示
      for (let i = 0; i < oldMapDeviceList.length; i++) {
        let oldMapDeviceInfo = oldMapDeviceList[i]
        this.mapObj.removeMarkerBylayerKey(oldMapDeviceInfo.deviceId, this.currentLayer)
        this.mapObj.closePopup()
      }
      for (let i = 0; i < newMapDeviceList.length; i++) {
        let mapDeviceInfo = newMapDeviceList[i]
        this.popupShow(mapDeviceInfo, this.markerList[0].sceneId)
      }
    },
    changeDeviceStore: function () {
      this.mapDeviceStore = []
    },
    /* @description 点击设备列表预览的逻辑封装
      * @param { Object } deviceItem 当前列表信息
        * @param { Object } vm vue 的实例对象----- this
          * @param { Object } sceneId 当前地图场景ID
      */
    popupShow (deviceItem, sceneId) {
      let previewMarker = {}
      var gps = deviceItem.gps || deviceItem.subGps
      if (gps) {
        gps[0] = Number(gps[0])
        gps[1] = Number(gps[1])
        // TODO 判断gps点是否在地图可视区域
        var isTrue = this.mapObj.isInTileMapViewArea(gps, true)
        if (!isTrue) {
          this.$message({
            message: 'GPS点位不在地图可视区域内',
            type: 'warning'
          })
          return
        }
        // TODO 在地图出现点位映射标志，同时出现保存和删除按钮
        var position = this.mapObj.transfromWGSToBitMap(gps)
        let deviceCode = deviceItem.deviceCode || deviceItem.subDeviceCode
        previewMarker.markerType = getMarkerTypeByDeviceCode(deviceCode)
        previewMarker.longitude = gps[0]
        previewMarker.latitude = gps[1]
        previewMarker.markerName = deviceItem.deviceName
        previewMarker.position = position
        previewMarker.id = deviceItem.deviceId || deviceItem.subDeviceId
        previewMarker.imgUrl = warnImg
        this.mapObj.addMarker(previewMarker)
      }
    },
    /**
     * @param 点位批量新增功能
     */
    addClick () {
      // 判断点位的合法性
      let mapDeviceList = this.mapDeviceList
      console.log('mapDeviceList: ')
      console.log(mapDeviceList)
      /**
       * 针对status 进行判断,  不能添加的情况：在当前地图已配置，在其他地图已配置（非车闸和电梯设备）
      */
      for (let i = 0; i < this.mapDeviceList.length; i++) {
        if (this.mapDeviceList[i].status === '在当前地图已配置') {
          this.$message({ message: '存在不可配置的设备，请检查', type: 'warning' })
          return false
        } else if (this.mapDeviceList[i].status === '在其他地图已配置') {
          // manyDeviceCode
          if (manyDeviceCode.indexOf(this.mapDeviceList[i].deviceCode) > -1) {
            console.log('code in [2005,2020,3038]')
          } else {
            this.$message({ message: '有设备在其他地图已配置，请检查', type: 'warning' })
            return false
          }
        }
      }
      if (!this.markerList || this.markerList.length === 0) {
        this.$message({
          message: '请选择需要新增的设备',
          type: 'warning'
        })
        return false
      }
      this.$refs['MarkerInfo'].dialogFormVisible = true
      // 根据映射关系将点位类型和楼栋类型传递给子组件
      this.$refs['MarkerInfo'].form.markerType = String(getMarkerTypeByDeviceCode(this.multipleSelection[0].deviceCode))
      this.$refs['MarkerInfo'].markerTypes = this.markerTypes
      this.$refs['MarkerInfo'].form.floorType = this.floorTypes[0].itemCode
      this.$refs['MarkerInfo'].floorTypes = this.floorTypes
      this.$refs['MarkerInfo'].sceneId = this.sceneId
      // 拿当前的地图id与小区全图第一张图做判断
      this.$refs['MarkerInfo'].isFloor = false
      if (this.sceneId !== this.firstSceneId) {
        this.$refs['MarkerInfo'].checked = false
        this.$refs['MarkerInfo'].isFloor = true
      }
      // 将地图的放大等级和楼栋等级和最小缩放等级传递给子组件
      this.$refs['MarkerInfo'].zooms = this.zooms
      this.$refs['MarkerInfo'].buildingZoom = this.buildingZoom
      this.$refs['MarkerInfo'].form.zoomLevel = this.zooms[0]
      // 将点位信息数组传递给子组件
      this.$refs['MarkerInfo'].markerList = this.markerList
    },
    /**
     * @description 设备类型切换
     * @param option Object 设备列表
     */
    onDeviceTypeChange: function () {
      let that = this
      let option = addFilter(this.deviceType)
      // 加载设备列表
      getDeviceList(option)
        .then((res) => {
          // 将子设备与主设备汇总
          let deviceList = assignDevice(res.data.data)
          for (let j = 0; j < deviceList.length; j++) {
            // 匿名函数防止异步
            (function (j) {
              // 默认状态:已配置GPS信息且未绑定地图
              deviceList[j].status = 'GPS'
              // 电子围栏主设备2021、车位检测相机2022、IPC枪机2001、鹰眼摄像机2002、球机2003、人脸抓拍机2004的主设备不在地图显示
              let noMainDevice = ['2001', '2002', '2003', '2004', '2021', '2022']
              if (noMainDevice.indexOf(deviceList[j].deviceCode) > -1) {
                deviceList[j].status = '禁止配置'
              } else {
                /* 没有配置gps信息的设备 */
                if (deviceList[j].gps === null) {
                  // 1.没有配置gps但是已绑定地图
                  if (deviceList[j].deviceMarkers !== null) {
                    for (let k = 0; k < deviceList[j].deviceMarkers.length; k++) {
                      if (manyDeviceCode.indexOf(deviceList[j].deviceCode) === -1) {
                        if (that.currentSceneId === deviceList[j].deviceMarkers[k].sceneId) {
                          deviceList[j].status = '在当前地图已配置'
                        } else {
                          deviceList[j].status = '在其他地图已配置'
                        }
                      } else {
                        if (that.currentSceneId === deviceList[j].deviceMarkers[k].sceneId) {
                          deviceList[j].status = '在当前地图已配置'
                          break
                        } else {
                          deviceList[j].status = '无GPS'
                        }
                      }
                    }
                  } else {
                    // 2.没有配置gps同时也未绑定地图
                    deviceList[j].status = '无GPS'
                  }
                } else {
                  /* 已配置GPS信息的设备 */
                  // 1.已配置GPS信息且已绑定地图
                  if (deviceList[j].deviceMarkers !== null) {
                    for (let m = 0; m < deviceList[j].deviceMarkers.length; m++) {
                      // 车闸2005、电梯厂商控制器2020、电梯IC卡读头3038 这三种设备如果已绑定地图，只有一种状态：在当前地图已配置
                      if (manyDeviceCode.indexOf(deviceList[j].deviceCode) === -1) {
                        if (that.currentSceneId === deviceList[j].deviceMarkers[m].sceneId) {
                          deviceList[j].status = '在当前地图已配置'
                        } else {
                          deviceList[j].status = '在其他地图已配置'
                        }
                      } else {
                        if (that.currentSceneId === deviceList[j].deviceMarkers[m].sceneId) {
                          deviceList[j].status = '在当前地图已配置'
                          break
                        }
                      }
                    }
                  }
                }
              }
            })(j)
          }
          this.deviceList = deviceList
        })
        .catch(err => {
          console.warn(LOG_TAG + 'getDeviceList接口调用err')
          console.warn(err)
        })
    },
    /**
     * @description 初始化地图
     * @param option Object 地图信息
     */
    onMapCreate: function (option) {
      this.currentSceneId = option.id
      let that = this
      console.log(LOG_TAG + 'onMapCreate begin')
      // 查询zoom必须放在初始化地图前面
      // 地图加载时，查询出每张地图的最大最小zoom
      this.zooms = []
      this.buildingZoom = option.buildingZoom
      for (let i = option.minZoom; i < option.maxZoom + 1; i++) {
        this.zooms.push(i)
      }
      // 获取小区真实地图图片
      if (this.mapObj) {
        this.mapObj.getMap().setTarget(null)
      }
      // 已经初始化的地图可以直接获取地图对象，进行地图的替换即可
      if (this.cacheMapList[option.id]) {
        this.mapObj = this.cacheMapList[option.id]
        this.mapObj.getMap().setTarget('mapDiv')
        return
      }
      // 如果没有初始化过，才需要进行地图的初始化
      let formatedOption = mapOptionFormat(option)
      let mapOption = extendObj(formatedOption, {
        gisEngine: 'tile',
        sizeW: option.width,
        sizeH: option.height,
        domId: 'tilemap',
        mapUrl: option.url,
        zoom: option.minZoom,
        maxZoom: option.maxZoom,
        minZoom: option.minZoom,
        center: [0, 0],
        centerGPS: [option.centerLon, option.centerLat],
        scale: option.scale,
        scaleType: option.scaleType,
        arcAngle: option.arcAngle // 弧度值
      })
      // eslint-disable-next-line
      this.cacheMapList[option.id] = new hdmap.initMap(mapOption)
      this.mapObj = this.cacheMapList[option.id]
      this.mapObj.getMap().setTarget('mapDiv')
      // 获取并显示点位
      getMarkerList({ sceneId: option.id })
        .then((res) => {
          // 格式化markerList,markerId统一为deviceId渲染到地图
          that.markerListB = markerListFormat(res.data.data)
          that.mapObj.addMarkers(that.markerListB, scaleMap)
        })
        .catch(err => {
          console.warn(LOG_TAG + 'getMarkerList接口调用err')
          console.warn(err)
        })
      // 注册地图上的点击事件
      this.mapObj.regEventListener('singleclick', function (e) {
        console.log('点位的e')
        console.log(e)
        if (e.feature != null) {
          that.mapObj.popupDefault(e.coordinate, e.feature.markerName)
        }
      })
    },
    /**
     * @augments 摄像头、广播、电子围栏等主设备不可选择
     *  */
    checkboxInit: function (row, index) {
      // 设备状态为无GPS的设备禁止操作
      if (row.status === '无GPS') {
        return 0
      }
      // 电子围栏主设备2021、车位检测相机2022、IPC枪机2001、鹰眼摄像机2002、球机2003、人脸抓拍机2004的主设备不在地图显示
      let noMainDevice = ['2001', '2002', '2003', '2004', '2021', '2022']
      if (noMainDevice.indexOf(row.deviceCode) > -1) {
        // checkbox不可勾选
        return 0
      } else {
        // checkbox可被勾选
        return 1
      }
    },
    /**
     * @description 场景类型改变，触发事件
     */
    onTypeChange: function () {
      if (this.sceneParam.sceneType === '') {
        this.$message({
          message: '请选择场景类型！',
          type: 'warning'
        })
      } else {
        getSceneList(this.sceneParam)
          .then((res) => {
            this.sceneList = res.data.data
          })
          .catch(err => {
            console.warn(LOG_TAG + 'getSceneList接口调用err')
            console.warn(err)
          })
      }
    },
    /**
     * @description 点击重置按钮，清空场景类型和场景名称
     */
    onSceneReset: function () {
      this.sceneParam.sceneType = ''
      this.sceneParam.sceneName = ''
    },
    /**
     * @description 切换场景
     * @param id String 场景列表的id
     */
    onSceneShow: function (id) {
      this.sceneId = id
      this.currentSceneId = id
      if (this.sceneId === this.firstSceneId) {
        this.deviceTypes = this.deviceTypesSquare
      } else {
        this.deviceTypes = this.deviceTypesCar
      }
      let options = {}
      options.sceneId = this.sceneId
      getSceneInfo(options)
        .then((res) => {
          console.log(LOG_TAG + 'res.data.data')
          console.log(res.data.data)
          // TODO 切换地图
          this.onMapCreate(res.data.data)
        })
        .catch(err => {
          console.warn(LOG_TAG + 'getSceneInfo获取场景信息err')
          console.warn(err)
        })
      this.onDeviceTypeChange()
    }
  },
  watch: {
  }
}
</script>
<style lang="less" scoped>
* {
  box-sizing: border-box;
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
    height: 100%;
    .content-left {
      flex: 0 0 350px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #cccccc;
      .search-sence-area {
        flex: 0 0 200px;
        border-bottom: 1px solid #ccc;
        padding: 20px 15px 15px 10px;
        .search-toolbar {
          text-align: center;
        }
      }
      .list-area {
        flex: 1 1 auto;
        overflow-y: auto;
        padding: 15px;
        .list-item {
          list-style: none;
          padding: 0px 30px;
          text-align: left;
          border-bottom: solid 1px #aaa;
          width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          height: 40px;
          line-height: 40px;
        }
        .active {
          color: white;
          background: rgba(34, 156, 255, 1);
        }
      }
    }
    .content-center {
      flex: 1 1 auto;
      border-right: 1px solid #cccccc;
      position: relative;
      min-width: 400px;
      overflow: hidden;
      #mapDiv {
        margin-top: 30px;
        height: 700px;
        background-color: #ccc;
      }
    }
    .content-right {
      flex: 0 0 400px;
      display: flex;
      flex-direction: column;
      .form {
        padding-top: 20px;
        border-bottom: 1px solid #ccc;
        .refresh {
          float: right;
          top: 20px;
          vertical-align: middle;
          margin-right: 20px;
        }
      }
      .button-group {
        text-align: center;
        padding-top: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ccc;
      }
      .tables {
        flex: 1 1 auto;
        overflow-y: auto;
      }
    }
  }
}
</style>
