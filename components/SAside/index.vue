<template lang="pug">
.s-aside(:class='{ "show-menu": showMenu }')
  .menu-btn(@click='showMenu = !showMenu')
    SIcon(name='menu')
  .left
    .left-content
      .title {{ navigation.title }}
      //- .title
        span.letter__wrapper(v-for="char in navigation.title.toLowerCase()" )
          .letter(:class="char")
      //-  {{ navigation.title }}
      .subtitle {{ navigation.subtitle }}

      .introduction
        .blockquote
          SIcon.quote-left(name='quote')
          .quote-content(v-text='hitokoto.content', :data-from='hitokoto.from')
          SIcon.quote-right(name='quote')
      //- nav.nav
        ul.nav-menu
          li.nav-item(v-for='item in navigation.nav', :key='item.name', :class='{ active: item.to == $route.path }' @click="$router.push(item.to)")
            SIcon(:name='item.icon')
            .nav-name {{ item.name }}
            .nav-underline

      nav.nav-external(@click='onNavClick')
        ul.nav-external-links
          li.nav-link(v-for='item in navigation.nav', :key='item.name', :class='{ active: item.to == $route.path }', @click='$router.push(item.to)')
            SIcon(:name='item.icon')
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
      .decorate-border
        .decorate-main-dotrect
          .decorate-dotrect
          .decorate-dotrect
          .decorate-dotrect
          .decorate-dotrect

  .right
    .right-scroll-content
      slot
    //- .decorate-border
      .decorate-main-dotrect
        .decorate-dotrect
        .decorate-dotrect
        .decorate-dotrect
        .decorate-dotrect
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
  }),
  computed: {
    ...mapState(useMainStore, ['navigation', 'isMobile']),
  },
  watch: {
    $route: {
      handle(nv, ov) {
        console.log(nv)
      },
    },
  },
  methods: {
    onNavClick() {
      this.showMenu = !this.showMenu
    },
  },
  async mounted() {
    try {
      this.hitokoto.content = this.navigation.introduction
      this.hitokoto.from = this.navigation.introductionFrom
      if (this.$cfg.hitokotoAPI) {
        const response = await (await fetch(this.$cfg.hitokotoAPI)).json()
        if (response && response.hitokoto && response.from) {
          this.hitokoto.content = response.hitokoto
          this.hitokoto.from = 'ᅳᅳ' + response.from
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

.s-aside {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  height: 100vh;
  .left {
    flex: 0 0 30%;
    .left-content {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 30vw;
      transition: 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
      z-index: 9;
    }
  }
  .right {
    flex: 1;
    position: relative;
    height: 100vh;
    .right-scroll-content {
      overflow: scroll;
      height: 100%;
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
      position: absolute;
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
    &.show-menu .left-content {
      transform: translateX(0%);
      width: 100vw;
      opacity: 1;
    }
  }
}
</style>