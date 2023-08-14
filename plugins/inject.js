import config from '@/config'

export default ({ app }, inject) => {
  // 静态资源位置
  inject('config', config)
  inject('src', config.resource) 
}
