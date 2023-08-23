import { useMainStore } from '@/store/index.js'

export default defineNuxtPlugin(({ $pinia }) => {
  // watch($pinia.state, (state) => {
  //   localStorage.setItem('state', JSON.stringify(state)
  // }, { deep: true })
  return {
    provide: {
      store: useMainStore($pinia)
    }
  }
})