<template>
  <div class="treeMessage">
    <el-form-item :label="labelName" prop="company" v-if="position">
      <el-input v-model.trim="treeMessage" placeholder="请选择归属机构" autocomplete="off" readonly @focus="treeShow"></el-input>
    </el-form-item>
    <transition name="slideUp">
      <div class="content searchTree" :class="{'relative': !position}" :style="{'left': leftNumber}" v-if="isTree || !position">
        <div class="contentSearch">
          <el-input placeholder="输入搜索关键字" v-model="filterText" class="inputAuto" prefix-icon="el-icon-search"></el-input>
          <el-button icon="el-icon-circle-close" circle class="closeTree" @click="closeTree" v-if="position"></el-button>
        </div>
        <el-scrollbar :native="false" tag="div" class="treeScroll">
          <el-tree
            :default-expand-all="expand" :render-content="renderContent" @check="checkedList" node-key="id" :show-checkbox="checked" ref="tree"
            :check-strictly="strictly" :data="treeData" :props="defaultProps" @node-click="handleNodeClick" :filter-node-method="filterNode"></el-tree>
        </el-scrollbar>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'treeData',
  props: {
    labelName: {
      type: String,
      default: '归属机构：'
    },
    treeData: {
      type: Array,
      default: () => []
    },
    company: {
      type: String,
      default: ''
    },
    leftNumber: {
      type: String,
      default: '80px'
    },
    checked: {
      type: Boolean,
      default: false
    },
    position: {
      type: Boolean,
      default: true
    },
    expand: {
      type: Boolean,
      default: false
    },
    strictly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'officeName'
      },
      isTree: false,
      treeMessage: this.company,
      filterText: '',
      treeEvent: {}
    }
  },
  watch: {
    // company () {
    //   this.treeMessage = this.company
    // },
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    handleNodeClick (data, node, event) {
      if (!data.children || data.children.length === 0) {
        this.treeMessage = data.officeName
        this.changeTree({ data: data, node: node, event: event })
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.officeName.indexOf(value) !== -1
    },
    changeTree (data) {
      this.$emit('changeCompany', data)
    },
    treeShow () {
      if (!this.isTree) this.isTree = true
    },
    closeTree () {
      if (this.isTree) this.isTree = false
    },
    checkedList (data, node) {
      this.$emit('checkedChange', { data: data, node: node })
    },
    renderContent (h, { node, data, store }) {
      data.hierarchy = node.level
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
        </span>
      )
    }
  }
}
</script>

<style scoped lang="scss">
  .treeMessage {
    position: relative;
    .content {
      min-width: 260px;
      height: 200px;
      position: absolute;
      right: 15px;
      top: 46px;
      background-color: #fff;
      overflow: hidden;
      box-shadow: 0 0 3px 1px #9a9a9a;
      border-radius: 3px;
      padding: 10px 10px 15px;
      z-index: 100;
      &.relative {
        height: auto;
        box-shadow: none;
        position: relative !important;
        left: 0 !important;
        top: 0;
        padding: 0;
        .contentSearch {
          padding-right: 0 !important;
        }
        .treeScroll {
          width: auto;
          height: 280px;
        }
      }
      .contentSearch {
        position: relative;
        padding-right: 30px;
        margin-bottom: 10px;
        .closeTree {
          width: 18px;
          height: 18px;
          position: absolute;
          right: 3px;
          top: 11px;
          cursor: pointer;
          z-index: 200;
          border: 0;
          font-size: 18px;
          padding: 0;
        }
      }
      .treeScroll {
        width: 240px;
        overflow: hidden;
        height: 125px;
      }
    }
  }
  .slideUp-enter, .slideUp-leave-active{
    opacity: 0;
    transform: translate(0, 25px);
  }
  .slideUp-enter-active, .slideUp-leave-active {
    transition: all 0.2s linear;
  }
</style>
