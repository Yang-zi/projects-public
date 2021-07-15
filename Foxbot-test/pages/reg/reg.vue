<template>
	<view> 
		<view class="cu-form-group margin-top">
			<view class="title">昵称</view>
			<input placeholder="真实姓名" name="input" v-model="formData.name"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">账号</view>
			<input placeholder="输入账号或工号" name="input" v-model="formData.account"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">密码</view>
			<input placeholder="请输入密码" name="input" type="password" v-model="formData.pw1"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">密码</view>
			<input placeholder="请再次输入密码" name="input" type="password" v-model="formData.pw2"></input>
		</view>
		
		<view class="submit-btn">
			<button class="cu-btn block bg-blue margin-tb-sm lg" @click="reg">
				<text v-if="loading" class="cuIcon-loading2 cuIconfont-spin"></text> {{loading ? '提交中':'立即注册'}}</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData:{
					name:'',
					account:'',
					pw1:'',
					pw2:''
				},
				loading:false
			};
		},
		onLoad() {
			
		},
		methods: {
			async reg(){
				let that = this;
				let data = that.formData;
				data.createTime = Date.now();
				if(data.name == ''){
					uni.showToast({
						title:'请输入昵称',
						icon:'none'
					})
					return
				}
				if(data.account == ''){
					uni.showToast({
						title:'账号不能为空',
						icon:'none'
					})
					return
				}
				if(data.pw1 != data.pw2){
					uni.showToast({
						title:'两次密码输入不一致',
						icon:'none'
					})
					return
				}
				if(data.pw1.length>15 || data.pw1.length<3){
					uni.showToast({
						title:'密码长度应为3~15个字符',
						icon:'none'
					})
					return
				}
				that.loading = true;
				return await uniCloud.callFunction({
					name: 'reg', 
					data: data
				}).then((res) => {
					that.loading = false;
					let _res=res.result;
					if(_res.status == 200){
						uni.showToast({
							title:_res.message,
							icon:'success',
							duration: 3000
						});
						
						for(let [key,val] of Object.entries(that.formData)){
							that.formData[key] = ''
						}
					}else if(_res.status == 500){
						//注册失败的其他情况
						uni.showToast({
							title:_res.message,
							icon:"none"
						})
					}
				}).catch((err) => {
					that.loading = false;
					uni.showModal({
						content: `注册失败，错误信息为：${err.message}`,
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
