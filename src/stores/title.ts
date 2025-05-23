import { defineStore } from 'pinia'

export const useTitleStore = defineStore('title', {
  state: () => ({
    currentTitle: ''
  }),
  actions: {
    setTitle(title:any) {
      this.currentTitle = title
    }
  }
})
