<template>
  <div class="page-content">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PageContent',
};
</script>

<style scoped>
.page-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
