<template>
<div>
  <wux-cell-group title="我的衣橱">
      
      <wux-cell thumb="/static/images/cupboard.png" :title="item.name" :value="item.objectId" v-for="(item,index) in cupboardList" :key="index"></wux-cell>
      
  </wux-cell-group>
</div>
</template>

<script>
import request from '@/utils/request.js'
import '../../../../static/wux/styles/index.wxss'
export default {
  data () {
    return {
      cupboardList: [],
    }
  },
  methods: {
    onWaring(){
      wx.showToast({
        title: '等待新功能！'
      })
      return;
    }
  },

  created () {
    // let app = getApp()
  },
  onShow(){
      let _this = this;
      _this.openid = wx.getStorageSync("openid")
      const query = request.Bmob.Query('sys_cupboard')
      query.equalTo("openid","==",_this.openid)
      query.find().then(res => {
        console.log(res)
        this.cupboardList = res;
      });
  }
}
</script>

<style scoped>
.all{
 
}
.all:after{
  
}
</style>
