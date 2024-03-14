<template lang="pug">
#content
  //- TheBanner(title='友链', subtitle='')
  ul.friends
    li.friend(v-for='(friend, index) in friends', :key='index', @click='onLinkClick(friend)', :style='{ "--cover": `url(${friend.cover})` }')
      SImage.friend-avatar(:src='friend.avatar')
      span.friend-name {{ friend.name }}
</template>

<script>
import { mapState } from 'pinia'

export default {
  computed: {
    friends() {
      return this.$store.friends
    }
  },
  methods: {
    onLinkClick(friend) {
      window.open(friend.link, '_blank')
    },
  },
  setup() {
    
    const app = useNuxtApp()
    app.$store.getFriends()
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
