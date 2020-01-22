import HttpRequest from './axios'
import { normalBaseUrl, doneBaseUrl, loginBaseUrl, addBaseUrl } from '../config/location'
const normalAxios = new HttpRequest({ url: normalBaseUrl, status: false })
const doneAxios = new HttpRequest({ url: doneBaseUrl, status: false })
const loginAxios = new HttpRequest({ url: loginBaseUrl, status: true })
const addAxios = new HttpRequest({ url: addBaseUrl, status: true })
export {
  normalAxios,
  doneAxios,
  loginAxios,
  addAxios
}
