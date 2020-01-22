import { doneAxios } from '../../utils/request'
// 获取角色名下拉框
const roleList = async (data) => {
  return doneAxios.get('/recycle/admin/v1/sys/role/select', {
    params: {
      roleType: data
    }
  })
}
export {
  roleList
}
