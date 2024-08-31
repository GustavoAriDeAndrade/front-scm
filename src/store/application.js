// importa o plugin de Request para fazer as requisições para o back
import API from '../plugins/api'
// eporta o store de usuários
export default {
	// estado do store de usuários
	state: {
		// status do store de usuários
		status: null,
	},
	// funções para modificar o estado do store de usuários
	mutations: {
		// função para setar o status do store de usuários
		SET_STATUS(state, status) {
			// seta o status do store de usuários
			state.status = status
		},
	},
	// funções para as ações do store de usuários
	actions: {
		/**
		 * função para editar os dados de um usuário
		 * @param {*} param0 
		 * @param {*} date_update 
		 */
		async putProfile({ commit }, date_update) {
			// seta o status do store de usuarios para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			const resp = await API.put('/profile/' + date_update.uuid, date_update.dados_usuario)
			// seta o status do store de usuario para vazio 
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},
	},
	// funções para coletar o estado do store de usuários
	getters: {}
}