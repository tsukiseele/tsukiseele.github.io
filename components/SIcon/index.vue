<template lang="pug">
i.material-symbols-rounded(v-if="!svg", aria-hidden="true") {{ icon }}
i(v-else)
  svg.svg-icon(:src="svg" viewBox="0 0 24 24")
    path(fill="currentColor" :d="svg")
</template>

<script>
import svgIcon from '@/assets/svg/icon.js'
export default {
  props: {
    name: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    svg: null,
    icon: null,
    svgIcon,
    aliasMap: {
      home: 'home',
      project: 'layers',
      blog: 'history_edu',
      experience: 'pending_actions',
      about: 'info',
      quote: 'format_quote',
      website: 'language',
    },
  }),
  watch: {
    name: {
      handler(nv, ov) {
        if (this.svgIcon[this.name]) {
          this.svg = this.svgIcon[this.name]
        } else {
          this.icon = this.aliasMap[this.name] ? this.aliasMap[this.name] : this.name
        }
      },
      immediate: true
    }
  },
}
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
}

i {
  font-size: inherit;
  // width: 1em;
  // height: 1em;
  overflow: hidden;
  font-display: block;
}
</style>
