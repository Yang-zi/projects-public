<template>
	<view class="container">
		<!-- 删除 添加机型 -->
		<view class="con1">
			<view style="display: flex;align-items: center;" @click="openCalendar">
				<text>{{currentDate}}</text>
				<image src="../../../static/img/jiantou.png" style="width: 40rpx;height: 40rpx;"></image>
			</view>
			<view style="display: flex;">
				<button type="primary" plain="true" style="margin: 0;font-size: 20rpx;" @click="add">添加机型</button>
				<button type="primary" plain="true" style="margin: 0;font-size: 20rpx;margin-left: 10px;" @click="showTotal">合计</button>
			</view>
		</view> 
		<view class="con2">
			<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
				<view class="cu-item" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in dataList" :key="index" @tap="tabSelect" :data-id="index">
					{{item.model}}
				</view>
			</scroll-view>
			<view class="baobiao_wrap">
				<view class="baobiao_item">
					<text>型号：</text>
					<text @click="inputClick('model')">{{showModal.model}}</text>
				</view>
				<view class="baobiao_item">
					<text>工单号：</text>
					<text @click="inputClick('order')">{{showModal.order}}</text>
				</view>
				<view class="baobiao_item">
					<text>今日新装：</text>
					<text @click="inputClick('robotNewNum')">{{showModal.robotNewNum}}</text>
				</view>
				<view class="baobiao_item">
					<text>在测：</text>
					<text @click="inputClick('robotTestNum')">{{showModal.robotTestNum}}</text>
				</view>
				<view class="baobiao_item">
					<text>送检：</text>
					<text @click="inputClick('robotInspectNum')">{{showModal.robotInspectNum}}</text>
				</view>
				<view class="baobiao_item">
					<text>累计完成：</text>
					<text @click="inputClick('robotTotalNum')">{{showModal.robotTotalNum}}</text>
				</view>
				<view class="baobiao_item">
					<text>异常处理：</text>
					<text @click="inputClick('robotAbnormal')">{{showModal.robotAbnormal}}</text>
				</view>
			</view>
			<view class="baobiao_caozuo">
				<view class="margin-tb-sm text-center">
					<button class="cu-btn line-red shadow" style="color: #e54d42;" @click="deleteFuc">删除</button>
				</view>
			</view>
		</view>
		
		
		<!-- 添加机型 -->
		<view>
			<uni-popup ref="popupAdd" type="center" :mask-click="false" @change="popupChange">
				<view class="jixing-add">
					<uni-forms :value="popupData" ref="form" validate-trigger="bind" err-show-type="undertext">
						<uni-group title="输入机型信息" top="0">
							<uni-forms-item name="xinghao" label="机型" style="width: 380rpx">
								<uni-easyinput type="text" v-model="popupData.xinghao" placeholder="请输入机型型号"></uni-easyinput>
							</uni-forms-item>
							<uni-forms-item name="orderNumber" label="工单号" style="margin-top: 30rpx;width: 380rpx">
								<uni-easyinput type="text" :inputBorder="true" v-model="popupData.orderNumber" placeholder="请输入工单号"></uni-easyinput>
							</uni-forms-item>
						</uni-group>
					</uni-forms>
					<view class="jixing-submit">
						<button type="default" @click="popupClose">取消</button>
						<button type="primary" plain="true" @click="popupSubmit">确定</button>
					</view>
				</view>
			</uni-popup>
		</view>
		
		<!-- 修改数据 -->
		<view>
			<uni-popup ref="inputDialog" type="dialog"> 
				<uni-popup-dialog ref="inputClose" mode="input" :beforeClose="true" :title="titleChange" :value="inputDialog" @close="dialogClose" @confirm="dialogInputConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
	
		<!-- 删除提示框 -->
		<view>
			<uni-popup ref="deleteDialog" type="dialog">
				<uni-popup-dialog type="error" title="提示" :content="deleteTitle" @confirm="deleteConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
		
		<!-- 日历 -->
		<view>
			<uni-calendar ref="calendar" class="uni-calendar--hook" :insert="false" :clear-date="true" :date="calendar.date" :startDate="calendar.startDate" :endDate="calendar.endDate" @confirm="calendarConfirm" />
		</view>
		
		<!-- 测边模态框 -->
		<view class="cu-modal drawer-modal justify-end" :class="modalName=='total'?'show':''" @tap="hideModal">
			<view class="cu-dialog basis-lg" @tap.stop="" style="top:0;height: 100vh;">
				<view class="cu-list menu text-left">
					<view class="cu-item arrow">
						<view class="content" style="box-sizing: border-box;padding: 50px 20px;margin-top: 30px;">
							<view class="bb-total">
								<div><text style="margin: 0;">合计</text></div>
								<div><text>今日新装</text><text>{{totalCalc('robotNewNum')}}</text></div>
								<div><text>在测</text><text>{{totalCalc('robotTestNum')}}</text></div>
								<div><text>送检</text><text>{{totalCalc('robotInspectNum')}}</text></div>
								<div><text>累计完成</text><text>{{totalCalc('robotTotalNum')}}</text></div>
								<div><text>异常处理</text><text>{{totalCalc('robotAbnormal')}}</text></div>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view> 

