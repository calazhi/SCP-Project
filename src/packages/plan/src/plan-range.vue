<template>
  <div>
    <el-popover ref="popover" :value="isShowPopover" :disabled="!showPopover" placement="top" :width="popoverWidth" trigger="manual" @show="handlePopoverShow">
      <div v-if="!disabled">
        <el-time-select placeholder="起始时间" v-model="startTime" :clearable="false" :picker-options="{start: '00:00', step: parseStep, end: '24:00', minTime: minTime, maxTime: endTime}" ref="begin-time">
        </el-time-select>
        -
        <el-time-select placeholder="结束时间" v-model="endTime" :clearable="false" :picker-options="{start: '00:00', step: parseStep, end: '24:00', minTime: startTime, maxTime: maxTime}" ref="end-time">
        </el-time-select>
        <div style="text-align: right; margin: 10px 0 0;">
          <el-button size="mini" type="text" @click="destroy">删除</el-button>
          <el-button size="mini" type="primary" @click="save">保存</el-button>
        </div>
      </div>
      <div v-else style="text-align:center;">
        {{startTime}} - {{endTime}}
      </div>
    </el-popover>
    <div v-popover:popover :class="['h-plan-range', isActive?'active':'', customClass]" :style="rangeStyle" @mousedown="handleMouseDown" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <drag-handle v-if="!disabled" ref="firstDragHandle" v-model="value.from" :align="firstAlign" :active="isActive" @dragStart="handleDragStart" @dragEnd="handleDragEnd"></drag-handle>
      <drag-handle v-if="!disabled" ref="secondDragHandle" v-model="value.to" :align="secondAlign" :active="isActive" @dragStart="handleDragStart" @dragEnd="handleDragEnd"></drag-handle>
    </div>
  </div>
</template>

<script>
import merge from 'deepmerge'
import DragHandle from './plan-range-draghandle'
import { pixelToSecond, secondToPixel, timeFormat, timeToSecond } from './util'

