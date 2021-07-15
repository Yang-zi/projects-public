'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	
	try{
		const collection = db.collection('userlist')
		const userList = await collection.where({jobNumber:event.account}).get();
		
		if(userList.data && userList.data.length == 0){
			// 没有此用户
			return {status:500,message:'用户不存在'}
		}else{
			if(!userList.data[0].authority){
				return {status:500,message:'该用户没有访问权限或正在审核中'}
			}else if(userList.data[0].password != event.password){
				return {status:500,message:'密码错误'}
			}else{
				return {status:200,message:'登录成功',data:userList.data[0]};
			}
		}
	}catch(e){
		//TODO handle the exception
		console.log('----捕获异常----：' + e)
		return {status:500,message:'error'}
	}
	
};
