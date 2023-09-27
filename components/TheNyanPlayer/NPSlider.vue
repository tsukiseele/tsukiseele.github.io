<template lang="pug">
.np-seekbar(
  ref="seekbar" 
  @touchstart.stop.prevent="onTouchStart" 
  @touchmove.stop.prevent="onTouchMove" 
  @touchend.stop.prevent="onTouchEnd"
  @mousedown.stop.prevent="onMouseDown" 
)
  .np-seekbar__btn(ref="seek" :style="{ width: `${ position }px`}" )
</template>

<script>
const TYPE_SEEKBAR_DOT = 1
const TYPE_SEEKBAR_LINE = 2
export default defineComponent({
  props: {
    value: {
      type: Number,
      default: 0
    },
    type: {
      type: Number,
      default: TYPE_SEEKBAR_LINE
    }
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
      this.updatePosition(e, this.$refs.seekbar)
      this.onSeekStart()
    },
    onMouseMove(e) {
      e.preventDefault()
      if (this.isSliding) {
        this.updatePosition(e, this.$refs.seekbar)
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
      this.position = this.getSeekbarRange().length * value
    },
    getSeekbarRange() {
      const parent = this.$refs.seekbar
      const block = this.$refs.seek
      const pRect = parent.getBoundingClientRect()
      const bRect = block.getBoundingClientRect()
      if (this.type == TYPE_SEEKBAR_DOT) {
        const min = bRect.width / 2;
        const max = pRect.width - bRect.width / 2;
        return { min, max, length: max - min }
      } else {
        const min = 0;
        const max = pRect.width;
        return { min, max, length: max - min }
      }
    },
    updatePosition(e) {
      const parent = this.$refs.seekbar
      if (e && parent) {
        const rect = parent.getBoundingClientRect()
        const pos = e.clientX - rect.left
        const range = this.getSeekbarRange()
        console.log(e);
        console.log(pos, e.clientX, rect.left);
        this.position = pos < range.min ? range.min : pos > range.max ? range.max : pos
        console.log(this.position / range.length);
        console.log(this.position, range.length);
        this.mValue = this.position / range.length
      }
    },
  }

})
</script>

<style lang="scss" scoped>
.np-seekbar {
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
    height: 2px;
    background-color: hsla(330, 40%, 80%, 1);
  }

  .np-seekbar__btn {
    position: absolute;
    height: 4px;
    top: 50%;
    left: 0;  
    transform: translateY(-50%);
    background-color: hsla(330, 60%, 80%, 1);
  }
}

// .np-seekbar {
//   position: relative;
//   width: 100%;
//   height: 10px;
//   margin: .5rem;
//   &::before {
//     content: '';
//     position: absolute;
//     left: 0;
//     right: 0;
//     top: 50%;
//     transform: translateY(-50%);
//     height: 2px;
//     background-color: hsla(330, 40, 80, 1);
//   }
//   .np-seekbar__btn {
//     position: absolute;
//     width: 10px;
//     height: 10px;
//     top: 50%;
//     transform: translateY(-50%);
//     border-radius: 50%;
//     background-color: hsla(330, 80, 80, 1);;
//   }
// }
</style>