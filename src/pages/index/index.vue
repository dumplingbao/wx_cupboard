<template>
	<div class="home"  >	
		<div class="container" v-if="userName">
      		<div class="userinfo">
        		<wux-avatar class="userinfo-desc" size="large" :src="userPhoto" />
        		<text class="userinfo-nickname">欢迎：{{ userName }}</text>
				<!-- <wux-search-bar clear maxlength="8" /> -->
      		</div>
		</div>
		
  		<div class="page__bd">
			<wux-segmented-control theme="stable" :values="enumValue" @change="onChange"/>
			<wux-grids theme="energized" v-if="typeValue==='分类'?true:false" :bordered="false">
				<wux-grid thumb="/static/images/coat.png" label="外套" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/hat.png" label="帽子" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/trousers.png" label="裤子"@click="jumpTo('/pages/assort/main','','')" />
				<wux-grid thumb="/static/images/shoes.png" label="鞋子" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/socks.png" label="袜子" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/skirt.png" label="裙子" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/package.png" label="包包" @click="jumpTo('/pages/assort/main','','')"/>
			</wux-grids>
			<wux-grids v-if="typeValue==='衣橱'?true:false" col="2" :bordered="false" >
				<wux-grid thumb="/static/images/cupboard.png" v-for="(item,index) in cupboardList" :key="index" :label="item.name" @click="jumpTo('/pages/assort/main','','')"/>
			</wux-grids>
			<wux-grids v-if="typeValue==='季节'?true:false" col="2" :bordered="false">
				<wux-grid thumb="/static/images/spring.png" label="春" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/summer.png" label="夏" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/autumn.png" label="秋" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/winter.png" label="冬" @click="jumpTo('/pages/assort/main','','')"/>
			</wux-grids>
			<wux-grids v-if="typeValue==='颜色'?true:false" col="4" :bordered="false">
				<wux-grid thumb="/static/images/little_boy_black.png" label="黑色" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/little_boy_blue.png" label="蓝色" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/little_boy_green.png" label="绿色" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/little_boy_grey.png" label="灰色" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/little_boy_orange.png" label="橘色" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/little_boy_pink.png" label="粉色" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/little_boy_purple.png" label="紫色" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/little_boy_red.png" label="红色" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/little_boy_white.png" label="白色" @click="jumpTo('/pages/assort/main','','')"/>
				<wux-grid thumb="/static/images/little_boy_yellow.png" label="黄色" @click="jumpTo('/pages/assort/main','','')"/>
			</wux-grids>
    	</div>	
		<div class="ceng" v-if="isCeng" @touchmove.stop.prevent="touchmovehandle">		
			<wux-button type="balanced" @getuserinfo="getVxUserInfo" open-type="getUserInfo" v-if="!userName" >点击微信授权</wux-button>
		</div>
		<wux-fab-button position="bottomRight" theme="balanced" direction="vertical" :reverse="false" spaceBetween="10" sAngle="0" eAngle="360" :buttons="buttons" @change="onChangeFab" @click="onClickFab" @contact="onContactFab" @getuserinfo="onGotUserInfoFab" />

	</div>
</template>
 
<script>
import request from '@/utils/request.js'
import {
    formatDate
  } from '@/utils/index.js'
const appId="XXXXXXXX"   //开发者appid
const secret="XXXXXXXX"  //开发者AppSecret(小程序密钥)	,登录微信小程序平台后-》开发-》开发设置-》开发者ID（AppSecret(小程序密钥)	）生成

