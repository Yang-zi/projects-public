<template>
	<view class="content">
		<view class="userInfo">
			<view class="user-touxiang">{{touxiangText}}</view>
			<view class="user-text">
				<text style="font-size: 52rpx;">{{userInfo.username}}</text>
				<text style="font-size: 25rpx;margin-top: 16rpx;color: #666666;">{{userInfo.jobNumber}}</text>
			</view>
		</view>
		 
		<view class="uni-container" style="padding-left: 0;padding-right: 0;">
			<view class="mine-nav" v-for="item in lists" :key="item.url" style="margin-bottom: 5px;" @click="goDetailPage(item.url,item.name)" v-if="item.show">
				<text class="uni-panel-text" style="width: 200px;">{{item.name}}</text>
				<text class="uni-panel-icon uni-icon">&#xe470;</text>
			</view>
		</view>
		
		<!-- 退出登录提示框 -->
		<view>
			<uni-popup ref="logoutDialog" type="dialog">
				<uni-popup-dialog type="error" title="退出登录" content="是否退出当前账号？" @confirm="logoutConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hideList: [
					'load-more'
				],
				lists: [{
					name: "用户管理",
					url: "/pages/mine/user/user",
					show:true
				},{
					name: "修改昵称",
					url: "/pages/setname/setname",
					show:true
				},{
					name: "修改密码",
					url: "/pages/forget/forget?type=1",
					show:true
				},{
					name: "退出登录",
					url: "loginout",
					show:true
				}],
				userInfo:{
					username:'',
					jobNumber:'未登录',
					administrators:false,	//超级管理员
					authority:false		//访问权限
				}
			}
		},
		onLoad() {	
			let that = this;
			uni.getStorage({
			    key: 'userInfo', 
			    success: function (res) {
					for(let [key,val] of Object.entries(that.userInfo)){
						that.userInfo[key] = res.data[key];
					}
					that.lists[0].show = that.userInfo.administrators;
			    }
			});
		},
		onShow() {
			let that = this;
			uni.$on('mineupdate',function(data){
				that.getUserInfo()
			})
		},
		computed:{
			touxiangText(){
				let username = this.userInfo.username;
				if(username == '' || username==null) return '';
				return username.substr(0,1).toUpperCase()
			}
		},
		methods: {
			goDetailPage(path,title){
				if(path == 'loginout'){
					this.$refs.logoutDialog.open()
				}else{
					if(!this.userInfo.administrators){
						uni.showToast({
							title: '此功能为超级管理员权限~',
							icon:'none',
						})
						return; 
					}
					
					uni.navigateTo({
						url: path,
						animationType: 'pop-in',
						animationDuration: 300
					})
				}
			},
			logoutConfirm(){
				uni.clearStorage({
					key: 'userInfo',
					success: function () {
						uni.reLaunch({
							url:'/pages/login/login'
						})
					}
				});
			},
			getUserInfo(){
				let that = this;
				uni.getStorage({
				    key: 'userInfo', 
				    success: function (res) {
						for(let [key,val] of Object.entries(that.userInfo)){
							that.userInfo[key] = res.data[key];
						}
						that.lists[0].show = that.userInfo.administrators;
				    }
				});
			}
		}
	}
</script>

<style>
	@import '../../../static/css/uni-nvue.css';
	.content {
		width: 100%;
		box-sizing: border-box;
	}
	.userInfo{
		width: 100%;
		box-sizing: border-box;
		padding: 80rpx 30rpx 40rpx 30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		background-color: #FFFFFF;
		border-bottom: 1px solid #f8f8f8;
	}
	.userInfo .user-touxiang{
		width: 150rpx;
		height: 150rpx;
		min-width: 150rpx;
		background-color:#008DF0;
		border-radius: 8rpx;
		font-size: 80rpx;
		color: #FFFFFF;
		line-height: 150rpx;
		text-align: center;
	}
	.userInfo .user-text{
		height: 150rpx;
		margin-left: 32rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}
	.mine-nav{
		width:100%;
		box-sizing: border-box;
		padding: 30rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid #f4f4f4;
		border-bottom: 1px solid #f4f4f4;
	}
	.mine-nav:active{
		background-color: #e1e1e1;
	}
</style>
