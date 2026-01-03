<template>
  <div>
    <header>
      <div class="container">
        <h1>Книжный Магазин</h1>

        <nav>
          <router-link to="/">Главная</router-link>
          <router-link v-if="isLoggedIn" to="/books">Каталог</router-link>
          <router-link v-if="isAdmin" to="/admin">Админ</router-link>
        </nav>

        <div class="user-block">
          <div v-if="isLoggedIn" class="user-info">
            👤 {{ currentUser.username }} <span v-if="isAdmin" class="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">ADMIN</span>
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
import { useBookStore } from './stores/book'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useBookStore()
    const router = useRouter()

    const isLoggedIn = computed(() => store.isLoggedIn)
    const currentUser = computed(() => store.currentUser)
    const isAdmin = computed(() => store.isAdmin)

    const logout = () => {
      store.logout()
      router.push('/')
    }

    return {
      isLoggedIn,
      currentUser,
      isAdmin,
      logout
    }
  }
}
</script>