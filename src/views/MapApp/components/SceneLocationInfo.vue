<template>
  <div class="location-info">
    <div class="row-flow edit-content">
      <div class="form-area">
        <div class="info-item">比例尺:&nbsp;&nbsp;
          <span>{{formSceneInfo.scale}}</span>
        </div>
        <div class="info-item">旋转角度：&nbsp;&nbsp;
          <span v-if="formGPS.arcAngle">{{Number(parseFloat(formGPS.arcAngle)*180/Math.PI).toFixed(8)}}</span>
        </div>
        <div class="info-item">
          <span class="color-style">说明：经度范围: -180 到 180, 纬度范围: -90 到 90</span>
        </div>
        <!--计算方式切换模块-->
        <div class="info-item">
          比例尺计算：
          <el-radio-group ref="formSceneInfo" v-model="formSceneInfo.scaleType">
            <el-radio :label="1">取点计算</el-radio>
          </el-radio-group>
        </div>
        <!-- 取点计算模块 -->
        <el-form ref="formGPS" :rules="rules" :model="formGPS" label-width="80px" v-if="formSceneInfo.scaleType===1" class="form-calculate-coordinate">
          <el-form-item label="实际位置1:">
            <el-input v-model="formGPS.reallongitude1" prop="reallongitude1" class="input-small right-child" v-on:blur="blur1()" placeholder="输入经度值" :maxlength="24"></el-input>
            <el-input v-model="formGPS.reallat1" prop="reallat1" class="input-small left-child" v-on:blur="blur1()" placeholder="输入纬度值" :maxlength="24"></el-input>
          </el-form-item>
          <el-form-item label="点位坐标1:" @click.native="onPoint(1,$event)" ref="shuru">
            <el-input v-model="formGPS.ptlongitude1" prop='ptlongitude1' class="input-small right-child"></el-input>
            <el-input v-model="formGPS.ptlat1" prop='ptlat1' class="input-small left-child"></el-input>
            <div class="position-btn" @click.native="onPoint(5,$event)">
              <i class="el-icon-location pick-ico" title="点击我,再点击地图可获取点位坐标"></i>
            </div>
          </el-form-item>
          <el-form-item label="实际位置2:">
            <el-input v-model="formGPS.reallongitude2" prop="reallongitude2" class="input-small right-child" :maxlength="24" v-on:blur="blur2()" placeholder="输入经度值"></el-input>
            <el-input v-model="formGPS.reallat2" prop='reallat2' class="input-small left-child" :maxlength="24" v-on:blur="blur2()" placeholder="输入纬度值"></el-input>
          </el-form-item>
          <el-form-item label="点位坐标2:" ref="shuru" @click.native="onPoint(3,$event)">
            <el-input v-model="formGPS.ptlongitude2" prop="ptlongitude2" class="input-small right-child"></el-input>
            <el-input v-model="formGPS.ptlat2" prop='ptlat2' class="input-small left-child"></el-input>
            <div class="position-btn" @click.native="onPoint(3,$event)">
              <i class="el-icon-location pick-ico" title="点击我,再点击地图可获取点位坐标"></i>
            </div>
          </el-form-item>
          <el-form-item label="实际位置3:">
            <el-input v-model="formGPS.reallongitude3" prop="reallongitude3" class="input-small right-child" :maxlength="24" v-on:blur="blur3()" placeholder="输入经度值"></el-input>
            <el-input v-model="formGPS.reallat3" prop='reallat3' class="input-small left-child" :maxlength="24" v-on:blur="blur3()" placeholder="输入纬度值"></el-input>
          </el-form-item>
          <el-form-item label="点位坐标3:" ref="shuru" @click.native="onPoint(5,$event)">
            <el-input v-model="formGPS.ptlongitude3" prop='ptlongitude3' class="input-small right-child"></el-input>
            <el-input v-model="formGPS.ptlat3" prop='ptlat3' class="input-small left-child"></el-input>
            <div class="position-btn" @click.native="onPoint(5,$event)">
              <i class="el-icon-location pick-ico" title="点击我,再点击地图可获取点位坐标"></i>
            </div>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary pull-right" @click="onCalScale">计算</el-button>
        </div>
      </div>
      <!--图片显示区域-->
      <div class="map-area">
        <div id="mapSceneDiv"></div>
      </div>
    </div>
    <div class="row-flow btn-group">
      <el-button @click="onCanclePage" class="btn-item">取消</el-button>
      <el-button @click="onSavePage" class="btn-item" :loading="isLoading">保存</el-button>
      <el-button @click="onBackPage" class="btn-item">返回</el-button>
    </div>
  </div>
