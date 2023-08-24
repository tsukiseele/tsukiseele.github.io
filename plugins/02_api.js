import { useGhFetch } from "@/composables/useGhFetch"

export default defineNuxtPlugin(nuxtApp => {
  const owner = nuxtApp.$cfg.blog.owner
  const repository = nuxtApp.$cfg.blog.repository
  return {
    provide: {
      api: {
        async getArchives({ page, count }) {
          const { data } = await useGhFetch(`https://api.github.com/search/issues?q=repo:${owner}/${repository}+type:issue+state:open&page=${page}&per_page=${count}`)
          return data.value
          // return $axios.$get(`/issues`, {
          //   params: {
          //     page: page,
          //     per_page: count,
          //     state: 'open'
          //   }
          // })
        },
        async getArchiveById(id) {
          const { data } = await useGhFetch(`/issues/${id}?state=open`)
          return data.value
        },
        async getLabels() {
          const { data } = await useGhFetch(`/labels`)
          return data.value
        },
        async getMilestones() {
          const { data } = await useGhFetch(`/milestones`)
          return data.value
        },
        async getPage(type) {
          const upperType = type.replace(/^\S/, s => s.toUpperCase())
          const { data } = await useGhFetch(`/issues?state=closed&labels=${upperType}`)
          return data.value
        },
        async getInspiration({ page, count }) {
          const { data } = await useGhFetch(`/issues?state=closed&labels=inspiration&page=${page}&per_page=${count}`)
          return data.value
        },
      }
    }
  }
})
