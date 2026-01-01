<template>
  <div class="card">
    <router-link to="/" class="text-blue-600 hover:underline mb-6 block font-medium">
      ← Вернуться на главную
    </router-link>

    <div class="flex items-center justify-between mb-10">
      <h2 class="text-3xl font-bold text-indigo-800">Профиль {{ username }}</h2>

      <button 
        @click="toggleSubscription" 
        class="btn-primary px-8 py-4 text-xl"
        :disabled="isOwnProfile"
      >
        {{ isSubscribed ? 'Отписаться' : 'Подписаться' }}
      </button>
    </div>

    <p v-if="isOwnProfile" class="text-gray-600 mb-8 text-lg">
      Это ваш профиль. Здесь отображаются только ваши публичные посты.
    </p>

    <h3 class="text-2xl font-bold mb-8 text-indigo-800">Публичные посты ({{ userPosts.length }})</h3>

    <div v-if="userPosts.length === 0" class="text-center text-gray-500 text-xl py-12 bg-gray-50 rounded-xl">
      У этого пользователя нет публичных постов
    </div>

    <div class="space-y-10">
      <div v-for="post in userPosts" :key="post.id" class="post-card">
        <h4 class="text-xl font-bold mb-3">{{ post.title }}</h4>
        <div class="post-meta mb-4">
          {{ new Date(post.timestamp).toLocaleDateString('ru-RU') }} • Тема: {{ post.topic || 'Без темы' }}
        </div>
        <p class="text-gray-700 mb-6 leading-relaxed">{{ post.content.substring(0, 250) }}...</p>
        <router-link :to="'/post/' + post.id" class="btn-small px-6 py-3" style="background:#2563eb; color:white;">
          Читать полностью
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '../stores/blog'

export default {
  setup() {
    const store = useBlogStore()
    const route = useRoute()
    const username = route.params.username

    const currentUsername = computed(() => store.currentUser?.username)

    const isOwnProfile = computed(() => currentUsername.value === username)

    const userPosts = computed(() => 
      store.posts
        .filter(p => p.author === username && !p.hidden)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    )

    const isSubscribed = computed(() => store.isSubscribed(username))

    const toggleSubscription = () => {
      if (isOwnProfile.value) {
        alert('Нельзя подписаться на самого себя!')
        return
      }

      if (!store.isLoggedIn) {
        alert('Войдите в аккаунт, чтобы подписаться')
        return
      }

      const wasSubscribed = isSubscribed.value
      store.toggleSubscription(username)

      // Теперь показываем правильный алерт после действия
      if (wasSubscribed) {
        alert('Вы успешно отписались от пользователя ' + username)
      } else {
        alert('Вы успешно подписались на пользователя ' + username + '!')
      }
    }

    return {
      username,
      userPosts,
      isSubscribed,
      isOwnProfile,
      toggleSubscription
    }
  }
}
</script>