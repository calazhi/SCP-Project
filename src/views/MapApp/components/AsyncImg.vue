<template>
  <img v-loading="loading" :src="url">
</template>
<script>
import imgurl from '@/views/MapApp/assets/images/picture_error.png'
export default {
  // 父组件传过来所需的url
  props: ['src'],
  data () {
    return {
       // 先加载loading.gif
      url: '',
      loading: true
    }
  },
  mounted () {
    this.loadImg(this.src)
  },
  methods: {
    loadImg: function (src) {
      let newImg = new Image()
      newImg.src = src
          // 图片加载错误时的替换图片
      newImg.onerror = () => {
        this.url = imgurl
        this.loading = false
      }
       // 图片加载成功后把地址给原来的img
      newImg.onload = () => {
        this.url = newImg.src
        this.loading = false
      }
    }
  },
  watch: {
    src: function (newSrc) {
      this.loadImg(newSrc)
    }
  }
}
</script>
<style lang="less" scoped>

</style>

