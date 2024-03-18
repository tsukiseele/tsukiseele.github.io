<template lang="pug">
.s-giscus-comment.card
  giscus-widget(
    id="comments"
    repo="tsukiseele/comment"
    repoid="MDEwOlJlcG9zaXRvcnk0MDA3NzMwMjA="
    category="Announcements"
    categoryid="DIC_kwDOF-NPnM4CeDlA"
    mapping="specific"
    term="Welcome to giscus!"
    reactionsenabled="1"
    emitmetadata="0"
    inputposition="top"
    theme="light"
    lang="zh-CN"
    loading="lazy")
</template>

<script>

export default {

}
</script>

<style lang="scss" scoped>
.s-giscus-comment {
  background-color: white;
  margin: 1rem;
  border-radius: .5rem;
  
}
giscus-widget {
  display: flex;
  width: auto;
  padding: 1rem;
  background-color: transparent;
}

</style>
