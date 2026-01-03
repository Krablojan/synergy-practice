<template>
  <div class="card">
    <h2 class="text-3xl font-bold mb-10 text-center text-indigo-800">Создать новую запись о путешествии</h2>

    <form @submit.prevent="createEntry" class="space-y-6">
      <input v-model="title" placeholder="Название поездки (например, 'Поездка в Париж')" required />

      <textarea v-model="description" placeholder="Описание путешествия, впечатления..." rows="8" required></textarea>

      <input v-model.number="cost" type="number" placeholder="Стоимость поездки (руб.)" min="0" required />

      <!-- Геопозиция -->
      <div class="space-y-4">
        <button type="button" @click="getLocation" class="btn-primary" style="background:#10b981;">
          Определить моё местоположение
        </button>

        <div v-if="location.lat && location.lng" class="bg-green-50 p-4 rounded-xl">
          <p class="font-medium text-green-800">Местоположение определено:</p>
          <p>Широта: {{ location.lat.toFixed(6) }}</p>
          <p>Долгота: {{ location.lng.toFixed(6) }}</p>
          <p v-if="location.address" class="mt-2">Адрес: {{ location.address }}</p>
        </div>

        <p v-if="locationError" class="text-red-600">{{ locationError }}</p>
      </div>

      <!-- Загрузка изображения -->
      <div class="space-y-4">
        <label class="block text-lg font-medium text-gray-700">Фотография места</label>
        <input type="file" @change="onFileChange" accept="image/*" class="mb-4" />

        <div v-if="imagePreview" class="mt-4">
          <img :src="imagePreview" alt="Превью" class="entry-image" />
        </div>
      </div>

      <button type="submit" class="btn-primary text-xl py-4">
        Сохранить запись о путешествии
      </button>
    </form>

    <h3 class="text-2xl font-bold mt-16 mb-8 text-indigo-800">Мои записи ({{ myEntries.length }})</h3>

    <div v-if="myEntries.length === 0" class="text-center text-gray-500 text-xl py-12 bg-gray-50 rounded-xl">
      У вас пока нет записей. Создайте первую выше ↑
    </div>

    <div class="space-y-10">
      <div v-for="entry in myEntries" :key="entry.id" class="entry-card">
        <h4 class="text-2xl font-bold mb-4 text-gray-900">{{ entry.title }}</h4>

        <p class="text-gray-700 mb-6 leading-relaxed">{{ entry.description }}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p class="font-medium">Стоимость: {{ entry.cost }} руб.</p>
            <p class="font-medium mt-2">Дата: {{ new Date(entry.date).toLocaleDateString('ru-RU') }}</p>
          </div>

          <div v-if="entry.location">
            <p class="font-medium">Местоположение:</p>
            <p>Широта: {{ entry.location.lat.toFixed(6) }}</p>
            <p>Долгота: {{ entry.location.lng.toFixed(6) }}</p>
            <p v-if="entry.location.address" class="mt-1">{{ entry.location.address }}</p>
          </div>
        </div>

        <img v-if="entry.image" :src="entry.image" alt="Фото путешествия" class="entry-image" />

        <div class="mt-6 text-right">
          <button @click="deleteEntry(entry.id)" class="btn-small" style="background:#ef4444; color:white;">
            Удалить запись
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useTravelStore } from '../stores/travel'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useTravelStore()
    const router = useRouter()

    if (!store.isLoggedIn) {
      router.push('/login')
    }

    const title = ref('')
    const description = ref('')
    const cost = ref('')
    const location = ref({ lat: null, lng: null, address: '' })
    const locationError = ref('')
    const imagePreview = ref('')
    const imageData = ref('')

    const getLocation = () => {
      if (!navigator.geolocation) {
        locationError.value = 'Геолокация не поддерживается вашим браузером'
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          location.value.lat = position.coords.latitude
          location.value.lng = position.coords.longitude
          locationError.value = ''

          // Простой reverse geocoding через Nominatim (бесплатно)
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            .then(res => res.json())
            .then(data => {
              location.value.address = data.display_name || 'Адрес не найден'
            })
            .catch(() => {
              location.value.address = 'Не удалось определить адрес'
            })
        },
        (error) => {
          locationError.value = 'Не удалось получить местоположение. Разрешите доступ к геолокации.'
        }
      )
    }

    const onFileChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          imagePreview.value = event.target.result
          imageData.value = event.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const createEntry = () => {
      if (!title.value.trim() || !description.value.trim() || !cost.value) {
        alert('Заполните все обязательные поля!')
        return
      }

      store.createEntry({
        title: title.value,
        description: description.value,
        cost: Number(cost.value),
        location: location.value.lat ? location.value : null,
        image: imageData.value || null
      })

      // Очистка формы
      title.value = ''
      description.value = ''
      cost.value = ''
      location.value = { lat: null, lng: null, address: '' }
      imagePreview.value = ''
      imageData.value = ''
      locationError.value = ''

      alert('Запись о путешествии сохранена! 🌍')
    }

    const deleteEntry = (id) => {
      if (confirm('Удалить запись о путешествии?')) {
        store.entries = store.entries.filter(e => e.id !== id)
        store.save()
        alert('Запись удалена')
      }
    }

    return {
      myEntries: store.myEntries,
      title,
      description,
      cost,
      location,
      locationError,
      imagePreview,
      getLocation,
      onFileChange,
      createEntry,
      deleteEntry
    }
  }
}
</script>

<style scoped>
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.space-y-10 > * + * {
  margin-top: 2.5rem;
}
</style>