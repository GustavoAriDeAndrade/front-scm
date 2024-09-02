// importa o plugin de Request para fazer as requisições para o back
import API from '../plugins/api'

// eporta o store de clientes
export default {
	// estado do store de clientes
	state: {
		// status do store de clientes
		status: null,
		// registro dos clientes
		clientes: null,
	},
	// funções para modificar o estado do store de clientes
	mutations: {
		// função para setar o status do store de clientes
		SET_STATUS(state, status) {
			// seta o status do store de clientes
			state.status = status
		},
		// função para setar os registros de clientes
		SET_CLIENTES(state, clientes) {
			// seta os registros de clientes
			state.clientes = {
				// seta os registros de clientes
				dados: clientes.clients,
				// seta o total registros de clientes
				total: clientes.total ? clientes.total : (clientes.clients ? clientes.clients.length : 0)
			}
		},
	},
	// funções para as ações do store de clientes
	actions: {
		/**
		 * função para coletar os clientes do back
		 * @param {*} param0 
		 * @param {*} filters 
		 */
		async getClientes({ commit }, filters) {
			// seta o status do store de empresas para loading
			await commit('SET_STATUS', 'loading')
				// faz a requisição para o back
				const { data, status } = await API.get(
					// url da rota do back para fazer a requisição
					'/client' + 
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
					await commit('SET_CLIENTES', filters.page ? { clients: data.data, total: data.meta.total } : data)
				}
				// retorna a resposta da requisição
				return data
		},
		/**
		 * função para coletar apenas 1 cliente do back
		 * @param {*} param0 
		 * @param {*} cliente_id 
		 */
		async getCliente({ commit }, cliente_id) {
			// seta o status do store de clientes para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			const resp = await API.get('/client/' + cliente_id)
			// seta o status do store de cliente para vazio 
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},
		/**
		 * função para criar um novo cliente
		 * @param {*} param0 
		 * @param {*} dados_cliente 
		 */
		async postClientes({ commit }, dados_cliente) {
			// seta o status do store de clientes para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			const resp = await API.post('/client', dados_cliente)
			// seta o status do store de cliente para vazio 
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},
		/**
		 * função para editar um cliente
		 * @param {*} param0 
		 * @param {*} date_update 
		 */
		async putCliente({ commit }, date_update) {
			// seta o status do store de clientes para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			const resp = await API.put('/client/' + date_update.id, date_update.dados_cliente)
			// seta o status do store de cliente para vazio 
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},
	},
	// funções para coletar o estado do store de clientes
	getters: {
		// coleta o status do store de clientes
		status_clientes: state => state.status,
		// coleta os registros do store de clientes
		clientes: state => state.clientes,
	}
}