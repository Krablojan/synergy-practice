<template>
  <div>
    <header>
      <div class="container">
        <h1>Дневник Путешествий</h1>

        <nav>
          <router-link to="/">Главная</router-link>
          <router-link v-if="isLoggedIn" to="/dashboard">Мои записи</router-link>
        </nav>

        <div class="user-block">
          <div v-if="isLoggedIn" class="user-info">
            👤 {{ currentUser?.username }}
          </div>

          <button v-if="isLoggedIn" @click="logout" class="btn-logout">
            Выйти
          </button>

          <router-link v-else to="/login" class="btn-login">
            Войти
          </router-link>
        </div>
      </div>
    </header>

    <main class="container" style="padding: 3rem 0;">
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useTravelStore } from './stores/travel'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useTravelStore()
    const router = useRouter()

    const isLoggedIn = computed(() => store.isLoggedIn)
    const currentUser = computed(() => store.currentUser)

    const logout = () => {
      store.logout()
      router.push('/')
    }

    return {
      isLoggedIn,
      currentUser,
      logout
    }
  }
}
</script>