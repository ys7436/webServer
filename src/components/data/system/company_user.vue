<template>
  <div class="whiteBack">
    <div class="whiteForm editInput">
      <el-form :inline="true" :model="ruleForm" status-icon ref="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户：" prop="account">
          <el-input v-model.trim="ruleForm.account" placeholder="请输入用户" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色：" prop="role">
          <el-select class="blockInput" v-model="ruleForm.role" placeholder="请选择角色" filterable>
            <el-option v-for="option in roleListData" :key="option.id" :label="option.roleName" :value="option.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择状态" filterable>
            <el-option label="启用" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <tree-data class="el-form-item el-form-item--feedback" :company="ruleForm.company" :treeData="treeData" leftNumber="100px" @changeCompany="changeRole"></tree-data>
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
    <el-dialog class="treeDialogList" title="单位用户编辑" :visible.sync="dialogVisible" width="400px" :before-close="handleClose">
      <div class="dialogList inputAuto">
        <el-form ref="dialogItem" :model="ruleDialog" status-icon :rules="DialogRules" class="demo-form-inline" label-width="100px">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model.trim="ruleDialog.name" placeholder="请输入姓名" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机：" prop="phone">
            <el-input v-model.trim="ruleDialog.phone" placeholder="请输入手机号码" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色：" prop="role">
            <el-select class="blockInput" v-model="ruleDialog.role" placeholder="请选择角色" filterable>
              <el-option v-for="option in roleListData" :key="option.id" :label="option.roleName" :value="option.id"></el-option>
            </el-select>
          </el-form-item>
          <tree-data :treeData="treeData" :company="ruleDialog.company" leftNumber="100px" @changeCompany="changeCompany"></tree-data>
          <el-form-item label="是否启用：" prop="resource" class="bottomNone">
            <el-switch
              v-model="ruleDialog.resource"
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
import PageSize from '../../common/pageSize'
import TreeData from '../../common/treeData'
import { languageList } from '../../../utils/validate'
import { companyList, deleteCompany, exportTable, treeList, addCompanyUser, updateList, defaultPwd } from '../../../api/system/company'
import { toTreeData } from '../../../utils/function'
import { roleList } from '../../../api/system/role'
export default {
  name: 'company_user',
  data () {
    return {
      regionList: {},
      ruleForm: {
        account: '',
        status: '',
        role: '',
        companyId: null
      },
      rules: {},
      tableHead: [
        { align: 'center', prop: 'realName', name: '姓名', width: '200' },
        { align: 'center', prop: 'phone', name: '账号', width: '200' },
        { align: 'center', prop: 'office', name: '归属机构', width: '200' },
        { align: 'center', prop: 'roleName', name: '角色', width: '200' },
        { align: 'center', prop: 'enabled', name: '状态', width: 'auto' }
      ],
      tableData: [],
      loading: false,
      multipleSelection: null,
      total: 0,
      pageSize: 20,
      currentPage: 1,
      tableStatus: '2',
      dialogVisible: false,
      ruleDialog: {
        name: '',
        phone: '',
        company: '',
        role: '',
        resource: true
      },
      DialogRules: {
        name: [{ required: true, message: languageList.name, trigger: 'blur' }],
        phone: [{ required: true, message: languageList.rePhone, trigger: 'blur' }],
        company: [{ required: true, message: languageList.mechanism, trigger: 'change' }],
        role: [{ required: true, message: languageList.role, trigger: 'change' }]
      },
      treeData: [],
      roleListData: [],
      dialogStatus: null,
      userId: null
    }
  },
  components: {
    TableColum,
    PageSize,
    TreeData
  },
  mounted () {
    this.initTable()
    this.getTreeList()
    this.getRoleList()
  },
  methods: {
    getRoleList () {
      roleList('1').then(res => {
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
    initConfig () {
      const that = this.ruleForm
      return {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyword: that.account, // 名称
        roleId: this.ruleForm.role, // 角色ID
        enabled: this.ruleForm.status, // 状态
        officeId: this.ruleForm.companyId // 机构ID
      }
    },
    initTable () {
      const data = this.initConfig()
      this.loading = true
      companyList(data).then(res => {
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
          this.initTable()
        } else {
          return false
        }
      })
    },
    addForm () {
      this.dialogVisible = true
      this.ruleDialog.name = ''
      this.ruleDialog.phone = ''
      this.ruleDialog.company = ''
      this.ruleDialog.role = ''
      this.ruleDialog.resource = '1'
      this.dialogStatus = 1
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
          type: '0'
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
    exportForm () {
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
    resetForm (formName) {
      this.selectType = true
      this.$refs[formName].resetFields()
    },
    editCheckBox (val) {
      this.multipleSelection = []
      for (let i = 0; i < val.length; i++) {
        this.multipleSelection.push(String(val[i].id))
      }
    },
    editMessage (val) {
      this.dialogVisible = true
      this.ruleDialog.name = val.realName
      this.ruleDialog.phone = val.phone
      this.ruleDialog.role = val.roleId
      this.ruleDialog.resource = String(val.enabled) === '0'
      this.dialogStatus = 2
      this.userId = val.id
    },
    deleteRow (row) {
      this.initDelete(row, true)
    },
    tableSize (val) {
      this.pageSize = val
      this.tableRender()
    },
    tablePage (val) {
      this.currentPage = val
      this.tableRender()
    },
    tableRender () {
      this.initTable()
    },
    handleClose () {
      this.dialogVisible = false
      console.log('关闭弹窗')
    },
    editDetail (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const config = {
            realName: this.ruleDialog.name,
            phone: this.ruleDialog.phone,
            officeId: this.ruleDialog.company,
            roleId: this.ruleDialog.role,
            enabled: this.ruleDialog.resource ? '0' : '1'
          }
          if (this.dialogStatus === 1) {
            addCompanyUser(config).then(res => {
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
            })
          }
        } else {
          return false
        }
      })
    },
    changeCompany (val) {
      this.ruleDialog.company = (val.data.id).toString()
    },
    changeRole (val) {
      this.ruleForm.companyId = val.data.id
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
        deleteCompany(params).then(res => {
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
    }
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
