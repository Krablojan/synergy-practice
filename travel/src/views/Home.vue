<template>
  <div>
    <h2 class="text-4xl font-bold mb-12 text-center text-indigo-800">Дневник путешествий</h2>

    <div class="text-center mb-12">
      <router-link v-if="isLoggedIn" to="/dashboard" class="btn-primary text-xl py-4 px-10">
        + Добавить новую запись
      </router-link>

      <router-link v-else to="/login" class="btn-primary text-xl py-4 px-10">
        Войти, чтобы создать запись
      </router-link>
    </div>

    <div v-if="publicEntries.length === 0" class="text-center text-gray-500 text-2xl py-20 bg-gray-50 rounded-2xl">
      Записей пока нет. Создайте первую!
    </div>

    <div class="space-y-12">
      <div v-for="entry in publicEntries" :key="entry.id" class="entry-card">
        <div class="flex justify-between items-start mb-8">
          <div>
            <h3 class="text-3xl font-bold mb-4 text-gray-900">{{ entry.title }}</h3>
            <p class="text-lg text-gray-600">
              Автор: {{ entry.author }} • {{ new Date(entry.date).toLocaleDateString('ru-RU') }}
            </p>
          </div>
        </div>

        <p class="text-xl text-gray-800 leading-relaxed mb-10">{{ entry.description }}</p>

        <div class="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <p class="text-lg font-medium text-gray-700">Стоимость путешествия:</p>
            <p class="text-3xl font-bold text-indigo-600">{{ entry.cost }} руб.</p>
          </div>

          <div v-if="entry.location">
            <p class="text-lg font-medium text-gray-700">Местоположение:</p>
            <p class="text-lg">Широта: {{ entry.location.lat.toFixed(6) }}</p>
            <p class="text-lg">Долгота: {{ entry.location.lng.toFixed(6) }}</p>
            <p v-if="entry.location.address" class="text-lg mt-2 text-gray-600">{{ entry.location.address }}</p>
          </div>
        </div>

        <img v-if="entry.image" :src="entry.image" alt="Фото путешествия" class="entry-image" />

        <div class="text-center mt-10">
          <router-link :to="'/entry/' + entry.id" class="btn-primary text-xl py-4 px-12">
            Подробнее о путешествии
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useTravelStore } from '../stores/travel'

export default {
  setup() {
    const store = useTravelStore()

    return {
      publicEntries: store.publicEntries,
      isLoggedIn: store.isLoggedIn
    }
  }
}
</script>