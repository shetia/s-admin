<template>
  <div  class='list'>
    <div class="header">
      <el-input v-model="name" placeholder="请输入名字搜索" style="width: 200px; margin-right: 12px;"></el-input>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button type="success" @click="add">新增</el-button>
    </div> 
    <div class="main">
      <Scard :tableData="tableData" :form="form">
       <template v-slot="{ row }">
          <el-button type="danger" @click="del(row)">删除</el-button>
          <el-button type="primary" @click="detail(row)">编辑</el-button>
       </template>
      </Scard>
    </div> 
  </div>
</template>

<script>
import Scard from '../components/s-card.vue'
export default {
  pageName: '',
  components: {
    Scard
  },
  data () {
    return {
      form: [
        {label: '姓名', key: 'name'},
        {label: '年龄', key: 'age'},
        {label: 'ID', key: 'id'},
      ],
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
    box-shadow: 0px 0px 5px #ccc;
    height: 100px;
    margin-bottom: 24px;
    display:flex;
    align-items:center;
    justify-content: flex-start;
    padding: 12px;
  }

}
</style>
