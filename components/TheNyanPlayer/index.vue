<template lang="pug">
.nyan-player(:class='{ "nyan-player-mini": isMinimize, "nyan-player-auto-hidden": isAutoHidden && isMinimize}')
  audio.nyan-player__audio(ref='audio' :src='currentMusic.src' autoplay)
  .nyan-player__cover(v-if='currentMusic && currentMusic.pic' @click='currentStatus && isMinimize ? currentStatus.paused ? onResume() : onPause() : 0' :data-playing="currentStatus && !currentStatus.paused")
    img.nyan-player__cover(:src='currentMusic.pic' alt='')
    SIcon.nyan-player__cover-control(v-if='currentStatus && isMinimize' :name='currentStatus && currentStatus.paused ? "play_circle" : "pause_circle"' @click='onPause')
  .nyan-player__cover(v-else style='background: skyblue' alt='')
  .nyan-player__status
    .nyan-player__status-title {{ currentMusic.title ?? 'None' }}
      span.nyan-player__status-artist {{ currentMusic.artist ?? '' }}
    .nyan-player__controlbar 
      SIcon(name='skip_previous' @click='onPlayPrev')
      SIcon(v-if='currentStatus && currentStatus.paused' name='play_arrow' @click='onResume')
      SIcon(v-else name='pause' @click='onPause')
      SIcon(name='skip_next' @click='onPlayNext')
      .controlbar-right
        SIcon(v-if='playMode === PLAYMODE_SINGLE_LOOP' name='laps' @click='onPlayModeSwitch')
        SIcon(v-else-if='playMode === PLAYMODE_RANDOM' name='shuffle' @click='onPlayModeSwitch')
        SIcon(v-else name='playlist_play' @click='onPlayModeSwitch')
        SIcon(name='list' @click='onPlayListSwitch')
    .nyan-player__progress(:style='`--progress: ${currentStatus ? currentStatus.currentTime / currentStatus.duration * 100 : 0}%;`')
      NPSeekBar.nyan-player__seekbar(v-model:value="currentProgress")
      .nyan-player__timer {{ getCurrentTimeText() }}
  .nyan-player__mini-switch(@click='onStatusSwitch')
    SIcon(v-if='isMinimize' name='chevron_right')
    SIcon(v-else name='chevron_left')
  ul.nyan-player__playlist(:class='{ hidden: isHidePlayList || isMinimize }')
    li(v-for='(music, index) in musics' @click='onMusicClick(index)' :class='{active: currentIndex == index}') 
      span.playlist-number {{ index + 1 }} 
      span.playlist-name {{ music.title }}
      span.playlist-artist {{ music.artist }}
</template>

<script>

import NPSeekBar from './seekbar.vue'

export default defineComponent({
  setup() { return { PLAYMODE_LIST_LOOP: 1, PLAYMODE_SINGLE_LOOP: 2, PLAYMODE_RANDOM: 4 } },
  props: ['musics'],
  components: {
    NPSeekBar
  },
  data: () => ({
    currentIndex: 0,
    currentMusic: {},
    isHidePlayList: true,
    isMinimize: false,
    currentStatus: null,
    playMode: 1,
    isAutoHidden: false,
  }),
  computed: {
    audio() {
      return this.$refs.audio
    },
    isPlaying() {
      return this.$refs.audio && this.audio && !this.audio.paused
    },

    currentProgress: {
      get() {
        return this.currentStatus ? this.currentStatus.currentTime / this.currentStatus.duration : 0
      },
      set(value) {
        this.audio.currentTime = this.audio.duration * value
      }
    }
  },
  mounted() {
    this.audio.addEventListener('timeupdate', this.onTimeUpdate)
    this.audio.addEventListener('ended', this.onPlayNext)
    this.musics && this.musics.length && this.playMusicByIndex(0)
    this.playMode = localStorage.getItem('nyan_player_playmode')
  },
  beforeDestroy() {
    this.audio.removeEventListener('timeupdate', this.onTimeUpdate)

  },

  methods: {
    formatDuraton(time) {
      return time && time > -1 ?
        `${String(Math.floor(time / 60)).padStart(1, '0')}:${String(Math.floor(time % 60)).padStart(2, '0')}`
        : '0:00';
    },
    getCurrentTimeText() {
      return this.currentStatus ? `${this.formatDuraton(this.currentStatus.currentTime)} / ${this.formatDuraton(this.currentStatus.duration)}` : '0:00'
    },
    onTimeUpdate(e) {
      this.currentStatus = {
        currentTime: e.target.currentTime,
        duration: e.target.duration,
        paused: e.target.paused
      }
    },
    playMusicByIndex(newIndex) {
      this.currentIndex = newIndex > this.musics.length - 1 ? 0 : newIndex < 0 ? this.musics.length - 1 : newIndex;
      this.currentMusic = this.musics[this.currentIndex]
      this.audio.play()
    },
    onMusicClick(index) {
      this.playMusicByIndex(index)
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
    onPlayNext() {
      switch (this.playMode) {
        case this.PLAYMODE_RANDOM:
          this.playMusicByIndex(this.currentIndex + 1)
          break;
        case this.PLAYMODE_SINGLE_LOOP:
          this.playMusicByIndex(this.currentIndex)
          break;
        default:
          this.playMusicByIndex(this.currentIndex + 1)
          break;
      }
    },
    onPlayPrev() {
      this.playMusicByIndex(this.currentIndex - 1)
    },
    onPause() {
      this.audio.pause()
    },
    onResume() {
      this.audio.play()
    },
    onStatusSwitch() {
      this.isMinimize = !this.isMinimize
    }
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
  max-width: 26rem;
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
      padding: 0 .5rem;
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
        margin: 0 .5rem;
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
        font-size: 1.25rem;
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

  .nyan-player__seekbar {
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
}</style>