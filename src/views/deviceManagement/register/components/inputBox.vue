<template>
  <div class="item-container">
    <span class="sub-title">{{title}}<span v-show="required" style="color:red">*</span>：</span>
    <el-input v-model.trim="input"
              class="devicemgmInput"
              :placeholder="(placeholder)? placeholder :'请输入内容'"
              :disabled=disabled
              :maxlength=maxlength
              :clearable="!disabled"
              :type="type"
              @blur="callbackInput">
      <template v-if="append" slot="append">{{append}}</template>
    </el-input>
  </div>
</template>
<script>
  export default {
    props: {
      title: {
        type: String
      },
      value: {
        type: String
      },
      code: {
        type: String
      },
      disabled: {
        type: Boolean
      },
      type: {
        type: String
      },
      maxlength: {
        type: Number
      },
      append: {
        type: String
      },
      required: {
        type: Boolean
      },
      placeholder: {
        type: String
      }
    },
    data () {
      return {
        input: this.value
      }
    },
    watch: {
//      input () {
//        var data = {}
//        data[this.code] = this.input
//        this.$emit('listenToInput', data)
//      },
      value (curVal, oldVal) {
        if (curVal) {
          this.input = curVal
        } else {
          this.input = ''
        }
      }
    },
    methods: {
      callbackInput () {
        this.checkNo(this.input)
        var data = {}
        data[this.code] = this.input
        this.$emit('listenToInput', data)
      },
      clearBox () {
        this.input = ''
      },
      checkNo (value) {
        if (this.type === 'num') {
          var reg = /^[0-9]*[1-9][0-9]*$/
          if (!reg.test(value)) {
            this.input = ''
            this.$message.error('仅能输入数字')
          }
        }
      }
    }
  }
</script>

