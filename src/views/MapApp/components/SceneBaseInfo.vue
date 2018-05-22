<template>
  <div class="base-info">
    <div class="row-flow base-info-content">
      <el-form label-width="80px" ref="form" :model="form" :rules="rules">
        <el-row class="base-content">
          <el-col :span="12">
            <div class="form-content">
              <!--场景名称模块-->
              <el-form-item label="场景名称" label-width="110px" class="common-input form-item" prop='sceneName'>
                <div class="block">
                  <el-input placeholder="请输入场景名称" class="el-input" v-model="form.sceneName" :maxlength="30"></el-input>
                </div>
              </el-form-item>
              <!--场景类型模块-->
              <el-form-item required label="场景类型" label-width="110px" class='common-input form-item'>
                <el-select class='small-input' v-model="form.sceneType" :disabled="isAdd===false" @change="sceneTypeChange(form.sceneType)">
                  <el-option :label="item.itemName" :value="item.itemCode" v-for="item in selectList" :key="item.itemCode">{{item.itemName}}</el-option>
                </el-select>
              </el-form-item>
              <!--组织树模块-->
              <el-popover ref="orgPopover" placement="top-end" label-width="110px" width="174" v-model="isShowPopover">
                <OrgTreeView ref="orgTree" @node-click="onHandleNodeClick"></OrgTreeView>
              </el-popover>
              <el-form-item label="所属组织" label-width="110px" class="common-input form-item" prop='orgName'>
                <el-input v-model="form.orgName" placeholder="请选择组织" clearable readonly v-popover:orgPopover @focus="propOrgDara"></el-input>
              </el-form-item>
              <!--切图的宽-->
              <el-form-item label="切图宽度" label-width="110px" class="common-input form-item" prop='width'>
                <div class="block">
                  <el-input placeholder="" class="el-input" v-model.trim="form.width" :maxlength="10"></el-input>
                </div>
              </el-form-item>
              <!--切图的长-->
              <el-form-item label="切图高度" label-width="110px" class="common-input form-item" prop='height'>
                <div class="block">
                  <el-input placeholder="" class="el-input" v-model.trim="form.height" :maxlength="10"></el-input>
                </div>
              </el-form-item>
              <!--地图路径-->
              <el-form-item label="地图路径" label-width="110px" class="common-input form-item" prop='mapUrl'>
                <div class="block">
                  <el-input placeholder="请输入地图路径" class="el-input el-input-url" v-model.trim="form.mapUrl" :maxlength="255"></el-input>
                </div>
              </el-form-item>
              <!--最小缩放等级-->
              <el-form-item label="最小缩放等级" label-width="110px" class="common-input  form-item" prop='minZoom'>
                <div class="block">
                  <el-input placeholder="" class="el-input" v-model.trim="form.minZoom" :maxlength="2"></el-input>
                </div>
              </el-form-item>
              <!--最大缩放等级-->
              <el-form-item label="最大缩放等级" label-width="110px" class="common-input  form-item" prop='maxZoom'>
                <div class="block">
                  <el-input placeholder="" class="el-input" v-model.trim="form.maxZoom" :maxlength="2"></el-input>
                </div>
              </el-form-item>
              <!--楼栋缩放等级-->
              <el-form-item label-width="110px" required :label="levelName" class="common-input form-item">
                <el-select class='small-input' v-model="form.buildingZoom" @visible-change="zoomNodeClick(zoomSelectState)">
                  <el-option :label="item.label" :value="item.value" v-for="item in zoom" :key="item.value">{{item.label}}</el-option>
                </el-select>
              </el-form-item>
              <!--最大分辨率-->
              <el-form-item label="最大分辨率" label-width="110px" class="common-input  form-item" prop='maxResolution'>
                <div class="block">
                  <el-input placeholder="" class="el-input" v-model.trim="form.maxResolution" :maxlength="13"></el-input>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--按钮区域-->
    <div class="row-flow btn-group">
      <el-button @click="onCanclePage" class="btn-item">取消</el-button>
      <el-button @click="onToNext" class="btn-item" :loading="isLoading">下一步</el-button>
      <el-button v-if="isAdd===false" @click="onJumpPage" class="btn-item">跳过</el-button>
    </div>
  </div>
