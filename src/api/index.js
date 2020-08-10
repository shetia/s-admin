 let api = {
  add:'/addUser',           //新增一条数据  必传name age
  del:'/deleteUser',        //根据id删除一条数据 必传 id    
  update:'/updateUser',      //根据id修改对应数据  必传id name age
  queryAll:'/queryAll',     // 查 
  detail:'/query',          // 获取详情
  queryName:'/queryName',   // 根据name查询列表 必传 name
  upload:'/upload',         //   上传文件
  chunk:'/chunk',         //   上传切片
  merge:'/merge',         //   合并切片
  verify:'/verify',         //  校验文件是否已经存在或已上传过
}
let base = '/api'
Object.keys(api).forEach(path => {
  api[path] = base + api[path]
})
export default api