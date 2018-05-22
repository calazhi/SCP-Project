<template>
    <div class="phaseForm">
		<el-form label-width="130px" :model="addPhaseData" ref="addPhaseData" :rules="phaseRule" :inline-message='true' id="addFeePhaseId">
			<div class="form-middle">
				<el-form-item label="计费名称(按阶段)" prop="ruleName">
					<el-input v-model="addPhaseData.ruleName" :maxlength="50" style="width:500px" ></el-input>
				</el-form-item>
				<el-form-item label="计费描述">
					<el-input type="textarea" v-model="addPhaseData.memo" :rows="2" :maxlength="256" style="width:500px" ></el-input>
				</el-form-item>
				<table>
					<thead>
						<tr><td>车型</td><td>免费时间</td><td>全天最高收费</td></tr>
					</thead>
					<tbody>
            <tr v-for="(detail, index) in addPhaseData.detail" :key="detail.id">
              <td @click="checkCarType(index)" class="check-detail" v-text="carTypeText[index]"></td>
              <td>
							  <input type="text" v-model="detail.freeTime.time"
                  :class="{errorValid:!regTime.test(detail.freeTime.time)}"
                  @blur="regexpNum(detail.freeTime.time, index, 'time')"
                >分钟
							  <el-checkbox v-model="detail.freeTime.isContain">包含</el-checkbox>
              </td>
							<td>
                <input :class="{errorValid:!regPrice.test(detail.highestFee) || detail.highestFee > 1000}"
                @blur="regexpNum(detail.highestFee, index, 'price')"
								v-model="detail.highestFee" type="text" > 元
							  <el-checkbox v-model="detail.available">启用</el-checkbox>
              </td>
            </tr>
					</tbody>
				</table>
				<article v-show="addShowDetail">
					<p class="price-detail">价格明细（<span v-text="carText"></span>）</p>
					<div class="phase-price">
						<table v-for="(detail, index) in addPhaseData.detail" :key="detail.id" v-show="carTypeIndex == index">
							<tr>
								<td style="width:80px;">第一阶段</td>
								<td style="width:80px;">收费标准</td>
                <td style="width:280px;"><div class="table-div">
                  <input v-model="detail.phaseDto.firstPhaseDto.cash"
                    :class="{errorValid:!regPrice.test(detail.phaseDto.firstPhaseDto.cash) || detail.phaseDto.firstPhaseDto.cash > 1000}"
                    @blur="regexpNum(detail.phaseDto.firstPhaseDto.cash, index, 'price')"
                  />元/</div>
                  <input v-model="detail.phaseDto.firstPhaseDto.each"
                    :class="{errorValid:!regTime.test(detail.phaseDto.firstPhaseDto.each) || detail.phaseDto.firstPhaseDto.eachInput === false}"
                    @blur="regexpPhase(detail.phaseDto.firstPhaseDto.each, index, 'firstPhase', 'each')"
                    />分钟</td>
								<!-- <td class="text-left"><el-checkbox v-model="detail.phaseDto.firstPhaseDto.isCricle">循环</el-checkbox></td> -->
							</tr>		
              <tr>
								<td></td>
								<td></td>
                <td><div class="table-div">第一阶段周期</div>
                <input v-model="detail.phaseDto.firstPhaseDto.cycleTime"
                  :class="{errorValid:!regTime.test(detail.phaseDto.firstPhaseDto.cycleTime) ||
                  detail.phaseDto.firstPhaseDto.cycleInput === false || detail.phaseDto.firstPhaseDto.cycleTime > 1440}"
                  @blur="regexpPhase(detail.phaseDto.firstPhaseDto.cycleTime, index, 'firstPhase', 'cycle')"
                />分钟</td>
								<td ></td>
							</tr>						
              <tr>
								<td style="padding-top:30px;">第二阶段</td>
								<td style="padding-top:30px;">收费标准</td>
                <td style="padding-top:30px;"><div class="table-div">
                  <input v-model="detail.phaseDto.secondPhaseDto.cash"
                    @blur="regexpNum(detail.phaseDto.secondPhaseDto.cash, index, 'price')"
                    :class="{errorValid:!regPrice.test(detail.phaseDto.secondPhaseDto.cash) || detail.phaseDto.secondPhaseDto.cash > 1000}"
                  />元/</div>
                <input v-model="detail.phaseDto.secondPhaseDto.each" 
                  :class="{errorValid:!regTime.test(detail.phaseDto.secondPhaseDto.each) || detail.phaseDto.secondPhaseDto.each === false}"
                  @blur="regexpPhase(detail.phaseDto.secondPhaseDto.each, index, 'secondPhase', 'each')"/>分钟</td>
								<td ></td>
							</tr>		
              <tr>
								<td></td>
								<td></td>
                <!-- <td><div class="table-div">第二阶段周期</div>
                <input v-model="detail.phaseDto.secondPhaseDto.cycleTime" 
                  :class="{errorValid:!regTime.test(detail.phaseDto.secondPhaseDto.cycleTime) || detail.phaseDto.secondPhaseDto.cycleTime === false}"
                  @blur="regexpPhase(detail.phaseDto.secondPhaseDto.cycleTime, index, 'secondPhase', 'cycle')"
                />分钟</td> -->
								<td ></td>
							</tr>							
						</table>
					</div>
				</article>
			</div>
			<el-form-item style="text-align:right; padding:30px 0 0;">
				<el-button @click="channelDia">取 消</el-button>
				<el-button type="primary" @click="saveFee">保 存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import { addFee, feeIsExist } from '@/views/ParkingLotApp/apis'
