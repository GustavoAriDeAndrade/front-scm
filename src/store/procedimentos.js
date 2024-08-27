// importa os plugins de Request para fazer as requisições para o back
import API from '../plugins/api'

// exporta o store do procedimento
export default {
    // estado do store do procedimento
    state: {
        // status do store de procedimentos
        status: null,
        // registro dos procedimentos
        procedimentos: null,
    },
    // funções para modificar o estado do store do store de procedimentos
    mutations: {
        // função para setar o status do store de procedimento
        SET_STATUS(state, status) {
            // seta o status do store de procedimentos
            state.status = status
        },
        // função para os registros de procedimentos
        SET_PROCEDIMENTOS(state, procedimentos) {
            // seta os registros de procedimentos
            state.procedimentos = {
                // seta os registros de procedimentos
                dados: procedimentos.procedures,
                // seta o total de registros de procedimentos
                total: procedimentos.total ? procedimentos.total : (procedimentos.procedures ? procedimentos.procedures.length : 0)
            }
        },
    },
    // funções para as ações do store de procedimentos
    actions: {
        /**
         * função para coletar os registros dos procedimentos do back
         * @param {*} param0
         * @param {*} filters
         */
        async getProcedimentos({ commit }, filters) {
            // seta o status do store para loading
            await commit('SET_STATUS', 'loading')
                // faz a requisição para o back
                const { data, status } = await API.get(
                    // url da rota do back para fazer a requisição
                    '/procedure' +
                    // por qual coluna devem ser organizados os registros
                    (filters.order_column ? ('?orderBy=' + filters.order_column) : '?orderBy=created_at') +
                    // qual a ordem que deve ser ordenado (ASC ou DESC)
                    (filters.order_dir ? '&order=' + filters.order_dir : '&order=asc') +
                    // qual a quantidade de dados 
                    (filters.limit ? '&limit=' + filters.limit : '') +
                    // qual a página
                    (filters.page ? '&page=' + filters.page + '&_embed=false' : '&_embed=true') +
                    // os registros que contém a busca solicitada
                    (filters.search ? '&search=' + filters.search : ''),
                )
            // seta o status para vazio
            await commit('SET_STATUS', '')
                // caso o status seja 200 (requisição foi concluida)
                if (status == 200) {
                // seta os dados do store
                await commit('SET_PROCEDIMENTOS', filters.page ? { procedures: data.data, total: data.meta.total } : data)
            }
            // retorna a resposta da requisição
            return data
        },
        
        /**
         * função para coletar apenas um procedimento do back
         * @param {*} param0
         * @param {*} procedimento_uuid
         */
        async getProcedimento({ commit }, procedimento_uuid) {
            // seta o status do store de usuarios para loading
            await commit ('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variavel resp
            const resp = await API.get('/procedure/' + procedimento_uuid)
            // seta o status do store de usuario para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },

        /**
         * função para criar ou editar 1 procedimento
         * @param {*} param0
         * @param {*} dados_procedimento
         */
        async postProcedimento({ commit }, dados_procedimento) {
            // seta o status do store para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variavel resp
            const resp = await API.post('/procedure', dados_procedimento)
            // seta o status do store para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        // função para atualizar 1 procedimento
        async putProcedimento({ commit }, date_update) {
            // seta o status do store para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variavel resp
            const resp = await API.put('/procedure/' + date_update.uuid, date_update.dados_procedimento)
            // seta o status do store de usuario para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
		/**
		 * função para coletar os procedimentos
		 * @param {*} param0
		 */
		async getProcedures({ commit }){
			// seta o status do store de procedimentos para loading
			await commit('SET_STATUS', 'loading')
			// faz a requisição para o back e coleta o resultado na variável resp
			const resp = await API.get('/getProcedures')
			// seta o status de procedimentos para vazio
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		}
    },
    // funções para coletar o estado do store de procedimentos
    getters: {
        // coleta o estado do store de procedimentos
        status_procedimentos: state => state.status,
        // coleta os registros do store de procedimentos
        procedimentos: state => state.procedimentos,
    }
}