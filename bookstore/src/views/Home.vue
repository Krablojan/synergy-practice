<template>
  <div class="card text-center py-16">
    <h2 class="text-4xl font-bold mb-8 text-indigo-800">Книжный магазин</h2>
    <p class="text-xl text-gray-700 mb-10">
      Просматривайте каталог, арендуйте книги на срок и управляйте библиотекой.
    </p>

    <div class="space-x-6">
      <router-link to="/books" class="btn-primary inline-block px-10 py-4 text-xl">
        Перейти в каталог книг
      </router-link>

      <router-link v-if="isAdmin" to="/admin" class="btn-primary inline-block px-10 py-4 text-xl" style="background:#dc2626;">
        Админ-панель
      </router-link>
    </div>

    <p class="mt-12 text-gray-600">
      Войдите как <strong>admin / admin</strong> для доступа к админке
    </p>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useBookStore } from '../stores/book'

export default {
  setup() {
    const store = useBookStore()
    return {
      isAdmin: computed(() => store.isAdmin)
    }
  }
}
</script>