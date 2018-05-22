<template>
  <el-dialog :visible.sync="dialogFormVisible" width="400px" @open="onClearValidate">
    <div slot="title">
      <span class="pull-left">{{form.uuid?'组织编辑':'组织添加'}}</span>
    </div>
    <el-form ref='form' :model="form" label-width="100px" :rules="rules">
      <el-row>
        <el-col :span="20">
          <el-popover v-model="orgPopoverVisible" ref="orgPopover" placement="right-start" width="154" trigger="click">
            <div class="org-select-popover">
              <el-tree :data="orgSelectData" :props="orgSelectProps" :expand-on-click-node="false" @node-click="onOrgSelectClick"></el-tree>
            </div>
          </el-popover>
          <el-form-item label="上级组织" prop="orgParentName" v-show="form.orgParentUuid!=='0'">
            <el-input v-model="form.orgParentName" readonly auto-complete="off" v-popover:orgPopover :title="form.orgParentName"></el-input>
          </el-form-item>
          <el-form-item label="组织名称" prop="name">
            <el-input v-model.trim="form.name" auto-complete="off" :maxlength="64" placeholder="请输入组织名称"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="memo">
            <el-input resize="none" type="textarea" :rows="4" placeholder="请输入内容" v-model.trim="form.memo" :maxlength="256">
            </el-input>
          </el-form-item>
          <el-form-item label="组织类型" prop="orgType">
            <el-select v-model="form.orgType" no-data-text="请选择"  @change="onOrgClearUp" placeholder="请选择组织类型">
              <el-option v-for="item in orgTypeArr" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始楼层" prop="startFloor" v-show="form.orgType === '4'">
            <el-input v-model.trim="form.startFloor" auto-complete="off" :maxlength="30" placeholder="请输入开始楼层"></el-input>
          </el-form-item>
          <el-form-item label="结束楼层" prop="endFloor" v-show="form.orgType === '4'">
            <el-input v-model.trim="form.endFloor" auto-complete="off" :maxlength="30" placeholder="请输入结束楼层"></el-input>
          </el-form-item>
          <el-form-item label="单元数量" prop="cellNum" v-show="form.orgType === '3'">
            <el-input v-model.trim="form.cellNum" auto-complete="off" :maxlength="30" placeholder="请输入单元数量"></el-input>
          </el-form-item>
          <el-form-item label="门类型" prop="doorType" v-show="form.orgType === '6'" @change="onDoorClearUp">
            <el-select v-model="form.doorType" no-data-text="请选择" clearable placeholder="请选择门类型">
              <el-option v-for="item in doorTypeArr" :key="item.id" :label="item.itemName" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼层" prop="floorNum" v-show="form.orgType === '5'">
            <el-input v-model.trim="form.floorNum" auto-complete="off" :maxlength="30" placeholder="请输入楼层"></el-input>
          </el-form-item>
          <el-form-item label="单元号" prop="cell" v-show="form.orgType === '4'">
            <el-input v-model.trim="form.cell" auto-complete="off" :maxlength="30" placeholder="请输入单元号"></el-input>
          </el-form-item>
          <el-form-item label="楼栋号" prop="building" v-show="form.orgType === '3'">
            <el-input v-model.trim="form.building" auto-complete="off" :maxlength="30" placeholder="请输入楼栋号"></el-input>
          </el-form-item>
          <el-form-item label="梯控位置编号" prop="node" v-show="form.orgType === '11'">
            <el-input v-model.trim="form.node" auto-complete="off" :maxlength="30" placeholder="请输入梯控位置编号"></el-input>
          </el-form-item>
          <el-form-item label="门位置编号" prop="node" v-show="form.orgType === '6' && (form.doorType === '2' || form.doorType === '1')">
            <el-input v-model.trim="form.node" auto-complete="off" :maxlength="30" placeholder="请输入门位置编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSave" :search="search" :loading="isLoading">确 定</el-button>
      <el-button @click="onCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { insertOrg, updateOrg, getOrgTree, getOrgAttribute, getOrgType } from '../../apis/org_manager'
