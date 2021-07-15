module.exports = function(res,data) {
	console.log(JSON.stringify(res))
	console.log(JSON.stringify(data))
	// 公用模块用法请参考 https://uniapp.dcloud.io/uniCloud/cf-common
	return new Promise((resolve,reject)=>{
		let newdata = {};
		
		if(res.p_total){  //总人力
			newdata.p_total = res.p_total;
			resolve(newdata)
		}else if(res.p_kenei){	 //课内人力
			newdata.p_kenei = res.p_kenei;
			newdata.p_total = res.p_kenei + data.p_enter - data.p_out - data.p_qingjia;
			resolve(newdata)
		}else if(res.p_enter){	 //支援入
			newdata.p_enter = res.p_enter;
			newdata.p_total = data.p_kenei + res.p_enter - data.p_out - data.p_qingjia;
			resolve(newdata)
		}else if(res.p_out){	//支援出/出差
			newdata.p_out = res.p_out;
			newdata.p_total = data.p_kenei + data.p_enter - res.p_out - data.p_qingjia;
			resolve(newdata)
		}else if(res.p_qingjia){	//请假
			newdata.p_qingjia = res.p_qingjia;
			newdata.p_total = data.p_kenei + data.p_enter - data.p_out - res.p_qingjia;
			resolve(newdata)
		}else{
			resolve(res)
		}
	})
}
