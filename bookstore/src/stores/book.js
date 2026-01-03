import { defineStore } from 'pinia'

export const useBookStore = defineStore('bookstore', {
state: () => ({
  currentUser: null,
  users: JSON.parse(localStorage.getItem('bookstore_users') || '[{"username":"admin","password":"admin","role":"admin"}]'),
  books: JSON.parse(localStorage.getItem('bookstore_books') || JSON.stringify([
    {
      id: 1,
      title: "1984",
      author: "Джордж Орвелл",
      category: "Антиутопия",
      year: 1949,
      price: 450,
      available: true
    },
    {
      id: 2,
      title: "Мастер и Маргарита",
      author: "Михаил Булгаков",
      category: "Классика",
      year: 1967,
      price: 550,
      available: true
    },
    {
      id: 3,
      title: "Гарри Поттер и философский камень",
      author: "Дж. К. Роулинг",
      category: "Фэнтези",
      year: 1997,
      price: 600,
      available: true
    },
    {
      id: 4,
      title: "Преступление и наказание",
      author: "Фёдор Достоевский",
      category: "Классика",
      year: 1866,
      price: 500,
      available: true
    },
    {
      id: 5,
      title: "Война и мир",
      author: "Лев Толстой",
      category: "Классика",
      year: 1869,
      price: 800,
      available: true
    },
    {
      id: 6,
      title: "Sapiens: Краткая история человечества",
      author: "Юваль Ной Харари",
      category: "Нон-фикшн",
      year: 2011,
      price: 700,
      available: true
    },
    {
      id: 7,
      title: "Атомные привычки",
      author: "Джеймс Клир",
      category: "Саморазвитие",
      year: 2018,
      price: 650,
      available: true
    }
  ])),
  rentals: JSON.parse(localStorage.getItem('bookstore_rentals') || '[]')
}),

  getters: {
    isLoggedIn: (state) => !!state.currentUser,
    isAdmin: (state) => state.currentUser?.role === 'admin',
    availableBooks: (state) => state.books.filter(b => b.available)
  },

  actions: {
    save() {
      localStorage.setItem('bookstore_users', JSON.stringify(this.users))
      localStorage.setItem('bookstore_books', JSON.stringify(this.books))
      localStorage.setItem('bookstore_rentals', JSON.stringify(this.rentals))
      if (this.currentUser) {
        localStorage.setItem('bookstore_current_user', JSON.stringify(this.currentUser))
      }
    },

    login(username, password) {
      const user = this.users.find(u => u.username === username && u.password === password)
      if (user) {
        this.currentUser = { username: user.username, role: user.role }
        this.save()
        return true
      }
      return false
    },

    logout() {
      this.currentUser = null
      localStorage.removeItem('bookstore_current_user')
    },

    register(username, password) {
      if (this.users.find(u => u.username === username)) return false
      this.users.push({ username, password, role: 'user' })
      this.login(username, password)
      this.save()
      return true
    },

    addBook(book) {
      if (!this.isAdmin) return
      book.id = Date.now()
      book.available = true
      this.books.push(book)
      this.save()
    },

    updateBook(id, updates) {
      if (!this.isAdmin) return
      const book = this.books.find(b => b.id === id)
      if (book) Object.assign(book, updates)
      this.save()
    },

    deleteBook(id) {
      if (!this.isAdmin) return
      this.books = this.books.filter(b => b.id !== id)
      this.save()
    },

    rentBook(bookId, period) {
      if (!this.isLoggedIn || this.isAdmin) return
      const book = this.books.find(b => b.id === bookId && b.available)
      if (!book) return

      const days = { '2weeks': 14, 'month': 30, '3months': 90 }
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + days[period])

      this.rentals.push({
        user: this.currentUser.username,
        bookId,
        period,
        start: new Date().toISOString(),
        end: endDate.toISOString()
      })

      book.available = false
      this.save()
      alert(`Книга арендована до ${endDate.toLocaleDateString('ru-RU')}`)
    },

    checkOverdue() {
      if (!this.isAdmin) return
      const now = new Date()
      this.rentals = this.rentals.filter(r => {
        if (new Date(r.end) < now) {
          const book = this.books.find(b => b.id === r.bookId)
          if (book) book.available = true
          alert(`Напоминание: у пользователя ${r.user} истёк срок аренды книги ID ${r.bookId}`)
          return false
        }
        return true
      })
      this.save()
    },

    load() {
      const saved = localStorage.getItem('bookstore_current_user')
      if (saved) this.currentUser = JSON.parse(saved)
    }
  }
})