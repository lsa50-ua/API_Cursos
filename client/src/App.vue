<template>
  <div>
    <nav class="navbar">
      <div class="logo">
        APICursos
      </div>
      <ul class="nav-list">
        <template v-if="isAuthenticated">
          <li><RouterLink to="/cursos">Cursos</RouterLink></li>
          <li><RouterLink to="/misCursos">Mis Cursos</RouterLink></li>
        </template>
        <template v-else>
          <li><RouterLink to="/login">Login</RouterLink></li>
        </template>
      </ul>
      <template v-if="isAuthenticated">
        <div class="user-info">
          {{ userEmail }}
          <button @click="logout">Logout</button>
        </div>
      </template>
    </nav>

    <div class="router-container">
      <RouterView />
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
  computed: {
    isAuthenticated() {
      return useAuthStore().isAuthenticated;
    },
    userEmail() {
      return useAuthStore().email;
    },
  },
  methods: {
    logout() {
      useAuthStore().logout();
      this.$router.push('/login'); // Redirigir al login
    },
  },
};
</script>

<style scoped>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #ecf0f1;
  }

  .navbar {
    background: linear-gradient(45deg, #3498db, #2980b9);
    padding: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
  }

  .logo {
    font-size: 1.8rem;
    color: #fff;
    font-weight: bold;
  }

  .nav-list {
    list-style: none;
    margin: 0;
    display: flex;
    gap: 20px;
  }

  .nav-list li {
    margin: 0;
  }

  .nav-list a {
    text-decoration: none;
    color: #fff;
    padding: 15px;
    border-radius: 8px;
    font-size: 1.2rem;
    transition: background-color 0.3s ease;
  }

  .nav-list a:hover {
    background-color: #1d6fa5;
  }

  .router-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin-top: 80px;
  }

  @media screen and (max-width: 768px) {
    .nav-list {
      flex-direction: column;
      align-items: center;
    }

    .nav-list li {
      margin-bottom: 10px;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
  }

  .user-info button {
    margin-left: 10px;
    background-color: #e74c3c;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }

  .user-info button:hover {
    background-color: #c0392b;
  }
</style>

