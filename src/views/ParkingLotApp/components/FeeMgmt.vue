<template>
  <div class="fee">
    <div class="no-data" v-if="isNoData">
      <el-button type="primary" @click="addFee">新增计费</el-button>
    </div>
    <el-container v-else class="fee-main-cont">
      <el-aside class="fee-aside">
        <ul>
          <li v-for='(item,index) in feeData' :title="item.ruleName" :class="{active:index == num}" 
          @click="tabTitle(index,item)" :key="item.id">{{ item.ruleName }}</li>
        </ul>
      </el-aside>
      <el-main class="fee-main" id="editFeeId">
        <section class="fee-btns">
          <el-button type="primary" @click="addFee">新增</el-button>
          <el-button type="primary" @click="editSaveFee">保存</el-button>
          <el-button type="danger" @click="deleteFee">删除</el-button>
        </section>
        <section v-if="feeType == 'interval'">
          <div class="memo-text">
            <span><em>*</em>计费名称:</span>
            <input type="text" :class="{errorValid:nameValid}" v-model = "feeName" @blur="validName" :maxlength="50">
            <em class="errorName" v-text="nameError" v-show="nameValid">计费名称为空</em>
          </div>
          <div class="memo-text">
            <span>计费描述:</span><textarea :rows="4" :maxlength="256" v-model = "memo"></textarea>
          </div>
          <p>计费详细</p>
          <table>
            <thead>
              <tr><td>车型</td><td>免费时间</td><td>全天最高收费</td></tr>
            </thead>
            <tbody>
              <tr>
                <td @click="checkCarType" class="check-detail">小车</td>
                <td>
                  <input type="text" :class="{errorValid:!regTime.test(editFormFee.detail[0].freeTime.time)}"
                    @blur="regexpTime(editFormFee.detail[0].freeTime.time)"
                  v-model="editFormFee.detail[0].freeTime.time">分钟
                  <el-checkbox v-model="editFormFee.detail[0].freeTime.isContain">包含</el-checkbox>
                </td>
                <td>
                  <input :class="{errorValid:!regPrice.test(editFormFee.detail[0].highestFee)}" 
                    @blur="regexpNum(editFormFee.detail[0].highestFee)"
                  v-model="editFormFee.detail[0].highestFee" type="text">元
                  <el-checkbox v-model="editFormFee.detail[0].available">启用</el-checkbox>
                </td>
              </tr>
              <tr>
                <td @click="checkCarType" class="check-detail">大车</td>
                <td>
                  <input type="text" :class="{errorValid:!regTime.test(editFormFee.detail[1].freeTime.time)}" 
                    @blur="regexpTime(editFormFee.detail[1].freeTime.time)"
                  v-model="editFormFee.detail[1].freeTime.time">分钟
                  <el-checkbox v-model="editFormFee.detail[1].freeTime.isContain">包含</el-checkbox>
                </td>
                <td>
                  <input :class="{errorValid:!regPrice.test(editFormFee.detail[1].highestFee)}"
                     @blur="regexpNum(editFormFee.detail[1].highestFee)"
                  v-model="editFormFee.detail[1].highestFee" type="text">元
                  <el-checkbox v-model="editFormFee.detail[1].available">启用</el-checkbox>
                </td>
              </tr>
              <tr>
                <td @click="checkCarType" class="check-detail">超大车</td>
                <td>
                  <input type="text" :class="{errorValid:!regTime.test(editFormFee.detail[2].freeTime.time)}"
                    @blur="regexpTime(editFormFee.detail[2].freeTime.time)"
                  v-model="editFormFee.detail[2].freeTime.time">分钟
                  <el-checkbox v-model="editFormFee.detail[2].freeTime.isContain">包含</el-checkbox>
                </td>
                <td>
                  <input :class="{errorValid:!regPrice.test(editFormFee.detail[2].highestFee)}"
                     @blur="regexpNum(editFormFee.detail[2].highestFee)"
                  v-model="editFormFee.detail[2].highestFee" type="text">元
                  <el-checkbox v-model="editFormFee.detail[2].available">启用</el-checkbox>
                </td>
              </tr>
              <tr>
                <td @click="checkCarType" class="check-detail">摩托车</td>
                <td>
                  <input type="text" :class="{errorValid:!regTime.test(editFormFee.detail[3].freeTime.time)}"
                    @blur="regexpTime(editFormFee.detail[3].freeTime.time)"
                  v-model="editFormFee.detail[3].freeTime.time">分钟
                  <el-checkbox v-model="editFormFee.detail[3].freeTime.isContain">包含</el-checkbox>
                </td>
                <td>
                  <input :class="{errorValid:!regPrice.test(editFormFee.detail[3].highestFee)}"
                     @blur="regexpNum(editFormFee.detail[3].highestFee)"
                   v-model="editFormFee.detail[3].highestFee" type="text">元
                  <el-checkbox v-model="editFormFee.detail[3].available">启用</el-checkbox>
                </td>
              </tr>
            </tbody>
          </table>
          <article v-show="addShowDetail">
            <p class="price-detail">价格明细（<span v-text="carText"></span>）</p>
            <div class="price-cont">
              <table>
                <tr>
                  <td></td>
                  <td class="table-title">时间段</td>
                  <td class="table-title">价格</td>
                </tr>
                <tbody v-for = "(feeDetail , index) in editFormFee.detail" v-show="carTypeIndex == index" :key="feeDetail.id">
                  <tr>
                    <td>高峰期</td>
                    <td>
                      <div v-if="feeDetail.chargeDetailDto.peakPeriodDto">
                        <el-time-picker class="price-input" style="ime-mode: disabled;" format="HH:mm" value-format = "HH:mm" 
                          v-model="feeDetail.chargeDetailDto.peakPeriodDto.startTime" :clearable = "false" placeholder="00:00">
                        </el-time-picker>
                        <!-- <el-time-picker
    v-model="feeDetail.chargeDetailDto.peakPeriodDto.startTime" class="price-input" value-format = "HH:mm" 
    placeholder="任意时间点">
  </el-time-picker> -->
                      到
                        <el-time-picker class="price-input" style="ime-mode: disabled;" format="HH:mm" value-format = "HH:mm" 
                        v-if="feeDetail.chargeDetailDto.peakPeriodDto" v-model="feeDetail.chargeDetailDto.peakPeriodDto.endTime"  
                        :clearable = "false" placeholder="00:00">
                        </el-time-picker>
                      </div>
                    </td>
                    <td><div v-if="feeDetail.chargeDetailDto.peakPeriodDto">
                      <input class="price-input" v-model="feeDetail.chargeDetailDto.peakPeriodDto.cash" 
                      :class="{errorValid:!regPrice.test(feeDetail.chargeDetailDto.peakPeriodDto.cash)}" 
                        @blur="regexpNum(feeDetail.chargeDetailDto.peakPeriodDto.cash)"/>元/
                      <input class="price-input" v-model="feeDetail.chargeDetailDto.peakPeriodDto.each" 
                      :class="{errorValid:!regTime.test(feeDetail.chargeDetailDto.peakPeriodDto.each)}" 
                        @blur="regexpTime(feeDetail.chargeDetailDto.peakPeriodDto.each)"/>分钟</div></td>
                  </tr>
                  <tr>
                    <td>非高峰期</td>
                    <td>
                      <div v-if="feeDetail.chargeDetailDto.peakPeriodDto">
                        <el-time-picker class="price-input" format="HH:mm" :disabled = "true" value-format = "HH:mm" 
                        v-model="feeDetail.chargeDetailDto.peakPeriodDto.endTime" :clearable = "false"  placeholder="00:00">
                        </el-time-picker>
                        到
                        <el-time-picker class="price-input" format="HH:mm" :disabled = "true" value-format = "HH:mm" 
                        v-model="feeDetail.chargeDetailDto.peakPeriodDto.startTime" :clearable = "false"  placeholder="00:00">
                        </el-time-picker>
                      </div>
                    </td>
                    <td><div v-if="feeDetail.chargeDetailDto.nonPeakPeriodDto"><input class="price-input" 
                    :class="{errorValid:!regPrice.test(feeDetail.chargeDetailDto.nonPeakPeriodDto.cash)}"
                      @blur="regexpNum(feeDetail.chargeDetailDto.nonPeakPeriodDto.cash)"
                    v-model="feeDetail.chargeDetailDto.nonPeakPeriodDto.cash" />元/
                    <input class="price-input" v-model="feeDetail.chargeDetailDto.nonPeakPeriodDto.each" 
                    :class="{errorValid:!regTime.test(feeDetail.chargeDetailDto.nonPeakPeriodDto.each)}" @blur="regexpTime(feeDetail.chargeDetailDto.nonPeakPeriodDto.each)"/>分钟</div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>
        </section>
        <section v-else-if="feeType == 'time'">
        <el-form :model="editFormTime" ref="editFormTime" :inline-message='true'>
          <div class="memo-text" >
            <span><em>*</em>计费名称:</span>
            <input type="text" :class="{errorValid:nameValid}" v-model = "feeName" @blur="validName" :maxlength="50" >
            <em class="errorName" v-text="nameError" v-show="nameValid">计费名称为空</em>
          </div>
          <div class="memo-text" >
            <span>计费描述:</span><textarea :rows="4" :maxlength="256" v-model = "memo"></textarea>
          </div>
          <p>计费详细</p>
          <table>
            <thead>
              <tr><td>车型</td><td>免费时间</td><td>价格</td></tr>
            </thead>
            <tbody>
              <tr><td>小车</td><td><input type="text" prop="detail[0].freeTime.time" 
              :class="{errorValid:!regTime.test(editFormTime.detail[0].freeTime.time)}" 
                @blur="regexpTime(editFormTime.detail[0].freeTime.time)"
              v-model="editFormTime.detail[0].freeTime.time">分钟</td>
              <td><input :class="{errorValid:!regPrice.test(editFormTime.detail[0].timeCharge)}"
                @blur="regexpNum(editFormTime.detail[0].timeCharge)"
              v-model="editFormTime.detail[0].timeCharge" type="text">元/次</td></tr>
              <tr><td>大车</td><td><input type="text" :class="{errorValid:!regTime.test(editFormTime.detail[1].freeTime.time)}"
                @blur="regexpTime(editFormTime.detail[1].freeTime.time)"
              v-model="editFormTime.detail[1].freeTime.time">分钟</td>
              <td><input :class="{errorValid:!regPrice.test(editFormTime.detail[1].timeCharge)}"
                @blur="regexpNum(editFormTime.detail[1].timeCharge)"
              v-model="editFormTime.detail[1].timeCharge"  type="text">元/次</td></tr>
              <tr><td>超大车</td><td><input type="text" :class="{errorValid:!regTime.test(editFormTime.detail[2].freeTime.time)}"
                @blur="regexpTime(editFormTime.detail[2].freeTime.time)"
              v-model="editFormTime.detail[2].freeTime.time">分钟</td>
              <td><input :class="{errorValid:!regPrice.test(editFormTime.detail[2].timeCharge)}"
                @blur="regexpNum(editFormTime.detail[2].timeCharge)"
              v-model="editFormTime.detail[2].timeCharge" type="text">元/次</td></tr>
              <tr><td>摩托车</td><td><input type="text" :class="{errorValid:!regTime.test(editFormTime.detail[3].freeTime.time)}"
                @blur="regexpTime(editFormTime.detail[3].freeTime.time)"
              v-model="editFormTime.detail[3].freeTime.time">分钟</td>
              <td><input :class="{errorValid:!regPrice.test(editFormTime.detail[3].timeCharge)}"
                @blur="regexpNum(editFormTime.detail[3].timeCharge)"
              v-model="editFormTime.detail[3].timeCharge" type="text">元/次</td></tr>
            </tbody>
          </table>
        </el-form>
        </section >
        <section v-else-if="feeType == 'ladder'">
          <el-form>
            <div class="memo-text" >
              <span class=""><em>*</em>计费名称:</span>
              <input type="text" :class="{errorValid:nameValid}" v-model = "feeName" @blur="validName" :maxlength="50" >
              <em class="errorName" v-text="nameError" v-show="nameValid">计费名称为空</em>
            </div>
            <div class="memo-text" >
              <span>计费描述:</span><textarea :rows="4" :maxlength="256" v-model = "memo" ></textarea>
            </div>
            <p>计费详细</p>
            <el-tabs type="card" v-model="ladderCarType">
              <el-tab-pane :label="carTypeText[index]" :name="carTypeText[index]" 
              v-for="(detailList,index) in editFormladder.detail" :key="detailList.carType">
                <p>{{carTypeText[index]}}收费标准</p>
                <table class="ladder-table">
                  <thead>
                    <tr><td>时间段</td><td>价格</td></tr>
                  </thead>
                  <tbody>
                    <tr v-for="(itemList, i) in editFormladder.detail[index].ladderDetailDtoList" :key="itemList.i">
                      <td>
                        <el-cascader class="select-input" 
                            :options="ladderOpt"
                            :separator="''"
                            change-on-select
                            disabled
                            v-model = "itemList.startTime"
                          ></el-cascader>
                        到
                        <el-cascader class="select-input" 
                          :options="ladderOpt"
                          :separator="''"
                          change-on-select
                          disabled
                          v-if="i == editFormladder.detail[index].ladderDetailDtoList.length - 1"
                          v-model="itemList.endTime"
                        ></el-cascader>
                        <el-cascader class="select-input" 
                          :options="ladderOpt"
                          :separator="''"
                          change-on-select
                          v-else
                          @change = "changeEditTime(index, i, editFormladder.detail[index].ladderDetailDtoList[i+1].startTime)"
                          v-model="editFormladder.detail[index].ladderDetailDtoList[i+1].startTime"
                        ></el-cascader>
                      <td>
                        <input class="price-input" 
                        :class="{errorValid:!regPrice.test(itemList.ladderCharge)}"
                        @blur="regexpNum(itemList.ladderCharge)"
                        v-model = "itemList.ladderCharge" />元
                        <i class="el-icon-plus" @click="editLadderPlus(index)" 
                        v-show="i == editFormladder.detail[index].ladderDetailDtoList.length-1"></i>
                        <i class="el-icon-minus" @click="editLadderMinus(index)" 
                        v-show="i == editFormladder.detail[index].ladderDetailDtoList.length-1 && i > 0"></i>
                        <!-- <span class="ladderPrice" v-show="!regPrice.test(itemList.ladderCharge)">输入金额</span> -->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </section>
				<feeLone v-else-if="feeType =='phase'" ref="phaseFee" :phaseData = "phaseData" :phaseDataDetail = "phaseDataDetail"></feeLone>
      </el-main>
    </el-container>
    <el-dialog :visible.sync="dialogAddVisible" title="新增计费" :before-close="cancleDialogAddVisible">
        <section id="addFee" class="addFee"> 
          <div class="mt15">
            <el-select v-model="addSelectFee" placeholder="请选择" @change="addSelect">
              <el-option
                v-for="item in feeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>        
          <div class="fee-times" v-if="tempType =='time'" id="addFeeTimeId">
            <el-form label-width="130px" :model="addFormTime" ref="addFormTime" :rules = "feeTimeRules" :inline-message='true'>
              <div class="form-middle">
                <el-form-item label="计费名称(按次)" prop="ruleName">
                  <el-input v-model="addFormTime.ruleName" style="width:500px" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="计费描述">
                  <el-input type="textarea" v-model="addFormTime.memo" :rows="4" :maxlength="256" style="width:500px"></el-input>
                </el-form-item>
                <table>
                  <thead>
                    <tr><td>车型</td><td>免费时间</td><td>价格</td></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>小车</td><td><input type="text" :class="{errorValid:!regTime.test(addFormTime.detail[0].freeTime.time)}" 
                      @blur="regexpTime(addFormTime.detail[0].freeTime.time)" prop="detail[0].freeTime.time" 
                      v-model="addFormTime.detail[0].freeTime.time">分钟
                      </td>
                      <td><input :class="{errorValid:!regPrice.test(addFormTime.detail[0].timeCharge)}" 
                      @blur="regexpNum(addFormTime.detail[0].timeCharge)" v-model="addFormTime.detail[0].timeCharge" type="text">元/次</td></tr>
                    <tr><td>大车</td><td><input type="text" :class="{errorValid:!regTime.test(addFormTime.detail[1].freeTime.time)}" 
                        @blur="regexpTime(addFormTime.detail[1].freeTime.time)" v-model="addFormTime.detail[1].freeTime.time">分钟</td>
                    <td><input :class="{errorValid:!regPrice.test(addFormTime.detail[1].timeCharge)}" 
                    @blur="regexpNum(addFormTime.detail[1].timeCharge)" v-model="addFormTime.detail[1].timeCharge"  type="text">元/次</td></tr>
                    <tr><td>超大车</td><td><input type="text" :class="{errorValid:!regTime.test(addFormTime.detail[2].freeTime.time)}" 
                        @blur="regexpTime(addFormTime.detail[2].freeTime.time)" v-model="addFormTime.detail[2].freeTime.time">分钟</td>
                    <td><input :class="{errorValid:!regPrice.test(addFormTime.detail[2].timeCharge)}" 
                    @blur="regexpNum(addFormTime.detail[2].timeCharge)" v-model="addFormTime.detail[2].timeCharge" type="text">元/次</td></tr>
                    <tr><td>摩托车</td><td><input type="text" :class="{errorValid:!regTime.test(addFormTime.detail[3].freeTime.time)}"
                      @blur="regexpTime(addFormTime.detail[3].freeTime.time)" v-model="addFormTime.detail[3].freeTime.time">分钟</td>
                    <td><input :class="{errorValid:!regPrice.test(addFormTime.detail[3].timeCharge)}" 
                    @blur="regexpNum(addFormTime.detail[3].timeCharge)" v-model="addFormTime.detail[3].timeCharge" type="text">元/次</td></tr>
                  </tbody>
                </table>
              </div>
              <el-form-item style="text-align:right;">
                <el-button @click="cancleDialogAddVisible">取 消</el-button>
                <el-button type="primary" @click="saveFee('addFormTime')">保 存</el-button>
              </el-form-item>
            </el-form>  
          </div>	
          <div class="fee-times" v-else-if="tempType =='interval'" id="addFeeIntervalId">
            <el-form label-width="130px" :model="addFormFee" ref="addFormFee" :rules = "feeInterRules" :inline-message='true'>
              <div class="form-middle">
                <el-form-item label="计费名称(按时)" prop="ruleName">
                  <el-input v-model="addFormFee.ruleName" :maxlength="50" style="width:500px" ></el-input>
                </el-form-item>
                <el-form-item label="计费描述">
                  <el-input type="textarea" v-model="addFormFee.memo" :rows="2" :maxlength="256" style="width:500px" ></el-input>
                </el-form-item>
                <table>
                  <thead>
                    <tr><td>车型</td><td>免费时间</td><td>全天最高收费</td></tr>
                  </thead>
                  <tbody>
                    <tr><td @click="checkCarType" class="check-detail">小车</td><td>
                      <input type="text" :class="{errorValid:!regTime.test(addFormFee.detail[0].freeTime.time)}" 
                        @blur="regexpTime(addFormFee.detail[0].freeTime.time)"
                      v-model="addFormFee.detail[0].freeTime.time">分钟
                      <el-checkbox v-model="addFormFee.detail[0].freeTime.isContain">包含</el-checkbox></td>
                      <td><input :class="{errorValid:!regPrice.test(addFormFee.detail[0].highestFee)}"
                        @blur="regexpNum(addFormFee.detail[0].highestFee)"
                          v-model="addFormFee.detail[0].highestFee" type="text">元
                      <el-checkbox v-model="addFormFee.detail[0].available">启用</el-checkbox></td></tr>
                    <tr><td @click="checkCarType" class="check-detail">大车</td><td>
                        <input type="text" :class="{errorValid:!regTime.test(addFormFee.detail[1].freeTime.time)}" 
                        @blur="regexpTime(addFormFee.detail[1].freeTime.time)"  
                        v-model="addFormFee.detail[1].freeTime.time">分钟
                      <el-checkbox v-model="addFormFee.detail[1].freeTime.isContain">包含</el-checkbox></td><td>
                        <input type="text" :class="{errorValid:!regPrice.test(addFormFee.detail[1].highestFee)}" 
                        @blur="regexpNum(addFormFee.detail[1].highestFee)"
                        v-model="addFormFee.detail[1].highestFee">元<el-checkbox v-model="addFormFee.detail[1].available">启用
                          </el-checkbox></td></tr>
                    <tr><td @click="checkCarType" class="check-detail">超大车</td><td>
                        <input type="text" :class="{errorValid:!regTime.test(addFormFee.detail[2].freeTime.time)}" 
                        @blur="regexpTime(addFormFee.detail[2].freeTime.time)"
                        v-model="addFormFee.detail[2].freeTime.time">分钟
                        <el-checkbox v-model="addFormFee.detail[2].freeTime.isContain">包含</el-checkbox></td><td>
                          <input type="text" :class="{errorValid:!regPrice.test(addFormFee.detail[2].highestFee)}" 
                          @blur="regexpNum(addFormFee.detail[2].highestFee)"
                          v-model="addFormFee.detail[2].highestFee">元<el-checkbox v-model="addFormFee.detail[2].available">启用</el-checkbox></td>
                          </tr>
                    <tr><td @click="checkCarType" class="check-detail">摩托车</td><td>
                        <input type="text"  :class="{errorValid:!regTime.test(addFormFee.detail[3].freeTime.time)}" 
                        @blur="regexpTime(addFormFee.detail[3].freeTime.time)"
                        v-model="addFormFee.detail[3].freeTime.time">分钟
                        <el-checkbox v-model="addFormFee.detail[3].freeTime.isContain">包含</el-checkbox></td><td>
                          <input type="text" :class="{errorValid:!regPrice.test(addFormFee.detail[3].highestFee)}"
                          @blur="regexpNum(addFormFee.detail[3].highestFee)"
                          v-model="addFormFee.detail[3].highestFee">元<el-checkbox v-model="addFormFee.detail[3].available">启用
                            </el-checkbox></td></tr>
                  </tbody>
                </table>
                <article v-show="addShowDetail">
                  <p class="price-detail">价格明细（<span v-text="carText"></span>）</p>
                  <div class="price-cont">
                    <table>
                      <tr>
                        <td></td>
                        <td class="table-title">时间段</td>
                        <td class="table-title">价格</td>
                      </tr>
                      <tbody v-for = "(feeDetail , index) in addFormFee.detail" v-show="carTypeIndex == index" :key="feeDetail.id">
                        <tr>
                          <td>高峰期</td>
                          <td>
                            <el-time-picker class="price-input" format="HH:mm" value-format = "HH:mm" :clearable = "false"
                            v-model="feeDetail.chargeDetailDto.peakPeriodDto.startTime" placeholder="00:00">
                            </el-time-picker>
                            到
                            <el-time-picker class="price-input" format="HH:mm" value-format = "HH:mm" :clearable = "false"
                            v-model="feeDetail.chargeDetailDto.peakPeriodDto.endTime"  placeholder="00:00">
                            </el-time-picker>
                          </td>
                          <td><input class="price-input" :class="{errorValid:!regPrice.test(feeDetail.chargeDetailDto.peakPeriodDto.cash)}"
                            @blur="regexpNum(feeDetail.chargeDetailDto.peakPeriodDto.cash)"
                            v-model="feeDetail.chargeDetailDto.peakPeriodDto.cash" />元/
                            <input class="price-input" :class="{errorValid:!regTime.test(feeDetail.chargeDetailDto.peakPeriodDto.each)}"
                            @blur="regexpTime(feeDetail.chargeDetailDto.peakPeriodDto.each)"
                            v-model="feeDetail.chargeDetailDto.peakPeriodDto.each" />分钟</td>
                        </tr>
                        <tr>
                          <td>非高峰期</td>
                          <td>
                            <el-time-picker class="price-input" format="HH:mm" :disabled = "true" value-format = "HH:mm" 
                            v-model="feeDetail.chargeDetailDto.peakPeriodDto.endTime" :clearable = "false"  placeholder="00:00">
                            </el-time-picker>
                            到
                            <el-time-picker class="price-input" format="HH:mm" :disabled = "true" value-format = "HH:mm" 
                            v-model="feeDetail.chargeDetailDto.peakPeriodDto.startTime" :clearable = "false" placeholder="00:00">
                            </el-time-picker>
                          </td>
                          <td><input class="price-input" :class="{errorValid:!regPrice.test(feeDetail.chargeDetailDto.nonPeakPeriodDto.cash)}"
                            @blur="regexpNum(feeDetail.chargeDetailDto.nonPeakPeriodDto.cash)"
                            v-model="feeDetail.chargeDetailDto.nonPeakPeriodDto.cash" />元/
                            <input class="price-input" :class="{errorValid:!regTime.test(feeDetail.chargeDetailDto.nonPeakPeriodDto.each)}"
                              @blur="regexpTime(feeDetail.chargeDetailDto.nonPeakPeriodDto.each)"
                              v-model="feeDetail.chargeDetailDto.nonPeakPeriodDto.each" />分钟</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </article>
              </div>
              <el-form-item style="text-align:right;">
                <el-button @click="cancleDialogAddVisible">取 消</el-button>
                <el-button type="primary" @click="saveFee('addFormFee')">保 存</el-button>
              </el-form-item>
            </el-form>
          </div>
          <addPhase v-else-if="tempType =='phase'" ref="addPhase" @closeDialog = "closeDialog" :addPhaseData = "addPhaseData"></addPhase>
          <div class="fee-times fee-main" v-else-if="tempType =='ladder'" id="addFeeLadder">
            <el-form label-width="130px" :model="addFormLadder" ref="addFormLadder" :rules = "feeLaddRules" :inline-message='true'>
              <div class="form-middle">
                <el-form-item label="计费名称(按阶梯)" prop="ruleName">
                  <el-input v-model="addFormLadder.ruleName" :maxlength="50" style="width:400px" ></el-input>
                </el-form-item>
                <el-form-item label="计费描述">
                  <el-input type="textarea" v-model="addFormLadder.memo" :rows="2" :maxlength="256" style="width:400px" ></el-input>
                </el-form-item>
                <p>计费详细</p>
                <el-tabs type="card" v-model="addLadderCarType" style="margin-left:30px;" @tab-click="ladderTabClick">
                  <el-tab-pane :label="carTypeText[index]" :name="carTypeText[index]" v-for="(itemCar,index) in carTypeText" :key="itemCar.id">
                    <p>{{itemCar}}收费标准</p>
                    <table class="ladder-table">
                      <thead>
                        <tr><td>时间段</td><td>价格</td></tr>
                      </thead>
                      <tbody>
                        <tr v-for="(addList, i) in addFormLadder.detail[index].ladderDetailDtoList" :key="addList.i">
                          <td>
                            <el-cascader class="select-input" 
                              :options="ladderOpt"
                              :separator="''"
                              change-on-select
                              disabled
                              v-model="addList.startTime"
                            ></el-cascader>
                            到
                            <el-cascader class="select-input" 
                              :options="ladderOpt"
                              :separator="''"
                              change-on-select
                              :disabled = "i == addFormLadder.detail[index].ladderDetailDtoList.length-1"
                              v-if="i == addFormLadder.detail[index].ladderDetailDtoList.length-1"
                              v-model="addList.endTime"
                            ></el-cascader>
                            <el-cascader class="select-input" 
                              :options="ladderOpt"
                              :separator="''"
                              change-on-select
                              :class="{errorValid:addFormLadder.detail[index].ladderDetailDtoList[i].ladderValid === false}"
                              v-model="addFormLadder.detail[index].ladderDetailDtoList[i].endTime"
                              @change = "changeLadderTime(i, addFormLadder.detail[index].ladderDetailDtoList[i].endTime)"
                              v-else
                            ></el-cascader>
                            <span v-show="!addFormLadder.detail[index].ladderDetailDtoList[i].ladderValid && i !== addFormLadder.detail[index].ladderDetailDtoList.length-1" class="ladderError">
                              不为空且大于开始时间
                            </span>
                          <td>
                            <input class="price-input" :class="{errorValid:!regPrice.test(addList.ladderCharge)}" @blur="regexpNum(addList.ladderCharge)" v-model="addList.ladderCharge"/>元
                            <i class="el-icon-plus" @click="addLadder" v-show="i == addFormLadder.detail[index].ladderDetailDtoList.length-1"></i>
                            <i class="el-icon-minus" @click="minusLadder" 
                            v-show="i == addFormLadder.detail[index].ladderDetailDtoList.length-1 && i !== 0"></i>
                            <!-- <span class="ladderPrice" v-show="!regPrice.test(addList.ladderCharge)">输入金额</span> -->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <el-form-item style="text-align:right;">
                <el-button @click="cancleDialogAddVisible">取 消</el-button>
                <el-button type="primary" @click="saveFee('addFormLadder')">保 存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </section>
    </el-dialog>
  </div>
