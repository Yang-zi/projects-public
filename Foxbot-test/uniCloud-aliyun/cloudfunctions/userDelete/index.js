'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	try{
		const collection = db.collection('userlist')
		const userList = await collection.where({jobNumber:event.jobNumber}).get();
		
		if(userList.data && userList.data.length == 0){
			// 没有此用户
			return {status:500,message:'用户不存在'}
		}else{
			await db.collection('userlist').where({_id:userList.data[0]._id}).remove()
			
			return {status:200,message:'删除用户成功'}
		}
	}catch(e){
		//TODO handle the exception
		console.log('----捕获异常----：' + e)
		return {status:500,message:'error'}
	}
	
};
