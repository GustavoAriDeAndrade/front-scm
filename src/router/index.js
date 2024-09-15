import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import API from '../plugins/api'

Vue.use(VueRouter)

/**
 * Função para verificar se o usuário já logou
 * @param {*} to 
 * @param {*} from 
 * @param {*} next 
 */
function verificaLogin(to, from, next){

	if(store.getters.isLoggedIn){

		store.dispatch('setUserID').then(function (){

			if(store.getters.user_id){
				next()
				return
			}else{
				next('/login')
			}
		})
	}else{
		next('/login')
	}
}

/**
 * Função para verificar se o usuário tem permissão para acessar a página
 * @param {*} to 
 * @param {*} from 
 * @param {*} next 
 * @param {*} requisito 
 */
async function verificaGroup(to, from, next, requisito){

	if(store.getters.isLoggedIn){

		const { data, status } = await API.get('group?orderBy=created_at&order=asc&_embed=true')

		if(status == 200){

			if(((data.user_groups).find(element => element.hierarquia <= requisito)) == undefined){

				next('/sem-permissao')

			}else{

				next()

			}
		}else{
			next('/')
		}
	}else{
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
				path: '/dashboard',
				name: 'Dashboard',
				beforeEnter(to, from, next) {
					verificaGroup(to, from, next, 2)
				},
				component: () => import('@/views/pages/Inicial.vue'),
			},
			{
				path: '/usuarios',
				name: 'Usuários',
				beforeEnter(to, from, next) {
					verificaGroup(to, from, next, 1)
				},
				component: () => import('@/views/pages/Usuarios.vue'),
			},
			{
				path: '/clientes',
				name: 'Clientes',
				beforeEnter(to, from, next) {
					verificaGroup(to, from, next, 2)
				},
				component: () => import('@/views/pages/Clientes.vue'),
			},
			{
				path: '/produtos',
				name: 'Produtos',
				beforeEnter(to, from, next) {
					verificaGroup(to, from, next, 2)
				},
				component: () => import('@/views/pages/Produtos.vue')
			},
			{
				path: '/caixa',
				name: 'Caixa',
				beforeEnter(to, from, next) {
					verificaGroup(to, from, next, 2)
				},
				component: () => import('@/views/pages/Caixa.vue')
			},
			{
				path: '/vendas',
				name: 'Vendas',
				beforeEnter(to, from, next) {
					verificaGroup(to, from, next, 2)
				},
				component: () => import('@/views/pages/Vendas.vue')
			},
			{
				path: '/relatorios',
				name: 'Relatórios',
				beforeEnter(to, from, next) {
					verificaGroup(to, from, next, 2)
				},
				component: () => import('@/views/pages/Relatorios.vue')
			},
			{
				path: '/inicial',
				name: 'Inicial',
				beforeEnter(to, from, next) {
					verificaGroup(to, from, next, 2)
				},
				component: () => import('@/views/pages/Inicial.vue')
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