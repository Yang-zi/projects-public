<template>
	<view>
		<view class="cu-form-group margin-top">
			<view class="title">账号</view>
			<input placeholder="请输入账号或工号" name="input" v-model="formData.account"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">原密码</view>
			<input placeholder="请输入原密码" name="input" type="password" v-model="formData.password_old"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">新密码</view>
			<input placeholder="请输入新密码" name="input" type="password" v-model="formData.password_new1"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">新密码</view>
			<input placeholder="请再次输入新密码" name="input" type="password" v-model="formData.password_new2"></input>
		</view>
		<view class="submit-btn">
			<button class="cu-btn block bg-blue margin-tb-sm lg" @click="forget">
				<text v-if="loading" class="cuIcon-loading2 cuIconfont-spin"></text> {{loading ? '提交中':'确认修改'}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData:{
					account:'',
					password_old:'',
					password_new1:'',
					password_new2:''
				},
				loading:false
			};
		},
		onLoad(param) {
			let that = this;
			if(param && param.type == '1'){
				uni.getStorage({
				    key: 'userInfo', 
				    success: function (res) {
						that.formData.account = res.data.jobNumber;
				    }
				});
				uni.setNavigationBarTitle({
					title: '修改密码'
				});
			}
		},
		methods: {
			async forget(){
				let that = this;
				for(let [key,val] of Object.entries(that.formData)){
					if(val == ''){
						uni.showToast({
							title:'请输入完整信息',
							icon:'none'
						})
						return
					}
				}
				if(that.formData.password_new1 != that.formData.password_new2){
					uni.showToast({
						title:'两次密码输入不一致',
						icon:'none'
					})
					return
				}
				that.loading=true;
				return await uniCloud.callFunction({
					name: 'forget', 
					data: that.formData
				}).then((res) => {
					that.loading = false;
					let _res=res.result;
					if(_res.status == 200){
						uni.showToast({
							title:'修改成功',
							icon:'success',
							success() {
								for(let [key,val] of Object.entries(that.formData)){
									that.formData[key] = '';
								}
							}
						})
					}else if(_res.status == 500){
						uni.showToast({
							title:_res.message,
							icon:'none'
						})
					}
				}).catch((err) => {
					that.loading = false;
					uni.showModal({
						content: `提交失败，错误信息为：${err.message}`,
						showCancel: false
					})
				})
			}
		}
	};
</script>


<style>
	uni-page-body{
		background-color: #F1F1F1!important;
		overflow: hidden;
	}
	.margin-top{
		margin-top: 20rpx;
	}
	.submit-btn{
		width: 100%;
		background-color: #FFFFFF;
		padding-top: 30px;
	}
	.cu-btn{
		width: 80%;
		margin: 0 auto;
	}
</style>
