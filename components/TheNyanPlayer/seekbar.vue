<template lang="pug">
.np-seekbar(ref="seekbar"
  @touchstart.stop.prevent="onTouchStart" 
  @touchmove.stop.prevent="onTouchMove" 
  @touchend.stop.prevent="onTouchEnd"
  )
  .np-seekbar__btn(:style="{left: `${position}px`}" )
</template>


<script>
export default defineComponent({
  data: () => ({
    position: 0,
    isDown: false,
  }),
  mounted() {
    document.addEventListener('mousedown', this.onMouseDown)
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
  },
  methods: {
    // onTouchStart(e) {
    //   const touch = e.changedTouches[0]
    //   this.position = touch.clientX
    // },
    // onTouchMove(e) {
    //   const touch = e.changedTouches[0]
    //   this.position = touch.clientX
    // },
    // onTouchEnd(e) {
    //   const touch = e.changedTouches[0]
    //   this.position = touch.clientX

    // },
    onMouseDown(e) {
      e.preventDefault()
      this.isDown = true
    },
    onMouseUp(e) {
      e.preventDefault();
      this.isDown = false
    },
    onMouseMove(e) {
      e.preventDefault()
      if (this.isDown) {
        const el = this.$refs.seekbar
        if (el) {
          const rect = el.getBoundingClientRect()
          const p = e.clientX - rect.left
          this.position = p < 0 ? 0 : p > rect.width ? rect.width : p
          // this.value = this.position - 
          console.log(this.position);
        }
      }
    },
  }

})
</script>

<style lang="scss" scoped>
.np-seekbar {
  position: relative;
  width: 100%;
  height: 10px;

  .np-seekbar__btn {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: teal;
  }
}
</style>