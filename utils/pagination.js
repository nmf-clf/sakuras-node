/*
 * @Author: niumengfei
 * @Date: 2022-12-17 17:11:34
 * @LastEditors: niumengfei
 * @LastEditTime: 2023-02-10 15:30:22
 */
/*
options = {
	page: //需要显示的页码
	model: //操作的数据模型
	query: //查询条件
	projection: //投影，只返回哪些
	sort: //排序,
	populate:[]
}
*/

const Utils = require('./Utils');

let pagination = (options)=>{
	// console.log('options::', options);
	return new Promise((resolve,reject)=>{
		//需要显示的页码
		
		let page = 1;

		if(!isNaN(parseInt(options.page))){
			page = parseInt(options.page);
		}

		if(page <= 0){
			page = 1;
		}

		//每页显示条数
		let limit = options.limit || 10;
		// console.log('每页显示条数::', limit);
		/*
		分页:
		假设: 每页显示 2 条  
		limit(2)
		skip()//跳过多少条

		第 1 页 跳过 0 条
		第 2 页 跳过 2 条
		第 3 也 跳过 4 条

		综上发现规律:
		(page - 1) * limit
		*/
		for(let key in options.query){
			if(Utils.isEmpty(options.query[key])){
				delete options.query[key]
			}
		}
		console.log('查询入参>>>', options.query);
		options.model.countDocuments(
			options.query,
		)
		.then((count)=>{
			// Math.ceil(X) 返回大于等于X的最小整数，即向上取整
			let pages = Math.ceil(count / limit); // 也就是说假设一共47条，大于等于4.7的最小整数就是 5 ， 也就是一共有5页
			// if(page > pages){
			// 	page = pages;
			// }
			if(pages == 0){
				page = 1;
			}
			let skip = (page - 1)*limit;
			let query = options.model.find(
				options.query,
				options.projection
			);
			if(options.populate){
				for(let i = 0;i<options.populate.length;i++){
					query = query.populate(options.populate[i])
				}
			}
			query
			.sort(options.sort) // 排序
			.skip(skip) // 跳过个数
			.limit(limit) // 单页最小个数
			.then((docs)=>{
				resolve({
					list: docs,
					current: page * 1,
					pageSize: limit,
					total: count
				})		
			})
		})
	});
}

module.exports = pagination;