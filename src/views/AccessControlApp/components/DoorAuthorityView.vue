<template>

<div class="dialog-padding">
  <el-dialog title="授权信息" :show-close="true" :center="true" :visible.sync="dialogVisible">
    <el-form>
      <el-row>
        <el-col :span="18">
          <el-row>
            <el-col :span="7">
              <el-form-item label="姓    名:" class="text-left">
                <span>{{ userData.user.userName }}</span>
              </el-form-item>
              <el-form-item label="证件类型:" class="text-left">
                <span>{{ userData.user.idenType }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item label="性    别:" class="text-left">
                <span>{{ userData.user.sex }}</span>
              </el-form-item>
              <el-form-item label="证件号码:" class="text-left">
                <span>{{ userData.user.idenNum }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item label="电话号码:" class="text-left">
                <span>{{ userData.user.phone }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="24" v-show="userData.user.personType === 0">
              <el-form-item class="barriergate-table">
                <el-table :data="housesAndtypes" border max-height="135" style="width: 100%">
                  <el-table-column prop="houseName" label="房屋信息"></el-table-column>
                  <el-table-column prop="userType" label="人员类型" :formatter="formatUserType" width="120px"></el-table-column>
                </el-table>
              </el-form-item> 
            </el-col>

          </el-row>
        </el-col>

        <el-col :span="6">
          <div class="face-pic-preview">
            <img :src="faceImg" ref="img"/>
          </div>       
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="24">
          <hr />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="开始日期:" class="text-left">
            <span>{{formatDate(userData.startDate)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束日期:" class="text-left">
            <span>{{formatDate(userData.endDate)}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="权限状态:" class="text-left">
            <span v-show="userData.authorStatus === '1'">正常</span>
            <span v-show="userData.authorStatus === '0'" style="color: red;">禁用</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="通行方式:"  class="text-left" prop="accessType">
            <span>{{formatAccessType(userData.accessType)}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <hr />
        </el-col>
      </el-row>
      <el-row class="col-margin">
        <el-col :span="14">
          <el-form-item class="td-label">
            <template>
              <el-table :data="allCards" size="mini" height="320" border>
                <el-table-column prop="cardType" label="卡类型" header-align="center" align="center"></el-table-column>
                <el-table-column prop="uniqueCode" label="物理卡号" header-align="center" align="center"></el-table-column>
                <el-table-column prop="isAuthorized" label="是否已授权" header-align="center" align="center" :formatter="formatIsAuth"></el-table-column>
              </el-table>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="已授权设备组:" class="device-group">
            <template>
              <el-table :data="deviceGroups" border max-height="280" :show-header='false' ref="groupTab" style="text-align:left">
                <el-table-column prop="uuid" v-if="false"></el-table-column>
                <el-table-column label="组名" prop="groupName"></el-table-column>
              </el-table>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="ableClick($event)">{{userData.authorStatus === '0' ? '启 用' : '禁 用'}}</el-button>
      <el-button type="danger" @click="cancelClick($event)">注 销</el-button>
      <el-button type="info" @click="closeClick($event)">关 闭</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  currentUserAuthorInfo, cancelUserAuthorInfo, enableUserAuthorInfo, listDeviceGroup, listCardByUserId, listHouseNamesById, formatDate
} from '@/views/AccessControlApp/apis'
import defaultPicture from '@/views/AccessControlApp/assets/images/defaultPicture.png'

const userTypeMap = {
  1: '业主',
  2: '业主家属',
  3: '租客',
  4: '访客',
  5: '物业',
  6: '快递',
  7: '外卖',
  8: '其他'
}

export default {
  data () {
    return {
      deviceGroups: [],
      cardList: [],
      allCards: [],
      groupIds: [],
      authorizedCard: [],
      authId: '',
      userData: {
        user: {}
      },
      housesAndtypes: [],
      faceImg: defaultPicture
    }
  },
  props: ['viewDialogVisible', 'userRowData'],
  mounted () {
    let that = this
    that.userData.user = that.userRowData
    let facePic = that.userRowData.facePic
    if (facePic) {
      this.faceImg = that.userRowData.facePic
    }
    // 查询业主房屋信息
    if (that.userRowData.personType === 0) {
      listHouseNamesById(that.userRowData.userId)
      .then(res => {
        if (res.code === '00000') {
          this.housesAndtypes = res.data
        } else {
          that.$message({
            message: res.code + ':' + res.message,
            type: 'error'
          })
        }
      })
    }
    // 查询当前用户权限信息
    currentUserAuthorInfo({
      params: {
        userId: that.userRowData.userId
      }
    }).then(result => {
      that.authId = result.id
      that.userData.startDate = result.startDate
      that.userData.endDate = result.endDate
      that.userData.authorStatus = result.authorStatus
      that.userData.accessType = result.accessType
      var groups = result.groupIds
      // 查询所有的设备组,并从中过滤掉掉未授权设备组
      listDeviceGroup().then(result => {
        let deviceGroups = result.data
        for (let i = 0; i < deviceGroups.length; i++) {
          if (groups.indexOf(deviceGroups[i].uuid) === -1) {
            deviceGroups.splice(i--, 1)
          }
        }
        that.deviceGroups = deviceGroups
      }).catch(() => {
        that.$message({
          message: '查询用户已授权设备组异常',
          type: 'error'
        })
      })
      that.authorizedCard = result.authorizedCard
    })
    .then(() => {
      // 调用卡片组件查询当前用户绑定的所有卡片
      listCardByUserId(that.userRowData.userId)
      .then(result => {
        that.allCards = result.data
      }).catch(() => {
        that.$message({
          message: '调用卡片组件查询用户绑定卡异常',
          type: 'error'
        })
      })
      .then(
        () => {
          // 勾选已授权卡
          let cards = that.allCards
          let arr = []
          for (let i in cards) {
            arr.push(cards[i].uniqueCode)
          }
          let _authorizedCard = that.authorizedCard
          for (let i in arr) {
            if (_authorizedCard.indexOf(arr[i]) >= 0) {
              that.allCards[i].isAuthorized = true
            } else {
              that.allCards[i].isAuthorized = false
            }
          }
          // 将已授权的卡放在前面
          var objectArraySort = function (keyName) {
            return function (objectN, objectM) {
              var valueN = objectN[keyName]
              var valueM = objectM[keyName]
              if (valueN < valueM) return 1
              else if (valueN > valueM) return -1
              else return 0
            }
          }
          that.allCards.sort(objectArraySort('isAuthorized'))
        }
      )
    })
    .catch(function (error) {
      console.log(error)
    })
  },
  methods: {
    // 禁用
    ableClick: function (event) {
      let that = this
      // 如果是启用状态，点按钮就是禁用。如果是禁用状态，点按钮就是启用
      let mode = that.userData.authorStatus === '0' ? '1' : '0'
      enableUserAuthorInfo(that.authId, mode).then(result => {
        // 操作成功
        if (result.code === '00000') {
          that.$message({
            message: '操作成功!',
            type: 'success'
          })
          that.$emit('dialogClose', false)
          that.$emit('refreshPerson', that.userRowData.personType)
        } else {
          that.$message({
            message: result.message,
            type: 'error'
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    // 注销
    cancelClick: function (event) {
      let that = this
      cancelUserAuthorInfo(that.authId).then(result => {
        // 操作成功
        if (result.code === '00000') {
          that.$message({
            message: '注销成功!',
            type: 'success'
          })
        } else {
          that.$message({
            message: result.message,
            type: 'error'
          })
        }
        that.$emit('dialogClose', false)
        that.$emit('refreshPerson', that.userRowData.personType)
      }).catch(function (error) {
        console.log(error)
      })
    },
    closeClick: function (event) {
      this.$emit('dialogClose', false)
    },
    formatIsAuth: function (row, column) {
      if (row.isAuthorized === true) {
        return '是'
      } else {
        return '否'
      }
    },
    checkboxInit: function () {
      return false
    },
    formatAccessType: function (val) {
      let accessType = []
      // 将val转换为数组类型，否则会报indexOf方法不存在错误
      let temp = []
      for (let i in val) {
        temp.push(val[i])
      }
      if (temp.indexOf(2) >= 0) {
        accessType.push('刷卡')
      }
      if (temp.indexOf(7) >= 0) {
        accessType.push('人脸')
      }
      if (temp.indexOf(6) >= 0) {
        accessType.push('指纹')
      }
      return accessType.join('  |  ')
    },
    formatUserType: (row, column) => {
      return userTypeMap[row.userType]
    },
    formatDate: date => {
      return formatDate(date)
    }
  },
  computed: {
    // 是否关闭窗口
    dialogVisible: {
      get: function () {
        return this.viewDialogVisible
      },
      set: function (value) {
        this.$emit('dialogClose', value)
      }
    }
  }
}
</script>

<style scoped>

.el-form-item {
  margin-bottom: 5px;
}

.el-form-item.td-label {
  font-weight: bold;
}

.el-form-item.td-label .el-table {
  font-weight: normal;
}

.el-form-item span {
  font-weight: normal;
}

.device-group {
  /* font-weight: bold; */
  margin-left: 5px
}

.col-margin {
  margin-top: 10px
}

.text-left {
  font-weight: bold;
  text-align: left;
}

.face-pic-preview {
  width: 206px;
  height: 203px;
  /* margin: 3px, 5px; */
  border: 1px solid #ccc;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.face-pic-preview img {
  width: 206px;
}

</style>

<style lang="less">
.barriergate-table {
  .el-table{
    .el-table__body-wrapper{
      td{
        padding:4px 0;
      }
    }
    .el-table__header thead th{
      padding:0;
      font-weight: bold;
      color: #606266;
    }
  }
}
.dialog-padding {
  .el-dialog__body {
    padding: 10px
  }
  .el-dialog__footer {
    padding-bottom: 10px
  }
}
</style>
