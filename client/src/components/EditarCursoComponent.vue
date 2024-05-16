<template>
  <div class="editar-curso-container">
    <h2>Editar Curso</h2>
    <form @submit.prevent="editarCurso">
      <div class="form-group">
        <label for="titulo">Título:</label>
        <input v-model="titulo" type="text" id="titulo" required>
      </div>
      <div class="form-group">
        <label for="descripcion">Descripción:</label>
        <textarea v-model="descripcion" id="descripcion" rows="4" required></textarea>
      </div>
      <div class="form-group">
        <label for="precio">Precio:</label>
        <input v-model.number="precio" type="number" id="precio" required>
      </div>
      <button :class="{ 'error-shake': errorMessage }" type="submit">Guardar Cambios</button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      titulo: '',
      descripcion: '',
      precio: 0,
      cursoId: this.$route.params.id,
      errorMessage: null,
    };
  },
  methods: {
    async obtenerDatosCurso() {
      try {
        const token = useAuthStore().token;
        const response = await fetch(`http://localhost:3000/api/cursos/${this.cursoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          this.titulo = data.titulo;
          this.descripcion = data.descripcion;
          this.precio = data.precio;
        } else {
          console.error('Error al obtener los datos del curso');
        }
      } catch (error) {
        console.error('Error al comunicarse con el servidor:', error);
      }
    },
    async editarCurso() {
      try {
        const token = useAuthStore().token;
        const response = await fetch(`http://localhost:3000/api/cursos/${this.cursoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titulo: this.titulo,
            descripcion: this.descripcion,
            precio: this.precio,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.message);
          this.$router.push('/misCursos');
        } else {
          const errorData = await response.json();
          if (response.status === 400) {
            this.errorMessage = errorData.error;
          } else if (response.status === 403) {
            this.errorMessage = errorData.message;
          } else {
            this.errorMessage = 'Error al editar el curso';
          }
        }
      } catch (error) {
        console.error('Error al comunicarse con el servidor:', error);
        this.errorMessage = 'Error al comunicarse con el servidor';
      }
    },
  },
  mounted() {
    this.obtenerDatosCurso();
  },
};
</script>

<style scoped>
.editar-curso-container {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

textarea,
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #ff0000;
  margin-top: 10px;
}


.error-shake {
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