</template>
<script>
import { setSceneScaleByGPS } from '@/views/MapApp/apis/index.js'
import { LOG_TAG } from '@/views/MapApp/assets/js/index.js'
import hdmap from 'hdmap'
import markerImage1 from '@/views/MapApp/assets/images/icon1.png'
import markerImage2 from '@/views/MapApp/assets/images/icon2.png'
import markerImage3 from '@/views/MapApp/assets/images/icon3.png'
export default {
  props: {
    sceneInfo: {
      type: Object
    },
    onCanclePage: {
      type: Function
    }
  },
  data () {
    var GPSNum = (rule, value, callback) => {
      if (!/^(-?\d+)(\.\d+)?$/.test(value)) {
        callback(new Error('请输入正确的数据！'))
      } else {
        callback()
      }
    }
    return {
      locationPoints: null,
      isLoading: false,
      // 比例尺计算方式 1-gps 2-宽高
      scaleType: 1,
      // 以下3个为gps计算尺是的三个点位对象
      markerObj1: {},
      markerObj2: {},
      markerObj3: {},
      // 地图对象
      mapObj: null,
      // 场景定位信息的通有属性(默认值)
      defaultScene: {
        sceneId: null,
        scaleType: 1,
        scale: null
      },
      // 场景定位信息的通有属性
      formSceneInfo: {
        sceneId: null,
        scaleType: 1,
        scale: null
      },
      defaultSceneGPS: {
        reallongitude1: null,
        reallat1: null,
        ptlongitude1: null,
        ptlat1: null,
        reallongitude2: null,
        reallat2: null,
        ptlongitude2: null,
        ptlat2: null,
        reallongitude3: null,
        reallat3: null,
        ptlongitude3: null,
        ptlat3: null,
        centerLon: 0,
        centerLat: 0,
        scale: null,
        arcAngle: 0
      },
      // 场景定位信息的gps计算对象
      formGPS: {
        reallongitude1: null,
        reallat1: null,
        ptlongitude1: null,
        ptlat1: null,
        reallongitude2: null,
        reallat2: null,
        ptlongitude2: null,
        ptlat2: null,
        reallongitude3: null,
        reallat3: null,
        ptlongitude3: null,
        ptlat3: null,
        centerLon: null,
        centerLat: null,
        arcAngle: 0
      },
      // 校验规则
      rules: {
        reallat1: [
          { validator: GPSNum, required: true, min: 0, max: 9, message: '请输入有效的数值', trigger: 'blur' }
        ],
        reallongitude1: [
          { validator: GPSNum, required: true, min: 2, max: 9, message: '请输入有效的数值', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
         * @description 地图销毁
    */
    destroyMap () {
      this.mapObj.getMap().setTarget(null)
      this.mapObj.destroy()
      this.mapObj = {}
    },
    /**
     * @description 表单重置
     */
    resetForm () {
      this.formGPS = Object.assign({}, this.defaultSceneGPS)
      if (this.mapObj && Object.keys(this.mapObj).length !== 0) {
        this.destroyMap()
      }
      this.$refs['formGPS'].resetFields()
    },
    /**
     * @description 场景定位信息入口
     * @param sceneInfo-场景对象
     */
    setLocationInfo: function (sceneInfo) {
      this.locationPoints = sceneInfo.locationPoints
      this.resetForm()
      this.mapInit(sceneInfo)
      this.initsceneGPS(sceneInfo)
    },
    /**
     *@description 初始化点位计算界面,1代表点位计算，2代表宽度计算
     *@param {obj} val 点位信息
    */
    initsceneGPS: function (val) {
      if (!val) {
        this.formSceneInfo = Object.assign({}, this.defaultScene)
        this.formSceneInfo.scaleType = 1
        // this.formGPSBySize = Object.assign({}, this.defaultSceneGPSBySize)
        this.formGPS = Object.assign({}, this.defaultSceneGPS)
      } else if (parseInt(val.scaleType) === 1) {
        this.formSceneInfo.scaleType = val.scaleType
        this.formSceneInfo.scale = val.scale
        this.formSceneInfo.sceneId = val.id
        // this.formGPSBySize = Object.assign({}, this.defaultSceneGPSBySize)
        this.formGPS.reallongitude1 = val.locationPoints[0].gpsLongitude
        this.formGPS.reallat1 = val.locationPoints[0].gpsLatitude
        this.formGPS.ptlongitude1 = val.locationPoints[0].pointX
        this.formGPS.ptlat1 = val.locationPoints[0].pointY
        this.formGPS.reallongitude2 = val.locationPoints[1].gpsLongitude
        this.formGPS.reallat2 = val.locationPoints[1].gpsLatitude
        this.formGPS.ptlongitude2 = val.locationPoints[1].pointX
        this.formGPS.ptlat2 = val.locationPoints[1].pointY
        this.formGPS.reallongitude3 = val.locationPoints[2].gpsLongitude
        this.formGPS.reallat3 = val.locationPoints[2].gpsLatitude
        this.formGPS.ptlongitude3 = val.locationPoints[2].pointX
        this.formGPS.ptlat3 = val.locationPoints[2].pointY
        this.formGPS.ptlat3 = val.locationPoints[2].pointY
        this.formGPS.centerLon = val.centerLon
        this.formGPS.centerLat = val.centerLat
        this.formGPS.arcAngle = val.arcAngle
      } else {
        this.formGPS = Object.assign({}, this.defaultSceneGPS)
        this.formSceneInfo.scaleType = 1
        this.formSceneInfo.scale = val.scale
        this.formSceneInfo.sceneId = val.id
      }
    },
    /**
    *@description GPS1坐标的数据校验
    */
    blur1 () {
      if ((Math.abs(this.formGPS.reallongitude1) > 180) || (this.formGPS.reallongitude1 === '') || (Math.abs(this.formGPS.reallat1) > 90) || (this.formGPS.reallat1 === '')) {
        this.$message({
          message: '请检查实际位置1输入的经纬度是否正确！',
          type: 'warning'
        })
      }
    },
    /**
    *@description GPS2坐标的数据校验
    */
    blur2 () {
      if ((Math.abs(this.formGPS.reallongitude2) > 180) || (this.formGPS.reallongitude2 === '') || (Math.abs(this.formGPS.reallat2) > 90) || (this.formGPS.reallat2 === '')) {
        this.$message({
          message: '请检查实际位置2输入的经纬度是否正确！',
          type: 'warning'
        })
      }
    },
    /**
    *@description GPS3坐标的数据校验
    */
    blur3 () {
      if ((Math.abs(this.formGPS.reallongitude3) > 180) || (this.formGPS.reallongitude3 === '') || (Math.abs(this.formGPS.reallat3) > 90) || (this.formGPS.reallat3 === '')) {
        this.$message({
          message: '请检查实际位置3输入的经纬度是否正确！',
          type: 'warning'
        })
      }
    },
    /**
   *@description 获取描点事件
   *@param {number} num 点位序号
   *@param $event  event事件
   */
    onPoint: function (num, $event) {
      this.currentSelect = num
      for (var i = 1; i <= 5; i += 2) {
        if (parseInt(i) === parseInt(num)) {
          this.$refs.formGPS.$children[i].$el.childNodes[0].style.color = 'blue'
        } else {
          this.$refs.formGPS.$children[i].$el.childNodes[0].style.color = '#606266'
        }
      }
    },
    /**
   *@description 计算方式切换
   */

    /**
   *@description 页面数据保存
   */
    onSavePage () {
      console.log(LOG_TAG + 'savePage begin')
      // 计算方式选择，调用点位
      if (parseInt(this.formSceneInfo.scaleType) === 1) {
        let params = Object.assign({}, this.formSceneInfo)
        let sceneInfoGPS = Object.assign({}, this.formGPS)
        params.locationPoints = []
        params.locationPoints[0] = {}
        params.locationPoints[1] = {}
        params.locationPoints[2] = {}
        params.locationPoints[0].sceneId = this.formSceneInfo.sceneId
        params.locationPoints[0].gpsLongitude = sceneInfoGPS.reallongitude1
        params.locationPoints[0].gpsLatitude = sceneInfoGPS.reallat1
        params.locationPoints[0].pointX = sceneInfoGPS.ptlongitude1
        params.locationPoints[0].pointY = sceneInfoGPS.ptlat1
        params.locationPoints[0].pointType = 3

        params.locationPoints[1].sceneId = this.formSceneInfo.sceneId
        params.locationPoints[1].gpsLongitude = sceneInfoGPS.reallongitude2
        params.locationPoints[1].gpsLatitude = sceneInfoGPS.reallat2
        params.locationPoints[1].pointX = sceneInfoGPS.ptlongitude2
        params.locationPoints[1].pointY = sceneInfoGPS.ptlat2
        params.locationPoints[1].pointType = 3

        params.locationPoints[2].sceneId = this.formSceneInfo.sceneId
        params.locationPoints[2].gpsLongitude = sceneInfoGPS.reallongitude3
        params.locationPoints[2].gpsLatitude = sceneInfoGPS.reallat3
        params.locationPoints[2].pointX = sceneInfoGPS.ptlongitude3
        params.locationPoints[2].pointY = sceneInfoGPS.ptlat3
        params.locationPoints[2].pointType = 3
        params.centerLon = sceneInfoGPS.centerLon || this.formGPS.centerLon
        params.centerLat = sceneInfoGPS.centerLat || this.formGPS.centerLat
        params.arcAngle = sceneInfoGPS.arcAngle || this.formGPS.arcAngle
        // 校验点位1
        if (!this.formGPS.ptlongitude1 || !this.formGPS.ptlat1 || !this.formGPS.reallat1 || !this.formGPS.reallongitude1) {
          this.$message({
            message: '请检查点位1的信息是否录入完整！',
            type: 'warning'
          })
          return
        }
        // 校验点位2
        if (!this.formGPS.ptlongitude2 || !this.formGPS.reallongitude2 || !this.formGPS.ptlongitude2 || !this.formGPS.ptlat2) {
          this.$message({
            message: '请检查点位2的信息是否录入完整！',
            type: 'warning'
          })
          return
        }
        // 校验点位3
        if (!this.formGPS.ptlongitude3 || !this.formGPS.reallongitude3 || !this.formGPS.ptlongitude3 || !this.formGPS.ptlat3) {
          this.$message({
            message: '请检查点位3的信息是否录入完整！',
            type: 'warning'
          })
          return
        }
        // 校验比例尺是否为正
        if (this.formSceneInfo.scale <= 0) {
          this.$message({
            message: '请检查数据是否正确，比例尺必须大于0！',
            type: 'warning'
          })
          return
        }
        params.scaleType = Number(params.scaleType)
        params.scale = Number(params.scale)
        params.centerLon = parseFloat(params.centerLon)
        params.centerLat = parseFloat(params.centerLat)
        params.arcAngle = parseFloat(Number(params.arcAngle).toFixed(8))
        // setSceneByGPS接口
        setSceneScaleByGPS(params).then(res => {
          if (res.data.code === '00000') {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }
          this.isLoading = false
          this.onCanclePage()
        }).catch(err => {
          this.isLoading = false
          console.warn(err)
        })
      }
    },
    /**
   *@description 返回事件
   */
    onBackPage () {
      this.resetForm()
      this.$parent.editSceneInfo(this.sceneInfo)
    },
    /**
    *@description 比例尺计算,比例尺数据类型Num(12，6)
    */
    onCalScale () {
      console.log(LOG_TAG + ' location calculate begin')
      let dotArr = []
      // 点位1的校验
      if (!this.formGPS.reallongitude1 || !this.formGPS.reallat1 || !this.formGPS.ptlongitude1 || !this.formGPS.ptlat1) {
        this.$message({
          message: '请检查点位1信息是否输入完整！',
          type: 'warning'
        })
        return
      }
      // 点位2的校验
      if (!this.formGPS.reallongitude2 || !this.formGPS.reallat2 || !this.formGPS.ptlongitude2 || !this.formGPS.ptlat2) {
        this.$message({
          message: '请检查点位2信息是否输入完整！',
          type: 'warning'
        })
        return
      }
      // 点位3的校验
      if (!this.formGPS.reallongitude3 || !this.formGPS.reallat3 || !this.formGPS.ptlongitude3 || !this.formGPS.ptlat3) {
        this.$message({
          message: '请检查点位3信息是否输入完整！',
          type: 'warning'
        })
        return
      }
      var lonlats = {}
      lonlats.lonlatA = [Number(this.formGPS.reallongitude1), Number(this.formGPS.reallat1)]
      lonlats.lonlatB = [Number(this.formGPS.reallongitude2), Number(this.formGPS.reallat2)]
      lonlats.lonlatC = [Number(this.formGPS.reallongitude3), Number(this.formGPS.reallat3)]
      // 点位坐标
      var points = {}
      points.pointA = [Number(this.formGPS.ptlongitude1), Number(this.formGPS.ptlat1)]
      points.pointB = [Number(this.formGPS.ptlongitude2), Number(this.formGPS.ptlat2)]
      points.pointC = [Number(this.formGPS.ptlongitude3), Number(this.formGPS.ptlat3)]
      // 获取中心点
      if (hdmap.utils.getCenterGPS(this.mapObj, lonlats, points)) {
        this.formGPS.centerLon = Number(hdmap.utils.getCenterGPS(this.mapObj, lonlats, points)[0]).toFixed(6)
        this.formGPS.centerLat = Number(hdmap.utils.getCenterGPS(this.mapObj, lonlats, points)[1]).toFixed(6)
      } else {
        this.$message({
          message: '请检查录入的坐标数据是否正确！',
          type: 'warning'
        })
        return
      }
      // 计算偏转角
      this.formGPS.arcAngle = hdmap.utils.getArcAngle(this.mapObj, lonlats, points)
      console.log('地图偏转弧度: ' + this.formGPS.arcAngle, ' 地图偏转角度: ' + this.formGPS.arcAngle * 180 / Math.PI)
      // 计算比例尺
      if ((hdmap.utils.getScaleByGPS(this.mapObj, lonlats, points) && (hdmap.utils.getScaleByGPS(this.mapObj, lonlats, points) > 0))) {
        let GPSScale = hdmap.utils.getScaleByGPS(this.mapObj, lonlats, points)
        if (GPSScale >= 1000000) {
          this.$message({
            message: '比例尺超出上限1000000,请检查数据是否录入正确',
            type: 'warning'
          })
          return
        }
        // 比例尺为整数时
        if (GPSScale % 2 === 0 || GPSScale % 2 === 1) {
          this.formSceneInfo.scale = GPSScale
        } else {
          dotArr = (hdmap.utils.getScaleByGPS(this.mapObj, lonlats, points) + '').split('.')
          this.formSceneInfo.scale = dotArr[1].length > 6 ? Number(GPSScale).toFixed(6) : GPSScale
        }
      } else {
        this.formSceneInfo.scale = hdmap.utils.getScaleByGPS(this.mapObj, lonlats, points)
        this.$message({
          message: '请检查数据是否输入完整！',
          type: 'warning'
        })
      }
    },
    /**
    *@description 地图初始化
    */
    mapInit: function (sceneInfo) {
      console.log(sceneInfo)
      console.log(LOG_TAG + 'mapInit begin')
      let that = this
      let callback = function (args1, eventType) {
        if (args1.eventType === 'singleclick') {
          if (that.currentSelect === 0) {
            that.$message('请选择点位')
          } else {
            var num = that.currentSelect
            console.log('args1: ')
            console.log(args1)
            var px = Number(args1.coordinate[0]).toFixed(6)
            var py = Number(args1.coordinate[1]).toFixed(6)
            if (num === 1) {
              that.formGPS.ptlongitude1 = px
              that.formGPS.ptlat1 = py
              that.markerObj1 = {
                position: [px, py],
                markerName: '点位1',
                imgUrl: markerImage1,
                id: '111',
                size: [34, 41],
                markerType: 'camera'
              }
              // 点击取点时判断，如果已经去过点，再次点击取点时就更新点位；如果没有取过点位，则点击时新增点位
              if (that.mapObj.getMarkerById(that.markerObj1.id)) {
                that.mapObj.updateMarker(that.markerObj1)
              } else {
                that.mapObj.addMarker(that.markerObj1)
              }
            } else if (num === 3) {
              that.formGPS.ptlongitude2 = px
              that.formGPS.ptlat2 = py
              that.markerObj2 = {
                position: [px, py],
                markerName: '点位2',
                imgUrl: markerImage2,
                id: '222',
                size: [34, 41],
                markerType: 'camera'
              }
              if (that.mapObj.getMarkerById(that.markerObj2.id)) {
                that.mapObj.updateMarker(that.markerObj2)
              } else {
                that.mapObj.addMarker(that.markerObj2)
              }
            } else {
              that.formGPS.ptlongitude3 = px
              that.formGPS.ptlat3 = py
              that.markerObj3 = {
                position: [px, py],
                markerName: '点位3',
                imgUrl: markerImage3,
                id: '333',
                size: [34, 41],
                markerType: 'camera'
              }
              if (that.mapObj.getMarkerById(that.markerObj3.id)) {
                that.mapObj.updateMarker(that.markerObj3)
              } else {
                that.mapObj.addMarker(that.markerObj3)
              }
            }
          }
        } else {
          this.$message('map clicked')
        }
      }
      let centerGPSData = [sceneInfo.centerLon, sceneInfo.centerLat]
      // 图片加载完成后初始化地图
      try {
        // eslint-disable-next-line
        that.mapObj = new hdmap.initMap({
          gisEngine: 'tile',
          sizeW: sceneInfo.width,
          sizeH: sceneInfo.height,
          domId: 'mapSceneDiv',
          mapUrl: sceneInfo.url,
          maxZoom: sceneInfo.maxZoom,
          minZoom: sceneInfo.minZoom,
          centerGPS: centerGPSData,
          scale: sceneInfo.scale,
          scaleType: sceneInfo.scaleType,
          arcAngle: sceneInfo.arcAngle,
          zoom: 2,
          center: [0, 0]
        })
        // 场景新增时，无点位；场景编辑并且比例尺计算方式是点位计算时，显示三个点位
        if (that.locationPoints) {
          if (that.scaleType === 1) {
            that.markerObj1 = {
              position: [that.locationPoints[0].pointX, that.locationPoints[0].pointY],
              markerName: '点位1',
              imgUrl: markerImage1,
              id: '111',
              size: [34, 41],
              markerType: 'camera'
            }
            that.markerObj2 = {
              position: [that.locationPoints[1].pointX, that.locationPoints[1].pointY],
              markerName: '点位2',
              imgUrl: markerImage2,
              id: '222',
              size: [34, 41],
              markerType: 'camera'
            }
            that.markerObj3 = {
              position: [that.locationPoints[2].pointX, that.locationPoints[2].pointY],
              markerName: '点位3',
              imgUrl: markerImage3,
              id: '333',
              size: [34, 41],
              markerType: 'camera'
            }
            that.mapObj.addMarker(that.markerObj1)
            that.mapObj.addMarker(that.markerObj2)
            that.mapObj.addMarker(that.markerObj3)
          }
        }
        // 注册地图单击事件
        that.mapObj.regEventListener('singleclick', callback)
        // 通过updateSize()方法 页面重绘
        setTimeout(function () {
          that.mapObj.getMap().updateSize()
        }, 100)
      } catch (err) {
        console.log(LOG_TAG + ' image.onload图片加载事件err')
        console.log(err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
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
  width: 280px;
}

.location-info {
  .edit-content {
    display: flex;
    .form-area {
      padding-top: 20px;
      height: 100%;
      flex: 0 0 340px;
      overflow: auto;
      order: -1;
      .info-item {
        line-height: 30px;
        margin-bottom: 12px;
        font-size: 14px;
        color: #606266;
        .color-style {
          color: red;
        }
      }
      .form-calculate-coordinate {
        width: 340px;
        .position-btn {
          float: left;
          width: 20px;
          .pick-ico {
            font-size: 20px;
            color: #e6a23c;
            cursor: pointer;
            &:hover {
              color: darken(#e6a23c, 10%);
            }
          }
        }
        .input-small {
          float: left;
          width: 110px;
          margin: 0 7px 10px 0;
          padding: 0;
        }
        .input-smaller {
          width: 100px;
          margin-bottom: 10px;
          &.left-child {
            margin: 0 7px 0 0;
          }
          &.right-child {
            margin: 0 0 0 7px;
          }
        }
      }
      .form-calculate-length {
        .input-small {
          width: 110px;
          margin-bottom: 10px;
          &.left-child {
            margin: 0 7px 0 0;
          }
          &.right-child {
            margin: 0 0 0 7px;
          }
        }
        .input-smaller {
          width: 100px;
          margin-bottom: 10px;
          &.left-child {
            margin: 0 7px 0 0;
          }
          &.right-child {
            margin: 0 0 0 7px;
          }
        }
      }
    }
    .map-area {
      flex: 1;
      box-sizing: border-box;
      padding: 20px;
      height: 600px;
      #mapSceneDiv {
        width: 100%;
        height: 100%;
        background: #ccc;
      }
    }
  }
}
</style>