</template>
<script>
import { addScene, updateScene, getDictionary, getOrgTree } from '@/views/MapApp/apis/index.js'
import AsyncImg from '@/views/MapApp/components/AsyncImg'
import { LOG_TAG } from '@/views/MapApp/assets/js/index.js'
import OrgTreeView from '@/components/TreeView'
export default {
  props: {
    sceneInfo: {
      type: Object
    },
    onCanclePage: {
      type: Function
    }
  },
  components: {
    AsyncImg,
    OrgTreeView
  },
  data () {
    // var isOrgName = (rule, value, callback) => {
    //   console.log(11111)
    //   if (value === '') {
    //     callback(new Error('所属组织不能为空'))
    //   } else {
    //     callback()
    //   }
    // }
    var minZoomCheck = (rule, value, callback) => {
      if (parseInt(value) >= 0 && parseInt(value) <= 10 && (/^[0-9]+[0-9]*]*$/).test(value)) {
        callback()
      } else {
        callback(new Error('最小缩放系数是0~10间的整数！'))
      }
    }
    var maxZoomCheck = (rule, value, callback) => {
      if (parseInt(value) >= 0 && parseInt(value) <= 10 && (/^[0-9]+[0-9]*]*$/).test(value)) {
        callback()
      } else {
        callback(new Error('最大缩放系数是0~10间的整数！'))
      }
    }
    var mapUrlCheck = (rule, value, callback) => {
      console.log(11111)
      if (!(value.match(/^(https|http)?:.*\/$/))) {
        callback(new Error('切图路径输入错误，请重新输入'))
      } else {
        callback()
      }
    }
    return {
      isLoading: false,
      // 是否是添加模式 ture-添加 false-编辑
      isAdd: false,
      // 节点是否存在
      is_orgDeleted: false,
      // 区分楼栋还是车场缩放等级
      levelName: '楼栋缩放等级',
      // oldUrl 保存url用于比较mapUrl
      oldUrl: '',
      // zoom select 组件显示或者隐藏的状态
      zoomSelectState: true,
      // 场景类型下拉框
      selectList: [],
      // 楼栋缩放系数
      zoom: [],
      // 组织树数组
      treeDatas: {
        tData: []
      },
      // 组织类型
      orgType: '',
      // 查询时展开的组织树
      exportOrgNode: {},
      // 是否显示组织树弹框
      isShowPopover: false,
      // 组织树模糊查询字段(本地)
      filterText: '',
      // 组织树参数
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 场景基本信息默认参数
      defaultSceneBase: {
        id: '',
        orgCode: '',
        orgName: '',
        sceneName: '',
        sceneType: null,
        mapUrl: '',
        height: null,
        width: null,
        minZoom: null,
        maxZoom: null,
        buildingZoom: null,
        maxResolution: null
      },
      // 场景基本信息对象
      form: {
        id: '',
        orgCode: '',
        orgName: '',
        sceneName: '',
        sceneType: null,
        mapUrl: '',
        height: null,
        width: null,
        minZoom: null,
        maxZoom: null,
        buildingZoom: null,
        maxResolution: null
      },
      // 校验规则
      rules: {
        sceneName: [
          { required: true, message: '请输入场景名称', trigger: 'blur' }
        ],
        orgName: [
          {required: true, message: '请选择组织', trigger: 'blur'}
        ],
        mapUrl: [
          {
            required: true, message: '请输入地图路径', trigger: 'blur'
          },
          {
            validator: mapUrlCheck, trigger: 'blur'
          }
        ],
        width: [
          {
            required: true, message: '请输入切图的宽', trigger: 'blur'
          }
        ],
        height: [
          {
            required: true, message: '请输入切图的高', trigger: 'blur'
          }
        ],
        minZoom: [
          {
            required: true, message: '请输入切图最小缩放等级', trigger: 'blur'
          },
          {
            validator: minZoomCheck, trigger: 'blur'
          }
        ],
        maxZoom: [
          {
            required: true, message: '请输入切图最大缩放等级', trigger: 'blur'
          },
          {
            validator: maxZoomCheck, trigger: 'blur'
          }
        ],
        maxResolution: [
          {
            required: true, message: '请输入切图最大分辨率', trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted: function () {
    let that = this
    getOrgTree().then(res => {
      that.treeDatas.tData.push(res.data.data)
    }).catch(err => {
      console.warn(LOG_TAG + 'getOrgTree接口调用err')
      console.warn(err)
    })
    getDictionary().then((res) => {
      let dictionary = res.data.data
      let sceneTypes = dictionary.dictCodeType.sceneType
      var len = sceneTypes.length
      for (var i = 0; i < len; i++) {
        sceneTypes[i].itemCode = parseInt(sceneTypes[i].itemCode)
      }
      this.selectList = sceneTypes
    }).catch(err => {
      console.warn(LOG_TAG + 'getDictionary接口调用err')
      console.warn(err)
    })
  },
  methods: {
    /**
     * @description 重置参数
     */
    resetForm () {
      this.form.mapUrl = ''
      this.$refs['form'].resetFields()
      this.form = Object.assign({}, this.defaultSceneBase)
    },
    /**
     * @description 新增场景时入口
     */
    addSceneBase: function () {
      this.resetForm()
      this.isAdd = true
    },
    /**
 * @description 场景类型的值change时判断
 */
    sceneTypeChange: function (value) {
      if (Number(value) === 1) {
        this.levelName = '楼栋缩放等级'
      } else {
        this.levelName = '车场缩放等级'
      }
    },
    /**
   *@description 初始化场景基本信息配置页
   *@param {obj} sceneInfo 场景信息
   */
    editSceneInfo: function (sceneInfo) {
      this.zoom = []
      console.log(LOG_TAG + 'editSceneInfo begin')
      this.resetForm()
      this.isAdd = false
      this.form.sceneId = sceneInfo.id
      this.form.orgName = sceneInfo.orgName
      this.form.orgCode = sceneInfo.orgCode
      this.orgType = ''
      this.oldUrl = sceneInfo.url
      this.form.sceneType = sceneInfo.sceneType
      if (parseInt(this.form.sceneType) === 1) {
        this.levelName = '楼栋缩放等级'
      } else {
        this.levelName = '车场缩放等级'
      }
      this.form.sceneName = sceneInfo.sceneName
      this.form.mapUrl = sceneInfo.url
      this.form.width = sceneInfo.width
      this.form.height = sceneInfo.height
      this.form.minZoom = sceneInfo.minZoom
      this.form.maxZoom = sceneInfo.maxZoom
      this.form.buildingZoom = sceneInfo.buildingZoom
      this.form.maxResolution = sceneInfo.maxResolution
      for (var i = Number(this.form.minZoom); i < Number(this.form.maxZoom) + 1; i++) {
        this.zoom.push({ value: i, label: i })
      }
      this.is_orgDeleted = this.$refs['tree'].getNode({ uuid: sceneInfo.orgCode })
      if (!this.is_orgDeleted) {
        this.$message({
          message: '该组织不存在，请重新选择，点击下一步以保存！',
          type: 'warning'
        })
      } else {
        if (sceneInfo.orgName !== this.is_orgDeleted.data.name) {
          this.orgName = this.is_orgDeleted.data.name
          this.form.orgName = this.is_orgDeleted.data.name
          this.$message({
            message: '提示：该组织名称已经由 ' + sceneInfo.orgName + ' 变更为 ' + this.is_orgDeleted.data.name,
            type: 'warning'
          })
        }
      }
    },
    /**
  *@description 组织查询
  *@param {obj} data 组织数据
  */
    onHandleNodeClick (data) {
      this.orgType = data.orgType
      this.form.orgName = data.name
      this.form.orgCode = data.uuid
      this.isShowPopover = false
      this.filterText = ''
    },
    /**
  *@description 输入框focus时，进行传值
  */
    propOrgDara () {
      console.log('父组件propOrgDara')
      this.$refs['orgTree'].treeDatas = this.treeDatas
    },
    /**
     * @description 组织树模糊查询方法(api自带)
     */
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    /**
 * @description 缩放等级选择框点击事件
 */
    zoomNodeClick (value) {
      this.zoom = []
      if (value === true) {
        if (!(/^[0-9]+[0-9]*]*$/).test(this.form.minZoom) || !(/^[0-9]+[0-9]*]*$/).test(this.form.maxZoom)) {
          this.$message({
            message: '请先输入最大和最小缩放系数',
            type: 'warning'
          })
          this.form.buildingZoom = null
        } else {
          for (var i = Number(this.form.minZoom); i < Number(this.form.maxZoom) + 1; i++) {
            this.zoom.push({ value: i, label: i })
          }
        }
        this.zoomSelectState = false
      } else {
        this.zoomSelectState = true
      }
    },
    /**
     * @augments 场景基本信息提交时，进行数据校验和业务规则检查
     * */
    checkBeforeCommit: function () {
      // 场景名称、场景类型、组织名非空
      if (!this.form.sceneName.trim()) {
        this.$message({
          message: '场景名称不能全为空格',
          type: 'warning'
        })
        return false
      } else if ((!this.form.sceneType) || (!this.form.orgCode) || (!this.form.mapUrl) || (!this.form.height) || (!this.form.width) || (!this.form.minZoom && this.form.minZoom !== 0) || (!this.form.maxZoom) || (!this.form.orgName) || (!this.form.maxResolution)) {
        this.$message({
          message: '请将信息填写完整！',
          type: 'warning'
        })
        return false
      }
      // 判断组织和车场类型的关系
      if (this.form.sceneType === 2) {
        if ((this.orgType) || (this.orgType !== '')) {
          if ((Number(this.orgType) !== 8) && (Number(this.orgType) !== 9) && (Number(this.orgType) !== 10)) {
            this.$message({
              message: '请检查组织类型与车场类型是否一致！',
              type: 'warning'
            })
            return false
          }
        }
      }
      // 提交时验证切图地址
      if (!((this.form.mapUrl).match(/^(https|http)?:.*\/$/))) {
        this.$message({
          message: '请检查地图路径是否配置正确！',
          type: 'warning'
        })
        return false
      }
      // 最小等级数小于最大等级数
      if (this.form.maxZoom <= this.form.minZoom) {
        this.$message({
          message: '最小缩放等级要小于最大缩放等级，请检查数据',
          type: 'warning'
        })
        return false
      }
      // 当场景类型为小区全图时，building_room 必填
      if (Number(this.form.sceneType) === 1) {
        if (!this.form.buildingZoom) {
          this.$message({
            message: '小区缩放等级未填写',
            type: 'warning'
          })
          return false
        }
      }
      return true
    },
    /**
     * @augments updateScene() 场景更新
     */
    updateScene: function () {
      updateScene(this.form).then(res => {
        if (res.data.code === '00001') {
          this.$message({
            message: '小区全图已存在',
            type: 'warning'
          })
          this.isLoading = false
        } else if (res.data.code === '00002') {
          this.$message({
            message: '该组织已与其他场景关联，请检查',
            type: 'warning'
          })
          this.isLoading = false
        } else {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.toLocation(this.form.sceneId)
          this.isLoading = false
        }
      }).catch(err => {
        console.warn(LOG_TAG + 'updateScene接口调用err')
        this.isLoading = false
        console.warn(err)
      })
    },
    /**
  *@description 基本信息提交，跳转到下一页
  */
    onToNext: function () {
      // 场景基本信息提交时数据验证和业务规则检查
      if (!this.checkBeforeCommit()) {
        return
      }
      // addScene模块
      if (this.isAdd === true) {
        this.isLoading = true
        this.form.sceneName = this.form.sceneName.trim()
        this.form.height = parseInt(this.form.height)
        this.form.width = parseInt(this.form.width)
        this.form.minZoom = parseInt(this.form.minZoom)
        this.form.maxZoom = parseInt(this.form.maxZoom)
        this.form.maxResolution = parseInt(this.form.maxResolution)
        addScene(this.form).then(res => {
          if (res.data.code === '00001') {
            this.$message({
              message: '小区全图已存在',
              type: 'warning'
            })
            this.isLoading = false
          } else if (res.data.code === '00002') {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
            this.isLoading = false
          } else {
            this.toLocation(res.data.data.sceneId)
            this.isLoading = false
          }
        }).catch(err => {
          this.isLoading = false
          console.warn(err)
        })
      } else {
        this.isLoading = true
        this.form.sceneName = this.form.sceneName.trim()
        this.form.height = parseInt(this.form.height)
        this.form.width = parseInt(this.form.width)
        if (this.oldUrl !== this.form.mapUrl) {
          this.$confirm('变更地图地址会删除原有的点位、区域等信息,仍要修改吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: true
          }).then(
            () => {
              this.updateScene()
            }
            ).catch(
            () => {
              this.$message({
                message: '已经取消提交',
                type: 'warning'
              })
              this.isLoading = false
            }
            )
        } else {
          this.updateScene()
        }
      }
    },
    /**
   *@前往场景定位信息设置见面
   */
    toLocation (sceneId) {
      this.$parent.getSceneInfoForEdit(sceneId, 'location')
    },
    /**
    *@description 跳过
    */
    onJumpPage: function () {
      this.$parent.enterLocationInfo(this.sceneInfo)
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
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
  width: 310px;
}

.filter-tree {
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: 300px;
}

/* 场景基本信息 */
.base-info {
  text-align: center;
  .form-content {
    padding: 60px 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 1380px;
    justify-items: center;
    align-items: center;
    align-content: space-around;
    .form-item {
      margin: 30px 0;
      margin-right: 40px;
    }
  }
  .el-input-url {
    width: 440px;
  }
  .base-info-content {
    height: 648px;
    .base-content {
      padding-left: 20%;
    }
  }
}
</style>
