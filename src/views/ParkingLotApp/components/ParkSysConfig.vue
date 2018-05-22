<template>
  <section>
    <el-form ref="sysForm" :model="sysForm" :rules="configRuls" label-width="240px" v-if="sysFormData.length > 0">
      <el-form-item :label="sysFormData[0].configName" prop="monthTip">
        <el-input v-model="sysForm.monthTip" class="configInput"></el-input>天
      </el-form-item>
      <el-form-item :label="sysFormData[1].configName" prop="pay">
        <el-input v-model="sysForm.pay" class="configInput"></el-input>小时
      </el-form-item>
      <el-form-item :label="sysFormData[2].configName" prop="monthTemp">
        <el-input v-model="sysForm.monthTemp" class="configInput"></el-input>分钟
      </el-form-item>
      <el-form-item :label="sysFormData[3].configName" prop="advert">
        <el-input type="textarea" v-model="sysForm.advert" class="advetText" :rows="6" placeholder="不超过24个字符"></el-input>
      </el-form-item>
      <el-form-item class="save-btn">
        <el-button type="primary" @click="saveSetSys" v-show="sysFormData.length > 0 ">保存</el-button>
      </el-form-item>
    </el-form>
    <div v-else>暂无配置数据</div>
  </section>
</template>
<script>
import { getSysSet, updateConfig } from '@/views/ParkingLotApp/apis'
export default {
  data () {
    var checkAge = (rule, value, callback) => {
      let reg = /^([1-9]\d{0,2}|1000)$/
      if (!reg.test(value)) {
        callback(new Error('配置项必须为大于0或小于等于1000的整数'))
      } else {
        callback()
      }
    }
    return {
      sysForm: {
        monthTip: '',
        monthTemp: '',
        pay: '',
        advert: ''
      },
      sysFormData: [],
      configValid: true,
      configRuls: {
        monthTip: [
          { required: true, message: '配置项不能为空' },
          {validator: checkAge, trigger: 'blur'}
        ],
        monthTemp: [
          { required: true, message: '配置项不能为空' },
          {validator: checkAge, trigger: 'blur'}
        ],
        pay: [
          { required: true, message: '配置项不能为空' },
          {validator: checkAge, trigger: 'blur'}
        ],
        advert: [
          { required: true, message: '配置项不能为空' },
          { max: 24, message: '最多可输入24个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getSysSet()
  },
  methods: {
    getSysSet () {
      let _this = this
      getSysSet()
      .then(function (response) {
        _this.sysFormData = response.data
        _this.sysForm.monthTip = Number(_this.sysFormData[0].configPar1)
        _this.sysForm.pay = Number(_this.sysFormData[1].configPar1)
        _this.sysForm.monthTemp = Number(_this.sysFormData[2].configPar1)
        _this.sysForm.advert = _this.sysFormData[3].configPar1
      })
    },
    saveSetSys () {
      let _this = this
      _this.sysFormData[0].configPar1 = _this.sysForm.monthTip
      _this.sysFormData[1].configPar1 = _this.sysForm.pay
      _this.sysFormData[2].configPar1 = _this.sysForm.monthTemp
      _this.sysFormData[3].configPar1 = _this.sysForm.advert
      let params = _this.sysFormData
      // for (let i = 0; i < _this.sysFormData.length; i++) {
      //   params.push({
      //     'configType': _this.sysFormData[i].configType,
      //     'configName': _this.sysFormData[i].configName,
      //     'configPar1': _this.sysFormData[i].configPar1
      //   })
      // }
      _this.$refs.sysForm.validate((valid) => {
        if (valid) {
          updateConfig(params)
          .then(function (response) {
            if (response.code === '0') {
              _this.$message({
                message: '保存成功！',
                type: 'success'
              })
              _this.getSysSet()
            } else {
              _this.$notify.error({
                title: '错误',
                message: '保存失败'
              })
            }
            _this.getSysSet()
          })
        }
      })
    },
    checkConfig (index) {
      let val = this.sysFormData[index].configPar1
      if (val !== '' && this.checkAge.test(val)) {
        this.configValid = true
      } else {
        this.configValid = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.save-btn{
  text-align: center;
  padding-right: 300px;
  margin-top: 200px;
}
.configInput{
  width:80px;
  margin-right:20px;
}
.config-cont{
  width: 240px; 
  float:none;
  display:inline-block; 
  text-align:right;
  em{
    color: #f56c6c;
    display: inline-block;
    vertical-align: -3px;
    margin-right: 10px;
  }
}
.errorValid{
  border: 1px solid #f56c6c;
  border-radius: 4px;
}
.config-span{
  color: #f56c6c;
  position: absolute;
  left: 245px;
  top: 34px;
}
.advetText{
  width:500px;
  vertical-align: top;
}
</style>

