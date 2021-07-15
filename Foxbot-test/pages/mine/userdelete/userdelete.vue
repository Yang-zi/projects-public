<template>
	<view class="container">
		<uni-forms :value="formData" ref="form" >
			<uni-group title="" top="0">
				<uni-forms-item name="jobNumber" label="工号">
					<uni-easyinput type="text" v-model="formData.jobNumber" placeholder="请输入工号"></uni-easyinput>
					<text class="text-delete">输入工号, 注销此用户账号,注意此操作将永久删除该用户</text>
				</uni-forms-item>
				<button type="warn" style="font-size: 32rpx;margin-top: 100rpx;" @click="deleteFuc">确认删除</button>
			</uni-group>
		</uni-forms>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData:{
					jobNumber:''
				}
			}
		},
		onLoad(e) {
			
		},
		methods: {
			async deleteFuc(){
				if(this.formData.jobNumber == '' || !this.formData.jobNumber || this.formData.jobNumber == null){
					uni.showToast({
					    title: '请输入工号',
						icon:'none',
					    duration: 2000
					});
					return
				}
				
				uni.showLoading({
					title: '请等待...'
				})
				
				return await uniCloud.callFunction({
					name: 'userDelete',
					data: {
						jobNumber:this.formData.jobNumber,
					}
				}).then((res) => {	
					let _res = res.result;
					uni.hideLoading()
					
					if(_res.status == 200){
						uni.showToast({
						    title: _res.message,
							icon:'success',
						    duration: 2000
						});
						this.formData.jobNumber = '';
					}else if(_res.status == 500){
						uni.showToast({
						    title: _res.message,
							icon:'none',
						    duration: 2000
						});
					}
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `添加失败${err.message}`,
						showCancel: false
					})
				})
			}
		}
	}
</script>

<style>
	.container{
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx 50rpx;
	}
	.text-delete{
		font-size: 12px;
		color: #555555;
		margin-top: 5px;
		display: block;
		line-height: 20px;
		padding-left: 6px;
	}
</style>
