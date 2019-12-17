<template>
    <div class="page__bd">
        <wux-filterbar :items="items" @change="onChange" @open="onOpen" @close="onClose" />
        <div class="weui-panel weui-panel_access" :catchtouchmove="opened ? 'noop' : ''">
            <div class="weui-panel__bd">
                <div class="weui-media-box weui-media-box_appmsg" hover-class="weui-cell_active" v-for="(item,index) in repos" :key="index">
                    <div class="weui-media-box__hd weui-media-box__hd_in-appmsg">
                        <image class="weui-media-box__thumb" :src="item.picurls[0].url" />
                    </div>
                    <div class="weui-media-box__bd weui-media-box__bd_in-appmsg">
                        <div class="weui-media-box__title">{{ item.name }}</div>
                        <div class="weui-media-box__desc">{{ item.description }}</div>
                        <div class="weui-media-box__info">
                            <wux-tag color="#f50">{{ item.cupboardName }}</wux-tag>
                            <wux-tag v-for="(item1,index1) in item.colours" :key="index1">{{ item1 }}</wux-tag>
                            <wux-tag color="#2db7f5" v-for="(item2,index2) in item.seasons" :key="index2">{{ item2 }}</wux-tag>
                            <wux-tag color="#87d068">{{ item.classification }}</wux-tag>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import request from '@/utils/request.js'
export default {
  data () {
    return {
      repos: [],
      reposbak: [],
      items: [{
                type: 'radio',
                label: '排序',
                value: '排序',
                checked: true,
                children: [{
                        label: '分类',
                        value: '分类',
                        // checked: true, // 默认选中
                    },
                    {
                        label: '颜色',
                        value: '颜色',
                    },
                    {
                        label: '季节',
                        value: '季节',
                    },
                ],
                groups: ['001'],
            },
            {
                type: 'text',
                label: '换照片',
                value: '换照片',
                groups: ['002'],
            },
            {
                type: 'sort',
                label: '喜爱程度',
                value: '喜爱程度',
                groups: ['003'],
            },
            {
                type: 'filter',
                label: '筛选',
                value: 'filter',
                checked: true,
                children: [{
                        type: 'radio',
                        label: '衣橱',
                        value: '衣橱',
                        children: []
                    },
                    {
                        type: 'checkbox',
                        label: '分类',
                        value: '分类',
                        children: [{
                              label: '外套',
                              value: '外套',
                          }, {
                              label: '帽子',
                              value: '帽子',
                          }, {
                              label: '裤子',
                              value: '裤子',
                          }, {
                              label: '鞋子',
                              value: '鞋子',
                          }, {
                              label: '袜子',
                              value: '袜子',
                          }, {
                              label: '裙子',
                              value: '裙子',
                          }, {
                              label: '包包',
                              value: '包包',
                          }
                        ],
                    },
                    {
                        type: 'checkbox',
                        label: '季节',
                        value: '季节',
                        children: [{
                              label: '春',
                              value: '春',
                          }, {
                              label: '夏',
                              value: '夏',
                          }, {
                              label: '秋',
                              value: '秋',
                          }, {
                              label: '冬',
                              value: '冬',
                          }
                        ],
                    },
                    {
                        type: 'checkbox',
                        label: '颜色',
                        value: '颜色',
                        children: [{
                              label: '黑色',
                              value: '黑色',
                          }, {
                              label: '蓝色',
                              value: '蓝色',
                          }, {
                              label: '绿色',
                              value: '绿色',
                          }, {
                              label: '灰色',
                              value: '灰色',
                          }, {
                              label: '橘色',
                              value: '橘色',
                          }, {
                              label: '粉色',
                              value: '粉色',
                          }, {
                              label: '紫色',
                              value: '紫色',
                          }, {
                              label: '红色',
                              value: '红色',
                          }, {
                              label: '白色',
                              value: '白色',
                          }, {
                              label: '黄色',
                              value: '黄色',
                          }
                        ],
                    },
                ],
                groups: ['001', '002', '003'],
            },
        ],
    }
  },

  methods: {
    onChange(e) {
        const { checkedItems, items, checkedValues } = e.mp.detail
        const params = {}
        console.log(checkedItems, items, checkedValues)

        checkedItems.forEach((n) => {
            if (n.checked) {
                if (n.value === '排序') {
                    const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
                    params.sort = n.value
                    params.order = selected
                } else if (n.value === '换照片') {
                    params.sort = n.value
                    params.order = n.sort === 1 ? 'asc' : 'desc'
                } else if (n.value === '喜爱程度') {
                    params.sort = n.value
                } else if (n.value === 'filter') {
                    n.children.filter((n) => n.selected).forEach((n) => {
                        if (n.value === '衣橱') {
                            const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
                            params.cupboard = selected
                        } else if (n.value === '分类') {
                            const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
                            params.classifications = selected
                        }else if (n.value === '季节') {
                            const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
                            params.seasons = selected
                        }else if (n.value === '颜色') {
                            const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
                            params.colours = selected
                        }
                    })
                }
            }
        })

        console.log('params', params)

        this.getFilter(params)
    },
    judgeColour(abc,colours){
      let tmp = colours.split(' ')
      let tmpRe = false
      tmp.map(item=>{
        if(abc.includes(item)){
          tmpRe = true
        }
      })
      return tmpRe
    },
    judgeSeason(abc,seasons){
      let tmp = seasons.split(' ')
      let tmpRe = false
      tmp.map(item=>{
        if(abc.includes(item)){
          tmpRe = true
        }
      })
      return tmpRe
    },
    judgeClassification(abc,classifications){
      let tmp = classifications.split(' ')
      let tmpRe = false
      tmp.map(item=>{
        if(abc === item){
          tmpRe = true
        }
      })
      return tmpRe
    },
    getFilter(params = {}){
      this.repos = this.reposbak
      if(params.cupboard){
        this.reposbak.map(item=>{
          if(!this.judgeClassification(item.cupboardid,params.cupboard)){
            this.repos = this.repos.filter(function (item1){
              return item1.objectId !=item.objectId
            })
          }
        })
      }
      if(params.colours){
        this.reposbak.map(item=>{
          if(!this.judgeSeason(item.colours,params.colours)){
            this.repos = this.repos.filter(function (item1){
              return item1.objectId !=item.objectId
            })
          }
        })
      }
      if(params.seasons){
        this.reposbak.map(item=>{
          if(!this.judgeSeason(item.seasons,params.seasons)){
            this.repos = this.repos.filter(function (item1){
              return item1.objectId !=item.objectId
            })
          }
        })
      }
      if(params.classifications){
        this.reposbak.map(item=>{
          if(!this.judgeClassification(item.classification,params.classifications)){
            this.repos = this.repos.filter(function (item1){
              return item1.objectId !=item.objectId
            })
          }
        })
      }
    },
    
    getRepos(params = {}) {
        // const language = params.language || 'javascript'
        // const query = params.query || 'react'
        // const q = `${query}+language:${language}`
        // const data = Object.assign({
        //     q,
        //     order: 'desc',
        // }, params)

        // wx.showLoading()
        // wx.request({
        //     url: `https://api.github.com/search/repositories`,
        //     data,
        //     success: (res) => {
        //         console.log(res)

        //         wx.hideLoading()

        //         this.repos= res.data.items.map((n) => Object.assign({}, n, {
        //             date: n.created_at.substr(0, 7),
        //         })),
        //     },
        // })
        const query = request.Bmob.Query("sys_clothes");
        query.equalTo("openid", "==", wx.getStorageSync('openid'));
        
        query.find().then(res => {
          res.map(item=>{
            const query = request.Bmob.Query("sys_cupboard");
            query.get(item.cupboardid).then(res1 =>{
              item.cupboardName = res1.name
            })
          })
          console.log(11111111111111111)
          console.log(res)
          this.repos = res
          this.reposbak = res
        });
        
    },
    onOpen(e) {
        // this.setData({ opened: true })
    },
    onClose(e) {
        // this.setData({ opened: false })
    },
    /**
     * 阻止触摸移动
     */
    noop() {},
  },

  created () {
    
  },
  onLoad() {
    this.getRepos()
  },
  onShow(){
     // let app = getApp()
    let _this = this;
      _this.items[3].children[0].children = []
      _this.openid = wx.getStorageSync("openid")
      const query = request.Bmob.Query('sys_cupboard')
      query.equalTo("openid","==",_this.openid)
      query.find().then(res => {
        if(res.length>0){
          res.map(item=>{
            _this.items[3].children[0].children = _this.items[3].children[0].children.concat({label:item.name,value:item.objectId})
          })
        }
      }); 
  }
}
</script>

