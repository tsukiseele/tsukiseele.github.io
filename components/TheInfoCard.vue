<template lang="pug">
.info-card.card
  SImage.card-icon(:src="icon")
  .card-title Nyarray
  .card-alias (aka TsukiSeele)
  hr
  .card-info Cuteness is justice
  .card-links
    a.normal(href="https://github.com/tsukiseele", target="_brank") 
      SIcon(name='github')
      //- i.mdi.mdi-github(aria-hidden="true")
    a.normal(href="https://twitter.com/tsukiseele", target="_brank") 
      SIcon(name='twitter')
      //- i.mdi.mdi-twitter(aria-hidden="true")
    a.normal(href="mailto:tsukiseele@gmail.com") 
      SIcon(name='mail')
      //- i.mdi.mdi-envelope(aria-hidden="true", style="font-size: 1.15em")
</template>

<script>
export default {
  props: {
    icon: String
  },
  data: () => ({}),
  computed: {},
  mounted() {}
};
</script>

<style lang="scss" scoped>


@media screen and (max-width: $mobile) {
  .card-icon {
    height: 6rem;
    width: 6rem;
  }
}
.info-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--color-card);
  // border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: var(--shadow);
  .card-icon {
    object-fit: cover;
    height: 6.7rem;
    width: 6.7rem;
    margin: 0.5rem;
    border-radius: 50%;
    transition: transform 0.5s;
    &:hover {
      transform: rotate(360deg);
    }
  }

  .card-title {
    font-size: 1.5rem;
    font-weight: normal;
    font-family: InfoDisplay;
    color: var(--color-text-primary);
  }

  .card-alias {
    font-size: 1rem;
    font-weight: normal;
    font-family: InfoDisplay;
    color: var(--color-text-primary);
    margin-top: -.5rem;
  }
  .card-info {
    color: var(--color-text-secondary);
    font-family: InfoDisplay;
    padding: 0 0 1rem 0;
  }

  .card-links {
    color: var(--color-text);
    cursor: pointer;  
    a {
      padding: 0 1rem;
    }
  }
}
</style>
