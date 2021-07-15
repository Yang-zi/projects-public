<template>
	<view class="content">
		<div class="head">
			<div class="img">
				<img src="../../static/img/ico.png">
			</div>
			<p>{{loginTitle}}</p>
		</div>
		
		<view class="forms">
			<div class="input">
				<i class="input-ico accout"></i>
				<input type="text" v-model="form.account" placeholder="输入账号或工号">
			</div>
			<div class="input" style="margin-top: 10px;">
				<i class="input-ico password"></i>
				<input type="password" v-model="form.password" placeholder="输入密码">
			</div>
			<view class="action-row"> 
				<navigator url="../reg/reg">注册账号</navigator>
				<navigator url="../forget/forget">忘记密码</navigator>
			</view>
			 <button type="primary" @click="loginFuc">登&nbsp;录</button>
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			loginTitle:'FiiBot-CS',
			form:{
				account:'',
				password:''
			}
		};
	},
	onLoad() {
		let that = this;
		uni.getStorage({ 
		    key: 'userInfo',
		    success: function (res) {
				if(res.data && res.data!=null){
					that.form.account = res.data.jobNumber;
				}
		    }
		});
	},
	methods: {
		async loginFuc(){
			if(this.form.account == '' || !this.form.account || this.form.account == null) return;
			if(this.form.password == '' || !this.form.password || this.form.password == null) return;
			uni.showLoading({
				title: '登录中...'
			})
			return await uniCloud.callFunction({
				name: 'login', 
				data: this.form
			}).then((res) => {
				uni.hideLoading()
				let that = this;
				let _res=res.result;
				if(_res.status == 200){
					getApp().globalData.userInfo = _res.data;
					let storageData = {
						username:_res.data.username,
						jobNumber:_res.data.jobNumber,
						authority:_res.data.authority,
						administrators:_res.data.administrators
					}
					uni.setStorage({
						key: 'userInfo',
						data: storageData,
						success: function () {
							//登录成功进入主页
							uni.switchTab({
								url:'../tabbar/home/home'
							})
						}
					})
				}else if(_res.status == 500){
					uni.showToast({
						title: _res.message,
						icon:'none',
					})
				}
				
				return  _res.status;
			}).catch((err) => {
				uni.hideLoading()
				uni.showModal({
					content: `登录失败，错误信息为：${err.message}`,
					showCancel: false
				})
			})
		}
	}
};
</script>

<style>
	@import '../../static/css/login.css';
	uni-page-body{
		width: 100%;height: 100%; overflow-x: hidden;background: url(../../static/img/top_bg.png) top left no-repeat;background-size: 100%;
	}
	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		margin-top: 14rpx;
	}
	
	.action-row navigator {
		color: #007aff;
		padding: 0 10px;
	}
</style>
