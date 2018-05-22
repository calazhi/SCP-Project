<template>
  <div>
    <el-dialog title="围栏信息" :visible.sync="dialogFormVisible" width="450px" :close-on-click-modal="false">
      <el-form>
        <el-form-item label="*围栏名称" label-width="80px" class="common-input">
          <el-input placeholder="请输入围栏名称" v-model="addoptions.areaName"></el-input>
        </el-form-item>
        <!--组织树模块-->
        <el-popover ref="orgPopover" placement="top-end" width="174" v-model="isShowPopover">
          <OrgTreeView ref="orgTree" @node-click="onHandleNodeClick"></OrgTreeView>
        </el-popover>
        <el-form-item label="所属组织" label-width="80px" class="common-input org">
          <el-input v-model="OrgName" placeholder="请选择组织" readonly v-popover:orgPopover @focus="propOrgDara"></el-input>
          <i class="el-icon-close" @click='onInfoReset()'></i>
        </el-form-item>
        <div>
          <div class="equip-list">设备列表</div>
          <ul class="device-list">
            <li class="list-item" v-for="deviceItem in deviceList" :key="deviceItem.deviceId" v-if="deviceItem.subDevice&&deviceItem.subDevice.length>0">
              <dl>
                <dt :title="deviceItem.deviceName">{{deviceItem.deviceName}}</dt>
              </dl>
              <ul class="sub-device-list">
                <li class="sub-list-item" v-for="subDeviceItem in deviceItem.subDevice" :key="subDeviceItem.subDeviceId">
                  <dl>
                    <dt :title="subDeviceItem.subDevicName" :class="{ active: subDeviceItem.subDeviceId === addoptions.deviceId }" @click="onDeviceChoose(subDeviceItem.subDeviceId,subDeviceItem.subDevicName)">{{subDeviceItem.subDevicName}}</dt>
                  </dl>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="device-id">
          <span>当前设备名称：</span>
          <span>{{addoptions.deviceName}}</span>
          <br>
          <span>当前设备编码：</span>
          <span>{{addoptions.deviceId}}</span>
        </div>
        <div class="btn-group">
          <el-button type='info' plain @click='onPageCancel()'>取消</el-button>
          <el-button type='success' plain @click='onPageSave()'>保存</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getOrgTree, getDeviceList, addArea, updateArea } from '@/views/MapApp/apis/index.js'
