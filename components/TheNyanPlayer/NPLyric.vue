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
  transform: translateY(-50%);
  writing-mode: vertical-lr;
  letter-spacing: .25rem;
  font-weight: 300;
  font-family: serif;
  color: hsla(330, 60%, 80%, 1)
  // left: 50%; 
  // top: 50%; 
  // transform: translate(-50%, -50%);
}
</style>