</template>
<script>
import { queryFee, addFee, deleteFee, updateCharge, feeIsExist } from '@/views/ParkingLotApp/apis'
import feeLone from './dialogs/EditFeeLone'
import addPhase from './dialogs/AddFeeLone'
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
      feeData: [],
      regPrice: /^(?:(?!0\d)\d{1,3}(?:\.\d{1,2})?|1000(?:\.0{1,2})?)$/,
      regTime: /^(0|[1-9][0-9]*)?[05]|1440$/,
      nameValid: false,
      nameError: '',
      dialogAddVisible: false,
      ladderValid: true,
      addLadderValid: true,
      editLadderValid: true,
      tempType: '',
      tempEndTime: [],
      phaseData: {},
      phaseDataDetail: {},
      addPhaseData: {
        ruleName: '',
        ruleType: 'phase',
        memo: '',
        uuid: '',
        detail: [{
          'available': false,
          'carType': 0,
          'freeTime': {
            'isContain': false,
            'time': 0
          },
          'highestFee': 0,
          phaseDto: {
            firstPhaseDto: {
              cash: 5,
              'cycleTime': 360,
              'each': 360
            },
            'secondPhaseDto': {
              'cash': 1,
              'cycleTime': 1080,
              'each': 120
            }
          }
        }, {
          'available': false,
          'carType': 1,
          'freeTime': {
            'isContain': false,
            'time': 0
          },
          'highestFee': 0,
          'phaseDto': {
            'firstPhaseDto': {
              'cash': 5,
              'cycleTime': 360,
              'each': 360
            },
            'secondPhaseDto': {
              'cash': 1,
              'cycleTime': 1080,
              'each': 120
            }
          }
        }, {
          'available': false,
          'carType': 2,
          'freeTime': {
            'isContain': false,
            'time': 0
          },
          'highestFee': 0,
          'phaseDto': {
            'firstPhaseDto': {
              'cash': 5,
              'cycleTime': 360,
              'each': 360
            },
            'secondPhaseDto': {
              'cash': 1,
              'cycleTime': 1080,
              'each': 120
            }
          }
        }, {
          'available': false,
          'carType': 3,
          'freeTime': {
            'isContain': false,
            'time': 0
          },
          'highestFee': 0,
          'phaseDto': {
            'firstPhaseDto': {
              'cash': 5,
              'cycleTime': 360,
              'each': 360
            },
            'secondPhaseDto': {
              'cash': 1,
              'cycleTime': 1080,
              'each': 120
            }
          }
        }]
      },
      num: 0,
      feeId: '',
      feeType: '',
      feeName: '',
      tempName: '',
      addSelectFee: '',
      memo: '',
      feeValid: true,
      showDetail: false,
      addShowDetail: true,
      isChecked: true,
      noChecked: false,
      isNoData: false,
      ladderCarType: '小车',
      addLadderCarType: '小车',
      carTypeIndex: 0,
      carTypeText: ['小车', '大车', '超大车', '摩托车'],
      detail: {
        carType: ''
      },
      carText: '小车',
      feeInterRules: {
        ruleName: [
          { required: true, message: '请输入计费名称', trigger: 'blur' },
          { max: 50, message: '最大长度为50字符', trigger: 'blur' },
          { validator: queryValid, trigger: 'blur' },
          { validator: isExist, trigger: 'blur' }
        ]
      },
      feeTimeRules: {
        ruleName: [
          { required: true, message: '请输入计费名称', trigger: 'blur' },
          { max: 50, message: '最大长度为50字符', trigger: 'blur' },
          { validator: queryValid, trigger: 'blur' },
          { validator: isExist, trigger: 'blur' }
        ]
      },
      feeLaddRules: {
        ruleName: [
          { required: true, message: '请输入计费名称', trigger: 'blur' },
          { max: 50, message: '最大长度为50字符', trigger: 'blur' },
          { validator: queryValid, trigger: 'blur' },
          { validator: isExist, trigger: 'blur' }
        ]
      },
      editFormTime: {
        ruleName: '',
        ruleType: '',
        detail: [{
          carType: '0',
          freeTime: {
            time: ''
          },
          timeCharge: ''
        }, {
          carType: '1',
          freeTime: {
            time: ''
          },
          timeCharge: ''
        }, {
          carType: '2',
          freeTime: {
            time: ''
          },
          timeCharge: ''
        }, {
          carType: '3',
          freeTime: {
            time: ''
          },
          timeCharge: ''
        }]
      },
      editFormFee: {
        id: '',
        ruleName: '',
        ruleType: '',
        detail: [{
          carType: '0',
          available: false,
          freeTime: {
            time: '0',
            isContain: false
          },
          highestFee: '',
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
            time: '',
            isContain: false
          },
          highestFee: '',
          chargeDetailDto: {
            peakPeriodDto: {
              startTime: '',
              endTime: '',
              cash: '',
              each: ''
            },
            nonPeakPeriodDto: {
              startTime: '',
              endTime: '',
              cash: '',
              each: ''
            }
          }
        }, {
          carType: '2',
          available: false,
          freeTime: {
            time: '',
            isContain: false
          },
          highestFee: '',
          chargeDetailDto: {
            peakPeriodDto: {
              startTime: '',
              endTime: '',
              cash: '',
              each: ''
            },
            nonPeakPeriodDto: {
              startTime: '',
              endTime: '',
              cash: '',
              each: ''
            }
          }
        }, {
          carType: '3',
          available: false,
          freeTime: {
            time: '',
            isContain: false
          },
          highestFee: '',
          chargeDetailDto: {
            peakPeriodDto: {
              startTime: '',
              endTime: '',
              cash: '',
              each: ''
            },
            nonPeakPeriodDto: {
              startTime: '',
              endTime: '',
              cash: '',
              each: ''
            }
          }
        }]
      },
      editFormladder: {
        detail: [{
          carType: 0,
          ladderDetailDtoList: []
        },
        {
          carType: 1,
          ladderDetailDtoList: []
        },
        {
          carType: 2,
          ladderDetailDtoList: []
        },
        {
          carType: 3,
          ladderDetailDtoList: []
        }]
      },
      addFormFee: {
        ruleName: '',
        ruleType: 'interval',
        memo: '',
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
              startTime: '7:00',
              endTime: '19:00',
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
              startTime: '7:00',
              endTime: '19:00',
              cash: '0.00',
              each: '0'
            },
            nonPeakPeriodDto: {
              startTime: '19:00',
              endTime: '7:00',
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
              startTime: '7:00',
              endTime: '19:00',
              cash: '0.00',
              each: '0'
            },
            nonPeakPeriodDto: {
              startTime: '19:00',
              endTime: '7:00',
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
              startTime: '7:00',
              endTime: '19:00',
              cash: '0.00',
              each: '0'
            },
            nonPeakPeriodDto: {
              startTime: '19:00',
              endTime: '7:00',
              cash: '0.00',
              each: '0'
            }
          }
        }]
      },
      addFormTime: {// 新增按次数据模板
        ruleName: '',
        ruleType: 'time',
        memo: '',
        detail: [{
          carType: '0',
          freeTime: {
            time: '0'
          },
          timeCharge: '0.00'
        }, {
          carType: '1',
          freeTime: {
            time: '0'
          },
          timeCharge: '0.00'
        }, {
          carType: '2',
          freeTime: {
            time: '0'
          },
          timeCharge: '0.00'
        }, {
          carType: '3',
          freeTime: {
            time: '0'
          },
          timeCharge: '0.00'
        }]
      },
      addFormLadder: {
        ruleName: '',
        addTime: true,
        ruleType: 'ladder',
        memo: '',
        detail: [{
          carType: 0,
          ladderDetailDtoList: [{
            'endTime': [24],
            'ladderCharge': '0.00',
            'startTime': [0],
            'ladderValid': false
          }]
        }, {
          carType: 1,
          ladderDetailDtoList: [{
            'endTime': [24],
            'ladderCharge': '0.00',
            'startTime': [0]
          }]
        }, {
          carType: 2,
          ladderDetailDtoList: [{
            'endTime': [24],
            'ladderCharge': '0.00',
            'startTime': [0]
          }]
        }, {
          carType: 3,
          ladderDetailDtoList: [{
            'endTime': [24],
            'ladderCharge': '0.00',
            'startTime': [0]
          }]
        }]
      },
      addLaderIndex: 0,
      ladderOpt: [],
      ladderTimeEnd: [1, 45],
      timeFormat: [],
      feeOptions: [{
        value: 'time',
        label: '按次收费'
      }, {
        value: 'interval',
        label: '按时收费'
      }, {
        value: 'ladder',
        label: '按阶梯收费'
      }, {
        value: 'phase',
        label: '按阶段收费'
      }]
    }
  },
  components: {
    feeLone,
    addPhase
  },
  mounted () {
    this.loadFeeList()
    this.setLadderTime()
  },
  methods: {
    loadFeeList () { // 加载列表
      let _this = this
      // _this.loading = true
      queryFee()
        .then(function (response) {
          if (response.data.length > 0) {
            _this.isNoData = false
            _this.feeData = (response.data)
            _this.feeType = response.data[0].ruleType
            _this.feeId = response.data[0].uuid
            _this.feeName = response.data[0].ruleName
            _this.tempName = response.data[0].ruleName
            _this.memo = response.data[0].memo
            // console.log('type ' + _this.feeType)
            if (_this.feeType === 'time') {
              _this.editFormTime.detail = JSON.parse(response.data[0].detail)
            } else if (_this.feeType === 'interval') {
              _this.editFormFee.detail = JSON.parse(response.data[0].detail)
              console.log(_this.editFormFee.detail)
              _this.stringToObj(_this.editFormFee.detail)
            } else if (_this.feeType === 'ladder') {
              // console.log('data : ' + response.data[0].detail)
              _this.editFormladder.detail = JSON.parse(response.data[0].detail)
              for (let i = 0; i < _this.editFormladder.detail.length; i++) {
                for (let j = 0; j < _this.editFormladder.detail[i].ladderDetailDtoList.length; j++) {
                  let endT = _this.editFormladder.detail[i].ladderDetailDtoList[j].endTime
                  let startT = _this.editFormladder.detail[i].ladderDetailDtoList[j].startTime
                  _this.editFormladder.detail[i].ladderDetailDtoList[j].endTime = _this.valTimeFormat(endT)
                  _this.editFormladder.detail[i].ladderDetailDtoList[j].startTime = _this.valTimeFormat(startT)
                }
              }
            } else if (_this.feeType === 'phase') {
              _this.phaseData = response.data[0]
              _this.phaseDataDetail = _this.stringToObj(JSON.parse(_this.phaseData.detail))
            } else {
              _this.isNoData = true
            }
          } else {
            _this.isNoData = true
          }
        })
        .catch(function (error) {
          this.loading = false
          // this.isNoData = true
          // _this.$message.error('数据异常')
          console.log(error)
        }.bind(this)
      )
    },
    // 切换计费
    tabTitle (index, item) {
      this.feeId = item.uuid
      this.showDetail = false
      this.nameValid = false
      this.num = index
      this.feeType = item.ruleType
      this.feeName = item.ruleName
      this.tempName = item.ruleName
      this.memo = item.memo
      this.feeValid = true
      if (this.feeType === 'time') {
        if (typeof item.detail === 'string') {
          this.editFormTime.detail = JSON.parse(item.detail)
        } else {
          this.editFormTime.detail = item.detail
        }
      } else if (this.feeType === 'interval') {
        this.editFormFee.detail = JSON.parse(item.detail)
        this.stringToObj(this.editFormFee.detail)
      } else if (this.feeType === 'ladder') {
        // console.log(typeof item.detail)
        this.editFormladder.detail = JSON.parse(item.detail)
        // this.valTimeFormat(this.editFormladder.detail)
        for (let i = 0; i < this.editFormladder.detail.length; i++) {
          for (let j = 0; j < this.editFormladder.detail[i].ladderDetailDtoList.length; j++) {
            let endT = this.editFormladder.detail[i].ladderDetailDtoList[j].endTime
            let startT = this.editFormladder.detail[i].ladderDetailDtoList[j].startTime
            this.editFormladder.detail[i].ladderDetailDtoList[j].endTime = this.valTimeFormat(endT)
            this.editFormladder.detail[i].ladderDetailDtoList[j].startTime = this.valTimeFormat(startT)
          }
        }
      } else if (this.feeType === 'phase') {
        this.phaseData = item
        this.phaseDataDetail = this.stringToObj(JSON.parse(item.detail))
      }
    },
    // 车辆格式化转变
    carTypeFormat: function (row, column) {
      if (row.carType === 0) {
        return '小车'
      } else if (row.carType === 1) {
        return '大车'
      } else if (row.carType === 2) {
        return '超大车'
      } else if (row.carType === 3) {
        return '摩托车'
      }
    },
    // 点击新增
    addFee () {
      this.addSelectFee = this.feeType
      this.tempType = this.feeType
      console.log(this.addSelectFee)
      if (this.feeType === 'ladder') {
        this.addFormLadder.detail = [{
          carType: 0,
          ladderDetailDtoList: [{
            'endTime': [24],
            'ladderCharge': '0.00',
            'startTime': [0, 0]
          }]
        }, {
          carType: 1,
          ladderDetailDtoList: [{
            'endTime': [24],
            'ladderCharge': '0.00',
            'startTime': [0, 0]
          }]
        }, {
          carType: 2,
          ladderDetailDtoList: [{
            'endTime': [24],
            'ladderCharge': '0.00',
            'startTime': [0, 0]
          }]
        }, {
          carType: 3,
          ladderDetailDtoList: [{
            'endTime': [24],
            'ladderCharge': '0.00',
            'startTime': [0, 0]
          }]
        }]
        this.addFormLadder.memo = ' '
      } else if (this.feeType === 'time') {
        this.addFormTime.memo = ' '
        this.addFormTime.detail = [{
          carType: '0',
          freeTime: {
            time: '0'
          },
          timeCharge: '0.00'
        }, {
          carType: '1',
          freeTime: {
            time: '0'
          },
          timeCharge: '0.00'
        }, {
          carType: '2',
          freeTime: {
            time: '0'
          },
          timeCharge: '0.00'
        }, {
          carType: '3',
          freeTime: {
            time: '0'
          },
          timeCharge: '0.00'
        }]
      } else if (this.feeType === 'interval') {
        this.addFormFee.memo = ' '
        this.addFormFee.detail = [{
          carType: '0',
          available: false,
          freeTime: {
            time: '0',
            isContain: false
          },
          highestFee: '0.00',
          chargeDetailDto: {
            peakPeriodDto: {
              startTime: '7:00',
              endTime: '19:00',
              cash: '0.00',
              each: '30'
            },
            nonPeakPeriodDto: {
              startTime: '19:00',
              endTime: '7:00',
              cash: '0.00',
              each: '30'
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
              startTime: '7:00',
              endTime: '19:00',
              cash: '0.00',
              each: '30'
            },
            nonPeakPeriodDto: {
              startTime: '19:00',
              endTime: '7:00',
              cash: '0.00',
              each: '30'
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
              startTime: '7:00',
              endTime: '19:00',
              cash: '0.00',
              each: '30'
            },
            nonPeakPeriodDto: {
              startTime: '19:00',
              endTime: '7:00',
              cash: '0.00',
              each: '30'
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
              startTime: '7:00',
              endTime: '19:00',
              cash: '0.00',
              each: '30'
            },
            nonPeakPeriodDto: {
              startTime: '19:00',
              endTime: '7:00',
              cash: '0.00',
              each: '30'
            }
          }
        }]
      } else if (this.feeType === 'phase') {
        this.addPhaseData = {
          ruleName: '',
          ruleType: 'phase',
          memo: '',
          uuid: '',
          detail: [{
            phaseDto: {
              firstPhaseDto: {
                cash: 5,
                cycleTime: 360,
                each: 360
              },
              secondPhaseDto: {
                cash: 1,
                cycleTime: 1080,
                each: 120
              }
            },
            carType: 0,
            freeTime: {
              isContain: false,
              time: 0
            },
            available: false,
            highestFee: 0
          }, {
            phaseDto: {
              firstPhaseDto: {
                cash: 5,
                cycleTime: 360,
                each: 360
              },
              secondPhaseDto: {
                cash: 1,
                cycleTime: 1080,
                each: 120
              }
            },
            carType: 1,
            freeTime: {
              isContain: false,
              time: 0
            },
            available: false,
            highestFee: 0
          }, {
            phaseDto: {
              firstPhaseDto: {
                cash: 5,
                cycleTime: 360,
                each: 360
              },
              secondPhaseDto: {
                cash: 1,
                cycleTime: 1080,
                each: 120
              }
            },
            carType: 2,
            freeTime: {
              isContain: false,
              time: 0
            },
            available: false,
            highestFee: 0
          }, {
            phaseDto: {
              firstPhaseDto: {
                cash: 5,
                cycleTime: 360,
                each: 360
              },
              secondPhaseDto: {
                cash: 1,
                cycleTime: 1080,
                each: 120
              }
            },
            carType: 3,
            freeTime: {
              isContain: false,
              time: 0
            },
            available: false,
            highestFee: 0
          }]
        }
      }
      this.dialogAddVisible = true
    },
    updataFeeData () {
      let _this = this
      queryFee().then(function (response) {
        if (response.data.length > 0) {
          _this.feeData = (response.data)
        }
      })
    },
    // 新增保存
    saveFee (feeForm) {
      let errorValidCount = 0
      if (this.tempType === 'time') {
        errorValidCount = document.getElementById('addFeeTimeId').getElementsByClassName('errorValid').length
      } else if (this.tempType === 'interval') {
        errorValidCount = document.getElementById('addFeeIntervalId').getElementsByClassName('errorValid').length
      } else if (this.tempType === 'ladder') {
        errorValidCount = document.getElementById('addFeeLadder').getElementsByClassName('errorValid').length
      }
      // 新增计费标准时,errorValidCount 大于0 不允许提交
      if (errorValidCount > 0) {
        this.$message({
          message: '时间或者价格格式不正确!',
          type: 'error'
        })
      } else {
        let _this = this
        let _params
        if (_this.tempType === 'interval') {
          _params = _this.addFormFee
          for (let i = 0; i < _params.detail.length; i++) {
            _params.detail[i].chargeDetailDto.nonPeakPeriodDto.startTime = _params.detail[i].chargeDetailDto.peakPeriodDto.endTime
            _params.detail[i].chargeDetailDto.nonPeakPeriodDto.endTime = _params.detail[i].chargeDetailDto.peakPeriodDto.startTime
          }
          console.log('feeForm : ' + feeForm)
          console.log(_this.$refs)
          _this.$refs.addFormFee.validate((valid) => {
            if (valid) {
              _this.resSaveFee(_params, feeForm)
            }
          })
        } else if (_this.tempType === 'time') {
          _params = _this.addFormTime
          _this.$refs.addFormTime.validate((valid) => {
            if (valid) {
              _this.resSaveFee(_params, feeForm)
            }
          })
        } else if (_this.tempType === 'ladder') {
          _params = _this.addFormLadder
          _this.$refs.addFormLadder.validate((valid) => {
            if (valid && _this.addLadderValid) {
              _this.resSaveFee(_params, feeForm)
            }
          })
          // if (_this.addFormLadder.name === '') {
          //   _this.$message.error('请输入阶梯名称')
          // } else {
          //   // _this.resSaveFee(_params, feeForm)
          // }
        }
        console.log('_params' + JSON.stringify(_params))
        console.log(this.$refs)
      }
      // this.$refs.feeForm.validate((valid) => {
      //   if (valid) {
      //   }
      // })
    },
    resSaveFee (params, feeForm) {
      let _this = this
      addFee({
        params: JSON.stringify(params)
      }).then(function (response) {
        _this.num = 0
        var errorcode = response.code
        _this.$refs[feeForm].resetFields()
        if (errorcode === '0') {
          _this.$message({message: '新增成功！', type: 'success'})
          _this.loadFeeList()
        } else {
          _this.$error({message: '验证不通过', type: 'error'})
        }
        _this.dialogAddVisible = false
      })
      .catch(function (error) {
        // _this.$refs[feeForm].resetFields()
        console.log('error ' + error)
        _this.$message.error({message: '验证不通过'})
      })
    },
    // 修改保存
    editSaveFee () {
      // 修改计费标准时，errorValid 数量大于0时，不允许提交
      let errorCount = document.getElementById('editFeeId').getElementsByClassName('errorValid').length
      console.log(errorCount)
      if (errorCount > 0) {
        this.$message({
          message: '时间或者价格输入格式不正确!',
          type: 'error'
        })
      } else {
        let _this = this
        let _params
        if (_this.feeType === 'time') {
          _params = _this.editFormTime
          _this.saveEditFee(_params)
        } else if (_this.feeType === 'interval') {
          _params = _this.editFormFee
          for (let i = 0; i < 4; i++) {
            _params.detail[i].chargeDetailDto.nonPeakPeriodDto.endTime = _params.detail[i].chargeDetailDto.peakPeriodDto.startTime
            _params.detail[i].chargeDetailDto.nonPeakPeriodDto.startTime = _params.detail[i].chargeDetailDto.peakPeriodDto.endTime
          }
          _this.saveEditFee(_params)
        } else if (_this.feeType === 'ladder') {
          _params = _this.editFormladder
          if (_this.editLadderValid) {
            _this.saveEditFee(_params)
          } else {
            _this.$message.error({message: '验证没通过'})
          }
        } else if (_this.feeType === 'phase') {
          _params = _this.$refs.phaseFee.phaseData
          _params.detail = _this.$refs.phaseFee.phaseDataDetail
          if (!_this.$refs.phaseFee.phaseNameValid && _this.$refs.phaseFee.editPhase) {
            _this.saveEditFee(_params)
          }
        }
      }
    },
    saveEditFee (_params) {
      let _this = this
      _params.ruleName = _this.feeName
      if (_this.feeType === 'phase') {
        _params.ruleName = _this.$refs.phaseFee.ruleName
        // _params.memo = _this.$refs.phaseFee.memo
      } else {
        _params.memo = _this.memo
      }
      _params.ruleType = _this.feeType
      _params.id = _this.feeId
      // console.log(_params.detail.freeTime)
      if (_params.ruleName === '') {
        _this.$message({message: '计费规则名称不能为空!', type: 'warning'})
        return false
      }
      console.log(this.nameValid)
      if (this.nameValid) {
        return false
      }
      console.log('_params' + JSON.stringify(_params))
      updateCharge({
        params: JSON.stringify(_params)
      }).then(function (response) {
        let errorcode = response.code
        if (errorcode === '0') {
          _this.$message({message: '修改成功！', type: 'success'})
          _this.num = 0
          _this.updataFeeData()
        } else if (errorcode === '-1') {
          _this.$message.error({message: response.message || '验证不通过', type: 'error'})
        } else {
          _this.$message.error({message: '验证不通过', type: 'error'})
        }
      })
      .catch(function (error) {
        _this.updataFeeData()
        console.log(error)
      })
    },
    //  删除计费信息
    deleteFee () {
      var _this = this
      var feeId = _this.feeId
      _this
        .$confirm('是否要删除此计费信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          deleteFee(feeId)
            .then(function (response) {
              var errorcode = response.code
              if (errorcode === '0') {
                _this.$alert('删除成功', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    _this.loadFeeList()
                    _this.num = 0
                  }
                })
              } else if (errorcode === 'parkinglot.fee.rule.plate.number.repeate') {
                _this.$alert('计费信息已授权使用，删除失败!', '提示', {
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
    // 新增时切换车辆类型
    checkCarType (event) {
      this.carText = event.currentTarget.textContent
      this.addShowDetail = true
      if (this.carText === '小车') {
        this.carTypeIndex = 0
      } else if (this.carText === '大车') {
        this.carTypeIndex = 1
      } else if (this.carText === '超大车') {
        this.carTypeIndex = 2
      } else if (this.carText === '摩托车') {
        this.carTypeIndex = 3
      }
      this.addFormFee.detail[this.carTypeIndex].carType = this.carTypeIndex
    },
    addLadder () {
      let len = this.addFormLadder.detail[this.addLaderIndex].ladderDetailDtoList.length - 1
      if (this.addFormLadder.detail[this.addLaderIndex].ladderDetailDtoList[len].startTime.length > 0) {
        this.addFormLadder.detail[this.addLaderIndex].ladderDetailDtoList.push({
          'endTime': [24],
          'ladderCharge': '0.00',
          'startTime': [],
          'ladderValid': false
        })
      } else {
        this.$message({
          message: '请先选择开始时间',
          type: 'warning'
        })
      }
      this.addFormLadder.detail[this.addLaderIndex].ladderDetailDtoList[len].endTime = []
      this.addLadderValid = false
    },
    changeLadderTime (i, val) {
      this.addFormLadder.detail[this.addLaderIndex].ladderDetailDtoList[i].endTime = val
      this.addFormLadder.detail[this.addLaderIndex].ladderDetailDtoList[i + 1].startTime = val
      let sTime = this.addFormLadder.detail[this.addLaderIndex].ladderDetailDtoList[i].startTime
      let endTime = val
      this.addLadderCompare(sTime, endTime, i)
      if (this.ladderValid && i < this.addFormLadder.detail[this.addLaderIndex].ladderDetailDtoList.length - 2) {
        let eTime = this.addFormLadder.detail[this.addLaderIndex].ladderDetailDtoList[i + 1].endTime
        this.addLadderCompare(endTime, eTime, i + 1)
      }
    },
    addLadderCompare (sTime, endTime, i) {
      let sHour = sTime[0] || 0
      let sMinit = sTime[1] || 0
      let eHour = endTime[0] || 0
      let eMinit = endTime[1] || 0
      if (eHour > sHour) {
        this.addLadderValid = true
        this.addFormLadder.detail[this.addLaderIndex].ladderDetailDtoList[i].ladderValid = true
      } else if (eHour === sHour) {
        if (eMinit && eMinit > sMinit) {
          this.addLadderValid = true
          this.addFormLadder.detail[this.addLaderIndex].ladderDetailDtoList[i].ladderValid = true
        } else {
          this.addFormLadder.detail[this.addLaderIndex].ladderDetailDtoList[i].ladderValid = false
          this.addLadderValid = false
          this.$message({message: '结束时间必须大于开始时间', type: 'warning'})
        }
      } else {
        this.addFormLadder.detail[this.addLaderIndex].ladderDetailDtoList[i].ladderValid = false
        this.addLadderValid = false
        this.$message({message: '结束时间必须大于开始时间', type: 'warning'})
      }
    },
    minusLadder () {
      this.addLadderValid = true
      this.addFormLadder.detail[this.addLaderIndex].ladderDetailDtoList.pop()
    },
    setLadderTime () {
      let child = [{
        value: 15,
        label: '15分钟'
      }, {
        value: 30,
        label: '30分钟'
      }, {
        value: 45,
        label: '45分钟'
      }]
      for (let i = 0; i <= 24; i++) {
        if (i === 24) {
          this.ladderOpt.push({
            'value': i,
            'label': i + '小时',
            disabled: true
          })
        } else {
          this.ladderOpt.push({
            'value': i,
            'label': i + '小时',
            'children': child
          })
        }
      }
    },
    ladderTabClick (tab, event) {
      this.addLaderIndex = tab.index
    },
    addSelect (val) {
      this.tempType = val
    },
    changeEditTime (index, i, val) {
      console.log('val ' + val)
      let len = this.editFormladder.detail[index].ladderDetailDtoList.length - 2
      // console.log('i' + i + 'len : ' + len)
      let sTime = this.editFormladder.detail[index].ladderDetailDtoList[i].startTime
      let endTime = val
      this.editFormladder.detail[index].ladderDetailDtoList[i].endTime = endTime
      this.compareTime(sTime, endTime)
      // console.log(this.editLadderValid)
      if (this.editLadderValid && i < len) {
        let eTime = this.editFormladder.detail[index].ladderDetailDtoList[i + 2].startTime
        console.log('endTime' + endTime + ': ' + eTime)
        this.compareTime(endTime, eTime)
      }
    },
    compareTime (sTime, endTime) {
      let sHour = sTime[0] || 0
      let sMinit = sTime[1] || 0
      let eHour = endTime[0] || 0
      let eMinit = endTime[1] || 0
      if (eHour > sHour) {
        this.editLadderValid = true
      } else if (eHour === sHour) {
        if (eMinit && eMinit > sMinit) {
          this.editLadderValid = true
        } else {
          this.editLadderValid = false
          this.$message({message: '结束时间必须大于开始时间', type: 'warning'})
        }
      } else {
        this.editLadderValid = false
        this.$message({message: '结束时间必须大于开始时间', type: 'warning'})
      }
    },
    editLadderPlus (index) {
      let len = this.editFormladder.detail[index].ladderDetailDtoList.length - 1
      console.log(this.editFormladder.detail[index].ladderDetailDtoList[len].startTime)
      if (this.editFormladder.detail[index].ladderDetailDtoList[len].startTime.length !== 0) {
        this.editFormladder.detail[index].ladderDetailDtoList.push({
          'endTime': [24],
          'ladderCharge': '0.00',
          'startTime': []
        })
      } else {
        this.$message({
          message: '请先选择上一个时间段',
          type: 'warning'
        })
      }
      this.editLadderValid = false
    },
    editLadderMinus (index) {
      this.editLadderValid = true
      let len = this.editFormladder.detail[index].ladderDetailDtoList.length - 2
      this.editFormladder.detail[index].ladderDetailDtoList[len].endTime = [24]
      this.editFormladder.detail[index].ladderDetailDtoList.pop()
    },
    stringToObj (stringObj) {
      for (let i = 0; i < stringObj.length; i++) {
        if (typeof stringObj[i].freeTime.isContain === 'string') {
          stringObj[i].freeTime.isContain = JSON.parse(stringObj[i].freeTime.isContain)
          stringObj[i].available = JSON.parse(stringObj[i].available)
        }
      }
      return stringObj
    },
    regexpNum (val) {
      let reg = /^((?!0[0-9])\d+(\.\d{1,2})?)$/
      if (!reg.test(val)) {
        this.$message.error('只能输入整数或者小数后两位')
        this.feeValid = false
      } else if (val > 1000) {
        this.$message.error('价格不能超过1000元')
        this.feeValid = false
      } else {
        this.feeValid = true
      }
    },
    regexpTime (val) {
      console.log(event)
      let reg = /^(0|[1-9][0-9]*)$/
      if (!reg.test(val)) {
        this.$message.error('时间只能输入整数')
        this.feeValid = false
      } else if (val > 1440) {
        this.$message.error('时间不能超过1440分钟')
        this.feeValid = false
      } else if (val % 5 !== 0) {
        this.$message.error('时间必须为5分钟倍数')
        this.feeValid = false
      } else {
        this.feeValid = true
      }
    },
    valTimeFormat (val) {
      let arrString = val.replace(/[\u4E00-\u9FA5]/g, ',').split(',,')
      let arrNubs = []
      for (let i = 0; i < arrString.length; i++) {
        if (arrString[i] !== '') {
          arrNubs.push(Number(arrString[i]))
        }
      }
      return arrNubs
    },
    validName () {
      let regexp = new RegExp("[`·~!@#$%+^&*\\-_()=|{}'/\\\\:;'\"\",\\[\\].<>/?！#￥……&*（）——【】‘’；：”“。，、？]")
      console.log('tempName : ' + this.tempName)
      if (this.feeName === '') {
        this.nameValid = true
        this.nameError = '计费名称不能为空'
      } else if (regexp.test(this.feeName)) {
        this.nameValid = true
        this.nameError = '计费名称不能为特殊字符'
      } else {
        if (this.tempName !== this.feeName) {
          this.feeIsEx(encodeURI(this.feeName))
        }
      }
    },
    feeIsEx (value) {
      let _this = this
      feeIsExist(value).then(function (response) {
        let errorcode = response.code
        if (errorcode === '0') {
          if (response.data.isExist) {
            _this.nameValid = true
            _this.nameError = '计费名称已存在'
          } else {
            _this.nameValid = false
          }
        }
      })
    },
    timeFormatLadder (time) {
      return time.replace(/[\u4E00-\u9FA5]/g, ',').split(',,')
    },
    closeDialog (str) {
      if (str === 'save') {
        this.loadFeeList()
      }
      this.dialogAddVisible = false
    },
    cancleDialogAddVisible () {
      this.dialogAddVisible = false
      if (this.$refs.addFormTime) {
        this.$refs.addFormTime.resetFields()
      } else if (this.$refs.addFormFee) {
        this.$refs.addFormFee.resetFields()
      } else if (this.$refs.addFormLadder) {
        this.$refs.addFormLadder.resetFields()
      }
    },
    errorMinuteParam (val) {
      let flag = false
      let reg = /^(0|[1-9][0-9]*)$/
      if (!reg.test(val)) {
        flag = false
      } else if (val - 1440 > 0) {
        flag = false
      } else if (val % 5 !== 0) {
        flag = false
      } else {
        flag = true
      }
      return flag
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/views/ParkingLotApp/assets/css/parkLotApp.less";
</style>