<style scoped>
.page__hd {
    padding: 40px;
    padding-bottom: 40px;
}
.weui-panel {
  background-color: #FFFFFF;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}
.weui-panel:first-child {
  margin-top: 0;
}
.weui-panel:before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1rpx solid #E5E5E5;
  color: #E5E5E5;
}
.weui-panel:after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1rpx solid #E5E5E5;
  color: #E5E5E5;
}
.weui-panel__hd {
  padding: 14px 15px 10px;
  color: #999999;
  font-size: 13px;
  position: relative;
}
.weui-panel__hd:after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1rpx solid #E5E5E5;
  color: #E5E5E5;
  left: 15px;
}
.weui-media-box {
  padding: 15px;
  position: relative;
}
.weui-media-box:before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1rpx solid #E5E5E5;
  color: #E5E5E5;
  left: 15px;
}
.weui-media-box:first-child:before {
  display: none;
}
.weui-media-box__title {
  font-weight: 400;
  font-size: 17px;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  word-wrap: break-word;
  word-break: break-all;
}
.weui-media-box__desc {
  color: #999999;
  font-size: 13px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.weui-media-box__info {
  margin-top: 15px;
  padding-bottom: 5px;
  font-size: 13px;
  color: #CECECE;
  line-height: 1em;
  list-style: none;
  overflow: hidden;
}
.weui-media-box__info__meta {
  float: left;
  padding-right: 1em;
}
.weui-media-box__info__meta_extra {
  padding-left: 1em;
  border-left: 1px solid #CECECE;
}
.weui-media-box__title_in-text {
  margin-bottom: 8px;
}
.weui-media-box_appmsg {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
          align-items: center;
}
.weui-media-box__thumb {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
.weui-media-box__hd_in-appmsg {
  margin-right: .8em;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.weui-media-box__bd_in-appmsg {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
          flex: 1;
  min-width: 0;
}
.weui-media-box_small-appmsg {
  padding: 0;
}
.weui-media-box_appmsg {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
          align-items: center;
}
.weui-cell_active {
  background-color: #ECECEC;
}
.weui-media-box__hd_in-appmsg {
  margin-right: .8em;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.weui-media-box__thumb {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
</style>
