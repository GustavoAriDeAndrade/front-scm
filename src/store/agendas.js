// importa os plugins de Request para fazer as requisições para o back
import API from '../plugins/api'

// exporta o store de funcionário
export default {
    // estado do store de agendas
    state: {
        // status do store de agendas
        status: null,
        // registro das agendas
        registros: null,
    },
    // funções para modificar o estado do store de agendas
    mutations: {
        // função para setar o status do store das agendas
        SET_STATUS(state, status) {
            // seta o status do store das agendas
            state.status = status
        },
        // função para setar os registros das agendas
        SET_AGENDAS(state, registros) {
            // seta os registros das agendas
            state.registros = {
                // seta os registros de agendas
                dados: registros.agendas,
                // seta o total de registros de agendas
                total: registros.total ? registros.total : (registros.agendas ? registros.agendas.length : 0)
            }
        },
    },
    // funções para as ações do store de agendas
    actions: {
        /**
         * função para coletar os resgistros de agendas do back 
         * @param {*} param0
         * @param {*} filters
         */
        async getAgendas({ commit }, filters) {
            // seta o status de store de agendas para loading
            await commit('SET_STATUS', 'loading')
            // faz a requisição para o back
            const { data, status } = await API.get(
                // url da rota do back para fazer a requisição
                '/agendas' +
                // por qual coluna devem ser ordenados os registros
                (filters.order_column ? ('?orderBy=' + filters.order_column) : '?orderBy=uuid') +
                // qual a ordem que deve ser ordenado (ASC ou DESC)
                (filters.order_dir ? '&order=' + filters.order_dir : '&order=asc') +
                // qual a quantidade de dados
                (filters.limit ? '&limit=' + filters.limit : '') +
                // qual a página
                (filters.page ? '&page=' + filters.page + '&_embed=false' : '&_embed=true') +
                // os registros que contém a busca solicitada
                (filters.search ? '&search=' + filters.search : ''),
            )
            // seta o status do store de agendas para vazio
            await commit('SET_STATUS', '')
            // caso o status seja 200 (requisição foi concluida)
            if(status == 200) {
                // seta os dados no store
                await commit('SET_AGENDAS', filters.page ? { agendas: data.data, total: data.meta.total } : data)
            }
            // retorna a resposta da requisição
            return data
        },
        /**
         * função para coletar os dados de uma agenda do back
         * @param {*} param0
         * @param {*} agenda_uuid
         */
        async getAgenda({ commit }, agenda_uuid) {
            // seta o status do store de agendas para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.get('/agendas/' + agenda_uuid)
            // seta o status do store de agendas para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para adicionar dados de uma agenda
         * @param {*} param0
         * @param {*} dados_agenda
         */
        async postAgenda({ commit }, dados_agenda){
            // seta o status do store de agenda para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.post('/agendas', dados_agenda)
            // seta o status do store de agendas para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para editar os dados de uma agenda
         * @param {*} param0
         * @param {*} date_update
         */
        async putAgenda({ commit }, date_update){
            // seta o status do store de agendas para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.put('/agendas/' + date_update.uuid, date_update.dados_agenda)
            // seta o status do store de agendas para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * Função para coletar as api's para a modal
         * @param {*} param0
         */
        async getApis({ commit }){
            // seta o status do store de agendas para loading
            await commit('SET_STATUS', 'loading')
            // faz a requisição para o back e coleta o resultado na variável resp
            const resp = await API.get('/getApis')
            // seta o status de agendas para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para coletar os procedimentos com base na empresa
         * @param {*} param0
         * @param {*} dados
         */
        async getProcedimentosEmpresa({ commit }, dados){
            // seta o status do store de agendas para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.post('/companyProcedures', dados)
            // seta o status do store de agendas para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para pegar os funcinoários passando o procedimento
         * @param {*} param0 
         * @param {*} dados
         */
        async userByProcedure({ commit }, dados) {
            // seta o status do store de agenda para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o bacl e coleta o resultado na variável resp
            const resp = await API.post('/usersByProcedure', dados)
            // seta o status do store de agendas para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
    },
    // funções para coletar o estado do store dos funcionários
    getters: {
        // coleta o status do store das agendas
        status_agendas: state => state.status,
        // coleta os registros do store das agendas
        registros: state => state.registros,
    }
}