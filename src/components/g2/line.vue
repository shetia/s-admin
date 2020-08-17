<template>
  <div  class='black-box'>
    <div id="container"></div>
  </div>
</template>

<script>
import { Chart } from '@antv/g2';
// import DataSet from '@antv/data-set'; // 需要安装data-set
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }, 
  pageName: '',
  data () {
    return {
      chart: null,
    }
  },
  mounted () {
    this.init()
    this.getData()
  },
  methods: {
    init() {
      const chart = new Chart({
        container: 'container',
        autoFit: true,
        height: 500,
        padding: [50, 50, 50, 50],
      })
      chart.scale({
        year: {
          range: [0, 1],
        },
        value: {
          min: 0,
          nice: true,
        },
      })
      chart.tooltip({
        showCrosshairs: true, // 展示 Tooltip 辅助线
        shared: true,
      })
      chart.line().position('type*value').label('value');
      chart.point().position('type*value');
      this.chart = chart
    },
    getData () {
      let data = this.data
      this.chart.data(data);
      this.chart.render();
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
