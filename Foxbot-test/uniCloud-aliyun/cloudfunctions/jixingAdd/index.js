'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	const collection = db.collection('baobiao')
	const res = await collection.add({
		model:event.model,		//机型
		order:event.order,		//工单号
		robotNewNum:0,		//新装机
		robotTestNum:0,	//在测
		robotInspectNum:0,		//送检
		robotTotalNum:0,		//累计完成
		robotAbnormal:0,		//异常处理中
		createTime:event.createTime		//创建时间
	})
	
	//返回数据给客户端
	return event
};
