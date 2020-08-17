<template>
  <div  class='black-box'>
    <div id="container"></div>
  </div>
</template>

<script>
import { Chart } from '@antv/g2';


export default {
  pageName: '',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.init()
    this.getData()
  },
  methods: {
    init () {
      const chart = new Chart({
        container: 'container',
        autoFit: true,
        height: 500,
        // padding: [50, 20, 50, 20],
      });
      chart.scale('value', {
        alias: '占比',
      });
      chart.axis('type', {
        tickLine: {
          alignTick: true,
        },
      });
      chart.axis('value', true);
      chart.tooltip({
        showMarkers: true,
      });
      chart.interval().position('type*value');
      chart.interaction('element-active');
      this.chart = chart
    },
    getData () {
      let data = this.data
      this.chart.data(data);
      // 添加文本标注
      data.forEach((item) => {
        this.chart
          .annotation()
          .text({
            position: [item.type, item.value],
            content: item.value,
            style: {
              textAlign: 'center',
            },
            offsetY: -30,
          })
          .text({
            position: [item.type, item.value],
            content: '占比' + (item.value * 100).toFixed(0) + '%',
            style: {
              textAlign: 'center',
            },
            offsetY: -12,
          });
      });
      this.chart.render()
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