</template> 	

<script>
export default {
	data() {
		return { 
			modalName: null,
			TabCur:0,
			scrollLeft: 0,
			currentDate: new Date().toISOString().slice(0, 10),
			dataList_beifen:[],	//数据列表备份,
			dataList:[],	//数据列表,
			showModal:{
				model: "",
				order: "",
				robotNewNum: 0,
				robotTestNum: 0,
				robotInspectNum: 0,
				robotTotalNum: 0,
				robotAbnormal: 0,
			},
			recordList:[],	//过去7天内数据记录
			popupData:{
				xinghao:'',
				orderNumber:'',
			},
			inputFiled:{
				index:null,
				field:'',
				model:''
			},
			inputDialog:'',
			rightBxWidth:0,
			deleteInfo:{
				is:false,
				model:'',
				id:''
			},
			calendar:{
				date:new Date().toISOString().slice(0, 10),
				startDate:'',
				endDate:''
			}
		};
	},
	onReady(){
		this.getData()
	},
	onLoad(e) {
		// #ifdef APP-PLUS
		plus.screen.lockOrientation("default");
		// #endif
	}, 
	// 页面关闭时清除横屏正方向
	onUnload() { 
		// #ifdef APP-PLUS
		  plus.screen.lockOrientation("portrait-primary");
		// #endif
	},
	computed:{
		titleChange(){
			return this.inputFiled.model + '-' + this.filedCdn(this.inputFiled.field);
		},
		totalCalc(){
			let that = this;
			return function(type){
				let _num = 0;
				that.dataList.forEach((item,index)=>{
					_num = _num + Number(item[type]);
				})
				return _num
			}
		},
		deleteTitle(){
			return `确认删除当前机型(${this.deleteInfo.model})？`;
		}
	},
	methods: {
		getData(){
			uniCloud.callFunction({
				name: 'getbaobiao'
			}).then((res) => {
				let bb = res.result.bbrecord;
				this.dataList_beifen = res.result.baobiao;
				this.dataList = res.result.baobiao;
				this.recordList = bb;
				
				/* 日历组件数据初始化 */
				this.calendar.startDate = bb[0].date;
				this.calendar.endDate = bb[bb.length-1].date;
				
				this.tabSelectChange(0)
			}).catch((err) => {
				uni.showModal({
					content: `获取数据失败：${err.message}`,
					showCancel: false
				})
			})
		},
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
			
			this.tabSelectChange(e.currentTarget.dataset.id)
		},
		tabSelectChange(index){
			let dd = this.dataList[index];
			for(let [key,val] of Object.entries(this.showModal)){
				this.showModal[key] = dd[key];
			}
		},
		/* 添加机型 */
		add(){
			this.$refs.popupAdd.open()
		},
		popupClose(){
			this.$refs.popupAdd.close()
		},
		/* 弹出层状态改变监听 */
		popupChange(e){
			this.popupData.xinghao = '';
			this.popupData.orderNumber = '';
		},
		/* 添加机型确定事件 */
		async popupSubmit(){
			const _data = this.popupData;
			if(_data.xinghao == '' || !_data.xinghao) return
			uni.showLoading({
				title: '请等待...'
			})
			return await uniCloud.callFunction({
				name: 'jixingAdd', 
				data: {
					model:_data.xinghao,
					order:_data.orderNumber,
					createTime: Date.now()
				}
			}).then((res) => {
				let that = this;
				uni.hideLoading()
				uni.showToast({
					title: "添加成功",
					success(){
						if(!that.isToday()){
							that.currentDate = new Date().toISOString().slice(0, 10);
							that.calendar.date = new Date().toISOString().slice(0, 10);
						}
						that.getData()  	//再加载新的数据
						that.popupClose()
					}
				}) 
				return  res.result.id
			}).catch((err) => {
				uni.hideLoading()
				uni.showModal({
					content: `添加失败，错误信息为：${err.message}`,
					showCancel: false
				})
			})
			
		},
		/* 小input点击事件 */
		inputClick(field){
			let that = this;
			if(!this.isToday()) return
			
			that.inputFiled.index=that.TabCur;
			that.inputFiled.field=field;
			that.inputFiled.model=that.dataList[that.TabCur].model;
			that.inputDialog = that.dataList[that.TabCur][field];
			
			that.$refs.inputDialog.open()
		},
		/* 输入框关闭 */
		dialogClose(){
			this.$refs.inputDialog.close()
		},
		/* 输入框确定 */
		async dialogInputConfirm(value){
			let that = this;
			if((!this.isNumber(value) || this.isXiaoShu(value)) && that.inputFiled.field!='model' && that.inputFiled.field!='order'){
				uni.showToast({
				    title: '请输入正确的数字',
					icon:'none',
				    duration: 2000
				});
				return
			}	
			
			let newdata = { id:that.dataList[that.inputFiled.index]._id, createTime: Date.now()};
			newdata[that.inputFiled.field] =value;
			
			uni.showLoading({
				title: '修改中...'
			})
			
			return await uniCloud.callFunction({
				name: 'update',
				data: newdata
			}).then((res) => {
				uni.hideLoading()
				let _res = res.result;
				if(_res.status == 200){
					this.editData(_res.data)
				}else if(_res.status == 500){
					uni.showToast({
						title:_res.message,
						icon:'none'
					})
				}
				
				this.$refs.inputDialog.close()
			}).catch((err) => {
				uni.hideLoading()
				uni.showModal({
					content: `修改失败${err.message}`,
					showCancel: false
				})
			})
		},
		/* 字段解析 */
		filedCdn(str){
			if(str == 'model') return '型号';
			else if(str == 'order') return  '工单号';
			else if(str == 'robotNewNum') return '今日新装';
			else if(str == 'robotTestNum') return '在测';
			else if(str == 'robotInspectNum') return '送检';
			else if(str == 'robotTotalNum') return '累计完成';
			else if(str == 'robotAbnormal') return '异常处理中';
			else return ''
		},
		/* 前段修改数据内容 */
		editData(data){
			let dt_idx = this.dataList.findIndex((item,index)=>{ return item._id == data.id});
			if(data.createTime) delete data.createTime;
			
			for(let [key,val] of Object.entries(data)){
				this.dataList[dt_idx][key] = val;
			}
			
			this.tabSelectChange(this.TabCur)
		},
		/* 删除机型点击事件*/
		deleteFuc(){
			let data = this.dataList[this.TabCur];
			this.deleteInfo.id = data._id;
			this.deleteInfo.model = data.model;
			this.$refs.deleteDialog.open()
		},
		/* 删除机型 确认事件*/
		async deleteConfirm(){
			let that = this;
			uni.showLoading({
				title: '正在删除...'
			})
			
			return await uniCloud.callFunction({
				name: 'delete',
				data: {id:that.deleteInfo.id}
			}).then((res) => {
				let icon = '';
				uni.hideLoading()
				if(res.result.status == 200) icon = 'success';
				else icon = 'none';
				
				uni.showToast({
				    title: res.result.message,
					icon:icon,
				    duration: 2000
				});
				this.$refs.deleteDialog.close()
				that.getData() 
				return res.result
			}).catch((err) => {
				uni.hideLoading()
				uni.showModal({
					content: `删除失败${err.message}`,
					showCancel: false
				})
			})
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
		},
		/* 日历相关 */
		openCalendar(){
			this.$refs.calendar.open()
		},
		calendarConfirm(data){
			uni.showLoading({
				title: '数据正在赶来...'
			})
			let date = data.fulldate;
			this.calendar.date = date;
			
			let current_record = this.recordList.find((item,index)=>{
				return new Date(item.date).getTime() == new Date(date).getTime()
			})
			if(current_record && current_record!=undefined){
				this.dataList = current_record.records; 	
			}else if(new Date(date).toDateString() === new Date().toDateString()){
				this.dataList = this.dataList_beifen;
			}else{
				uni.showToast({
					title:'没有记录',
					icon:'none',
					duration:3000
				})
				return
			}
			this.$nextTick(function(){
				this.tabSelectChange(0)
				uni.hideLoading()
				this.currentDate = date;
				uni.showToast({
				    title: date,
					icon:'none',
				    duration: 2000
				});
			})
		},
		isToday(){
			let currentDate = new Date().toISOString().slice(0, 10);
			let xianshiDate = this.currentDate;
			return new Date(currentDate).getTime() == new Date(xianshiDate).getTime()
		},
		showTotal(){
			this.modalName = 'total'
		},
		hideModal(e) {
			this.modalName = null
		},
	} 
};
</script>

<style>
	@import '../../../static/css/baobiao.css';
</style>
