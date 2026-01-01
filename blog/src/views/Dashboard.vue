<template>
  <div class="card">
    <h2 class="text-3xl font-bold mb-10 text-center text-indigo-800">Создать новый пост</h2>

    <form @submit.prevent="createPost" class="space-y-6 mb-12">
      <input v-model="title" placeholder="Заголовок поста" required />
      <textarea v-model="content" placeholder="Текст поста" rows="8" required></textarea>
      <input v-model="topic" placeholder="Тема (необязательно)" />

      <!-- Большая красивая галочка с правильным выравниванием -->
      <div class="flex items-center space-x-4 mb-10">
        <input 
          type="checkbox" 
          v-model="hidden" 
          id="hidden-checkbox" 
          class="w-8 h-8 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-4 cursor-pointer transition-all"
        />
        <label for="hidden-checkbox" class="text-xl text-gray-700 cursor-pointer select-none font-medium">
          Скрытый пост (видим только мне)
        </label>
      </div>

      <button type="submit" class="btn-primary text-xl py-4">Опубликовать пост</button>
    </form>

    <h3 class="text-2xl font-bold mb-8 text-indigo-800">Мои посты ({{ myPosts.length }})</h3>

    <div v-if="myPosts.length === 0" class="text-center text-gray-500 text-xl py-16 bg-gray-50 rounded-xl">
      У вас пока нет постов. Создайте первый выше ↑
    </div>

    <!-- Каждый пост в отдельной карточке с сильной тенью -->
    <div v-for="post in myPosts" :key="post.id" class="post-card mb-10 p-8">
      <h4 class="text-2xl font-bold mb-4 text-gray-900">{{ post.title }}</h4>
      <div class="post-meta mb-6 text-gray-600">
        <span class="font-medium">{{ new Date(post.timestamp).toLocaleString('ru-RU') }}</span>
        <span class="mx-2">•</span>
        <span>Тема: {{ post.topic || 'Без темы' }}</span>
        <span class="mx-2">•</span>
        <span class="font-medium">{{ post.hidden ? '🔒 Скрытый' : '🌐 Публичный' }}</span>
      </div>
      <p class="text-gray-800 mb-8 leading-relaxed text-lg">{{ post.content }}</p>
      <div class="flex space-x-6">
        <button @click="editPost(post)" class="px-8 py-4 rounded-xl font-bold text-white transition transform hover:scale-105 shadow-lg" style="background:#10b981;">
          Редактировать
        </button>
        <button @click="deletePost(post.id)" class="px-8 py-4 rounded-xl font-bold text-white transition transform hover:scale-105 shadow-lg" style="background:#ef4444;">
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useBlogStore } from '../stores/blog'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useBlogStore()
    const router = useRouter()

    if (!store.isLoggedIn) {
      router.push('/login')
    }

    const title = ref('')
    const content = ref('')
    const topic = ref('')
    const hidden = ref(false)

    const createPost = () => {
      if (!title.value.trim() || !content.value.trim()) {
        alert('Заполните заголовок и текст поста!')
        return
      }

      store.createPost({
        title: title.value,
        content: content.value,
        topic: topic.value,
        hidden: hidden.value
      })

      title.value = ''
      content.value = ''
      topic.value = ''
      hidden.value = false

      alert('Пост успешно опубликован! 🎉')
    }

    const editPost = (post) => {
      const newTitle = prompt('Новый заголовок', post.title)
      if (newTitle === null) return
      const newContent = prompt('Новый текст', post.content)
      if (newContent === null) return
      const newTopic = prompt('Новая тема', post.topic)
      const newHidden = confirm('Сделать пост скрытым?')

      store.updatePost(post.id, {
        title: newTitle || post.title,
        content: newContent || post.content,
        topic: newTopic || '',
        hidden: newHidden
      })

      alert('Пост обновлён!')
    }

    const deletePost = (id) => {
      if (confirm('Удалить пост навсегда?')) {
        store.deletePost(id)
        alert('Пост удалён')
      }
    }

    return {
      myPosts: store.myPosts,
      title,
      content,
      topic,
      hidden,
      createPost,
      editPost,
      deletePost
    }
  }
}
</script>

<style scoped>
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}

.space-x-6 > * + * {
  margin-left: 1.5rem;
}
</style>