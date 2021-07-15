'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const collection = db.collection('userlist');
	try{
		const user_ = await collection.where({jobNumber:event.jobNumber}).get();
		if(user_.data.length == 0){
			return {status:500,message:'账号不存在'}
		}else{
			await collection.doc(user_.data[0]._id).update({
				authority:true
			})
			return {status:200,message:'审核通过'}
		}
	}catch(e){
		//TODO handle the exception
		console.log(e)
	}
	
};
