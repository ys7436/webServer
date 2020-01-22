export const tableEvent = {
  data () {
    return {
      selectType: false,
      loading: false,
      multipleSelection: null,
      regionList: {},
      total: 400,
      pageSize: 20,
      currentPage: 1,
      dialogVisible: false
    }
  },
  methods: {
    resetForm (formName) {
      this.selectType = true
      this.ruleForm.company = ''
      this.$refs[formName].resetFields()
    },
    editCheckBox (val) {
      this.multipleSelection = []
      for (let i = 0; i < val.length; i++) {
        this.multipleSelection.push(String(val[i].id))
      }
    },
    exportForm (val) {
      this.exportTable()
    },
    addForm () {
      this.dialogVisible = true
      this.resetForm()
      this.dialogStatus = 1
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
    }
  }
}
