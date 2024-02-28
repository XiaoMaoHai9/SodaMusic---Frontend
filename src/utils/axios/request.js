import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  time: 5000,
  withCredentials: true // 表示跨域请求时是否需要使用凭证, 表示每次请求可以携带 cookie 和 session
})

// instance.defaults.withCredentials = true
// instance.defaults.validateStatus = function () {
//   return true
// }

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  this.$message.warning('请求超时！')
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  const status = response.status
  // 在发送请求之前做些什么
  if (status === 200) {
    return Promise.resolve(response)
  } else if (status === 301) {
    this.$message.warning('请先登录！')
    return false
  } else {
    return Promise.reject(response)
  }
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

const ajaxMethod = ['get', 'post']
const request = {}
ajaxMethod.forEach(method => {
  // 数组取值的两种方式
  request[method] = function (uri, data, config) {
    return new Promise(function (resolve, reject) {
      instance[method](uri, data, config)
        .then(response => {
          if (response.status === 200) {
            resolve(response)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
})

export default request