export default {
  props: {
    search: {
      type: Function,
      default: function () { }
    },
    exportOrgNode: {
      type: Object
    }
  },
  data () {
    // 组织名称验证
    var orgNameValidate = (rule, value, callback) => {
      if (value.length <= 64) {
        if (!/^[\u4E00-\u9FA5A-Za-z0-9]{1,64}$/.test(value)) {
          callback(new Error('请输入中文、英文或数字组合!'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入少于64字节的组织名称!'))
      }
    }
    // 描述内容验证
    var memoValidate = (rule, value, callback) => {
      if (value.length <= 256) {
        callback()
      } else {
        callback(new Error('描述内容过长，请输入少于256位的内容'))
      }
    }
    // 单元数验证
    var cellNumValidate = (rule, value, callback) => {
      if (this.form.orgType === '3') {
        if (typeof (value) === 'string' && value.length > 0) {
          if (parseInt(value) < 10 && parseInt(value) > 0) {
            const isMobile = /^(-|\+)?\d+$/
            if (!isMobile.test(value)) {
              callback(new Error('只允许输入数字且前后不能有空格!'))
            } else {
              callback()
            }
          } else {
            callback(new Error('只允许输入1-9的正整数'))
          }
        } else {
          if (value === '' || null) {
            callback(new Error('单元数不能为空'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    // 起始楼层验证
    var startFloorValidate = (rule, value, callback) => {
      if (this.form.orgType === '4') {
        if (typeof (value) === 'string' && value.length > 0) {
          if (parseInt(value) <= 32767 && parseInt(value) > -32768) {
            const isMobile = /^(-|\+)?\d+$/
            if (!isMobile.test(value)) {
              callback(new Error('只允许输入整数!'))
            } else {
              callback()
            }
          } else {
            callback(new Error('只允许输入-32768-32767之间的整数!'))
          }
        } else {
          if (value === '' || value === null) {
            callback(new Error('起始楼层不能为空'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    // 结束楼层验证
    var endFloorValidate = (rule, value, callback) => {
      if (this.form.orgType === '4') {
        if (typeof (value) === 'string' && value.length > 0) {
          if (parseInt(value) <= 32767 && parseInt(value) > -32768) {
            const isMobile = /^(-|\+)?\d+$/
            if (!isMobile.test(value)) {
              callback(new Error('只允许输入整数!'))
            } else {
              callback()
            }
          } else {
            callback(new Error('只允许输入-32768-32767之间的整数!'))
          }
        } else {
          if (value === '' || value === null) {
            callback(new Error('结束楼层不能为空'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    // 楼层数验证
    var floorNumValidate = (rule, value, callback) => {
      if (this.form.orgType === '5') {
        if (typeof (value) === 'string' && value.length > 0) {
          if (parseInt(value) <= 32767 && parseInt(value) > -32768) {
            const isMobile = /^(-|\+)?\d+$/
            if (!isMobile.test(value)) {
              callback(new Error('只允许输入整数!'))
            } else {
              callback()
            }
          } else {
            callback(new Error('只允许输入-32768-32767之间的整数!'))
          }
        } else {
          if (value === '' || value === null) {
            callback(new Error('楼层数不能为空'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    // 门类型验证
    var doorTypeValidate = (rule, value, callback) => {
      if (this.form.orgType === '6') {
        if (typeof (value) === 'string' && value.length > 0) {
          const isMobile = /^[\u4E00-\u9FA5A-Za-z0-9]{0,64}$/
          if (!isMobile.test(value)) {
            callback(new Error('门类型不允许输入特殊字符!'))
          } else {
            callback()
          }
        } else {
          if (value === '' || value === null) {
            callback(new Error('门类型不能为空'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    // 单元号验证
    var cellValidate = (rule, value, callback) => {
      if (this.form.orgType === '4') {
        if (typeof (value) === 'string' && value.length > 0) {
          if (parseInt(value) <= 9 && parseInt(value) >= 1) {
            const isMobile = /^(-|\+)?\d+$/
            if (!isMobile.test(value)) {
              callback(new Error('只允许输入整数!'))
            } else {
              callback()
            }
          } else {
            callback(new Error('只允许输入1-9整数!'))
          }
        } else {
          if (value === '' || value === null) {
            callback(new Error('单元号不能为空'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    // 楼栋号验证
    var buildingValidate = (rule, value, callback) => {
      if (this.form.orgType === '3') {
        if (typeof (value) === 'string' && value.length > 0) {
          if (parseInt(value) <= 999 && parseInt(value) >= 1) {
            const isMobile = /^(-|\+)?\d+$/
            if (!isMobile.test(value)) {
              callback(new Error('只允许输入整数!'))
            } else {
              callback()
            }
          } else {
            callback(new Error('只允许输入1-999的整数!'))
          }
        } else {
          if (value === '' || value === null) {
            callback(new Error('楼栋号不能为空'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    // 梯控位置编号验证
    var nodeValidate = (rule, value, callback) => {
      if (this.form.orgType === '11') {
        if (typeof (value) === 'string' && value.length > 0) {
          if (parseInt(value) >= 10 && parseInt(value) <= 32766) {
            const isMobile = /^(-|\+)?\d+$/
            if (!isMobile.test(value)) {
              callback(new Error('只允许输入整数!'))
            } else {
              callback()
            }
          } else {
            callback(new Error('梯控位置编号应在10-32766之间!'))
          }
        } else {
          if (value === '' || value === null) {
            callback(new Error('楼梯控位置编号不能为空'))
          } else {
            callback()
          }
        }
      } else if (this.form.orgType === '6' && (this.form.doorType === '2' || this.form.doorType === '1')) {
        if (typeof (value) === 'string' && value.length > 0) {
          if (parseInt(value) <= 9 && parseInt(value) >= 1) {
            const isMobile = /^(-|\+)?\d+$/
            if (!isMobile.test(value)) {
              callback(new Error('只允许输入整数!'))
            } else {
              callback()
            }
          } else {
            callback(new Error('只允许输入1-9整数!'))
          }
        } else {
          if (value === '' || value === null) {
            callback(new Error('编号不能为空'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    return {
      treeData: '',
      orgPopoverVisible: false,
      orgSelectData: [], // 上级组织选择列表
      orgSelectProps: { // 上级组织树配置属性
        children: 'children',
        label: 'name'
      },
      lastCurrentName: '', // 当前的组织名称
      doorTypeArr: null,
      isLoading: false,
      orgTypeArr: null,
      dialogFormVisible: false, // 显隐dialog
      form: { // 表单信息
        uuid: null,
        name: '', // 名称
        cellNum: '', // 单元数量
        orgType: '', // 组织类型选择
        startFloor: '', // 开始
        endFloor: '', // 结束
        floorNum: '', // 楼层数量
        doorType: '', // 门类型
        orgUuid: null,
        orgParentName: '',
        node: null,
        building: null, // 楼栋号
        cell: null, // 单元号
        memo: ''
      },
      rules: { // Form表单字段验证规则
        orgType: [ // 组织类型验证规则，必填项
          { required: true, message: '请选择组织类型', trigger: 'blur' }
        ],
        orgParentName: [ // 上级组织名称验证规则，必填项
          { required: true, message: '请选择上级组织', trigger: 'change' }
        ],
        name: [ // 组织名称验证规则，必填项
          { required: true, message: '请输入组织名称', trigger: 'blur' },
          { type: 'string', message: '请输入正确的组织名称', trigger: 'blur' },
          { validator: orgNameValidate, trigger: 'blur' }
        ],
        memo: [ // 描述验证规则，选填项
          { message: '请输入描述内容', trigger: 'blur' },
          { message: '请输入长度在 1 到 256 个字符', trigger: 'blur' },
          { validator: memoValidate, trigger: 'blur' }
        ],
        cellNum: [ // 单元数验证规则，选填项
          { validator: cellNumValidate, trigger: 'blur' }
        ],
        startFloor: [ // 开始楼层验证规则，选填项
          { validator: startFloorValidate, trigger: 'blur' }
        ],
        endFloor: [ // 结束楼层验证规则，选填项
          { validator: endFloorValidate, trigger: 'blur' }
        ],
        floorNum: [ // 楼数量验证规则，选填项
          { validator: floorNumValidate, trigger: 'blur' }
        ],
        doorType: [ // 门类型验证规则，选填项
          { validator: doorTypeValidate, trigger: 'blur' }
        ],
        cell: [ // 单元号验证规则，选填项
          { validator: cellValidate, trigger: 'blur' }
        ],
        building: [ // 楼栋号证规则，选填项
          { validator: buildingValidate, trigger: 'blur' }
        ],
        node: [ // 楼栋号证规则，选填项
          { validator: nodeValidate, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * @description 开始组织编辑
     *
     * @param {Object} orgInfo @default {} 组织信息，form表单信息全部放在一个对象中发送给后台
     */
    orgEdit: function (orgInfo = {}) {
      console.log(this.orgTypeArr)
      this.lastCurrentName = this.exportOrgNode.orgName
      // 组织添加或标记时请求组织树
      getOrgTree().then(res => {
        this.orgSelectData.splice(0, this.orgSelectData.length)
        this.orgSelectData.push(res.data.data)
        this.treeData = res.data.data
      }).catch(err => {
        console.log(err)
      })
      var self = this
      let editUuid = {}
      editUuid.uuid = orgInfo.uuid
      // 组织类型接口调用
      getOrgAttribute(editUuid).then(res => {
        // 单元数
        self.form.cellNum = res.data.data.cellNum || null
        // 门类型
        self.form.doorType = res.data.data.doorType || ''
        // 楼层数
        self.form.floorNum = res.data.data.floorNum || null
        // 开始楼层
        self.form.startFloor = res.data.data.startFloor || null
        // 结束楼层
        self.form.endFloor = res.data.data.endFloor || null
        // 梯控位置或单元门位置编号
        self.form.node = res.data.data.node || null
        // 楼栋号
        self.form.building = res.data.data.building || null
        // 单元号
        self.form.cell = res.data.data.cell || null
      })
      // 组织uuid
      this.form.uuid = orgInfo.uuid || null
      // 组织名称
      this.form.name = orgInfo.name || ''
      // 焦点组织uuid
      this.form.orgParentUuid = orgInfo.orgParentUuid || this.exportOrgNode.uuid || this.exportOrgNode.parentUuid || this.exportOrgNode.rootUuid
      // 焦点组织名称
      this.form.orgParentName = orgInfo.orgParentName || this.lastCurrentName || this.exportOrgNode.orgName || this.exportOrgNode.rootName
      // 组织类型type值
      this.form.orgType = orgInfo.orgType || this.orgTypeArr[1].itemCode
      // 描述
      this.form.memo = orgInfo.memo || ''
      this.lastCurrentName = ''
      this.dialogFormVisible = true
    },
    /**
     * @description 组织类型改变，重置组织类型信息
     *
     * @param
     */
    onOrgClearUp: function () {
      this.form.cellNum = null
      this.form.startFloor = null
      this.form.endFloor = null
      this.form.doorType = ''
      this.form.floorNum = null
      this.form.node = null
      this.form.cell = null
      this.building = null
    },
    /**
     * @description 门类型改变，重置单元门位置信息信息
     *
     * @param
     */
    onDoorClearUp: function () {
      this.form.node = null
    },
    /**
     * @description 保存任务信息，确定操作，在添加或者编辑完成时向后台数据库发送请求，完成数据的添加或编辑，返回信息提示，告知用户
     *
     * @param
     */
    onSave: function () {
      if (parseInt(this.form.startFloor) > parseInt(this.form.endFloor)) {
        this.$message({
          message: '起始楼层不能大于结束楼层!',
          type: 'warning'
        })
        return
      }
      // 先进行判断是否为组织根节点0，若是，则只判断组织名称的正则规则
      if (this.form.orgParentUuid === '0') {
        this.$refs['form'].validateField(
          'name',
          (valid) => {
            if (!valid) {
              this.isLoading = true
              var func
              // 接口调用，判断是添加还是编辑
              func = this.form.uuid ? updateOrg : insertOrg
              func(Object.assign({}, this.form)).then(res => {
                if (res.data.code === '00000') {
                  this.$message({
                    message: res.data.data,
                    type: 'success'
                  })
                  // 接口调用成功后，向父组件发送信息，已完成编辑或添加操作
                  this.$emit('successOrgEdit', true)
                  // 关闭模态框
                  this.dialogFormVisible = false
                  // 保存编辑后改变的组织名称
                  this.lastCurrentName = this.form.name
                  this.cancel()
                } else {
                  // 不成功，发出警告
                  this.$message({
                    message: res.data.data,
                    type: 'warning'
                  })
                  // 模态框不关闭，可以继续操作
                  this.dialogFormVisible = true
                }
                // 按键不锁定，可以继续使用
                this.isLoading = false
              }).catch(err => {
                console.log(err)
                this.isLoading = false
              })
            } else {
              // 若网络发送异常，按键不锁定，提示用户信息
              this.$message({
                message: '内容未填写正确',
                type: 'warning'
              })
              this.isLoading = false
              return false
            }
          })
      } else {
        // 判定上级组织节点不为根节点时的验证规则
        this.$refs['form'].validate(
          (valid) => {
            if (valid) {
              this.isLoading = true
              this.dialogFormVisible = false
              var func
              // 调用接口，判断是编辑或是添加接口
              func = this.form.uuid ? updateOrg : insertOrg
              func(Object.assign({}, this.form)).then(res => {
                if (res.data.code === '00000') {
                  this.$message({
                    message: res.data.data,
                    type: 'success'
                  })
                  // 当添加或编辑成功返回正确验证信息时，子组件向父组件发送信息，以便父组件进行下一步操作
                  this.$emit('successOrgEdit', true)
                  // 返回正确code码，按钮锁定
                  // 模态框关闭
                  this.dialogFormVisible = false
                  // 保存编辑后改变的组织名称
                  this.lastCurrentName = this.form.name
                  this.cancel()
                  this.isLoading = false
                } else {
                  // code码错误，发出警告，提示用户
                  this.$message({
                    message: res.data.data,
                    type: 'warning'
                  })
                  // code码错误，按键不锁定，模态框不关闭
                  this.isLoading = false
                }
              }).catch(err => {
                console.log(err)
                this.isLoading = false
              })
            } else {
              // 如若网络发生错误,按钮不锁定，模态框不关闭，用户提示警告信息
              this.isLoading = false
              this.$message({
                message: '内容未填写正确',
                type: 'warning'
              })
              this.dialogFormVisible = true
              return false
            }
          })
      }
    },
    /**
     * @description 关闭任务添加弹出框
     * @param
     */
    onCancel: function () {
      this.dialogFormVisible = false
    },
    /**
     * @description 打开模态框清除表单验证，表单值初始化时会促使表单验证启动，故在模态框打开时清除表单验证
     *
     * @param
     */
    onClearValidate: function () {
      // 需要模态框打开时clearValidate才会生效
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    /**
     * @description 获取组织树信息，添加或编辑时，实时获取最新组织树信息
     *
     *  @param
     */
    getParentOrgList: function () {
      getOrgTree().then(res => {
        this.orgSelectData.splice(0, this.orgSelectData.length)
        this.orgSelectData.push(res.data.data)
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @description 点击组织树节点时，获取组织树节点当前的组织名称
     * @param {object} data:组织树点击选中的组织节点对象
     * @param node:选中节点
     */
    onOrgSelectClick: function (data, node) {
      this.form.orgParentUuid = data.uuid
      let parentName = ''
      // 组装上级组织名称
      const getName = (node) => {
        parentName = node.label + parentName
        if (node.parent && node.parent.data.$treeNodeId) {
          getName(node.parent)
        } else {
          this.form.orgParentName = parentName
        }
        this.form.orgParentName = parentName
      }
      getName(node)
      this.exportOrgNode.uuid = data.uuid
      this.orgPopoverVisible = false
    }
  },
  /**
   * @description vue生命周期开始，就获取组织树信息，dom加载完毕，立刻执行此操作
   *
   * @param
   */
  mounted: function () {
    // 获取组织类型数据列表
    getOrgType({ itemType: '6' }).then(res => {
      this.orgTypeArr = res.data.data
    }).catch(err => {
      console.log(err)
    })
    // 获取停车场类型的数据列表
    getOrgType({ itemType: '8' }).then(res => {
      this.doorTypeArr = res.data.data
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>
<style lang='less' scoped>
.el-form-item {
  text-align: left;
}
.org-select-popover {
  height: 200px;
  overflow: auto;
}
.el-tree {
  width: 900px;
}
</style>

