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
		if(wx.getStorageSync('openid')){
			this.isCeng=false;
		}
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
		onChangeFab(e) {
			console.log('onChange', e)
    	},

		getVxUserInfo(e){				
			if(e.target.userInfo){
				this.userName=e.target.userInfo.nickName;
				this.isCeng=false;
				request.setAuth()
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
		touchmovehandle(){ //解决vue蒙层滑动穿透问题
			
		}	
	}
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