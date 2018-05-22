<template>
    <div id="park">
      <div class="park-tree">
        <div class="parkTree-cont" v-if="tableData.length > 0">
          <el-tree :data="tableData" node-key="id" ref="tree" default-expand-all highlight-current :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
        <p class="tree-nodata" v-else>暂无数据</p>
      </div>
       <section class="noDataStyle" v-if="noData">
         <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
          <el-tab-pane label="车场基本信息" name="first">
            <span slot="label"> 车场基本信息</span>
            <section class="park-btns">
              <el-button type="primary" @click="addParking">新增车场</el-button>
              <el-button type="danger" @click="handleDelete">删除车场</el-button>
              <el-button type="primary" @click="saveDate">保存车场</el-button>
            </section>
            <el-form ref="parkInfo" :model="parkInfo" :rules="editParkRule" label-width="110px" v-show="tableData.length > 0">
              <span>车场基本信息</span>
              <div>
                <el-form-item label="车场名称：" prop="parkingName" class="formLabel">
                  <el-input v-model="parkInfo.parkingName"></el-input>
                </el-form-item>
                <el-form-item label="车场编号：" class="formLabelRight">
                  <el-input v-model="parkInfo.parkingCode" :disabled="true"></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="总车位数：" prop="total" class="formLabel">
                  <el-input v-model="parkInfo.total"></el-input>
                </el-form-item>
                <el-form-item label="临停车位数：" prop="tempNum" class="formLabelRight">
                  <el-input v-model="parkInfo.tempNum"></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="月保车位数：" prop="monthNum" class="formLabel">
                  <el-input v-model="parkInfo.monthNum"></el-input>
                </el-form-item>
                <el-form-item label="临停规则：" prop="parkRuleName" class="formLabelRight">
                  <div class="">
                    <el-input v-model="parkInfo.parkRuleName" class="wid85" :disabled = "true"></el-input>
                    <i class="el-icon-search" @click="openRule" title="选择临停规则"></i>
                  </div>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="组织：" prop="parkOrgName" class="formLabel">
                  <div class="">
                    <el-input v-model="parkInfo.parkOrgName" class="wid85" :disabled = "true"></el-input>
                    <i class="el-icon-search" @click="openOrg" title="选择组织"></i>
                  </div>
                </el-form-item>
                <el-form-item label="临停收费标准：" class="formLabelRight">
                  <el-input v-model="parkInfo.feeRuleName" class="wid85" :disabled = "true"></el-input>
                  <i class="el-icon-search" @click="openCharge" title="选择临停收费标准"></i>
                </el-form-item>
              </div>
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" :rows= 4 v-model="parkInfo.remark"></el-input>
              </el-form-item>
            </el-form>
            <el-dialog width="50%" title="选择规则" :visible.sync="innerVisible" append-to-body>
              <el-table :data="ruleData" ref="ruleData" max-height="500" highlight-current-row @current-change="ruleHandleCurrentChange" style="width: 100%">
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="ruleName" label="规则名称" ></el-table-column>
                <el-table-column prop="ruleDiscription" label="备注"></el-table-column>
              </el-table>
              <section slot="footer" class="dialog-footer tagRight">
                <el-button @click="innerVisible = false">取 消</el-button>
                <el-button type="primary" @click="selectRule">确认</el-button>
              </section>
            </el-dialog>
            <el-dialog width="50%" title="选择计费标准" :visible.sync="chargeVisible" append-to-body>
              <el-table :data="chargeData" ref="chargeData" max-height="500" highlight-current-row @current-change="chargeHandleCurrentChange" style="width: 100%">
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="ruleName" label="计费名称" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="memo" label="备注" :show-overflow-tooltip="true"></el-table-column>
              </el-table>
              <section slot="footer" class="dialog-footer tagRight">
                <el-button @click="chargeVisible = false">取 消</el-button>
                <el-button type="primary" @click="selectCharge">确认</el-button>
              </section>
            </el-dialog>
            <el-dialog width="40%" title="选择组织" :visible.sync="orgVisible" append-to-body>
              <div class="dialog-tree">
                <el-tree :data="orgData" node-key="uuid" ref="tree" highlight-current :props="orgTreeProps" @node-click="orgHandleNodeClick"></el-tree>
              </div>
              <section slot="footer" class="dialog-footer tagRight">
                <el-button @click="orgVisible = false">取 消</el-button>
                <el-button type="primary" @click="selectOrg">确认</el-button>
              </section>
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="通道基本信息" name="second">
            <span slot="label"> 通道基本信息</span>
            <section class="channelNo" v-if="noData">
              <div class="chnnel-msg">
              <span>出入口通道</span>
              <el-button type="primary" class="chnnelNew" @click="addChannelClik">新建通道</el-button>
              </div>
              <el-table :data="tableData3" class="chnnelData" highlight-current-row
                @current-change="handleCurrentChange" max-height = "300">
                <el-table-column :show-overflow-tooltip="true" prop="name" label="通道名" >
                </el-table-column>
                <!-- <el-table-column prop="type" label="通道类型" :formatter="modeTyFormat">
                </el-table-column> -->
                <el-table-column prop="direct" label="方向" :formatter="modeDirFormat">
                </el-table-column>
                <el-table-column prop="ip" label="出入口计算机名">
                </el-table-column>
                <el-table-column fixed="right" label="操作" >
                  <template slot-scope="scope">
                    <el-button size="small" @click="editChannelClik(scope.$index,scope.row)" >修改</el-button>
                    <el-button size="small" @click="delChannelClik(scope.$index,scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <section class="channelMag">
                <div class="chnnel-msg">
                  <span > 出入口通道设备信息</span>
                  <div class="channelBind">
                    <el-button type="primary" @click="bindDeviceHandle">绑定设备</el-button>
                    <el-button type="danger" @click="unbindDeviceHandle">解绑设备</el-button>
                  </div>
                </div>
                <el-table :data="tableData4" @selection-change="deviceHandleCurrentChange" class='wid1000' highlight-current-row
                  @current-change="deviceHandleCurrentChange" max-height = "300">
                  <el-table-column type="selection" width="60"></el-table-column>
                  <el-table-column prop="deviceName" label="设备名">
                  </el-table-column>
                  <el-table-column prop="deviceModel" label="型号">
                  </el-table-column>
                  <el-table-column prop="direct" label="安装方向" :formatter="modeDirFormat">
                  </el-table-column>
                  <el-table-column prop="deviceIp" label="设备IP">
                  </el-table-column>
                </el-table>
              </section>
            </section>
          </el-tab-pane>
        </el-tabs>
       </section>
       <section v-else></section>
       <el-dialog title="新增车场" :visible.sync="dialogVisible" :before-close="closeDialog">
        <el-form :model="parkInitInfo" ref="parkInitInfo" :rules="addParkRule" label-width="100px" class="deptInfo-ruleForm newPark">
          <el-form-item label="车场名称" prop="parkingName">
            <el-input type="text" v-model="parkInitInfo.parkingName" placeholder="请输入车场名称" auto-complete="off" :disabled="false"></el-input>
          </el-form-item>
          <el-form-item label="车场编号" prop="parkingCode">
            <el-input type="text" v-model="parkInitInfo.parkingCode" placeholder="请输入车场编号" auto-complete="off" :disabled="false"></el-input>
          </el-form-item>
          <el-form-item label="父车场编号" prop="parentParkingCode">
            <el-input type="text" v-model="parkInitInfo.parentParkingCode" auto-complete="off" :disabled="true" class="clearCode"></el-input>
            <i class="el-icon-refresh" @click="cleanData" title="清空"></i>
          </el-form-item>
          <el-form-item label="总车位数" prop="total">
            <el-input type="text" v-model="parkInitInfo.total" auto-complete="off" :disabled="false"></el-input>
          </el-form-item >
          <el-form-item label="临停车位数" prop="tempNum">
            <el-input type="text" v-model="parkInitInfo.tempNum" auto-complete="off" :disabled="false"></el-input>
          </el-form-item >
          <el-form-item label="月保车位数" prop="monthNum">
            <el-input type="text" v-model="parkInitInfo.monthNum" auto-complete="off" :disabled="false"></el-input>
          </el-form-item >
          <el-form-item label="临停规则：" prop="parkRuleName" class="mt15">
            <el-input v-model="parkInitInfo.parkRuleName" class="wid85" :disabled = "true"></el-input>
            <i class="el-icon-search" @click="openRule" title="选择临停规则"></i>
          </el-form-item>
          <el-form-item label="临停收费标准">
            <el-input v-model="parkInitInfo.feeRuleName" class="wid85" :disabled = "true"></el-input>
            <i class="el-icon-search" @click="openCharge" title="选择临停收费标准"></i>
          </el-form-item>
          <el-form-item label="组织：" prop="parkOrgName">
            <el-input v-model="parkInitInfo.parkOrgName" class="wid85" :disabled = "true"></el-input>
            <i class="el-icon-search" @click="openOrg" title="选择组织"></i>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows=4 v-model="parkInitInfo.remark" auto-complete="off" :disabled="false"></el-input>
          </el-form-item>
          <el-form-item class="dialog-footer tagRight">
            <el-button @click="cannelDialog('parkInitInfo')">取 消</el-button>
            <el-button type="primary" @click="savePark">保 存</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog :visible.sync="ChanneldialogVisible" :title="dialogTitle"  :before-close="closeChannelDialog">
      <el-form :model="channelInfo" :rules="rules" ref="channelInfo" label-width="150px" class="deptInfo-ruleForm parkwid50">
        <el-form-item label="通道名称" prop="name">
          <el-input type="text" v-model="channelInfo.name" auto-complete="off" :disabled="false"></el-input>
        </el-form-item>
        <!-- <el-form-item label="通道类型" prop="type">
          <el-select v-model="channelInfo.type" placeholder="请选择" :disabled="false">
						<el-option
					      v-for="item in channelTypeOpt"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					  </el-option>
				  </el-select>
        </el-form-item> -->
        <el-form-item label="方向" prop="direct">
          <el-select v-model="channelInfo.direct" placeholder="请选择" :disabled="false">
						<el-option
					      v-for="item in channelDirectOpt"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					  </el-option>
				  </el-select>
        </el-form-item>
        <el-form-item label="出入口计算机名" prop="ip">
          <el-input type="text" v-model="channelInfo.ip" auto-complete="off" :disabled="false" @change="nameUp"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cannelChannelDialog('channelInfo')">取 消</el-button>
        <!--<el-button @click="ChanneldialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="saveChannel">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="devicedialogVisible" :title="dialogTitle" class="device-dialog" :before-close="closeDeviceDialog" style="width:120%;left:-10%; top:-10%;">
      <div class="tree-left">
        <div class="tree-dialog" v-if="orgData.length > 0">
          <el-tree :data="orgData" node-key="uuid" ref="tree" highlight-current :props="orgTreeProps" @node-click="orgDeviceNodeClick"></el-tree>
        </div>
        <div class="" v-else>暂无组织数据</div>
      </div>
      <div class="table-right">
        <el-form :inline="true">
          <el-form-item>
            <el-input placeholder="请输入设备名称" v-model="queryDeviceValue"></el-input>
            <el-input type="text" style="display:none" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryByDeviceName">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="table-scroll park-table-scroll">
          <el-table :data="tableData5" @selection-change="handleCurrentChangeDevice" border max-height = "500" style="width:100%">
            <el-table-column type="selection" width="60px" :selectable="selectable"></el-table-column>
            <el-table-column type="index" label="序号" width="80px"></el-table-column>
            <!-- <el-table-column prop="deviceID" :show-overflow-tooltip="true" label="设备编号" width="150px"></el-table-column> -->
            <el-table-column prop="deviceName" :show-overflow-tooltip="true" label="设备名"  width="180px">
            </el-table-column>
            <el-table-column prop="deviceModel" :show-overflow-tooltip="true" label="型号"  width="100px">
            </el-table-column>
            <el-table-column prop="deviceIP" :show-overflow-tooltip="true" label="设备IP"  width="180px">
            </el-table-column>
            <el-table-column prop="deviceStatus" label="绑定状态"  :formatter="modeDeviceStatusFormat">
            </el-table-column>
          </el-table>
          <el-col class="toolbar">
            <el-pagination @size-change="deviceSizeChange" @current-change="deviceFindPage" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </el-col>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="closeDeviceDialog">取 消</el-button>
            <el-button type="primary" @click="saveDevice()">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryParkList,
  addParking,
  deleteParking,
  editParking,
  queryChannelByParkCode,
  addChannel,
  editChannel,
  deleteChannel,
  queryDeviceByChannelId,
  // queryAllDevice,
  bindDevice,
  unbindDevice,
  getTempRules,
  queryFee,
  getOrgInfo,
  queryDeviceByOrgId,
  parkingIsExist,
  channelIsExist,
  getParkOrgInfoByOrgId,
  getParkOrgToJudgeBind
} from '@/views/ParkingLotApp/apis'
export default {
  data () {
    var checkAge = (rule, value, callback) => {
      let reg = /^[0-9]*$/
      if (!reg.test(value) || value < 1) {
        callback(new Error('请输入大于0数字值'))
      } else if (value > 9999) {
        callback(new Error('请输入小于10000数字值'))
      } else {
        callback()
      }
    }
    var checkMonthAndTemp = (rule, value, callback) => {
      let reg = /^[0-9]*$/
      if (!reg.test(value) || value < 0) {
        callback(new Error('请输入不小于0数字值'))
      } else if (value > 9999) {
        callback(new Error('请输入小于10000数字值'))
      } else {
        callback()
      }
    }
    var isExist = (rule, value, callback) => { // 检测车场是否存在
      let name = rule.field + '@' + value
      name = encodeURI(name)
      parkingIsExist(name).then(function (response) {
        let errorcode = response.code
        if (errorcode === '0') {
          if (response.data.isExist) {
            callback(new Error('该车场已存在!'))
          } else {
            callback()
          }
        }
      })
    }
    var isExistCode = (rule, value, callback) => { // 检测车场编号是否存在
      let name = rule.field + '@' + value
      name = encodeURI(name)
      parkingIsExist(name).then(function (response) {
        let errorcode = response.code
        if (errorcode === '0') {
          if (response.data.isExist) {
            callback(new Error('该车场编号已存在!'))
          } else {
            callback()
          }
        }
      })
    }
    var isEditExist = (rule, value, callback) => {
      if (this.originalParkName === this.parkInfo.parkingName) {
        callback()
      }
      let name = rule.field + '@' + encodeURI(value)
      name = encodeURI(name)
      parkingIsExist(name).then(function (response) {
        let errorcode = response.code
        if (errorcode === '0') {
          if (response.data.isExist) {
            callback(new Error('该车场已存在!'))
          } else {
            callback()
          }
        }
      })
    }
    var validIsExist = (rule, value, callback) => {
      value = encodeURI(value)
      if (this.originalchannel === this.channelInfo.name) {
        callback()
      }
      channelIsExist(value).then(function (response) {
        let errorcode = response.code
        if (errorcode === '0') {
          if (response.data.isExist) {
            callback(new Error('该通道已存在!'))
          } else {
            callback()
          }
        }
      })
    }
    var checkSpecificKey = (rule, value, callback) => {
      let reg = new RegExp("[`·~!@#$%+^&*\\-_()=|{}'/\\\\:;'\"\",\\[\\].<>/?！#￥……&*（）——【】‘’；：”“。，、？]")
      if (reg.test(value)) {
        // 请勿输入特殊字符
        callback(new Error('请勿输入特殊字符'))
      } else {
        callback()
      }
    }
    var isChecked = (rule, value, callback) => {
      let patrn = /^[0-9a-zA-Z]+$/
      if (patrn.test(value)) {
        callback()
      } else {
        callback(new Error('车场编号只能是字母、数字'))
      }
    }
    // 新增车场验证车位数
    var validatorAddParkseat = (rule, value, callback) => {
      let total = Number(this.parkInitInfo.total)
      let tempNum = Number(this.parkInitInfo.tempNum)
      let monthNum = Number(this.parkInitInfo.monthNum)
      if (total < tempNum + monthNum) {
        callback(new Error('总车位数应大于或等于临停车位数加上月保车位数之和'))
      } else {
        callback()
      }
    }
    // 修改车场验证车位数
    var validatorEditParkseat = (rule, value, callback) => {
      let total = Number(this.parkInfo.total)
      let tempNum = Number(this.parkInfo.tempNum)
      let monthNum = Number(this.parkInfo.monthNum)
      if (total < tempNum + monthNum) {
        callback(new Error('总车位数应大于或等于临停车位数加上月保车位数之和'))
      } else {
        callback()
      }
    }
    return {
      bindParkCode: '',
      validateNum: true,
      bindOrgId: '',
      defaultOrgId: '',
      queryDeviceValue: '',
      orgIds: [],
      tableData: [],
      tableData3: [],
      tableData4: [],
      tableData5: [],
      ruleData: [],
      ruleDataInfo: [],
      chargeData: [],
      chargeDataInfo: [],
      orgData: [],
      selectChannel: '',
      selectbind: [],
      selections: '',
      noData: true,
      parentsCode: '',
      originalchannel: '',
      dialogVisible: false,
      ChanneldialogVisible: false,
      devicedialogVisible: false,
      innerVisible: false,
      chargeVisible: false,
      orgVisible: false,
      isRule: false,
      activeName2: 'first',
      dialogTitle: '新增车位',
      dialogState: 'add',
      selectName: 'rule',
      innerTitle: '选择规则',
      originalParkName: '',
      ruleName: '',
      ruleDiscription: '',
      id: '',
      direct: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      orgType: '',
      channelId: '',
      validateValue: 'false',
      parkInfo: {
        id: '',
        parkingName: '',
        parkingCode: '',
        total: '',
        feeRuleId: '',
        feeRuleName: '',
        parentParkingCode: '',
        remark: '',
        parkRuleId: '',
        parkRuleName: '',
        parkOrgName: '',
        parkOrgId: '',
        tempNum: '',
        monthNum: ''
      },
      parkInitInfo: {
        parkingName: '',
        parkingCode: '',
        total: '',
        feeRuleId: '',
        feeRuleName: '',
        parentParkingCode: '',
        remark: '',
        parkRuleId: '',
        parkRuleName: '',
        id: '',
        parkOrgName: '',
        parkOrgId: '',
        tempNum: '',
        monthNum: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入通道名称', trigger: 'blur' },
          { min: 1, max: 64, message: '长度最大为64个字符', trigger: 'blur' },
          { validator: validIsExist, trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择通道类型', trigger: 'blur' }],
        direct: [{ required: true, message: '请选择通道方向', trigger: 'blur' }]
      },
      editParkRule: {
        parkingName: [
          { required: true, message: '请输入车场名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度最大为50个字符', trigger: 'blur' },
          { validator: checkSpecificKey, trigger: 'blur' },
          { validator: isEditExist, trigger: 'blur' }
        ],
        total: [
          { required: true, message: '请输入车位数', trigger: 'blur' },
          { validator: checkAge, trigger: 'blur' },
          { validator: validatorEditParkseat, trigger: 'blur' }
        ],
        tempNum: [
          { required: true, message: '请输入车位数', trigger: 'blur' },
          { validator: checkMonthAndTemp, trigger: 'blur' }
        ],
        monthNum: [
          { required: true, message: '请输入车位数', trigger: 'blur' },
          { validator: checkMonthAndTemp, trigger: 'blur' }
        ],
        parkRuleName: [
          { required: true, message: '请选择临停规则', trigger: 'change' }
        ],
        parkOrgName: [
          { required: true, message: '请选择组织', trigger: 'change' }
        ],
        remark: [
          { max: 256, message: '最多可输入256个字符', trigger: 'change' }
        ]
      },
      addParkRule: {
        parkingName: [
          { required: true, message: '请输入车场名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度最大为50个字符', trigger: 'blur' },
          { validator: checkSpecificKey, trigger: 'blur' },
          { validator: isExist, trigger: 'blur' }
        ],
        parkingCode: [
          { required: true, message: '请输入车场编号', trigger: 'blur' },
          { min: 1, max: 50, message: '长度最大为50个字符', trigger: 'blur' },
          { validator: isChecked, trigger: 'blur' },
          { validator: isExistCode, trigger: 'blur' }
        ],
        total: [
          { required: true, message: '请输入车位数', trigger: 'blur' },
          { validator: checkAge, trigger: 'blur' },
          { validator: validatorAddParkseat, trigger: 'blur' }
        ],
        tempNum: [
          { required: true, message: '请输入车位数', trigger: 'blur' },
          { validator: checkMonthAndTemp, trigger: 'blur' }
        ],
        monthNum: [
          { required: true, message: '请输入车位数', trigger: 'blur' },
          { validator: checkMonthAndTemp, trigger: 'blur' }
        ],
        parkRuleName: [
          { required: true, message: '请选择临停规则', trigger: 'change' }
        ],
        parkOrgName: [
          { required: true, message: '请选择组织', trigger: 'change' }
        ],
        remark: [
          { max: 256, message: '最多可输入256个字符', trigger: 'change' }
        ]
      },
      channelInfo: {
        id: '',
        name: '',
        // type: '',
        direct: '',
        ip: ''
      },
      channelDirectOpt: [
        {
          value: 0,
          label: '入'
        },
        {
          value: 1,
          label: '出'
        }
      ],
      // channelTypeOpt: [
      //   {
      //     value: 0,
      //     label: '车'
      //   },
      //   {
      //     value: 1,
      //     label: '人'
      //   }
      // ],
      deviceInfo: {
        deviceName: '',
        deviceModel: '',
        deviceIP: '',
        deviceCode: '',
        direct: '',
        parentDeviceCode: '',
        deviceStatus: ''
      },
      defaultProps: {
        children: 'subParkingLots',
        label: 'parkingName'
      },
      orgTreeProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  mounted () {
    this.loadData()
    this.getOrgInfo()
  },
  methods: {
    getOrgByOrgId (orgId) {
      let _this = this
      getParkOrgInfoByOrgId(orgId)
        .then(function (response) {
          let errorcode = response.code
          console.log('errorcode ' + errorcode)
          if (errorcode === '0') {
            if (response.data.isParkOrg) {
              _this.orgVisible = false
            } else {
              _this.$message({
                message: '请选择车场组织',
                type: 'warning'
              })
            }
          } else {
            _this.$message.error(response.data.errormsg)
          }
        })
        .catch(function (error) {
          console.log(error)
        }
      )
    },
    handleNodeClick (data) {
      this.id = data.id
      this.parentsCode = data.parkingCode
      this.parkInfo.parkingName = data.parkingName
      this.parkInfo.parkingCode = data.parkingCode
      this.parkInfo.total = data.total
      this.parkInfo.tempNum = data.tempNum
      this.parkInfo.monthNum = data.monthNum
      this.parkInfo.feeRuleId = data.feeRuleId
      this.parkInfo.feeRuleName = data.feeRuleName
      this.parkInfo.remark = data.remark
      this.parkInfo.parkRuleId = data.parkRuleId
      this.parkInfo.parentParkingCode = data.parentParkingCode
      this.parkInfo.parkRuleName = data.parkRuleName
      this.parkInfo.parkOrgName = data.parkOrgName
      this.parkInfo.parkOrgId = data.parkOrgId
      this.originalParkName = data.parkingName
      this.queryChannel(data.parkingCode)
    },
    orgHandleNodeClick (data) {
      this.selectOrgData = data
    },
    deviceSizeChange (val) {
      this.pageSize = val
      // this.carSeatList(this.currentPage, this.pageSize, this.defaultId)
      this.getDeviceByOrgId(this.currentPage, this.pageSize, this.defaultOrgId)
    },
    deviceFindPage (val) {
      this.currentPage = val
      // this.carSeatList(this.currentPage, this.pageSize, this.defaultId)
      this.getDeviceByOrgId(this.currentPage, this.pageSize, this.defaultOrgId)
    },
    queryByDeviceName () {
      let _this = this
      let key = _this.queryDeviceValue
      key = encodeURI(key)
      queryDeviceByOrgId(_this.currentPage, _this.pageSize, _this.defaultOrgId, key, '').then(function (response) {
        if (response.code === '0' && response.data.rows !== null) {
          _this.tableData5 = response.data.rows
          _this.total = response.data.total
        } else {
          _this.tableData5 = []
        }
      })
    },
    queryChannel (parkCode) {
      var _this = this
      _this.bindParkCode = parkCode
      queryChannelByParkCode(parkCode).then(function (response) {
        if (response.code >= 0) {
          _this.tableData3 = response.data
          if (response.data.length === 0) {
            _this.tableData3 = []
            _this.tableData4 = []
            _this.selectChannel = ''
          } else {
            _this.channelInfo.name = response.data.name
            // _this.channelInfo.type = response.data.type
            _this.channelInfo.ip = response.data.ip
            _this.channelInfo.direct = response.data.direct
            console.log('通道id:' + response.data.uuid)
            _this.checkDeviceByChannelId(response.data[0].uuid)
          }
        }
      })
    },
    handleClick (tab) {
      var _this = this
      var parkCode = _this.parkInfo.parkingCode
      if (tab.index === '1') {
        queryChannelByParkCode(parkCode).then(function (response) {
          if (response.code >= 0) {
            _this.tableData3 = response.data
            _this.channelInfo.name = response.data.name
            // _this.channelInfo.type = response.data.type
            _this.channelInfo.ip = response.data.ip
            _this.channelInfo.direct = response.data.direct
            _this.checkDeviceByChannelId(response.data[0].uuid)
            // console.log('data' + JSON.stringify(_this.tableData3))
          } else {
            // _this.channelInfo.type = ''
            _this.selectChannel = ''
            _this.channelInfo.ip = ''
            _this.channelInfo.direct = ''
            _this.channelInfo.name = ''
          }
        })
      }
    },
    // modeTyFormat (row, column) {
    //   var type = row.type
    //   if (type === 0) {
    //     return '车'
    //   } else if (type === 1) {
    //     return '人'
    //   }
    //   return '车'
    // },
    modeDirFormat (row, column) {
      var direct = row.direct
      if (direct === 0) {
        return '入口'
      } else if (direct === 1) {
        return '出口'
      }
      return '入口'
    },
    modeDeviceStatusFormat (row, column) {
      let state = row.deviceStatus
      if (state === true) {
        return '已绑定'
      } else if (state === false) {
        return '未绑定'
      }
      return '未绑定'
    },
    selectable (row, index) {
      return !row.deviceStatus
    },
    handleCurrentChange (val) {
      let _this = this
      console.log('val' + JSON.stringify(val))
      if (val !== null) {
        _this.selectChannel = val
        _this.channelId = val.uuid
        _this.direct = val.direct
        queryDeviceByChannelId(val.uuid).then(function (response) {
          if (response.data.length > 0) {
            _this.tableData4 = response.data
            _this.deviceInfo.deviceName = response.data.deviceName
            _this.deviceInfo.deviceModel = response.data.deviceModel
            _this.deviceInfo.direct = _this.direct
            _this.deviceInfo.deviceIP = response.data.deviceIp
            console.log('data' + JSON.stringify(_this.tableData3))
          } else {
            _this.tableData4 = []
          }
        })
      }
    },
    deviceHandleCurrentChange (val) {
      this.selections = val
    },
    checkDeviceByChannelId (channelId) {
      var _this = this
      if (channelId !== null) {
        queryDeviceByChannelId(channelId).then(function (response) {
          if (response.data.length > 0) {
            _this.tableData4 = response.data
            _this.deviceInfo.deviceName = response.data.deviceName
            _this.deviceInfo.deviceModel = response.data.deviceModel
            _this.deviceInfo.direct = _this.direct
            _this.deviceInfo.deviceIP = response.data.deviceIp
            console.log('data' + JSON.stringify(_this.tableData3))
          } else {
            _this.tableData4 = []
          }
          _this.devicedialogVisible = false
        })
      }
    },
    closeDeviceDialog () {
      this.queryDeviceValue = ''
      this.devicedialogVisible = false
    },
    unbindDeviceHandle () {
      var _this = this
      let ids = []
      if (this.selections) {
        if (this.selections.length) {
          for (let i = 0; i < this.selections.length; i++) {
            ids.push(this.selections[i].id)
          }
        } else {
          ids.push(this.selections.id)
        }
        _this.$confirm('是否要解绑此设备信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          unbindDevice(ids)
            .then(function (response) {
              if (response.code === '0') {
                _this.$alert('解绑成功', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    _this.checkDeviceByChannelId(_this.channelId)
                  }
                })
              } else {
                _this.$alert('解绑失败', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {}
                })
              }
            })
            .catch(() => {})
        })
        .catch(() => {})
      } else {
        this.$message('请先选择需要解绑的设备')
      }
    },
    resetChecked () {
      this.$refs.tree.setCheckedKeys([])
    },
    loadData () {
      var _this = this
      this.loading2 = true
      queryParkList()
        .then(
          function (response) {
            if (response.code === '0' && response.data.length > 0) {
              _this.noData = true
              _this.tableData = response.data
              _this.id = response.data[0].id
              _this.parkInfo.parkingName = response.data[0].parkingName
              _this.parkInfo.parkingCode = response.data[0].parkingCode
              _this.parkInfo.total = response.data[0].total
              _this.parkInfo.tempNum = response.data[0].tempNum
              _this.parkInfo.monthNum = response.data[0].monthNum
              _this.parkInfo.feeRuleId = response.data[0].feeRuleId
              _this.parkInfo.feeRuleName = response.data[0].feeRuleName
              _this.parkInfo.remark = response.data[0].remark
              _this.parkInfo.parkRuleId = response.data[0].parkRuleId
              _this.parkInfo.parkRuleName = response.data[0].parkRuleName
              _this.parentsCode = response.data[0].parkingCode
              _this.parkInfo.parkOrgName = response.data[0].parkOrgName
              _this.parkInfo.parkOrgId = response.data[0].parkOrgId
              _this.equipmentGroup = response.data
              _this.originalParkName = response.data[0].parkingName
              _this.bindParkCode = response.data[0].parkingCode
            } else {
              _this.$message.error(response.data.errormsg)
              _this.noData = true
            }
          }
        )
        .catch(
          function (error) {
            this.loading2 = false
            console.log(error)
          }.bind(this)
        )
      _this.queryChannel(_this.parkInfo.parkingCode)
    },
    // 新增按钮
    addParking () {
      this.dialogTitle = '新增车场'
      this.parkInitInfo.id = ''
      this.parkInitInfo.parkingName = ''
      this.parkInitInfo.parkingCode = ''
      this.parkInitInfo.total = ''
      this.parkInitInfo.tempNum = ''
      this.parkInitInfo.monthNum = ''
      this.parkInitInfo.feeRuleId = ''
      this.parkInitInfo.feeRuleName = ''
      this.parkInitInfo.remark = ''
      this.parkInitInfo.parentParkingCode = this.parentsCode
      this.parkInitInfo.parkRuleId = ''
      this.parkInitInfo.parkRuleName = ''
      this.parkInitInfo.parkOrgName = ''
      this.parkInitInfo.parkOrgId = ''
      this.dialogVisible = true
      this.bindParkCode = ''
    },
    // 新增按钮
    addChannelClik () {
      this.dialogState = 'add'
      this.dialogTitle = '新建通道'
      this.channelInfo = {}
      this.ChanneldialogVisible = true
    },
    editChannelClik (index, rows) {
      this.dialogState = 'edit'
      this.dialogTitle = '修改通道'
      this.channelInfo.name = rows.name
      this.channelInfo.id = rows.uuid
      // this.channelInfo.type = rows.type
      this.channelInfo.direct = rows.direct
      this.channelInfo.ip = rows.ip
      console.log(rows)
      this.originalchannel = rows.name
      this.ChanneldialogVisible = true
    },
    handleCurrentChangeDevice (val) {
      this.selectbind = val
    },
    bindDeviceHandle () {
      console.log(this.selectChannel)
      if (this.selectChannel === '' || this.selectChannel === null) {
        this.$message.error('请选择通道')
      } else {
        this.dialogTitle = '绑定设备'
        let tmp = this.orgData
        this.orgData = []
        setTimeout(() => { this.orgData = tmp }, 200)
        this.devicedialogVisible = true
        if (this.orgData[0]) {
          this.defaultOrgId = this.orgData[0].uuid
        } else {
          this.defaultOrgId = ''
        }
        this.currentPage = 1
        this.pageSize = 10
        this.getDeviceByOrgId(this.currentPage, this.pageSize, this.defaultOrgId)
      }
    },
    saveDevice () {
      let _this = this
      let channelId = this.channelId
      let paramsArr = []
      if (_this.selectbind.length > 0) {
        for (let selectDev of _this.selectbind) {
          let params_ = {
            channelId: _this.channelId,
            deviceCode: selectDev.deviceID,
            deviceType: selectDev.deviceTypeCode,
            direct: _this.selectChannel.direct,
            parentDeviceCode: selectDev.parentDeviceID,
            deviceName: selectDev.deviceName
          }
          console.log('selectDev----' + JSON.stringify(selectDev))
          paramsArr.push(params_)
        }
        bindDevice({
          params: JSON.stringify(paramsArr)
        }).then(function (response) {
          if (response.code === '0') {
            _this.$message({
              message: '保存成功！',
              type: 'success'
            })
            // _this.open3()
            _this.checkDeviceByChannelId(channelId)
          } else if (response.code === '-2') {
            _this.$message({
              message: '同类型主设备只能绑定一个！',
              type: 'warning'
            })
          } else {
            // _this.open6()
            _this.$message({
              message: '绑定设备失败！',
              type: 'fail'
            })
          }
          // _this.queryDeviceValue = ''
          // _this.devicedialogVisible = false
          _this.closeDeviceDialog()
        })
      } else {
        this.$message.error('请选择设备')
      }
    },
    // 修改保存按钮
    saveDate () {
      var _this = this
      let vValue = _this.validateNum
      // _this.bindParkCode = _this.parkInfo.parkingCode
      var params_ = {
        parkingName: _this.parkInfo.parkingName,
        parkingCode: _this.parkInfo.parkingCode,
        total: _this.parkInfo.total,
        tempNum: _this.parkInfo.tempNum,
        monthNum: _this.parkInfo.monthNum,
        feeRuleId: _this.parkInfo.feeRuleId,
        feeRuleName: _this.parkInfo.feeRuleName,
        remark: _this.parkInfo.remark,
        parentParkingCode: _this.parkInfo.parentParkingCode,
        parkRuleId: _this.parkInfo.parkRuleId,
        parkRuleName: _this.parkInfo.parkRuleName,
        id: this.id,
        parkOrgId: this.parkInfo.parkOrgId,
        parkOrgName: this.parkInfo.parkOrgName
      }
      _this.$refs.parkInfo.validate(valid => {
        if (valid && vValue) {
          editParking({
            params: JSON.stringify(params_)
          }).then(function (response) {
            if (response.code === '0') {
              _this.$message({
                message: '保存成功！',
                type: 'success'
              })
              queryParkList()
              .then(
              function (response) {
                _this.tableData = response.data
              })
            } else {
              _this.$message({
                message: '修改车场失败！',
                type: 'fail'
              })
            }
            _this.dialogVisible = false
          })
        }
      })
    },
    openRule () { // 选择规则
      var _this = this
      _this.isRule = true
      _this.selectName = 'rule'
      _this.innerVisible = true
      getTempRules(_this.currentPage, _this.pageSize, '')
        .then(function (response) {
          var code = response.code
          if (code === '0') {
            if (_this.ruleData.length === 0) {
              _this.ruleData = response.data
              // for (let i = 0; i < response.data.rows.length; i++) {
              //   if (response.data.rows[i].monthCar === 0) {
                  // _this.ruleData.push(response.data.rows[i])
              //   }
              // }
            }
            // _this.ruleData = response.data.rows
          } else {
            _this.ruleData = []
          }
        })
        .catch(() => {})
    },
    cleanData () {
      this.parkInitInfo.parentParkingCode = ''
    },
    openCharge () { // 选择计费
      var _this = this
      _this.isCharge = true
      _this.selectName = 'charge'
      _this.chargeVisible = true
      queryFee()
        .then(function (response) {
          if (response.data.length > 0) {
            _this.chargeData = response.data
          } else {
            _this.chargeData = []
          }
        })
        .catch(() => {})
    },
    openOrg () { // 选择组织
      let _this = this
      _this.innerTitle = '选择组织'
      _this.selectName = 'org'
      _this.orgVisible = true
    },
    getOrgInfo () {
      let _this = this
      getOrgInfo()
        .then(function (response) {
          if (response.code === '0') {
            _this.orgData.push(response.data)
          } else {
            _this.orgData = []
          }
        })
        .catch(() => {})
    },
    selectRule () {
      var _this = this
      if (this.dialogVisible) {
        _this.parkInitInfo.parkRuleId = this.ruleDataInfo.id
        _this.parkInitInfo.parkRuleName = this.ruleDataInfo.ruleName
      } else {
        _this.parkInfo.parkRuleId = this.ruleDataInfo.id
        _this.parkInfo.parkRuleName = this.ruleDataInfo.ruleName
      }
      _this.innerVisible = false
    },
    selectOrg () {
      var _this = this
      _this.bindOrgId = _this.selectOrgData.uuid
      // var bindParkCode = _this.parkInfo.parkingCode
      _this.selectOrgIsBind(_this.bindParkCode)
      // if (_this.selectOrgData.orgType === '8') {
      //   if (this.dialogVisible) {
      //     _this.parkInitInfo.parkOrgId = _this.selectOrgData.uuid
      //     _this.parkInitInfo.parkOrgName = _this.selectOrgData.name
      //   } else {
      //     _this.parkInfo.parkOrgId = _this.selectOrgData.uuid
      //     _this.parkInfo.parkOrgName = _this.selectOrgData.name
      //   }
      //   _this.orgVisible = false
      // } else {
      //   _this.$message({
      //     message: '请选择车场组织',
      //     type: 'warning'
      //   })
      // }
    },
    selectOrgIsBind (bindParkCode) {
      let _this = this
      getParkOrgToJudgeBind(_this.bindOrgId, bindParkCode)
        .then(function (response) {
          let errorcode = response.code
          console.log('errorcode ' + errorcode)
          if (errorcode === '0') {
            if (response.data.isBind) {
              _this.$message({
                message: '该车场组织已绑定车场，请重新选择',
                type: 'warning'
              })
            } else {
              if (_this.selectOrgData.orgType === '8') {
                if (_this.dialogVisible) {
                  _this.parkInitInfo.parkOrgId = _this.selectOrgData.uuid
                  _this.parkInitInfo.parkOrgName = _this.selectOrgData.name
                } else {
                  _this.parkInfo.parkOrgId = _this.selectOrgData.uuid
                  _this.parkInfo.parkOrgName = _this.selectOrgData.name
                }
                _this.orgVisible = false
              } else {
                _this.$message({
                  message: '请选择车场组织',
                  type: 'warning'
                })
              }
            }
          } else {
            this.$message.error(response.data.errormsg)
          }
        })
        .catch(function (error) {
          console.log(error)
        }
      )
    },
    selectCharge () {
      var _this = this
      if (this.dialogVisible) {
        _this.parkInitInfo.feeRuleId = this.chargeDataInfo.uuid
        _this.parkInitInfo.feeRuleName = this.chargeDataInfo.ruleName
      } else {
        _this.parkInfo.feeRuleId = this.chargeDataInfo.uuid
        _this.parkInfo.feeRuleName = this.chargeDataInfo.ruleName
      }
      _this.chargeVisible = false
    },
    ruleHandleCurrentChange (val) {
      this.ruleDataInfo = val
      this.innerTitle = '选择规则'
      console.log(val)
    },
    chargeHandleCurrentChange (val) {
      this.chargeDataInfo = val
      this.innerTitle = '选择计费'
      console.log(val)
    },
    // 删除
    handleDelete () {
      var _this = this
      var parkId = _this.id
      var parkIds = []
      parkIds.push(parkId)
      _this
        .$confirm('是否要删除此车场信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          deleteParking(parkIds)
            .then(function (response) {
              var errorcode = response.code
              if (errorcode === '0') {
                _this.$alert('删除成功', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    _this.loadData()
                  }
                })
              } else if (errorcode === 'parkinglot.parkinglot.channel.plate.number.repeate') {
                _this.$alert('车场已绑定通道，删除失败', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {}
                })
              } else {
                _this.$alert('删除失败', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {}
                })
              }
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    delChannelClik (index, rows) {
      var _this = this
      _this.$confirm('此操作将永久删除该通道, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteChannel(rows.uuid)
            .then(function (response) {
              var errorcode = response.code
              if (errorcode === '0') {
                _this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                _this.queryChannel(_this.parkInfo.parkingCode)
              } else if (errorcode === 'parkinglot.channel.plate.number.repeate') {
                _this.$alert('通道已绑定设备，删除失败', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {}
                })
              } else {
                _this.$alert('删除失败', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {}
                })
              }
            })
            .catch(() => {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 保存新增车场信息
    savePark () {
      var _this = this
      let vValue = _this.validateNum
      var params_ = {
        parkingName: _this.parkInitInfo.parkingName,
        parkingCode: _this.parkInitInfo.parkingCode,
        total: _this.parkInitInfo.total,
        tempNum: _this.parkInitInfo.tempNum,
        monthNum: _this.parkInitInfo.monthNum,
        feeRuleId: _this.parkInitInfo.feeRuleId,
        feeRuleName: _this.parkInitInfo.feeRuleName,
        remark: _this.parkInitInfo.remark,
        parentParkingCode: _this.parkInitInfo.parentParkingCode,
        parkRuleId: _this.parkInitInfo.parkRuleId,
        parkRuleName: _this.parkInitInfo.parkRuleName,
        id: _this.parkInitInfo.id,
        parkOrgId: _this.parkInitInfo.parkOrgId,
        parkOrgName: _this.parkInitInfo.parkOrgName
      }
      _this.$refs.parkInitInfo.validate(valid => {
        if (valid && vValue) {
          addParking({
            params: JSON.stringify(params_)
          }).then(function (response) {
            _this.$refs['parkInitInfo'].resetFields()
            if (response.code === '0') {
              _this.$message({
                message: '保存成功！',
                type: 'success'
              })
              _this.loadData()
            } else {
              _this.$message({
                message: '新增失败！',
                type: 'fail'
              })
            }
            _this.dialogVisible = false
          })
        }
      })
    },

    // 保存新增通道信息
    saveChannel () {
      var _this = this
      var params_ = {
        channelName: _this.channelInfo.name,
        channelDirect: _this.channelInfo.direct,
        // channelType: _this.channelInfo.type,
        ip: _this.channelInfo.ip,
        parkCode: _this.parkInfo.parkingCode,
        id: _this.channelInfo.uuid
      }
      var editParams_ = {
        id: _this.channelInfo.id,
        channelName: _this.channelInfo.name,
        channelDirect: _this.channelInfo.direct,
        // channelType: _this.channelInfo.type,
        ip: _this.channelInfo.ip,
        parkCode: _this.parkInfo.parkingCode
      }
      if (_this.dialogState === 'add') {
        _this.$refs.channelInfo.validate(valid => {
          if (valid) {
            addChannel({
              params: JSON.stringify(params_)
            }).then(function (response) {
              if (response.code === '0') {
                _this.$message({
                  message: '保存成功！',
                  type: 'success'
                })
                _this.queryChannel(_this.parkInfo.parkingCode)
              }
              _this.ChanneldialogVisible = false
            })
          }
        })
      } else if (_this.dialogState === 'edit') {
        editChannel({
          params: JSON.stringify(editParams_)
        })
          .then(function (response) {
            if (response.code === '0') {
              _this.$message({
                message: '修改成功！',
                type: 'success'
              })
              _this.queryChannel(_this.parkInfo.parkingCode)
              _this.ChanneldialogVisible = false
            } else {
              _this.$message({
                message: '修改通道失败！',
                type: 'fail'
              })
            }
          })
          .catch(function () {})
      }
    },
    open3 () {
      this.$notify({
        title: '成功',
        message: '操作成功',
        type: 'success'
      })
    },
    open6 () {
      this.$notify.error({
        title: '错误',
        message: '操作失败'
      })
    },
    orgDeviceNodeClick (data) {
      this.getDeviceByOrgId(this.currentPage, this.pageSize, data.uuid)
      this.defaultOrgId = data.uuid
    },
    getDeviceByOrgId (currentPage, pageSize, orgId) {
      let _this = this
      let key = _this.queryDeviceValue
      queryDeviceByOrgId(_this.currentPage, _this.pageSize, orgId, key, '').then(function (response) {
        if (response.code === '0' && response.data.rows !== null) {
          _this.tableData5 = response.data.rows
          _this.deviceInfo.deviceName = response.data.deviceName
          _this.deviceInfo.deviceModel = response.data.deviceModel
          _this.deviceInfo.deviceIP = response.data.deviceIP
          _this.deviceInfo.deviceCode = response.data.deviceID
          _this.deviceInfo.parentDeviceCode = response.data.parentDeviceID
          _this.deviceInfo.deviceStatus = response.data.deviceStatus
          console.log()
          _this.total = response.data.total
        } else {
          _this.tableData5 = []
        }
      })
    },
    closeDialog (done) {
      done()
      this.$refs['parkInitInfo'].resetFields()
    },
    closeChannelDialog (done) {
      done()
      this.$refs['channelInfo'].resetFields()
    },
    cannelDialog (parkInitInfo) {
      this.$refs[parkInitInfo].resetFields()
      this.dialogVisible = false
    },
    cannelChannelDialog (channelInfo) {
      this.$refs[channelInfo].resetFields()
      this.ChanneldialogVisible = false
    },
    nameUp () {
      this.channelInfo.ip = this.channelInfo.ip.toUpperCase()
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/views/ParkingLotApp/assets/css/parkLotApp.less";
  .el-form{
      margin-top: 15px;
  }
  .el-icon-search{
  font-size: 28px;
  cursor: pointer;
}
  .el-icon-refresh{
  font-size: 28px;
  cursor: pointer;
}
.tree-left{
  display: inline-block;
  vertical-align: top;
  width: 24%;
  height: 500px;
  overflow: auto;  
}
.tree-dialog{
  width: 500px;
  height: auto; 
}
.table-right{
  display: inline-block;
  vertical-align: top;
  width: 68%;
}
#park{
  height: 100%;
}
.device-dialog > div{
  width: 60%;
}
.chnnel-msg{
  overflow: hidden;
}
</style>
<style lang="less">
.park-table-scroll{
  .el-table{
    .el-table__header{
      width:auto!important;
    }
  }
}
</style>

