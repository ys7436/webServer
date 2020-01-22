import config from './index'

const status = process.env.NODE_ENV
const normalBaseUrl = status === 'development'
  ? config.baseUrl.dev.normal
  : config.baseUrl.pro.done

const doneBaseUrl = status === 'development'
  ? config.baseUrl.dev.done
  : config.baseUrl.pro.done

const loginBaseUrl = status === 'development'
  ? config.baseUrl.dev.obtain
  : config.baseUrl.pro.public

const addBaseUrl = status === 'development'
  ? config.baseUrl.dev.ty
  : config.baseUrl.pro.public
export {
  normalBaseUrl,
  doneBaseUrl,
  loginBaseUrl,
  addBaseUrl
}
