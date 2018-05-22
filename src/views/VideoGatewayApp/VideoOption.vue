<template>
  <el-form ref="optionForm" :model="videoOption" :rules="validRules" label-width="160px">
    <el-form-item label="抓图路径配置:"></el-form-item>
    <el-form-item label="保存路径:" prop="capturePath">
      <el-input v-model="videoOption.capturePath" placeholder="请输入保存路径" :maxlength="64"></el-input>
    </el-form-item>
    <el-form-item label="播放配置:"></el-form-item>
    <el-form-item label="异常提前播放时间(s):" prop="exceptionEventPrePlayTime">
      <el-input v-model="videoOption.exceptionEventPrePlayTime" placeholder="请输入5-9999的整数,单位为秒" :maxlength="4"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSetData">设置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getVideoOptionData, postVideoOptionData } from '@/views/VideoGatewayApp/apis/videoOption.js'
export default {
  name: 'videoOption',
  data () {
    return {
      videoOption: {
        'capturePath': '',
        'exceptionEventPrePlayTime': ''
      },
      // 验证规则
      validRules: {
        capturePath: [
          { required: true, message: '请输入抓图保存路径', trigger: 'blur' },
          { validator: this.pathFormat, trigger: 'blur' }
        ],
        exceptionEventPrePlayTime: [
          { required: true, message: '请输入异常提前播放时间', trigger: 'blur' },
          { validator: this.prePlayTimeTip, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    // 页面初始化，数据加载
    loadData (data) {
      getVideoOptionData(data).then(
        (result) => {
          result.exceptionEventPrePlayTime = parseInt(result.exceptionEventPrePlayTime)
          this.videoOption = result
        }
      ).catch(() => {
        return false
      })
    },
    // 视频参数设置
    onSetData () {
      this.$refs['optionForm'].validate(
        (valid) => {
          if (valid) {
            postVideoOptionData(this.videoOption).then(
              result => {
                this.$message({ type: 'success', message: '配置成功!' })
              }
            ).catch(() => {
              return false
            })
          }
        }
      )
    },
    // 异常时间格式验证
    prePlayTimeTip (rule, value, callback) {
      let reg = /^[1-9]\d*$/
      if (!reg.test(value) || value < 5) {
        return callback(new Error('请输入5-9999的整数!'))
      } else {
        callback()
      }
    },
    // 路径格式验证
    pathFormat (rule, value, callback) {
      let reg = /^[cC]:\\/
      if (!reg.test(value)) {
        return callback(new Error('保存路径必须在C盘！格式如C:\\XX'))
      } else {
        callback()
      }
    }
  }
}
</script>