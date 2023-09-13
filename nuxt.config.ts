// https://nuxt.com/docs/api/configuration/nuxt-config
import config from './config.js'

export default defineNuxtConfig({
  // server: {
  //   host: process.env.BASE_HOST || '0.0.0.0',
  //   port: process.env.BASE_PORT || 3000,
  // },
  //  router: {
  //   mode: process.env.MODE && process.env.MODE == 'static' ? 'hash' : 'history'
  // },
  ssr: false,//!(process.env.MODE && process.env.MODE == 'static'),
  // target: process.env.MODE && process.env.MODE.toLocaleLowerCase() == 'static' ? 'static' : 'server',
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
    },
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  app: {
    head: {
      title: config.title,
      htmlAttrs: {
        lang: 'zh-CN',
      },
      meta: config.meta,
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        {
          rel: 'stylesheet',
          type: 'text/css',
          href: '//cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css',
        },
        {
          rel: 'stylesheet',
          type: 'text/css',
          // href: '//cdn.jsdelivr.net/npm/@mdi/font@6.5.95/css/materialdesignicons.min.css',
          href: '//fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0',
        },
      ],
      script: [
        {
          src: '//cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js',
        },
      ]
    },
  },
  // Global CSS
  css: ['ress', '~/assets/styles/main.scss'],

  // Plugins to run before rendering page
  // plugins: [
  //   '~/plugins/inject.js',
  //   '~/plugins/api.js',
  //   '~/plugins/util.js',
  //   // '~/plugins/utils/filter.js',
  //   '~/plugins/ascii.client.js',
  //   '~/plugins/markdown-renderer.client.js',
  //   '~/plugins/lib-aos.client.js',
  //   // '~/plugins/lib-aplayer.client.js',
  //   // '~/plugins/lib-vssue.client.js',
  // ],

  // Auto import components
  components: true,

  modules: ['@pinia/nuxt'],
  // pinia: {
  //   autoImports: [
  //     // automatically imports `defineStore`
  //     'defineMainStore', // import { defineStore } from 'pinia'
  //   ],
  // },
  imports: {
    dirs: ['stores'],
  },
  devtools: { enabled: true },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "sass:math"; @import "@/assets/styles/global.scss";',
        },
      },
    },
  },
})
