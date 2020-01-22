import { saveAs } from 'file-saver'
import XLSX from 'xlsx'
const exportExcel = (name, elem) => {
  // .table要导出的是哪一个表格
  let tableFixed = document.querySelector('.el-table__fixed')
  // let wb = XLSX.utils.table_to_book(document.querySelector('.table'))
  let wb = ''
  if (tableFixed) {
    wb = XLSX.utils.table_to_book(document.querySelector(elem).removeChild(tableFixed))
    document.querySelector(elem).appendChild(tableFixed)
  } else {
    wb = XLSX.utils.table_to_book(document.querySelector('.table'))
  }
  let wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  try {
    //  name+'.xlsx'表示导出的excel表格名字
    saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      name + '.xlsx'
    )
  } catch (e) {
    // console.log(e, wbout)
  }
  return wbout
}
const height = (that, nums) => {
  return (that.$el.clientHeight - nums).toString()
}
const toTreeData = (source, id, parentId, children) => {
  let cloneData = JSON.parse(JSON.stringify(source))
  return cloneData.filter(father => {
    let branchArr = cloneData.filter(child => father[id] === child[parentId])
    father[children] = branchArr.length > 0 ? branchArr : []
    return father[parentId] === 0
  })
}
export {
  exportExcel,
  height,
  toTreeData
}
