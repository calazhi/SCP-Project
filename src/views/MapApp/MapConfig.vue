<template>
  <div class="map-app">
    <div class="page-content">
      <div class='title'>基 础 配 置 信 息 展 示</div>
      <!--tablelist-->
      <div class="row-flow clearfix fit-flex-item table-list">
        <el-table :data="tableData" border class="row-flow " ref="multipleTable" @selection-change="handleSelectionChange" stripe>
          <el-table-column type="index" label="序号" width="70px"></el-table-column>
          <el-table-column prop="configType" label="基础配置项类型" width="160px"></el-table-column>
          <el-table-column prop="configName" label="基础配置项名称" width="160px"></el-table-column>
          <el-table-column prop="configValue" label="基础配置项值" width="160px"></el-table-column>
          <el-table-column prop="memo" label="基础配置项描述" width="386px" show-overflow-tooltip style="min-width:80px"></el-table-column>
          <el-table-column label="操作" width="183">
            <template slot-scope="scope">
              <el-button @click="onItemEdit(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <base-config-edit ref="BaseConfigEdit" @freshTable="onGetPageData()"></base-config-edit>
  </div>
</template>

<script>
import { getMapSetting, getDictionary } from '@/views/MapApp/apis/index.js'
import { LOG_TAG } from '@/views/MapApp/assets/js/index.js'
import BaseConfigEdit from '@/views/MapApp/components/BaseConfigEdit.vue'
export default {
  components: {
    BaseConfigEdit
  },
  data () {
    return {
      tableData: [
      ],
      multipleSelection: [],
      configType: [],
      pageData: [
        {
          configType: '测试数据-停车场',
          configName: '/map/scenemap/02/park01.jpg',
          configValue: '110.121332',
          memo: '45.123343'
        },
        {
          configType: '测试数据-停车场',
          configName: '/map/scenemap/02/park01.jpg',
          configValue: '110.121332',
          memo: '45.123343'
        }
      ]
    }
  },
  mounted: function () {
    let that = this
    getDictionary().then(res => {
      that.configType = res.data.data.dictCodeType.configType
      console.log(that.configType)
      that.onGetPageData()
    })
    // this.params = this.param
  },
  created: function () {
  },
  methods: {
    /**
   *@description 刷新数据列表
   */
    onGetPageData: function () {
      let that = this
      getMapSetting().then((res) => {
        if (res.data.code === '00000') {
          that.tableData = res.data.data
          for (let i = 0; i < that.tableData.length; i++) {
            for (let j = 0; j < that.configType.length; j++) {
              if (that.tableData[i].configType === that.configType[j].itemCode) {
                that.tableData[i].configType = that.configType[j].itemName
              }
            }
          }
        } else {
          this.$message({
            message: '网络异常，请重试',
            type: 'warning'
          })
        }
      }).catch(err => {
        console.log(LOG_TAG + 'getScenePageList刷新列表数据err')
        console.warn(err)
      })
    },
    /**
    *@description 基础配置项编辑
    *@param {obj} row 场景信息
    */
    onItemEdit: function (row) {
      // 弹窗传值
      console.log(row)
      this.$refs['BaseConfigEdit'].form.configValue = row.configValue
      this.$refs['BaseConfigEdit'].form.configName = row.configName
      this.$refs['BaseConfigEdit'].form.id = row.id
      this.$refs['BaseConfigEdit'].dialogVisible = true
    },
    /**
    *@description table选择事件
    */
    handleSelectionChange: function (val) {
      this.multipleSelection = val
    },
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.row-flow {
  width: 100%;
  height: 100%;
}
.clearfix {
  clear: both;
}
.map-app {
  box-sizing: border-box;
  position: relative;
  top: 30px;
  bottom: 20px;
  /deep/.cell {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
  }
  .page-content {
    margin: 0 auto;
    max-width: 1120px;
  }
  .title {
    margin: 0 auto;
    width: 1120px;
    margin-bottom: 20px;
    font-size: 36px;
    display: inline-block;
    text-align: center;
    font-weight: 400;
  }
  .table-list {
    display: flex;
  }
}
</style>
