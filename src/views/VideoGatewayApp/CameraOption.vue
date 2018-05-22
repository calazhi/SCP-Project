<template>
  <div>
    <el-form :inline="true" :model="searchData" ref="searchForm">
      <el-form-item label="设备名称">
        <el-input v-model="searchData.deviceName" clearable placeholder="请输入设备名称" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search(1)">查询</el-button>
      </el-form-item>
      <el-table :data="cameraList" border style="margin-top:30px" ref="cameraList">
        <el-table-column align="center" prop="deviceName" label="设备名称"></el-table-column>
        <el-table-column align="center" prop="deviceTypeName" label="设备类型"></el-table-column>
        <el-table-column align="center" prop="deviceIP" label="IP地址"></el-table-column>
        <el-table-column align="center" prop="devicePort" label="端口"></el-table-column>
        <el-table-column align="center" prop="installAddress" label="安装地址"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="onBtnModify(scope.$index, scope.row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="video-pagination">
        <el-pagination @size-change="onPageSizeChange" @current-change="search" :current-page="curPageNo" :page-sizes="[10, 20, 50]" :page-size="searchData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="numTotal">
        </el-pagination>
      </div>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="80%" ref="cameraDialog">
      <iframe frameborder="0" width="100%" height="660px" ref="cameraIframe"></iframe>
    </el-dialog>
  </div>
</template>
<script>

import { getCameraListData } from '@/views/VideoGatewayApp/apis/cameraOption.js'

export default {
  name: 'videoDevice',
  data () {
    return {
      searchData: { // 请求参数
        deviceName: '',
        pageNo: 0,
        pageSize: 20
      },
      cameraIp: '', // ip
      cameraPort: 80, // 端口
      numTotal: 0,
      curPageNo: 1,
      cameraList: [],  // 设备列表
      dialogVisible: false
    }
  },
  mounted () {
    this.search(this.curPageNo)
  },
  methods: {
    search (pageNo) { // 查询设备列表
      this.searchData.pageNo = pageNo // 查询页码
      getCameraListData(this.searchData).then(
        result => {
          this.cameraList = result.rows
          this.numTotal = result.total
          this.curPageNo = pageNo
        }
      )
    },
    // 点击配置按钮
    onBtnModify (index, item) {
      this.cameraIp = item.deviceIP
      let url = 'http://' + this.cameraIp + ':' + this.cameraPort
      window.open(url, '', '', false)
    },
    // 跳转页面
    onPageSizeChange (size) {
      this.searchData.pageSize = size
      this.search(1)
    }
  }
}
</script>
<style scoped lang="less">
.video-pagination {
  text-align: center;
  margin-top: 15px;
}
</style>
