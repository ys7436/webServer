import store from '../store'
const errorHandle = (err) => {
  if (err.message.includes('timeout')) {
    console.log('已经超时！！！')
  }
  if ((err.toString()).indexOf('401') !== -1) {
    console.log(store.state.users.userInfo)
  }
}
export default errorHandle
