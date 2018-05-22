<template>

<div class="dialog-padding">
  <el-dialog title="用户授权" :show-close=true :center=true :visible.sync="dialogVisible">
    <el-form :rules="rules" :model="userData" ref="userForm">
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
              <el-form-item label="联系电话:" class="text-left">
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
      </el-row>
      <el-row class="row-border">
        <el-col :span="10">
          <el-form-item label="开始日期:" class="text-left" prop="startDate"> 
            <span>
              <el-date-picker v-model="userData.startDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" :editable="false" :picker-options="pickerOptionsS">
              </el-date-picker>
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="结束日期:" class="text-left" prop="endDate">
            <span>
              <el-date-picker v-model="userData.endDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" :editable="false" :picker-options="pickerOptionsE">
              </el-date-picker>
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item v-show="userData.authorStatus" label="权限状态:" class="text-left">
            <span v-show="userData.authorStatus === '1'">正常</span>
            <span v-show="userData.authorStatus === '0'" style="color: red;">禁用</span>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="height:35px">
          <el-form-item label="通行方式:" class="text-left" prop="accessType">
            <el-checkbox-group v-model="accessType">
              <el-checkbox v-for="access in accessTypes" :label='access.id' :key = "access.id">{{access.value}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item class="td-label">
            <template>
              <el-table :data="allCards" size="mini" height="320" border @selection-change="cardChange" ref="cardTab">
                <el-table-column prop="cardType" type="selection"></el-table-column>
                <el-table-column prop="cardType" label="卡类型" header-align="center" align="center"></el-table-column>
                <el-table-column prop="uniqueCode" label="物理卡号" header-align="center" align="center"></el-table-column>
                <el-table-column prop="isAuthorized" label="是否已授权" header-align="center" align="center" :formatter="formatIsAuth"></el-table-column>
              </el-table>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="门禁设备组:" class="device-group">
            <template>
              <el-table :data="deviceGroups" border max-height="291" style="text-align:left" :show-header='false' @selection-change="groupChange" ref="groupTab">
                <el-table-column type="selection" prop="deviceID"></el-table-column>
                <el-table-column prop="uuid" v-if="false"></el-table-column>
                <el-table-column label="组名" prop="groupName"></el-table-column>
              </el-table>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer">
      <el-button type="primary" @click="confirmClick($event)" :disabled="isSaveDisabled">保 存</el-button>
      <el-button type="info" @click="closeClick($event)">关 闭</el-button>
    </div>

  </el-dialog>
  
</div>
</template>

<script>

import {
  currentUserAuthorInfo, addUserAuthorInfo, updateUserAuthorInfo, listDeviceGroup, listCardByUserId, listHouseNamesById
}
from '@/views/AccessControlApp/apis'
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
      accessTypes: [{'id': 2, 'value': '刷卡'}, {'id': 6, 'value': '指纹'}, {'id': 7, 'value': '人脸'}],
      accessType: [],
      cardList: [],
      allCards: [],
      groupIds: [],
      // 通行方式回显中转数组
      userData: {
        user: {},
        startDate: '',
        endDate: ''
      },
      authorizedCard: [],
      rules: {
        startDate: [
          { required: true, message: '开始日期不能为空', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '结束日期不能为空', trigger: 'blur' }
        ],
        accessType: [
          { type: 'array', required: true, message: '至少需要选择一种通行方式', trigger: 'blur' }
        ]
      },
      pickerOptionsS: {
        disabledDate: time => {
          let endDate = this.userData.endDate
          if (endDate) {
            return time.getTime() > endDate - 8.64e7 || time.getTime() < Date.now() - 8.64e7
          }
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      pickerOptionsE: {
        disabledDate: time => {
          let startDate = this.userData.startDate
          if (startDate) {
            return time.getTime() < startDate
          }
          return time.getTime() < Date.now()
        }
      },
      housesAndtypes: [],
      faceImg: defaultPicture
    }
  },
  props: ['editDialogVisible', 'userRowData'],
  mounted () {
    let that = this
    that.userData.user = that.userRowData
    let facePic = that.userRowData.facePic
    if (facePic !== '' && facePic !== undefined && facePic !== null) {
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
    // 1.查询所有的设备组
    listDeviceGroup().then(result => {
      that.deviceGroups = result.data
    })
    .then(
      // 2.调用卡片组件查询当前用户绑定的所有卡片
      listCardByUserId(that.userRowData.userId)
      .then(result => {
        that.allCards = result.data
      }).catch(() => {
        that.$message({
          message: '调用卡片组件查询用户绑定卡异常',
          type: 'error'
        })
      })
      .then(() => {
        // 3.查询当前用户权限信息
        currentUserAuthorInfo({
          params: {
            userId: that.userRowData.userId
          }
        })
        .then(result => {
          that.userData.startDate = result.startDate
          that.userData.endDate = result.endDate
          that.groupIds = result.groupIds
          that.authorizedCard = result.authorizedCard
          that.userData.authorStatus = result.authorStatus
          that.userData.id = result.id
          // 判断是否有人脸，没有则禁用人脸通行方式
          if (!that.userRowData.facePic) {
            for (let i in that.accessTypes) {
              if (that.accessTypes[i].id === 7) {
                that.accessTypes.splice(i, 1)
              }
            }
          }
          // 判断是否有指纹，没有则剔除指纹通行方式
          if (!that.userRowData.finger) {
            for (let i in that.accessTypes) {
              if (that.accessTypes[i].id === 6) {
                that.accessTypes.splice(i, 1)
              }
            }
          }
          // 勾选已授权通行方式，不能直接赋值，否则通行方式会全选
          if (result.accessType) {
            that.accessType = result.accessType.concat()
          }
          // 勾选已授权设备组
          let group = that.deviceGroups
          let groupArr = []
          for (let i in group) {
            groupArr.push(group[i].uuid)
          }
          let _groupIds = that.groupIds
          for (let i in groupArr) {
            if (_groupIds.indexOf(groupArr[i]) >= 0) {
              setTimeout(() => { that.$refs.groupTab.toggleRowSelection(that.deviceGroups[i]) }, 200)
            }
          }
        })
        .then(() => {
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
              setTimeout(() => { that.$refs.cardTab.toggleRowSelection(that.allCards[i]) }, 200)
            } else {
              that.allCards[i].isAuthorized = false
            }
          }
        })
      }
      )
    )
  },
  methods: {
    closeClick: function (event) {
      this.$emit('dialogClose', false)
    },
    confirmClick: function (event) {
      let that = this
      // 如果是业主类型，则取其优先级最高的用户类型
      if (that.userRowData.personType === 0) {
        let arr = []
        for (let type of that.housesAndtypes) {
          arr.push(type.userType)
        }
        that.userData.user.userType = Math.min.apply(null, arr)
      }
      that.userData.accessType = that.accessType
      that.userData.cardList = that.cardList
      that.userData.groupIds = that.groupIds
      // 表单校验
      if (!that.isValid()) {
        return
      }
      that.$refs.userForm.validate((valid) => {
        if (valid) {
          // 如果状态存在就是更新,否则就是添加
          if (!that.userData.id) {
            addUserAuthorInfo(that.userData).then(result => {
              // 操作成功
              if (result.code === '00000') {
                that.$message({
                  message: '操作成功!',
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
          } else {
            updateUserAuthorInfo(that.userData).then(result => {
              if (result.code === '00000') {
                that.$message({
                  message: '操作成功!',
                  type: 'success'
                })
              } else {
                that.$message({
                  message: result.message,
                  type: 'error'
                })
              }
              that.$emit('dialogClose', false)
            }).catch(function (error) {
              console.log(error)
            })
          }
        }
      })
    },
    deleteCard: function (event, index, rows) {
      rows.splice(index, 1)
    },
    openDialog: function () {
      this.cardDialogVisible = true
    },
    groupChange: function (selections) {
      var _this = this
      _this.groupIds = []
      for (let i in selections) {
        _this.groupIds.push(selections[i].uuid)
      }
    },
    cardChange: function (selections) {
      var _this = this
      _this.cardList = selections
      if (selections.length > 0) {
        if (!_this.accessType || _this.accessType.indexOf(2) < 0) {
          _this.accessType.push(2)
        }
      } else {
        let index = _this.accessType.indexOf(2)
        if (index > -1) {
          _this.accessType.splice(index, 1)
        }
      }
    },
    formatIsAuth: function (row, column) {
      if (row.isAuthorized === true) {
        return '是'
      } else {
        return '否'
      }
    },
    // 保存授权时校验表单
    isValid: function () {
      if (this.accessType.indexOf(2) >= 0 && this.cardList.length === 0) {
        this.$message({
          message: '选择了刷卡通行方式必须选择卡',
          type: 'warning'
        })
        return false
      }
      if (this.cardList.length > 0 && this.accessType.indexOf(2) < 0) {
        this.$message({
          message: '选中卡片必须勾选刷卡通行方式',
          type: 'warning'
        })
        return false
      }
      if (this.userData.startDate >= this.userData.endDate) {
        this.$message({
          message: '开始日期必须小于结束日期',
          type: 'warning'
        })
        return false
      }
      return true
    },
    formatUserType: (row, column) => {
      return userTypeMap[row.userType]
    }
  },
  computed: {
    // 是否关闭窗口
    dialogVisible: {
      get: function () {
        return this.editDialogVisible
      },
      set: function (value) {
        this.$emit('dialogClose', value)
      }
    },
    isSaveDisabled () {
      return this.accessType.length < 1 || this.groupIds.length < 1 || !this.userData.startDate || !this.userData.endDate
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
  margin-top: 8px;
  margin-bottom: 0px
}

.el-form-item.td-label .el-table {
  font-weight: normal;
}

.el-form-item span {
  font-weight: normal;
}

.row-border {
  border-top:1px solid #606266;
  border-bottom:1px solid #606266;
  padding:8px 0px;
}

.device-group {
  /* font-weight: bold; */
  margin: 4px 5px
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
