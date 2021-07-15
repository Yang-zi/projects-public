'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const baobiao_ = await db.collection('baobiao').where({}).get();
	const baobiao_record = await db.collection('bbrecord').where({}).get();
	//返回数据给客户端
	return {baobiao: baobiao_.data, bbrecord: baobiao_record.data};
};
