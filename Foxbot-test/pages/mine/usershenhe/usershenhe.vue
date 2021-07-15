<template>
	<view class="container">
		<view class="cu-list menu sm-border">
			<view class="cu-item" v-for="(item,index) in list" :key="index">
				<view class="content" style="display: flex;justify-content: space-between;align-items: center;">
					<text class="text-grey">{{item.username}}( {{item.jobNumber}} )</text>
					<view class="margin-tb-sm text-center">
						<button class="cu-btn round bg-blue" @click="shenhe(item.jobNumber)">审核</button>
					</view>
				</view>
			</view>
		</view>	
		
		<view class="kong" v-if="list.length==0">
			<text>没有待审请求~</text>
		</view>
		
		<!-- 审核提示框 -->
		<view>
			<uni-popup ref="shenheDialog" type="dialog">
				<uni-popup-dialog type="error" title="温馨提示" content="是否通过ta的注册申请？" @confirm="logoutConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				current_id:''
			}
		},
		onLoad(e) {
			this.getData()
		},
		methods: {
			getData(){
				let that = this;
				uni.showLoading({
					title: '正在获取...'
				})
				
				uniCloud.callFunction({
					name: 'userGet',
					data:{
						type:1
					}
				}).then((res) => {
					let _res = res.result;
					that.list = _res;
					uni.hideLoading()
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `获取用户信息失败，错误信息为：${err.message}`,
						showCancel: false
					})
				})
			},
			shenhe(id){
				this.current_id = id;
				setTimeout(()=>{
					this.$refs.shenheDialog.open()
				},500)
			},
			logoutConfirm(){
				let that = this;
				
				uni.showLoading({
					title: '提交中...'
				})
				
				uniCloud.callFunction({
					name: 'userShenhe',
					data:{
						jobNumber:that.current_id
					}
				}).then((res) => {
					uni.hideLoading()
					let _res=res.result;
					if(_res.status == 200){
						uni.showToast({
							title:_res.message,
							icon:'success',
							success() {
								let idx = that.list.findIndex((item,index)=>{ return item.jobNumber == that.current_id })
								that.list.splice(idx,1);
							}
						})
					}else{
						uni.showToast({
							title:_res.message,
							icon:'none'
						})
					}
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `失败，错误信息为：${err.message}`,
						showCancel: false
					})
				})
			}
		}
	}
</script>

<style>
	uni-page-body{
		background-color: #F1F1F1!important;
		overflow: hidden;
	}
	.container{
		width: 100%;
		margin-top: 10px;
		overflow: hidden; 
	}
	.user{
		width: 100%;
		box-sizing: border-box;
		padding: 20px 50px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 17px;
	}
	.cu-btn{
		height: 30px!important;
	}
	.kong{
		width: 100%;
		text-align: center;
		font-size: 14px;
		color: #515151;
		overflow: hidden;
		background-color: #FFFFFF;
		padding-top: 50px;
	}
</style>
