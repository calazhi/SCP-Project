<template>
<div class="ui-common">
  <firmware-update></firmware-update>
</div>
</template>

<script>
  import firmwareUpdate from './components/firmwareUpdate'

  export default {
    components: {
      firmwareUpdate
    }
  }
</script>

<style>
  @import "../register/assets/css/devicemgmt.less";
</style>
