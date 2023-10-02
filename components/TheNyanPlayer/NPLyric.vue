<template lang="pug">
.np-lyric {{ getCurrentLyricLine(lyrics, timestamp) }}

</template>

<script>
export default defineComponent({
  props: ['lyrics', 'timestamp'],
  methods: {
    getCurrentLyricLine(lyrics, timestamp) {
      if (!lyrics) return
      console.log(lyrics);
      const index =  this.syncLyric(lyrics, timestamp)
      const currentLrc = lyrics[index] ? lyrics[index].text : ''
      return currentLrc
    },
    // lyrics (Array) - output from parseLyric function
    // time (Number) - current time from audio player
    syncLyric(lyrics, time) {
      const scores = [];

      lyrics.forEach(lyric => {
        // get the gap or distance or we call it score
        const score = time - lyric.time;
        // only accept score with positive values
        if (score >= 0) scores.push(score);
      });

      if (scores.length == 0) return null;

      // get the smallest value from scores
      const closest = Math.min(...scores);

      // return the index of closest lyric
      return scores.indexOf(closest);
    }
  }
})

</script>

<style lang="scss" scoped>
.np-lyric {
  position: fixed;
  top: 50%;
  right: 0;
  padding: .5rem .25rem;
  transform: translateY(-50%);
  writing-mode: vertical-lr;
  letter-spacing: .25rem;
  font-weight: 300;
  font-family: serif;
  color: hsla(330, 60%, 70%, 1);
  background-color: hsla(330, 0%, 100%, .75);
  box-shadow: 0 0 8px hsla(330, 0%, 100%, .5);
  border-radius: 0.5rem;
  // -webkit-text-stroke: 1px hsla(330, 60%, 80%, 1);
}
</style>