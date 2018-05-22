<template>
  <div class="redline-app">
    <div class="controlCon">
      <el-row :gutter="20">
        <el-col :span="18">
          <el-switch v-model="flag" :warning="closeFlag" active-value="1" inactive-value="0" @change="changeDrawShape" active-text="开启画图工具" inactive-text="关闭画图工具"></el-switch>
          <el-button type="primary" @click="editAreaShape" :disabled="isShowEdit">编辑指定边界线</el-button>
          <el-button type="primary" @click="saveAreaShape" :disabled="isShowSave">保存边界配置线</el-button>
          <el-button type="danger" @click="deleteAreaShape" :disabled="isCanDelete">删除边界配置线</el-button>
        </el-col>
      </el-row>
      <transition name="el-zoom-in-top">
        <el-alert title="双击鼠标左键完成区域绘制" type="success" :closable="false"></el-alert>
      </transition>
    </div>
    <el-container class="map">
      <div id="bitmap" class="bitmap">
        <div id="popup" class="ol-popup">
          <a href="#" id="popup-closer" class="ol-popup-closer"></a>
          <div id="popup-content"></div>
        </div>
        <h3 v-if="isLoadingMap" class="initMapFail">地图加载中，请稍等……</h3>
        <h3 v-if="isInitMapFail" class="initMapFail">地图加载失败……</h3>
      </div>
    </el-container>
  </div>
</template>
<script>
import {
  extendObj,
  sendHttpPoint,
  showLinePoint
} from '@/views/PatrolApp/assets/js/redLine.js'
import {
  getSceneListData,
  postSaveRedPointsData,
  getDeleteRedLineData,
  getRedPointsData
} from '@/views/PatrolApp/apis/redLineApp'

