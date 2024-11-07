// importa o plugin de Request para fazer as requisições para o back
import API from '../plugins/api'

// eporta o store de usuários
export default {
	// estado do store de usuários
	state: {
		// status do store de usuários
		status: null,
		// registro dos usuários
		usuarios: null,
	},
	// funções para modificar o estado do store de usuários
	mutations: {
		// função para setar o status do store de usuários
		SET_STATUS(state, status) {
			// seta o status do store de usuários
			state.status = status
		},
		// função para setar os registros de usuários
		SET_USUARIOS(state, usuarios) {
			// seta os registros de usuários
			state.usuarios = {
				// seta os registros de usuários
				dados: usuarios.users,
				// seta o total registros de usuários
				total: usuarios.total ? usuarios.total : (usuarios.users ? usuarios.users.length : 0)
			}
		},
	},
	// funções para as ações do store de usuários
	actions: {
		/**
		 * função para coletar os usuários do back
		 * @param {*} param0 
		 * @param {*} filters 
		 */
		async getUsuarios({ commit }, filters) {
			// seta o status do store de empresas para loading
			await commit('SET_STATUS', 'loading')
				// faz a requisição para o back
				const { data, status } = await API.get(
					// url da rota do back para fazer a requisição
					'/user' + 
					// por qual coluna devem ser ordenados os registros
					(filters.order_column ? ('?orderBy=' + filters.order_column) : '?orderBy=id') +
					// qual a ordem que deve ser ordenado (ASC ou DESC)
					(filters.order_dir ? '&order=' + filters.order_dir : '&order=asc') +
					// qual a quantidade de dados
					(filters.limit ? '&limit=' + filters.limit : '') +
					// qual a página
					(filters.page ? '&page=' + filters.page + '&_embed=false' : '&_embed=true') +
					// os registros que contem a busca solicitada
					(filters.search ? '&search=' + filters.search : ''), 
				)
				// seta o status do store de empresa para vazio 
				await commit('SET_STATUS', '')
				// caso o status seja 200 (requisiçao foi concluida) 
				if (status == 200) {
					// seta os dados no store
					await commit('SET_USUARIOS', filters.page ? { users: data.data, total: data.meta.total } : data)
				}
				// retorna a resposta da requisição
				return data
		},
		/**
		 * função para coletar apenas 1 usuário do back
		 * @param {*} param0 
		 * @param {*} usuario_id 
		 */
		async getUsuario({ commit }, usuario_id) {
			// seta o status do store de usuarios para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			const resp = await API.get('/user/' + usuario_id)
			// seta o status do store de usuario para vazio 
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},
		/**
		 * função para criar um novo usuário
		 * @param {*} param0 
		 * @param {*} dados_usuario 
		 */
		async postUsuarios({ commit }, dados_usuario) {
			// seta o status do store de usuarios para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			const resp = await API.post('/user', dados_usuario)
			// seta o status do store de usuario para vazio 
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},
		/**
		 * função para editar um usuário
		 * @param {*} param0 
		 * @param {*} date_update 
		 */
		async putUser({ commit }, date_update) {
			// seta o status do store de usuarios para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			const resp = await API.put('/user/' + date_update.id, date_update.dados_usuario)
			// seta o status do store de usuario para vazio 
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},
		/**
		* função para coletar os grupos
		* @param {*} param0
		*/
		async getGroups({ commit }){
			// seta o status do store de usuários para loading
			await commit('SET_STATUS', 'loading')
			// faz a requisição para o back e coleta o resultado na variável resp
			const resp = await API.get('/getGroups')
			// seta o status de usuários para vazio
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},
		/**
		 * função para listar os usuários cadastrados
		 * @param {*} param0 
		 * @returns 
		 */
		async getUsuariosSelect({ commit }) {
			// seta o status do store de usuários para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			const resp = await API.get('/selectUsuario')
			// seta o status do store de usuário para vazio 
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},
	},
	// funções para coletar o estado do store de usuários
	getters: {
		// coleta o status do store de usuários
		status_usuarios: state => state.status,
		// coleta os registros do store de usuários
		usuarios: state => state.usuarios,
	}
}