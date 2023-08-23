<template lang="pug">
img( :src='src', :alt="alt", :title="title")
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: null,
    },
    alt: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  data: () => ({}),
  methods: {},
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
