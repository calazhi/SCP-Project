<template>
  <el-dialog title="自定义信息" :visible="show" width="571px" center @close="closeEvent">
    <div>
      <el-form :label-position="labelPosition" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="选择素材类型">
          <el-select class="item-width" v-model="materialValue" @change="changeValue">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.type">{{item.label}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择素材" prop="chooseMaterial">
          <el-select class="item-width" v-model="ruleForm.chooseMaterial" @change="changeValueName" placeholder="选择素材">
            <el-option v-for="item in options" :key="item.type" :label="item.mediaName" :value="item.mediaName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="typeShow===0" label="字体大小" prop="fontSize">
          <el-input class="item-width" v-model.number="ruleForm.fontSize" auto-complete="off" placeholder="字体大小必须在30-400的范围内" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item v-if="typeShow===0" label="滚动方向" prop="direction">
          <el-select class="item-width" v-model="ruleForm.direction" placeholder="请选择滚动方向" auto-complete="off">
            <el-option label="左" value="left"></el-option>
            <el-option label="右" value="right"></el-option>
            <el-option label="上" value="up"></el-option>
            <!-- <el-option label="down" value="down"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item v-if="typeShow===0" label="滚动速度" prop="speed">
          <el-input class="item-width" v-model.number="ruleForm.speed" auto-complete="off" placeholder="滚动速度必须在1-9范围内" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item v-if="typeShow===4" label="翻页时间/秒" prop="turnPages">
          <el-input class="item-width" v-model.number="ruleForm.turnPages" auto-complete="off" placeholder="翻页时间必须在15-60范围内" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item class="item-footer">
          <el-button style="margin-right:20px" type="primary" @click="onSubmitForm('ruleForm')">确定</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import { postMaterialsData, getItemMessageData } from '../apis/index'
