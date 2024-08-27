// importa os plugins de Request para fazer as requisições para o back
import API from '../plugins/api'

// exporta o store de funcionário
export default {
    // estado do store de funcionário
    state: {
        // status do store de funcionário
        status: null,
        // registro dos funcionários
        funcionarios: null,
    },
    // funções para modificar o estado do store de funcionário
    mutations: {
        // função para setar o status do store de funcionário
        SET_STATUS(state, status) {
            // seta o status do store de usuários
            state.status = status
        },
        // função para setar os registros de funcionários
        SET_FUNCIONARIOS(state, funcionarios) {
            // seta os registros de funcionários
            state.funcionarios = {
                // seta os registros de funcionários
                dados: funcionarios.users,
                // seta o total de registros dos funcionários
                total: funcionarios.total ? funcionarios.total : (funcionarios.users ? funcionarios.users.length : 0)
            }
        },
    },
    // funções para as ações do store de usuários
    actions: {
        /**
         * função para coletar os registros dos funcionários do back
         * @param {*} param0
         * @param {*} filters
         */
        async getFuncionarios({ commit }, filters) {
            // seta o status do store de funcionários para loading
            await commit('SET_STATUS', 'loading')
            // faz a requisição para o back
            const { data, status } = await API.get(
                // url da rota do back para fazer a requisição
                '/usersHours' +
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
            // seta o status do store de funcionário para vazio
            await commit('SET_STATUS', '')
            // caso o status seja 200 (requisição foi concluida)
            if(status == 200) {
                // seta os dados no store
                await commit('SET_FUNCIONARIOS', filters.page ? { users: data.data, total: data.meta.total } : data)
            }
            // retorna a resposta da requisição
            return data
        },
        /**
         * função para coletar os dados de um funcionário do back
         * @param {*} param0
         * @param {*} funcionario_uuid
         */
        async getHorario({ commit }, funcionario_uuid) {
            // seta o status do store de funcionário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.get('/usersHours/' + funcionario_uuid)
            // seta o status do store de funcionário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para atualizar os horários de um funcionário
         * @param {*} param0
         * @param {*} dados_horarios
         */
        async postHorario({ commit }, dados_horarios){
            // seta o status do store de funcionário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back coleta o resultado na variavel resp
            const resp = await API.post('/usersHours', dados_horarios)
            // seta o status do store de funcionário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para redirecionar o usuário
         * @param {*} param0
         */
         async redirectUser({ commit }){
            // seta o status do store de funcionário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variavel resp
            const resp = await API.post('/linkCalendar')
            // seta o status de store do funcionário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return window.open(resp.data, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')
        },
        /**
         * função para puxar os calendários de cada usuário
         * @param {*} param0 
         * @param {*} dados
         */
        async usersCalendar({ commit }, dados) {
            // seta o status de funcionário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.post('/usersCalendar', dados)
            // seta o status de funcionário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para puxar o calendário google do funcionário
         * @param {*} param0
         * @param funcionario_uuid
         */
        async getCalendars({ commit }, funcionario_uuid){
            // seta o status do store de funcionário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.get('/getCalendars/' + funcionario_uuid)
            // seta o status de store do funcionário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para editar a escolha de agenda do funcionário
         * @param {*} param0 
         * @param {*} date_update
         */
        async putEscolha({ commit }, date_update){
            // seta o status do store de funcionário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.put('usersCalendar/' + date_update.uuid, date_update.dados_funcionario)
            // seta o status do store de funcionário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
    },
    // funções para coletar o estado do store dos funcionários
    getters: {
        // coleta o status do store dos funcionários
        status_funcionarios: state => state.status,
        // coleta os registros do store dos funcionários
        funcionarios: state => state.funcionarios,
    }
}