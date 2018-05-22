<template>
  <img v-loading="loading" :src="url">
</template>
<script>
import imgurl from '@/views/VisitorApp/assets/images/picture_error.png'
export default {
  props: ['src'], // 父组件传过来所需的url
  data () {
    return {
      url: '', // 先加载loading.gif
      loading: true
    }
  },
  mounted () {
    this.loadImg(this.src)
  },
  methods: {
    /**
     * @description 加载图片
     * @param String src 所有选中行数据
     */
    loadImg: function (src) {
      let newImg = new Image()
      newImg.src = src
      newImg.onerror = () => {    // 图片加载错误时的替换图片
        this.url = imgurl
        this.loading = false
      }
      newImg.onload = () => { // 图片加载成功后把地址给原来的img
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
