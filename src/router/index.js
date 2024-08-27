import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import API from '../plugins/api'

Vue.use(VueRouter)

function verificaLogin(to, from, next) {
	if (store.getters.isLoggedIn) {
		store.dispatch('setUserUUID').then(function () {
			if (store.getters.user_uuid) {
				next()
				return
			} else {
				next('/login')
			}
		})
	} else {
		next('/login')
	}
}

async function verificaGroup(to, from, next, requisito) {
	if (store.getters.isLoggedIn) {
		const { data, status } = await API.get('group?orderBy=created_at&order=asc&_embed=true')
		if(status == 200){
			if(((data.user_groups).find(element => element.hierarchy_order <= requisito)) == undefined){
				next('/sem-permissao')
			}else{
				next()
			}
		}else{
			next('/')
		}
	} else {
		next('/login')
	}
}

function notLogin(to, from, next) {
	if (!store.getters.isLoggedIn) {
		next()
		return
	} else {
		next('/')
	}
}

function notLoginRecover(to, from, next) {
	if (!store.getters.isLoggedIn && localStorage.getItem('recover_token')) {
		next()
		return
	} else {
		next()
	}
}

function deslogar(to, from, next) {
	store.dispatch('logout').then(function () {
		next('/login')
	})
}

const routes = [
	{
		path: '/',
		name: 'Dashboard',
		component: () => import('@/views/Dashboard.vue'),
		beforeEnter(to, from, next) {
			verificaLogin(to, from, next)
		},
		children: [
			{
				path: '/usuarios',
				name: 'Usuários',
				beforeEnter(to, from, next) {
					verificaGroup(to, from, next, 4)
				},
				component: () => import('@/views/pages/Usuarios.vue'),
			},
			{
				path: '/empresas',
				name: 'Empresas',
				beforeEnter(to, from, next) {
					verificaGroup(to, from, next, 2)
				},
				component: () => import('@/views/pages/Empresas.vue'),
			},
			{
				path: '/procedimentos',
				name: 'Procedimentos',
				beforeEnter(to, from, next) {
					verificaGroup(to, from, next, 3)
				},
				component: () => import('@/views/pages/Procedimentos.vue')
			},
			{
				path: '/relatorios',
				name: 'Relatórios',
				beforeEnter(to, from, next) {
					verificaGroup(to, from, next, 4)
				},
				component: () => import('@/views/pages/Relatorios.vue')
			},
			{
				path: '/funcionarios',
				name: 'Funcionários',
				beforeEnter(to, from, next) {
					verificaGroup(to, from, next, 4)
				},
				component: () => import('@/views/pages/Funcionarios.vue')
			},
			{
				path: '/agendas',
				name: 'Agendas',
				beforeEnter(to, from, next) {
					verificaGroup(to, from, next, 4)
				},
				component: () => import('@/views/pages/Agendas.vue')
			},
			{
				path: '/calendarios',
				name: 'Calendários',
				beforeEnter(to, from, next) {
					verificaGroup(to, from, next, 5)
				},
				component: () => import('@/views/pages/Calendarios.vue')
			},
			{
				path: '/sem-permissao',
				name: 'Sem Permissão',
				component: () => import('@/views/pages/SemPermissao.vue'),
			},
		]
	},
	{
		path: '/logout',
		beforeEnter(to, from, next) {
			deslogar(to, from, next)
		}
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/login/Login.vue'),
		beforeEnter(to, from, next) {
			notLogin(to, from, next)
		}
	},
	{
		path: '/recuperar-senha',
		name: 'Esqueci minha senha',
		component: () => import('@/views/login/RecuperarSenha.vue'),
		beforeEnter(to, from, next) {
			notLogin(to, from, next)
		}
	},
	{
		path: '/nova-senha',
		name: 'Nova senha',
		component: () => import('@/views/login/NovaSenha.vue'),
		beforeEnter(to, from, next) {
			notLoginRecover(to, from, next)
		}
	},
	{
		path: '/privacidade',
		name: 'Políticas de privacidade',
		component: () => import('@/views/PoliticasDePrivacidade.vue'),
		beforeEnter(to, from, next) {
			notLoginRecover(to, from, next)
		}
	},
	{
		path: '*',
		name: '404',
		component: () => import('@/views/pages/404.vue'),
	},
]

export default new VueRouter({
	routes,
	linkExactActiveClass: 'active',
	mode: 'history'
})