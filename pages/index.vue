<script setup lang="ts">
// passing 'to' as a string
await navigateTo('/post/1')

// // ... or as a route object
// await navigateTo({ path: '/search' })

// // ... or as a route object with query parameters
// await navigateTo({
//   path: '/search',
//   query: {
//     page: 1,
//     sort: 'asc'
//   }
// })
</script>