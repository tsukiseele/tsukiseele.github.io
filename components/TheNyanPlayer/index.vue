<template lang="pug">
.nyan-player(:class="{ 'nyan-player-mini': isMinimize }")
  audio.nyan-player__audio(ref="audio" :src="currentMusic.src" autoplay)
  img.nyan-player__cover(v-if="currentMusic && currentMusic.pic" :src="currentMusic.pic" alt="")
  .nyan-player__cover(v-else style="background: skyblue" alt="")
  .nyan-player__status
    .nyan-player__status-title {{ currentMusic.title ?? '未播放音乐' }}
      span.nyan-player__status-artist - {{ currentMusic.artist ?? '-' }}
    .nyan-player__progress(v-if="currentStatus" :style="`--progress: ${currentStatus.currentTime / currentStatus.duration * 100 }%;`")
      .nyan-player__bar
      .nyan-player__timer {{ getCurrentTimeText() }}
    .nyan-player__controlbar 
      SIcon(name='skip_previous' @click="onPlayPrev")
      SIcon(v-if="currentStatus && currentStatus.paused" name='play_arrow' @click="onResume")
      SIcon(v-else name='pause' @click="onPause")
      SIcon(name='skip_next' @click="onPlayNext")
      SIcon(name='list' @click="onPlayListSwitch")
  .nyan-player__mini-switch(@click="onStatusSwitch")
    SIcon(v-if="isMinimize" name='chevron_right')
    SIcon(v-else name='chevron_left')
  ul.nyan-player__playlist(:class="{ hidden: isHidePlayList || isMinimize }")
    li(v-for="(music, index) in musics" @click="onMusicClick(index)" :class="{active: currentIndex == index}") 
      span.number {{ index + 1 }} 
      span.text {{ music.title }} - {{ music.artist }}
</template>

<script>

export default defineComponent({
  props: ['musics'],
  data: () => ({
    currentIndex: 0,
    currentMusic: {},
    isHidePlayList: true,
    isMinimize: false,
    currentStatus: null,

  }),

  computed: {
    audio() {
      return this.$refs.audio
    },
    isPlaying() {
      return this.$refs.audio && this.audio && !this.audio.paused
    }
  },
  mounted() {
    this.audio.addEventListener('timeupdate', this.onTimeUpdate)
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
      return this.currentStatus ? `${this.formatDuraton(this.currentStatus.currentTime)} / ${this.formatDuraton(this.currentStatus.duration)}` : ''
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
    onPlayNext() {
      this.playMusicByIndex(this.currentIndex + 1)
      // this.currentMusic = this.musics[this.currentIndex + 1 >= this.musics.length ? this.musics[0] : ]
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
      // this.isHidePlayList = false
      this.isMinimize = !this.isMinimize
    }
  }

})
</script>

<style lang="scss" scoped>
i {
  font-size: 1.25rem;
}

.nyan-player {
  font-size: 16px;
  --min-size: 6rem;
  --minilize-btn-width: 1.25rem;
  --minilize-btn-color: hsla(200, 80%, 20%, 1);
  --minilize-btn-bg: hsla(0, 0%, 95%, 1);
  --max-height-playlist: 16rem;
  --animation-expand: .25s cubic-bezier(0.075, 0.82, 0.165, 1);
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: #fff;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .07), 0 1px 5px 0 rgba(0, 0, 0, .1);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  max-width: 25rem;
  width: 100%;
  height: var(--min-size);
  transition: var(--animation-expand);
  padding-right: var(--minilize-btn-width);

  &.nyan-player-mini {
    width: calc(var(--min-size) + var(--minilize-btn-width));

    .nyan-player__status {
      transform: scaleX(0);
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

      color: hsla(0, 0%, 20%, 1);

      &:nth-of-type(2n-1) {
        background-color: hsla(0, 0%, 98%, 1);
      }

      &:hover {
        background-color: #eee;
        cursor: pointer;
      }

      &.active::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: .25rem;
        background-color: hsla(200, 40%, 60%, 1);
      }

      .number {
        font-weight: lighter;
        margin: 0 .5rem;
        color: hsla(0, 0%, 50%, 1);
      }
    }
  }
}

.nyan-player__audio {
  display: none;

}

.nyan-player__status-title {
  max-width: 16rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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
    font-size: 1.5rem;
    text-align: center;
    vertical-align: center;
  }

}

.nyan-player__cover {
  width: var(--min-size);
  height: var(--min-size);
}

.nyan-player__status {
  flex: 1;
  padding: 0 .5rem;
  transform-origin: 0 0;
  transition: var(--animation-expand);
  max-height: var(--min-size);

  .nyan-player__controlbar {
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;

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

  .nyan-player__bar {
    flex: 1;
    display: flex;
    align-items: center;

    &::before {
      content: '';
      width: var(--progress);
      height: 2px;
      background-color: hsla(200, 40%, 80%, 1);
    }
  }

  .nyan-player__timer {
    color: hsla(0, 0%, 50%, 1);
    padding-left: .5rem;
  }
}
</style>