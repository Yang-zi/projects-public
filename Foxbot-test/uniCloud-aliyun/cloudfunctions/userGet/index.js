'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	let type = event.type==0 ? true:false;
	
	const collection = await db.collection('userlist').where({authority:type}).get()
	
	if(type){
		let list = [];
		collection.data.forEach((item,index)=>{
			list.push(item.jobNumber)
		})
		
		//返回数据给客户端
		return list
	}else{
		return collection.data
	}
	
};