const buttons = [{
        label: '新增衣服',
        icon: '/static/images/coat.png',
    },
    {
        label: '新增衣橱',
        icon: '/static/images/cupboard.png',
    },
]
export default{
	data(){
		return{
			userName:"",
      		userPhoto:"",
			enumValue: ['分类','衣橱','季节','颜色'],
			isCeng:true,
			typeValue: "分类",
			userinfo:{},  //存放用户信息，保存在自己的数据库中 
			cupboardList: [],
			buttons,		
		}
	},
	mounted(){
		this.isLogin()	
	},
	methods:{
		jumpTo(url, title, status) {
			wx.navigateTo({
				url: url + '?title=' + title + '&status=' + status
			})
		},
		onClickFab(e) {
			console.log('onClick', e.detail)
			if (e.detail.index === 3) {
				wx.switchTab({
					url: '/pages/index/index'
				})
			}
		},
		// onContactFab(e) {
        // console.log('onContact', e)
		// },
		// onGotUserInfoFab(e) {
		// 	console.log('onGotUserInfo', e)
		// },
		// onGotPhoneNumberFab(e) {
		// 	console.log('onGotPhoneNumber', e)
		// },
		onChangeFab(e) {
			console.log('onChange', e)
    	},

		getVxUserInfo(e){				
			if(e.target.userInfo){
				this.userName=e.target.userInfo.nickName;
				this.isCeng=false;
				this.isLogin()
			}else{
				this.userName="";
				this.isCeng=true;
			}	
		},
		onChange(e) {
			const { key, values } = e.mp.detail
			this.typeValue = values[key]
			if(values[key]==='衣橱'){
				const query = request.Bmob.Query('sys_cupboard')
				query.equalTo("openid","==",this.userinfo.openid)
				query.find().then(res => {
					console.log(res)
					this.cupboardList = res;
				});
			}
		},	
		isLogin(){		
			var _this=this;
	        wx.getSetting({
	          success(res) {    	          	 
	            if (!res.authSetting['scope.userInfo']) {//未授权getUserInfo            	
	              wx.authorize({
	                scope: 'scope.getUserInfo',
	                success(res) {	                
	                  // 用户已经同意小程序使用用户信息，后续调用 wx.userInfo 接口不会弹窗询问
	                  _this.isCeng=false;
	                  _this.userName=res.target.userInfo.nickName;
	                },
	                fail(err){
	                  console.log(err)
	                }
	              })
	            }else{//已授权
	              wx.getUserInfo({
	                success(res) {	
	                	_this.loginOk(res)
	                },
	                fail(err) {
	                  console.log(err)
	                }
	              })
	            }
	          }
	        })
	    },
		touchmovehandle(){ //解决vue蒙层滑动穿透问题
			
		},		
		loginOk(res){  //登录成功后的信息处理
			let _this=this;
			// _this.userinfo.encryptedData=res.encryptedData;
	        // _this.userinfo.iv=res.iv;
	        // _this.userinfo.rawData=res.rawData;
	        // _this.userinfo.signature=res.signature;
	        _this.userinfo.infos=res.userInfo;
	        _this.isCeng=false;
	        _this.userName=res.userInfo.nickName;
         	_this.userPhoto=res.userInfo.avatarUrl;
          	_this.getOpenId()
      
		},
		getOpenId(){  //获取用户的openid
			let _this=this;
			wx.login({
			  success(res) {
			  	  	if (res.code) {
				      // 发起网络请求
				      wx.request({
				        url: 'https://api.weixin.qq.com/sns/jscode2session',
				        data: {
				            appid:appId,  //开发者appid
				            secret:secret, //开发者AppSecret(小程序密钥)	
				            grant_type:"authorization_code",  //默认authorization_code
				            js_code: res.code    //wx.login登录获取的code值
				        },
				        success(res) {
				        	_this.userinfo.openid=res.data.openid;
				        	_this.userinfo.session_key=res.data.session_key;
							wx.setStorageSync("openid",_this.userinfo.openid)
            				wx.setStorageSync("session_key",_this.userinfo.session_key)
							const query = request.Bmob.Query('sys_user')
							query.equalTo("openid","==", _this.userinfo.openid);
							query.find().then(res => {
								if(res.length==0){
									query.set("openid",_this.userinfo.openid)
									query.set("name",_this.userName)
									query.set("photo",_this.userPhoto)
									query.set("logindate",formatDate(new Date(),'yyyy-MM-dd hh:mm'))
									query.save().then(res => {
										console.log(res)
										const query2 = request.Bmob.Query('sys_cupboard')
										query2.set("openid",_this.userinfo.openid)
										query2.set("name",'衣橱一号')
										query2.save().then(res => {
											query2.set("openid",_this.userinfo.openid)
											query2.set("name",'衣橱二号')
											query2.save().then(res => {
												console.log(res)
											}).catch(err => {
												console.log(err)
											})
										}).catch(err => {
											console.log(err)
										})
									}).catch(err => {
										console.log(err)
									})
								}else{
									query.get(res[0].objectId).then(res => {
										console.log(res)
										res.set("logindate",formatDate(new Date(),'yyyy-MM-dd hh:mm'))
										res.save()
									}).catch(err => {
										console.log(err)
									})
									
								}
							});						   
						}
				      })
				    } else {
				      console.log('登录失败！' + res.errMsg)
				    }
			  }
			})
		}
	},
}
</script>
 
<style scoped>
.home{
	padding-bottom: 140rpx;
}
.btn{
	background:#CCCCCC;
	color: black;
	width: 60%;
}
.ceng{
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0,0,0,0.8);
	z-index: 20;
	display: flex;
	align-items: center;	
	justify-content: center;
	flex-direction: column;
}
.container {
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 100rpx 0;
	box-sizing: border-box;
	text-align: center;
}
.userinfo {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.userinfo-nickname {
	text-align:center;
	color:#000;
	font-size:28rpx;
	margin-top:10rpx;
	width:auto;
	overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap;
	word-wrap:normal;
}
</style>