<template>
    <div>
		<el-form label-width="104px" ref="phaseData" :inline-message='true'>
			<div class="form-middle memoText">
        <div class="memo-text">
          <span><em>*</em>计费名称:</span>
          <input type="text" :class="{'is-error':phaseNameValid}" v-model = "ruleName" @blur="nameChange" :maxlength="50">
          <em class="errorName" v-text="nameError" v-show="phaseNameValid">计费名称为空</em>
        </div>
        <div class="memo-text">
          <span>计费描述:</span><textarea :rows="4" :maxlength="256" v-model = "phaseData.memo"></textarea>
        </div>
				<!-- <el-form-item label="计费名称："  prop="ruleName" :class="{'is-error':phaseNameValid}">
					<el-input v-model="ruleName" :maxlength="50" style="width:500px" @blur="nameChange"></el-input>
          <em class="errorName" v-text="nameError" v-show="phaseNameValid">计费名称为空</em>
				</el-form-item>
				<el-form-item label="计费描述：">
					<el-input type="textarea" v-model="phaseData.memo" :rows="2" :maxlength="256" style="width:500px" ></el-input>
				</el-form-item> -->
				<table>
					<thead>
						<tr><td>车型</td><td>免费时间</td><td>全天最高收费</td></tr>
					</thead>
					<tbody>
            <tr v-for="(detail, index) in phaseDataDetail" :key="detail.id">
              <td @click="checkCarType(index)" class="check-detail" v-text="carTypeText[index]"></td>
              <td>
							  <input type="text" 
                  :class="{errorValid:!regTime.test(detail.freeTime.time)}"
                  v-model="detail.freeTime.time"
                  @blur="regexpNum(detail.freeTime.time, index, 'time')"
                  >分钟
							  <el-checkbox v-model="detail.freeTime.isContain">包含</el-checkbox>
              </td>
							<td>
                <input :class="{errorValid:!regPrice.test(detail.highestFee) || detail.highestFee > 1000}"
								  v-model="detail.highestFee" type="text" 
                  @blur="regexpNum(detail.highestFee, index, 'price')"
                > 元
							  <el-checkbox v-model="detail.available">启用</el-checkbox>
              </td>
            </tr>						
					</tbody>
				</table>
				<article v-show="addShowDetail">
					<p class="price-detail">价格明细（<span v-text="carText"></span>）</p>
					<div class="phase-price">
						<table v-for="(detail, index) in phaseDataDetail" :key="detail.id" v-show="carTypeIndex == index">
							<tr>
								<td>第一阶段</td>
								<td>收费标准</td>
                <td><div class="table-div">
                  <input v-model="detail.phaseDto.firstPhaseDto.cash"
                    :class="{errorValid:!regPrice.test(detail.phaseDto.firstPhaseDto.cash) || detail.phaseDto.firstPhaseDto.cash > 1000}"
                  @blur="regexpNum(detail.phaseDto.firstPhaseDto.cash, index, 'price')"
                />元/</div>
                  <input 
                    v-model="detail.phaseDto.firstPhaseDto.each"
                    :class="{errorValid:!regTime.test(detail.phaseDto.firstPhaseDto.each) || detail.phaseDto.firstPhaseDto.each > 1440 || detail.phaseDto.firstPhaseDto.cycleTime % detail.phaseDto.firstPhaseDto.each !== 0}"
                    @blur="regexpPhase(detail.phaseDto.firstPhaseDto.each, index, 'firstPhase', 'each')"
                  />分钟</td>
								<!-- <td class="text-left"><el-checkbox v-model="detail.phaseDto.firstPhaseDto.isCricle">循环</el-checkbox></td> -->
							</tr>		
              <tr>
								<td></td>
								<td></td>
                <td><div class="table-div">第一阶段周期</div>
                <input v-model="detail.phaseDto.firstPhaseDto.cycleTime"
                  :class="{errorValid:!regTime.test(detail.phaseDto.firstPhaseDto.cycleTime) || detail.phaseDto.firstPhaseDto.cycleTime > 1440}"
                  @blur="regexpPhase(detail.phaseDto.firstPhaseDto.cycleTime, index, 'firstPhase', 'cycle')"
                />分钟</td>
								<td ></td>
							</tr>						
              <tr>
								<td style="padding-top:30px;">第二阶段</td>
								<td style="padding-top:30px;">收费标准</td>
                <td style="padding-top:30px;"><div class="table-div">
                  <input v-model="detail.phaseDto.secondPhaseDto.cash"
                    :class="{errorValid:!regPrice.test(detail.phaseDto.secondPhaseDto.cash) || detail.phaseDto.secondPhaseDto.cash > 1000}"
                    @blur="regexpNum(detail.phaseDto.secondPhaseDto.cash, index, 'price')"
                  />元/</div>
                <input v-model="detail.phaseDto.secondPhaseDto.each"
                  :class="{errorValid:!regTime.test(detail.phaseDto.secondPhaseDto.each)}"
                  @blur="regexpPhase(detail.phaseDto.secondPhaseDto.each, index, 'secondPhase', 'each')"
                />分钟</td>
								<td ></td>
							</tr>		
              <tr>
								<td></td>
								<td></td>
                <!-- <td><div class="table-div">第二阶段周期</div>
                <input v-model="detail.phaseDto.secondPhaseDto.cycleTime" 
                  :class="{errorValid:!regTime.test(detail.phaseDto.secondPhaseDto.cycleTime)}"
                  @blur="regexpPhase(detail.phaseDto.secondPhaseDto.cycleTime, index, 'secondPhase', 'cycle')"
                />分钟
                </td> -->
								<td ></td>
							</tr>							
						</table>
					</div>
				</article>
			</div>
		</el-form>
	</div>
