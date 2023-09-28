<template lang="pug">
.nyan-player(:class='{ "nyan-player-mini": isMinimize, "nyan-player-auto-hidden": isAutoHidden && isMinimize}')
  audio.nyan-player__audio(ref='audio' :src='currentMusic.src' :autoplay="isAutoPlay" preload="auto")
  .nyan-player__cover(v-if='currentMusic && currentMusic.pic' @click='displayStatus && isMinimize ? displayStatus.paused ? onResume() : onPause() : 0' :data-playing="displayStatus && !displayStatus.paused")
    img.nyan-player__cover(:src='currentMusic.pic' alt='')
    SIcon.nyan-player__cover-control(v-if='displayStatus && isMinimize' :name='displayStatus && displayStatus.paused ? "play_circle" : "pause_circle"' @click='onPause')
  .nyan-player__cover(v-else style='background: skyblue' alt='')
  .nyan-player__status
    .nyan-player__status-title {{ currentMusic.title || 'None' }}
      span.nyan-player__status-artist {{ currentMusic.artist || '' }}
    .nyan-player__controlbar 
      SIcon(name='skip_previous' @click='() => onPlayControl(-1)')
      SIcon(v-if='displayStatus && displayStatus.paused' name='play_arrow' @click='onResume')
      SIcon(v-else name='pause' @click='onPause')
      SIcon(name='skip_next' @click='() => onPlayControl(1)')
      .controlbar-right
        SIcon(:name='isAutoHidden ? `visibility_off` : `visibility`' @click='onAutoHiddenSwitch')
        SIcon(v-if='playMode == PLAYMODE_SINGLE_LOOP' name='repeat_one' @click='onPlayModeSwitch')
        SIcon(v-else-if='playMode == PLAYMODE_RANDOM' name='shuffle' @click='onPlayModeSwitch')
        SIcon(v-else name='laps' @click='onPlayModeSwitch')
        SIcon(name='list' @click='onPlayListSwitch')
    .nyan-player__progress(:style='`--progress: ${displayStatus ? displayStatus.currentTime / displayStatus.duration * 100 : 0}%;`')
      NPSlider.nyan-player__slider(v-model:value="sliderValue" @start="onSlidingStart" @end="onSlidingEnd")
      .nyan-player__timer {{ currentTimeText }}
  .nyan-player__mini-switch(@click='onStatusSwitch')
    SIcon(v-if='isMinimize' name='chevron_right')
    SIcon(v-else name='chevron_left')
  ul.nyan-player__playlist(ref='playlist' :class='{ hidden: isHidePlayList || isMinimize }')
    li(v-for='(music, index) in musics' @click='playMusicByIndex(index)' :class='{ active: currentMusic.uuid == music.uuid }') 
      span.playlist-number {{ index + 1 }} 
      span.playlist-name {{ music.title }}
      span.playlist-artist {{ music.artist }}
</template>

<script>
import NPSlider from './NPSlider.vue'

