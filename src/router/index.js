import { createRouter, createWebHistory } from 'vue-router';
import TelaInicial from '../views/TelaInicial.vue'; 
import Login from '../views/Login.vue';

const routes = [
  {
    path: '/',
    redirect: '/tela-inicial'
  },
  {
    path: '/tela-inicial',
    name: 'TelaInicial',
    component: TelaInicial,
    meta: { title: 'Início' } // Define o título para esta rota
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Login' } // Define o título para esta rota
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    meta: { title: 'About' }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Atualiza o título da aba quando a rota muda
router.afterEach((to) => {
  document.title = to.meta.title || 'Meu Aplicativo';
});

export default router;
