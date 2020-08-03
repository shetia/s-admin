export default {
  add:'/addUser',           //新增一条数据  必传name age
  del:'/deleteUser',        //根据id删除一条数据 必传 id    
  update:'/updateUser',      //根据id修改对应数据  必传id name age
  queryAll:'/queryAll',     // 查 
  detail:'/query',          // 获取详情
  queryName:'/queryName',   // 根据name查询列表 必传 name
  upload:'/upload',         //   上传文件
}