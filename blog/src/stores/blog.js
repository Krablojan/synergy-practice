import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blog', {
  state: () => ({
    currentUser: null,
    users: JSON.parse(localStorage.getItem('blog_users') || '[]'),
    posts: JSON.parse(localStorage.getItem('blog_posts') || '[]'),
    topics: JSON.parse(localStorage.getItem('blog_topics') || '[]')
  }),

  getters: {
    isLoggedIn: (state) => !!state.currentUser,
    publicPosts: (state) => state.posts
      .filter(p => !p.hidden)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    myPosts: (state) => state.posts
      .filter(p => p.author === state.currentUser?.username)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    subscriptionsFeed: (state) => {
      if (!state.currentUser) return []
      const subscriptions = state.users.find(u => u.username === state.currentUser.username)?.subscriptions || []
      return state.posts
        .filter(p => subscriptions.includes(p.author) && !p.hidden)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    },
    allTopics: (state) => state.topics
  },

  actions: {
    saveToStorage() {
      localStorage.setItem('blog_users', JSON.stringify(this.users))
      localStorage.setItem('blog_posts', JSON.stringify(this.posts))
      localStorage.setItem('blog_topics', JSON.stringify(this.topics))
      if (this.currentUser) {
        localStorage.setItem('blog_current_user', JSON.stringify(this.currentUser))
      }
    },

    login(username) {
      this.currentUser = { username }
      this.saveToStorage()
    },

    logout() {
      this.currentUser = null
      localStorage.removeItem('blog_current_user')
    },

    register(username, password) {
      if (this.users.find(u => u.username === username)) return false
      this.users.push({ username, password, subscriptions: [], subscribers: [] })
      this.login(username)
      this.saveToStorage()
      return true
    },

    createPost({ title, content, topic, hidden = false }) {
      if (!this.currentUser) return
      const post = {
        id: Date.now(),
        title,
        content,
        topic: topic || '',
        author: this.currentUser.username,
        hidden,
        timestamp: new Date().toISOString(),
        comments: []
      }
      this.posts.unshift(post)
      if (topic && !this.topics.includes(topic)) {
        this.topics.push(topic)
      }
      this.saveToStorage()
    },

    updatePost(id, { title, content, topic, hidden }) {
      const post = this.posts.find(p => p.id === id)
      if (!post || post.author !== this.currentUser?.username) return false
      post.title = title
      post.content = content
      post.topic = topic || ''
      post.hidden = hidden
      if (topic && !this.topics.includes(topic)) {
        this.topics.push(topic)
      }
      this.saveToStorage()
      return true
    },

    deletePost(id) {
      this.posts = this.posts.filter(p => p.id !== id)
      this.saveToStorage()
    },

    addComment(postId, text) {
      const post = this.posts.find(p => p.id === postId)
      if (!post || !this.currentUser) return
      post.comments.push({
        author: this.currentUser.username,
        text,
        timestamp: new Date().toISOString()
      })
      this.saveToStorage()
    },

    toggleSubscription(targetUsername) {
      if (!this.currentUser || this.currentUser.username === targetUsername) return
      const current = this.users.find(u => u.username === this.currentUser.username)
      const target = this.users.find(u => u.username === targetUsername)
      if (!current || !target) return

      const index = current.subscriptions.indexOf(targetUsername)
      if (index > -1) {
        current.subscriptions.splice(index, 1)
        const targetIndex = target.subscribers.indexOf(this.currentUser.username)
        if (targetIndex > -1) target.subscribers.splice(targetIndex, 1)
      } else {
        current.subscriptions.push(targetUsername)
        target.subscribers.push(this.currentUser.username)
      }
      this.saveToStorage()
    },

    isSubscribed(targetUsername) {
      const current = this.users.find(u => u.username === this.currentUser?.username)
      return current ? current.subscriptions.includes(targetUsername) : false
    },

    loadFromStorage() {
      const user = localStorage.getItem('blog_current_user')
      if (user) this.currentUser = JSON.parse(user)
    }
  }
})