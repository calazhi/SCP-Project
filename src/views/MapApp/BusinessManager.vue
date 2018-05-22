<template>
  <div class="map-app">
    <div class="row-flow main">
      <div class="content-center">
        <div class="button-group">
          <el-button :type="btnType" @click="onModifyMap" :data-flag="editFlag" class="search-btn">{{msg}}</el-button>
          <el-button type="primary" @click="onDeleteFeature" class="search-btn">删除点位</el-button>
          <el-button type="primary" @click="onConfigFeature" class="search-btn" v-show="isSaveShow">保存</el-button>
          <el-button type="primary" @click="onCancelConfigFeature" class="search-btn" v-show="isSaveShow">取消</el-button>
        </div>
        <div id="markerMapDiv" @drop="drop($event)" @dragover="allowDrop($event)">
        </div>
      </div>
      <div class="content-left">
        <div class="search-sence-area">
          <el-form ref="sceneParam" v-model="sceneParam" label-width="80px" class="search-form">
            <el-form-item label="场景类型" class="common-input">
              <el-select v-model="sceneParam.sceneType" placeholder="请选择" @change="onSceneTypeChange">
                <el-option v-for="item in SceneTypes" :label="item.itemName" :value="item.itemCode" :key="item.itemCode">{{item.itemName}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="场景名称" label-width="80px" class="common-input">
              <el-input v-model="sceneParam.sceneName" maxLength="" placeholder="请输入场景名称"></el-input>
            </el-form-item>
            <div class="search-toolbar">
              <el-button type="primary" @click.stop="onQuerySceneList" class="search-btn" ref="querySceneListBtn">查询</el-button>
              <el-button type="primary" @click="onResetSceneParam" class="search-btn">重置</el-button>
            </div>
          </el-form>
        </div>
        <div class="list-area">
          <ul class="data-list">
            <li v-for="(sceneItem, index) in sceneList" :key="sceneItem.id" class="list-item sceneItem" :class="{ 'active': currentScene === index }" @click="onShowScene(index, sceneItem.id)">
              {{ sceneItem.sceneName }}
            </li>
          </ul>
        </div>
      </div>
      <div class="content-right">
        <div class="search-device-area">
          <el-form ref="deviceParam" v-model="deviceParam" label-width="80px" class="search-form">
            <el-form-item label="设备类型" class="common-input">
              <el-select v-model="deviceParam.deviceType" placeholder="请选择" @change="onDeviceTypeChange">
                <el-option v-for="item in deviceTypes" :label="item.deviceTypeDesc" :value="item.deviceTypeCode" :key="item.deviceTypeCode">{{item.deviceTypeDesc}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备名称" label-width="80px" class="common-input">
              <el-input v-model="deviceParam.deviceName" maxLength="" placeholder="请输入设备名称"></el-input>
            </el-form-item>
            <el-popover ref="orgPopover" placement="top-end" width="174" v-model="isShowPopover">
              <OrgTreeView ref="orgTree" @node-click="onHandleNodeClick"></OrgTreeView>
            </el-popover>
            <el-form-item label="所属组织" label-width="80px" class="common-input">
              <el-input v-model="OrgName" placeholder="请选择组织" readonly v-popover:orgPopover @focus="propOrgDara"></el-input>
            </el-form-item>
            <div class="search-toolbar">
              <el-button type="primary" @click="onQueryDeviceList" class="search-btn">查询</el-button>
              <el-button type="primary" @click="onResetDeviceParam" class="search-btn">重置</el-button>
            </div>
          </el-form>
        </div>
        <div class="list-area">
          <ul class="data-list device-list" ref="ulRef">
            <li v-for="(deviceItem, key) in deviceList" :key="key" class="list-item">
              <div @click.stop.prevent="onCheckdevice(key,$event,deviceItem.deviceId,deviceItem.deviceName)" draggable="true" @dragstart="drag($event)" :data-devicecode="deviceItem.deviceCode" :data-deviceid="deviceItem.deviceId" :data-devicename="deviceItem.deviceName" class="item-single-line">
                <div class="device-icon">
                  <i class="icon-item" :style="{background:backgroundUrl }"></i>
                </div>
                <dl class="device-text-group">
                  <dt class="device-name-text" :title="deviceItem.deviceName" :ref="deviceItem.deviceId" :data-parent="key">{{deviceItem.deviceName}}</dt>
                  <dd class="device-desc-text" :title="deviceItem.deviceDesc">{{deviceItem.deviceDesc}}</dd>
                  <dd class="device-control" @click.stop.prevent='onPreview(deviceItem, transferInfoSon.sceneId, key, deviceItem.deviceId)'>
                    <img :src="getImage(deviceItem, transferInfoSon.sceneId, key)" :data-key="key" alt="">
                  </dd>
                </dl>
              </div>
              <ul class="sub-device-list" v-if="deviceItem.subDevice&&deviceItem.subDevice.length>0">
                <li v-for="(subDeviceItem,sonkey) in deviceItem.subDevice" :key="subDeviceItem.subDeviceId" class="list-item">
                  <div @click.stop.prevent="onCheckdevice(key,$event,subDeviceItem.subDeviceId,subDeviceItem.subDevicName,sonkey)" draggable="true" @dragstart="drag($event)" :data-devicecode="subDeviceItem.subDeviceCode" :data-deviceid="subDeviceItem.subDeviceId" :data-devicename="subDeviceItem.subDevicName" class="item-single-line">
                    <div class="device-icon">
                      <i class="icon-item" :style="{background:backgroundUrl }"></i>
                    </div>
                    <dl class="device-text-group sub-device">
                      <dt class="device-name-text" :title="subDeviceItem.subDevicName" :ref="subDeviceItem.subDeviceId" :data-parent="key" :data-son="sonkey">{{subDeviceItem.subDevicName}}</dt>
                      <dd class="device-desc-text" :title="subDeviceItem.subDeviceDesc">{{subDeviceItem.subDeviceDesc}}</dd>
                      <dd class="device-control" @click.stop.prevent='onSubPreview(subDeviceItem, transferInfoSon.sceneId, sonkey, subDeviceItem.subDeviceId)'>
                        <img :src="getImageOther(subDeviceItem, transferInfoSon.sceneId, sonkey)" :data-key="sonkey">
                      </dd>
                    </dl>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--子组件AddMarkerPopup-->
    <marker-config-popup ref="addMarkerPopup" @send='getdata' :transferInfo='transferInfoSon'></marker-config-popup>
  </div>
</template>

<script>
import { getAreaInfo, getOrgTree, getDeviceList, getDictionary, getMarkerList, getMarkerInfo, addMarker, updateMarker, deleteMarker, getSceneList, getSceneInfo } from '@/views/MapApp/apis/index.js'
import { mapOptionFormat, extendObj, markerListFormat, scaleMap, LOG_TAG } from '@/views/MapApp/assets/js/index.js'
import { getMarkerTypeByDeviceCode, addFilter } from '@/views/MapApp/assets/js/device_marker.js'
import { getImgByType, getDeviceIcon } from '@/views/MapApp/assets/js/image_manager.js'
import MarkerConfigPopup from '@/views/MapApp/components/MarkerConfigPopup.vue'
import camerm from '@/views/MapApp/assets/images/camerm.png'
import warnImg from '@/views/MapApp/assets/images/warn.png'
import check from '@/views/MapApp/assets/images/checkImg.png'
import cross from '@/views/MapApp/assets/images/crossImg.png'
import preview from '@/views/MapApp/assets/images/preview.png'
import noGPS from '@/views/MapApp/assets/images/noGPS.png'
import hdmap from 'hdmap'
import OrgTreeView from '@/components/TreeView'
export default {
  components: {
    MarkerConfigPopup,
    OrgTreeView
  },
  data () {
    return {
      currentSceneType: null,
      // 保存场景信息
      markerlist: [],
      currentSceneInfo: null,
      dragAdd: false, // 拖动新增属性
      previewAdd: false, // 预览新增属性
      layer: '',
      // 编辑数据处理
      editMarkerObj: null,
      // 通过调用接口getMarkerInfo接口获取点位信息重置对象
      resetMarkerInfo: '',
      // 重置对象点位信息
      resetOldOption: '',
      markerObj: '',
      isSaveShow: false,
      // 传递给子组件的值
      transferInfoSon: {
        sceneType: null,
        markerType: '',
        longitude: '',
        latitude: '',
        deviceName: '',
        markerTypes: [],
        zoomLevel: [],
        OrgTree: [],
        treeDatas: {
          tData: []
        },
        sceneId: '',
        floorTypes: [],
        // 为编辑点位做回显传参
        echoInfo: {},
        // 判断点位是新增还是编辑
        addOrEdit: ''
      },
      backgroundUrl: '#fff', // 设备图标的背景图
      camermImgUrl: camerm, // 摄像头图标
      checkImg: check, // 勾选图标
      crossImg: cross, // 打叉图标
      previewImg: preview, // 预览图标
      noGPSImg: noGPS,
      btnType: 'primary',
      editFlag: false,
      msg: '开启地图编辑',
      SceneTypes: [],
      deviceTypes: [],
      isShowPopover: false,
      OrgTree: [],
      treeDatas: {
        tData: []
      },
      exportOrgNode: {},
      OrgName: '',
      sceneParam: {
        sceneName: '',
        sceneType: '1'
      },
      deviceParam: {
        deviceType: '2001',
        deviceName: '',
        orgId: '',
        deviceIp: ''
      },
      sceneList: [],
      deviceList: [],
      // 当前的地图对象
      mapObj: null,
      // 加载过的地图缓存在cacheMapList中进行缓存
      cacheMapList: {},
      draggingDevice: {},
      currentScene: null,
      currentSceneId: 0,
      selectedMarker: {},
      // // 目前默认是 commonLayer
      currentLayer: 'commonLayer'
    }
  },
  mounted: function () {
    this.currentScene = 0
    this.backgroundUrl = 'url(' + this.camermImgUrl + ')'
    this.onQuerySceneList()
    this.onQueryDeviceList()
    // 加载默认小区地图
    getSceneList({
      sceneName: '',
      sceneType: '1'
    }).then((res) => {
      // TODO 初始化地图
      this.createMap(res.data.data[0])
    }).catch(err => {
      console.warn(LOG_TAG + 'getSceneList接口调用err')
      console.warn(err)
    })
    getOrgTree().then((res) => {
      this.exportOrgNode.rootUuid = res.data.data.uuid
      this.treeDatas.tData.splice(0, this.treeDatas.tData.length)
      this.treeDatas.tData.push(res.data.data)
      this.transferInfoSon.treeDatas.tData = this.treeDatas.tData
    }).catch(err => {
      console.warn(LOG_TAG + 'getOrgTree接口调用err')
      console.warn(err)
    })
    getDictionary().then(res => {
      let dictionary = res.data.data
      let markerTypes = res.data.data.dictCodeType.markerType
      this.SceneTypes = dictionary.dictCodeType.sceneType
      var deviceTypeCodeArr = ['2001', '2002', '2003', '2004', '2019', '2022', '2010', '2005', '2009', '2011', '2020', '2021', '3060']
      dictionary.deviceType.forEach(element => {
        if (deviceTypeCodeArr.indexOf(element.deviceTypeCode) >= 0) {
          this.deviceTypes.push(element)
        }
      })
      for (let i = 0; i < markerTypes.length; i++) {
        // 传值给弹窗
        this.transferInfoSon.markerTypes.push(markerTypes[i])
      }
      // 楼栋层级
      this.transferInfoSon.floorTypes.push(res.data.data.dictCodeType.floorType)
    }).catch(err => {
      console.warn(LOG_TAG + 'getDictionary接口调用err')
      console.warn(err)
    })
  },
  methods: {
    /**
     * @description 获取设备列表一级主设备的右侧图标
     * @param {Object} deviceItem 当前列表信息
     * @param {String} sceneId 当前地图场景ID
     * @param {Number} key 当前一级主设备索引
     */
    getImage (deviceItem, sceneId, key) {
      let markerType = getMarkerTypeByDeviceCode(deviceItem.deviceCode)
      // TODO 停车场地图只能加车闸、电梯、摄像头
      if (this.currentSceneType === 2) {
        let markerTypes = [1, 5, 8]
        if (markerTypes.indexOf(markerType) === -1) {
          return this.crossImg
        }
      }
      var deviceCodes = ['2001', '2002', '2003', '2004', '2022', '2021']
      if (deviceCodes.indexOf(deviceItem.deviceCode) !== -1) {
        return this.crossImg
      }
      if (deviceItem.deviceMarkers && deviceItem.deviceMarkers.length > 0) {
        // TODO 遍历deviceMarkers 对比其中的sceneID是否包含当前地图
        let deviceMarkersScences = []
        for (let i = 0; i < deviceItem.deviceMarkers.length; i++) {
          deviceMarkersScences.push(deviceItem.deviceMarkers[i].sceneId)
        }
        if (deviceMarkersScences.indexOf(sceneId) !== -1) {
          return this.checkImg
        } else {
          return this.judgePicture(deviceItem, this)
        }
      } else {
        return this.judgePicture(deviceItem, this)
      }
    },
    /**
  * @description 获取设备列表二级子设备的右侧图标
  * @param {Object} subDeviceItem 当前列表信息
  * @param {String} sceneId 当前地图场景ID
  * @param {Number} key 当前二级主设备索引
  */
    getImageOther (subDeviceItem, sceneId, key) {
      let markerType = getMarkerTypeByDeviceCode(subDeviceItem.subDeviceCode)
      // TODO 停车场地图只能加车闸、电梯、摄像头
      if (this.currentSceneType === 2) {
        let markerTypes = [1, 5, 8]
        if (markerTypes.indexOf(markerType) === -1) {
          return this.crossImg
        }
      }
      if (markerType === '') {
        return this.crossImg
      }
      if (subDeviceItem.subDeviceMarkers && subDeviceItem.subDeviceMarkers.length > 0) {
        // TODO 遍历deviceMarkers 对比其中的sceneID是否包含当前地图
        let subDeviceMarkersScences = []
        for (let i = 0; i < subDeviceItem.subDeviceMarkers.length; i++) {
          subDeviceMarkersScences.push(subDeviceItem.subDeviceMarkers[i].sceneId)
        }
        if (subDeviceMarkersScences.indexOf(sceneId) !== -1) {
          return this.checkImg
        } else {
          return this.judgePicture(subDeviceItem, this)
        }
      } else {
        return this.judgePicture(subDeviceItem, this)
      }
    },
    /**
  * @description 根据GPS获取图片
  * @param {Object} deviceItem 当前列表信息
  * @param {Object} vm vue 的实例对象-----this
  */
    judgePicture: function (deviceItem, vm) {
      let gps = deviceItem.gps ? deviceItem.gps : deviceItem.subGps
      // TODO 判断有无GPS
      if (!gps) {
        return vm.noGPSImg
      } else {
        return vm.previewImg
      }
    },
    /**
    * @description 为设备列表一级子设备的右侧图标注册事件
    * @param {Object} deviceItem 当前一个列表信息
    * @param {String} sceneId 当前地图场景ID
    * @param {Number} key 当前一级主设备索引
    * @param {String} deviceId 当前一级主设备的设备id
    */
    onPreview (deviceItem, sceneId, key, deviceId) {
      let markerType = getMarkerTypeByDeviceCode(deviceItem.deviceCode)
      // TODO 车闸和电梯
      if (markerType === 5 || markerType === 8) {
        if (deviceItem.deviceMarkers) {
          var currentSceneIds = []
          for (let i = 0; i < deviceItem.deviceMarkers.length; i++) {
            currentSceneIds.push(deviceItem.deviceMarkers[i].sceneId)
          }
          var isTrue = currentSceneIds.indexOf(sceneId) === -1
          if (isTrue) {
            this.popupShow(deviceItem, this, sceneId)
          }
        } else {
          this.popupShow(deviceItem, this, sceneId)
        }
        return
      }
      if (deviceItem.deviceMarkers && deviceItem.deviceMarkers[0].sceneId !== sceneId) {
        // TODO 判断该预览的点位被其他场景占用
        this.judgeInScene(deviceItem.deviceMarkers[0].sceneId, this)
      } else if (!deviceItem.deviceMarkers) {
        this.popupShow(deviceItem, this, sceneId)
      } else if (deviceItem.deviceMarkers && deviceItem.deviceMarkers[0].sceneId === sceneId) {
        console.log('勾选')
      }
    },
    /**
    * @description 为设备列表二级子设备的右侧图标注册事件
    * @param {Object} subDeviceItem 当前一个列表信息
    * @param {String} sceneId 当前地图场景ID
    * @param {Number} key 当前二级主设备索引
    * @param {String} deviceId 当前二级子设备的设备id
    */
    onSubPreview (subDeviceItem, sceneId, key, deviceId) {
      let markerType = getMarkerTypeByDeviceCode(subDeviceItem.subDeviceCode)
      // TODO 车闸和电梯
      if (markerType === 5 || markerType === 8) {
        if (subDeviceItem.subDeviceMarkers) {
          var currentSceneIds = []
          for (let i = 0; i < subDeviceItem.subDeviceMarkers.length; i++) {
            currentSceneIds.push(subDeviceItem.subDeviceMarkers[i].sceneId)
          }
          var isTrue = currentSceneIds.indexOf(sceneId) === -1
          if (isTrue) {
            this.popupShow(subDeviceItem, this, sceneId)
          }
        } else {
          this.popupShow(subDeviceItem, this, sceneId)
        }
        return
      }
      if (subDeviceItem.subDeviceMarkers && subDeviceItem.subDeviceMarkers[0].sceneId !== sceneId) {
        // TODO 判断该预览的点位被其他场景占用
        this.judgeInScene(subDeviceItem.subDeviceMarkers[0].sceneId, this)
      } else if (!subDeviceItem.subDeviceMarkers) {
        this.popupShow(subDeviceItem, this, sceneId)
      } else if (subDeviceItem.subDeviceMarkers && subDeviceItem.subDeviceMarkers[0].sceneId === sceneId) {
        console.log('勾选')
      }
    },
    /**
    * @description 点击设备列表预览的逻辑封装
    * @param {Object} deviceItem 当前列表信息
    * @param {Object} vm vue 的实例对象-----this
    * @param {String} sceneId 当前地图场景ID
    */
    popupShow (deviceItem, vm, sceneId) {
      let previewMarker = {}
      var gps = deviceItem.gps || deviceItem.subGps
      if (gps) {
        gps[0] = Number(gps[0])
        gps[1] = Number(gps[1])
        // TODO 判断gps点是否在地图可视区域
        var isTrue = vm.mapObj.isInTileMapViewArea(gps, true)
        if (!isTrue) {
          vm.$message({
            message: 'GPS点位不在地图可视区域内',
            type: 'warning'
          })
          return
        }
        // TODO 在地图出现点位映射标志，同时出现保存和删除按钮
        var position = vm.mapObj.transfromWGSToBitMap(gps)
        vm.isSaveShow = true
        let deviceCode = deviceItem.deviceCode || deviceItem.subDeviceCode
        vm.transferInfoSon.markerType = getMarkerTypeByDeviceCode(deviceCode)
        previewMarker.markerType = vm.transferInfoSon.markerType
        vm.transferInfoSon.longitude = gps[0]
        previewMarker.longitude = gps[0]
        vm.transferInfoSon.latitude = gps[1]
        previewMarker.latitude = gps[1]
        vm.transferInfoSon.deviceName = deviceItem.deviceName || deviceItem.subDevicName
        previewMarker.markerName = vm.transferInfoSon.deviceName
        previewMarker.position = position
        previewMarker.id = deviceItem.deviceId || deviceItem.subDeviceId
        previewMarker.imgUrl = warnImg
        vm.mapObj.addMarker(previewMarker)
        vm.transferInfoSon.sceneId = sceneId
        vm.transferInfoSon.addOrEdit = 'add'
        vm.markerObj = previewMarker
        vm.previewAdd = true
      }
    },
    /**
    * @description 通过子组件MarkerConfigPopup传过来的值进行逻辑操作
    * @param {Object} data 子组件传给父组件的传值
    */
    getdata (data) {
      // 监听子组件传过来的值做判断
      if (data === 'cancelAdd') {
        // 新增的取消逻辑
        this.mapObj.removeMarkerBylayerKey(this.markerObj.id, this.currentLayer)
        this.isSaveShow = false
        this.emptyTransferInfoSon()
        this.editFlag = false
        this.btnType = 'primary'
        this.msg = '开启地图编辑'
      }
      if (data === 'cancelEdit') {
        // 编辑的取消逻辑
        this.resetOldOption.position[0] = this.resetMarkerInfo.positionX
        this.resetOldOption.position[1] = this.resetMarkerInfo.positionY
        this.mapObj.closeDragTool()
        this.mapObj.removeMarkerBylayerKey(this.selectedMarker.id, this.layer)
        this.mapObj.addMarker(this.resetOldOption, scaleMap)
        this.emptyTransferInfoSon()
        this.editFlag = false
        this.btnType = 'primary'
        this.msg = '开启地图编辑'
      }
      if (data !== 'cancelAdd' && data !== 'cancelEdit') {
        // 非取消的逻辑
        if (data.addOrEdit === 'add') {
          // 新增点位逻辑
          delete data.addOrEdit
          this.addOrEdit = ''
          data.id = this.markerObj.id
          data.deviceId = this.markerObj.id
          data.positionX = this.markerObj.position[0]
          data.positionY = this.markerObj.position[1]
          this.mapObj.removeMarkerBylayerKey(this.markerObj.id, this.currentLayer)
          data.imgUrl = getImgByType(data.markerType)
          this.addDeviceMarker(data)
          this.editFlag = false
          this.btnType = 'primary'
          this.msg = '开启地图编辑'
          this.isSaveShow = false
          this.emptyTransferInfoSon()
        }
        if (data.addOrEdit === 'edit') {
          // 编辑点位逻辑
          delete data.addOrEdit
          this.addOrEdit = ''
          data.positionX = this.editMarkerObj.position[0]
          data.positionY = this.editMarkerObj.position[1]
          data.deviceId = this.editMarkerObj.deviceId
          data.id = this.resetMarkerInfo.id
          this.updateMarkerInfo(data)
          this.mapObj.closeDragTool()
          this.editFlag = false
          this.btnType = 'primary'
          this.msg = '开启地图编辑'
          this.emptyTransferInfoSon()
        }
      }
    },
    /**
    * @description 清空transferInfoSon对象属性
    */
    emptyTransferInfoSon () {
      this.transferInfoSon.markerType = ''
      this.transferInfoSon.longitude = ''
      this.transferInfoSon.latitude = ''
      this.transferInfoSon.deviceName = ''
      // 为编辑点位做回显传参
      this.transferInfoSon.echoInfo = {}
      // 判断点位是新增还是编辑
      this.transferInfoSon.addOrEdit = ''
    },
    /**
     * @description 点位管理 初始化地图
     * @param {Object} option 地图初始化的对象参数
     */
    createMap: function (option) {
      // TODO 为弹窗显示逻辑做相应的判断
      this.transferInfoSon.sceneType = option.sceneType
      this.currentSceneType = option.sceneType
      this.transferInfoSon.sceneId = option.id
      let _this = this
      // 获取小区真实地图图片
      let mapImageUrl = option.url
      let mapWidth = option.width
      let mapHeight = option.height
      if (this.mapObj) {
        this.mapObj.getMap().setTarget(null)
      }
      // 已经初始化的地图可以直接获取地图对象，进行地图的替换即可
      if (this.cacheMapList[option.id]) {
        this.mapObj = this.cacheMapList[option.id]
        this.mapObj.getMap().setTarget('markerMapDiv')
        return
      }
      // 如果没有初始化过，才需要进行地图的初始化
      let formatedOption = mapOptionFormat(option)
      let mapOption = extendObj(formatedOption, {
        gisEngine: 'tile',
        domId: 'markerMapDiv',
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
      var zoomLevels = []
      for (let i = mapOption.minZoom; i < mapOption.maxZoom + 1; i++) {
        zoomLevels[i] = {}
        zoomLevels[i].value = i.toString()
        zoomLevels[i].label = i.toString()
      }
      this.transferInfoSon.zoomLevel = []
      zoomLevels.forEach(element => {
        this.transferInfoSon.zoomLevel.push(element)
      })
      // eslint-disable-next-line
      this.cacheMapList[option.id] = new hdmap.initMap(mapOption)
      this.mapObj = this.cacheMapList[option.id]
      this.mapObj.getMap().setTarget('markerMapDiv')
      // 获取并显示点位
      getMarkerList({ sceneId: option.id }).then((res) => {
        let markerlist = markerListFormat(res.data.data)
        this.markerlist = markerlist
        // markerlist.forEach(element => {
        //   element.id = element.markerId
        // })
        this.mapObj.addMarkers(markerlist, scaleMap)
      })
      this.mapObj.closeDragTool()
      // 注册地图上的点击事件
      this.mapObj.regEventListener('singleclick', function (e) {
        console.log(e)
        // 每次点击选中点位，都将当前markerId保存起来，供删除时调用
        if (e.feature) {
          _this.resetOldOption = e.feature
          _this.layer = e.layerKey || e.feature.layerkey
          console.log(_this.layer)
          // TODO 拖动添加
          if (_this.dragAdd) {
            _this.selectedMarker = e.feature
            return
          }
          // TODO 预览添加
          if (_this.previewAdd) {
            _this.selectedMarker = e.feature
            return
          }
          // TODO 点击显示弹窗
          if (e.feature != null) {
            _this.mapObj.popupDefault(e.coordinate, e.feature.markerName)
          }
          if (e.feature.markerId) {
            _this.selectedMarker.markerId = e.feature.markerId
            _this.selectedMarker.deviceId = e.feature.deviceId
            _this.selectedMarker.id = e.feature.id
          } else {
            // 新增的点位中，如果e.feature里没有markerId，需要通过deviceId或id查询到markerId,并保存到selectedMarker
            getMarkerInfo({ deviceId: e.feature.deviceId }).then(res => {
              var markerInfo = null
              for (let i = 0; i < res.data.data.length; i++) {
                const element = res.data.data[i]
                if (element.sceneId === _this.transferInfoSon.sceneId) {
                  markerInfo = element
                }
              }
              if (markerInfo) {
                _this.selectedMarker.markerId = markerInfo.id
              }
              _this.selectedMarker.deviceId = e.feature.deviceId
              _this.selectedMarker.id = e.feature.id
            }).catch(err => {
              console.warn(LOG_TAG + 'getMarkerInfo接口调用err')
              console.warn(err)
            })
          }
        } else {
          // TODO 点击点位以外的位置时关闭提示
          _this.mapObj.closePopup()
        }
      })
    },
    /**
     * @description 点位管理 dragstart函数
     * @param {Object} event Event 对象
     */
    drag: function (event) {
      // let _this = this
      this.editFlag = false
      this.msg = '开启地图编辑'
      this.btnType = 'primary'
      // 记录拖动的设备的信息
      let deviceCode = event.target.dataset.devicecode
      this.draggingDevice.deviceId = event.target.dataset.deviceid
      this.draggingDevice.deviceCode = deviceCode
      this.draggingDevice.deviceName = event.target.dataset.devicename
      this.draggingDevice.markerType = getMarkerTypeByDeviceCode(event.target.dataset.devicecode)
      // 设置拖拽时显示的图片
      let img = new Image()
      let imgUrl = event.target.getElementsByTagName('i')[0].style.backgroundImage.replace(/^(url\(")/, '').replace(/("\))$/, '')
      if (imgUrl) {
        img.src = imgUrl
        try {
          event.dataTransfer.setDragImage(img, 10, 10)
        } catch (err) {
          console.warn(err)
        }
      }
    },
    /**
     * @description 点位管理 dragend函数
     * @param {Object} event Event 对象
     */
    drop: function (event) {
      if (this.markerObj) {
        this.mapObj.removeMarkerBylayerKey(this.markerObj.id, this.currentLayer)
      }
      // TODO 摄像头、电子围栏、广播的主设备不能再地图上面添加点位
      var deviceCodes = ['2001', '2002', '2003', '2004', '2022', '2021']
      if (deviceCodes.indexOf(this.draggingDevice.deviceCode) !== -1 || this.draggingDevice.markerType === '') {
        this.$message({
          message: '该设备不能添加点位',
          type: 'warning'
        })
        return
      }
      // TODO 停车场地图只能加车闸、电梯、摄像头
      if (this.currentSceneType === 2) {
        let markerType = [1, 5, 8]
        if (markerType.indexOf(this.draggingDevice.markerType) === -1) {
          this.$message({
            message: '该场景不能添加此类设备！',
            type: 'warning'
          })
          return
        }
      }
      event.preventDefault()
      event.stopPropagation()
      this.mapObj.closePopup()
      let _this = this
      if (this.currentScene === null) {
        this.$message({
          message: '请先在左边选中要添加场景',
          type: 'warning'
        })
        return
      }
      let marker = this.mapObj.getMarkerBylayerKey(this.draggingDevice.deviceId, this.currentLayer)
      // TODO 鼠标释放时的坐标和经纬度
      let coordinate = this.mapObj.getMap().getEventCoordinate(event)
      let centerGPS = this.mapObj.mapConfig.centerGPS
      // 现在的地图引擎transBitmapToWGS方法调用时，会改变传入的数组参数，所以创建一个新数组接收原来的坐标值
      let temPos = []
      temPos[0] = coordinate[0]
      temPos[1] = coordinate[1]
      let gps = null
      if (centerGPS[0] >= 180 || centerGPS[0] <= -180 || centerGPS[1] >= 90 || centerGPS[1] <= -90) {
        _this.$message({
          message: '该地图centerGPS已超出合理范围！',
          type: 'warning'
        })
        return
      }
      if (this.mapObj.mapConfig.scaleType === 0) {
        _this.$message({
          message: '该场景不能添加点位！',
          type: 'warning'
        })
        return
      }
      gps = this.mapObj.transBitmapToWGS(temPos)
      this.transferInfoSon.longitude = gps[0]
      this.transferInfoSon.latitude = gps[1]
      this.transferInfoSon.deviceName = this.draggingDevice.deviceName
      // TODO 判断拖动的点位类型--车闸与电梯该类设备可以在一个设备ID在多个场景下使用
      if (this.draggingDevice.markerType === 5 || this.draggingDevice.markerType === 8) {
        // TODO 车闸和电梯
        getMarkerInfo({ deviceId: this.draggingDevice.deviceId }).then(res => {
          if (res.data.data.length === 0) {
            this.dropConfig(this, coordinate, gps)
            return
          }
          var senceIdArray = []
          var markerInfo = null
          for (let i = 0; i < res.data.data.length; i++) {
            senceIdArray.push(res.data.data[i].sceneId)
            if (res.data.data[i].sceneId === this.transferInfoSon.sceneId) {
              markerInfo = res.data.data[i]
            }
          }
          // TODO 判断当前场景是否有该点位
          var isTrue = senceIdArray.indexOf(this.transferInfoSon.sceneId) >= 0
          if (isTrue) {
            // 如果点位已经存在，只需要将点位更新到新的位置即可
            marker.getGeometry().setCoordinates(coordinate)
            marker.extProperties.position = coordinate
            marker.extProperties.positionX = coordinate[0]
            marker.extProperties.positionY = coordinate[1]
            marker.extProperties.sceneId = this.transferInfoSon.sceneId
            marker.extProperties.markerType = this.draggingDevice.markerType
            marker.extProperties.longitude = gps[0]
            marker.extProperties.latitude = gps[1]
            // 获取对应的点位id
            if (markerInfo) {
              marker.extProperties.id = markerInfo.id
            }
            this.updateMarkerInfo(marker.extProperties)
          } else {
            this.dropConfig(this, coordinate, gps)
          }
        }).catch(err => {
          console.warn(LOG_TAG + 'getMarkerInfo接口调用err')
          console.warn(err)
        })
      } else {
        // TODO 不是电梯和车闸 deviceId对应一个id
        getMarkerInfo({ deviceId: this.draggingDevice.deviceId }).then(res => {
          // TODO 在所有场景都没添加过点位
          if (res.data.data.length === 0) {
            // TODO 所有场景上面都没添加
            this.dropConfig(this, coordinate, gps)
          } else {
            // TODO 某个场景已经有点位 更新点位
            if (res.data.data[0].sceneId === this.transferInfoSon.sceneId) {
              // 如果点位已经存在，只需要将点位更新到新的位置即可
              marker.getGeometry().setCoordinates(coordinate)
              marker.extProperties.position = coordinate
              marker.extProperties.positionX = coordinate[0]
              marker.extProperties.positionY = coordinate[1]
              marker.extProperties.sceneId = this.transferInfoSon.sceneId
              marker.extProperties.markerType = this.draggingDevice.markerType
              marker.extProperties.longitude = gps[0]
              marker.extProperties.latitude = gps[1]
              // 获取对应的点位id
              marker.extProperties.id = res.data.data[0].id
              this.updateMarkerInfo(marker.extProperties)
            } else {
              this.judgeInScene(res.data.data[0].sceneId, this)
            }
          }
        }).catch(err => {
          console.warn(LOG_TAG + 'getMarkerInfo接口调用err')
          console.warn(err)
        })
      }
    },
    /**
    * @description 拖动释放点位信息获取
    * @param {Object} vm  vue 的实例对象--this
    * @param {ARRAY} coordinate 点位坐标
    * @param {Object} vm  vue 的实例对象--this
    */
    dropConfig: function (vm, coordinate, gps) {
      let markerObj = {}
      markerObj.id = vm.draggingDevice.deviceId
      markerObj.position = coordinate
      if (gps) {
        markerObj.GPS = gps
        markerObj.latitude = gps[0]
        markerObj.longitude = gps[1]
      } else {
        markerObj.GPS = []
      }
      markerObj.name = vm.draggingDevice.deviceName
      markerObj.markerName = markerObj.name
      vm.transferInfoSon.markerType = vm.draggingDevice.markerType
      let type = vm.draggingDevice.markerType
      markerObj.imgUrl = warnImg
      markerObj.markerType = type
      vm.markerObj = markerObj
      vm.mapObj.addMarker(markerObj)
      vm.isSaveShow = true
      vm.dragAdd = true
      vm.mapObj.openDragTool((e) => {
        // 拖动开始
      }, (e) => {
        // 拖动结束
        // 拖动结束的坐标和经纬度
        let dragMarKerCoordinate = e.coordinate
        markerObj.position = e.coordinate
        // 现在的地图引擎transBitmapToWGS方法调用时，会改变传入的数组参数，所以创建一个新数组接收原来的坐标值
        let temPosition = []
        temPosition[0] = dragMarKerCoordinate[0]
        temPosition[1] = dragMarKerCoordinate[1]
        let dragMarKerGPS = vm.mapObj.transBitmapToWGS(temPosition)
        vm.transferInfoSon.longitude = dragMarKerGPS[0]
        vm.transferInfoSon.latitude = dragMarKerGPS[1]
        vm.transferInfoSon.deviceName = vm.draggingDevice.deviceName
      })
    },
    /**
    * @description 判断设备是否被其他场景占用
    * @param {String} sceneId  场景ID
    * @param {Object} vm  vue 的实例对象--this
    */
    judgeInScene: function (sceneId, vm) {
      getSceneInfo({ sceneId: sceneId }).then(result => {
        let name = result.data.data.sceneName
        vm.$message({
          message: '点位已被场景 [ ' + name + ' ] 占用',
          type: 'warning'
        })
      }).catch(err => {
        console.warn(LOG_TAG + 'getSceneInfo接口调用err')
        console.warn(err)
      })
    },
    /**
    * @description 点位管理 dragover函数
    * @param {Object} event Event 对象
    */
    allowDrop: function (event) {
      event.preventDefault()
    },
    /**
     * @description 点位管理 获取设备列表
     */
    onQueryDeviceList: function () {
      if (this.mapObj) {
        this.mapObj.closePopup()
      }
      let _this = this
      this.editFlag = false
      this.msg = '开启地图编辑'
      this.btnType = 'primary'
      if (this.deviceParam.deviceType === '') {
        this.$message({
          message: '请先选择要查询的设备类型！',
          type: 'warning'
        })
      } else {
        let option = addFilter(_this.deviceParam.deviceType)
        _this.deviceParam.filter = option.filter
        getDeviceList(_this.deviceParam).then((res) => {
          _this.deviceList = res.data.data
        }).catch(err => {
          console.warn(LOG_TAG + 'getDeviceList接口调用err')
          console.warn(err)
        })
      }
    },
    /**
     * @description 点位管理 获取场景列表
     */
    onQuerySceneList: function () {
      if (this.mapObj) {
        this.mapObj.closePopup()
      }
      let that = this
      this.editFlag = false
      this.msg = '开启地图编辑'
      this.btnType = 'primary'
      if (this.sceneParam.sceneType === '') {
        this.$message({
          message: '请选择场景类型！',
          type: 'warning'
        })
      } else {
        getSceneList(this.sceneParam).then((res) => {
          that.sceneList = res.data.data
        }).catch(err => {
          console.warn(LOG_TAG + 'getSceneList接口调用err')
          console.warn(err)
        })
      }
    },
    /**
     * @description 点位管理 重置场景查询参数
     */
    onResetSceneParam: function () {
      // 不发请求，不清空场景列表，只清空参数
      this.sceneParam.sceneType = ''
      this.sceneParam.sceneName = ''
    },
    /**
     * @description 点位管理 场景类型切换
     */
    onSceneTypeChange: function () {
      let that = this
      getSceneList(this.sceneParam).then((res) => {
        that.sceneList = res.data.data
        // 列表刷新后将默认不选择任何场景
        that.currentScene = null
      }).catch(err => {
        console.warn(LOG_TAG + 'err')
        console.warn(err)
      })
    },
    /**
     * @description 点位管理 设备类型切换
     */
    onDeviceTypeChange: function () {
      let markerType = getMarkerTypeByDeviceCode(this.deviceParam.deviceType)
      let that = this
      let option = addFilter(that.deviceParam.deviceType)
      getDeviceList(option).then((res) => {
        that.deviceList = res.data.data
        // 根据设备类型判断设备的图标
        that.backgroundUrl = getDeviceIcon(markerType, that.backgroundUrl)
      }).catch(err => {
        that.backgroundUrl = '#fff'
        console.warn(LOG_TAG + '查询设备列表err')
        console.warn(err)
      })
    },
    /**
     * @description 点位管理 获取场景详细信息
     */
    onShowScene: function (index, sceneId) {
      this.editFlag = false
      this.msg = '开启地图编辑'
      this.btnType = 'primary'
      this.currentScene = index
      this.currentSceneId = sceneId
      this.transferInfoSon.sceneId = sceneId
      let options = {}
      options.sceneId = this.sceneList[index].id
      getSceneInfo(options).then((res) => {
        // TODO 切换地图
        this.currentSceneInfo = res.data.data
        if (res.data.data) {
          this.createMap(res.data.data)
        }
      }).catch(err => {
        console.warn(LOG_TAG + '获取场景信息失败')
        console.warn(err)
      })
    },
    /**
     * @description ElementUI 的功能函数
     */
    onHandleNodeClick (data) {
      this.OrgName = data.name
      this.deviceParam.orgId = data.uuid
      this.isShowPopover = false
    },
    /**
    *@description 输入框focus时，进行传值
    */
    propOrgDara () {
      console.log('父组件propOrgDara')
      this.$refs['orgTree'].treeDatas = this.treeDatas
    },
    /**
     * @description 点位管理 重置设备查询参数
     */
    onResetDeviceParam: function () {
      // 清空参数（设备类型重置为2001），清空列表，发送请求
      this.deviceParam.deviceType = '2001'
      this.deviceParam.deviceName = ''
      this.deviceParam.orgId = ''
      this.OrgName = ''
      let that = this
      getDeviceList(that.deviceParam).then((res) => {
        that.deviceList = res.data.data
        this.backgroundUrl = 'url(' + this.camermImgUrl + ')'
      }).catch(err => {
        that.backgroundUrl = '#fff'
        console.warn(LOG_TAG + '重置查询设备列表err')
        console.warn(err)
      })
    },
    /**
     * @description 点位管理 点击设备列表的设备，使地图显示该设备的点位
     * @param {string} key 一级设备的键
     * @param {Object} e Event对象
     * @param {string} id 子设备的id
     * @param {oldname} deviceName 设备名称
     */
    onCheckdevice: function (key, e, id, deviceName) {
      let _this = this
      this.mapObj.closePopup()
      testPopup(deviceName)
      function testPopup (newDeviceName) {
        var deviceId = id
        var sceneIndex = _this.currentScene
        if (_this.sceneList.length === 0 || _this.currentScene === null) {
          _this.$message({
            message: '请先在左边场景列表选中一个场景！',
            type: 'warning'
          })
          return
        }
        var sceneId = _this.sceneList[sceneIndex].id
        // 目前的需求是一个设备id可能存在多个场景中，通过deviceId 获取 该设备是否有对应的场景点位
        getMarkerInfo({ deviceId: deviceId }).then(res => {
          var markerInfo = null
          for (let i = 0; i < res.data.data.length; i++) {
            const element = res.data.data[i]
            if (element.sceneId === _this.transferInfoSon.sceneId) {
              markerInfo = element
            }
          }
          // 该设备已经在某个场景中使用，如果这个是当前场景，则可用通过拖拽更新，否则当前场景不能再添加该设备！
          let selfMarkerInfo = markerInfo
          if (selfMarkerInfo && sceneId === selfMarkerInfo.sceneId) {
            // 该设备有对应该场景的点位，可更新对应信息
            // 获取当前场景下的所有点位
            let posX = selfMarkerInfo.positionX
            let posY = selfMarkerInfo.positionY + 200
            if (newDeviceName) {
              _this.mapObj.popupDefault([posX, posY], newDeviceName)
            } else {
              _this.mapObj.popupDefault([posX, posY], 'undefined')
            }
          }
        })
      }
    },
    /**
     * @description 点位管理 添加设备点位
     * @param {Object} markerObj 地图实例对象
     */
    addDeviceMarker: function (data) {
      let _this = this
      addMarker(data).then((res) => {
        data.position = this.markerObj.position
        delete data.zoomLevel
        _this.$message({
          message: '点位添加成功',
          type: 'success'
        })
        _this.mapObj.addMarker(data, scaleMap)
        // TODO 更新右边设备列表最右边的图标的切换 crossImg(打叉) checkImg(打钩) previewImg(预览)
        _this.onDeviceTypeChange()
        _this.markerObj = ''
      }).catch(err => {
        console.warn(err)
        _this.$message({
          message: '服务器或网络连接错误，点位添加失败！',
          type: 'warning'
        })
      })
    },
    /**
     * @description 点位管理 更新点位信息
     * @param {Object} featureInfo 点位特征信息
     */
    updateMarkerInfo: function (featureInfo) {
      let that = this
      updateMarker(featureInfo).then((res) => {
        this.$message({
          message: '点位更新成功！',
          type: 'success'
        })
        that.markerObj = ''
      }).catch(err => {
        this.$message({
          message: '服务器或网络连接错误，点位更新失败！',
          type: 'warning'
        })
        console.warn(err)
        that.mapObj.removeMarkerBylayerKey(this.selectedMarker.id, this.layer)
        that.mapObj.addMarker(that.resetOldOption, scaleMap)
        that.emptyTransferInfoSon()
      })
    },
    /**
     * @description 点位管理 删除点位
     */
    removeMarker: function () {
      this.mapObj.closePopup()
      let that = this
      if (this.msg === '关闭地图编辑') {
        // 删除点位后关闭地图编辑
        this.mapObj.closeDragTool()
        let selectedMarkerId = []
        let deletedId = that.selectedMarker.markerId
        // 目前暂时是单个删除
        selectedMarkerId = [deletedId]
        if (selectedMarkerId.length === 0 || !deletedId) {
          this.$message({
            message: '没获到点位信息，请点击选中点位后再删除！',
            type: 'warning'
          })
          return
        }
        deleteMarker({ markerIds: selectedMarkerId }).then(res => {
          if (that.selectedMarker.id !== that.selectedMarker.deviceId) {
            that.selectedMarker.id = that.selectedMarker.deviceId
          }
          if (that.selectedMarker.id && that.layer) {
            that.mapObj.removeMarkerBylayerKey(that.selectedMarker.id, that.layer)
          } else {
            that.$message({
              message: '设备ID或设备图层不存在',
              type: 'warning'
            })
          }
          that.$message({
            message: '点位删除成功',
            type: 'success'
          })
          // TODO 更新右边设备列表最右边的图标的切换 crossImg(打叉) checkImg(打钩) previewImg(预览)
          that.onDeviceTypeChange()
          that.selectedMarker = {}
        }).catch((err) => {
          that.$message({
            message: '服务器或网络连接错误，点位删除失败！',
            type: 'warning'
          })
          that.selectedMarker = {}
          console.warn(err)
        })
        this.editFlag = false
        this.btnType = 'primary'
        this.msg = '开启地图编辑'
      } else {
        this.$message({
          message: '请先开启地图编辑',
          type: 'warning'
        })
        this.selectedMarker = {}
      }
    },
    // 编辑地图（更新点位、删除点位）
    /**
     * @description 点位管理 地图编辑
     */
    onModifyMap () {
      if (this.isSaveShow) {
        this.$message({
          message: '请先保存点位！',
          type: 'warning'
        })
        return
      }
      let that = this
      this.mapObj.closePopup()
      // 每次点击编辑按钮，都把选中点的保存信息情况
      this.selectedMarker = {}
      if (!this.editFlag) {
        // 参数一：监听拖动开始 参数二：监听拖动结束 参数三： 监听选中
        that.mapObj.openDragTool(function (e) {
          that.mapObj.closePopup()
        }, function (e) {
          // 拖动结束
          // 获取到当前坐标
          that.transferInfoSon.addOrEdit = 'edit'
          // 移动的GPS点
          let newPosition = e.coordinate
          let newOption = e.features.array_[0].extProperties
          newOption.position = newPosition
          let centerGPS = that.mapObj.mapConfig.centerGPS
          let temPos = []
          temPos[0] = newPosition[0]
          temPos[1] = newPosition[1]
          let gps = null
          if (centerGPS[0] >= 180 || centerGPS[0] <= -180 || centerGPS[1] >= 90 || centerGPS[1] <= -90) {
            that.$message({
              message: '该地图centerGPS已超出合理范围！',
              type: 'warning'
            })
            return
          }
          if (that.mapObj.mapConfig.scaleType === 0) {
            that.$message({
              message: '该地图不能添加点位！',
              type: 'warning'
            })
            return
          }
          gps = that.mapObj.transBitmapToWGS(temPos)
          newOption.GPS = gps
          that.editMarkerObj = newOption
          var deviceId = e.features.array_[0].extProperties.deviceId
          // 获取点位信息
          getMarkerInfo({ deviceId: deviceId }).then(res => {
            var markerInfo = null
            for (let i = 0; i < res.data.data.length; i++) {
              const element = res.data.data[i]
              if (element.sceneId === that.transferInfoSon.sceneId) {
                markerInfo = element
              }
            }
            if (!markerInfo) {
              that.$message({
                message: '该点位已经被删除，请刷新页面',
                type: 'warning'
              })
              return
            }
            // 保存点位信息
            that.resetMarkerInfo = markerInfo
            var areaId = markerInfo.areaId
            that.transferInfoSon.echoInfo.areaId = markerInfo.areaId
            if (markerInfo) {
              // areaId存在----表示在楼栋内
              if (areaId !== 'null' && areaId !== '' && areaId !== null) {
                getAreaInfo({ areaId: areaId }).then(res => {
                  that.transferInfoSon.echoInfo.orgCode = res.data.data.orgCode
                  that.transferInfoSon.echoInfo.orgName = res.data.data.orgName
                  that.transferInfoSon.echoInfo.longitude = gps[0]
                  that.transferInfoSon.echoInfo.latitude = gps[1]
                  that.transferInfoSon.echoInfo.deviceName = markerInfo.markerName
                  that.transferInfoSon.echoInfo.markerType = markerInfo.markerType
                  that.transferInfoSon.echoInfo.zoomLevel = markerInfo.zoomLevel
                  that.transferInfoSon.echoInfo.inBuilding = markerInfo.inBuilding
                  that.transferInfoSon.echoInfo.floorType = markerInfo.floorType
                  that.transferInfoSon.echoInfo.sceneId = markerInfo.sceneId
                  that.$refs.addMarkerPopup.openDialog()
                }).catch(err => {
                  console.warn(LOG_TAG + 'getAreaInfo接口调用err')
                  console.warn(err)
                })
                return
              }
              // areaId不存在存在----表示不在楼栋内
              that.transferInfoSon.echoInfo.longitude = gps[0]
              that.transferInfoSon.echoInfo.latitude = gps[1]
              that.transferInfoSon.echoInfo.deviceName = markerInfo.markerName
              that.transferInfoSon.echoInfo.markerType = markerInfo.markerType
              that.transferInfoSon.echoInfo.zoomLevel = markerInfo.zoomLevel
              that.transferInfoSon.echoInfo.sceneId = markerInfo.sceneId
              that.$refs.addMarkerPopup.openDialog()
              return
            }
            that.$message({
              message: '点位数据为空！',
              type: 'warning'
            })
          }).catch(err => {
            console.warn(LOG_TAG + 'getMarkerInfo接口调用err')
            console.warn(err)
          })
        })
        this.editFlag = true
        this.btnType = 'success'
        this.msg = '关闭地图编辑'
        return
      }
      this.mapObj.closeDragTool()
      this.editFlag = false
      this.btnType = 'primary'
      this.msg = '开启地图编辑'
    },
    /**
     * @description 点位管理 删除点位
     */
    onDeleteFeature () {
      this.removeMarker()
    },
    onConfigFeature () {
      // 点位弹窗配置
      this.transferInfoSon.addOrEdit = 'add'
      this.$refs.addMarkerPopup.openDialog()
      this.mapObj.closeDragTool()
      this.dragAdd = false
      this.previewAdd = false
    },
    onCancelConfigFeature () {
      this.mapObj.closeDragTool()
      this.mapObj.removeMarkerBylayerKey(this.markerObj.id, this.currentLayer)
      this.isSaveShow = false
      this.dragAdd = false
      this.previewAdd = false
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

/* MapApp.less公共样式end */

div {
  box-sizing: border-box;
}

.map-app {
  display: flex;
  /* 头、中部、脚纵向显示 */
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
      .button-group {
        width: 100%;
        height: 40px;
        margin-top: 20px;
        background: none;
        padding-left: 40px;
      }
      #markerMapDiv {
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
      overflow: auto;
    }
    .list-area {
      flex: 1;
      overflow: auto;
    }
    .list-area .selectAllCheckbox {
      padding: 10px;
    }
    .search-sence-area {
      flex: 0 0 200px;
      border-bottom: 1px solid #ccc;
    }
    .search-device-area {
      flex: 0 0 250px;
      border-bottom: 1px solid #ccc;
    }
  }
  .search-form {
    overflow: hidden;
    padding: @origin 0;
    .common-input {
      margin: 15px auto;
    }
  }
  .search-toolbar {
    margin-top: 20px;
    padding: 5px 15px 5px 0;
    width: 100%;
    height: 40px;
    text-align: right;
    .search-btn {
      height: 40px;
      width: 30%;
      padding: @origin*.7 @origin*1.5;
    }
  }
  .data-list {
    box-sizing: border-box;
    padding: 15px;
    width: 100%;
    height: 100%;
    line-height: 30px;
    overflow-y: auto;
    .list-item {
      list-style: none;
      padding: 0px 30px;
      text-align: left;
      border-bottom: solid 1px #aaa;
      width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    .list-item.sceneItem {
      height: 40px;
      line-height: 40px;
    }
    .active {
      color: white;
      background: rgba(34, 156, 255, 1);
    }
    &.device-list {
      .list-item {
        padding: 0 15px;
        width: 200px;
        .device-icon {
          flex: 0 0 30px;
          flex-direction: column;
          width: 30px;
          height: 40px;
          float: left;
          .icon-item {
            background-size: 30px 30px;
            width: 30px;
            height: 30px;
            margin-top: 8px;
            display: block;
          }
        }
        .device-text-group {
          position: relative;
          flex: 1;
          .device-name-text {
            font-size: 14px;
            line-height: 28px;
            font-weight: 700;
            height: 28px;
            width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .device-desc-text {
            height: 12px;
            font-size: 12px;
            line-height: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .device-control {
            font-size: 20px;
            color: #409eff;
            position: absolute;
            right: 5px;
            top: 1px;
          }
        }
        .item-single-line {
          padding: 5px 0;
        }
      }
      .sub-device-list {
        list-style: none;
        padding-left: 15px;
        width: 225px;
        .list-item {
          border-top: 1px solid #ccc;
          border-bottom: none;
          width: 190px;
        }
      }
    }
  }
  .device-list > .list-item {
    cursor: pointer;
  }
}
</style>