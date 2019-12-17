<template>
  <div>
    <wux-cell-group title="衣服名称">
      <wux-cell hover-class="none">
          <input name="body" id="body" v-model="body" placeholder="请输入衣服名称" />
      </wux-cell>
    </wux-cell-group>
    <wux-cell-group title="上传图片">
        <wux-upload listType="picture-card" max="4" url="https://www.skyvow.cn/api/common/file"            @change="onChange" @success="onSuccess" @fail="onFail" @complete="onComplete" @preview="onPreview">
          <text>请选择</text>
        </wux-upload>
    </wux-cell-group>
    
    <wux-cell-group>
      <wux-popup-select :value="cupboard" :options="cupboardOption" data-index="cupboard" @confirm="onConfirm" @valueChange="onValueChange">
          <wux-cell title="请选择衣橱" is-link :extra="displayCupboard"></wux-cell>
      </wux-popup-select>
      <wux-popup-select :value="classification" :options="classificationOption" data-index="classification" @confirm="onConfirm" @valueChange="onValueChange">
          <wux-cell title="请选择分类" is-link :extra="displayClassification"></wux-cell>
      </wux-popup-select>
      <wux-popup-select :value="season" :options="seasonOption" multiple data-index="season" @confirm="onConfirm" @valueChange="onValueChange">
          <wux-cell title="请选择季节" is-link :extra="displaySeason"></wux-cell>
      </wux-popup-select>
      <wux-popup-select :value="colour" :options="colourOption" multiple data-index="colour" @confirm="onConfirm" @valueChange="onValueChange">
          <wux-cell title="请选择颜色" is-link :extra="displayColour"></wux-cell>
      </wux-popup-select>
    </wux-cell-group>
    
    <div class="btn-area">
        <button formType="submit" @click="jumpUrl('/pages/book_detail/main')">提交</button>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request.js'
