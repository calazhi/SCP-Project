<template>
  <div class="hello">
    {{now}} HelloWorld ! {{msg}} cookie:{{cookie}}
    <br/>
    <img :src="logopngPath" />
  </div>
</template>
  
<script>
import logopngPath from '@/views/demo/assets/images/logo.png'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App index , ',
      now: new Date().toLocaleString(),
      logopngPath: logopngPath,
      cookie: ''
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    // º”‘ÿ ˝æ›
    loadData () {
      this.cookie = document.cookie
      console.log('document.cookie:' + document.cookie)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--  lang="less" -->
<style lang="less" scoped>
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
