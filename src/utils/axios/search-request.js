import axios from 'axios'

const instanceSearch = axios.create({
  time: 5000,
  baseURL: '/search_api',
  withCredentials: true
})

instanceSearch.defaults.validateStatus = function () {
  return true
}

// 添加请求拦截器
instanceSearch.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  this.$message.warning('请求超时！')
  return Promise.reject(error)
})

// 添加响应拦截器
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

const ajaxMethod = ['get', 'post']
const searchRequest = {}
ajaxMethod.forEach(method => {
  // 数组取值的两种方式
  searchRequest[method] = function (uri, data, config) {
    return new Promise(function (resolve, reject) {
      instanceSearch[method](uri, data, config)
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

export default searchRequest
