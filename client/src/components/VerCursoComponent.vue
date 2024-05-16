<template>
    <div class="ver-curso-container">
      <h2>Detalles del Curso</h2>
      <div class="curso-details">
        <div><strong>ID:</strong> {{ curso.id }}</div>
        <div><strong>Título:</strong> {{ curso.titulo }}</div>
        <div><strong>Autor:</strong> {{ curso.autor }}</div>
        <div><strong>Descripción:</strong> {{ curso.descripcion }}</div>
        <div><strong>Precio:</strong> {{ curso.precio }} €</div>
      </div>
      <button class="volver-button" @click="volverAtras">
        Volver
      </button>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from '@/stores/auth';
  
  export default {
    data() {
      return {
        curso: {},
      };
    },
    methods: {
      async fetchCurso() {
        try {
          const cursoId = this.$route.params.id;
          const token = useAuthStore().token;
          const response = await fetch(`http://localhost:3000/api/cursos/${cursoId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            this.curso = data;
          } else {
            console.error('Error al obtener los detalles del curso');
          }
        } catch (error) {
          console.error('Error al comunicarse con el servidor:', error);
        }
      },
      volverAtras() {
        this.$router.go(-1); // Vuelve a la página anterior en la historia del navegador
      },
    },
    mounted() {
      this.fetchCurso();
    },
  };
  </script>
  
  <style scoped>
  .ver-curso-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .curso-details {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
  }
  
  .volver-button {
    display: block;
    margin-top: 20px;
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
  
  .volver-button:hover {
    background-color: #0056b3;
  }
  </style>
   