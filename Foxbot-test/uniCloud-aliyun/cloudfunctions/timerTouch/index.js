'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	try{
		//event为客户端上传的参数
		let current_date = new Date().toISOString().slice(0, 10);
		current_date = getDate(current_date,-1);
		let newobj = { date:current_date.fullDate, records:[] };
		let list = await db.collection('baobiao').where({}).get()
		newobj.records = list.data;
		await db.collection('bbrecord').add(newobj)
		
		await list.data.forEach((item,index)=>{
			let items = db.collection('baobiao').doc(item._id);
			items.update({
				robotNewNum:0,
				robotInspectNum:0
			})
		})
		
		let bbrecord_list = await db.collection('bbrecord').where({}).get();
		let first_id = bbrecord_list.data[0]._id;
		if(bbrecord_list.data.length >= 8){
			db.collection('bbrecord').where({_id:first_id}).remove()
		}
		
		//返回数据给客户端
		uniCloud.logger.warn('定时器触发成功success')
		return {status:200, message:'定时器触发成功success'}
	}catch(e){
		//TODO handle the exception
		uniCloud.logger.warn(e)
	}
	
	
	
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
};
