<template>
	<view class="container">
		<uni-forms :value="formData" ref="form" >
			<uni-group title="输入工号, 为ta添加一个访问权限:" top="0">
				
				<uni-forms-item name="jobNumber" label="工号">
					<uni-easyinput type="text" v-model="formData.jobNumber" placeholder="请输入工号"></uni-easyinput>
				</uni-forms-item>
				<button type="primary" style="font-size: 32rpx;margin-top: 170rpx;" @click="submit">确认添加</button>
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
			const title = e.title;
			uni.setNavigationBarTitle({
				title: title
			});
		},
		methods: {
			async submit(){
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
					name: 'userAdd',
					data: {
						jobNumber:this.formData.jobNumber,
						createTime: Date.now()
					}
				}).then((res) => {	
					console.log(JSON.stringify(res))
					let _res = res.result;
					uni.hideLoading()
					
					if(_res.status == 200){
						uni.showToast({
						    title: '添加成功',
							icon:'success',
						    duration: 2000
						});
					}else if(_res.status == 500){
						uni.showToast({
						    title: res.result.message,
							icon:'none',
						    duration: 2000
						});
					}
					
					return res.result.msg
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
</style>
