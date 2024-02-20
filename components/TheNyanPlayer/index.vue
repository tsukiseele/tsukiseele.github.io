<template lang="pug">
NPLyric.nyan-player__lyric(v-if="displayStatus && enableLyric" :lyrics="lyric" :timestamp="displayStatus.currentTime")
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
      .controlbar-left
        SIcon(name='skip_previous' @click='() => onPlayControl(-1)')
        SIcon(v-if='displayStatus && displayStatus.paused' name='play_arrow' @click='onResume')
        SIcon(v-else name='pause' @click='onPause')
        SIcon(name='skip_next' @click='() => onPlayControl(1)')
      .controlbar-right
        span.nyan-player__volume-control
          SIcon(v-if='displayStatus' :name='displayStatus.muted ? `volume_off` : `volume_up`' @click='onVolumeSwitch')
          .volume-slider
            NPSlider(v-model:value="volumeValue" vertical)
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
import NPLyric from './NPLyric.vue'

export default defineComponent({
  setup() { return { PLAYMODE_LIST_LOOP: 1, PLAYMODE_SINGLE_LOOP: 2, PLAYMODE_RANDOM: 4 } },
  props: ['musics', 'fetchLyric'],
  components: { NPSlider, NPLyric },
  data: () => ({
    playMode: 1,
    currentMusic: {},
    displayStatus: null,
    isHidePlayList: true,
    isMinimize: false,
    isAutoHidden: false,
    isAutoPlay: false,
    isSliding: false,
    volumeValue: 0,
    config: {},
    lyric: [],
    enableLyric: true,
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
    },
    volumeValue(nv, ov) {
      this.audio.muted && (this.audio.muted = false)
      this.audio.volume = nv
      this.saveConfig({ volume: nv })
    }
  },
  mounted() {
    this.audio.addEventListener('timeupdate', this.onTimeUpdate)
    this.audio.addEventListener('ended', e => this.onPlayControl())
    this.config = JSON.parse(localStorage.getItem('nyan_player'))
    if (this.config) {
      this.playMode = this.config.playMode || this.PLAYMODE_LIST_LOOP
      this.isAutoHidden = this.config.isAutoHidden || false
      this.musics && this.musics.length && this.playMusicByIndex(this.config.currentIndex, this.musics, !this.config.paused)
      this.volumeValue = this.config.volume || .5
      // if (this.config.paused) this.$nextTick(() => this.audio.pause())
      if (this.config.currentTime && !isNaN(this.config.currentTime))
        this.audio.currentTime = this.config.currentTime
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
    // lrc (String) - lrc file text
    parseLyric(lrc) {
      // will match "[00:00.000] ooooh yeah!"
      // note: i use named capturing group
      const regex = /^\[(?<time>\d+?:\d+?(.\d+?)?)\](?<text>.*)/;

      // split lrc string to individual lines
      const lines = lrc.split("\n");

      const output = [];

      lines.forEach(line => {
        const match = line.match(regex);

        // if doesn't match, return.
        if (match == null) return;

        const { time, text } = match.groups;

        output.push({
          time: parseTime(time),
          text: text.trim()
        });
      });

      // parse formated time
      // "03:24.73" => 204.73 (total time in seconds)
      function parseTime(time) {
        const minsec = time.split(":");

        const min = parseInt(minsec[0]) * 60;
        const sec = parseFloat(minsec[1]);

        return min + sec;
      }

      return output;
    },
    saveConfig(obj) {
      this.config = { ...this.config, ...obj }
      localStorage.setItem('nyan_player', JSON.stringify(this.config))
    },
    playListControl(skip, musics = this.musics) {
      const currentIndex = musics.findIndex(item => item.uuid == this.currentMusic.uuid);
      const index = currentIndex < 0 ? 0 : currentIndex + skip
      const newIndex = index > musics.length - 1 ? 0 : index < 0 ? musics.length - 1 : index;
      this.playMusicByIndex(newIndex, musics)
    },
    async playMusicByIndex(index, musics = this.musics, isAutoPlay = true) {
      this.currentMusic = musics[index]
      if (isAutoPlay) this.$nextTick(() => this.audio.play())

      const realIndex = this.musics.findIndex(item => item.uuid == this.currentMusic.uuid)
      this.saveConfig({ currentIndex: realIndex })
      this.$refs.playlist.children[realIndex].scrollIntoView({ behavior: "smooth", block: 'center' })

      if (this.enableLyric) {
        this.lyric = null
        const lrcResp = await this.fetchLyric(this.currentMusic.id)
        const parsedLrc = this.parseLyric(lrcResp)
        this.lyric = parsedLrc
        console.log(lrcResp, parsedLrc)
      }
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
          muted: e.target.muted
        }
      }
      this.saveConfig({ ...this.displayStatus })
    },
    onVolumeSwitch() {
      this.audio.muted = !this.audio.muted
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
      this.saveConfig({
        paused: true
      })
    },
    onResume() {
      this.audio.play()
      this.saveConfig({
        paused: false
      })
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