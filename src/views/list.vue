<template>
  <div  class='list'>
    <div class="header">
      <el-input v-model="name" placeholder="请输入内容" style="width: 200px; margin-right: 12px;"></el-input>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button type="success" @click="add">新增</el-button>
    </div> 
    <div class="main">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          fixed
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="age"
          label="年龄">
        </el-table-column>
        <el-table-column
          label="照片">
          <template slot-scope="scope">
            <img :src="getImgUrl(scope.row.fileUrl)" alt="" width="80px">
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="detail(scope.row)">编辑</el-button>
            <el-button @click="del(scope.row)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div> 
  </div>
</template>

<script>
export default {
  pageName: '',
  data () {
    return {
      tableData: [],
      name: ''
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.$axios.get(this.$api.queryAll).then(res => {
        if(res.data.code === '200') {
          let resData = res.data.data
          this.tableData = resData
        }
      })
    },
    getImgUrl(url){
      let base = this.$axios.defaults.baseURL
      return `${base}${url}`
    },
    del(item){
      this.$confirm('此操作删除该行, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get(this.$api.del, {params: {
          id: item.id
        }}).then(res => {
          if(res.data.code === '200') {
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '删除失败'
        });          
      });

    },
    search () {
      this.$axios.get(this.$api.queryName, {params: {
        name: this.name
      }}).then(res => {
        if(res.data.code === '200') {
          let resData = res.data.data
          this.tableData = resData
        }
      })
    },
    add () {
      this.$router.push({path:'/detail/add'})
    },
    detail (item) {
      this.$router.push({path:'/detail/edit', query:{id: item.id}})
    }
  }
}
</script>

<style lang='scss' scoped>
.list{
  .header{
    box-sizing: border-box;
    border: 1px solid #ccc;
    height: 100px;
    margin-bottom: 24px;
    display:flex;
    align-items:center;
    justify-content: flex-start;
    padding: 12px;
  }

}
</style>
