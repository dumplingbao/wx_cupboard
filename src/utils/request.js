// bmob初始化操作

import Bmob from 'hydrogen-js-sdk'
Bmob.initialize(
  'XXXXXXXX',
  'XXXXXXXX'
)
// var WXBizDataCrypt = require('./WXBizDataCrypt')

/**
 * 授权登录
 *
 */
const returnopen = (code) => {
  var promise = new Promise((resolve, reject) => {
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      data: {
        appid: 'XXXXXXXX',
        secret: 'XXXXXXXX',
        js_code: code,
        grant_type: 'authorization_code'
      },
      success (res) {
        console.log(res.data)
        resolve(res.data)
      }
    })
  })
  return promise
}
export default {
  Bmob,
  returnopen
}
