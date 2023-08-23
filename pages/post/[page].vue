<template lang="pug">
#content
  main#main
    .aside
      TheInfoCard(:icon='avatar')
      .aside-static
        .aside-decorate.card
          .decorate-burst-12 
            .burst-12 
            //- img.decorate-cover(:src="$cfg.nav.avatar")
          .decorate-text 
        //- Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil officiis repellat nisi iusto cum eveniet, soluta magnam natus repudiandae beatae deleniti cumque inventore id mollitia laborum ratione voluptate eum tempora?
      .aside-sticky
        SLabelClouds.card(:labels='labels')
        TheCategory(:categorys='categorys')
    .post
      .error(v-if='error') {{ error }}
      .post-item-wrap(v-for='(item, index) in archive.items', :key='index')
        SPostItem(
          :title='item.title',
          :cover='item.cover.url',
          :date='item.createAt',
          :labels='item.labels',
          :description='item.description',
          :category='item.category',
          :to='`/archives/${item.id || ""}`',
          data-aos='fade-up' 
        )

      SPagination.pagination(:current='archive.page' :total='archive.totalCount' :size="$cfg.blog.paginationSize" :length="length"  @change='onChange' :loading='isLoading')
</template>

<script>
import { mapState } from 'pinia'
import { useMainStore } from '@/store/index'

export default {
  data: () => ({
    error: null,
    length: 5,
    isLoading: false,
    avatar: 'https://avatars.githubusercontent.com/u/28500231?v=4'
  }),
  computed: {
    // ...mapState(useMainStore(), ['scroll', 'archive', 'labels', 'categorys']),
    scroll() {
      return this.$store.scroll
    }, 
    archive() {
      return this.$store.archive
    }, 
    labels() {
      return this.$store.labels
    }, 
    categorys() {
      return this.$store.categorys
    },
    isMobile() {
      return this.$store.isMobile
    },
  },
  methods: {
    async onChange(page) {
      this.$router.push({ params: { page } })
    },
  },
  setup() {
    const app = useNuxtApp()
    const route = useRoute()
    app.$store.getArchives({
      page: route.params.page || '1',
      count: app.$cfg.blog.paginationSize,
    })
    app.$store.getLabels()
    app.$store.getCategorys()
  }
}
</script>

<style lang="scss" scoped>
@import './[page].scss';
</style>