import { LOG_TAG } from '@/views/MapApp/assets/js/index.js'
import OrgTreeView from '@/components/TreeView'
export default {
  components: {
    OrgTreeView
  },
  data () {
    return {
      OrgName: '',
      isShowPopover: false,
      treeDatas: {
        tData: []
      },
      dialogFormVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      addoptions: {
        sceneId: '',
        areaId: '',
        areaName: '',
        areaType: '',
        borderPoints: [
          {
            gpsLongitude: 0,
            gpsLatitude: 0,
            pointX: 0,
            pointY: 0,
            pointType: 2
          },
          {
            gpsLongitude: 0,
            gpsLatitude: 0,
            pointX: 0,
            pointY: 0,
            pointType: 2
          }
        ],
        deviceId: '',
        deviceName: '',
        areaStatus: ''
      },
      deviceList: [],
      uuid: null,
      addOrEdit: '',
      filterText: ''
    }
  },
  mounted: function () {
    // 加载组织树
    getOrgTree().then((res) => {
      if (res.data.data) {
        this.treeDatas.tData.push(res.data.data)
      }
    }).catch(err => {
      console.warn(LOG_TAG + 'getOrgTree接口调用err')
      console.warn(err)
    })
    // 加载设备列表
    getDeviceList({ deviceType: 2021 }).then((res) => {
      this.deviceList = res.data.data
    }).catch(err => {
      console.warn(LOG_TAG + 'getDeviceList接口调用err')
      console.warn(err)
    })
  },
  methods: {
    /**
     * @description ElementUI 的功能函数
     */
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    /**
     * @description 组织树选中一项后触发事件
     * @param data Object 组织树数据
     */
    onHandleNodeClick (data) {
      this.OrgName = data.name
      this.uuid = data.uuid
      this.isShowPopover = false
      this.filterText = ''
      getDeviceList({ orgId: this.uuid, deviceType: 2021 }).then((res) => {
        this.deviceList = res.data.data
      }).catch(err => {
        console.warn(LOG_TAG + 'getDeviceList接口调用err')
        console.warn(err)
      })
    },
    /**
  *@description 输入框focus时，进行传值
  */
    propOrgDara () {
      console.log('父组件propOrgDara')
      this.$refs['orgTree'].treeDatas = this.treeDatas
    },
    /**
     * @description 点击重置按钮，用于清空组织输入框
     */
    onInfoReset () {
      this.OrgName = ''
      this.uuid = ''
      // 加载设备列表
      getDeviceList({ deviceType: 2021 }).then((res) => {
        this.deviceList = res.data.data
      }).catch(err => {
        console.warn(LOG_TAG + 'getDeviceList接口调用err')
        console.warn(err)
      })
    },
    /**
     * @description 单击设备列表中的子设备后，让子设备的颜色处于激活状态
     * @param subDeviceId String 子设备id
     * @param subDeviceName String 子设备名称
     */
    onDeviceChoose (subDeviceId, subDeviceName) {
      this.addoptions.deviceId = subDeviceId
      this.addoptions.deviceName = subDeviceName
    },
    /**
     * @description 取消按钮，用于关闭围栏弹窗
     */
    onPageCancel () {
      this.dialogFormVisible = false
    },
    /**
     * @description 保存按钮，用于添加围栏
     */
    onPageSave () {
      if (this.addOrEdit === 0) {
        let params = {}
        params = {}
        params.sceneId = this.addoptions.sceneId
        params.areaName = this.addoptions.areaName
        params.areaType = this.addoptions.areaType
        params.borderPoints = this.addoptions.borderPoints
        params.deviceId = this.addoptions.deviceId
        params.areaStatus = this.addoptions.areaStatus
        // 判断围栏名字是否为空
        if (this.addoptions.areaName === '') {
          this.$message({
            message: '围栏名称不能为空！',
            type: 'warning'
          })
          return
        }
        // 判断围栏名称有没有非法字符
        if (!/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(this.addoptions.areaName)) {
          this.$message({
            message: '围栏名称不能输入空格@#￥&等非法字符，只能是中文，字母，数字组合！',
            type: 'warning'
          })
          return
        }
        // 判断所属组织输入框是否为空
        if (this.addoptions.deviceId === '') {
          this.$message({
            message: '您还未选择设备！',
            type: 'warning'
          })
          return
        }
        // 添加围栏
        addArea(params).then((res) => {
          if (res.data.code === '00001') {
            this.$message({
              message: '该围栏设备已绑定防区' + '【' + res.data.data.areaName + '】',
              type: 'warning'
            })
            // 不关闭弹窗
            this.dialogFormVisible = true
            return
          }
          if (res.data.code === '00000') {
            console.log(LOG_TAG + 'res.data.data')
            console.log(res.data.data)
            // 调用父组件的方法
            this.$emit('customEvent')
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            // 关闭弹窗
            this.dialogFormVisible = false
          }
        }).catch(err => {
          console.warn(LOG_TAG + 'addArea接口调用err')
          console.warn(err)
        })
      } else if (this.addOrEdit === 1) {
        let params = {}
        params = {}
        params.areaName = this.addoptions.areaName
        params.areaId = this.addoptions.areaId
        params.areaType = this.addoptions.areaType
        params.deviceId = this.addoptions.deviceId
        params.areaStatus = this.addoptions.areaStatus
        // 判断围栏名字是否为空
        if (this.addoptions.areaName === '') {
          this.$message({
            message: '围栏名称不能为空！',
            type: 'warning'
          })
          return
        }
        // 判断围栏名称有没有非法字符
        if (!/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(this.addoptions.areaName)) {
          this.$message({
            message: '围栏名称不能输入空格@#￥&等非法字符，只能是中文，字母，数字组合！',
            type: 'warning'
          })
          return
        }
        // 添加围栏
        updateArea(params).then((res) => {
          if (res.data.code === '00001') {
            this.$message({
              message: '该围栏设备已绑定防区' + '【' + res.data.data.areaName + '】',
              type: 'warning'
            })
            // 不关闭弹窗
            this.dialogFormVisible = true
            return
          }
          if (res.data.code === '00000') {
            console.log(LOG_TAG + 'res.data.data')
            console.log(res.data.data)
            // 调用父组件的方法
            this.$emit('customEvent')
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            // 关闭弹窗
            this.dialogFormVisible = false
          }
        }).catch(err => {
          console.warn(LOG_TAG + 'updateArea接口调用err')
          console.warn(err)
        })
      }
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
* {
  box-sizing: border-box;
}
@origin: 10px;
.common-input {
  width: @origin*28;
}
.filter-tree {
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: 300px;
}
.el-dialog {
  .btn-group {
    line-height: 30px;
    padding: 0 24px 0 0;
    overflow: hidden;
    .el-button {
      float: right;
      margin-left: 20px;
    }
  }
  .button-groups {
    padding-left: 90px;
  }
  .equip-list {
    padding-left: 10px;
  }
  .device-list {
    width: 300px;
    height: 250px;
    border: 1px solid #ddd;
    overflow-y: auto;
    margin-left: 30px;
    margin-bottom: 10px;
    .list-item {
      overflow: hidden;
      border-bottom: 1px solid #ddd;
    }
    .sub-device-list {
      margin-left: 25px;
      .sub-list-item {
        overflow: hidden;
        border-bottom: 1px solid #ddd;
      }
    }
    li {
      cursor: pointer;
    }
    .active {
      color: white;
      background: rgba(34, 156, 255, 1);
    }
  }
  .device-id {
    padding-left: 10px;
  }
}
.org {
  position: relative;
  .el-icon-close {
    position: absolute;
    top: 10px;
    left: 170px;
    font-size: 20px;
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>
