<template lang="pug">
.nyan-player(:class='{ "nyan-player-mini": isMinimize, "nyan-player-auto-hidden": isAutoHidden && isMinimize}')
  audio.nyan-player__audio(ref='audio' :src='currentMusic.src' autoplay preload="auto")
  .nyan-player__cover(v-if='currentMusic && currentMusic.pic' @click='displayStatus && isMinimize ? displayStatus.paused ? onResume() : onPause() : 0' :data-playing="displayStatus && !displayStatus.paused")
    img.nyan-player__cover(:src='currentMusic.pic' alt='')
    SIcon.nyan-player__cover-control(v-if='displayStatus && isMinimize' :name='displayStatus && displayStatus.paused ? "play_circle" : "pause_circle"' @click='onPause')
  .nyan-player__cover(v-else style='background: skyblue' alt='')
  .nyan-player__status
    .nyan-player__status-title {{ currentMusic.title ?? 'None' }}
      span.nyan-player__status-artist {{ currentMusic.artist ?? '' }}
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
    isSliding: false,
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
    this.playMode = Number(localStorage.getItem('nyan_player_playmode'))
    this.isAutoHidden = Boolean(localStorage.getItem('nyan_player_autohidden'))
    const index = Number(localStorage.getItem('nyan_player_currentindex'))
    this.musics && this.musics.length && this.playMusicByIndex(index)
    // if (music && music.src) {
    //   this.currentMusic = music
    //   this.musics[index] = 
    // } else {
    //   this.musics && this.musics.length && this.playListControl(0)
    // }
  },
  methods: {
    playListControl(skip, musics = this.musics) {
      const currentIndex = musics.findIndex(item => item.uuid == this.currentMusic.uuid);
      const index = currentIndex < 0 ? 0 : currentIndex + skip
      const newIndex = index > musics.length - 1 ? 0 : index < 0 ? musics.length - 1 : index;
      this.playMusicByIndex(newIndex, musics)
    },
    playMusicByIndex(index, musics = this.musics) {
      this.currentMusic = musics[index]
      this.audio.play()
      localStorage.setItem('nyan_player_currentindex', index)

      const domIndex = this.musics.findIndex(item => item.uuid == this.currentMusic.uuid)
      this.$refs.playlist.children[domIndex].scrollIntoView({ behavior: "smooth" })
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
    },
    onAutoHiddenSwitch() {
      this.isAutoHidden = !this.isAutoHidden
      localStorage.setItem('nyan_player_autohidden', this.isAutoHidden)
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
      localStorage.setItem('nyan_player_playmode', this.playMode)
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
i {
  font-size: 1.5rem;
}

.nyan-player {
  font-size: 16px;
  --min-size: 6rem;
  --minilize-btn-width: 1.25rem;
  --minilize-btn-color: hsla(200, 80%, 20%, 1);
  --minilize-btn-bg: hsla(0, 0%, 95%, 1);
  --max-height-playlist: 16rem;
  // --animation-expand: .25s cubic-bezier(0.075, 0.82, 0.165, 1);
  --animation-expand: .25s ease;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: #fff;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .07), 0 1px 5px 0 rgba(0, 0, 0, .1);
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  max-width: 28rem;
  width: 100%;
  height: var(--min-size);
  transition: var(--animation-expand);
  padding-right: var(--minilize-btn-width);
  z-index: 255;

  &.nyan-player-mini {
    width: calc(var(--min-size) + var(--minilize-btn-width));

    .nyan-player__status {
      transform: scaleX(0);
    }
  }

  &.nyan-player-auto-hidden {
    transform: translateX(calc(-100% + var(--minilize-btn-width)));

    &:hover {
      transform: translateX(0);
    }
  }

  .nyan-player__playlist {
    position: absolute;
    left: 0;
    bottom: 100%;
    width: 100%;
    max-height: var(--max-height-playlist);
    overflow-y: scroll;
    overflow-x: hidden;
    background-color: white;
    transform-origin: 100% 100%;
    transition: var(--animation-expand);

    &::-webkit-scrollbar {
      width: 0.25rem;
      height: 0.25rem;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: .125rem;
      background: linear-gradient(45deg, #b980ae, #b980ae);
    }

    &::-webkit-scrollbar-thumb:hover {
      filter: brightness(1.2);
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &.hidden {
      transform: scaleY(0);
    }

    li {
      position: relative;
      padding: 0 .5rem 0 .25rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: .875rem;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 2rem;
      transition: .25s ease;
      display: flex;
      border-bottom: 1px solid hsla(0, 0%, 95%, 1);

      &:hover {
        background-color: #eee;
        cursor: pointer;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 0;
        opacity: 0;
        background-color: hsla(200, 40%, 60%, 1);
        transition: .25s ease;
      }

      &.active::before {
        width: .25rem;
        opacity: 1;
      }

      .playlist-number {
        font-weight: lighter;
        font-size: .75rem;
        width: 2rem;
        text-align: center;
        color: hsla(0, 0%, 50%, 1);
      }

      .playlist-name {
        color: hsla(0, 0%, 20%, 1);
        flex: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .playlist-artist {
        color: hsla(0, 0%, 50%, 1);
        max-width: 8rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}

.nyan-player__audio {
  display: none;

}

.nyan-player__status-title {
  font-size: .875rem;
  max-width: 16rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  .nyan-player__status-artist {
    color: hsla(0, 0%, 50%, 1);
    font-size: .75rem;
    margin-left: .5rem;
  }
}

.nyan-player__mini-switch {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--minilize-btn-width);
  color: var(--minilize-btn-color);
  background: var(--minilize-btn-bg);
  user-select: none;
  cursor: pointer;

  i {
    font-size: 1.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.nyan-player__cover {
  position: relative;
  transition: .25s ease;
  cursor: pointer;
  user-select: none;

  &[data-playing=false] {
    .nyan-player__cover-control {
      top: 50%;
      left: 50%;
      color: hsla(0, 0%, 100%, .9);
      transform: translate(-50%, -50%);
      font-size: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &:hover .nyan-player__cover-control {
    color: hsla(0, 0%, 95%, 1);
  }

  .nyan-player__cover-control {
    position: absolute;
    top: 0;
    left: 0;
    color: hsla(0, 0%, 100%, .5);
    transition: .25s ease;

  }

  img {
    width: var(--min-size);
    height: var(--min-size);
    object-fit: cover;
  }
}

.nyan-player__status {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: var(--min-size);
  transform-origin: 0 0;
  transition: var(--animation-expand);
  padding: .5rem .5rem 0 .5rem;

  .nyan-player__controlbar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    flex: 1;

    i {
      padding: 0 .25rem;
      cursor: pointer;
    }

    .controlbar-right {
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;

      i {
        color: hsla(0, 0%, 25%, 1);
        font-size: 1.125rem;
      }
    }
  }
}

.nyan-player__timer {
  text-align: right;
  font-size: .75rem;
  color: hsla(0, 80%, 0%, 1);
}

.nyan-player__progress {
  display: flex;
  align-items: center;
  width: 100%;

  .nyan-player__slider {
    flex: 1;
  }

  .nyan-player__bar {
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: var(--progress);
      height: 2px;
      background-color: hsla(200, 40%, 80%, 1);
    }

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      height: 1px;
      background-color: hsla(200, 40%, 80%, 1);
    }
  }

  .nyan-player__timer {
    color: hsla(0, 0%, 50%, 1);
    padding-left: .5rem;
  }
}
</style>