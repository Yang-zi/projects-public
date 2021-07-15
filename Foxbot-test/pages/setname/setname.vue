<template>
	<view>
		<view class="cu-form-group margin-top">
			<view class="title">昵称</view>
			<input placeholder="请输入新的昵称" name="input" v-model="formData.name"></input>
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
					jobNumber:"",
					name:""
				},
				loading:false,
				userInfo:null
			}
		},
		onLoad() {
			let that = this;
			uni.getStorage({
				key: 'userInfo', 
				success: function (res) {
					that.formData.jobNumber = res.data.jobNumber;
					that.userInfo = res.data;
				}
			});
		},
		methods: {
			async forget(){
				let that = this;
				if(that.formData.name == '') return
				that.loading=true;
				return await uniCloud.callFunction({
					name: 'setname', 
					data: that.formData
				}).then((res) => {
					that.loading = false;
					let _res=res.result;
					if(_res.status == 200){
						uni.showToast({
							title:'修改成功',
							icon:'success',
							success() {
								that.formData.name = '';
								if(that.userInfo!=null){
									that.userInfo.username = _res.data.name;
									uni.setStorage({
										key: 'userInfo',
										data: that.userInfo,
										success() {
											uni.navigateBack();
										}
									})
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
			},
			/* 监听页面返回 */
			onBackPress() {
				uni.$emit('mineupdate',{msg:'页面更新'})
			},
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
