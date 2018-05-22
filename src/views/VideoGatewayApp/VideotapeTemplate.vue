<template>
  <div>
    <section class="el-container">
      <aside style="width: 160px;">
        <ul class="template-lists">
          <li v-for="(item, index) in templateList" :class="{'active': index===activeTempIndex}" @click="tempClick(item, index)" :key="index">
            <el-input v-model="rangeData.templateName" v-if="index===activeTempIndex && isEdit" class="template-name-edit" :autofocus="true" placeholder="请输入模板名称" :maxlength="30"></el-input>
            <span v-else>{{item.templateName}}</span>
          </li>
        </ul>
      </aside>
      <main class="el-main">
        <div class="toolbar">
          <div class="pull-left" v-show="isEdit">
            <el-radio-group v-model="currentPlanType" :fill="currentPlanType==='0'?'#1D8CE0':'#F58E50'">
              <el-radio-button label="0">计划录像</el-radio-button>
              <el-radio-button label="1">移测录像</el-radio-button>
            </el-radio-group>
          </div>
          <div class="pull-right" v-show="isEdit">
            <el-button icon="delete" @click="handleClear">清空</el-button>
          </div>
        </div>
        <plan-group label-width="80px" action-width="62px">
          <plan :disabled="!isEdit" v-for="(value,index) in dateKey" :key="value" :current-type="currentPlanType" :custom-range-class="customRangeClass" v-model="rangeData[value]" @mouseenter="handleMouseEnter(index)" :maxRangeCount="8" :step="1">
            <span slot="label">{{week[index]}}</span>
            <el-popover slot="action" :ref="'popover'+index" placement="left" title="复制到" width="400" trigger="click" @show="handlePopShow" @hide="handlePopHide">
              <div class="tempalate-copy-popover">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="checkedDays" @change="handleCheckedDaysChange">
                  <el-checkbox v-for="(day,index) in week" :label="index" :key="day">{{day}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="closePopover(index)">取消</el-button>
                <el-button type="primary" size="mini" @click="handleCopyConfirm(index)">确定</el-button>
              </div>
              <el-button v-show="isEdit" :class="{'btn-plan-copy':true,'show':focus===index}" icon="document" slot="reference" style="padding: 8px 10px;">复制</el-button>
            </el-popover>
          </plan>
        </plan-group>
        <div class="template-handle-box" v-if="isCanEdit">
          <div v-if="!isEdit">
            <el-button type="primary" @click="doEdit">点击修改</el-button>
          </div>
          <div v-else>
            <el-button @click="doCancel">取消</el-button>
            <el-button type="primary" @click="doConfirm">确认</el-button>
          </div>
        </div>
      </main>
    </section>
  </div>
</template>
<script>
import { getTemplateData, postSaveTemplateData } from './apis/videoTemp'
import { copyObject } from '../../packages/utils/util'
const week = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
const dateKey = ['mondaySchedule', 'tuesdaySchedule', 'wednesdaySchedule', 'thursdaySchedule', 'fridaySchedule', 'saturdaySchedule', 'sundaySchedule']

export default {
  name: 'videotapeTemplate',
  data () {
    return {
      week: week,
      dateKey: dateKey,
      checkedDays: [],
      currentPlanType: 0,
      templateList: [], // 模板列表
      rangeData: {},
      tempRaneData: {},
      activeTempIndex: 0,
      lastTempIndex: -1,
      customRangeClass: {
        '0': 'range-color1',
        '1': 'range-color2'
      },
      focus: 0,
      isPopoverShow: false,
      popVisible: false,
      checkAll: false,
      isIndeterminate: false,
      isEdit: false,
      isCanEdit: false, // 模板能否被修改
      noEditIndex: [0, 1], // 模板不能被修改的下标
      emptyTemplate: {
        templateId: '',
        templateName: '',
        mondaySchedule: [],
        tuesdaySchedule: [],
        wednesdaySchedule: [],
        thursdaySchedule: [],
        fridaySchedule: [],
        saturdaySchedule: [],
        sundaySchedule: []
      }
    }
  },
  mounted () {
    // 获取模板数据
    getTemplateData().then((rs) => {
      let tempSort = ['全天候模板', '周末模板', '自定义模板']
      this.templateList = rs.sort(
        (a, b) => {
          let aIndex = tempSort.indexOf(a.templateName)
          let bIndex = tempSort.indexOf(b.templateName)
          if (aIndex === -1) aIndex = rs.length
          if (bIndex === -1) bIndex = rs.length
          return aIndex - bIndex
        }
      )
      this.focusTemplate(0)
    })
  },
  methods: {
    // 点击清除按钮
    handleClear () {
      dateKey.forEach(val => {
        this.rangeData[val] = []
      })
    },
    // 打开提示框回调函数
    handlePopShow () {
      this.isPopoverShow = true
    },
    // 关闭提示框回调函数
    handlePopHide () {
      this.checkAll = false
      this.checkedDays = []
      this.isIndeterminate = false
      this.isPopoverShow = false
    },
    // 鼠标悬停提示
    handleMouseEnter (index) {
      if (!this.isPopoverShow) {
        this.focus = index
      }
    },
    // 关闭提示框
    closePopover (index) {
      this.$refs['popover' + index][0].doClose()
    },
    // 确定复制
    handleCopyConfirm (index) {
      const currentData = this.rangeData[dateKey[index]]
      this.checkedDays.forEach(val => {
        this.rangeData[dateKey[val]] = copyObject(currentData)
      })
      this.closePopover(index)
    },
    // 勾选全选框
    handleCheckAllChange (isChecked) {
      this.checkedDays = isChecked ? [0, 1, 2, 3, 4, 5, 6] : []
      this.isIndeterminate = false
    },
    // 复制时选择星期几
    handleCheckedDaysChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.week.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.week.length
    },
    // 显示哪一个模板
    focusTemplate (index) {
      index = index <= 0 ? 0 : index
      this.activeTempIndex = index
      this.rangeData = this.templateList[index]
      this.isCanEdit = this.noEditIndex.indexOf(index) === -1
    },
    // 模板点击事件
    tempClick (activeTab, index) {
      if (this.isEdit === true) return
      this.focusTemplate(index)
      this.isEdit = false
    },
    // 点击修改事件
    doEdit () {
      this.isEdit = true
      this.tempRaneData = copyObject(this.rangeData)
    },
    // 点击确认事件
    doConfirm () {
      if (!this.rangeData.templateName) {
        this.$message({ type: 'warning', message: '请输入模板名称' })
        return
      }
      postSaveTemplateData(this.rangeData).then((rs) => {
        this.isEdit = false
        this.tempRaneData = {}
        this.$message({ type: 'success', message: '保存成功！' })
      }).catch(() => {
      })
    },
    // 点击取消事件
    doCancel () {
      this.isEdit = false
      this.rangeData = copyObject(this.tempRaneData)
    }
  }
}
</script>
<style lang="less" scoped>
.tempalate-copy-popover {
  .el-checkbox {
    margin: 0 30px 0 0;
  }
}
.template-lists {
  margin-right: 25px;
  li {
    display: block;
    height: 28px;
    line-height: 28px;
    border: 1px solid #ccc;
    padding: 6px 15px;
    margin-bottom: 5px;
    text-align: center;
    cursor: pointer;
    color: #333;
    span {
      display: inline-block;
      font-size: 14px;
    }
    &.active {
      color: #fff;
      background: #409eff;
      border-color: #409eff;
    }
  }
}
.template-handle-box {
  text-align: center;
  margin-top: 20px;
}
.template-name-edit {
  position: relative;
  top: -6px;
  width: 132px;
  left: -15px;
  height: 40px;
}
</style>
