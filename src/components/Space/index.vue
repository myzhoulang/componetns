<template>
  <div class="space"><slot></slot></div>
</template>

<script>
export default {
  name: 'Space',
  data() {},
};
</script>

<style scoped>
.space {
  display: inline-flex;
}
</style>
