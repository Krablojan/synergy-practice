<template>
  <div class="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-xl">
    <h2 class="text-3xl font-bold text-center mb-8">{{ isRegister ? 'Регистрация' : 'Вход' }}</h2>

    <form @submit.prevent="handleSubmit">
      <input
        type="text"
        v-model="username"
        placeholder="Имя пользователя"
        class="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="password"
        v-model="password"
        placeholder="Пароль"
        class="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition"
      >
        {{ isRegister ? 'Зарегистрироваться' : 'Войти' }}
      </button>
    </form>

    <p class="mt-6 text-center">
      {{ isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?' }}
      <button @click="toggleMode" class="text-blue-600 hover:underline font-medium">
        {{ isRegister ? 'Войти' : 'Зарегистрироваться' }}
      </button>
    </p>

    <p v-if="error" class="text-red-500 text-center mt-4">{{ error }}</p>
  </div>
</template>

<script>
import { useBlogStore } from '../stores/blog'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useBlogStore()
    const router = useRouter()

    return {
      store,
      router
    }
  },
  data() {
    return {
      username: '',
      password: '',
      isRegister: false,
      error: ''
    }
  },
  methods: {
    toggleMode() {
      this.isRegister = !this.isRegister
      this.error = ''
    },
    handleSubmit() {
      if (this.isRegister) {
        const success = this.store.register(this.username, this.password)
        if (success) {
          this.router.push('/')
        } else {
          this.error = 'Пользователь с таким именем уже существует'
        }
      } else {
        const users = this.store.users
        const user = users.find(u => u.username === this.username && u.password === this.password)
        if (user) {
          this.store.login(this.username)
          this.router.push('/')
        } else {
          this.error = 'Неверное имя пользователя или пароль'
        }
      }
    }
  }
}
</script>