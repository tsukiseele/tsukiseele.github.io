<template lang="pug">
.s-aside(:class='{ "show-menu": showMenu, homepage: isHomePage }')
  .menu-btn(@click='showMenu = !showMenu')
    SIcon(name='menu')
  .left
    .left-content
      .content-main
        .title {{ navigation.title }}
        .subtitle {{ navigation.subtitle }}
        .hitokoto(v-text='hitokoto.content', :data-from='hitokoto.from')
        //- .introduction
          .blockquote
            SIcon.quote-left(name='quote')
            .quote-content(v-text='hitokoto.content', :data-from='hitokoto.from')
            SIcon.quote-right(name='quote')
        //- nav.nav
          ul.nav-blocks
            li.nav-block(v-for='item in navigation.nav', :key='item.name', :class='{ active: item.to == $route.path }', @click='$router.push(item.to)')
              SIcon(:name='item.icon')
              //- .nav-name {{ item.name }}
              //- .nav-underline
        ul.nav-links
          li.nav-link-item(v-for='item in navigation.links', :key='item.name')
            .item__bg
            a(:href='item.to', target='_blank')
              SIcon(:name='item.icon')
        nav.nav-external(@click='onNavClick')
          ul.nav-external-links
            li.nav-link(v-for='item in navigation.nav', :key='item.name', :class='{ active: item.to == $route.path }', @click='$router.push(item.to)')
              SIcon(:name='item.icon')

        .progress(v-if='!showMenu', :style='{ "--progress": scrollRatio }')
      .decorate-border
        //- .decorate-main-dotrect
          .decorate-dotrect
          .decorate-dotrect
          .decorate-dotrect
          .decorate-dotrect
      //- .decorate-ferris-wheel
        .decorate-item
        .decorate-item
        .decorate-item
      //- .decorate-side
        .decorate-item(:data-theme-background="$cfg.sideTheme")
        .decorate-item(:data-theme-background="$cfg.sideTheme")
      //- .decorate
        .decorate-item(v-for='char in navigation.decorateText', :data-content='char') {{ char }}
      .triangle
  .right
    .right-scroll-content
      slot
</template>

<script>
import { mapState } from 'pinia'
import { useMainStore } from '@/stores/index'

