import config from '../config'

const http = {
  formatData: (code, res) => {
    return new Promise((resolve, reject) => {
      if (res.statusCode === 200) {
        let data = res.data

        return resolve(data)
      } else {
        return reject(res.statusText)
      }
    })
  },
  get: (path = '', params = {}, { url = '', port = 5000, code = false }) => {
    return new Promise((resolve, reject) => {
      let apiUrl = `${config.apiUrl}:${port}${config.apiBaseUrl}${path}`
      if (url) {
        apiUrl = `${url}:${port}${config.apiBaseUrl}${path}`
      }
      let header = {
        'Content-Type': 'application/xml;charset=UTF-8'
      }

      uni.request({
        url: apiUrl,
        data: params,
        method: 'GET',
        header,
        success: res => {
          http.formatData(code, res).then(resolve, reject)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }
}

export default http
