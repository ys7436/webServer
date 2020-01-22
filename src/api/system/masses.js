import { doneAxios } from '../../utils/request'
// import qs from 'qs'
// 获取群众用户 分页列表
const massesTableList = async (data) => {
  return doneAxios.get('/recycle/admin/v1/user/resident', {
    params: {
      ...data
    }
  })
}
// 删除群众用户
const deleteMassesList = async (data) => {
  return doneAxios.delete('/recycle/admin/v1/user/resident', {
    params: {
      rdtIds: data
    }
  })
}
// 导出用户数据
const exportTable = async (data) => {
  return doneAxios.get('/recycle/admin/v1/user/resident/export', {
    params: {
      ...data
    }
  })
}
// 下载导出的用户数据
const downLoadTable = async (data) => {
  return doneAxios.get('/recycle/common/download', {
    params: {
      fileName: data,
      delete: 0
    }
  })
}
// 查看群众用户详情
const massesDetail = async (data) => {
  return doneAxios.get('/recycle/admin/v1/user/resident/info', {
    params: {
      rdtId: data
    }
  })
}
export {
  massesTableList,
  deleteMassesList,
  exportTable,
  downLoadTable,
  massesDetail
}
