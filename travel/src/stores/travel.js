import { defineStore } from 'pinia'

export const useTravelStore = defineStore('travel', {
  state: () => ({
    currentUser: null,
    users: JSON.parse(localStorage.getItem('travel_users') || '[]'),
    entries: JSON.parse(localStorage.getItem('travel_entries') || '[]')
  }),

  getters: {
    isLoggedIn: (state) => !!state.currentUser,
    myEntries: (state) => state.entries
      .filter(e => e.author === state.currentUser?.username)
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
    publicEntries: (state) => state.entries
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  },

  actions: {
    save() {
      localStorage.setItem('travel_users', JSON.stringify(this.users))
      localStorage.setItem('travel_entries', JSON.stringify(this.entries))
      if (this.currentUser) {
        localStorage.setItem('travel_current_user', JSON.stringify(this.currentUser))
      }
    },

    login(username, password) {
      const user = this.users.find(u => u.username === username && u.password === password)
      if (user) {
        this.currentUser = { username }
        this.save()
        return true
      }
      return false
    },

    register(username, password) {
      if (this.users.find(u => u.username === username)) return false
      this.users.push({ username, password })
      this.login(username, password)
      this.save()
      return true
    },

    logout() {
      this.currentUser = null
      localStorage.removeItem('travel_current_user')
    },

    createEntry(entry) {
      if (!this.currentUser) return
      entry.id = Date.now()
      entry.author = this.currentUser.username
      entry.date = new Date().toISOString()
      this.entries.unshift(entry)
      this.save()
    },

    load() {
      const saved = localStorage.getItem('travel_current_user')
      if (saved) this.currentUser = JSON.parse(saved)
    }
  }
})