export default {
  name: 'material',
  props: {
    show: {
      type: Boolean,
      required: true,
      default () {
        return false
      }
    },
    senSonMessage: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      realTypeShow: '',
      realChildWords: '',
      returnAllData: {},
      labelPosition: 'left',
      Materialname: '',
      options: [],
      value8: '',
      loading: false,
      ruleForm: {
        fontSize: '',
        direction: '',
        chooseMaterial: '',
        speed: '',
        turnPages: ''
      },
      rules: {
        fontSize: [
          { required: true, validator: this.checkfontsize, trigger: 'blur' }
        ],
        direction: [
          { required: true, validator: this.validateDirection, trigger: 'change' }
        ],
        chooseMaterial: [
          { required: true, validator: this.validatematerial, trigger: 'change' }
        ],
        turnPages: [
          { required: true, validator: this.validatepageTime, trigger: 'blur' }
        ],
        speed: [
          { required: true, validator: this.validatespeed, trigger: 'blur' }
        ]
      },
      typeShow: 0,
      materialNo: '',
      pageData: {
        pageSize: 10,
        pageNo: 1,
        total: 100
      },
      typeOptions: [{
        value: '选项1',
        label: '文本',
        type: 0
      }, {
        value: '选项2',
        label: '图片',
        type: 1
      }, {
        value: '选项3',
        label: '音频',
        type: 2
      }, {
        value: '选项4',
        label: '视频',
        type: 3
      }, {
        value: '选项5',
        label: 'pdf',
        type: 4
      }],
      materialValue: 0
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.returnAllData = this.senSonMessage
        if (this.returnAllData.sonId) {
          this.getSonIdMessage()
        } else {
          this.cusMaterial()
        }
      }
    }
  },
  methods: {
    // 生成下拉素材菜单
    cusMaterial () {
      let param = {
        type: this.typeShow,
        pageNo: 1,
        pageSize: 200,
        mediaName: ''
      }
      postMaterialsData(param).then(rs => {
        if (rs.data.code === '00000') {
          if (rs.data.data.data && rs.data.data.data.length) {
            this.options = rs.data.data.data
          } else {
            this.options = []
          }
        } else {
          this.options = []
          this.$message({
            showClose: true,
            message: '数据加载失败',
            type: 'error'
          })
        }
      }).catch(() => {
      })
    },
    // 根据id获取节目信息
    getSonIdMessage () {
      getItemMessageData({ id: this.returnAllData.sonId }).then(res => {
        if (res.data.code === '00000') {
          res.data.data.page.windowsList.forEach(element => {
            if (element.id === this.returnAllData.typeId) {
              this.materialValue = parseInt(element.type)
              this.typeShow = parseInt(element.type)
              this.realTypeShow = parseInt(element.type)
              this.ruleForm.fontSize = element.fontSize
              this.realChildWords = element.childWords
              this.ruleForm.chooseMaterial = element.childWords
              this.ruleForm.direction = element.scrollDirection
              this.ruleForm.speed = element.scrolSpeed
              this.ruleForm.turnPages = element.pageTime
              this.Materialname = element.childWords
              this.materialNo = element.materialNo
            }
          })
          this.cusMaterial()
        } else {
          this.$message({
            showClose: true,
            message: '数据加载失败',
            type: 'error'
          })
        }
      }).catch(() => {
      })
    },
    // 提交按钮
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.typeShow === 0) {
            this.ruleForm.turnPages = ''
          } else if (this.typeShow === 4) {
            this.ruleForm.fontSize = ''
            this.ruleForm.direction = ''
            this.ruleForm.speed = ''
          } else {
            this.ruleForm.turnPages = ''
            this.ruleForm.fontSize = ''
            this.ruleForm.direction = ''
            this.ruleForm.speed = ''
          }
          let newarry = {
            'materialNo': this.materialNo,
            'type': this.typeShow,
            'fontSize': this.ruleForm.fontSize,
            'scrollDirection': this.ruleForm.direction,
            'scrolSpeed': this.ruleForm.speed,
            'pageTime': this.ruleForm.turnPages
          }
          this.$emit('showdioalogmessage', newarry)
          let messagedata = this.Materialname
          this.$emit('showmessage', messagedata)
          this.resetForm('ruleForm')
        } else {
          return false
        }
      })
    },
    // 重置按钮
    resetForm (formName) {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.fontSize = ''
      this.ruleForm.direction = ''
      this.ruleForm.chooseMaterial = ''
      this.ruleForm.speed = ''
      this.ruleForm.turnPages = ''
    },
    // 选择添加信息类型(文本、图片、音频、视频、pdf)
    changeValue (value) {
      if (this.returnAllData.sonId && this.realTypeShow === value) {
        this.ruleForm.chooseMaterial = this.realChildWords
      } else {
        this.ruleForm.chooseMaterial = ''
      }
      this.typeShow = value
      this.cusMaterial()
    },
    // 选择下拉素材
    changeValueName (value) {
      let obj = {}
      obj = this.options.find((item) => {
        return item.mediaName === value
      })
      this.materialNo = obj.id // 素材id
      this.Materialname = obj.mediaName
    },
    //  关闭当前弹窗按钮
    closeEvent () {
      this.$emit('closeDialog2')
      this.resetForm('ruleForm')
    },
    // 字体大小
    checkfontsize (rule, value, callback) {
      if (value === '') {
        return callback(new Error('字体大小不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value >= 30 && value <= 400) {
            callback()
          } else {
            callback(new Error('字体大小必须在30-400的范围内'))
          }
        }
      }, 100)
    },
    // 滚动方向
    validateDirection (rule, value, callback) {
      if (!value) {
        return callback(new Error('请选择滚动方向'))
      } else {
        callback()
      }
    },
    // 选择素材
    validatematerial (rule, value, callback) {
      if (!value) {
        return callback(new Error('请选择素材'))
      } else {
        callback()
      }
    },
    // 滚动速度
    validatespeed (rule, value, callback) {
      if (value === '') {
        return callback(new Error('请输入滚动速度'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value < 1 || value > 9) {
            callback(new Error('滚动速度必须在1-9范围内'))
          } else {
            callback()
          }
        }
      }, 100)
    },
    // 翻页时间
    validatepageTime (rule, value, callback) {
      if (value === '') {
        return callback(new Error('请输入翻页时间'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value >= 15 && value <= 60) {
            callback()
          } else {
            callback(new Error('翻页时间必须在15-60范围内'))
          }
        }
      }, 100)
    }
  }
}
</script>
<style lang="less" scoped>
.item-width {
  width: 300px;
}
.item-footer {
  text-align: center;
  margin-left: -100px;
}
.custom-select {
  margin-bottom: 15px;
}
</style>