export default {
  data: () => ({
    hitokoto: {
      content: '',
      from: '',
    },
    showMenu: false,
    isHomePage: false,
    windowTop: 0,
    scrollRatio: 0,
  }),
  computed: {
    ...mapState(useMainStore, ['navigation', 'isMobile']),
  },
  watch: {
    // '$route.path'(nv, ov) {
    //   this.isHomePage = nv == '/'
    // },
    showMenu(nv, ov) {
      document.body.className = nv ? 'hide-scrollbar' : ''
    },
  },
  methods: {
    onNavClick() {
      this.showMenu = !this.showMenu
    },
    onScroll(e) {
      this.windowTop = window.top.scrollY /* or: e.target.documentElement.scrollTop */
      this.scrollRatio = this.windowTop / (document.body.clientHeight - window.innerHeight)
    },
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  async mounted() {
    try {
      window.addEventListener('scroll', this.onScroll)
      this.hitokoto.content = this.navigation.introduction
      this.hitokoto.from = this.navigation.introductionFrom
      if (this.$cfg.hitokotoAPI) {
        const response = await (await fetch(this.$cfg.hitokotoAPI)).json()
        if (response && response.hitokoto && response.from) {
          this.hitokoto.content = response.hitokoto
          // this.hitokoto.from = 'ᅳᅳ' + response.from
          this.hitokoto.from = response.from
        }
      }
    } catch (error) {
      console.log(`Hitokoto failed to load. throw: ${error}`)
    }

    // document.querySelectorAll('.burst-12').forEach((el) => {
    //   el.style.left = `${Math.random() * 80 + 10}%`
    //   el.style.top = `${Math.random() * 80 + 10}%`
    // })
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';
.progress {
  margin: 2rem 0;
  position: relative;
  width: 50%;
  height: 2rem;
  border-radius: 1rem;
  // background-color: white;
  border: 0.25rem solid white;
  &::before {
    border-radius: 1rem;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: calc(100% - 100% * var(--progress));
    margin: 0.25rem;
    background-color: white;
    transition: 0.3s ease;
  }
}
// .triangle {
//   --angle: 250deg;
//   --color: #b97fad; //hsla(192, 40%, 20%, 1);
//   position: absolute;
//   right: 0;
//   bottom: 75%;
//   left: 0;
//   top: 0;
//   background-image: linear-gradient(calc(-90deg + var(--angle)), var(--color) calc(50% - 1px), transparent 50%);
//   z-index: -1;
// }
.s-aside {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  --aside-left-width: 65vh;
  --aside-left-min-width: 3 0rem;
  .left {
    flex: 0 0 var(--aside-left-width);
    min-width: var(--aside-left-min-width);
    .left-content {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--aside-left-width);
      min-width: var(--aside-left-min-width);
      display: flex;
      flex-direction: row;
      height: 100vh;
      padding: 5rem;
      transition: 0.3s ease;
      z-index: 9;
      overflow: hidden;
      --margin: 2rem;
      --margin-hover: 2.5rem;

      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 4rem;
        height: 4rem;
        opacity: 0;
        transition: 0.25s ease;
      }
      &::before {
        left: var(--margin);
        top: var(--margin);
        border-top: 0.25rem dashed wheat;
        border-left: 0.25rem dashed wheat;
      }
      &::after {
        right: var(--margin);
        bottom: var(--margin);
        border-bottom: 0.25rem dashed wheat;
        border-right: 0.25rem dashed wheat;
      }
      &:hover {
        &::before,
        &::after {
          opacity: 1;
        }
        &::before {
          left: var(--margin-hover);
          top: var(--margin-hover);
        }
        &::after {
          right: var(--margin-hover);
          bottom: var(--margin-hover);
        }
      }
      // &::after {
      //   content: '';
      //   position: absolute;
      //   top: 0;
      //   left: -3rem;
      //   width: calc(100% + 3rem);
      //   height: 1.8rem;
      //   background-image: radial-gradient(circle, #2a2b3d, #2a2b3d calc(2rem - 1px), transparent 2rem);
      //   background-size: calc(3rem) calc(4rem);
      //   background-position: bottom center;
      //   background-repeat: repeat-x;
      // animation: wave-move 6s linear infinite;
      // @keyframes wave-move {
      //   0% {
      //     transform: translateX(0);
      //   }
      //   100% {
      //     transform: translateX(3rem);
      //   }
      // }
      // }
      .content-main {
        align-self: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
      }
    }
  }
  &.homepage {
    .left {
      .left-content {
        transform: translateX(0%);
        width: 100vw;
        opacity: 1;
        .content-main {
          flex: 0 0 calc(30vw - 10rem);
        }
      }
    }
  }
  .right {
    flex: 1;
    position: relative;
    .right-scroll-content {
      // overflow: auto;
    }
  }
  .menu-btn {
    display: none;
    font-size: 2rem;
  }
}
@media screen and (max-width: 1120px) {
  .s-aside {
    .left {
      flex: 0;
      .left-content {
        opacity: 0;
        transform: translateX(-100%);
      }
    }
    .menu-btn {
      display: flex;
      position: fixed;
      left: 0;
      top: 0;
      width: 3rem;
      height: 3rem;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      border-radius: 0.5rem;
      z-index: 10;
      transition: 0.25s cubic-bezier(0.075, 0.82, 0.165, 1);
      cursor: pointer;
      user-select: none;
      &:hover {
        background-color: hsla(330, 30%, 60%, 1);
      }
    }
    &.show-menu {
      .left-content {
        transform: translateX(0%);
        width: 100vw;
        opacity: 1;
      }

      // .right {
      //   max-height: 100vh;
      //   overflow: hidden;
      // }
    }
  }
}
</style>