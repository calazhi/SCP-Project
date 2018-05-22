<template>
	<div id="car">
    <section class="from-btns">
			<el-button type="primary" @click="addCar(0)">新增</el-button>
      <el-button type="primary" @click="addCar(1)">新增特殊车</el-button>
			<el-button type="danger" @click="handleDelete">批量删除</el-button>
      <el-button type="primary" @click="carUpload">导入</el-button>
      <upload title="车辆导入" action="/scp-parkinglotapp/carMgmt/uploadCars" downloadUrl="/scp-parkinglotapp/file/downloadTemplateFile?template=car" tips="请选择EXCEL文件！" @search="research" ref='carUpload'></upload>
			<el-button type="primary" v-if="queryType==1" @click="toChangeType(0)">转普通车</el-button>
			<el-button type="primary" v-if="queryType==0" @click="toChangeType(1)">转特殊车</el-button>
		</section>
		<div>
      <el-form :inline="true">
        <!-- <span class="label-text">车辆类型</span> -->
        <el-form-item label="车辆类型">
          <el-select v-model="queryType" placeholder="车辆类型" class="seletInput" @change="typeChange">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input placeholder="请输入车牌号" v-model="queryCarNum" @blur="blurInput"></el-input>
        </el-form-item>
        <el-form-item label="人员姓名">
          <el-input placeholder="请输入人员姓名" v-model="queryOwner" @blur="blurInput"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryByNum">查询</el-button>
        </el-form-item>
      </el-form>
		</div>
    <!-- 表格渲染 -->
    <div class="fix-table-bar">
      <el-table border :fit="true" :data="tableData" ref="tableData" max-height="680" @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="carNum" label="车牌号"></el-table-column>
        <el-table-column prop="carBrand" label="车辆品牌" :formatter="carBrandFormat"></el-table-column>
        <el-table-column prop="carColor" label="车身颜色" :formatter="carColorFormat"></el-table-column>
        <el-table-column prop="carNumColor" label="车牌颜色" :formatter="carNumColorFormat"></el-table-column>
        <el-table-column prop="carMode" label="车型" :formatter="carModeFormat"></el-table-column>
        <el-table-column prop="type" label="车辆类型" :formatter="typeFormat"></el-table-column>
        <el-table-column prop="ownerName" label="人员姓名"></el-table-column>
        <el-table-column prop="ownerHouseNum" label="房屋号" min-width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="beginTime" label="特殊车生效时间" width="160"></el-table-column>
        <el-table-column prop="endTime" label="特殊车失效时间" width="160"></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button  size="mini" type="primary" @click="handleEdit(scope.$index,scope.row)">修改</el-button>
            <el-button  size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
		<el-col class="toolbar">
			<el-pagination @size-change="handleSizeChange" @current-change="findPage" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-col>
    <!-- 新增 修改 弹出框 -->
		<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="closeDialog">
			<el-form :model="carInfo" :rules="rules" ref="carInfo" label-width="120px" class="deptInfo-ruleForm">
				<el-form-item label="车牌号" prop="carNum">
					<el-input type="text" v-model="carInfo.carNum" auto-complete="off" @change="carNoUp" :disabled="editCar" style="width:218px;"></el-input>
				</el-form-item>
				<el-form-item label="车辆品牌" prop="carBrand">
					<el-select v-model="carInfo.carBrand" placeholder="请选择" :disabled="false">
						<el-option
              v-for="item in carBrandOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="车身颜色" prop="carColor">
					<el-select v-model="carInfo.carColor" placeholder="请选择" :disabled="false">
						<el-option
					      v-for="item in carColorOpt"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="车牌颜色" prop="carNumColor">
					<el-select v-model="carInfo.carNumColor" placeholder="请选择" :disabled="false">
						<el-option
					      v-for="item in carNumColorOpt"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="人员姓名" prop="ownerName">
					<el-input type="text" v-model="carInfo.ownerName" auto-complete="off" :disabled="true" style="width:218px;"></el-input>
          <i class="el-icon-search" @click="choiseOwner"></i>
				</el-form-item>
				<el-form-item label="房屋号" prop="ownerHouseNum">
          <el-tooltip class="item" effect="dark" v-if="carInfo.ownerHouseNum && carInfo.ownerHouseNum.length > 15" :content="carInfo.ownerHouseNum" placement="top">
					  <el-input type="text" v-model="carInfo.ownerHouseNum" auto-complete="off" :disabled="true" style="width:218px;"></el-input>
          </el-tooltip>
          <el-input type="text" v-else v-model="carInfo.ownerHouseNum" auto-complete="off" :disabled="true" style="width:218px;"></el-input>
				</el-form-item>
				<el-form-item label="车型" prop="carMode">
					<el-select v-model="carInfo.carMode" placeholder="请选择" :disabled="false">
						<el-option
              v-for="item in carModeOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value">
					  </el-option>
					</el-select>
				</el-form-item>
        <el-form-item  v-if="toAddCarType==1" label="特殊车生效时间" prop="beginTime">
          <div class="block">
            <el-date-picker
              v-model="carInfo.beginTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options = "pickerOptStart"
              @change = "changeTime(0)"
              >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item v-if="toAddCarType==1" label="特殊车失效时间" prop="endTime">
          <div class="block">
            <el-date-picker
              v-model="carInfo.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change = "changeTime(1)"
              :picker-options = "pickerOptEnd"
              >
            </el-date-picker>
          </div>
        </el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" placeholder="不超过256个字符" :rows= 4 
          v-model="carInfo.remark" auto-complete="off" :disabled="false"></el-input>
				</el-form-item>
        <div class="upload-carImg">
            <div class="photoPic">
            <img :src="carImg">
          </div>
          <el-dialog :visible.sync="addCarVisible" width="900px" append-to-body @close='cancelUpload'>
            <div slot="title">
              <span>更换车辆图片</span>
            </div>
            <el-row>
              <el-col :span="18">
                <div class="preview">
                  <img style="max-width:412px;max-height:412px" :src="previewCarImg" ref="previewCarImg" id='drawing'>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="loadPic">
                  <el-button type="primary" @click="uploadFacePic">浏览...</el-button>
                  <input @change="readFacePic" class="uploadPicInput" ref="uploadFacePicInput" type="file" accept="img/jpg,image/jpeg,image/png,image/gif,image/bmp">
                  <p>限制5M以内jpg,jpeg,png,gif,bmp</p>
                </div>                
              </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelUpload">取 消</el-button>
              <el-button type="primary" @click="saveUpload">确 定</el-button>
            </div>
          </el-dialog>
          <div class="car-pic-operation">
            <el-button type="primary" @click="addPhoto" size="mini">本地上传</el-button>
            <el-button type="danger" @click="cleanCarPic" size="mini">清空图片</el-button>
          </div>
        </div>
				<el-form-item class="toolbar">
            <el-button @click="cancleDialog('carInfo')">取 消</el-button>
            <el-button type="primary" @click="saveCar">保 存</el-button>
			  </el-form-item>
			</el-form>
		</el-dialog>
    <!-- 转特殊车弹出框 -->
    <el-dialog :visible.sync="carTypeChangeDialog" width="36%" :title="carTypeChangeDialogTitle">
      <el-form :model="carTypeChageForm" :rules="rules" ref="carTypeChageForm" label-width="120px" class="deptInfo-ruleForm">
        <el-form-item  v-if="queryType==0" label="特殊车生效时间" prop="beginTime">
          <div class="block">
            <el-date-picker
              v-model="carTypeChageForm.beginTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options = "pickerOptStart"
              @change = "changeTime(2)"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item v-if="queryType==0" label="特殊车失效时间" prop="endTime">
          <div class="block">
            <el-date-picker
              v-model="carTypeChageForm.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options = "pickerOptEnd"
              @change = "changeTime(3)"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="typeChangeRemark">
					<el-input type="textarea" placeholder="不超过256个字符" 
          v-model="carTypeChageForm.typeChangeRemark" auto-complete="off" :disabled="false"></el-input>
				</el-form-item>
        <el-form-item style="text-align:center;">
          <el-button @click = "changeType" type="primary">保 存</el-button>
          <el-button @click="carTypeChangeDialog = false">取 消</el-button>  
			  </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 选择人员弹出框 start -->
    <el-dialog :title="ownerTitle" :visible.sync="ownerDialog" :before-close="closeOwnerDialog">
      <owner ref="selectOwner"></owner>
      <div class="toolbar">
        <el-button @click="closeOwnerDialog">取 消</el-button>
        <el-button type="primary" @click="ownerData">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 选择人员弹出框 end -->
	</div>
