<template>
  <div class="card">
    <h2 class="text-3xl font-bold mb-10 text-center text-indigo-800">
      {{ isRegister ? 'Регистрация' : 'Вход в аккаунт' }}
    </h2>

    <form @submit.prevent="handleAuth" class="space-y-6">
      <input v-model="username" placeholder="Имя пользователя" required />
      <input v-model="password" type="password" placeholder="Пароль" required />

      <button type="submit" class="btn-primary">
        {{ isRegister ? 'Зарегистрироваться' : 'Войти' }}
      </button>
    </form>

    <div class="text-center mt-8">
      <button @click="isRegister = !isRegister" class="text-blue-600 hover:underline font-medium">
        {{ isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться' }}
      </button>
    </div>

    <div class="mt-8 p-4 bg-blue-50 rounded-lg text-center">
      <p class="text-sm text-gray-600">Для администратора:</p>
      <p class="font-medium">Логин: admin<br>Пароль: admin</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useBookStore } from '../stores/book'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useBookStore()
    const router = useRouter()

    const username = ref('')
    const password = ref('')
    const isRegister = ref(false)

    const handleAuth = () => {
      if (isRegister.value) {
        if (store.register(username.value, password.value)) {
          alert('Регистрация успешна! Добро пожаловать!')
          router.push('/books')
        } else {
          alert('Пользователь с таким именем уже существует')
        }
      } else {
        if (store.login(username.value, password.value)) {
          alert('Добро пожаловать!')
          router.push('/books')
        } else {
          alert('Неверный логин или пароль')
        }
      }
    }

    return {
      username,
      password,
      isRegister,
      handleAuth
    }
  }
}
</script>