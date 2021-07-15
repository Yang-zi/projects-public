'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const collection = db.collection('userlist');
	try{
		const user_ = await collection.where({jobNumber:event.account}).get();
		if(user_.data.length == 0){
			return {status:500,message:'账号不存在'}
		}else{
			if(event.password_old != user_.data[0].password){
				return {status:500,message:'原密码错误'}
			}else{
				await collection.doc(user_.data[0]._id).update({
					password:event.password_new2
				})
				return {status:200,message:'修改成功'}
			}
		}
	}catch(e){
		//TODO handle the exception
		console.log(e)
	}
	
};