</template>
<script>
import { feeIsExist } from '@/views/ParkingLotApp/apis'
export default {
  data () {
    // var isExist = (rule, value, callback) => {
    //   value = encodeURI(value)
    //   feeIsExist(value).then(function (response) {
    //     let errorcode = response.code
    //     if (errorcode === '0') {
    //       if (response.data.isExist) {
    //         callback(new Error('该计费名称已存在!'))
    //       } else {
    //         callback()
    //       }
    //     }
    //   })
    // }
    return {
      ruleName: '',
      exitName: '',
      phaseNameValid: false,
      nameError: '',
      regPrice: /^((?!0[0-9])\d+(\.\d{1,2})?)$/,
      regTime: /^(0|[1-9][0-9]*)?[05]$/,
      carTypeIndex: 0,
      carTypeText: ['小车', '大车', '超大车', '摩托车'],
      carText: '小车',
      addShowDetail: true,
      phaseValid: true,
      editPhase: true,
      addFeeLong: {
        name: '',
        memo: '',
        ruleType: 'long',
        detail: [{
          carType: '0',
          available: false,
          freeTime: {
            time: '0',
            isContain: false
          },
          highestFee: '0.00',
          chargeDetailDto: {
            peakPeriodDto: {
              startTime: '',
              endTime: '',
              cash: '0.00',
              each: '0'
            },
            nonPeakPeriodDto: {
              startTime: '',
              endTime: '',
              cash: '0.00',
              each: '0'
            }
          }
        }, {
          carType: '1',
          available: false,
          freeTime: {
            time: '0',
            isContain: false
          },
          highestFee: '0.00',
          chargeDetailDto: {
            peakPeriodDto: {
              startTime: '',
              endTime: '',
              cash: '0.00',
              each: '0'
            },
            nonPeakPeriodDto: {
              startTime: '',
              endTime: '',
              cash: '0.00',
              each: '0'
            }
          }
        }, {
          carType: '2',
          available: false,
          freeTime: {
            time: '0',
            isContain: false
          },
          highestFee: '0.00',
          chargeDetailDto: {
            peakPeriodDto: {
              startTime: '',
              endTime: '',
              cash: '0.00',
              each: '0'
            },
            nonPeakPeriodDto: {
              startTime: '',
              endTime: '',
              cash: '0.00',
              each: '0'
            }
          }
        }, {
          carType: '3',
          available: false,
          freeTime: {
            time: '0',
            isContain: false
          },
          highestFee: '0.00',
          chargeDetailDto: {
            peakPeriodDto: {
              startTime: '',
              endTime: '',
              cash: '0.00',
              each: '0'
            },
            nonPeakPeriodDto: {
              startTime: '',
              endTime: '',
              cash: '0.00',
              each: '0'
            }
          }
        }]
      }
      // phaseRule: {
      //   ruleName: [
      //     { required: true, message: '请输入计费名称', trigger: 'blur' },
      //     { max: 50, message: '最大长度为50字符', trigger: 'blur' },
      //     {validator: queryValid, trigger: 'change'}
      //     // { validator: isExist, trigger: 'blur' }
      //   ]
      // }
    }
  },
  props: ['phaseData', 'phaseDataDetail'],
  watch: {
    phaseData (newVal, oldVal) {
      console.log(newVal)
      this.ruleName = newVal.ruleName
      this.exitName = newVal.ruleName
    }
  },
  mounted () {
    // console.log(this.phaseData)
    this.ruleName = this.phaseData.ruleName
    this.exitName = this.phaseData.ruleName
  },
  methods: {
    checkCarType (index) {
      this.carTypeIndex = index
      this.carText = this.carTypeText[index]
    },
    regexpNum (val, index, type) {
      if (type === 'time') {
        if (val === '') {
          this.$message.error({message: '时间不能为空'})
          this.editPhase = false
        } else if (!this.regTime.test(val) && (val > 1440 || val % 5 !== 0)) {
          this.$message.error({message: '计费时间不能大于1440分钟并且必须为5分钟倍数'})
          this.editPhase = false
        } else {
          this.editPhase = true
        }
      } else if (type === 'price') {
        if (val === '') {
          this.$message.error({message: '收费不能为空'})
          this.editPhase = false
        } else if (!this.regPrice.test(val)) {
          this.$message.error({message: '收费只能输入数字或者两位小数'})
          this.editPhase = false
        } else if (val > 1000 || val < 0) {
          this.$message.error({message: '收费不能大于1000或者小于0'})
          this.editPhase = false
        } else {
          this.editPhase = true
        }
      }
    },
    regexpPhase (val, index, phase, type) {
      // console.log(val + index + phase + type)
      if (val === '') {
        this.$message.error({message: '时间不能为空'})
        if (this.editPhase) {
          this.editPhase = false
        }
      } else if (val % 5 !== 0 || val > 1440) {
        this.$message.error({message: '计费时间不能大于1440分钟并且必须为5分钟倍数'})
        this.editPhase = false
      } else if (!this.regTime.test(val) && (val > 1440 || val % 5 !== 0)) {
        this.$message.error({message: '计费时间为数字且为5分钟的倍数'})
        this.editPhase = false
      // }
      // } else if (val > 1440) {
      //   this.$message.error({message: '计费时间不能大于1440分钟并且必须为5分钟倍数'})
      //   this.editPhase = false
      } else {
        this.editPhase = true
      }
      if (this.editPhase) {
        if (phase === 'firstPhase') {
          let eachVal = this.phaseDataDetail[index].phaseDto.firstPhaseDto.each
          let cycleVal = this.phaseDataDetail[index].phaseDto.firstPhaseDto.cycleTime
          if (eachVal > 0 && cycleVal > 0) {
            if (cycleVal % eachVal !== 0) {
              this.$message.error({message: '周期时间应为收费标准时间的倍数'})
              if (this.editPhase) {
                this.editPhase = false
              }
            } else {
              if (this.editPhase) {
                this.editPhase = true
              }
            }
          }
          if (this.editPhase) {
            if (type === 'cycle' && this.phaseDataDetail[index].phaseDto.firstPhaseDto.cycleTime > 1440) {
              this.$message.error({message: '第一阶段周期不能超过1440分钟'})
              this.editPhase = false
            } else {
              this.editPhase = true
            }
          }
        } else if (phase === 'secondPhase') {
          let seachVal = this.phaseDataDetail[index].phaseDto.secondPhaseDto.each
          let scycleVal = this.phaseDataDetail[index].phaseDto.secondPhaseDto.cycleTime
          if (seachVal > 0 && scycleVal > 0) {
            if (scycleVal % seachVal !== 0) {
              this.$message.error({message: '周期时间应为收费标准时间的倍数'})
              if (this.editPhase) {
                this.editPhase = false
              }
            } else {
              this.editPhase = true
            }
          }
        }
      }
    },
    feeIsEx (value) {
      let _this = this
      feeIsExist(encodeURI(value)).then(function (response) {
        let errorcode = response.code
        if (errorcode === '0') {
          if (response.data.isExist) {
            _this.phaseNameValid = true
            _this.nameError = '计费名称已存在'
          } else {
            _this.phaseNameValid = false
          }
        }
      })
    },
    nameChange () {
      let regexp = new RegExp("[`·~!@#$%+^&*\\-_()=|{}'/\\\\:;'\"\",\\[\\].<>/?！#￥……&*（）——【】‘’；：”“。，、？]")
      if (this.ruleName === '') {
        this.phaseNameValid = true
        this.nameError = '计费名称不能为空'
      } else if (regexp.test(this.ruleName)) {
        this.phaseNameValid = true
        this.nameError = '计费名称不能为特殊字符'
      } else {
        if (this.exitName !== this.ruleName) {
          this.feeIsEx(this.ruleName)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/views/ParkingLotApp/assets/css/parkLotApp.less";
</style>
<style>
.memoText .el-form-item__label{
  font-size: 16px;
  color: #333;
}
</style>


