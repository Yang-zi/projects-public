<template>
	<view class="content"> 
		<view class="time" style="width: 100%;">
			<text style="font-size: 33rpx;font-weight: bold;">{{currentDate}}</text>
		</view>
	
		<!-- <unicloud-db @load="handleLoad" ref="udb" :manual="true" v-slot:default="{data, loading, error, options}" collection="kaoqin"  :getone="true"> -->
		  <view class="table" v-for="(item,index) in list" :key="index" :class="index==list.length-1 ? 'totalBlue':''">
		  	<text>{{item.name}}</text>
		  	<view class="tag-view" @click="tagClick(item.name,item.field,item.people)">
		  		<uni-tag :text="item.people" />
		  	</view>
		  	<text>人</text>
		  </view>
		<!-- </unicloud-db> -->
		
		
		
		<!-- 修改数据 -->
		<view>
			<uni-popup ref="inputDialog" type="dialog"> 
				<uni-popup-dialog ref="inputClose" mode="input" :beforeClose="true" :title="dialog.title" :value="dialog.input" @close="dialogClose" @confirm="dialogInputConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentDate: new Date().toISOString().slice(0, 10),
			list:[{
				name:'课内人力',
				field:'p_kenei',
				people:'0'
			},{
				name:'支援入',
				field:'p_enter',
				people:'0'
			},{
				name:'支援出/出差',
				field:'p_out',
				people:'0'
			},{
				name:'请假',
				field:'p_qingjia',
				people:'0'
			},{
				name:'总人力',
				field:'p_total',
				people:'0'
			}],
			dialog:{
				title:'',
				input:'',
				field:''
			},
			cid:'60cafc752495790001dce2b4' 	//表id
		};
	},
	onReady(){
		// this.$refs.udb.loadData() 
		this.getData();
	},
	methods: {
		getData(){
			uni.showLoading({
				title: '努力加载中...'
			})
			
			uniCloud.callFunction({
				name: 'getkaoqin'
			}).then((res) => {
				uni.hideLoading()
				let _data = res.result;
				for(let [key,val] of Object.entries(_data)){
					if(key == '_id') continue;
					let idx = this.list.findIndex((item,index)=>{return item.field == key});
					this.list[idx].people = val.toString(); 
				}
			}).catch((err) => {
				uni.hideLoading()
				uni.showModal({
					content: `获取数据失败：${err.message}`,
					showCancel: false
				})
			})
		},
		tagClick(title,field,value){ 
			this.dialog.title = title;
			this.dialog.field = field;
			this.dialog.input = value;
			this.$refs.inputDialog.open()
		},
		/* 输入框关闭 */
		dialogClose(){
			this.$refs.inputDialog.close()
		},
		/* 输入框确定 */
		async dialogInputConfirm(value){
			let that = this;
			let newdata = { 
				id:that.cid, 
			};
			let _value = Number(value);
			if(!this.isNumber(_value) || this.isXiaoShu(_value)){
				uni.showToast({
				    title: '请输入正确的数字',
					icon:'none',
				    duration: 2000
				});
				return
			}	
	
			newdata[that.dialog.field] = _value;
			
			uni.showLoading({
				title: '修改中...'
			})
			
			return await uniCloud.callFunction({
				name: 'kaoqin',
				data: newdata
			}).then((res) => {
				this.editData(res.result)
				uni.hideLoading()
				this.$refs.inputDialog.close()
				return res.result
			}).catch((err) => {
				uni.hideLoading()
				uni.showModal({
					content: `修改失败${err.message}`,
					showCancel: false
				})
			})
		},
		editData(result){
			if(typeof result == 'object'){
				for(let [key,val] of Object.entries(result)){
					let list_idx = this.list.findIndex((item,index)=>{ return item.field == key});
					this.list[list_idx].people = val.toString();
				}
			}else{
				uni.showModal({
					content: '数据类型不是object',
					showCancel: false
				})
			}
		},
		
		/* 判断是否包含数字 */
		isNumber(val) {
			var regPos = /^\d+(\.\d+)?$/; //非负浮点数
			var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
			if(regPos.test(val) || regNeg.test(val)) {
				return true;
			} else {
				return false;
			}
		},
		/* 判断是否是小数 */
		isXiaoShu(val){
			let str = val+'';
			if(str.indexOf(".")==-1){
				return false;
			}else{
				return true
			}
		}
	}
};
</script>

<style>
	.content{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 60rpx;
		display: flex;
		flex-direction: column;
	}
	.table{
		display: flex;
		align-items: center;
		margin-top: 20px;
		margin-bottom: 10px;
	}
	.table>text{
		font-size: 15px;
		color: #333333;
	}
	.table>text:first-child{
		width: 7em;
		text-align: right;
	}
	.table .tag-view{
		margin: 0 45rpx;
	}
	.totalBlue>text{
		font-weight: bold;
	}
	.totalBlue .uni-tag--default{
		font-weight: bold;
	}
</style>
