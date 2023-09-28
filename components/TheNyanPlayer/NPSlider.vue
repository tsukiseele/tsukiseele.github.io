<template lang="pug">
.np-slider(
  ref="slider" 
  @touchstart.stop.prevent="onTouchStart" 
  @touchmove.stop.prevent="onTouchMove" 
  @touchend.stop.prevent="onTouchEnd"
  @mousedown.stop.prevent="onMouseDown" 
)
  .np-slider-progress(:style="{ width: `${ position }px`}" )
</template>

<script>
export default defineComponent({
  props: {
    value: {
      type: Number,
      default: 0
    },
  },
  computed: {
    mValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('update:value', value)
      }
    }
  },
  watch: {
    mValue(nv, ov) {
      this.setPosition(nv)
    }
  },
  data: () => ({
    isSliding: false,
    position: 0,
  }),
  emits: ['update:value', 'start', 'end'],
  mounted() {
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  },
  methods: {
    onSeekStart(e) {
      this.$emit('start', e)
    },
    onSeekEnd(e) {
      this.$emit('end', e)
    },
    onTouchStart(e) {
      e.changedTouches && this.updatePosition(e.changedTouches[0])
      this.onSeekStart()
    },
    onTouchMove(e) {
      e.changedTouches && this.updatePosition(e.changedTouches[0])
    },
    onTouchEnd(e) {
      e.changedTouches && this.updatePosition(e.changedTouches[0])
      this.onSeekEnd()
    },
    onMouseDown(e) {
      e.preventDefault()
      this.isSliding = true
      this.updatePosition(e, this.$refs.slider)
      this.onSeekStart()
    },
    onMouseMove(e) {
      e.preventDefault()
      if (this.isSliding) {
        this.updatePosition(e, this.$refs.slider)
      }
    },
    onMouseUp(e) {
      e.preventDefault();
      if (this.isSliding) {
        this.isSliding = false
        this.onSeekEnd()
      }
    },
    setPosition(value) {
      this.position = this.getSliderRange().length * value
    },
    getSliderRange() {
      const parent = this.$refs.slider
      const pRect = parent.getBoundingClientRect()
      const min = 0;
      const max = pRect.width;
      return { min, max, length: max - min }
    },
    updatePosition(e) {
      const parent = this.$refs.slider
      if (e && parent) {
        const rect = parent.getBoundingClientRect()
        const pos = e.clientX - rect.left
        const range = this.getSliderRange()
        this.position = pos < range.min ? range.min : pos > range.max ? range.max : pos
        this.mValue = this.position / range.length
      }
    },
  }

})
</script>

<style lang="scss" scoped>
.np-slider {
  position: relative;
  width: 100%;
  height: 1rem;
  margin: 0 .5rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 1px;
    background-color: hsla(220, 40%, 50%, 1);
  }

  .np-slider-progress {
    position: absolute;
    height: 2px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    background-color: hsla(220, 60%, 25%, 1);

    &::before {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 8px;
      background-color: hsla(220, 80%, 25%, 1);
    }
  }
}
</style>