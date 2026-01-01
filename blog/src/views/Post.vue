<template>
  <div class="card">
    <router-link to="/" class="text-blue-600 hover:underline mb-6 block font-medium">
      ← Вернуться на главную
    </router-link>

    <h2 class="text-3xl font-bold mb-6 text-gray-900">{{ post?.title || 'Пост не найден' }}</h2>

    <div class="post-meta mb-8 text-gray-600">
      Автор: <router-link :to="'/profile/' + post.author" class="text-blue-600 hover:underline font-medium">
        {{ post.author }}
      </router-link>
      • {{ new Date(post.timestamp).toLocaleString('ru-RU') }}
      • Тема: {{ post.topic || 'Без темы' }}
      • {{ post.hidden ? '🔒 Скрытый' : '🌐 Публичный' }}
    </div>

    <div class="text-gray-800 text-lg leading-relaxed mb-12 whitespace-pre-wrap">
      {{ post.content }}
    </div>

    <h3 class="text-2xl font-bold mb-6 text-indigo-800">Комментарии ({{ post.comments.length }})</h3>

    <div v-if="post.comments.length === 0" class="text-center text-gray-500 text-xl py-10 bg-gray-50 rounded-xl mb-8">
      Комментариев пока нет. Напишите первый!
    </div>

    <div v-else class="space-y-6 mb-12">
      <div v-for="comment in post.comments" :key="comment.timestamp" class="comment-card">
        <div class="post-meta mb-3">
          <span class="font-medium">{{ comment.author }}</span>
          • {{ new Date(comment.timestamp).toLocaleString('ru-RU') }}
        </div>
        <p class="text-gray-700 leading-relaxed">{{ comment.text }}</p>
      </div>
    </div>

    <div class="comment-form">
      <h4 class="text-xl font-bold mb-4 text-indigo-800">Добавить комментарий</h4>
      <textarea v-model="commentText" placeholder="Ваш комментарий..." rows="5" required class="mb-6"></textarea>
      <button @click="addComment" class="btn-primary">Отправить комментарий</button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '../stores/blog'

export default {
  setup() {
    const store = useBlogStore()
    const route = useRoute()
    const router = useRouter()

    const postId = parseInt(route.params.id)
    const post = computed(() => store.posts.find(p => p.id === postId))

    if (!post.value) {
      alert('Пост не найден!')
      router.push('/')
      return {}
    }

    const commentText = ref('')

    const addComment = () => {
      if (!commentText.value.trim()) {
        alert('Комментарий не может быть пустым')
        return
      }

      store.addComment(postId, commentText.value)
      commentText.value = ''
      alert('Комментарий добавлен!')
    }

    return {
      post,
      commentText,
      addComment
    }
  }
}
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>