<template>
  <div class="card">
    <router-link to="/feed" class="text-blue-600 hover:underline mb-6 block font-medium">
      ← Вернуться к ленте
    </router-link>

    <h2 class="text-3xl font-bold mb-6 text-gray-900">{{ entry?.title || 'Запись не найдена' }}</h2>

    <p class="text-gray-600 mb-8">
      Автор: {{ entry.author }} • {{ new Date(entry.date).toLocaleDateString('ru-RU') }}
    </p>

    <p class="text-gray-800 text-lg leading-relaxed mb-10">{{ entry.description }}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
      <div>
        <p class="font-medium text-gray-700 text-xl">Стоимость:</p>
        <p class="text-3xl font-bold text-indigo-600">{{ entry.cost }} руб.</p>
      </div>

      <div v-if="entry.location">
        <p class="font-medium text-gray-700 text-xl">Местоположение:</p>
        <p class="text-lg">Широта: {{ entry.location.lat.toFixed(6) }}</p>
        <p class="text-lg">Долгота: {{ entry.location.lng.toFixed(6) }}</p>
        <p v-if="entry.location.address" class="text-lg mt-2 text-gray-600">{{ entry.location.address }}</p>
      </div>
    </div>

    <img v-if="entry.image" :src="entry.image" alt="Фото путешествия" class="entry-image" />

    <div class="mt-12 text-center">
      <router-link to="/feed" class="btn-primary inline-block px-10 py-4">
        Вернуться к ленте
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTravelStore } from '../stores/travel'

export default {
  setup() {
    const store = useTravelStore()
    const route = useRoute()

    const entryId = parseInt(route.params.id)
    const entry = computed(() => store.entries.find(e => e.id === entryId))

    return {
      entry
    }
  }
}
</script>