<template lang="pug">
.post-item(@click="$router.push(to)" :style="backgroundColor")
  .post-item-inner 
    <svg class="bowtie" fill="currentColor" viewBox="0 0 48.94 37.62"><path d="M47.35,2.88l-.09-.29c-.38-1.19-1.36-2.06-2.55-2.27-.62-.11-1.26-.04-1.84,.2-5.88,2.37-11.29,5.64-16.09,9.73l-1.82,1.55-2.79-1.99C17.2,6.24,11.82,3.16,6.21,.66c-.9-.4-1.92-.41-2.8-.02-.88,.39-1.54,1.14-1.83,2.07C-.34,8.91,.35,15.75,3.5,21.46l.34,.6c.77,1.47,2.53,2.13,4.1,1.52l6.22-2.38c.94-.36,1.87-.78,2.74-1.23l4.21-1.97c-3.36,5.87-7.63,11.16-12.69,15.74l-.45,.4c-.74,.67-.79,1.81-.1,2.54,.35,.36,.84,.58,1.35,.58,.46,0,.9-.17,1.24-.48l.44-.4c5.69-5.15,10.42-11.15,14.07-17.83,2.46,5.66,6.68,12.98,13.41,17.97,.39,.29,.87,.41,1.36,.35,.49-.07,.91-.31,1.21-.7,.3-.38,.42-.85,.35-1.33-.07-.47-.32-.89-.71-1.18-5.71-4.24-9.47-10.44-11.75-15.39,4.05,2.1,8.32,3.8,12.71,5.06l.08,.02c1.71,.49,3.5-.36,4.17-1.96,.97-2.32,1.74-4.74,2.27-7.2,.28-1.28,.42-2.59,.42-3.89,0-2.52-.39-5.01-1.16-7.41v-.02Zm-4.86,16.97c-4.99-1.44-9.8-3.48-14.29-6.05l.97-.83c4.39-3.73,9.32-6.75,14.69-8.96,.65,2.04,.97,4.15,.97,6.29,0,1.05-.11,2.11-.34,3.14-.47,2.18-1.15,4.33-2,6.4h0Zm-35.57,.27l-.19-.36c-2.63-4.77-3.25-10.47-1.73-15.68,5.28,2.38,10.32,5.28,14.99,8.65l1.54,1.1-6.25,2.92s-.06,.03-.07,.03c-.78,.41-1.59,.76-2.41,1.08l-5.88,2.25v.02Z"></path></svg>
    .item-cover-box(v-if="cover")
      SImage.item-cover(:src="cover")
    .item-info 
      .item-title {{ title }}
      span.item-preview {{ description }}
      //- ul.item-labels
        li.item-label
          SChip(:text="$util.formatTimeAgo(date)", icon="event_note")
        li.item-label(v-for="(label, i) in labels", :key="i")
          SChip(:text="label.name", icon="sell")
    //- .item-category 
      //- i.category-icon.material-icons bookmark
      SIcon(name=)
      span.category-text {{ category ? category.title : '未分类' }}
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    cover: {
      type: String,
      default: null,
    },
    date: {
      type: String,
      default: null,
    },
    labels: {
      type: Array,
      default: () => [],
    },
    category: {
      type: Object,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    backgroundColor: null,
  }),
  methods: {
    getColor(src) {
      return new Promise((resolve, reject) => {
        const colorThief = new ColorThief()
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.src = src
        if (img.complete) {
          resolve([colorThief.getColor(img), ...colorThief.getPalette(img)])
        } else {
          img.addEventListener('load', () => resolve([colorThief.getColor(img), ...colorThief.getPalette(img)]))
          img.addEventListener('error', () => reject('Image failed to load'))
        }
      })
    },
  },
  async mounted() {
    /*
    try {
      const [dominant, palette1, palette2, palette3] = await this.getColor(this.cover)
      this.backgroundColor = { backgroundColor: `rgba(${dominant[0]}, ${dominant[1]}, ${dominant[2]}, .33)` }
    } catch (error) {
      console.log(error)
    }*/
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
