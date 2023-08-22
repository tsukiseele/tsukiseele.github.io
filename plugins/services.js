import config from '@/config.js'

const token = config.token
const owner = config.blog.owner
const repository = config.blog.repository

export default defineNuxtPlugin(nuxtApp => {
  // useFetch.defaults.headers.common['Authorization'] = `token ${Buffer.from(token, 'base64').toString('ascii')}`
  // useFetch.defaults.baseURL = `https://api.github.com/repos/${owner}/${repository}`;

  return {
    provide: {
      service: {
        getArchives({ page, count }) {
          return $fetch(`https://api.github.com/search/issues?q=repo:${owner}/${repository}+type:issue+state:open&page=${page}&per_page=${count}`)
          // return $axios.$get(`/issues`, {
          //   params: {
          //     page: page,
          //     per_page: count,
          //     state: 'open'
          //   }
          // })
        },
        getArchiveById(id) {
          return $fetch(`/issues/${id}?state=open`)
        },
        getLabels() {
          return $fetch(`/labels`)
        },
        getMilestones() {
          return $fetch(`/milestones`)
        },
        getPage(type) {
          const upperType = type.replace(/^\S/, s => s.toUpperCase())
          return $fetch(`/issues?state=closed&labels=${upperType}`)
        },
        getInspiration({ page, count }) {
          return $fetch(`/issues?state=closed&labels=inspiration&page=${page}&per_page=${count}`)
        },
      }
    }
  }
})
