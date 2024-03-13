<template lang="pug">
//- APlayer(fixed crossOrigin="anonymous" :audio="musics" :lrcType="3" )
APlayer(float  crossOrigin="anonymous" :list="musics" :music="musics[0]" :lrcType="3" )
</template>

<script>
// import APlayer from 'vue3-aplayer'
import APlayer from '@moefe/vue-aplayer';
export default {
  components: {
    APlayer
  },
  data: () => ({

  }),
  props: {
    musics: Array,
  },
  mounted() {
  }
}
</script>
<style lang="scss" scoped>
::v-deep.aplayer {
  position: fixed;
  left: 0;
  bottom: 0;
  &.aplayer-narrow .aplayer-body {
    left: -66px !important;
    transition: .3s cubic-bezier(0.075, 0.82, 0.165, 1);
    &:hover {
      left: 0 !important;
    }
  }
  .aplayer-lrc {
    display: none !important;
  }
}
</style>
