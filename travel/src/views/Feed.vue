<template>
  <div>
    <h2 class="text-3xl font-bold mb-10 text-center text-indigo-800">Все записи о путешествиях</h2>

    <div v-if="publicEntries.length === 0" class="text-center text-gray-500 text-xl py-16 bg-gray-50 rounded-xl">
      Пока нет записей о путешествиях. Создайте первую в личном кабинете!
    </div>

    <div class="space-y-12">
      <div v-for="entry in publicEntries" :key="entry.id" class="entry-card">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-2xl font-bold mb-2 text-gray-900">{{ entry.title }}</h3>
            <p class="text-gray-600">
              Автор: {{ entry.author }} • {{ new Date(entry.date).toLocaleDateString('ru-RU') }}
            </p>
          </div>
        </div>

        <p class="text-gray-800 text-lg leading-relaxed mb-8">{{ entry.description }}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <p class="font-medium text-gray-700">Стоимость поездки:</p>
            <p class="text-2xl font-bold text-indigo-600">{{ entry.cost }} руб.</p>
          </div>

          <div v-if="entry.location">
            <p class="font-medium text-gray-700">Местоположение:</p>
            <p>Широта: {{ entry.location.lat.toFixed(6) }}</p>
            <p>Долгота: {{ entry.location.lng.toFixed(6) }}</p>
            <p v-if="entry.location.address" class="mt-2 text-gray-600">{{ entry.location.address }}</p>
          </div>
        </div>

        <img v-if="entry.image" :src="entry.image" alt="Фото из путешествия" class="entry-image" />

        <div class="mt-8 text-right">
          <router-link :to="'/entry/' + entry.id" class="btn-primary inline-block px-8 py-4">
            Подробно посмотреть запись
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
      publicEntries: store.publicEntries
    }
  }
}
</script>