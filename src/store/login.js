//  importa o plugin de API para fazer requisições diretamente pro back
import API from '../plugins/api'
export default {
	state: {
		status: null,
		token: localStorage.getItem('token') || null,
		user: null,
		user_uuid: localStorage.getItem('user_uuid') || null,
		recorever_email: null,
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
		SET_USER_UUID(state, user_uuid) {
			state.user_uuid = user_uuid
		},
		SET_RECOVER_EMAIL(state, email) {
			state.recorever_email = email
		},
		LOGOUT(state) {
			state.status = null
			state.token = null
			state.user = null
		},
	},
	actions: {

		async login({ commit, dispatch }, user) {
			await commit('SET_STATUS', 'loading')

			try{
				const { data, status } = await API.post('/login', {
					email: user.usuario,
					password: user.senha
				})
			
				if (status == 200) {
					if (user.lembrar_usuario) {
						localStorage.setItem('usuario', user.usuario)
						localStorage.setItem('senha', user.senha)
						localStorage.setItem('lembrar_usuario', user.lembrar_usuario)
					} else {
						localStorage.removeItem('usuario')
						localStorage.removeItem('senha')
						localStorage.removeItem('lembrar_usuario')
					}

					API.setAuthorization(data.authenticated.token, true)

					await commit('SET_TOKEN', data.authenticated.token)
					
					await commit('SET_USER_UUID', data.user.uuid)

					await dispatch('setUser', data.user)
					
					await localStorage.setItem('user_uuid', data.user.uuid)
					
					return data
				
				}else if(status == 204){

					return status

				}
			}catch(e){
				return false
			}
		},

		async setUser({ commit }, user_data) {
			
			await commit('SET_STATUS', 'loading')
			
			if (user_data){
				if (user_data.uuid) {
					await commit('SET_USER', user_data)
				} else {
					await localStorage.removeItem('token')
				}
				return true
			}
			
			return false
		},

		async setUserUUID({ commit, dispatch }) {
			await commit('SET_STATUS', 'loading')

			const { data, status } = await API.get('/me')

			if(status == 200) {
				await dispatch('setUser', data)
				
				await commit('SET_USER_UUID', data.uuid)

				return true
			}else {
				await commit('SET_STATUS', 'error')
				await localStorage.removeItem('token')

				return false
			}
		},

		async logout({ commit }) {
			await commit('LOGOUT')
			await localStorage.removeItem('token')
			return
		},
		/**
		 * função para verificar o email digitado pelo usuário
		 * @param {*} param0 
		 * @param {*} user
		 */
		async verificaEmail({ commit }, user) {
			// seta o status do store de login para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado
			const { data, status } = await API.post('/verificaEmail', {
				email: user.email
			})
			// caso o status seja 200(deu certo)
			if(status == 200){
				// seta o email de verificação 
				await commit('SET_RECOVER_EMAIL', user.email)
				localStorage.setItem('recoverer_email', user.email)
			// caso algo tenha dado errado
			}else{
				// remove o email digitado pelo usuário do campo email
				localStorage.removeItem('recoverer_email')
				// seta o status do store de login para erro
				await commit('SET_STATUS', 'error')
				// seta o email de recuperação para vazio
				await commit('SET_RECOVER_EMAIL', '')
			}
			// retorna a resposta da requisição
			return data
		},
		/**
		 * função para verificar o token do usuário
		 * @param {*} param0 
		 * @param {*} dados
		 */
		async validaToken({ commit }, dados) {
			// seta o status do store de login para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o ack e coleta o resultado na variável resp
			const resp = await API.post('/verificaToken', dados)
			// seta p status do store de login para vazio para
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},
		/**
		 * função para editar a senha do usuário
		 * @param {*} param0 
		 * @param {*} date_update
		 */
		async putSenha({ commit }, date_update){
			// seta o status de store de login para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variável resp
			const resp = await API.post('/resetPassword', date_update)
			// seta o status de login par vazio
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},

	},
	getters: {
		isLoggedIn: state => !!state.token,
		authStatus: state => state.status,
		token: state => state.token,
		user: state => state.user,
		user_uuid: state => state.user_uuid,
		recorever_email: state => state.recorever_email,
	}
}