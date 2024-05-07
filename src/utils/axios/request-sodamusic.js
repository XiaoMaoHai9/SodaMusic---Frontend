import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  time: 5000
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 1、从缓存中获取到token -> 这里的 Authorization 是登录时你给用户设置 token 的键值
  const authorization = localStorage.getItem('token_sodamusic')
  // 2、如果 token 不为 null -> 那么设置到请求头中，此处哪怕为null，我们也不进行处理，因为后台会进行拦截
  if (authorization) {
    // 后台给登录用户设置的token的键时什么，headers['''']里的键也应该保持一致
    config.headers.Authorization = authorization
  }
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

const ajaxMethod = ['get', 'post', 'delete']
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
