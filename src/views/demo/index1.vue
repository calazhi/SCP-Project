<template>
  <div class="hello">
    {{msg}},userId:{{userinfo.userId}}
    <br/>
    <div id="divmain" style="display: flex;height: 500px;width: 100%;align-items: center;justify-content: center;">
      &nbsp;
    </div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/theme/dark'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App index1 ! ',
      userinfo: this.$store.getters.getUserInfo,
      itxAxisData: ['IT1', 'IT2', 'IT3', 'IT4', 'IT5', 'IT6'],
      itseriesData: [15, 30, 16, 20, 130, 20]
    }
  },
  mounted () {
    this.loadEchartsData()
  },
  methods: {
    // 加载数据
    loadEchartsData () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('divmain'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: this.itxAxisData
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: this.itseriesData
        }]
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  padding: 0;
  margin: 0;
  height: 100%;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
