'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event: ', event)
	
	try{
		let result;
		if(event.id == '' || event.id == null || !event.id) return {status:500,message:'指定型号id不存在'};
		
		/* 获取报表中的机型信息 */
		const collection = await db.collection('baobiao').doc(event.id);
		/* 定义需要number转义的字段 */
		const fields = ['robotNewNum','robotTestNum','robotInspectNum','robotTotalNum','robotAbnormal'];
		/* 将number类型的字段转化为number类型 */
		let data = Object.assign({},event);
		delete data.id;
		for(let [key,val] of Object.entries(data)){
			if(fields.includes(key)) data[key] = Number(data[key])
		}
		
		let current_date = new Date().toISOString().slice(0, 10);	//获取当前时间
		current_date = getDate(current_date,-1).fullDate;		//获取前一天
		let today_data = await db.collection('baobiao').where({_id:event.id}).get();
		let before_data = await db.collection('bbrecord').where({date:current_date}).get();	//获取前一天的数据
		
		let getinfo = await getInfo_(before_data.data);
		let updata_ = await calc(data,getinfo,today_data.data[0]);
		await collection.update(updata_)
		updata_.id = event.id;
		
		return {status:200,message:'修改成功',data:updata_}
	}catch(e){
		//TODO handle the exception
		console.log('----捕获异常----：' + e)
		return {status:500,message:'异常错误'}
	}
	
	
	
	/* 获取任意天 */
	function getDate(date, AddDayCount = 0) {
		if (!date) {
			date = new Date()
		}
		if (typeof date !== 'object') {
			date = date.replace(/-/g, '/')
		}
		const dd = new Date(date)
	
		dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
	
		const y = dd.getFullYear()
		const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
		const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
		return {
			fullDate: y + '-' + m + '-' + d,
			year: y,
			month: m,
			date: d,
			day: dd.getDay()
		}
	}
	
	/* 获取前一天的数据信息 */
	function getInfo_(data){
		return new Promise((resolve,reject)=>{
			try{
				let _info  = {
						robotNewNum:0,
						robotTestNum:0,
						robotInspectNum:0,
						robotTotalNum:0,
						robotAbnormal:0
					};
				if(data.length!=0){
					let s = data[0].records.find((item,index)=>{
						return item._id == event.id;
					})
					if(s && s!=undefined) _info = s;
				}
				resolve(_info)
			}catch(e){
				//TODO handle the exception
				reject('异常')
			}
		})
	}
	
	/* 报表计算方式 
		res => 客户端传过来要修改的信息
		data => 该机型前一天的所有信息
		todayData => 该机型今天的所有信息
	*/
	function calc(res,data,todayData){
		return new Promise((resolve,reject)=>{
			
			let newdata = {}; 
			newdata.createTime = res.createTime;
			/* 
			 robotNewNum  今日新装 ...
			 robotTestNum 在测 ...
			 robotInspectNum 送检 ...
			 robotTotalNum  累计完成 ...
			 robotAbnormal 异常处理
			 */
			 
			if(res.robotInspectNum){   /* 送检 */
				newdata.robotInspectNum = res.robotInspectNum;
				newdata.robotTestNum = data.robotTestNum - res.robotInspectNum + todayData.robotNewNum;   //当前在测 = 昨日当前在测 + 今日当前在测 - 今日送检 + 今日新装
				newdata.robotTotalNum = todayData.robotTotalNum + (res.robotInspectNum - todayData.robotInspectNum);
				newdata.robotTestNum = newdata.robotTestNum<0 ? 0:newdata.robotTestNum;
				newdata.robotTotalNum = newdata.robotTotalNum<0 ? 0:newdata.robotTotalNum;
				resolve(newdata)
			}else if(res.robotTestNum){		//在测
				newdata.robotTestNum = res.robotTestNum;
				resolve(newdata)
			}else if(res.robotTotalNum){	//累计完成
				newdata.robotTotalNum = res.robotTotalNum;
				resolve(newdata)
			}else if(res.robotNewNum){		//今日新装
				newdata.robotNewNum = res.robotNewNum;
				newdata.robotTestNum = data.robotTestNum - data.robotInspectNum + res.robotNewNum;
				newdata.robotTestNum = newdata.robotTestNum<0 ? 0:newdata.robotTestNum;
				resolve(newdata)
			}else{
				resolve(res);
			}
			reject('numcalc is error')
		})
	}
};
