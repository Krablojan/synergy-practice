<template>
  <div>
    <h2 class="text-3xl font-bold mb-8 text-center text-indigo-800">Каталог книг</h2>

    <div class="flex flex-wrap gap-4 mb-10">
      <input v-model="searchQuery" placeholder="Поиск по названию или автору..." class="flex-1 min-w-64" />

      <select v-model="sortBy" class="px-4 py-2 border rounded-lg">
        <option value="">Без сортировки</option>
        <option value="category">По категории</option>
        <option value="author">По автору</option>
        <option value="year">По году</option>
      </select>
    </div>

    <!-- Список книг -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="book in filteredBooks" :key="book.id" class="book-card">
        <h3 class="text-xl font-bold mb-3 text-gray-900">{{ book.title }}</h3>
        <div class="post-meta mb-4 text-gray-600">
          Автор: {{ book.author }}<br>
          Год: {{ book.year }} • Категория: {{ book.category }}<br>
          Цена: {{ book.price }} руб.
        </div>

        <div v-if="book.available" class="flex flex-wrap gap-3">
          <button @click="rentBook(book.id, '2weeks')" class="btn-small" style="background:#10b981; color:white;">
            Аренда 2 недели
          </button>
          <button @click="rentBook(book.id, 'month')" class="btn-small" style="background:#3b82f6; color:white;">
            Аренда 1 месяц
          </button>
          <button @click="rentBook(book.id, '3months')" class="btn-small" style="background:#7c3aed; color:white;">
            Аренда 3 месяца
          </button>
        </div>

        <p v-else class="text-red-600 font-bold text-lg">
          Книга арендована
        </p>
      </div>
    </div>

    <div v-if="filteredBooks.length === 0" class="text-center text-gray-500 text-xl py-12">
      Книг по вашему запросу не найдено
    </div>

    <!-- Мои аренды -->
    <h3 class="text-2xl font-bold mt-16 mb-6 text-indigo-800">Мои арендованные книги</h3>

    <div v-if="userRentals.length === 0" class="text-center text-gray-500 text-xl py-10 bg-gray-50 rounded-xl">
      У вас нет арендованных книг
    </div>

    <div v-else class="space-y-6">
      <div v-for="rental in userRentals" :key="rental.bookId" class="book-card">
        <h4 class="text-xl font-bold mb-2">{{ getBookTitle(rental.bookId) }}</h4>
        <p class="text-gray-600">
          Аренда на: {{ rental.period === '2weeks' ? '2 недели' : rental.period === 'month' ? '1 месяц' : '3 месяца' }}<br>
          Дата окончания: {{ new Date(rental.end).toLocaleDateString('ru-RU') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useBookStore } from '../stores/book'

export default {
  setup() {
    const store = useBookStore()

    const searchQuery = ref('')
    const sortBy = ref('')

    const filteredBooks = computed(() => {
      let books = store.availableBooks

      // Поиск
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        books = books.filter(book => 
          book.title.toLowerCase().includes(query) || 
          book.author.toLowerCase().includes(query)
        )
      }

      // Сортировка
      if (sortBy.value) {
        books = [...books]
        if (sortBy.value === 'category') {
          books.sort((a, b) => a.category.localeCompare(b.category))
        } else if (sortBy.value === 'author') {
          books.sort((a, b) => a.author.localeCompare(b.author))
        } else if (sortBy.value === 'year') {
          books.sort((a, b) => a.year - b.year)
        }
      }

      return books
    })

    const userRentals = computed(() => store.rentals.filter(r => r.user === store.currentUser?.username))

    const getBookTitle = (bookId) => {
      const book = store.books.find(b => b.id === bookId)
      return book ? book.title : 'Неизвестная книга'
    }

    const rentBook = (bookId, period) => {
      store.rentBook(bookId, period)
    }

    return {
      filteredBooks,
      userRentals,
      searchQuery,
      sortBy,
      getBookTitle,
      rentBook
    }
  }
}
</script>

<style scoped>
.grid {
  display: grid;
}
@media (min-width: 768px) {
  .md\\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .lg\\:grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}
.gap-8 {
  gap: 2rem;
}
.space-y-6 > * + * {
  margin-top: 1.5rem;
}
</style>