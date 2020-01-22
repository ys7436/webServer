<template>
  <div class="whiteBack">
    <div class="whiteForm editInput">
      <el-form :inline="true" :model="ruleForm" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名：" prop="username">
          <el-input v-model.trim="ruleForm.username" placeholder="请输入姓名" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色：" prop="role">
          <el-select v-model="ruleForm.role" placeholder="请选择角色" @change="roleChange" filterable>
            <el-option v-for="option in roleListData" :key="option.id" :label="option.roleName" :value="option.id"></el-option>
          </el-select>
        </el-form-item>
        <tree-data class="el-form-item el-form-item--feedback" :company="ruleForm.company" :treeData="treeData" leftNumber="100px" @changeCompany="changeCompany"></tree-data>
        <el-form-item label="责任区域：" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择责任区域" @change="regionChange" filterable>
            <el-option v-for="option in regionListData" :key="option.id" :label="option.officeName" :value="option.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="submitForm('ruleForm')">查询</el-button>
          <el-button icon="el-icon-set-up" @click="resetForm('ruleForm')">重置</el-button>
          <el-button type="primary" icon="el-icon-circle-plus" @click="addForm">添加</el-button>
          <el-button type="danger" icon="el-icon-set-up" @click="resetPassword">重置密码</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteForm">删除</el-button>
          <el-button type="success" icon="el-icon-download" @click="exportForm">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="whiteTable">
      <table-colum :loading="loading" :tableHead="tableHead" :tableData="tableData" :status="tableStatus"
                   @handleCheckBox="editCheckBox" @handleRow="editMessage" @deleteRow="deleteRow"></table-colum>
      <page-size :total="total" :currentPage="currentPage" :pageSize="pageSize" @tableDataSize="tableSize" @tableDataPage="tablePage"></page-size>
    </div>
    <el-dialog class="treeDialogList" title="人员添加 / 编辑" :visible.sync="dialogVisible" width="400px" :before-close="handleClose">
      <div class="dialogList inputAuto">
        <el-form :model="ruleDialog" :rules="ruleValidata" status-icon ref="dialogItem" label-width="100px" class="demo-ruleForm">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model.trim="ruleDialog.name" placeholder="请输入姓名" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="账号/手机：" prop="phone">
            <el-input v-model.trim="ruleDialog.phone" placeholder="请输入账号/手机" autocomplete="off"></el-input>
          </el-form-item>
          <tree-data class="el-form-item el-form-item--feedback" :company="ruleDialog.company" :treeData="treeData" leftNumber="100px" @changeCompany="dialogCompany"></tree-data>
          <el-form-item label="角色：" prop="role">
            <el-select class="blockInput" v-model="ruleDialog.role" placeholder="请选择角色" @change="roleDialog" filterable>
              <el-option v-for="option in roleListData" :key="option.id" :label="option.roleName" :value="option.id"></el-option>
            </el-select>
          </el-form-item>
          <el-collapse-transition>
            <div v-if="showSuperior">
              <el-form-item label="直属上级：" prop="superior">
                <el-select class="blockInput" v-model="ruleDialog.superior" placeholder="请选择直属上级" filterable>
                  <el-option label="刘元" value="10"></el-option>
                  <el-option label="澄江" value="11"></el-option>
                  <el-option label="吴浩" value="12"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-collapse-transition>
          <el-form-item label="责任区域：" prop="region">
            <el-select class="blockInput" v-model="ruleDialog.region" placeholder="请选择责任区域" multiple collapse-tags filterable>
              <el-option v-for="option in regionListData" :key="option.id" :label="option.officeName" :value="option.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用：" class="bottomNone" prop="isEnable">
            <el-switch
              v-model="ruleDialog.isEnable"
              active-text="是"
              inactive-text="否">
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDetail('dialogItem')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableColum from '../../common/tablecolum'
import TreeData from '../../common/treeData'
import PageSize from '../../common/pageSize'
import { tableEvent } from '../../../utils/mixin'
import { languageList } from '../../../utils/validate'
import { enterpriseList, regionList, deleteMassesList, exportTable, addEnterpriseUser, updateList } from '../../../api/system/enterprise'
import { roleList } from '../../../api/system/role'
import { toTreeData } from '../../../utils/function'
import { treeList, defaultPwd } from '../../../api/system/company'
export default {
  name: 'enterprise',
  data () {
    return {
      ruleForm: {
        username: '',
        phone: '',
        company: '',
        region: '',
        role: ''
      },
      tableHead: [
        { align: 'center', prop: 'realName', name: '姓名', width: '150' },
        { align: 'center', prop: 'phone', name: '账号', width: '200' },
        { align: 'center', prop: 'company', name: '归属企业', width: '180' },
        { align: 'center', prop: 'roleName', name: '角色', width: '180' },
        { align: 'left', prop: 'offices', name: '责任区域', width: 'auto' },
        { align: 'center', prop: 'delFlag', name: '状态', width: '150' }
      ],
      tableData: [],
      tableStatus: '2',
      treeData: [],
      ruleDialog: {
        name: '',
        phone: '',
        company: '',
        region: [],
        role: '',
        superior: '',
        isEnable: true
      },
      ruleValidata: {
        name: [{ required: true, message: languageList.name, trigger: 'blur' }],
        phone: [{ required: true, message: languageList.user, trigger: 'blur' }],
        company: [{ required: true, message: languageList.comapny, trigger: 'change' }],
        region: [{ required: true, message: languageList.region, trigger: 'change' }],
        role: [{ required: true, message: languageList.role, trigger: 'change' }],
        superior: [{ required: true, message: languageList.superior, trigger: 'change' }],
        isEnable: [{ required: true, message: languageList.isOff, trigger: 'change' }]
      },
      showSuperior: false,
      roleListData: [],
      regionListData: [],
      dialogStatus: null,
      userId: null
    }
  },
  mixins: [tableEvent],
  mounted () {
    this.initTable()
    this.getRoleList()
    this.getRegionList()
    this.getTreeList()
  },
  methods: {
    getTreeList () {
      treeList().then(res => {
        if (res.code === 0) {
          this.treeData = toTreeData(res.data, 'id', 'parentId', 'children')
        } else {
          this.$notify.error({
            title: '错误',
            message: res.msg
          })
        }
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '服务器获取数据异常'
        })
      })
    },
    getRegionList () {
      regionList().then(res => {
        if (res.code === 0) {
          this.regionListData = res.data.rows
        } else {
          this.$notify.error({
            title: '责任区域',
            message: res.msg
          })
        }
      }).catch(() => {
        this.$notify.error({
          title: '出错',
          message: '服务器数据获取失败'
        })
      })
    },
    getRoleList () {
      roleList('2').then(res => {
        if (res.code === 0) {
          this.roleListData = res.data
        } else {
          this.$notify.error({
            title: '错误',
            message: res.msg
          })
        }
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '服务器获取数据异常'
        })
      })
    },
    initConfig () {
      const that = this.ruleForm
      return {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyword: that.username, // 名称
        companyId: '', // 机构
        roleId: '', // 角色
        officeId: '' // 责任区域
      }
    },
    initTable () {
      const data = this.initConfig()
      this.loading = true
      enterpriseList(data).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.rows
          this.total = res.data.total
        } else {
          this.$notify({
            title: '警告',
            message: res.msg,
            type: 'warning'
          })
        }
        this.loading = false
      }).catch(() => {
        this.$notify.error({
          title: '错误',
          message: '服务器获取数据异常'
        })
        this.loading = false
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = Object.assign(this.ruleForm, this.regionList)
          console.log(data)
        } else {
          return false
        }
      })
    },
    resetPassword () {
      this.$confirm('此操作将会让密码重置为：123456', '重置提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!this.multipleSelection || this.multipleSelection.length <= 0) return
        const config = {
          ids: this.multipleSelection.join(','),
          type: '1'
        }
        defaultPwd(config).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: '重置成功',
              message: res.msg,
              type: 'success'
            })
          } else {
            this.$notify.error({
              title: '重置失败',
              message: res.msg
            })
          }
        }).catch(() => {
          this.$notify.error({
            title: '错误',
            message: '服务器获取数据异常'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        })
      })
    },
    deleteForm () {
      this.initDelete(this.multipleSelection.join(','), false)
    },
    roleChange (val) {
      console.log(val)
    },
    regionChange (val) {
      console.log(val)
    },
    editMessage (val) {
      this.dialogStatus = 2
      this.userId = val.id
      const arr = (val.officeIds).split(',')
      this.dialogVisible = true
      this.ruleDialog.name = val.realName
      this.ruleDialog.phone = val.phone
      this.ruleDialog.region = arr.map(Number)
      this.ruleDialog.role = Number(val.roleId)
      if (val.roleId.toString() === '9') this.showSuperior = true
      else this.showSuperior = false
    },
    deleteRow (row) {
      this.initDelete(row, true)
    },
    changeCompany (val) {
      this.ruleForm.company = val.data.label
    },
    editDetail (fromNode) {
      this.$refs[fromNode].validate((valid) => {
        if (valid) {
          const config = {
            realName: this.ruleDialog.name,
            phone: this.ruleDialog.phone,
            companyId: this.ruleDialog.company,
            roleId: this.ruleDialog.role,
            officeIds: this.ruleDialog.region.join(','),
            enabled: this.ruleDialog.isEnable ? '0' : '1'
          }
          if (this.dialogStatus === 1) {
            addEnterpriseUser(config).then(res => {
              if (res.code === 0) {
                this.$notify({
                  title: '添加成功',
                  message: res.msg,
                  type: 'success'
                })
              } else {
                this.$notify.error({
                  title: '添加失败',
                  message: res.msg
                })
              }
              this.dialogVisible = false
            }).catch(() => {
              this.$notify.error({
                title: '错误',
                message: '服务器获取数据异常'
              })
            })
          } else if (this.dialogStatus === 2) {
            config.id = this.userId
            updateList(config).then(res => {
              if (res.code === 0) {
                this.$notify({
                  title: '更新成功',
                  message: res.msg,
                  type: 'success'
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: res.msg
                })
              }
              this.dialogVisible = false
            }).catch(() => {
              this.$notify.error({
                title: '错误',
                message: '访问服务器失败'
              })
            })
          }
        } else {
          return false
        }
      })
    },
    dialogCompany (val) {
      this.ruleDialog.company = (val.data.id).toString()
    },
    roleDialog (val) {
      if (val.toString() === '9') this.showSuperior = true
      else this.showSuperior = false
    },
    deleteClick (row) {
      this.initDelete(row, true)
    },
    deleteTable () {
      this.initDelete(this.multipleSelection.join(','), false)
    },
    initDelete (row, status) {
      this.$confirm('是否确定删除此条记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = ''
        if (status) params = row.id
        else params = row
        deleteMassesList(params).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: '成功',
              message: res.msg,
              type: 'success'
            })
            if (status) {
              const index = this.tableData.indexOf(row)
              if (this.multipleSelection.length > 0) {
                const deleteAllIndex = this.multipleSelection.indexOf(String(row.id))
                if (deleteAllIndex !== -1) this.multipleSelection.splice(deleteAllIndex, 1)
              }
              this.tableData.splice(index, 1)
            } else {
              for (let i = 0; i < this.tableData.length; i++) {
                for (let j = 0; j < this.multipleSelection.length; j++) {
                  if ((this.tableData[i].id).toString() === (this.multipleSelection[j]).toString()) this.tableData.splice(i, 1)
                }
              }
            }
          } else {
            this.$notify.error({
              title: '出错',
              message: res.msg
            })
          }
        }).catch(() => {
          this.$notify.error({
            title: '出错',
            message: '访问服务器失败'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    exportTable () {
      const config = Object.assign({}, this.initConfig())
      delete config.pageSize
      delete config.pageNum
      exportTable(config).then(res => {
        if (res.code === 0) {
          window.location.href = 'http://119.3.244.219:80/recycle/common/download?fileName=' + res.msg + '&delete=0'
        } else {
          this.$notify.error({
            title: '出错',
            message: res.msg
          })
        }
      }).catch(() => {
        this.$notify.error({
          title: '出错',
          message: '访问服务器失败'
        })
      })
    },
    resetForm () {
      for (let i in this.ruleDialog) {
        if (i === 'region') {
          this.ruleDialog[i] = []
        } else if (i === 'isEnable') {
          this.ruleDialog[i] = '0'
        } else {
          this.ruleDialog[i] = ''
        }
      }
    }
  },
  components: {
    TableColum,
    TreeData,
    PageSize
  }
}
</script>

<style scoped lang="scss">
  .dialogList {
    overflow: initial;
    overflow: inherit;
    overflow: visible;
  }
</style>
