<template>
  <div class="card">
    <h2 class="text-3xl font-bold mb-10 text-center text-indigo-800">Админ-панель</h2>

    <!-- Форма добавления книги -->
    <div class="mb-16">
      <h3 class="text-2xl font-bold mb-6 text-gray-800">Добавить новую книгу</h3>

      <form @submit.prevent="addBook" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input v-model="newBook.title" placeholder="Название книги" required />
        <input v-model="newBook.author" placeholder="Автор" required />
        <input v-model="newBook.category" placeholder="Категория" required />
        <input v-model.number="newBook.year" type="number" placeholder="Год издания" required />
        <input v-model.number="newBook.price" type="number" placeholder="Цена (руб.)" required />
        <div class="md:col-span-2">
          <button type="submit" class="btn-primary">Добавить книгу в каталог</button>
        </div>
      </form>
    </div>

    <!-- Кнопка проверки сроков аренды -->
    <div class="mb-10 text-center">
      <button @click="checkOverdue" class="btn-primary px-10 py-4 text-xl" style="background:#dc2626;">
        Проверить сроки аренды и освободить просроченные книги
      </button>
    </div>

    <!-- Список всех книг с управлением -->
    <h3 class="text-2xl font-bold mb-8 text-gray-800">Управление книгами ({{ books.length }})</h3>

    <div v-if="books.length === 0" class="text-center text-gray-500 text-xl py-12 bg-gray-50 rounded-xl">
      В каталоге пока нет книг
    </div>

    <div class="space-y-10">
      <div v-for="book in books" :key="book.id" class="book-card">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h4 class="text-2xl font-bold mb-3 text-gray-900">{{ book.title }}</h4>
            <div class="post-meta mb-4 text-gray-600">
              Автор: {{ book.author }} • Год: {{ book.year }} • Категория: {{ book.category }}<br>
              Цена: {{ book.price }} руб. • Статус: {{ book.available ? 'Доступна' : 'Арендована' }}
            </div>
          </div>

          <div class="flex space-x-4">
            <button @click="editBook(book)" class="px-6 py-3 rounded-xl font-bold text-white transition hover:opacity-90" style="background:#10b981;">
              Редактировать
            </button>
            <button @click="deleteBook(book.id)" class="px-6 py-3 rounded-xl font-bold text-white transition hover:opacity-90" style="background:#ef4444;">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useBookStore } from '../stores/book'

export default {
  setup() {
    const store = useBookStore()

    // Защита: только админ
    if (!store.isAdmin) {
      alert('Доступ запрещён! Только для администратора.')
      return {}
    }

    const newBook = ref({
      title: '',
      author: '',
      category: '',
      year: '',
      price: ''
    })

    const addBook = () => {
      if (!newBook.value.title || !newBook.value.author || !newBook.value.category || !newBook.value.year || !newBook.value.price) {
        alert('Заполните все поля!')
        return
      }

      store.addBook({
        title: newBook.value.title,
        author: newBook.value.author,
        category: newBook.value.category,
        year: Number(newBook.value.year),
        price: Number(newBook.value.price)
      })

      // Очистка формы
      newBook.value = { title: '', author: '', category: '', year: '', price: '' }
      alert('Книга успешно добавлена в каталог!')
    }

    const editBook = (book) => {
      const title = prompt('Новое название', book.title)
      if (title === null) return
      const author = prompt('Новый автор', book.author)
      if (author === null) return
      const category = prompt('Новая категория', book.category)
      if (category === null) return
      const year = prompt('Новый год', book.year)
      if (year === null) return
      const price = prompt('Новая цена', book.price)
      if (price === null) return
      const available = confirm('Книга доступна для аренды? (ОК — да, Отмена — нет)')

      store.updateBook(book.id, {
        title: title || book.title,
        author: author || book.author,
        category: category || book.category,
        year: year ? Number(year) : book.year,
        price: price ? Number(price) : book.price,
        available: available
      })

      alert('Книга обновлена!')
    }

    const deleteBook = (id) => {
      if (confirm('Удалить книгу из каталога навсегда?')) {
        store.deleteBook(id)
        alert('Книга удалена')
      }
    }

    const checkOverdue = () => {
      store.checkOverdue()
      alert('Проверка завершена. Просроченные книги освобождены.')
    }

    return {
      books: store.books,
      newBook,
      addBook,
      editBook,
      deleteBook,
      checkOverdue
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
.space-y-10 > * + * {
  margin-top: 2.5rem;
}
</style>