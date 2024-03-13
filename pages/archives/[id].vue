<template lang="pug">
#content
  .article 
    |
    .aside.card(v-if='!isMobile && titles && titles.length')
      STitleNav(:nav='titles', :activeIndex='titlesActiveIndex', @itemClick='onNavItemClick')
    .markdown.card
      ClientOnly
        SMarkdown(:title='current.title', :content='current.markdown', :offset='navHeight', @activeChange='onMarkdownScroll', @imageClick='onImageClick', @loaded='onMarkdownLoaded')
  ClientOnly
    SComment(:title='this.$route.path')
</template>

<script>
// import { mapState } from 'pinia'

export default {
  data: () => ({
    titlesActiveIndex: null,
    titles: null,
  }),
  computed: {
    // ...mapState(['archive', 'isMobile']),
    archive() {
      return this.$store.archive
    },
    isMobile() {
      return this.$store.isMobile
    },
    current() {
      return this.archive.currentItem
    },
    navHeight() {
      if (process.client) {
        const nav = document.querySelector('#nav')
        if (nav) return nav.clientHeight
      }
      return 0
    },
  },
  methods: {
    onMarkdownLoaded({ html, titles }) {
      this.titles = titles
    },
    onMarkdownScroll({ index, item }) {
      this.titlesActiveIndex = index
    },
    onImageClick(e) {},
    onNavItemClick({ target, item }) {
      window.scrollTo({ top: target.offsetTop - this.navHeight, behavior: 'smooth' })
    },
  },
  mounted() {},
  // async fetch({ store, params }) {
  //   await store.dispatch('archive', { ...params })
  // },
  setup() {
    const app = useNuxtApp()
    const route = useRoute()
    app.$store.getArchive({ ...route.params })
  },
}
</script>

<style lang="scss" scoped>
@import './[id].scss';
</style>
