import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import CursosView from '@/views/CursosView.vue';
import MisCursosView from '@/views/MisCursosView.vue';
import CrearCursoView from '@/views/CrearCursoView.vue';
import EditarCursoView from '@/views/EditarCursoView.vue';
import VerCursoView from '@/views/VerCursoView.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },

    { path: '/login', name: 'login', component: LoginView },

    { path: '/cursos', name: 'cursos', component: CursosView,
      beforeEnter: (to, from, next) => {
        if (!useAuthStore().isAuthenticated) {
          next('/login');
        } else {
          next();
        }
      }
    },

    { path: '/misCursos', name: 'misCursos', component: MisCursosView,
      beforeEnter: (to, from, next) => {
        if (!useAuthStore().isAuthenticated) {
          next('/login');
        } else {
          next();
        }
      }
    },

    { path: '/crearCurso', name: 'crearCurso', component: CrearCursoView,
      beforeEnter: (to, from, next) => {
        if (!useAuthStore().isAuthenticated) {
          next('/login');
        } else {
          next();
        }
      }
    },

    { path: '/cursos/:id/editar', name: 'editarCurso', component: EditarCursoView,
      beforeEnter: (to, from, next) => {
        if (!useAuthStore().isAuthenticated) {
          next('/login');
        } else {
          next();
        }
      }
    },

    { path: '/cursos/:id', name: 'verCurso', component: VerCursoView,
      beforeEnter: (to, from, next) => {
        if (!useAuthStore().isAuthenticated) {
          next('/login');
        } else {
          next();
        }
      }
    },
  ]
});

export default router;

