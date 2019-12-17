<template>
<div class="page">
  <div class="page__bd">
    <wux-cell-group title="我的zone">
       <!--
      <wux-cell-group title="我的衣橱"></wux-cell-group>
      <wux-cell-group title="我的分类"></wux-cell-group>
      <wux-cell-group title="我的季节"></wux-cell-group>
      <wux-cell-group title="我的颜色"></wux-cell-group>
     -->
      <wux-cell thumb="/static/images/cupboard.png" title="我的衣橱" is-link @click="jumpTo('/pages/me/cupboard/main','我的衣橱')" ></wux-cell>
      <wux-cell thumb="/static/images/classification.png" title="我的分类" is-link  @click="onWaring"></wux-cell>
      <wux-cell thumb="/static/images/season.png" title="我的季节" is-link  @click="onWaring" ></wux-cell>
      <wux-cell thumb="/static/images/colour.png" title="我的颜色" is-link  @click="onWaring" ></wux-cell>
      
    </wux-cell-group>
  </div>
  </div>
</template>

<script>
import request from '@/utils/request.js'
// import { $wuxToptips } from '../../../static/wux/index'
export default {
  data () {
    return {
      userInfo: {},
      isShow: false,
      fileList: [],
      classification: '1',
      season: '1',
      colour: '1'
    }
  },
  methods: {
    onWaring(){
      // $wuxToptips().show({
      //       icon: 'cancel',
      //       hidden: false,
      //       text: 'Toptips Title',
      //       duration: 3000,
      //       success() {},
      //   })
      wx.showToast({
        title: '等待新功能！'
      })
      return;
    },
    jumpTo(url, title) {
      wx.navigateTo({
        url: url + '?title=' + title
      })
    },
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style scoped>
.all{
 
}
.all:after{
  
}
</style>
