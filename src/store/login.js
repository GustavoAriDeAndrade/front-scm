//  importa o plugin de API para fazer requisições diretamente pro back
import API from '../plugins/api'
export default {
	state: {
		status: null,
		token: localStorage.getItem('token') || null,
		user: null,
		user_id: localStorage.getItem('user_id') || null,
	},
	mutations: {
		SET_STATUS(state, status) {
			state.status = status
		},
		SET_TOKEN(state, token) {
			state.token = token
		},
		SET_USER(state, user) {
			state.user = user
		},
		SET_USER_ID(state, user_id) {
			state.user_id = user_id
		},
		LOGOUT(state) {
			state.status = null
			state.token = null
			state.user = null
		},
	},
	actions: {

		/**
		 * Função para verificar o login do usuário
		 * @param {*} param0 
		 * @param {*} user 
		 * @returns 
		 */
		async login({ commit, dispatch }, user){

			await commit('SET_STATUS', 'loading')

			try{

				const { data, status } = await API.post('/login', {
					email: user.usuario,
					password: user.senha
				})
			
				if(status == 200){

					localStorage.removeItem('usuario')

					localStorage.removeItem('senha')

					localStorage.removeItem('lembrar_usuario')

					API.setAuthorization(data.authenticated.token, true)

					await commit('SET_TOKEN', data.authenticated.token)
					
					await commit('SET_USER_ID', data.user.id)

					await dispatch('setUser', data.user)
					
				  localStorage.setItem('user_id', data.user.id)
					
					return data
				
				}else if(status == 204){

					return status

				}

			}catch(e){

				return false

			}
		},

		/**
		 * Função para setar os dados do usuário
		 * @param {*} param0 
		 * @param {*} user_data 
		 * @returns 
		 */
		async setUser({ commit }, user_data){
			
			await commit('SET_STATUS', 'loading')
			
			if(user_data){

				if(user_data.id){

					await commit('SET_USER', user_data)

				}else{

					localStorage.removeItem('token')

				}

				return true

			}
			
			return false

		},

		/**
		 * Atualiza os dados de um usuário logado
		 * @param {*} param0 
		 * @returns 
		 */
		async setUserID({ commit, dispatch }){

			await commit('SET_STATUS', 'loading')

			const { data, status } = await API.get('/me')

			if(status == 200) {

				await dispatch('setUser', data)
				
				await commit('SET_USER_ID', data.id)

				return true

			}else{

				await commit('SET_STATUS', 'error')

			  localStorage.removeItem('token')

				return false

			}
		},

		/**
		 * Desloga o usuário
		 * @param {*} param0 
		 * @returns 
		 */
		async logout({ commit }){

			commit('LOGOUT')

			localStorage.removeItem('token')

			return

		},
	},
	getters: {
		isLoggedIn: state => !!state.token,
		authStatus: state => state.status,
		token: state => state.token,
		user: state => state.user,
		user_id: state => state.user_id,
	}
}