<template lang="pug">
#timeline
  TheBanner(:title='header.title', :subtitle='header.subtitle', :isFull='header.isFull', :isHide='header.isHide', :isHideSubtitle='header.isHideSubtitle')
  .timeline
    .timeline-group(v-for='(group, date) in timeline' :key="date")
      span.timeline-date {{ date }}
      div.timeline-list
        div(v-for='item in group' :key='item.id')
          span.timeline-item
            span.timeline-item-day {{ $util(item.createAt | formatDate ('dd'))}}
            a.timeline-item-title(:href="`/archives/${item.id}`" @click.prevent='$router.push(`/archives/${item.id}`)') {{ item.title }}
</template>

<script>
import { mapState } from 'pinia'
import { useMainStore } from '@/stores/index'

export default {
  data: () => ({
    header: {
      title: '时间线',
      subtitle: '',
    },
    archives: [],
    error: null,
  }),
  computed: {
    // ...mapState(useMainStore, ['timeline']),
    timeline() {
      return this.$store.timeline
    }
  },
  setup() {
    const app = useNuxtApp()
    app.$store.getTimeline()
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
