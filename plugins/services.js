import { Base64 } from 'js-base64';
import config from '@/config.js'

const token = config.token
const owner = config.blog.owner
const repository = config.blog.repository

export default defineNuxtPlugin(nuxtApp => {
  // useFetch.defaults.headers.common['Authorization'] = `token ${Buffer.from(token, 'base64').toString('ascii')}`
  // useFetch.defaults.baseURL = `https://api.github.com/repos/${owner}/${repository}`;
  const TOKEN = `token ${Base64.decode(token)}`
  const BASE_URL = `https://api.github.com/repos/${owner}/${repository}`
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
        async getPage(type) {
          const upperType = type.replace(/^\S/, s => s.toUpperCase())
          const {data} = await useFetch(`/issues?state=closed&labels=${upperType}`, {
            baseURL: BASE_URL,
            headers: {
              'Authorization': TOKEN
            }
          })
          console.log('RESP: ', data.value);
          return data.value
        },
        getInspiration({ page, count }) {
          return useFetch(`/issues?state=closed&labels=inspiration&page=${page}&per_page=${count}`,
            { baseURL: BASE_URL })
        },
      }
    }
  }
})
