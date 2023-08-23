import { defineStore } from 'pinia'
import { useLocalStorage } from "@vueuse/core"
import { formatPost, formatJson, formatGallery, formatTimeline, formatPage } from '@/plugins/utils/format.js'
import config from '@/config.js'

export const useMainStore = defineStore('main', {
  state: () => ({
    archive: useLocalStorage('archive', {
      page: 0,
      totalCount: 0,
      items: [],
      currentItem: {},
    }),
    clientWidth: 0,
    scroll: { pos: 0, change: 0 },
    images: [],
    inspiration: [],
    about: {},
    friends: [],
    projects: [],
    labels: [],
    categorys: null,
    timeline: [],
    experience: null,
    navigation: config.nav,
  }),
  getters: {
    breakpoints(state, size) {
      const breakpoints = {
        tablet: 760,
        mobile: 480,
      }
      return breakpoints[size] && breakpoints[size] < state.clientWidth
    },
    isMobile(state) {
      return state.clientWidth < 768
    },
  }
  ,
  mutations: {
    archive(state, args) {
      args instanceof Array ? (state.archive[args[0]] = args[1]) : (state.archive = args)
    },
  },
  actions: {
    /**
     * 获取与
     * @param {Context} context 上下文
     * @param {Object} params 分页参数
     * @returns {Array<Archive>} 文章列表
     */
    async getArchives({ page, count }) {
      if (this.archive.page === page) return
      const app = useNuxtApp()
      const result = await app.$service.getArchives({ page, count })
      if (result) {
        const totalCount = result.total_count
        this.archive = { page, totalCount, items: result.items.map((item) => formatPost(item)), currentItem: null }
      }
    },
    /**
     * 通过id获取文章
     * @param {Context} context 上下文
     * @param {Object} id 文章id
     */
    async getArchive({ id }) {
      // 先从缓存里面找
      if (this.archive.items) {
        this.archive.currentItem = this.archive.items.find((item) => item.id == id)
      } else {
        // 如果没有找到就请求
        const app = useNuxtApp()
        this.archive.currentItem = archive || formatPost(await app.$service.getArchiveById(id))
      }
      console.log(this.archive.currentItem);
      return this.archive.currentItem
    },
    /**
     *
     * @param {*} param0
     * @returns
     */
    async getImages() {
      if (this.images.length > 0) return
      const app = useNuxtApp()
      this.images = [].concat(...(await app.$service.getArchives({ page: 1, count: 99 })).map((item) => formatGallery(item))).slice(0, 20)
    },
    /**
     * 获取时间线
     * @param {*} param0
     * @returns
     */
    async getTimeline() {
      if (this.timeline.length) return
      const app = useNuxtApp()
      const timeline = formatTimeline(await app.$service.getArchives({ page: 1, count: 99 }))
      this.timeline = timeline
    },
    /**
     * 获取标签列表
     * @param {Context} context 上下文
     */
    async getLabels() {
      if (this.labels.length) return
      // 如果没有找到就请求
      const app = useNuxtApp()
      this.labels = await app.$service.getLabels()
    },
    /**
     * 获取分类列表
     * @param {Context} context 上下文
     */
    async getCategorys() {
      if (this.categorys) return
      const app = useNuxtApp()
      this.categorys = await app.$service.getMilestones()
    },
    /**
     *
     * @param {*} param0
     * @param {*} param1
     */
    async getInspiration({ page, count }) {
      const app = useNuxtApp()
      this.inspiration = formatInspiration(await app.$service.getInspiration({ page, count }))
    },
    /**
     * 获取关于
     * @param {*} param0
     */
    async getAbout() {
      if (this.about.length) return
      const app = useNuxtApp()
      const about = await app.$service.getPage('about')
      if (about && about[0]) {
        this.about = formatPage(about[0], 'about')
      }
    },
    /**
     * 获取友链
     */
    async getFriends() {
      if (this.friends) return
      const app = useNuxtApp()
      const friends = await app.$service.getPage('friend')
      if (friends && friends[0]) {
        this.friends = formatPage(friends[0], 'friend')
      }
    },
    /**
     * 获取项目
     */
    async getProjects() {
      if (this.projects.length) return
      const app = useNuxtApp()
      const projects = (await Promise.all([app.$service.getPage('projects'), app.$service.getPage('websites')])).map(item => item[0])
      this.projects = projects.map((item) => {
        const name = item.title.toLowerCase()
        return { name, items: formatPage(item, item.title.toLowerCase()) }
      })
    },
    /**
     *
     * @param {*} param0
     * @returns
     */
    async getExperience() {
      if (this.experience) return
      const app = useNuxtApp()
      const experience = await app.$service.getPage('experience')
      if (experience && experience[0]) {
        this.experience = formatJson(experience[0])
      }
    },
  }
})