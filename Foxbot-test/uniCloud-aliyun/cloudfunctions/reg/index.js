'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	const collection = db.collection('userlist');
	try{
		const user_ = await collection.where({jobNumber:event.account}).get();
		
		if(user_.data.length != 0){
			return {status:500,message:'该账号已被注册'};
		}else{
			/* 注册一个账号 */
			await collection.add({
				username:event.name,
				jobNumber:event.account,		//工号
				password:event.pw2,
				authority:false,			//是否拥有访问权限(同样用于审核)
				administrators:false,	//是否是超级管理员
				createTime:event.createTime		//创建时间
			})
			
			return { status:200, message:'注册提交中，请等待审核员审核~' };
		}
	}catch(e){
		//TODO handle the exception
		console.log(e)
	}
	//返回数据给客户端
	
};
