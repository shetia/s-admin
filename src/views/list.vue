<template>
  <div  class='list'>
    <div class="header">
      <el-input v-model="name" placeholder="请输入内容" style="width: 200px; margin-right: 12px;"></el-input>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button type="success" @click="add">新增</el-button>
      <download-excel
            style="margin-left: 12px;"
            class="export-excel-wrapper"
            :data="tableData"
            :fields="json_fields"
            name = "表格数据.xls">
            <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
            <el-button type="primary" >导出EXCEL</el-button>
      </download-excel>
    </div>
    <div  >
      <el-table
        :data="tableData"
        border
        >
        <el-table-column
          fixed
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="age"
          label="年龄" min-width="200">
        </el-table-column>
        <el-table-column
          label="照片"  min-width="200">
          <template slot-scope="scope">
            <img :src="scope.row.fileUrl" alt="" width="80px">
          </template>
        </el-table-column>
        <el-table-column
          label="操作" min-width="200">
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

import downloadExcel from 'vue-json-excel'
export default {
  pageName: '',
  components: {
    downloadExcel
  },
  data () {
    return {
      json_fields: {
        "姓名": "name",    //常规字段
        "年龄": "age", //支持嵌套属性
        "照片": {
          field: "fileUrl",
                    //自定义回调函数
          callback: value => {
            return `<img src="http://localhost:8080/${value}" width="100" height="100">`;
          }
        },
      },
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
    },
    exportExcel () {

    }
  }
}
</script>

<style lang='scss' scoped>
.list{
  .header{
    box-sizing: border-box;
    border: 1px solid #eee;
    height: 100px;
    margin-bottom: 24px;
    display:flex;
    align-items:center;
    justify-content: flex-start;
    padding: 12px;
  }

}
</style>
