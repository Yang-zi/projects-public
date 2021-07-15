<template>
	<view class="container">
		<view class="uni-container" style="padding-left: 0;padding-right: 0;">
			<view :class="{'pc-hide': hideList.indexOf(item.url) !== -1  && hasLeftWin}" class="uni-panel" v-for="item in lists" :key="item.url">
				<view class="uni-panel-h" @click="goDetailPage(item.url,item.name)">
					<text class="uni-panel-text">{{item.name}}</text>
					<text class="uni-panel-icon uni-icon">&#xe470;</text>
				</view>
			</view>
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
					name: "用户列表",
					url: "userlist"
				},{
					name: "用户审核",
					url: "usershenhe"
				},{
					name: "删除用户",
					url: "userdelete"
				}]
			}
		},
		onLoad(e) {
			const title = e.title;
			uni.setNavigationBarTitle({
				title: title
			});
		},
		methods: {
			goDetailPage(path,title){
				const url = '/pages/mine/' + path + '/' + path + '?title=' + title
				uni.navigateTo({
					url: url,
					animationType: 'pop-in',
					animationDuration: 300
				})
			}
		}
	}
</script>

<style>
	@import '../../../static/css/uni-nvue.css';
	.container{
		width: 100%;
		box-sizing: border-box;
		padding: 25rpx 30rpx;
	}
</style>
