<template lang="pug">
#hsl
  #background(:data-theme-background='$cfg.backgroundTheme')
    .decorate
      .decorate-item
      .decorate-item
  #app(:class='{ full: isFull }')
    //- TheNav(
    //-   :title='navigation.title',
    //-   :subtitle='navigation.subtitle',
    //-   :nav='navigation.nav',
    //-   :links='navigation.links',
    //-   :drawerBannerBackground='navigation.drawerBannerBackground',
    //-   :isMobile='isMobile',
    //-   :isFull='isFull',
    //-   :isTransparent='isTransparentNav',
    //-   :isHide='isHideNav',
    //- )
    main#main
      SAside
      #content
        slot
    //- 页脚
    //- TheFooter#footer
    //- 播放器
    ClientOnly
      TheNyanPlayer(v-if='musics && musics.length', :musics='musics', :fetch-lyric='$cfg.musicLyricRequestMethod')
    //- 返回顶部
    //- TheBackTop
</template>

<script>
import _ from 'lodash'
import { mapState, mapStores } from 'pinia'
import { useMainStore } from '@/stores/index'

export default {
  data: () => ({
    musics: [],
    windowWidth: 0,
    onScroll: null,
    onResize: null,
  }),
  computed: {
    ...mapState(useMainStore, ['navigation', 'isMobile', 'scroll']),
    isFull() {
      return this.$route.path == '/'
    },
    isHideNav() {
      // return true
      return this.isFull && (process.server || this.scroll.pos <= document.documentElement.clientHeight)
    },
    isTransparentNav() {
      return false // this.scroll.pos < 64
    },
  },
  watch: {
    windowWidth(newVal) {
      useMainStore().$patch({
        clientWidth: newVal,
      })
    },
    scroll(nv, ov) {
      const root = document.querySelector(':root')
      if (!root) return
      root.style.setProperty('--nav-height', nv.pos > 32 ? '3rem' : '4rem')
    },
  },
  methods: {
    /**
     * 获取播放列表
     */
    async getMusicList() {
      try {
        const result = await (await fetch(SiteConfig.musicAPI, { method: 'GET', mode: 'cors' })).json()
        if (result.code == 200) {
          // this.musics = result.playlist.tracks.map((item) => ({
          //   id: item.id,
          //   name: item.name,
          //   artist: item.ar.map((item) => item.name).toString(),
          //   cover: item.al.picUrl ? item.al.picUrl.replace('http://', 'https://') : '',
          //   url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
          //   // lrc: `https://api.hlo.li/music/lyric?id=${item.id}`
          // }))

          // NEW
          this.musics = await await fetch(`/song/detail?ids=347230,347231`)
          // OLD
          this.musics = result.playlist.tracks.map((item) => ({
            id: item.id,
            title: item.name,
            artist: item.ar.map((item) => item.name).toString(),
            pic: item.al.picUrl ? item.al.picUrl.replace('http://', 'https://') : '',
            src: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
            // lrc: `https://api.hlo.li/music/lyric?id=${item.id}`
          }))
          console.log(this.musics)
        }
      } catch (e) {
        console.log(e)
      }
    },
    getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    registerEventListener() {
      this.onScroll = _.throttle(() => {
        const newPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        const scroll = this.scroll || {}
        this.$store.scroll = {
          pos: newPos,
          change: scroll && scroll.pos ? newPos - scroll.pos : 0,
        }
      }, 200)
      this.onResize = _.throttle(() => {
        this.windowWidth = document.documentElement.clientWidth
      }, 200)
      window.addEventListener('scroll', this.onScroll)
      window.addEventListener('resize', this.onResize)
      this.$nextTick(() => this.onScroll() || this.onResize())
    },
  },
  async mounted() {
    process.client && this.registerEventListener()
    this.musics = await this.$cfg.musicRequestMethod()
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
  },
}
</script>

<style lang="scss" scoped>
$mobile: 800px;

@media screen and (max-width: $mobile) {
  #app {
    overflow-x: hidden;
  }
}

#app {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  z-index: 1;
}

#main {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: flex-start;
  // margin-top: var(--nav-height);
  // width: 1120px;
  // width: calc(100% - 480px);
  .s-aside {
    flex: 0 0 33%;
  }
  #content {
    overflow: auto;
    max-height: 100vh;
    width: 100%;
    flex: 1;
    padding: 5rem;
  }
}

.full {
  #footer {
    display: none;
  }

  #main {
    margin-top: 0;
  }
}

// @media screen and (max-width: calc(1080px + 2rem)) {
@media screen and (max-width: 1120px) {
  main#main {
    width: 100%;
  }
}
#hsl {
  #background {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    background-repeat: repeat;
    background-attachment: fixed;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: white;
      opacity: 0.1;
    }

    .decorate {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      .decorate-item {
        position: absolute;
        top: 0;
        // width: 2px;
        height: 100%;

        &:first-of-type {
          left: 10%;
          background-image: repeating-linear-gradient(0deg, #c7b3d6, #c7b3d6 2px, white 4px, white 8px);
        }

        &:last-of-type {
          right: 10%;
          background-image: repeating-linear-gradient(0deg, #c7b3d6, #c7b3d6 2px, white 4px, white 8px);
        }

        height: 100%;
        overflow: hidden;
      }
    }
  }
}
</style>