export default {
  components: {
    DragHandle
  },

  props: {
    value: Object,
    limitRange: Array
  },

  data () {
    return {
      isActive: false,
      dragging: false,
      handleDragging: false,
      startX: null,
      currentX: null,
      startMinValue: null,
      startMaxValue: null,
      startTime: null,
      endTime: null
    }
  },

  computed: {
    disabled () {
      return this.$parent.$parent.disabled
    },

    panelWidth () {
      return this.$parent.$parent.panelWidth
    },

    popoverWidth () {
      return this.disabled ? 120 : 235
    },

    isShowPopover () {
      return this.isActive && !this.dragging && !this.handleDragging
    },

    showPopover () {
      return this.$parent.$parent.showPopover
    },

    rangeStyle () {
      return {
        width: secondToPixel(this.maxValue - this.minValue, this.panelWidth) + 'px',
        left: secondToPixel(this.minValue, this.panelWidth) + 'px'
      }
    },

    minValue () {
      return Math.min(this.value.from, this.value.to)
    },

    maxValue () {
      return Math.max(this.value.from, this.value.to)
    },

    firstAlign () {
      return this.value.from < this.value.to ? 'left' : 'right'
    },

    secondAlign () {
      return this.firstAlign === 'left' ? 'right' : 'left'
    },

    minTime () {
      return this.limitRange[0] ? timeFormat(this.limitRange[0] - this.step) : null
    },

    maxTime () {
      return timeFormat(this.limitRange[1] + this.step)
    },

    step () {
      return this.$parent.step
    },

    parseStep () {
      return timeFormat(this.step)
    },

    customClass () {
      let customRangeClass = this.$parent.$parent.customRangeClass || {}
      return customRangeClass[this.value.type] || ''
    }
  },

  watch: {
    'isActive': 'keyHandle'
  },

  created () {
    // !this.disabled && window.addEventListener('click', this.handleCancel)
    window.addEventListener('click', this.handleCancel) // liangjiongsheng 2018.1.29
  },

  destroyed () {
    window.removeEventListener('click', this.handleCancel)
  },

  updated () {
    this.isActive && this.$refs.popover && this.$refs.popover.updatePopper()
  },

  methods: {
    handlePopoverShow () {
      this.startTime = timeFormat(this.value.from)
      this.endTime = timeFormat(this.value.to)
      if (this.$refs['begin-time']) this.$refs['begin-time'].$children[0].setCurrentValue(this.startTime) // liangjiongsheng 2018.1.27
      if (this.$refs['end-time']) this.$refs['end-time'].$children[0].setCurrentValue(this.endTime) // liangjiongsheng 2018.1.27
    },
    valueFormat (val) {
      console.log(val)
    },
    parseTime (val) {
      return timeFormat(val)
    },

    // 键盘删除事件
    keyHandle (val) {
      if (val) {
        window.addEventListener('keyup', this.handleKeyUp)
      } else {
        window.removeEventListener('keyup', this.handleKeyUp)
      }
    },

    startHandleDrag (val) {
      this.isActive = true
      this.handleDragging = true
      this.displayTooltip()
      this.$refs['secondDragHandle'].setPosition(val)
    },

    stopHandleDrag () {
      this.handleDragging = false
      this.isActive = true
    },

    handleKeyUp (event) {
      if (event.keyCode === 8 || event.keyCode === 46) {
        // this.destroy() // 与时间输入框冲突 2018.1.25 liangjiongsheng
      }
    },

    handleCancel (event) {
      if (!this.dragging && !this.handleDragging) {
        this.isActive = false
      }
    },

    handleDragStart () {
      this.displayTooltip()
      this.handleDragging = true
    },

    handleDragEnd () {
      /* liangjiongsheng 2018.1.27 add begin */
      if (this.value.from > this.value.to) {
        let tepmVal = this.value.from
        this.value.from = this.value.to
        this.value.to = tepmVal
      }
      /* liangjiongsheng 2018.1.27 add end */
      this.hideTooltip()
      this.handleDragging = false
    },

    displayTooltip () {
      this.$refs['firstDragHandle'].displayTooltip()
      this.$refs['secondDragHandle'].displayTooltip()
    },

    hideTooltip () {
      this.$refs['firstDragHandle'].hideTooltip()
      this.$refs['secondDragHandle'].hideTooltip()
    },

    handleMouseEnter () {
      if (this.disabled) {
        this.isActive = true
      }
    },

    handleMouseLeave () {
      if (this.disabled) {
        this.isActive = false
      }
    },

    handleMouseDown (event) {
      this.isActive = true
      event.preventDefault()
      event.cancelBubble = true
      if (!this.disabled) {
        this.onDragStart(event)
        window.addEventListener('mousemove', this.onDragging)
        window.addEventListener('mouseup', this.onDragEnd)
        window.addEventListener('contextmenu', this.onDragEnd)
      }
    },

    onDragStart () {
      this.dragging = true
      this.startX = event.clientX
      this.startMinValue = this.minValue
      this.startMaxValue = this.maxValue
    },

    onDragging (event) {
      if (this.dragging) {
        this.currentX = event.clientX
        this.setPosition()
      }
    },

    onDragEnd () {
      if (this.dragging) {
        /*
         * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
         * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
         */
        setTimeout(() => {
          this.dragging = false
        }, 0)

        this.hideTooltip()

        window.removeEventListener('mousemove', this.onDragging)
        window.removeEventListener('mouseup', this.onDragEnd)
        window.removeEventListener('contextmenu', this.onDragEnd)
      }
    },

    setPosition () {
      let diff = pixelToSecond(this.currentX - this.startX, this.panelWidth)
      let steps = Math.round(diff / this.step)

      diff = steps * this.step
      diff = (this.startMinValue + diff < this.limitRange[0]) ? this.limitRange[0] - this.startMinValue : diff
      diff = (this.startMaxValue + diff > this.limitRange[1]) ? this.limitRange[1] - this.startMaxValue : diff
      this.$emit('input', merge(this.value, {
        from: this.startMinValue + diff,
        to: this.startMaxValue + diff
      }))

      if (!diff) return
      this.displayTooltip()
    },

    save () {
      // 时间校验 2018.1.27 liangjiongsheng start
      let startValue = this.$refs['begin-time'].$children[0].currentValue
      let endValue = this.$refs['end-time'].$children[0].currentValue

      let regObj = /^(((20|21|22|23|[0-1]\d):[0-5]\d)|(24:00))$/
      if (!regObj.test(startValue)) {
        this.$message({ type: 'warning', message: '开始时间不正确，时间格式为XX:XX，不够两位前面补0' })
        this.$refs['begin-time'].$children[0].focus()
        return
      }
      if (!regObj.test(endValue)) {
        this.$message({ type: 'warning', message: '结束时间不正确，时间格式为XX:XX，不够两位前面补0' })
        this.$refs['end-time'].$children[0].focus()
        return
      }
      if (timeToSecond(endValue) < timeToSecond(startValue)) {
        this.$message({ type: 'warning', message: '开始时间不能大于结束时间' })
        this.$refs['end-time'].$children[0].focus()
        return
      }
      if (timeToSecond(endValue) === timeToSecond(startValue)) {
        this.$message({ type: 'warning', message: '开始时间不能等于结束时间' })
        this.$refs['end-time'].$children[0].focus()
        return
      }
      let minVal = this.limitRange[0] ? timeFormat(this.limitRange[0]) : '00:00'
      let maxVal = this.limitRange[1] ? timeFormat(this.limitRange[1]) : '24:00'
      if (timeToSecond(startValue) < timeToSecond(minVal) || timeToSecond(startValue) > timeToSecond(endValue)) {
        this.$message({ type: 'warning', message: '开始时间范围' + minVal + '到' + endValue })
        this.$refs['begin-time'].$children[0].focus()
        return
      }
      if (timeToSecond(endValue) < timeToSecond(startValue) || timeToSecond(endValue) > timeToSecond(maxVal)) {
        this.$message({ type: 'warning', message: '结束时间范围' + startValue + '到' + maxVal })
        this.$refs['end-time'].$children[0].focus()
        return
      }

      // 时间校验 2018.1.27 liangjiongsheng end
      this.isActive = false
      this.$emit('input', merge(this.value, {
        from: timeToSecond(startValue), // liangjiongsheng 2018.1.29
        to: timeToSecond(endValue) // liangjiongsheng 2018.1.29
      }))
    },

    destroy () {
      this.isActive = false
      this.$emit('destroy')
    }
  }
}
</script>

<style scoped>
.el-date-editor.el-input {
  width: 100px;
}
</style>

