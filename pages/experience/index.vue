<template lang="pug">
#content.experience
  .classify(v-for="(classify, key) in experience" :key="key" :class="`classify--${key}`")
    .classify__name(:data-name="classify.title") {{ classify.title }}
    .classify__list
      .classify__list-item(v-for="(item, index) in classify.items" :key="index")
        .item__cover-wrapper(v-if="item.cover")
          SImage.item__cover(:src="item.cover" :alt="item.name")
        .item__info
          .item__info-name {{ item.name }}
          .item__info-desc {{ item.desc }}
          .item__info-detail
            span {{ item.desc }}
        .item__type
          SIcon(v-if="item.type == 'github'" name="mdi-github")
          SIcon(v-else-if="item.type == 'website'" name="mdi-web")
</template>

<script>
import { mapState } from 'pinia'
import { useMainStore } from '@/stores/index'
export default {
  data: () => ({}),
  computed: {
    experience() {
      return this.$store.experience
    },
    // ...mapState(['experience']),
  },
  methods: {
    onItemClick(item) {
      item && item.link && window.open(item.link, '_blank')
    },
  },
  setup() {
    const app = useNuxtApp()
    const route = useRoute()
    app.$store.getExperience()
  }
  // async fetch({ store, params }) {
  //   await store.dispatch('getExperience')
  // },
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
