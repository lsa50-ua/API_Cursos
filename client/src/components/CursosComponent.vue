<template>
  <div class="cursos-container">
    <h2>Listado de Cursos</h2>
    
    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <input v-model="searchQuery" @input="filterCursos" placeholder="Buscar cursos...">
    </div>

    <div class="cursos-list">
      <div class="curso" v-for="curso in filteredCursos" :key="curso.id">
        <div class="curso-details">
          <div class="curso-info">
            <div><strong>ID:</strong> {{ curso.id }}</div>
            <div><strong>Título:</strong> {{ curso.titulo }}</div>
            <div><strong>Autor:</strong> {{ curso.autor }}</div>
          </div>
          <div v-if="curso.showDetails">
            <!-- Información adicional a mostrar -->
            <div><strong>Descripción:</strong> {{ curso.descripcion }}</div>
            <div><strong>Precio:</strong> {{ curso.precio }} €</div>
          </div>
          <div class="curso-buttons">
            <button @click="toggleDetails(curso.id)">
              {{ curso.showDetails ? 'Mostrar menos detalles' : 'Ver detalles' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <button @click="loadPrevPage" :disabled="currentPage === 1" :class="{ 'disabled-button': currentPage === 1 }">Anterior</button>
      <button @click="loadNextPage" :disabled="currentPage === totalPages || !hasNextPage" :class="{ 'disabled-button': currentPage === totalPages || !hasNextPage }">Siguiente</button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      cursos: [],
      filteredCursos: [],
      currentPage: 1,
      totalPages: 1,
      hasNextPage: true,
      searchQuery: '',
    };
  },
  methods: {
    async fetchCursos(page) {
      try {
        const token = useAuthStore().token;
        const response = await fetch(`http://localhost:3000/api/cursos?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          this.cursos = data.data.map(curso => ({ ...curso, showDetails: false }));
          this.currentPage = page;
          this.totalPages = Math.ceil(data.metadata.totalResults / data.metadata.resultsInPage);
          this.hasNextPage = data.metadata.nextPage !== null;
          this.filterCursos(); // Filtrar cursos cuando se actualizan
        } else {
          console.error('Error al obtener la lista de cursos');
        }
      } catch (error) {
        console.error('Error al comunicarse con el servidor:', error);
      }
    },
    loadNextPage() {
      if (this.hasNextPage) {
        this.fetchCursos(this.currentPage + 1);
      }
    },
    loadPrevPage() {
      if (this.currentPage > 1) {
        this.fetchCursos(this.currentPage - 1);
      }
    },
    filterCursos() {
      const query = this.searchQuery.toLowerCase();
      this.filteredCursos = this.cursos.filter(curso =>
        curso.titulo.toLowerCase().includes(query) ||
        curso.autor.toLowerCase().includes(query)
      );
    },
    toggleDetails(cursoId) {
      const curso = this.cursos.find(curso => curso.id === cursoId);
      if (curso) {
        curso.showDetails = !curso.showDetails;
      }
    },
  },
  mounted() {
    this.fetchCursos(1);
  },
};
</script>

<style scoped>
/* ... (resto de tu estilo) */
button {
  padding: 10px;
  margin: 0 5px;
  cursor: pointer;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.curso-info {
  flex-grow: 1;
}

.curso-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

button {
  padding: 10px;
  margin: 0 5px;
  cursor: pointer;
}

.search-bar {
  margin-bottom: 20px;
}

input {
  padding: 10px;
  width: 100%;
}

.disabled-button {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Elimina estilos de hover para ambos botones */
.pagination button:hover {
  background-color: #ccc; 
}

</style>
