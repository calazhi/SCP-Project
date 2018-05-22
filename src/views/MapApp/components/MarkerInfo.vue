<template>
  <div>
    <el-dialog title="点位信息" :visible.sync="dialogFormVisible" width="450px" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="form">
        <!--点位类型模块-->
        <el-form-item label="点位类型" :label-width="formLabelWidth">
          <el-select v-model="form.markerType" placeholder="请选择点位类型" :disabled="true">
            <el-option v-for="item in markerTypes" :key="item.itemCode" :label="item.itemName" :value="item.itemCode"></el-option>
          </el-select>
        </el-form-item>
        <!--地图等级模块-->
        <el-form-item label="地图等级" :label-width="formLabelWidth">
          <el-select v-model="form.zoomLevel" placeholder="请选择地图等级">
            <el-option v-for="item in zooms" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <div class="switch">
          <el-checkbox v-model="checked" @change="changeInBuilding" :disabled="isFloor">楼栋内设备</el-checkbox>
        </div>
        <!--组织模块-->
        <el-popover ref="orgPopover" placement="bottom" width="174">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
          <el-tree class="filter-tree" :data="OrgTree" :props="defaultProps" :filter-node-method="filterNode" ref="tree" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false"></el-tree>
        </el-popover>
        <el-form-item v-show="checked" label="所属组织" :label-width="formLabelWidth" prop="OrgName">
          <el-input style="width:217px" class="Org" v-model="form.OrgName" placeholder="请选择所属组织" readonly="" v-popover:orgPopover trigger="focus">
          </el-input>
        </el-form-item>
        <el-form-item v-show="checked" label="所在楼层" :label-width="formLabelWidth">
          <el-select v-model="form.floorType" placeholder="请选择所在楼层">
            <el-option v-for="item in floorTypes" :key="item.itemCode" :label="item.itemName" :value="item.itemCode"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!--按钮模块-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrgTree, addMarkerList, getAreaList } from '@/views/MapApp/apis/index.js'
export default {
  data () {
    // 验证是否选择的是楼栋
    var isHouseNode = (rule, value, callback) => {
      if (this.OrgType === '3') {
        console.log(this.orgCode)
        getAreaList({ orgCode: this.orgCode, sceneId: this.sceneId })
          .then(res => {
            console.log(res)
            if (res.data.data.length === 0) {
              callback(new Error('该楼层没有画区域'))
            } else {
              this.form.areaId = res.data.data[0].id
              callback()
            }
          })
      } else {
        callback(new Error('该选择正确的楼栋'))
      }
    }
    return {
      rules: {
        OrgName: [
          { required: true, validator: isHouseNode, trigger: 'change' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      OrgTree: [],
      floorTypes: [],
      filterText: '',
      checked: false,
      isFloor: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      markerTypes: [],
      sceneId: '',
      zooms: [],
      form: {
        markerType: '',
        zoomLevel: 0,
        inBuilding: 0,
        areaId: '',
        floorType: '',
        OrgName: ''
      },
      // 点位列表
      markerList: [],
      orgCode: '',
      OrgType: '',
      buildingZoom: 0
    }
  },
  methods: {
    /**
    @description 提交确定，新增点位
    @param 'form' 表单名称
     */
    submitForm (formName) {
      // 只为楼栋内设备才对文本框校验
      if (this.checked === true) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 验证通过保存点位
            this.saveMarker()
            this.dialogFormVisible = false
          } else {
            console.log('error submit!!')
            this.dialogFormVisible = true
            return false
          }
        })
      } else {
        this.saveMarker()
        this.dialogFormVisible = false
      }
    },
    /**
    @description 访问接口addMarkerList
     */
    saveMarker () {
      for (let i = 0; i < this.markerList.length; i++) {
        this.markerList[i].markerType = this.form.markerType
        this.markerList[i].zoomLevel = this.form.zoomLevel
        this.markerList[i].inBuilding = this.form.inBuilding
        this.markerList[i].areaId = this.form.areaId
        this.markerList[i].floorType = this.form.floorType
      }
      console.log(this.markerList)
      addMarkerList(this.markerList)
        .then((res) => {
          if (res.status === 200) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            // 将点位信息传递给子组件
            this.$emit('customEvent')
            // 改变父组件的deviceListStore
            this.$emit('deviceStoreEvent')
            // 刷新deviceTable
            this.$emit('deviceTableRefrash')
          }
        })
        .catch(err => {
          console.warn(err)
        })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    /**
@description 组织树点击事件
@param -data 组织节点信息
 */
    handleNodeClick (data) {
      this.orgCode = data.uuid
      this.OrgType = data.orgType
      this.form.OrgName = data.name
      this.$refs.orgPopover.doClose()
    },
    /**
@description 是否为楼栋内设备切换
*/
    changeInBuilding () {
      if (this.checked === true) {
        this.form.inBuilding = 1
        console.log(this.form.inBuilding)
        this.form.floorType = this.floorTypes[0].itemCode
        this.form.zoomLevel = this.buildingZoom
      } else {
        this.form.inBuilding = 0
        console.log(this.form.inBuilding)
        this.form.zoomLevel = this.zooms[0]
        this.form.areaId = ''
        this.form.floorType = ''
      }
    }
  },
  mounted: function () {
    // 组织树
    getOrgTree().then((res) => {
      if (res.data.data) {
        this.OrgTree.push(res.data.data)
      }
    }).catch(err => {
      console.warn(err)
    })
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
* {
  box-sizing: border-box;
}
.switch {
  padding-left: 120px;
}
.filter-tree {
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: 300px;
}
.Org {
  width: 217px;
}
</style>
