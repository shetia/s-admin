<template>
  <div  class='black-box'>
    <div id="container">
    </div>
  </div>
</template>

<script>
import { Chart, Util } from '@antv/g2';
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
      });
      chart.coordinate('theta', {
        radius: 0.75
      });
      chart.tooltip({
        showMarkers: false
      });
      const interval = chart
        .interval()
        .adjust('stack')
        .position('value')
        .color('type', ['#063d8a', '#1770d6', '#47abfc', '#38c060'])
        .style({ opacity: 0.4 })
        .state({
          active: {
            style: (element) => {
              const shape = element.shape;
              return {
                matrix: Util.zoom(shape, 1.1),
              }
            }
          }
        })
        .label('type', (val) => {
          const opacity = val === '四线及以下' ? 1 : 0.5;
          return {
            offset: -30,
            style: {
              opacity,
              fill: 'white',
              fontSize: 12,
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)',
            },
            content: (obj) => {
              return obj.type + '\n' + obj.value + '%';
            },
          };
        });

      chart.interaction('element-single-selected');
      this.chart = chart
      
    },
    getData () {
      let data = this.data
      this.chart.data(data);
      this.chart.render()
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
