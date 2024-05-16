<template>
  <div v-if="!isAuthenticated" class="login-container">
    <h1 class="login-header">Login</h1>
    <form
      ref="form"
      @submit.prevent="login"
      :class="{ 'shake': loginError }"
      class="login-form"
    >
      <label for="email">Email:</label>
      <input v-model="email" type="email" id="email" placeholder="Ingrese su email" />

      <label for="password">Contraseña:</label>
      <input
        v-model="contraseña"
        type="password"
        id="password"
        placeholder="Ingrese su contraseña"
        required
        minlength="1"
      />

      <button type="submit" class="login-button">Iniciar Sesión</button>
      <div v-if="loginError" class="error-message">Credenciales Inválidas</div>
    </form>
  </div>
  <div v-else class="welcome-container">
    <p class="welcome-message">{{ `¡Bienvenido, ${userEmail}!` }}</p>
    <button @click="logout" class="logout-button">Logout</button>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      email: '',
      contraseña: '',
      loginError: false,
    };
  },
  computed: {
    isAuthenticated() {
      return useAuthStore().token !== null;
    },
    userEmail() {
      return useAuthStore().email;
    },
  },
  methods: {
    async login() {
      if (!this.$refs.form.checkValidity()) {
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: this.email, contraseña: this.contraseña }),
        });

        if (response.ok) {
          const data = await response.json();
          useAuthStore().login({ token: data.token, email: this.email });
          this.$router.push('/cursos'); // Redirigir a los cursos
        } else {
          this.loginError = true;
          console.error('Error en la autenticación');
        }
      } catch (error) {
        console.error('Error al comunicarse con el servidor:', error);
      }
    },
    logout() {
      useAuthStore().logout();
    },
  },
};
</script>

<style scoped>
  .login-container, .welcome-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .login-form, .welcome-message {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 300px;
  }

  .login-header {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
  }

  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .login-button, .logout-button {
    background-color: #3498db;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }

  .login-button:hover, .logout-button:hover {
    background-color: #2980b9;
  }

  
  .shake {
    animation: shake 0.5s;
  }

  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    25%, 75% {
      transform: translateX(-10px);
    }
    50% {
      transform: translateX(10px);
    }
  }

  .error-message {
    color: red;
    margin-top: 10px;
  }
</style>