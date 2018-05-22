<template>
  <div>
    <el-dialog title="区域信息" :visible.sync="dialogFormVisible" width="536px" height="440px" :close-on-click-modal="false">
      <el-form>
        <el-form-item required label="区域名称" label-width="80px" class="common-input">
          <el-input placeholder="请输入区域名称" v-model="addoptions.areaName"></el-input>
        </el-form-item>
        <el-form-item required label="区域类型" label-width="80px" class="common-input">
          <el-select v-model="currentAreaType" class="small-input" disabled="">
            <el-option :label="item.itemName" :value="item.itemCode" v-for="item in selectList" :key="item.itemCode">{{item.itemName}}</el-option>
          </el-select>
        </el-form-item>
        <!--组织树模块-->
        <el-popover ref="orgPopover" placement="bottom" width="174" v-model="isShowPopover">
          <OrgTreeView ref="orgTree" @node-click="onHandleNodeClick"></OrgTreeView>
        </el-popover>
        <el-form-item required label="所属组织" label-width="80px" class="common-input">
          <el-input v-model="addoptions.orgName" placeholder="请选择组织" readonly v-popover:orgPopover @focus="propOrgDara"></el-input>
        </el-form-item>
        <div class="btn-group">
          <el-button type="success" plain @click="onSavePage" :loading="isLoading">保存</el-button>
          <el-button type="info" plain @click="onCancle">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  addArea,
  updateArea,
  getAreaList,
  getDictionary,
  getOrgTree
} from '@/views/MapApp/apis/index.js'
// 数据格式化
import { formatArea } from '@/views/MapApp/assets/js/utils.js'
// 日志
import { LOG_TAG } from '@/views/MapApp/assets/js/index.js'
import OrgTreeView from '@/components/TreeView'
export default {
  components: {
    OrgTreeView
  },
  data () {
    return {
      isLoading: false,
      selectList: [],
      currentAreaType: '',
      curLinkedScene: '',
      curParentArea: '',
      dialogFormVisible: false,
      sceneType: '',
      areSceneId: '',
      points: [],
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
      addoptions: {
        sceneId: '',
        areaName: '',
        orgName: '',
        orgCode: '',
        areaType: '',
        borderPoints: [
          {
            gpsLongitude: 0.0,
            gpsLatitude: 0.0,
            pointX: 100,
            pointY: 200,
            pointType: 1
          },
          // 区域边界点位列表
          {
            gpsLongitude: 0.0,
            gpsLatitude: 0.0,
            pointX: 100,
            pointY: 200,
            pointType: 1
          }
        ]
      }
    }
  },
  mounted: function () {
    // 获取字典表
    getDictionary().then((res) => {
      let dictionary = res.data.data
      let areaTypes = dictionary.dictCodeType.areaType
      var len = areaTypes.length
      for (var i = 0; i < len; i++) {
        areaTypes[i].itemCode = parseInt(areaTypes[i].itemCode)
      }
      this.selectList = areaTypes
    }).catch(err => {
      console.warn(LOG_TAG + '调用字典表接口失败')
      console.warn(err)
    })
    getOrgTree().then(res => {
      this.exportOrgNode.rootUuid = res.data.data.uuid
      this.treeDatas.tData.splice(0, this.treeDatas.tData.length)
      this.treeDatas.tData.push(res.data.data)
    }).catch(err => {
      console.warn(LOG_TAG + 'getOrgTree接口调用err')
      console.warn(err)
    })
  },
  methods: {
    /**
*@description 组织查询
*@param {obj} data 组织数据
*/
    onHandleNodeClick (data) {
      this.orgType = data.orgType
      this.addoptions.orgName = data.name
      this.addoptions.orgCode = data.uuid
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
     * @description 取消
     */
    onCancle: function () {
      this.sceneType = ''
      this.dialogFormVisible = false
    },
    /**
     * @description 保存
     */
    onSavePage: function () {
      this.addoptions.areaType = this.currentAreaType
      if (!this.addoptions.areaName.trim() || !this.addoptions.orgCode) {
        this.$message({
          message: '请将区域信息填写完整！',
          type: 'warning'
        })
        return
      }
      if (this.addoptions.areaType === 2) {
        if ((this.orgType) || (this.orgType !== '')) {
          if (Number(this.orgType) !== 3) {
            this.$message({
              message: '请检查组织与楼栋区域类型是否一致！',
              type: 'warning'
            })
            return
          }
        }
      } else {
        if ((this.orgType) && (this.orgType !== '')) {
          if ((Number(this.orgType) !== 8) && (Number(this.orgType) !== 9) && (Number(this.orgType) !== 10)) {
            this.$message({
              message: '请检查组织与车场类型是否一致！',
              type: 'warning'
            })
            return
          }
        }
      }
      if (this.$parent.addOrEdit === 0) {
        // 调用接口 addArea
        var adds = this.addoptions
        adds.areaName = adds.areaName.trim()
        delete adds['id']
        this.isLoading = true
        addArea(adds).then(res => {
          if (res.data.code === '00001') {
            this.$message({
              message: '当前场景已有区域绑定该组织，请重新选择',
              type: 'warning'
            })
            this.isLoading = false
          } else if (res.data.code === '00000') {
            var data = { sceneId: this.addoptions.sceneId }
            var _this = this
            getAreaList(data).then(res => {
              if (res.data.code === '00000') {
                let alist = formatArea(res.data.data)
                let areaList = []
                for (let i = 0; i < alist.length; i++) {
                  if (parseInt(alist[i].areaType) === 2 || parseInt(alist[i].areaType) === 3) {
                    areaList.push(alist[i])
                  }
                }
                _this.$parent.areaList = areaList
                _this.dialogFormVisible = false
                _this.isLoading = false
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              } else {
                this.isLoading = false
              }
            }).catch(err => {
              console.warn(LOG_TAG + '调用getAreaList失败')
              console.warn(err)
            })
          }
        }).catch(err => {
          this.isLoading = false
          console.warn(err)
          console.log(LOG_TAG + '添加区域失败')
          this.$message({
            message: '数据添加失败',
            type: 'warning'
          })
        })
      } else {
        // 调用接口 updateArea
        this.isLoading = true
        this.addoptions.areaName = this.addoptions.areaName.trim()
        updateArea(this.addoptions).then(res => {
          if (res.data.code === '00001') {
            this.$message({
              message: '当前场景已有区域绑定该组织，请重新选择',
              type: 'warning'
            })
            this.isLoading = false
          } else if (res.status === 200) {
            var data = { sceneId: this.addoptions.sceneId }
            var _this = this
            getAreaList(data).then(res => {
              if (res.data.code === '00000') {
                let alist = formatArea(res.data.data)
                let areaList = []
                for (let i = 0; i < alist.length; i++) {
                  if (parseInt(alist[i].areaType) === 2 || parseInt(alist[i].areaType) === 3) {
                    areaList.push(alist[i])
                  }
                }
                _this.$parent.areaList = areaList
                _this.dialogFormVisible = false
                this.isLoading = false
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                this.isLoading = false
              }
            }).catch(err => {
              this.isLoading = false
              console.warn(LOG_TAG + '调用getAreaList失败')
              console.warn(err)
            })
          }
        }).catch(err => {
          this.isLoading = false
          console.warn(err)
          console.log(LOG_TAG + '数据修改失败')
          this.$message({
            message: '数据修改失败',
            type: 'warning'
          })
        })
      }
    },
    /**
     * @description 页面初始化
     */
    initParamEdit: function () {
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

.el-dialog {
  min-width: 536px !important;
}
.btn-group {
  margin-left: 60%;
  bottom: 10px;
  line-height: 30px;
  padding: 0 24px 0 0;
  width: 50%;
  button {
    width: 84px;
  }
}
.small-input {
  width: 200px;
}
.form-item {
  margin-left: 8px;
}
</style>
