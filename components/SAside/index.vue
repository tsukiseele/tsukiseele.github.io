<template lang="pug">
.s-aside(:class='{ "show-menu": showMenu, homepage: isHomePage }')
  .menu-btn(@click='showMenu = !showMenu')
    SIcon(name='menu')
  .left
    .left-content
      .content-main
        .title {{ navigation.title }}
        .subtitle {{ navigation.subtitle }}
        .introduction
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
      .content-expand
        p Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      .decorate-border
        .decorate-main-dotrect
          .decorate-dotrect
          .decorate-dotrect
          .decorate-dotrect
          .decorate-dotrect
      //- .decorate-ferris-wheel
        .decorate-item
        .decorate-item
        .decorate-item
      //- .decorate-side
      //-   .decorate-item(:data-theme-background="$cfg.sideTheme")
      //-   .decorate-item(:data-theme-background="$cfg.sideTheme")
      .decorate
        .decorate-item(v-for='char in navigation.decorateText' :data-content="char") {{ char }}
      .triangle
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
    isHomePage: false,
  }),
  computed: {
    ...mapState(useMainStore, ['navigation', 'isMobile']),
  },
  watch: {
    '$route.path'(nv, ov) {
      this.isHomePage = nv == '/'
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

  height: 100vh;
  .left {
    flex: 0 0 30%;
    .left-content {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: 30vw;
      display: flex;
      flex-direction: row;
      height: 100vh;
      padding: 5rem;
      transition: 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
      z-index: 9;
      .content-main {
        align-self: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
      }
      .content-expand {
        display: none;
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
        .content-expand {
          flex: 1;
          display: flex;
          position: relative;
          flex-direction: column;
          // box-sizing: content-box;
          &::before {
            content: '';
            position: absolute;
            left: -1rem;
            top: 10%;
            bottom: 10%;
            transform: translateX(-100%);

            border-left: 0.25rem dashed white;
            // border-right: 0.25rem dashed white;
          }
        }
      }
    }
  }
  .right {
    flex: 1;
    position: relative;
    height: 100vh;
    .right-scroll-content {
      // overflow: auto;
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
    &.show-menu .left-content {
      transform: translateX(0%);
      width: 100vw;
      opacity: 1;
    }
  }
}
</style>