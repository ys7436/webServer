<template>
  <div class="whiteBack">
    <div class="massesEdit">
      <slot name="back"></slot>
      <div v-for="(item, index) in massesDetail" :key="'item' + index">
        <div v-if="index === 0" class="massesTitle">在住地址</div>
        <div v-if="index === 1" class="massesTitle">其他地址</div>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <colgroup width="20%"></colgroup>
          <colgroup width="30%"></colgroup>
          <colgroup width="20%"></colgroup>
          <colgroup width="30%"></colgroup>
          <tr v-if="index === 0">
            <td class="event">姓名</td>
            <td>{{ massesUserDetail.reaName || '' }}</td>
            <td class="event">手机</td>
            <td>{{ massesUserDetail.phone || '' }}</td>
          </tr>
          <tr v-if="index === 0">
            <td class="event">身份证号</td>
            <td>{{ massesUserDetail.certificate || '' }}</td>
            <td class="event">默认住址</td>
            <td>{{ massesUserDetail.area || '' }}</td>
          </tr>
          <tr>
            <td class="event">区/县</td>
            <td>{{ item.level2Office }}</td>
            <td class="event">楼号</td>
            <td>{{ item.building }}</td>
          </tr>
          <tr>
            <td class="event">乡镇/街道</td>
            <td>{{ item.level3Office }}</td>
            <td class="event">单元</td>
            <td>{{ item.unitno }}</td>
          </tr>
          <tr>
            <td class="event">社区</td>
            <td>{{ item.level4Office }}</td>
            <td class="event">门牌号</td>
            <td>{{ item.doorplate }}</td>
          </tr>
          <tr>
            <td class="event">网格</td>
            <td>{{ item.level5Office }}</td>
            <td class="event">类型</td>
            <td>{{ homeStatus(String(item.residType)) }}</td>
          </tr>
          <tr>
            <td class="event">小区</td>
            <td>{{ item.office }}</td>
            <td class="event">家庭成员</td>
            <td>{{ homeList(item.members) }}</td>
          </tr>
        </table>
      </div>
      <template v-if="false">
        <div class="massesTitle">收货地址</div>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="20%" class="event left">姓名</td>
            <td width="20%" class="event left">手机号</td>
            <td width="60%" class="event left">收货地址</td>
          </tr>
          <tr v-for="(item, index) in addrList" :key="'addr' + index">
            <td>{{ item.name }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ item.addr }}</td>
          </tr>
        </table>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'massesFlag',
  props: {
    massesDetail: {
      type: Array,
      default: () => []
    },
    massesUserDetail: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      addrList: [
        { name: '刘元', phone: '15144554455', addr: '安徽省合肥市光明橡树湾19栋1110' },
        { name: '拉伸', phone: '15166333366', addr: '安徽省合肥市光明橡树湾19栋1111' },
        { name: '模式', phone: '15188999988', addr: '安徽省合肥市光明橡树湾19栋1112' }
      ]
    }
  },
  methods: {
    homeStatus (status) {
      let name = ''
      switch (status) {
        case '0':
          name = '户主'
          break
        case '1':
          name = '户主不在住'
          break
        case '2':
          name = '住户'
          break
        case '3':
          name = '租户'
          break
        default:
          name = ''
          break
      }
      return name
    },
    homeList (list) {
      let name = []
      for (let i = 0; i < list.length; i++) {
        name.push(list[i].memberName)
      }
      return name.join('、')
    }
  }
}
</script>

<style scoped lang="scss">
  .whiteBack { background-color: #fff; }
  .massesEdit {
    border: 1px solid #ddd;
    height: 100%;
    padding: 5px 20px 35px;
    box-sizing: border-box;
    overflow-y: auto;
    position: relative;
    table td {
      height: 35px;
      line-height: 35px;
      padding: 0 15px;
      border: 1px solid #ddd;
      border-collapse: collapse;
      font-size: 14px;
      color: #333;
      &.event {
        color: #888;
        text-align: right;
        background-color: #F9F9F9;
      }
      &.left {
        text-align: left !important;
      }
    }
    .massesTitle {
      height: 40px;
      line-height: 40px;
      padding-top: 5px;
      font-size: 16px;
      color: #333;
    }
  }
</style>
