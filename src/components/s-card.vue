<template>
  <div class="card-list">
    <div class="card-list__item" v-for="(row, index) in tableData" :key="index">
      <div class="item-top">
        <p v-for="(t, i) in form" :key="i">{{t.label}}: {{row[t.key]}}</p>
        <img class="head" :src="row.fileUrl" alt="" width="80px" height="80px" style="object-fit: cover;">
      </div>
      <div class="item-bottom">
        <slot :row="row"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  pageName: '',
  props: {
    tableData: { // 数据
      type: Array,
      default: () => []
    },
    form: {    // 表单内容
      type: Array,
      default: () => []
    }
  },
  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
  .card-list{
    display:grid;
    grid-template-columns: repeat(3, 32%); // 分为多少列
    // grid-template-rows: repeat(3, 33.33%); // 分为多少行
    grid-row-gap: 24px; // 行间隔
    grid-column-gap: 2%; // 列间隔
    .card-list__item{
      min-height: 100px;
      box-sizing: border-box;
      padding: 12px;
      border-radius: 5px;
      box-shadow: 0px 0px 10px #aaa;
      .item-top{
        position: relative;
        .head{
          position:absolute;
          top: 0px;
          right: 20px;
          box-shadow: 0px 0px 5px #ccc;
          border-radius: 5px;
        }
      }
      .item-bottom{
        display: flex;
        flex-direction: row-reverse;
        .el-button{
          margin-right: 12px;
        }
      }
    }
  }
</style>
