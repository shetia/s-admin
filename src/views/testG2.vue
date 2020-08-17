<template>
  <div  class='black-box'>
    <el-select v-model="whichCom" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <component :is="whichCom" :data="data"></component>
  </div>
</template>

<script>
import G2Pie from 'components/g2/pie.vue'
import G2Column from 'components/g2/column.vue'
import G2Line from 'components/g2/line.vue'
let data = [
  { type: '一线城市', value: 0.19 },
  { type: '二线城市', value: 0.21 },
  { type: '三线城市', value: 0.27 },
  { type: '四线及以下', value: 0.33 },
]
export default {
  components: {
    G2Pie,
    G2Column,
    G2Line,
  },
  pageName: '',
  data () {
    return {
      whichCom: 'G2Pie',
      options: [
        {value: 'G2Pie', label: '饼图'},
        {value: 'G2Column', label: '柱状图'},
        {value: 'G2Line', label: '折线图'},
      ],
      data
    }
  },
  mounted () {

  }
}
</script>

<style lang='scss' scoped>

</style>