export default {
  data () {
    return {
      sceneList: [],
      sceneValue: '',
      sceneId: '',
      areaId: '',
      flag: false,
      closeFlag: false,
      isShowEdit: true,
      isShowSave: false,
      isCanDelete: false,
      isSaveRedLine: false,
      isLoadingMap: false,
      isInitMapFail: false,
      redLineInfo: {
        id: '',
        name: '',
        areaType: 6,
        borderPoints: []
      },
      borderline: {
        fillColor: 'transparent',
        strokeColor: 'red',
        strokeWidth: 5
      },
      mapObj: null,
      cacheMapList: {}
    }
  },
  mounted () {
    this.isLoadingMap = true
    // 获取地图场景信息列表
    getSceneListData()
      .then(res => {
        if (res.code === '00000') {
          this.isLoadingMap = false
          this.sceneList = res.data
          this.redLineInfo.id = this.sceneValue = res.data[0].options[0].id
          this.redLineInfo.name = res.data[0].options[0].sceneName
          this.createMap(res.data[0].options[0])
        } else {
          this.isLoadingMap = !this.isLoadingMap
          this.isInitMapFail = true
        }
      })
      .catch(err => {
        console.warn(err)
        this.isLoadingMap = false
        this.isInitMapFail = true
      })
  },
  methods: {
    // 创建地图
    createMap (option) {
      this.redLineInfo.id = option.id
      this.redLineInfo.name = option.sceneName
      this.sceneId = option.id
      option.mapUrl = option.url
      option.sizeW = option.width
      option.sizeH = option.height
      option.center = [0, 0]
      option.centerGPS = [option.centerLon, option.centerLat]
      if (this.mapObj) this.mapObj.getMap().setTarget(null)
      // 已经初始化的地图可以直接获取地图对象，进行地图的替换即可
      if (this.cacheMapList[option.id]) {
        this.mapObj = this.cacheMapList[option.id]
        this.mapObj.getMap().setTarget('bitmap')
        return
      }
      // 如果没有初始化过，才需要进行地图的初始化
      let mapOption = extendObj({
        gisEngine: 'tile',
        domId: 'bitmap',
        mapUrl: '',
        sizeW: 1920,
        sizeH: 1080,
        maxZoom: 8,
        minZoom: 1,
        scaleType: 1,
        scale: 2,
        center: [0, 0],
        centerGPS: [113.26, 23.15]
      }, option)
      // eslint-disable-next-line
      this.cacheMapList[option.id] = new hdmap.initMap(mapOption)
      this.mapObj = this.cacheMapList[option.id]
      this.mapObj.getMap().setTarget('bitmap')
      // 获取并显示红线
      getRedPointsData({ sceneId: this.redLineInfo.id, areaType: this.redLineInfo.areaType })
        .then(res => {
          if (res.code === '00000' && res.data.length > 0) {
            this.closeFlag = true
            this.isCanDelete = false
            this.isShowEdit = false
            this.isShowSave = true
            this.areaId = res.data[0].id
            this.redLineInfo.borderPoints[0] = showLinePoint(res.data[0].borderPoints)
            this.mapObj.editDrawShape(this.redLineInfo)
            this.showAreaShape()
          } else {
            this.closeFlag = false
          }
        })
        .catch(res => {
          console.warn(res)
        })
      // // 注册地图上的点击事件
      // this.mapObj.regEventListener('singleclick', e => {
      //   if (e.feature) {
      //     this.selectedMarker.markerId = e.feature.markerId
      //     e.feature ? this.mapObj.popupDefault(e.coordinate, e.feature.name) : this.mapObj.closePopup()
      //   }
      // })
    },
    // 改变画图状态，开启画图工具
    changeDrawShape (params) {
      if (this.closeFlag) {
        this.$message({ message: '请先保存或者删除该路线', type: 'warning' })
        this.flag = 0
        return
      }
      if (params === '1' && !this.closeFlag) { // 开启画图工具
        this.mapObj.openDrawShapeTool('Polygon',
          e => {
            this.redLineInfo.borderPoints = e.feature.getGeometry().getCoordinates()
            this.isSaveRedLine = true
          },
          e => {
            this.redLineInfo.borderPoints = e.features.array_[0].getGeometry().getCoordinates()
            this.isSaveRedLine = true
          }, false)
      } else {
        this.mapObj.closeDrawShapeTool()
      }
    },
    // 画完区域后，调用此方法把刚才画的图在gis层上显示出来
    showAreaShape () {
      this.mapObj.closeDrawShapeTool()
      /** 在gisLayer上显示刚才画的图形 */
      if (this.redLineInfo) this.redLineInfo.borderPoints = this.mapObj.showDrawShape(this.redLineInfo).getGeometry().getCoordinates()
      // 更改区域样式
      this.mapObj.getMap().on('precompose', () => { this.mapObj.updateArea(this.redLineInfo, hdmap.commonConfig.getMouseOverAreaStyle(this.borderline)) })
    },
    // 编辑区域
    editAreaShape () {
      this.flag = 1
      this.closeFlag = true
      this.isShowSave = false
      this.isShowEdit = !this.isShowSave
      if (this.redLineInfo.borderPoints.length === 1) {
        this.mapObj.editDrawShape(this.redLineInfo)
        this.isSaveRedLine = true
      } else {
        if (!this.isInitMapFail) {
          getRedPointsData({ sceneId: this.redLineInfo.id, areaType: this.redLineInfo.areaType })
            .then(res => {
              this.redLineInfo.borderPoints[0] = showLinePoint(res.data[0].borderPoints)
              this.mapObj.editDrawShape(this.redLineInfo)
              this.isSaveRedLine = true
            })
            .catch(res => {
              console.warn(res)
              this.isSaveRedLine = false
            })
        }
      }
      this.flag = 0
    },
    // 保存区域
    saveAreaShape () {
      if (this.isSaveRedLine) {
        this.flag = 0
        this.closeFlag = true
        this.isCanDelete = false
        this.mapObj.removeArea(this.redLineInfo)
        // 更新点位信息，并保存在gis层上显示出来
        this.showAreaShape()
        if (this.areaId) {
          // 发送删除当前红线按钮的请求，成功后发送保存的请求
          getDeleteRedLineData({ areaId: this.areaId })
            .then(res => { if (res.code === '00000' && !res.data) this.areaId = '' })
            .then(() => this.saveRedLine())
            .catch(res => {
              console.warn(res)
              this.$message.error('保存失败，请重试~~~~')
              this.closeFlag = false
            })
        } else {
          this.saveRedLine()
        }
      } else {
        this.$message({ message: '请添加或者删除红线', type: 'warning' })
      }
    },
    // 删除区域
    deleteAreaShape () {
      this.flag = 0
      this.isSaveRedLine = false
      this.mapObj.clearDrawShape()
      this.mapObj.closeDrawShapeTool()
      this.isCanDelete = false
      if (this.closeFlag && this.areaId) {
        this.$confirm('确定要删除红线吗?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
          .then(() => {
            // 发送删除红线的请求
            getDeleteRedLineData({ areaId: this.areaId })
              .then(res => {
                this.areaId = ''
                this.$message({ message: '红线删除成功！', type: 'success' })
                this.mapObj.removeArea(this.redLineInfo)
                this.closeFlag = false
                this.isShowEdit = true
                this.isShowSave = false
                this.isCanDelete = false
                this.isSaveRedLine = false
              })
              .catch(res => {
                console.warn(res)
                this.$message({ message: '红线删除失败！', type: 'warning' })
              })
          })
          .catch(() => {
            this.closeFlag = true
            this.isShowEdit = false
            this.isSaveRedLine = false
            this.$message({ type: 'info', message: '已取消删除' })
          })
      } else {
        this.areaId = ''
      }
    },
    // 保存红线请求方法
    saveRedLine () {
      let redLineInfo = {}
      redLineInfo.areaName = this.redLineInfo.name
      redLineInfo.sceneId = this.redLineInfo.id
      redLineInfo.areaType = this.redLineInfo.areaType
      redLineInfo.borderPoints = this.redLineInfo.borderPoints.shift(1)
      redLineInfo.borderPoints = sendHttpPoint(redLineInfo.borderPoints, this.mapObj, 1)
      // 发送保存红线的请求
      postSaveRedPointsData(redLineInfo)
        .then(res => {
          this.$message({ message: '红线保存成功！', type: 'success' })
          this.isSaveRedLine = !this.isSaveRedLine
          this.redLineInfo.name = redLineInfo.areaName
          this.redLineInfo.id = redLineInfo.sceneId
          this.redLineInfo.areaType = redLineInfo.areaType
          this.redLineInfo.borderPoints = redLineInfo.borderPoints
          this.areaId = res.data
          this.isShowSave = true
          this.isShowEdit = !this.isShowSave
        })
        .catch(res => {
          console.warn(res)
          this.$message.error('保存失败，请重试~~~~')
        })
    }
  }
}
</script>
<style scoped lang='less'>
.redline-app {
  height: 100%;
  width: 100%;

  .controlCon {
    height: 80px;

    .el-row {
      margin-bottom: 0;
    }
  }

  .map {
    box-sizing: border-box;
    width: 1650px;
    height: 780px;
    padding: 10px;
    border: 1px solid #999;
  }

  .bitmap {
    background: #ccc;
    width: 1630px;
    height: 760px;
  }

  .initMapFail {
    color: #fff;
    text-align: center;
    margin: 30px 0;
  }

  .row {
    margin-top: 4px;
  }
}
</style>
