<template>
	<view class="content">
		<!-- swiper -->
		<uni-swiper-dot class="uni-swiper-dot-box" :info="swiperInfo" :current="current" mode="default" field="content">
			<swiper class="swiper-box" @change="change" :current="swiperDotIndex">
				<swiper-item v-for="(item, index) in swiperInfo" :key="index">
					<view :class="item.colorClass" class="swiper-item">
						<image class="image" :src="item.url" mode="aspectFill" :draggable="false" />
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		
		<!-- 功能模块 -->
		<view class="model-wrap">
			<view class="model-item" v-for="(item,index) in modelList" :key="index" @click="goDetailPage(item.url,item.name)">
				<image class="image" :src="item.icon" mode="aspectFill" />
				<text>{{item.name}}</text>
			</view>
		</view>
	</view>
</template>
 
<script>
export default {
	data() {
		return {
			swiperInfo: [{
					colorClass: 'uni-bg-white',
					url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-f2032953-c244-4644-9e5c-06085656ab71/f1c485da-8257-44b9-abb9-930377607b56.jpg',
					content: ''
				},
				{
					colorClass: 'uni-bg-white',
					url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-f2032953-c244-4644-9e5c-06085656ab71/0a0ae0f5-479f-48d9-abd0-0fe70f98fd03.jpg',
					content: ''
				},
				{
					colorClass: 'uni-bg-white',
					url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-f2032953-c244-4644-9e5c-06085656ab71/82387b2f-ca18-48d5-a54b-e691307a3626.jpg',
					content: ''
				}
			],
			current:0,
			swiperDotIndex:0,
			modelList:[{
				name:'生产报表',
				url:'baobiao',
				icon:'../../../static/img/model-baobiao.png'
			},{
				name:'考勤',
				url:'kaoqin',
				icon:'../../../static/img/model-kaoqin.png'
			}]
		};
	},
	onLoad() {
		
	},
	computed:{
	},
	methods: {
		goDetailPage(path,title){
			const url = '/pages/home/' + path + '/' + path;
			uni.navigateTo({
				url: url,
				animationType: 'pop-in',
				animationDuration: 300
			})
		},
		change(e) {
			this.current = e.detail.current
		},
	}
};
</script>

<style>
	@import '../../../static/css/uni-nvue.css';
	@import '../../../static/css/home.css';
</style>
