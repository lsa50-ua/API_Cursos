<template>
  <div class="crear-curso-container">
    <h2>Crear Nuevo Curso</h2>
    <form @submit.prevent="crearCurso">
      <div class="form-group">
        <label for="titulo">Título:</label>
        <input type="text" id="titulo" v-model="curso.titulo" required />
      </div>
      <div class="form-group">
        <label for="descripcion">Descripción:</label>
        <textarea id="descripcion" v-model="curso.descripcion" required></textarea>
      </div>
      <div class="form-group">
        <label for="precio">Precio:</label>
        <input type="number" id="precio" v-model="curso.precio" required />
      </div>
      <button type="submit" :class="{ 'shake': showError }">Crear Curso</button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      curso: {
        titulo: '',
        descripcion: '',
        precio: null,
      },
      showError: false,
      errorMessage: '',
    };
  },
  methods: {
    async crearCurso() {
      try {
        const token = useAuthStore().token;
        const response = await fetch('http://localhost:3000/api/cursos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(this.curso),
        });

        if (response.ok) {
          this.$router.push('/misCursos'); // Redirigir a la lista de cursos después de crear uno nuevo
        } else {
          const data = await response.json();
          this.errorMessage = data.error || 'Error al crear el curso.';
          console.error('Error al crear el curso:', this.errorMessage);
          this.showError = true;

          // Restablecer el estado de error después de un tiempo
          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 3000);
        }
      } catch (error) {
        this.errorMessage = 'Error al comunicarse con el servidor.';
        console.error('Error al comunicarse con el servidor:', error);
        this.showError = true;
      }
    },
  },
};
</script>

<style scoped>
.crear-curso-container {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
textarea,
button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-top: 5px;
}

button {
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 10px;
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
</style>
