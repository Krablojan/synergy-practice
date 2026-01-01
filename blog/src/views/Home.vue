<template>
  <div>
    <h2 class="text-3xl font-bold mb-4 text-center text-indigo-800">Лента постов</h2>

    <div class="flex space-x-4 mb-8">
      <input v-model="searchQuery" placeholder="Поиск по заголовку и тексту..." class="flex-1" />
      <select v-model="selectedTopic" class="px-4 py-2 border rounded-lg">
        <option value="">Все темы</option>
        <option v-for="topic in allTopics" :key="topic" :value="topic">{{ topic }}</option>
      </select>
    </div>

    <div v-if="filteredPosts.length === 0" class="text-center text-gray-500 text-xl mt-10">
      Нет постов по вашему запросу
    </div>

    <div class="space-y-8">
      <div v-for="post in filteredPosts" :key="post.id" class="post-card">
        <h3 class="text-xl font-bold mb-2">{{ post.title }}</h3>
        <div class="post-meta mb-4">
          Автор: <router-link :to="'/profile/' + post.author" class="text-blue-600 hover:underline">{{ post.author }}</router-link>
          • {{ new Date(post.timestamp).toLocaleDateString('ru-RU') }}
          • Тема: {{ post.topic || 'Без темы' }}
        </div>
        <p class="text-gray-700 mb-4">{{ post.content.substring(0, 200) }}...</p>
        <router-link :to="'/post/' + post.id" class="btn-small" style="background:#2563eb; color:white;">Читать полностью</router-link>
      </div>
    </div>

    <h2 class="text-3xl font-bold mb-4 text-center text-indigo-800 mt-16">Лента подписок</h2>

    <div v-if="subscriptionsFeed.length === 0" class="text-center text-gray-500 text-xl mt-10">
      Подпишитесь на пользователей, чтобы видеть их посты
    </div>

    <div class="space-y-8">
      <div v-for="post in subscriptionsFeed" :key="post.id" class="post-card">
        <h3 class="text-xl font-bold mb-2">{{ post.title }}</h3>
        <div class="post-meta mb-4">
          Автор: {{ post.author }}
          • {{ new Date(post.timestamp).toLocaleDateString('ru-RU') }}
          • Тема: {{ post.topic || 'Без темы' }}
        </div>
        <p class="text-gray-700 mb-4">{{ post.content.substring(0, 200) }}...</p>
        <router-link :to="'/post/' + post.id" class="btn-small" style="background:#2563eb; color:white;">Читать полностью</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useBlogStore } from '../stores/blog'

export default {
  setup() {
    const store = useBlogStore()
    const searchQuery = ref('')
    const selectedTopic = ref('')

    const filteredPosts = computed(() => {
      let posts = store.publicPosts
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        posts = posts.filter(p => p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query))
      }
      if (selectedTopic.value) {
        posts = posts.filter(p => p.topic === selectedTopic.value)
      }
      return posts
    })

    return {
      filteredPosts,
      subscriptionsFeed: store.subscriptionsFeed,
      allTopics: store.allTopics,
      searchQuery,
      selectedTopic
    }
  }
}
</script>