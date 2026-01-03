<template>
  <div class="card">
    <h2 class="text-3xl font-bold mb-10 text-center text-indigo-800">
      {{ isRegister ? 'Регистрация нового пользователя' : 'Вход в дневник путешествий' }}
    </h2>

    <form @submit.prevent="handleAuth" class="space-y-6">
      <input 
        v-model="username" 
        placeholder="Имя пользователя" 
        required 
        class="text-lg"
      />
      <input 
        v-model="password" 
        type="password" 
        placeholder="Пароль" 
        required 
        class="text-lg"
      />

      <button type="submit" class="btn-primary text-xl py-4">
        {{ isRegister ? 'Зарегистрироваться' : 'Войти' }}
      </button>
    </form>

    <div class="text-center mt-10">
      <button @click="toggleMode" class="text-blue-600 hover:underline font-medium text-lg">
        {{ isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться' }}
      </button>
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

    const username = ref('')
    const password = ref('')
    const isRegister = ref(false)

    const toggleMode = () => {
      isRegister.value = !isRegister.value
    }

    const handleAuth = () => {
      if (isRegister.value) {
        if (store.register(username.value.trim(), password.value)) {
          alert(`Добро пожаловать, ${username.value}! 🎉 Аккаунт создан.`)
          router.push('/dashboard')
        } else {
          alert('Пользователь с таким именем уже существует')
        }
      } else {
        if (store.login(username.value.trim(), password.value)) {
          alert(`С возвращением, ${username.value}! 🌍`)
          router.push('/dashboard')
        } else {
          alert('Неверное имя пользователя или пароль')
        }
      }
    }

    return {
      username,
      password,
      isRegister,
      toggleMode,
      handleAuth
    }
  }
}
</script>

<style scoped>
.space-y-6 > * + * {
  margin-top: 1.5rem;
}
</style>