export default defineComponent({
  setup() { return { PLAYMODE_LIST_LOOP: 1, PLAYMODE_SINGLE_LOOP: 2, PLAYMODE_RANDOM: 4 } },
  props: ['musics'],
  components: {
    NPSlider
  },
  data: () => ({
    playMode: 1,
    currentMusic: {},
    displayStatus: null,
    isHidePlayList: true,
    isMinimize: false,
    isAutoHidden: false,
    isAutoPlay: true,
    isSliding: false,
    history: {}
  }),
  computed: {
    audio() {
      return this.$refs.audio
    },
    currentTimeText() {
      return this.displayStatus ? `${this.formatDuraton(this.displayStatus.currentTime)} / ${this.formatDuraton(this.displayStatus.duration)}` : '0:00'
    },
    sliderValue: {
      get() {
        return this.displayStatus ? this.displayStatus.currentTime / this.displayStatus.duration : 0
      },
      set(value) {
        this.displayStatus.currentTime = this.displayStatus.duration * value
      }
    },
    shufflePlayList() {
      return this.shuffle(this.musics)
    },
  },
  watch: {
    musics: {
      handler(nv, ov) {
        nv && nv.forEach((item, index) => {
          item.uuid = index
          return item
        })
      },
      immediate: true
    }
  },
  mounted() {
    this.audio.addEventListener('timeupdate', this.onTimeUpdate)
    this.audio.addEventListener('ended', e => this.onPlayControl())
    this.history = JSON.parse(localStorage.getItem('nyan_player'))
    if (this.history) {
      this.playMode = this.history.playMode || this.PLAYMODE_LIST_LOOP
      this.isAutoHidden = this.history.isAutoHidden || false
      this.musics && this.musics.length && this.playMusicByIndex(this.history.currentIndex)
      if (this.history.currentTime && !isNaN(this.history.currentTime))
        this.audio.currentTime = this.history.currentTime
    } else {
      this.musics && this.musics.length && this.playListControl(0)
    }
  },
  beforeDestroy() {
    this.saveConfig({
      lastPlayProgress: this.sliderValue
    })
  },
  methods: {
    saveConfig(obj) {
      this.history = { ...this.history, ...obj }
      localStorage.setItem('nyan_player', JSON.stringify(this.history))
    },
    playListControl(skip, musics = this.musics) {
      const currentIndex = musics.findIndex(item => item.uuid == this.currentMusic.uuid);
      const index = currentIndex < 0 ? 0 : currentIndex + skip
      const newIndex = index > musics.length - 1 ? 0 : index < 0 ? musics.length - 1 : index;
      this.playMusicByIndex(newIndex, musics)
    },
    playMusicByIndex(index, musics = this.musics) {
      this.currentMusic = musics[index]
      this.audio.play()

      const realIndex = this.musics.findIndex(item => item.uuid == this.currentMusic.uuid)
      this.saveConfig({ currentIndex: realIndex })
      this.$refs.playlist.children[realIndex].scrollIntoView({ behavior: "smooth", block: 'center'})
    },
    onSlidingStart() {
      this.isSliding = true
    },
    onSlidingEnd() {
      this.isSliding = false
      const targetTime = this.audio.duration * this.sliderValue
      this.audio.currentTime = isNaN(targetTime) ? 0 : targetTime
    },
    onTimeUpdate(e) {
      if (!this.isSliding) {
        this.displayStatus = {
          currentTime: e.target.currentTime,
          duration: e.target.duration,
          paused: e.target.paused,
        }
      }
      this.saveConfig({...this.displayStatus })
    },
    onAutoHiddenSwitch() {
      this.isAutoHidden = !this.isAutoHidden
      this.saveConfig({
        isAutoHidden: this.isAutoHidden
      })
    },
    onPlayListSwitch() {
      this.isHidePlayList = !this.isHidePlayList
    },
    onPlayModeSwitch() {
      switch (this.playMode) {
        case this.PLAYMODE_LIST_LOOP:
          this.playMode = this.PLAYMODE_RANDOM
          break
        case this.PLAYMODE_RANDOM:
          this.playMode = this.PLAYMODE_SINGLE_LOOP
          break
        default:
          this.playMode = this.PLAYMODE_LIST_LOOP
          break
      }
      this.saveConfig({ playMode: this.playMode })
    },
    onPlayControl(skip = 1) {
      switch (this.playMode) {
        case this.PLAYMODE_RANDOM:
          this.playListControl(skip, this.shufflePlayList)
          break;
        case this.PLAYMODE_SINGLE_LOOP:
          this.playListControl(this.sliderValue == 1 ? 0 : skip)
          break;
        default:
          this.playListControl(skip)
          break;
      }
    },
    onPause() {
      this.audio.pause()
    },
    onResume() {
      this.audio.play()
    },
    onStatusSwitch() {
      this.isMinimize = !this.isMinimize
    },
    shuffle(arr) {
      const shuffle = [...arr]
      const randInt = (start, end) => {
        if (start > end) [start, end] = [end, start]
        return Math.floor(Math.random() * (end - start + 1) + start)
      }
      for (let i = 0; i < arr.length - 1; i++) {
        const rand = randInt(i, arr.length - 1)
        const temp = shuffle[i]
        shuffle[i] = shuffle[rand]
        shuffle[rand] = temp
      }
      return shuffle
    },
    formatDuraton(time) {
      return time && time > -1 ?
        `${String(Math.floor(time / 60)).padStart(1, '0')}:${String(Math.floor(time % 60)).padStart(2, '0')}`
        : '0:00';
    },
  }

})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>