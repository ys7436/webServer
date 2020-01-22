import axios from 'axios'
// import Router from '../router'
import errorHandle from './errorHandle'
import store from '../store'
import PublicConfig from '../config'
const CancleToken = axios.CancelToken
class HttpRequest {
  constructor (data) {
    this.baseUrl = data.url
    this.status = data.status
    this.pending = {}
  }
  /* !!!: 获取配置 */
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        // responseType: 'arraybuffer',
        'Content-Type': 'application/x-www-form-urlencoded'
        // 'Content-Type': !this.status ? 'application/json;charset=utf-8' : 'application/x-www-form-urlencoded'
        // 891f811e-d34d-486a-963a-e1803d3576df
      },
      timeout: 100000
    }
    return config
  }
  removePending (key, isReauest = false) {
    if (this.pending[key] && isReauest) {
      this.pending[key]('取消重复请求')
    }
    delete this.pending[key]
  }
  /* !!!: 设定拦截器 */
  interceptors (instence) {
    // 发送请求拦截器
    instence.interceptors.request.use((config) => {
      // Do something before request is sent
      let isPublic = false
      PublicConfig.publicPath.map((path) => {
        isPublic = isPublic || path.test(config.baseURL)
      })
      const token = store.state.users.isToken
      if (!isPublic && token) {
        config.headers.Authorization = 'Bearer ' + token
      } else if (isPublic && !token) {
        config.headers.Authorization = 'Basic ' + 'c25fcmVjeWNsZTpzbmtqXzIwMTkhMTY4'
      }
      // 这里如果没有token或者过期可以直接跳转到login，重新登录
      // else {
      //   Router.replace({ name: 'login' })
      // }
      // 参数 c 代表形参（取消函数）执行c，取消这次请求
      // 20c3f16a-ce7f-492e-b6a6-b6c802eb7c44
      if (config.baseURL.indexOf('ty') !== -1) {
        config.headers.Authorization = 'Bearer ' + '72aa50c1-34e4-4417-87d0-8d220dced92f'
      }
      let key = config.url + '&' + config.method
      this.removePending(key, true)
      config.cancelToken = new CancleToken((c) => {
        this.pending[key] = c
      })
      return config
    }, err => {
      // Do something with request error
      errorHandle(err)
      return Promise.reject(err)
    })

    /* !!!: 响应请求拦截器 */
    instence.interceptors.response.use((res) => {
      // Do something with response data
      // console.log('res', res)
      let key = res.config.url + '&' + res.config.method
      this.removePending(key)
      if (res.status === 200) {
        return Promise.resolve(res.data)
      } else {
        return Promise.reject(res)
      }
    }, (err) => {
      // Do something with response error
      errorHandle(err)
      return Promise.reject(err)
    })
  }
  /* !!!: 创建实例 */
  request (options) {
    const instence = axios.create()
    const newOpstions = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instence)
    return instence(newOpstions)
  }
  get (url, config) {
    const options = Object.assign({
      method: 'get',
      url: url
    }, config)
    return this.request(options)
  }
  delete (url, config) {
    const options = Object.assign({
      method: 'delete',
      url: url
    }, config)
    return this.request(options)
  }
  post (url, data) {
    return this.request({
      method: 'post',
      url: url,
      data: data
    })
  }
  put (url, data) {
    return this.request({
      method: 'put',
      url: url,
      data: data
    })
  }
}

export default HttpRequest
