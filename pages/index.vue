<template lang="pug">
#content
  .title(data-aos="fade-down" data-aos-delay="300") {{ navigation.title }}
  //- .title
  //- span.letter__wrapper(v-for="char in navigation.title.toLowerCase()" )
  //-   .letter(:class="char")
  //-  {{ navigation.title }}
  .subtitle(data-aos="fade-down" data-aos-delay="300") {{ navigation.subtitle }}

  div.introduction(data-aos="fade-right" data-aos-delay="600")
    .blockquote
      SIcon(name='quote').quote-left
      .quote-content(v-text="hitokoto.content" :data-from="hitokoto.from")
      SIcon(name='quote').quote-right
  nav.nav
    ul.nav-menu
      li.nav-item(v-for='item in navigation.nav', :key='item.name', :class='{ active: item.to == $route.path }' @click="$router.push(item.to)")
        SIcon(:name='item.icon')
        .nav-name {{ item.name }}
        .nav-underline
  ul.nav-links
    li.nav-link-item(v-for='item in navigation.links', :key='item.name')
      .item__bg
      a(:href='item.to', target='_blank')
        SIcon(:name='item.icon')
  .decorate-ferris-wheel
    .decorate-item
    .decorate-item
    .decorate-item
  .decorate-side
    .decorate-item(:data-theme-background="$cfg.sideTheme")
    .decorate-item(:data-theme-background="$cfg.sideTheme")
  .decorate
    .decorate-item(v-for='char in navigation.decorateText' :data-content="char") {{ char }}
  //- .decorate-burst-12
  //-   .burst-12
  //-   .burst-12
  //-   .burst-12
  //-   .burst-12
  //-   .burst-12
  //-   .burst-12
  
</template>

<script>
import { mapState } from 'pinia'
import { useMainStore } from '~/store/index'

export default {
  data: () => ({
    hitokoto: {
      content: '',
      from: '',
    }
  }),
  computed: {
    ...mapState(useMainStore, ['navigation', 'isMobile']),
  },
  methods: {},
  async mounted() {
    console.log(this.$service);
    console.log(this.$cfg);
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
      console.log(`Hitikito failed to load. throw: ${error}`)
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
</style>
