<template>
  <div class="map-app">
    <div v-show="status=='0'" class="page-content">
      <div class="row-flow normal-flex-item">
        <el-form ref="param" v-model="param" label-width="80px" class="search-form">
          <!--场景类型模块-->
          <el-form-item label="场景类型" class='common-input form-item'>
            <el-select v-model="param.sceneType" class='small-input'>
              <el-option :label="item.itemName" :value="item.itemCode" v-for="item in selectList" :key="item.itemCode">{{item.itemName}}</el-option>
            </el-select>
          </el-form-item>
          <!--组织树模块-->
          <el-popover ref="orgPopover" placement="top-end" width="174" v-model="isShowPopover">
            <OrgTreeView ref="orgTree" @node-click="onHandleNodeClick"></OrgTreeView>
          </el-popover>
          <el-form-item label="所属组织" label-width="80px" class="common-input">
            <el-input v-model="OrgName" placeholder="请选择组织" readonly v-popover:orgPopover @focus="propOrgDara"></el-input>
          </el-form-item>
          <!--场景名称模块-->
          <el-form-item label="场景名称" label-width="80px" class="common-input">
            <el-input v-model.trim="param.sceneName" placeholder="请输入场景名称" @keyup.enter.native="onGetPageData()"></el-input>
          </el-form-item>
          <!--查询重置按钮组-->
          <div class="search-toolbar">
            <el-button type="primary" @click="onGetPageData" class="search-btn" :loading="isLoading">查询</el-button>
            <el-button type="primary" @click="onResetParam" class="search-btn">重置</el-button>
          </div>
        </el-form>
      </div>
      <div class="row-flow operation-bar normal-flex-item">
        <el-button type="primary" @click="onAddScene" class="operation-btn">
          <i class="el-icon-plus"></i>&nbsp;添加</el-button>
        <el-button type="danger" @click="onDeleteScenes" class="operation-btn">
          <i class="el-icon-close"></i>&nbsp;删除</el-button>
      </div>
      <!--tablelist场景信息-->
      <div class="row-flow clearfix fit-flex-item table-list">
        <el-table :data="tableData" class="row-flow" ref="multipleTable" @selection-change="handleSelectionChange" height="100%" stripe>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="sceneName" label="场景名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sceneType" label="场景类型" :formatter="filterSceneType"></el-table-column>
          <el-table-column prop="orgName" label="所属组织" show-overflow-tooltip></el-table-column>
          <el-table-column prop="width" label="切片地图宽度"></el-table-column>
          <el-table-column prop="height" label="切片地图高度"></el-table-column>
          <el-table-column prop="scaleType" label="比例尺计算方式"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="onSceneDetail(scope.row)" type="text" size="small">查看</el-button>
              <el-button @click="onItemEdit(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="onItemDelete(scope.row)" type="text" size="small">删除</el-button>
              <el-button @click="onEnterArea(scope.row)" type="text" size="small" v-if="scope.row.sceneType===1 ||scope.row.sceneType===2">区域管理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--子组件SceneDetail-->
      <scene-detail ref="sceneDetail" :sceneId="id" @change="changeHandler"></scene-detail>
      <div class="row-flow pagination-bar normal-flex-item">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!--子组件SceneInfo-->
    <div v-show="status==='1'">
      <scene-info ref="SceneInfo"></scene-info>
    </div>
    <!--子组件AreaManager-->
    <div v-if="status===3">
      <area-manager ref="AreaManager" :areaSceneInfo='areSceneInfo'></area-manager>
    </div>
  </div>
</template>

