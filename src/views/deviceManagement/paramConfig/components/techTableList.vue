<template>
  <div class="child-container attr-container">
    <span class="tech-title">{{title}}</span>
    <div v-show="attrsTableData.length===0">该设备暂无参数数据</div>
    <el-row :gutter="20">
      <el-col :span="8" v-for="(item, index) in attrsTableData" :key="index" >
        <div class="grid-content bg-purple attr-content">
          <input-box v-if="item.attrDataType==='string'" :title="item.attrDesc"
                     :code="item.attrDesc"
                     :ref="item.attrDesc"
                     :required="item.required"
                     :append="item.unitDesc"
                     @listenToInput="_savePropData"
                     :disabled="item.attrType==='device_attribute'"
                     :value="item.attrValue">
          </input-box>
          <input-box v-if="item.attrDataType === 'integer'" :title="item.attrDesc"
                     :code="item.attrDesc"
                     :ref="item.attrDesc"
                     type="num"
                     :append="item.unitDesc"
                     @listenToInput="_savePropData"
                     :required="item.required"
                     :disabled="item.attrType==='device_attribute'"
                     :value="item.attrValue">
          </input-box>
          <select-box v-if="item.attrDataType === 'select'" :title="item.attrDesc"
                      :code="item.attrDesc"
                      :ref="item.attrDesc"
                      :options="item.selectData"
                      @listenToInput="_savePropData"
                      :required="item.required"
                      :disabled="item.attrType==='device_attribute'"
                      :initValue="item.attrValue">
          </select-box>
          <select-box v-if="item.attrDataType === 'boolean'" :title="item.attrDesc"
                      :code="item.attrDesc"
                      :ref="item.attrDesc"
                      :options="boolOption"
                      @listenToInput="_savePropData"
                      :required="item.required"
                      :disabled="item.attrType==='device_attribute'"
                      :initValue="item.attrValue">
          </select-box>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import inputBox from '../../register/components/inputBox'
  import selectBox from '../../register/components/selectBox'

  export default {
    components: {
      inputBox,
      selectBox
    },
    data () {
      return {
        title: '',
        attrsTableData: [],
        rowData: {},
        boolOption: [{
          value: 'Yes',
          label: 'Yes'
        }, {
          value: 'No',
          label: 'No'
        }]
      }
    },
    methods: {
      loadDetailParamTable (row) {
        // 获取title和技术参数信息
        this.rowData = row
        this.title = row.deviceTypeDesc + row.deviceCode
        this.attrsTableData = row.attributeList
      },
      _savePropData (data) {
        for (var key in data) {
          for (let i = 0; i < this.attrsTableData.length; i++) {
            var item = this.attrsTableData[i]
            if (item.attrDesc === key) {
              this.attrsTableData[i]['attrValue'] = data[key]
            }
          }
        }
        this.rowData['attributeList'] = this.attrsTableData
        this.$emit('listenToParamCollected', this.rowData)
      },
      clearData () {
        this.attrsTableData = []
      }
    }
  }
</script>
