<template>
  <div  class='black-box'>
    <el-cascader :props="props"></el-cascader>
  </div>
</template>

<script>
let id = 0;
export default {
  pageName: '',
  data () {
    return {
      props: {
          lazy: true,
          lazyLoad (node, resolve) {
            console.log(node)
            const { level } = node;
            setTimeout(() => {
              const nodes = Array.from({ length: level + 1 })
                .map(item => ({
                  value: ++id,
                  label: `选项${id}`,
                  leaf: level >= 2
                }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            }, 1000);
          }
        }
    }
  },
  mounted () {

  }
}
</script>

<style lang='scss' scoped>

</style>
