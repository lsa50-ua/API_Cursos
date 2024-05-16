<template>
  <div class="miscursos-container">
    <h2>Mis Cursos</h2>
    <div class="cursos-list">
      <div class="curso" v-for="curso in cursos" :key="curso.id">
        <div class="curso-details">
          <div class="curso-info">
            <div><strong>ID:</strong> {{ curso.id }}</div>
            <div><strong>Título:</strong> {{ curso.titulo }}</div>
          </div>
          <div class="curso-buttons">
            <router-link :to="'/cursos/' + curso.id" class="ver-button">
              Ver
            </router-link>
            <router-link :to="'/cursos/' + curso.id + '/editar'" class="editar-button">
              Editar
            </router-link>
            <button class="eliminar-button" @click="eliminarCurso(curso.id)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
    <router-link to="/crearCurso" class="crear-curso-button">
      Crear Curso
    </router-link>
  </div>
</template>
  
  <script>
  import { useAuthStore } from '@/stores/auth';
  
  export default {
    data() {
      return {
        cursos: [],
      };
    },
    methods: {
      async fetchMisCursos() {
        try {
          const token = useAuthStore().token; // Obtener el token del store
          const response = await fetch('http://localhost:3000/api/misCursos', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            this.cursos = data.datos;
          } else {
            console.error('Error al obtener la lista de cursos propios');
          }
        } catch (error) {
          console.error('Error al comunicarse con el servidor:', error);
        }
      },
      async eliminarCurso(id) {
        try {
          const token = useAuthStore().token; // Obtener el token del store
          const response = await fetch(`http://localhost:3000/api/cursos/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            // Actualizar la lista de cursos después de eliminar uno
            await this.fetchMisCursos();
          } else {
            console.error('Error al eliminar el curso');
          }
        } catch (error) {
          console.error('Error al comunicarse con el servidor:', error);
        }
      },
    },
    mounted() {
      // Cargar la lista de cursos propios al montar el componente
      this.fetchMisCursos();
    },
  };
  </script>
  
  <style scoped>
.miscursos-container {
  max-width: 800px;
  margin: 0 auto;
}

.cursos-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.curso {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.curso-details {
  margin-bottom: 10px;
}

.curso-info {
  flex-grow: 1;
}

.curso-buttons {
  display: flex;
  justify-content: space-between;
}

.ver-button,
.editar-button,
.eliminar-button {
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  color: #fff;
}

.ver-button {
  background-color: #007BFF;
}

.editar-button {
  background-color: #28a745;
}

.eliminar-button {
  background-color: #dc3545;
}

.crear-curso-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  text-align: center;
  background-color: #007BFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.crear-curso-button:hover {
  background-color: #0056b3;
}

@media screen and (max-width: 600px) {
  .cursos-list {
    grid-template-columns: 1fr;
  }
}
</style>