<script>
import { getSceneList, getScenePageList, getOrgTree, getSceneInfo, deleteScene, getDictionary } from '@/views/MapApp/apis/index.js'
import SceneInfo from '@/views/MapApp/components/SceneInfo'
import SceneDetail from '@/views/MapApp/components/SceneDetail'
import AreaManager from '@/views/MapApp/components/AreaManager'
import OrgTreeView from '@/components/TreeView'
import { LOG_TAG } from '@/views/MapApp/assets/js/index.js'
export default {
  components: {
    SceneInfo,
    SceneDetail,
    AreaManager,
    OrgTreeView
  },
  data () {
    return {
      isLoading: false,
      selectList: [],
      areSceneInfo: {},
      OrgName: '',
      exportOrgNode: {},
      filterText: '',
      status: '0',
      isShowNext: true,
      isShowPopover: false,
      id: '',
      param: {
        sceneName: '',
        sceneType: '',
        orgId: ''
      },
      defaultParam: {
        sceneName: '',
        sceneType: '',
        orgId: ''
      },
      tableData: [
      ],
      pageSize: 10,
      pageNum: 1,
      currentPage: 1,
      total: 0,
      treeDatas: {
        tData: []
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      multipleSelection: [],
      pageData: [
        {
          id: '123',
          sceneName: '测试数据-停车场',
          url: '/map/scenemap/02/park01.jpg',
          centerLon: '110.121332',
          centerLat: '45.123343',
          scale: '20000',
          height: '1200',
          width: '800',
          orgId: '0010102401',
          sceneType: '02'
        },
        {
          id: '124',
          sceneName: '测试数据一楼大厅',
          url: '/map/scenemap/02/park01.jpg',
          centerLon: '90.121332',
          centerLat: '145.123343',
          scale: '2000',
          height: '1200',
          width: '800',
          orgId: '0010102405',
          sceneType: '01'
        }
      ]
    }
  },
  mounted: function () {
    this.params = this.param
    this.onGetPageData()
    /**
   *@description 组织查询
   */
    getOrgTree().then(res => {
      this.exportOrgNode.rootUuid = res.data.data.uuid
      this.treeDatas.tData.splice(0, this.treeDatas.tData.length)
      this.treeDatas.tData.push(res.data.data)
      this.loading = false
    }).catch(err => {
      console.warn(LOG_TAG + 'getOrgTree接口调用err')
      console.warn(err)
    })
    /**
   *@description 查询数据字典
   */
    getDictionary().then((res) => {
      let dictionary = res.data.data
      let sceneTypes = dictionary.dictCodeType.sceneType
      var len = sceneTypes.length
      for (var i = 0; i < len; i++) {
        sceneTypes[i].itemCode = parseInt(sceneTypes[i].itemCode)
      }
      this.selectList = sceneTypes
    })
  },
  methods: {
    /**
     * @description 每页条数变更
     */
    handleSizeChange (val) {
      this.pageSize = val
      this.onGetPageData()
    },
    changeHandler: function (newVal) {
      this.status = newVal
    },
    /**
    * @description 页码变更
    */
    handleCurrentChange (val) {
      this.currentPage = val
      this.onGetPageData()
    },
    filterSceneType: function (row, column) {
      var sceneType = row.sceneType
      switch (sceneType) {
        case 1:
          return '小区全图'
        case 2:
          return '停车场地图'
      }
    },
    /**
   *@description 刷新数据列表
   */
    onGetPageData: function () {
      this.isLoading = true
      getScenePageList(this.currentPage, this.pageSize, this.param).then((res) => {
        for (let i = 0; i < res.data.data.pageData.length; i++) {
          if (Number(res.data.data.pageData[i].scaleType) === 1) {
            res.data.data.pageData[i].scaleType = '三点定位'
          } else {
            res.data.data.pageData[i].scaleType = ''
          }
        }
        this.tableData = res.data.data.pageData
        this.total = res.data.data.total
        this.isLoading = false
      }).catch(err => {
        console.log(LOG_TAG + 'getScenePageList刷新列表数据err')
        this.isLoading = false
        console.warn(err)
      })
    },
    /**
   *@description 场景类型切换
   */
    SceneTypeChange: function () {
      let options = {}
      options.sceneType = this.value
      options.sceneName = this.valueName
      getSceneList(options).then((res) => {
        this.sceneList = res.data.data
      }).catch(err => {
        console.warn(LOG_TAG + 'getSceneList接口调用err')
        console.warn(err)
      })
    },
    /**
   *@description 查询条件重置
   */
    onResetParam: function () {
      this.param = Object.assign({}, this.defaultParam)
      this.OrgName = ''
      this.pageSize = 10
      this.currentPage = 1
      this.onGetPageData()
    },
    /**
   *@description 树形节点点击事件
   */
    onHandleNodeClick (data) {
      this.OrgName = data.name
      this.param.orgId = data.uuid
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
   *@description 查看场景详情
   *@param {obj} row 场景信息
   */
    onSceneDetail: function (row) {
      let that = this
      getSceneInfo({ sceneId: row.id }).then(res => {
        console.log('res: ')
        console.log(res)
        that.$refs['sceneDetail'].sceneDetailTmp = res.data.data
        that.$refs['sceneDetail'].dialogFormVisible = true
        that.$refs['sceneDetail'].mapUrl = res.data.data.url
        let sceneType = that.$refs['sceneDetail'].sceneDetailTmp.sceneType
        switch (sceneType) {
          case 1:
            that.$refs['sceneDetail'].sceneDetailTmp.sceneType = '小区全图'
            break
          case 2:
            that.$refs['sceneDetail'].sceneDetailTmp.sceneType = '停车场地图'
            break
        }
        if (that.$refs['sceneDetail'].sceneDetailTmp.locationPoints && that.$refs['sceneDetail'].sceneDetailTmp.locationPoints.length === 0) {
          that.$refs['sceneDetail'].sceneDetailTmp.locationPoints = null
        }
        that.$refs['sceneDetail'].mapObj.getMap().setTarget(null)
        that.$refs['sceneDetail'].mapObj.destroy()
      }).catch(err => {
        console.warn(LOG_TAG + 'getSceneInfo查看详情接口调用err')
        console.warn(err)
      })
    },
    /**
    *@description 场景新增
    */
    onAddScene: function () {
      this.status = '1'
      this.$refs['SceneInfo'].addSceneInfo()
    },
    /**
    *@description 场景编辑
    *@param {obj} row 场景信息
    */
    onItemEdit: function (row) {
      // 调用get接口,点位页面初始化
      getSceneInfo({ sceneId: row.id }).then(res => {
        this.status = '1'
        this.$refs['SceneInfo'].editSceneInfo(res.data.data)
      }).catch(err => {
        console.warn(LOG_TAG + 'getSceneInfo接口调用err')
        console.warn(err)
      })
    },
    /**
    *@description 场景项删除
    *@param {obj} row 场景信息
    */
    onItemDelete: function (row) {
      let deleteScenes = {}
      deleteScenes.sceneIds = []
      this.$confirm('确定要刪除场景 ' + row.sceneName + ' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        // 在此处调用批量删除的接口
        let deleteScenes = {}
        deleteScenes.sceneIds = []
        deleteScenes.sceneIds.push(row.id)
        deleteScene(deleteScenes).then(res => {
          this.onGetPageData()
          if (res.data.code === '00000') {
            this.$message({
              message: '刪除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '网络异常',
              type: 'warn'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
    *@description 区域新增
    *@param {obj} row 场景信息
    */
    onEnterArea: function (row) {
      var sid = row.id
      var data = { 'sceneId': sid }
      getSceneInfo(data).then(res => {
        this.areSceneInfo = res.data.data
        this.status = 3
      }).catch(err => {
        console.warn(LOG_TAG + 'getSceneInfo接口调用err')
        console.warn(err)
      })
    },
    /**
    *@description table选择事件
    */
    handleSelectionChange: function (val) {
      this.multipleSelection = val
    },
    /**
    *@description 下一步
    */
    next: function () {
      this.status = 2
    },
    /**
    *@description 批量删除
    */
    onDeleteScenes: function () {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          message: '请至少选择一项！',
          type: 'warning'
        })
        return
      }
      let str = ''
      let deleteScenes = {}
      deleteScenes.sceneIds = []
      for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
        if (this.multipleSelection[i].sceneName && i < this.multipleSelection.length) {
          str += this.multipleSelection[i].sceneName
          if (i < this.multipleSelection.length - 1) {
            str += ', '
          }
          deleteScenes.sceneIds.push(this.multipleSelection[i].id)
        }
      }
      str = this.multipleSelection.length > 3 ? (str + '等') : str
      this.$confirm('确定要刪除 ' + str + ' 共 ' + this.multipleSelection.length + ' 个场景吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        // 在此处调用批量删除的接口
        deleteScene(deleteScenes).then(res => {
          if (res.data.code === '00000') {
            this.$message({
              message: '刪除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '网络异常，请重试',
              type: 'warn'
            })
          }
          this.onGetPageData()
          if (res.data.code === '00000') {
            this.$message({
              message: '刪除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '网络异常',
              type: 'warn'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
        )
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
      console.log('scenManager 中el-input的v-model的值')
    }
  }
}
</script>
<style lang="less" scoped>
/* 公共样式start */
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
.map-app {
  box-sizing: border-box;
  position: absolute;
  top: 90px;
  bottom: 20px;
  left: 225px;
  right: 20px;
  /deep/.cell {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .page-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    .normal-flex-item {
      flex: 0 0 auto;
    }
    .fit-flex-item {
      flex: 1;
    }
  }
  .table-list {
    display: flex;
  }
}
.filter-tree {
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: 300px;
}
/* 公共样式end */
.pagination-bar {
  padding: 20px 0;
  text-align: center;
}
.search-form {
  overflow: hidden;
  padding: 10px 0;
  .common-input {
    margin-right: 10px;
    .pull-left;
  }
}
.operation-bar {
  width: 100%;
  height: 40px;
  .operation-btn {
    height: 30px;
    padding: 7px 15px;
    .pull-left;
  }
}
.search-toolbar {
  width: 200px;
  .pull-right;
  .search-btn {
    width: 84px;
    margin-left: 12px;
    .pull-left;
  }
}
</style>