export default {
  data () {
    return {
      fileList: [],
      cupboard: '',//cupboard
      classification: '',//classification
      season: '',//season
      colour: '',//colour
      displayCupboard: '请选择',
      displayClassification: '请选择',
      displaySeason: '请选择',
      displayColour: '请选择',
      classificationOption: [{
            title: '外套',
            value: '外套',
        }, {
            title: '帽子',
            value: '帽子',
        }, {
            title: '裤子',
            value: '裤子',
        }, {
            title: '鞋子',
            value: '鞋子',
        }, {
            title: '袜子',
            value: '袜子',
        }, {
            title: '裙子',
            value: '裙子',
        }, {
            title: '包包',
            value: '包包',
        }],
      seasonOption: [{
            title: '春',
            value: '春',
        }, {
            title: '夏',
            value: '夏',
        }, {
            title: '秋',
            value: '秋',
        }, {
            title: '冬',
            value: '冬',
        }],
      colourOption: [{
            title: '黑色',
            value: '黑色',
        }, {
            title: '蓝色',
            value: '蓝色',
        }, {
            title: '绿色',
            value: '绿色',
        }, {
            title: '灰色',
            value: '灰色',
        }, {
            title: '橘色',
            value: '橘色',
        }, {
            title: '粉色',
            value: '粉色',
        }, {
            title: '紫色',
            value: '紫色',
        }, {
            title: '红色',
            value: '红色',
        }, {
            title: '白色',
            value: '白色',
        }, {
            title: '黄色',
            value: '黄色',
        }],
      openid: '',
      cupboardOption: [],
      body: ''
    }
  },

  methods: {
    setValue(values, key) {
        if(key==='cupboard'){
          this.cupboard = values.value
          this.displayCupboard = values.label
        }
        if(key==='classification'){
          this.classification = values.value
          this.displayClassification = values.label
        }
        if(key==='season'){
          this.season = values.value
          this.displaySeason = values.label
        }
        if(key==='colour'){
          this.colour = values.value
          this.displayColour = values.label
        }
    },
    onConfirm(e) {
        const { index } = e.currentTarget.dataset
        this.setValue(e.mp.detail, index)
    },
    onValueChange(e) {
        const { index } = e.currentTarget.dataset
    },
    onVisibleChange(e) {
        this.setData({ visible: e.mp.detail.visible })
    },

    onChange(e) {
        console.log('onChange', e)
        const { file } = e.mp.detail
        if (file.status === 'uploading') {
            wx.showLoading()
        } else if (file.status === 'done') {
            this.fileList = e.mp.detail.fileList
        }
    },
    onSuccess(e) {
        console.log('onSuccess', e)
    },
    onFail(e) {
        console.log('onFail', e)
    },
    onComplete(e) {
        console.log('onComplete', e)
        
        wx.hideLoading()
    },
    // onProgress(e) {
    //     console.log('onProgress', e)
    //     this.setData({
    //         progress: e.mp.detail.file.progress,
    //     })
    // },
    onPreview(e) {
        console.log('onPreview', e)
        const { file, fileList } = e.mp.detail
        wx.previewImage({
            current: file.url,
            urls: fileList.map((n) => n.url),
        })
    },
    onRemove(e) {
        const { file, fileList } = e.mp.detail
        wx.showModal({
            content: '确定删除？',
            success: (res) => {
                if (res.confirm) {
                    // this.setData({
                    //     fileList: fileList.filter((n) => n.uid !== file.uid),
                    // })
                    this.fileList = fileList.filter((n) => n.uid !== file.uid)
                }
            },
        })
    },
    jumpUrl(url){
        if(this.body == ""){
          wx.showToast({
            title: '请输入衣服名称'
          })
          return;
        }
        if(this.fileList&&this.fileList.length<1){
          wx.showToast({
            title: '请上传图片'
          })
          return;
        }
        if(this.cupboard == ""){
          wx.showToast({
            title: '请选择衣橱'
          })
          return;
        }
        if(this.classification == ""){
          wx.showToast({
            title: '请选择分类'
          })
          return;
        }
        if(this.season == ""){
          wx.showToast({
            title: '请选择季节'
          })
          return;
        }
        if(this.colour == ""){
          wx.showToast({
            title: '请选择颜色'
          })
          return;
        }
        // console.log("colum:==")
        // console.log(this.fileList)
        // console.log(this.cupboard)
        // console.log(this.classification)
        // console.log(this.season)
        // console.log(this.colour)
        let file
        for(let item of this.fileList){
          file = request.Bmob.File('adb.jpg', item.url);
        }
        file.save().then(res => {
          // console.log("files+====")
          // console.log(res.length);
          // console.log(res);
          const query = request.Bmob.Query('sys_clothes');
          query.set("name",this.body)
          query.set("openid",wx.getStorageSync('openid'))
          query.set("picurls",res)
          query.set("cupboardid",this.cupboard)
          query.set("classification",this.classification)
          query.set("seasons",this.season)
          query.set("colours",this.colour)
          query.save().then(res => {
            this.jumpUrl2('/pages/index/main')
          }).catch(err => {
            console.log(err)
          })
        })
      },
      jumpUrl2(url) {
        mpvue.reLaunch({
          url: url
        })
      },
  },

  created () {
    // let app = getApp()
  },
  onLoad() {

  },
  onShow(){
      let _this = this;
      _this.cupboardOption = []
      _this.openid = wx.getStorageSync("openid")
      const query = request.Bmob.Query('sys_cupboard')
      query.equalTo("openid","==",_this.openid)
      query.find().then(res => {
        console.log(res)
        if(res.length>0){
          res.map(item=>{
            this.cupboardOption = this.cupboardOption.concat({title:item.name,value:item.objectId})
          })
        }
      });
  }
}
</script>

<style scoped>
.all{
  width:7.5rem;
  height:1rem;
  background-color:blue;
}
.all:after{
  display:block;
  content:'';
  clear:both;
}
</style>
