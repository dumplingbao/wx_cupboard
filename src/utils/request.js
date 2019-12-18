// bmob初始化操作

import Bmob from 'hydrogen-js-sdk'
import {
  formatDate
} from '@/utils/index.js'
const appId = ''
const secret = ''
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
function setOpenid () {
  wx.login({
    success (res) {
      if (res.code) {
        // 发起网络请求
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: appId, // 开发者appid
            secret: secret, // 开发者AppSecret(小程序密钥)
            grant_type: 'authorization_code', // 默认authorization_code
            js_code: res.code // wx.login登录获取的code值
          },
          success (res) {
            wx.setStorageSync('openid', res.data.openid)
            wx.setStorageSync('session_key', res.data.session_key)
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}
function setAuth () {
  wx.getSetting({
    success (res) {
      if (!res.authSetting['scope.userInfo']) { // 未授权getUserInfo
        wx.authorize({
          scope: 'scope.getUserInfo',
          success (res) {
            // 用户已经同意小程序使用用户信息，后续调用 wx.userInfo 接口不会弹窗询问
            wx.setStorageSync('userName', res.target.userInfo.nickName)
          },
          fail (err) {
            console.log(err)
          }
        })
      } else { // 已授权
        wx.getUserInfo({
          success (res) {
            var userInfo = res.userInfo
            wx.setStorageSync('userName', userInfo.nickName)
            wx.setStorageSync('userPhoto', userInfo.avatarUrl)
            wx.setStorageSync('province', userInfo.province)
            wx.setStorageSync('gender', userInfo.gender)
            if (wx.getStorageSync('openid')) {
              setUser(userInfo.nickName, userInfo.avatarUrl)
            } else {
              setOpenid()
              setUser(userInfo.nickName, userInfo.avatarUrl)
            }
          }
        })
      }
    }
  })
}
function setUser (userName, userPhoto) {
  const query = Bmob.Query('sys_user')
  query.equalTo('openid', '==', wx.getStorageSync('openid'))
  query.find().then(res => {
    if (res.length === 0) {
      query.set('openid', wx.getStorageSync('openid'))
      query.set('name', userName)
      query.set('photo', userPhoto)
      query.set('logindate', formatDate(new Date(), 'yyyy-MM-dd hh:mm'))
      query.save().then(res => {
        const query2 = Bmob.Query('sys_cupboard')
        query2.set('openid', wx.getStorageSync('openid'))
        query2.set('name', '衣橱一号')
        query2.save().then(res2 => {
          query2.set('openid', wx.getStorageSync('openid'))
          query2.set('name', '衣橱二号')
          query2.save().then(res2 => {
            console.log(res2)
          }).catch(err => {
            console.log(err)
          })
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    } else {
      query.get(res[0].objectId).then(res => {
        console.log(res)
        res.set('logindate', formatDate(new Date(), 'yyyy-MM-dd hh:mm'))
        res.save()
      }).catch(err => {
        console.log(err)
      })
    }
  })
}
export default {
  Bmob,
  returnopen,
  setOpenid,
  setUser,
  setAuth
}
