// importa o plugin da API para fazer as requisições para o back
import API from '../plugins/api'

// eporta o store de empresa
export default {
	// estado do store de empresa
	state: {
		// status do store de empresa
		status: null,
		// registro das empresas
		empresas: null,
	},
	// funções para modificar o estado do store de empresas
	mutations: {
		// função para setar o status do store de empresas
		SET_STATUS(state, status) {
			// seta o status do store de empresas
			state.status = status
		},
		// função para setar os registros de empresas
		SET_EMPRESA(state, empresas) {
			// seta os registros de empresas
			state.empresas = {
				// seta os registros de empresas
				dados: empresas.companies,
				// seta o total registros de empresas
				total: empresas.total ? empresas.total : (empresas.companies ? empresas.companies.length : 0)
			}
		},
	},
	// funções para as ações do store de empresa
	actions: {
		/**
		 * função para coletar os registros das empresas do back
		 * @param {*} param0 
		 * @param {*} filters 
		 */
		async getEmpresas({ commit }, filters) {
			// seta o status do store de empresas para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			const { data, status } = await API.get(
				// url da rota do back para fazer a requisição
				'/company' + 
				// por qual coluna devem ser ordenados os registros
				(filters.order_column ? ('?orderBy=' + filters.order_column) : '?orderBy=created_at') +
				// qual a ordem que deve ser ordenado (ASC ou DESC)
				(filters.order_dir ? '&order=' + filters.order_dir : '&order=asc') +
				// qual a qtde de dados
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
				await commit('SET_EMPRESA', filters.page ? { companies: data.data, total: data.meta.total } : data)
			}
			// retorna a resposta da requisição
			return data
		},

		/**
		 * função para coletar os dados de uma empresa do back
		 * @param {*} param0 
		 * @param {*} empresa_uuid 
		 */
		async getEmpresa({ commit }, empresa_uuid) {
			// seta o status do store de empresas para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			const resp = await API.get('/company/' + empresa_uuid)
			// seta o status do store de empresa para vazio 
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},

		/**
		 * função para criar uma empresa
		 * @param {*} param0 
		 * @param {*} dados_empresa 
		 */
		async postEmpresas({ commit }, dados_empresa) {
			// seta o status do store de empresas para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			const resp = await API.post('/company', dados_empresa)
			// seta o status do store de empresa para vazio 
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},

		/**
		 * função para editar a empresa
		 * @param {*} param0 
		 * @param {*} date_update 
		 */
		async putEmpresas({ commit }, date_update) {
			// seta o status do store de empresas para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			const resp = await API.put('/company/' + date_update.uuid, date_update.dados_empresa)
			// seta o status do store de empresa para vazio 
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},
	},
	// funções para coletar o estado do store de empresa
	getters: {
		// coleta o status do store de empresa
		status_empresas: state => state.status,
		// coleta os registros do store de empresa
		empresas: state => state.empresas,
	}
}