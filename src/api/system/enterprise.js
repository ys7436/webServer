import { doneAxios } from '../../utils/request'
import qs from 'qs'
// 获取企业用户数据表格
const enterpriseList = async (data) => {
  return doneAxios.get('/recycle/admin/v1/user/company', {
    params: {
      ...data
    }
  })
}
// 获取责任区域下拉框列表
const regionList = async () => {
  return doneAxios.get('/recycle/admin/v1/user/company/area/select')
}
// 删除企业用户
const deleteMassesList = async (data) => {
  return doneAxios.delete('/recycle/admin/v1/user/company', {
    params: {
      employIds: data
    }
  })
}
// 导出企业用户
const exportTable = async (data) => {
  return doneAxios.get('/recycle/admin/v1/user/company/export', {
    params: {
      ...data
    }
  })
}
// 添加企业用户
const addEnterpriseUser = async (option) => {
  return doneAxios.post('/recycle/admin/v1/user/company', qs.stringify({ ...option }))
}
// 更新企业用户
const updateList = async (option) => {
  return doneAxios.put('/recycle/admin/v1/user/company', qs.stringify({ ...option }))
}
export {
  enterpriseList,
  regionList,
  deleteMassesList,
  exportTable,
  addEnterpriseUser,
  updateList
}