</template>

<script>
import owner from '@/views/ParkingLotApp/components/dialogs/Owner'
import Upload from './Upload'
import {
  listcars,
  addCar,
  deleteCarById,
  carDictData,
  editCar,
  carTypeChange,
  carIsExist
} from '@/views/ParkingLotApp/apis'
import defaultPicture from '@/views/ParkingLotApp/assets/images/defaultPicture.png'
export default {
  data () {
    var isExist = (rule, value, callback) => { // 检测车牌号是否存在
      if (this.editCar) {
        callback()
      }
      value = encodeURI(value)
      carIsExist(value).then(function (response) {
        let errorcode = response.code
        if (errorcode === '0') {
          if (response.data.isExist) {
            callback(new Error('该车牌号已存在!'))
          } else {
            callback()
          }
        }
      })
    }
    var checkCarNum = (rule, value, callback) => {
      let express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-HJ-NP-Z]{1}[A-HJ-NP-Z]{1}[A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
      if (!express.test(value)) {
        callback(new Error('请输入正确的车牌号!'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      selections: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      // listLoading: false,
      username: null,
      dialogVisible: false,
      ownerDialog: false,
      editCar: false,
      timeType: 'add',
      dialogTitle: '新增车辆',
      ownerTitle: '选择人员',
      carNum: '',
      queryCarNum: '',
      queryOwner: '',
      // ownerId: '',
      queryType: '-1',
      toAddCarType: '',
      formInline: {
        carNum: '',
        ownerName: ''
      },
      carInfo: {
        id: '',
        carNum: '',
        carBrand: '',
        carColor: '',
        carNumColor: '',
        ownerId: '',
        ownerName: '',
        ownerHouseNum: '',
        carMode: '0',
        beginTime: '',
        endTime: '',
        pictureUrl: '',
        fastdfsHttpAddress: '',
        remark: ''
      },
      options: [
        {
          value: '-1',
          label: '全部'
        },
        {
          value: '0',
          label: '普通车'
        },
        {
          value: '1',
          label: '特殊车'
        }
      ],
      carBrandOpt: [],
      carColorOpt: [],
      carNumColorOpt: [],
      carModeOpt: [],
      rules: {
        carNum: [
          { required: true, message: '请输入车牌号码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
          { validator: checkCarNum, trigger: 'blur' },
          { validator: isExist, trigger: 'blur' }
        ],
        beginTime: [
          { required: true, message: '请输入特殊车生效时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请输入特殊车失效时间', trigger: 'blur' }
        ],
        typeChangeRemark: [
          { required: true, message: '请输入备注', trigger: 'blur' },
          { max: 256, message: '最多可输入256个字符', trigger: 'change' }
        ],
        remark: [
          { max: 256, message: '最多可输入256个字符', trigger: 'change' }
        ]
      },
      carTypeChangeDialog: false,
      carTypeChangeDialogTitle: '',
      carTypeChageForm: {
        beginTime: '',
        endTime: '',
        typeChangeRemark: ''
      },
      toType: 0,
      carImg: defaultPicture,
      addCarVisible: false,
      previewCarImg: '',
      fileName: '',
      addCarImgFlag: 0, // 新增车辆图片标记，
      pickerOptStart: {
        disabledDate: (time) => {
          let valueTime
          if (this.timeType === 'add') {
            valueTime = this.carInfo.endTime
          } else {
            valueTime = this.carTypeChageForm.endTime
          }
          if (this.carTypeChageForm.endTime !== '' && valueTime !== null) {
            return time.getTime() < Date.now() || time.getTime() < valueTime
          } else {
            return time.getTime() < Date.now()
          }
          // return time.getTime() < Date.now() - 8.64e7
        }
      },
      pickerOptEnd: {
        disabledDate: (time) => {
          let valueTime
          if (this.timeType === 'add') {
            valueTime = this.carInfo.beginTime
          } else {
            valueTime = this.carTypeChageForm.beginTime
          }
          return time.getTime() < new Date(valueTime).getTime() || time.getTime() < Date.now()
        }
      }
    }
  },
  components: {
    Upload,
    owner
  },
  mounted () {
    this.loadData(this.currentPage, this.pageSize, this.queryCarNum, this.queryType, this.queryOwner)
    this.getCarDictData()
  },
  methods: {
    // 加载数据
    loadData (currentPage, pageSize, carNum, type, ownerName) {
      let _this = this
      // _this.listLoading = true
      carNum = encodeURI(carNum.trim())
      ownerName = encodeURI(ownerName.trim())
      listcars(currentPage, pageSize, carNum, type, ownerName)
        .then(function (response) {
          let errorcode = response.code
          console.log('errorcode ' + errorcode)
          // _this.listLoading = false
          if (errorcode === '0') {
            _this.tableData = response.data.rows
            _this.total = response.data.total
          } else {
            _this.$message.error(response.data.errormsg)
          }
        })
        .catch(function (error) {
          // _this.listLoading = false
          console.log(error)
        }
      )
    },
    getCarDictData () { // 获取下拉框的基础数据
      let _this = this
      carDictData()
        .then(function (response) {
          let errorcode = response.code
          if (errorcode === '0') {
            _this.carBrandOpt = _this.formatString(
              response.data.CAR_BRAND_DICT
            )
            _this.carColorOpt = _this.formatString(
              response.data.CAR_CORLOR_DICT
            )
            _this.carNumColorOpt = _this.formatString(
              response.data.CAR_NUM_CORLOR_DICT
            )
            _this.carModeOpt = _this.formatString(response.data.CAR_MODE_DICT)
          } else {
            _this.$message.error(response.data.errormsg)
          }
        })
        .catch(() => {})
    },
    // 分页
    findPage (currentPage) {
      this.currentPage = currentPage
      this.loadData(this.currentPage, this.pageSize, this.queryCarNum, this.queryType, this.queryOwner)
    },
    // 车辆品牌格式化
    carBrandFormat: function (row, column) {
      var carBrand = row.carBrand
      var carBrandName = ''
      var carBrandOpt = this.carBrandOpt
      for (var i = 0; i < carBrandOpt.length; i++) {
        if (carBrand === carBrandOpt[i].value) {
          carBrandName = carBrandOpt[i].label
          break
        }
      }
      return carBrandName
    },
    // 车辆颜色格式化
    carColorFormat: function (row, column) {
      var carColor = row.carColor
      var carColorName = ''
      var carColorOpt = this.carColorOpt
      for (var i = 0; i < carColorOpt.length; i++) {
        if (carColor === carColorOpt[i].value) {
          carColorName = carColorOpt[i].label
          break
        }
      }
      return carColorName
    },
    // 车牌号颜色格式化
    carNumColorFormat: function (row, column) {
      var carNumColor = row.carNumColor
      var carNumColorName = ''
      var carNumColorOpt = this.carNumColorOpt
      for (var i = 0; i < carNumColorOpt.length; i++) {
        if (carNumColor === carNumColorOpt[i].value) {
          carNumColorName = carNumColorOpt[i].label
          break
        }
      }
      return carNumColorName
    },
    // 车牌号颜色格式化
    carModeFormat: function (row, column) {
      var carMode = row.carMode
      var carModeName = ''
      var carModeOpt = this.carModeOpt
      for (var i = 0; i < carModeOpt.length; i++) {
        if (carMode === carModeOpt[i].value) {
          carModeName = carModeOpt[i].label
          break
        }
      }
      return carModeName
    },
    // 特殊车辆格式化
    typeFormat: function (row, column) {
      let type = row.type
      if (type === 1) {
        return '特殊车'
      }
      return '普通车'
    },

    // 查询
    queryByNum () {
      this.loadData(this.currentPage, this.pageSize, this.queryCarNum, this.queryType, this.queryOwner)
    },
    typeChange () {  // 查询
      this.loadData(this.currentPage, this.pageSize, this.queryCarNum, this.queryType, this.queryOwner)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.loadData(this.currentPage, this.pageSize, this.queryCarNum, this.queryType, this.queryOwner)
    },
    getSelectData: function () {
      return this.selections
    },
    handleSelectionChange: function (val) {
      this.selections = val
    },
    toChangeType (toType) {
      let _this = this
      _this.timeType = 'change'
      _this.toType = toType
      let carIds = []
      for (let i = 0; i < _this.selections.length; i++) {
        carIds.push(_this.selections[i].id)
      }
      if (carIds.length < 1) {
        this.$message('请选择车辆')
        return false
      }
      if (toType === 1) {
        _this.carTypeChangeDialogTitle = '转特殊车'
      } else {
        _this.carTypeChangeDialogTitle = '转普通车'
      }
      _this.carTypeChageForm.beginTime = ''
      _this.carTypeChageForm.endTime = ''
      _this.carTypeChageForm.typeChangeRemark = ''
      _this.carTypeChangeDialog = true
    },
    // 新增按钮
    addCar (type) {
      let _this = this
      console.log(_this.carInfo)
      // _this.carInfo = {}
      _this.editCar = false
      _this.toAddCarType = type
      _this.carImg = defaultPicture
      _this.timeType = 'add'
      _this.dialogTitle = '新增车辆'
      _this.carInfo.id = ''
      _this.carInfo.carNum = ''
      _this.previewCarImg = ''
      _this.carInfo.id = ''
      _this.carInfo.ownerId = ''
      _this.carInfo.ownerName = ''
      _this.carInfo.carBrand = ''
      _this.carInfo.carNumColor = ''
      _this.carInfo.carColor = ''
      _this.carInfo.ownerHouseNum = ''
      _this.carInfo.beginTime = ''
      _this.carInfo.endTime = ''
      _this.carInfo.remark = ''
      _this.carInfo.carMode = '0'
      if (type === 1) {
        _this.dialogTitle = '新增特殊车辆'
      }
      // 新增车辆图片标记置空
      _this.addCarImgFlag = 0
      _this.dialogVisible = true
    },
    // 保存
    saveCar () {
      let _this = this
      _this.$refs.carInfo.validate(valid => {
        if (valid) {
          let fileName = ''
          let carImg = ''
          if (_this.addCarImgFlag === 1) {
            carImg = _this.previewCarImg
            fileName = _this.fileName
          }
          var params_ = {
            id: _this.carInfo.id,
            carNum: _this.carInfo.carNum,
            carBrand: _this.carInfo.carBrand,
            carColor: _this.carInfo.carColor,
            carNumColor: _this.carInfo.carNumColor,
            ownerId: _this.carInfo.ownerId,
            carMode: _this.carInfo.carMode,
            type: _this.toAddCarType,
            beginTime: _this.carInfo.beginTime,
            endTime: _this.carInfo.endTime,
            remark: _this.carInfo.remark,
            carImg: carImg,
            fileName: fileName,
            pictureUrl: _this.carInfo.pictureUrl,
            addCarImgFlag: _this.addCarImgFlag
          }
          if (_this.editCar) {
            editCar({
              params: JSON.stringify(params_)
            }).then(function (response) {
              let errorcode = response.code
              if (errorcode === '0') {
                // _this.listLoading = false
                _this.resetForm()
                _this.$message({
                  message: '保存成功！',
                  type: 'success'
                })
                _this.loadData(
                  _this.currentPage,
                  _this.pageSize,
                  _this.queryCarNum,
                  _this.queryType,
                  _this.queryOwner
                )
              }
              _this.dialogVisible = false
            })
          } else {
            console.info(11)
            addCar({
              params: JSON.stringify(params_)
            }).then(function (response) {
              let errorcode = response.code
              if (errorcode === '0') {
                _this.resetForm()
                _this.$message({
                  message: '保存成功！',
                  type: 'success'
                })
                _this.loadData(
                  _this.currentPage,
                  _this.pageSize,
                  _this.queryCarNum,
                  _this.queryType,
                  _this.queryOwner
                )
              }
              _this.dialogVisible = false
            })
          }
        }
      })
    },
    // 编辑
    handleEdit (index, row) {
      this.dialogTitle = '修改车辆'
      this.dialogVisible = true
      this.carInfo.carNum = row.carNum
      this.carInfo.carBrand = row.carBrand
      this.carInfo.carColor = row.carColor
      this.carInfo.carNumColor = row.carNumColor
      this.carInfo.ownerId = row.ownerId
      this.carInfo.ownerName = row.ownerName
      this.carInfo.ownerHouseNum = row.ownerHouseNum
      this.carInfo.carMode = row.carMode
      this.carInfo.remark = row.remark
      this.carInfo.pictureUrl = row.pictureUrl
      this.carInfo.id = row.id
      this.toAddCarType = row.type
      this.carInfo.beginTime = row.beginTime
      this.carInfo.endTime = row.endTime
      if (row.pictureUrl) {
        this.carImg = row.fastdfsHttpAddress + row.pictureUrl
        this.previewCarImg = row.fastdfsHttpAddress + row.pictureUrl
      } else {
        this.carImg = defaultPicture
        this.previewCarImg = ''
      }
      this.editCar = true
      // 新增车辆图片标记置空
      this.addCarImgFlag = 0
    },
    // 删除
    handleDelete (index, row) {
      let _this = this
      let carIds = []
      if (row) {
        carIds.push(row.id)
      } else {
        for (let i = 0; i < this.selections.length; i++) {
          carIds.push(this.selections[i].id)
        }
      }
      if (carIds.length < 1) {
        this.$message('请选择需要删除的车辆')
        return false
      }
      _this
        .$confirm('是否要删除此车辆信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          deleteCarById(carIds)
            .then(function (response) {
              var errorcode = response.code
              if (errorcode === '0') {
                _this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                _this.loadData(
                  _this.currentPage,
                  _this.pageSize,
                  _this.queryCarNum,
                  _this.queryType,
                  _this.queryOwner
                )
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
    choiseOwner () { // 人员选择
      this.ownerDialog = true
      if (this.$refs.selectOwner) {
        this.$refs.selectOwner.queryOwers()
        this.$refs.selectOwner.currentPage = 1
        this.$refs.selectOwner.sizes = 10
      }
      // console.log(this.$refs.selectOwner.queryOwers)
    },
    ownerData () { // 人员数据选择
      console.log(this.$refs.selectOwner.selectAuto)
      if (this.$refs.selectOwner.selectAuto) {
        this.carInfo.ownerName = this.$refs.selectOwner.selectAuto.ownerName
        this.carInfo.ownerHouseNum = this.$refs.selectOwner.selectAuto.ownerHouseNum
        this.carInfo.ownerId = this.$refs.selectOwner.selectAuto.ownerId
        this.$refs.selectOwner.queryValue = ''
        this.ownerDialog = false
      } else {
        this.$confirm('还未选择人员，确定关闭?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          this.$refs.selectOwner.queryValue = ''
          this.ownerDialog = false
        }).catch(() => {})
      }
    },
    formatString (dataString) {
      let keyArrs = []
      let valuArrs = []
      let dataArrObj = []
      for (let keyArr in dataString) {
        keyArrs.push('"' + keyArr + '"')
      }
      for (let valueArr in dataString) {
        valuArrs.push('"' + dataString[valueArr] + '"')
      }
      for (let i = 0; i < keyArrs.length; i++) {
        let arrObj = '{value:' + keyArrs[i] + ',label:' + valuArrs[i] + '}'
        dataArrObj.push(this.myEval(arrObj))
      }
      return dataArrObj
    },
    myEval (str) {
      let Fn = Function
      return new Fn('return ' + str)()
    },
    changeType () {
      let _this = this
      _this.$refs.carTypeChageForm.validate(valid => {
        if (valid) {
          let carIds = ''
          for (let i = 0; i < _this.selections.length; i++) {
            if (i < _this.selections.length - 1) {
              carIds += _this.selections[i].id + ','
            } else {
              carIds += _this.selections[i].id
            }
          }
          var params_ = {
            ids: carIds,
            type: _this.toType,
            beginTime: _this.carTypeChageForm.beginTime,
            endTime: _this.carTypeChageForm.endTime,
            remark: _this.carTypeChageForm.typeChangeRemark
          }
          carTypeChange({
            params: JSON.stringify(params_)
          }).then(function (response) {
            let errorcode = response.code
            if (errorcode === '0') {
              _this.$message({
                message: '车辆状态转换成功！',
                type: 'success'
              })
              _this.carTypeChangeDialog = false
              _this.loadData(
                  _this.currentPage,
                  _this.pageSize,
                  _this.queryCarNum,
                  _this.queryType,
                  _this.queryOwner
                )
            } else {
              _this.$message({
                message: '车辆状态转换失败！',
                type: 'fail'
              })
            }
          })
        }
      })
    },
    blurInput () {
      this.queryCarNum = this.queryCarNum.toUpperCase()
      this.queryOwner = this.queryOwner
    },
    carNoUp () {
      this.carInfo.carNum = this.carInfo.carNum.toUpperCase()
      console.log(this.carInfo.carNum)
    },
    // 导入
    carUpload: function () {
      this.$refs['carUpload'].openDialog()
    },
    // 导入成功刷新
    research: function () {
      this.loadData(this.currentPage, this.pageSize, this.queryCarNum, this.queryType, this.queryOwner)
    },
    addPhoto: function () {
      this.addCarVisible = true
      // this.previewCarImg = this.carImg
    },
    // 取消头像上传
    cancelUpload: function () {
      // 初始化input
      this.addCarVisible = false
      this.$refs.uploadFacePicInput.value = ''
    },
    // 触发file类型的input的默认事件
    uploadFacePic: function () {
      this.$refs.uploadFacePicInput.click()
    },
    // 读取上传图片的base64编码
    readFacePic: function () {
      const file = this.$refs.uploadFacePicInput.files[0]
      var fileName = file.name.toLowerCase().substring(file.name.lastIndexOf('.') + 1, file.name.length)
      if (fileName === 'jpg' || fileName === 'jpeg' || fileName === 'bpm' || fileName === 'gif' || fileName === 'png') {
        this.fileName = file.name
        // 只接收5M以内的图片
        if (file.size < 1024 * 5000) {
          const self = this
          var img = new Image()
          var reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function (e) {
            const base64Code = this.result
            self.previewCarImg = base64Code
            // 图片大于500k进行压缩
            if (file.size > 1024 * 500) {
              img.src = base64Code
              if (img.complete) {
                self.compress(img)
                img = null
              } else {
                img.onload = function () {
                  self.compress(img)
                  img = null
                }
              }
            }
          }
        } else {
          this.$message.error('请上传5M以内的图片')
          return false
        }
      } else {
        this.$message.error('文件格式错误、请上传图片')
        return false
      }
    },
    // 确认头像上传
    saveUpload: function () {
      this.addCarVisible = false
      this.carImg = this.previewCarImg
      // 确认上传图片
      this.addCarImgFlag = 1
    },
    // 删除上传图片，选择默认图片
    cleanCarPic: function () {
      this.previewCarImg = ''
      this.carImg = defaultPicture
      this.carInfo.pictureUrl = ''
      // 清空图片
      this.addCarImgFlag = 2
    },
    cancleDialog () {
      this.resetForm()
      this.dialogVisible = false
    },
    resetForm () {
      console.log(this.$refs)
      this.$refs.carInfo.resetFields()
    },
    closeDialog (done) {
      done()
      this.resetForm()
    },
    closeOwnerDialog () {
      this.$refs.selectOwner.queryValue = ''
      this.ownerDialog = false
    },
    changeTime (inputNo) {
      if (this.carInfo.beginTime && this.carInfo.endTime) {
        if (!this.compareTime(this.carInfo.beginTime, this.carInfo.endTime)) {
          if (inputNo === 0) {
            this.carInfo.beginTime = ''
          } else if (inputNo === 1) {
            this.carInfo.endTime = ''
          }
        }
      }
      if (this.carTypeChageForm.beginTime && this.carTypeChageForm.endTime) {
        if (!this.compareTime(this.carTypeChageForm.beginTime, this.carTypeChageForm.endTime)) {
          if (inputNo === 2) {
            this.carTypeChageForm.beginTime = ''
          } else if (inputNo === 3) {
            this.carTypeChageForm.endTime = ''
          }
        }
      }
    },
    compareTime (startTime, endTime) {
      let startTimes = startTime.substring(0, 10).split('-')
      let endTimes = endTime.substring(0, 10).split('-')
      startTime = startTimes[1] + '-' + startTimes[2] + '-' + startTimes[0] + ' ' + startTime.substring(10, 19)
      endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19)
      let thisResult = (Date.parse(endTime) - Date.parse(startTime)) / 3600 / 1000
      if (thisResult > 0) {
        return true
      } else {
        this.$message.error('特殊车失效时间必须大于特殊车生效时间')
        return false
      }
    },
    // 压缩图片
    compress (img) {
      // 用于压缩图片的canvas
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      // 瓦片canvas
      var tCanvas = document.createElement('canvas')
      var tctx = tCanvas.getContext('2d')
      var initSize = img.src.length
      var width = img.width
      var height = img.height
      // 如果图片大于五十万像素，计算压缩比并将大小压至50万以下
      var ratio
      if ((ratio = width * height / 500000) > 1) {
        ratio = Math.sqrt(ratio)
        width /= ratio
        height /= ratio
      } else {
        ratio = 1
      }
      canvas.width = width
      canvas.height = height
      // 铺底色
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // 如果图片像素大于50万则使用瓦片绘制
      var count
      if ((count = width * height / 500000) > 1) {
        count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
        // 计算每块瓦片的宽和高
        var nw = ~~(width / count)
        var nh = ~~(height / count)
        tCanvas.width = nw
        tCanvas.height = nh
        for (var i = 0; i < count; i++) {
          for (var j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height)
      }
      // 进行最小压缩
      var ndata = canvas.toDataURL('image/jpeg', 1.0)
      console.log('压缩前：' + initSize)
      console.log('压缩后：' + ndata.length)
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + '%')
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
      this.previewCarImg = ndata
      // return ndata
    }
  }
}
</script>
<style lang="less" scoped>
  @import "~@/views/ParkingLotApp/assets/css/parkLotApp.less";
.deptInfo-ruleForm{
  position: relative;
  .upload-carImg{
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    text-align: center;
    .img-cont{
      width: 300px;
      height: 180px;
      margin-bottom: 20px;
    }
  }
}
.photoPic{
  width:206px;
  height:206px;
  margin: 0 auto;
  border: 1px solid #ccc;
  overflow:hidden
}

.photoPic img{
  width:206px;
  height:206px
  }
/* 图片上传 */
.preview {
  width: 412px;
  height: 412px;
  border: 3px inset #dcdfe6;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.uploadPicInput {
  display: none;
}
.car-pic-operation,
.finger-pic-operation {
  display: flex;
  justify-content: center;
  align-items:center;
  padding-top: 20px;
}
</style>
