import { doneAxios } from '../../utils/request'
import qs from 'qs'
// 获取单位用户分页列表
const companyList = async (data) => {
  return doneAxios.get('/recycle/admin/v1/user/manager', {
    params: {
      ...data
    }
  })
}
// 删除单位用户
const deleteCompany = async (data) => {
  return doneAxios.delete('/recycle/admin/v1/user/manager', {
    params: {
      managerIds: data
    }
  })
}
// 导出单位用户
const exportTable = async (data) => {
  return doneAxios.get('/recycle/admin/v1/user/manager/export', {
    params: {
      ...data
    }
  })
}
// 获取机构树结构
const treeList = async () => {
  return doneAxios.get('/recycle/admin/v1/sys/office/tree')
}
// 添加单位用户
const addCompanyUser = async (option) => {
  return doneAxios.post('/recycle/admin/v1/user/manager', qs.stringify({ ...option }))
}
// 修改单位用户
const updateList = async (option) => {
  return doneAxios.put('/recycle/admin/v1/user/manager', qs.stringify({ ...option }))
}
// 重置用户名密码
const defaultPwd = async (option) => {
  return doneAxios.put('/recycle/admin/v1/user/password/default', qs.stringify({ ...option }))
}
export {
  companyList,
  deleteCompany,
  exportTable,
  treeList,
  addCompanyUser,
  updateList,
  defaultPwd
}
