<template>
  <el-container class="ipmgmt-contain">
    <el-main class="ipmgmt-main">
      <div class="ip-box">
        <el-button type="primary" size="medium" @click="showInsertDialog">添加IP</el-button>
        <div class="table-wrapper">
          <el-table v-loading="ipListLoading" :data="tableData" empty-text="未添加IP" tooltip-effect="dark" border highlight-current-row style="width: 700px">
            <!-- <el-table-column type="index" width="100"></el-table-column> -->
            <el-table-column prop="ip" label="IP地址"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button class="btn" type="success" @click="handleEdit(scope.$index, scope.row)" style="background:#67c23a;bottom: 0px;">编辑</el-button>
                <el-button class="btn" type="danger" @click="handleDelete(scope.$index, scope.row)" style="background:#f56c6c;bottom: 0px;">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 添加IP窗口 -->
      <el-dialog title="添加IP" :visible.sync="insertDialogVisible" :before-close="cancelInsertIP" width="700px">
        <div class="formStyle">
          <el-input v-model="inputIp" placeholder="请输入IP地址" style="width=300px"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="insertIP" :loading="insertLoading">确定</el-button>
          <el-button @click="cancelInsertIP">取消</el-button>
        </div>
      </el-dialog>

      <!-- 编辑IP窗口 -->
      <el-dialog title="修改IP" :visible.sync="updataDialogVisible" :before-close="cancelUpdataIp" width="700px">
        <el-form class="formStyle" v-bind:value="updataIpInfo">
          <el-form-item label="旧IP" label-width="40px">
            <el-input v-model="updataIpInfo.oldIp" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="新IP" label-width="40px">
            <el-input v-model="updataIpInfo.newIp"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updataIp" :loading="updataLoading">确定</el-button>
          <el-button @click="cancelUpdataIp">取消</el-button>
        </div>
      </el-dialog>

    </el-main>
  </el-container>
</template>
<script>
import {
  insertIp,
  deleteIp,
  updateIp,
  ipList
} from './apis/index'
export default {
  name: 'IpMgmt',
  data () {
    return {
      // 添加IP窗口
      insertDialogVisible: false,
      inputIp: '',
      insertLoading: false,
      // 修改IP窗口
      updataDialogVisible: false,
      updataLoading: false,

      tableData: [],
      ipListLoading: false,
      updataIpInfo: {
        oldIp: '',
        newIp: ''
      }
    }
  },
  created () {
    console.log('created')
    this.ipList()
  },
  methods: {
    showInsertDialog () {
      if (this.tableData.length > 0) {
        this.$message({
          message: '目前只允许添加一个IP',
          type: 'warning'
        })
        // this.$message.error('目前只允许添加一个IP')
      } else {
        this.insertDialogVisible = true
      }
    },
    ipList () {
      console.log('刷新')
      this.ipListLoading = true
      ipList().then(result => {
        console.log(result)
        this.ipListLoading = false
        if (result.code === '00000') {
          console.log(result.data)
          let tempList = []
          result.data.forEach(element => {
            let temp = { ip: '' }
            temp.ip = element
            tempList.push(temp)
          })
          this.tableData = tempList
        } else {
          this.$message.error(result.errMsg)
        }
      }).catch(error => {
        console.log('失败' + error)
        this.$message.error('访问失败')
        this.ipListLoading = false
      })
    },
    insertIP () {
      if (this.inputIp === '') {
        this.$message.error('输入ip为空')
        return false
      }
      if (!this.isValidIP(this.inputIp)) {
        this.$message.error('无效的IP地址')
        return false
      }
      this.insertLoading = true
      insertIp(this.inputIp).then(result => {
        console.log(result)
        this.insertLoading = false
        if (result.code === '00000') {
          this.insertDialogVisible = false
          this.inputIp = ''
          this.ipList()// 刷新列表
          this.$message({
            message: result.data,
            type: 'success'
          })
        } else {
          this.$message.error(result.errMsg)
        }
      }).catch(error => {
        this.insertLoading = false
        console.log('失败' + error)
        this.$message.error('访问失败')
      })
    },
    cancelInsertIP () {
      this.insertDialogVisible = false
      this.inputIp = ''
    },
    updataIp () {
      if (this.updataIpInfo.newIp === '') {
        this.$message.error('输入ip为空')
        return false
      }
      if (!this.isValidIP(this.updataIpInfo.newIp)) {
        this.$message.error('无效的IP地址')
        return false
      }
      this.updataLoading = true
      updateIp(this.updataIpInfo.oldIp, this.updataIpInfo.newIp).then(result => {
        console.log(result)
        this.updataLoading = false
        if (result.code === '00000') {
          this.updataDialogVisible = false
          this.updataIpInfo.newIp = ''
          this.ipList()// 刷新列表
          this.$message({
            message: result.data,
            type: 'success'
          })
        } else {
          this.$message.error(result.errMsg)
        }
      }).catch(error => {
        this.updataLoading = false
        console.log('失败' + error)
        this.$message.error('访问失败')
      })
    },
    cancelUpdataIp () {
      this.updataDialogVisible = false
      this.updataIpInfo.newIp = ''
    },
    handleEdit (index, row) {
      this.updataDialogVisible = true
      this.updataIpInfo.oldIp = row.ip
    },
    handleDelete (index, row) {
      this.$confirm('确定删除IP： ' + row.ip, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteIp(row.ip).then(result => {
          console.log(result)
          if (result.code === '00000') {
            this.ipList()// 刷新列表
            this.$message({
              message: result.data,
              type: 'success'
            })
          } else {
            this.$message.error(result.errMsg)
          }
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {
      })
    },
    // 判断是否有效IP
    isValidIP (ip) {
      let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      return reg.test(ip)
    }
  }
}
</script>
<style lang="less">
@import url('./assets/css/ipMgmt.less');
</style>

