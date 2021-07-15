'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const collection = db.collection('userlist')
	try{
		if(event.jobNumber == '' || event.jobNumber == null || !event.jobNumber) return {status:500,message:'工号不存在'};
		const userList = await collection.where({jobNumber:event.jobNumber}).get();
		
		// console.log('查询结果userList：：：'+ JSON.stringify(userList));
		
		if(userList.data && userList.data.length == 0){
			// 添加一个用户
			await collection.add({
				jobNumber:event.jobNumber,		//工号
				authority:true,			//是否拥有访问权限
				administrators:false,	//是否是超级管理员
				createTime:event.createTime		//创建时间
			})
			
			uniCloud.logger.log('添加用户['+event.jobNumber+']成功')
			return {status:200,message:'添加成功'}
		}else{
			// //用户已存在，修改用户的authority  bool值
			const user = db.collection('userlist').doc(userList.data[0]._id);
			if(userList.data[0].authority){
				return {status:500,message:'该用户已有访问权限'}
			}else{
				await user.update({
					authority:true
				});
				uniCloud.logger.log('修改用户['+event.jobNumber+']权限成功')
				return {status:200,message:'修改成功'}
			}
		}
	}catch(e){
		//TODO handle the exception
		console.log('----捕获异常----：' + e)
		return {status:500,message:'error'}
	}
	
};
