// importa o plugin de Request para fazer as requisições para o back
import API from '../plugins/api'
// eporta o store de usuários
export default {
	// estado do store de usuários
	state: {
		// status do store de usuários
		status: null,
		// registro das empresa
		companies: null,
		// registro dos workspaces
		workspaces: null,
		// uuid da empresa logada
        company_uuid: null,
		// uuid do workspace logado
		workspace_uuid: null,
	},
	// funções para modificar o estado do store de usuários
	mutations: {
		// função para setar o status do store de usuários
		SET_STATUS(state, status) {
			// seta o status do store de usuários
			state.status = status
		},
        SET_COMPANY_UUID(state, company_uuid) {
			// seta o company_id do store de usuários
			state.company_uuid = company_uuid
		},
		SET_WORKSPACE_UUID(state, workspace_uuid) {
			// seta o workspace_id do store de usuários
			state.workspace_uuid = workspace_uuid
		},
		// função para setar os registros de usuários
		SET_COMPANIES(state, companies) {
			// seta os registros de usuários
			state.companies = companies.companies
		},
		SET_WORKSPACES(state, workspaces) {
			// seta os registros de usuários
			state.workspaces = workspaces.workspaces
		},
	},
	// funções para as ações do store de usuários
	actions: {
		/**
		 * função para coletar os registros dos usuários do back
		 * @param {*} param0 
		 * @param {*} filters 
		 */
		async getCompaniesSelect({ commit }) {
			// seta o status do store de empresas para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			// curl --location --request GET 'http://localhost:3333/api/company?orderBy=id&order=asc&search=finer&_embed=true'
			const { data, status } = await API.get(
				// url da rota do back para fazer a requisição
				'/company?orderBy=name&order=asc&_embed=true', 
			)
			// seta o status do store de empresa para vazio 
			await commit('SET_STATUS', '')
			// caso o status seja 200 (requisiçao foi concluida) 
			if (status == 200) {
				// seta os dados no store
				await commit('SET_COMPANIES', data)
			}
			// retorna a resposta da requisição
			return data
		},
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

		async getWorkspacesSelect({ commit }) {
			// seta o status do store de empresas para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			// curl --location --request GET 'http://localhost:3333/api/company?orderBy=id&order=asc&search=finer&_embed=true'
			const { data, status } = await API.get(
				// url da rota do back para fazer a requisição
				'/workspace?orderBy=name&order=asc&_embed=true', 
			)
			// seta o status do store de empresa para vazio 
			await commit('SET_STATUS', '')
			// caso o status seja 200 (requisiçao foi concluida) 
			if (status == 200) {
				// seta os dados no store
				await commit('SET_WORKSPACES', data)
			}
			// retorna a resposta da requisição
			return data
		},
        async setCompanyUuid({ commit }, company_uuid) {
			// seta o status do store de empresas para loading
			await commit('SET_STATUS', 'loading')

            if(company_uuid != null) {
                await API.setHeader('app-company-uuid', company_uuid)
            }else{
                await API.deleteHeader('app-company-uuid')
            }

			await commit('SET_COMPANY_UUID', company_uuid)

			// seta o status do store de empresa para vazio 
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return true
		},
	},
	// funções para coletar o estado do store de usuários
	getters: {
		// coleta o status do store de usuários
		status_companies: state => state.status,
		// coleta os registros do store de usuários
		companies: state => state.companies,
		workspaces: state => state.workspaces,
		workspace_uuid: state => state.workspace_uuid,

		company_uuid: state => state.company_uuid,
	}
}