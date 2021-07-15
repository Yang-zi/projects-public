<template>
	<uni-indexed-list :options="list" :show-select="false"/>
</template>

<script>
	export default {
		data() {
			return {
				list:[]
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
						type:0
					}
				}).then((res) => {
					that.dataChuli(res.result).then(res=>{
						that.list = res;
						that.$nextTick(()=>{
							uni.hideLoading()
						})
					}).catch(err=>{
						uni.hideLoading()
						uni.showToast({
							title: '获取失败，解析错误',
							icon:'none',
						})
					})
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `获取用户信息失败，错误信息为：${err.message}`,
						showCancel: false
					})
				})
			},
			dataChuli(datas){
				return new Promise((resolve,reject)=>{
					let list = [];
					datas.forEach((item,index)=>{
						let str1 = item.substr(0,1);
						str1 = str1.toUpperCase()
						let search = list.findIndex((item2,index2)=>{ return item2.letter == str1});
						if(search == -1){
							let obj = {}
							obj.letter = str1;
							obj.data = [item];
							list.push(obj)
						}else{
							list[search].data.push(item)
						}
					})
					
					resolve(list)
				})
			}
		}
	}
</script>

<style>
	
</style>
