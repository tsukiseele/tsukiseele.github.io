import config from '@/config'

// export default ({ app }, inject) => {
//   // 静态资源位置
//   inject('config', config)
//   inject('src', config.resource) 
// }
export default defineNuxtPlugin(nuxtApp => {
  // now available on `nuxtApp.$injected`
  // nuxtApp.provide('injected', () => 'my injected function')

  // You can alternatively use this format, which comes with automatic type support
  return {
    provide: {
      cfg: config,
      src: config.resource
    }
  }
})