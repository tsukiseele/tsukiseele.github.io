import * as timeago from 'timeago.js'
import util from '@/utils/util'

export default defineNuxtPlugin(nuxtApp => {
  util()
  return {
    provide: {
      util: {
        /**
         * 格式化日期，过去式
         */
        formatTimeAgo: (time) => {
          const ago = timeago.format(new Date(time), "zh_CN");
          const num = parseInt(ago, 10);
          return num ? ago.replace(/[\d\s]+/, num.toChineseNumber()) : ago;
        },
        /**
         * 格式化时间
         */
        formatDate: (date, format) => {
          if (date) {
            date = date instanceof Date ? date : new Date(date);
            if (format) {
              return date.format(format);
            } else {
              return date.format("yyyy-MM-dd hh:mm:ss");
            }
          }
        }
      }
    }
  }
})