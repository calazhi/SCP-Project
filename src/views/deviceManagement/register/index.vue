<template>
  <div class="ui-common">
    <main-device></main-device>
  </div>
</template>

<script>
  import mainDevice from './components/mainDevice.vue'
  export default {
    components: {
      mainDevice
    }
  }
</script>

<style>
@import "assets/css/devicemgmt.less";
</style>
