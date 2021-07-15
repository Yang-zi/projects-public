'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	try{
		if(event.id == '' || event.id == null || !event.id) return {status:500,message:'机型id不存在'};
		await db.collection('baobiao').doc(event.id).remove();
		
		//返回数据给客户端
		return {status:200,message:'删除成功'};
	}catch(e){
		//TODO handle the exception
		console.log('----捕获异常----：' + e)
		return {status:500,message:'error'}
	}
};
