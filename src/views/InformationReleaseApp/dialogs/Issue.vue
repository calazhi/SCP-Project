<template>
  <el-dialog title="选择设备" :visible="show" @close="closeEvent(false)" width="1523px">
    <el-row class="dialog-row" style="margin-top:-30px;">
      <el-col class="dialog-left">
        <el-table class="issue-table" height="500" :border="true" :data="allData" :default-expand-all="true">
          <el-table-column type="expand" :resizable="false">
            <template slot-scope="scope" v-if="scope.row.subDevice && scope.row.subDevice.length">
              <el-table :data="scope.row.subDevice" filter-multiple class="device-name-table" tooltip-effect="light" :show-header="false">
                <el-table-column type="index" label="设备序号" align="center" :resizable="false">
                </el-table-column>
                <el-table-column label="设备名称" prop="subDeviceName" align="center" :resizable="false">
                </el-table-column>
                <el-table-column label="设备描述" prop="subDeviceDesc" align="center" :resizable="false">
                </el-table-column>
                <el-table-column label="组织信息" prop="subOrgName" align="center" :resizable="false">
                </el-table-column>
                <el-table-column label="安装位置" prop="subDeviceInstallAddress" align="center" :resizable="false">
                </el-table-column>
                <el-table-column prop="creatTime" label="操作" align="center" class="creat-time" :resizable="false">
                  <template slot-scope="scope">
                    <template v-if="!scope.row.subDevice || !scope.row.subDevice.length">
                      <el-button type="text" @click="onHandleSelectClick(scope.$index,scope.row)">
                        添加
                      </el-button>
                    </template>
                    <template v-else>
                      <el-button type="text" @click="onHandleAllSelectClick(scope.$index,scope.row)">
                        添加全部
                      </el-button>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="设备名称" prop="deviceName" align="center" :resizable="false">
          </el-table-column>
          <el-table-column label="设备描述" prop="deviceDesc" align="center" :resizable="false">
          </el-table-column>
          <el-table-column label="组织名称" prop="orgName" align="center" :resizable="false">
          </el-table-column>
          <el-table-column label="安装位置" prop="installAddress" align="center" :resizable="false">
          </el-table-column>
          <el-table-column prop="creatTime" label="操作" align="center" :resizable="false">
            <template slot-scope="scope">
              <template v-if="!scope.row.subDevice || !scope.row.subDevice.length">
                <el-button type="text" @click="onHandleSelectClick(scope.$index,scope.row)">
                  <!-- 添加 -->
                </el-button>
              </template>
              <template v-else>
                <el-button type="text" @click="onHandleAllSelectClick(scope.$index,scope.row)">
                  添加全部
                </el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col class="dialog-right">
        <el-table class="selectTable" height="500" :data="selectDate" :border="true">
          <el-table-column prop="subDeviceName" label="设备名称" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="subDeviceDesc" label="设备描述" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="subOrgName" label="组织名称" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="subDeviceInstallAddress" label="安装位置" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="creatTime" label="操作" align="center" :resizable="false">
            <template slot-scope="scope">
              <el-button type="text" @click.native.prevent="onDeleteRow(scope.$index, selectDate)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeEvent">取 消</el-button>
      <el-button type="primary" @click="onSaveEpuipment">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getDeviceListData, postSendIssueData } from '../apis/index'
export default {
  props: {
    show: {
      required: true,
      type: Boolean,
      default () {
        return false
      }
    },
    param: {}
  },
  data () {
    return {
      allData: [],
      selectDate: []
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.getEquipments()
      }
    }
  },
  mounted () {
    this.param.terminalNoList = []
  },
  updated () {
    this.param.terminalNoList = []
    this.selectDate.forEach((item) => {
      this.param.terminalNoList.push({ 'terminalNo': item.subDeviceID })
    })
  },
  methods: {
    // 获取设备信息
    getEquipments () {
      getDeviceListData({ deviceId: this.param.deviceId }).then(res => {
        if (res.data.code === '00000') {
          // 判断结果是否不为空
          if (res.data) {
            this.allData = res.data.data
          } else {
            this.allData = []
          }
        }
      }).catch(() => {
      })
    },
    // 保存设备数据
    onSaveEpuipment () {
      this.$emit('closeissueDialog')
      let params = this.param
      postSendIssueData(params).then(res => {
        if (res.data.code === '00000') {
          this.$message({
            message: '发布成功',
            type: 'success'
          })
          this.$emit('showstate')
          this.selectDate = []
        } else {
          this.$message.error('发布失败')
          this.selectDate = []
        }
      }).catch(() => {
      })
    },
    // 关闭发布对话框
    closeEvent () {
      this.$emit('closeissueDialog')
      this.selectDate = []
    },
    // 添加单个设备按钮
    onHandleSelectClick (index, row) {
      if (this.selectDate && this.selectDate.length > 0) {
        var aaa = 0
        for (let i = 0; i < this.selectDate.length; i++) {
          if (this.selectDate[i].subDeviceID === row.subDeviceID) {
            aaa++
          }
        }
        if (aaa === 0) {
          this.selectDate.push(row)
        }
      } else {
        this.selectDate.push(row)
      }
    },
    // 添加全部按钮
    onHandleAllSelectClick (index, allrow) {
      var subDevice = allrow.subDevice
      subDevice.forEach(e => {
        var time = 0
        if (this.selectDate.length > 0) {
          this.selectDate.forEach(data => {
            if (e.subDeviceID === data.subDeviceID) {
              time++
            }
          })
          if (time === 0) {
            this.selectDate.push(e)
          }
        } else {
          this.selectDate.push(e)
        }
      })
    },
    // 删除发布对话框中右侧的设备信息
    onDeleteRow (index, rows) {
      rows.splice(index, 1)
    }
  }
}
</script>
<style lang="less" scoped>
.dialog-row {
  display: flex;
  width: 100%;
  .dialog-left {
    flex: 1;
    padding: 0 39px 0 40px;
  }
  .dialog-right {
    flex: 1;
    margin-left: 20px;
    padding: 0px 40px 0 40px;
    border-left: 1px solid #ddd;
    .selectTable {
      margin-top: 10px;
      width: 100%;
    }
  }
}
.creat-time {
  border: none;
}
.device-name-table {
  width: 100%;
  margin: 0px 0px -1px 0px;
}
</style>
<style lang="less">
.issue-table {
  margin-top: 10px;
  width: 100%;
  .el-table__expanded-cell[class*="cell"] {
    padding: 0;
  }
  .device-name-table {
    .el-table__body-wrapper {
      .el-table__body {
        width: 100% !important;
        colgroup {
          col:nth-child(1) {
            width: 49px !important;
          }
        }
      }
    }
  }
}
</style>