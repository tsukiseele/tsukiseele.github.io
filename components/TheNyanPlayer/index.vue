<template lang="pug">
.nyan-player(:class="{ 'nyan-player-mini': isMinimize }")
  audio.nyan-player__audio(ref="audio" :src="currentMusic.src")
  img.nyan-player__cover(v-show="currentMusic.pic" :src="currentMusic.pic" alt="")
  .nyan-player__status
    .nyan-player__status-title {{ currentMusic.title ?? '未播放音乐' }}
    .nyan-player__status-artist {{ currentMusic.artist ?? '-' }}
    .nyan-player__controlbar 
      SIcon(name='skip_previous')
      SIcon(name='pause')
      SIcon(name='play_arrow')
      SIcon(name='skip_next')
      SIcon(name='list' @click="onPlayListSwitch")
  .nyan-player__mini-switch(@click="onStatusSwitch")
    SIcon(name='chevron_left')
  ul.nyan-player__playlist(:class="{ hidden: isHidePlayList || isMinimize }")
    li(v-for="(music, index) in musics" @click="onMusicClick(index)") {{ music.title }} - {{ music.artist }}
</template>

<script>

export default defineComponent({
  props: ['musics'],
  data: () => ({
    currentIndex: 0,
    currentMusic: {},
    isHidePlayList: true,
    isMinimize: false,
  }),

  computed: {
    audio() {
      return this.$refs.audio
    }
  },
  mounted() {
    console.log(this.audio);

  },
  methods: {
    playMusicByIndex(newIndex) {
      this.currentIndex = newIndex > this.musics.length - 1 ? 0 : newIndex < 0 ? this.musics.length - 1 : newIndex;
      this.currentMusic = this.musics[this.currentIndex]
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
  font-size: 1.25em;
}

.nyan-player {
  font-size: 16px;
  --min-size: 6em;
  --minilize-btn-width: 1.25em;
  --minilize-btn-color: hsla(200, 80%, 20%, 1);
  --minilize-btn-bg: hsla(0, 0%, 95%, 1);
  --max-height-playlist: 12em;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: #fff;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .07), 0 1px 5px 0 rgba(0, 0, 0, .1);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  max-width: 24em;
  width: 100%;
  transition: .3s ease;
  padding-right: var(--minilize-btn-width);

  &.nyan-player-mini {
    width: calc(var(--min-size) + var(--minilize-btn-width));

    .nyan-player__status {
      transform: scaleX(0);
    }
  }

  .nyan-player__playlist {
    position: absolute;
    max-height: var(--max-height-playlist);
    overflow-y: scroll;
    left: 0;
    bottom: 100%;

    width: 100%;
    background-color: #fefefe;
    transform-origin: 100% 100%;
    transition: .3s ease;

    &.hidden {
      transform: scaleY(0);
    }

    li {
      padding: 0 1em;
      white-space: nowrap;

      &:hover {
        background-color: #eee;
        cursor: pointer;
      }

      &:nth-of-type(2n-1) {
        background-color: hsla(0, 0%, 95%, 1);
      }
    }
  }
}

.nyan-player__audio {
  display: none;

}


.nyan-player__mini-switch {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25em;
  width: var(--minilize-btn-width);
  color: var(--minilize-btn-color);
  background: var(--minilize-btn-bg);
  user-select: none;
  cursor: pointer;

}

.nyan-player__cover {
  width: var(--min-size);
  height: var(--min-size);

}

.nyan-player__status {
  flex: 1;
  padding-left: 1em;
  transform-origin: 0 0;
  transition: .3s ease;
  max-height: var(--min-size);

  .nyan-player__controlbar {
    user-select: none;
    cursor: pointer;
  }
}
</style>