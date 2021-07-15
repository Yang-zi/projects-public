'use strict';
const db = uniCloud.database()
const calc2 = require('kaoqincalc')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	
	try{
		const collection = await db.collection('kaoqin').doc(event.id);
		const info = await collection.get();
		let data = Object.assign({},event);
		delete data.id;
		
		let _updata = await calc2(data,info.data[0])
		
		await collection.update(_updata)
		
		//返回数据给客户端
		return _updata
	}catch(e){
		//TODO handle the exception
		console.log('----捕获异常----：' + e)
		return {status:500,message:'error'}
	}
	
};