export default {
  data () {
    var isExist = (rule, value, callback) => {
      value = encodeURI(value)
      feeIsExist(value).then(function (response) {
        let errorcode = response.code
        if (errorcode === '0') {
          if (response.data.isExist) {
            callback(new Error('该计费名称已存在!'))
          } else {
            callback()
          }
        }
      })
    }
    let queryValid = (rule, value, callback) => {
      let regexp = new RegExp("[`·~!@#$%+^&*\\-_()=|{}'/\\\\:;'\"\",\\[\\].<>/?！#￥……&*（）——【】‘’；：”“。，、？]")
      if (regexp.test(value)) {
        callback(new Error('不能输入特殊字符'))
      } else {
        callback()
      }
    }
    return {
      regPrice: /^((?!0[0-9])\d+(\.\d{1,2})?)$/,
      regTime: /^(0|[1-9][0-9]*)?[05]$/,
      carTypeIndex: 0,
      carTypeText: ['小车', '大车', '超大车', '摩托车'],
      carText: '小车',
      addShowDetail: true,
      phaseValid: true,
      phaseRule: {
        ruleName: [
          { required: true, message: '请输入计费名称', trigger: 'blur' },
          { max: 50, message: '最大长度为50字符', trigger: 'blur' },
          { validator: queryValid, trigger: 'blur' },
          { validator: isExist, trigger: 'blur' }
        ]
      }
    }
  },
  props: ['addPhaseData'],
  methods: {
    checkCarType (index) {
      this.carTypeIndex = index
      this.carText = this.carTypeText[index]
    },
    saveFee () {
      let errorCount = document.getElementById('addFeePhaseId').getElementsByClassName('errorValid').length
      console.log(errorCount)
      if (errorCount > 0) {
        this.$message({
          message: '时间或者价格输入格式不正确!',
          type: 'error'
        })
        return
      }
      let _this = this
      let params = _this.addPhaseData
      params.name = _this.addPhaseData.ruleName
      _this.$refs.addPhaseData.validate((valid) => {
        if (valid && this.phaseValid) {
          addFee({
            params: JSON.stringify(params)
          }).then(function (response) {
            let errorcode = response.code
            if (errorcode === '0') {
              _this.$message({message: '新增成功！', type: 'success'})
              // _this.loadFeeList()
              _this.$emit('closeDialog', 'save')
            } else {
              _this.$message.error({message: response.message || '验证不通过', type: 'error'})
            }
          })
          .catch(function (error) {
            _this.$emit('closeDialog', 'save')
            console.log('error ' + error)
            _this.$message.error({message: '验证不通过'})
          })
        }
      })
    },
    channelDia () {
      this.$emit('closeDialog', 'channel')
    },
    regexpNum (val, index, type) {
      if (type === 'time') {
        if (val === '') {
          this.$message.error({message: '时间不能为空'})
          this.phaseValid = false
        } else if (!this.regTime.test(val)) {
          this.$message.error({message: '时间格式为数字且为5的倍数'})
          this.phaseValid = false
        } else {
          this.phaseValid = true
        }
      } else if (type === 'price') {
        if (val === '') {
          this.$message.error({message: '收费不能为空'})
          this.phaseValid = false
        } else if (!this.regPrice.test(val)) {
          this.$message.error({message: '收费只能输入数字或者两位小数'})
          this.phaseValid = false
        } else if (val > 1000 || val < 0) {
          this.$message.error({message: '收费不能大于1000或者小于0'})
          this.editPhase = false
        } else {
          this.phaseValid = true
        }
      }
    },
    regexpPhase (val, index, phase, type) {
      // console.log(val + index + phase + type)
      if (val === '') {
        this.$message.error({message: '时间不能为空'})
        if (this.phaseValid) {
          this.phaseValid = false
        }
      } else if (val % 5 !== 0 || val > 1440) {
        this.$message.error({message: '计费时间不能大于1440分钟并且必须为5分钟倍数'})
        this.phaseValid = false
      } else if (!this.regTime.test(val)) {
        this.$message.error({message: '时间格式为数字且为5的倍数'})
        this.phaseValid = false
      } else {
        this.phaseValid = true
      }
      if (this.phaseValid) {
        if (phase === 'firstPhase') {
          let eachVal = this.addPhaseData.detail[index].phaseDto.firstPhaseDto.each
          let cycleVal = this.addPhaseData.detail[index].phaseDto.firstPhaseDto.cycleTime
          if (eachVal > 0 && cycleVal > 0) {
            if (cycleVal % eachVal !== 0) {
              this.$message.error({message: '周期时间应为收费标准时间的倍数'})
              if (this.phaseValid) {
                this.phaseValid = false
              }
            } else {
              if (this.phaseValid) {
                this.phaseValid = true
              }
            }
          }
          if (type === 'each' && val % 5 !== 0) {
            this.addPhaseData.detail[index].phaseDto.firstPhaseDto.eachInput = false
          } else {
            this.addPhaseData.detail[index].phaseDto.firstPhaseDto.eachInput = true
          }
          if (type === 'cycle' && val % 5 !== 0) {
            this.addPhaseData.detail[index].phaseDto.firstPhaseDto.cycleInput = false
          } else if (type === 'cycle' && val > 1440) {
            this.$message.error({message: '第一阶段周期不能超过1440分钟'})
          } else {
            this.addPhaseData.detail[index].phaseDto.firstPhaseDto.cycleInput = true
          }
        } else if (phase === 'secondPhase') {
          // let seachVal = this.addPhaseData.detail[index].phaseDto.secondPhaseDto.each
          // let scycleVal = this.addPhaseData.detail[index].phaseDto.secondPhaseDto.cycleTime
          // if (seachVal > 0 && scycleVal > 0) {
          //   if (scycleVal % seachVal !== 0) {
          //     this.$message.error({message: '周期时间应为收费标准时间的倍数'})
          //     if (this.phaseValid) {
          //       this.phaseValid = false
          //     }
          //   } else {
          //     this.phaseValid = true
          //   }
          // }
          if (type === 'each' && val % 5 !== 0) {
            this.addPhaseData.detail[index].phaseDto.secondPhaseDto.eachInput = false
          } else {
            this.addPhaseData.detail[index].phaseDto.secondPhaseDto.eachInput = true
          }
          if (type === 'cycle' && val % 5 !== 0) {
            this.addPhaseData.detail[index].phaseDto.secondPhaseDto.cycleInput = false
          } else {
            this.addPhaseData.detail[index].phaseDto.secondPhaseDto.cycleInput = true
          }
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/views/ParkingLotApp/assets/css/parkLotApp.less";
</style>

