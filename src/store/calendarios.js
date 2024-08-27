// importa o plugin para fazer requisições para o back
import API from '../plugins/api'

// exporta o store de calendário
export default {
    // estado do store de calendário
    state: {
        // status do store de calendário
        status: null,
        // registro dos calendário
        calendarios: null,
    },
    // funções para modificar o estado do store de calendário
    SET_STATUS(state, status){
        // seta o status do store de calendário
        state.status = status
    },
    // funções para as ações do store de calendário
    actions: {
        /**
         * função para cadastrar um agendamento manualmente
         * @param {*} param0
         * @param {*} dados
         */
        async postAgendamento({ commit }, dados){
            // seta o status do store de calendário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.post('/schedulings', dados)
            // seta o status do store de calendário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para cadastrar um bloqueio manualmente
         * @param {*} param0
         * @param {*} dados
         */
        async confirmarBloqueio({ commit }, dados){
            // seta o status do store de calendário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o beck e coleta o resultado na variável resp 
            const resp = await API.post('/blockSchedule', dados)
            // seta o status do store de calendário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para atualização de um agendamento
         * @param {*} param0 
         * @param {*} date_update 
         */
        async putScheduling({ commit }, date_update){
            // seta o status do store de calendário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.put('/schedulings/' + date_update.uuid, date_update.dados_agendamento)
            // seta o status do store de calendário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para excluir um agendamento
         * @param {*} param0
         * @param {*} date_delete
         */
        async deleteScheduling({ commit }, date_delete){
            // seta o status dp store de calendário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.delete('/schedulings/' + date_delete.uuid)
            // seta o status do store de calendário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para coletar os dados de um funcionário do back
         * @param {*} param0
         * @param {*} dados
         */
        async schedules({ commit }, dados){
            // seta o status do store de calendário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.post('/schedules', dados)
            // seta o status do store de calendário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * Função para coletar os funcionários com base na empresa
         * @param {*} param0
         * @param {*} company_uuid
         */
        async usersCompany({ commit }, company_uuid){
            // seta o status do store de calendário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.get('/usersCompany/' + company_uuid)
            // seta o status do store de calendário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para coletar os procedimento com base na empresa e no funcionário
         * @param {*} param0
         * @param {*} dados
         */
        async userCompanyProcedure({ commit }, dados){
            // seta o status do store de calendário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.post('/userCompanyProcedure', dados)
            // seta o status do store de calendário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para verificar se os horários são válidos
         * @param {*} param0
         * @param {*} dados
         */
        async verificaHorario({ commit }, dados){
            // seta o status do store de calendário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.post('/verificaHorario', dados)
            // seta o status do store de calendário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para coletar os horários disponíveis 
         * @param {*} param0
         * @param {*} dados
         */
        async horariosDisponiveis({ commit }, dados){
            // seta o status do store de calendário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.post('/horariosDisponiveis', dados)
            // seta o status do store de calendário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para coletar os procedimentos para o filtro
         * @param {*} param0
         * @param {*} dados
         */
        async procedimentosFiltro({ commit }, dados){
            // seta o status do store de calendário para loading
            await commit('SET_STATUS', 'loading')
            // faz a requisição para o back e coleta o resultado na variável resp
            const resp = await API.post('/procedimentosFiltro', dados)
            // seta o status de calendário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para coletar os funcionários para o filtro
         * @param {*} param0
         * @param {*} dados
         */
        async funcionariosFiltro({ commit }, dados){
            // seta o status do store de calendário para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variável resp
            const resp = await API.post('/funcionariosFiltro', dados)
            // seta o status do store de calendário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * função para coletar os status de agendamento para a modal
         * @param {*} param0
         */
        async schedulingStatus({ commit }){
            // seta o status do store de calendário para loading
            await commit('SET_STATUS', 'loading')
            // faz a requisição para o back e coleta o resultado na variável resp
            const resp = await API.get('/schedulingStatus')
            // seta o status do store de calendário para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        }
    },
    // função para coleta o estado do store de calendário
    getters: {
        // coleta o status do store de calendário
        status_calendar: state => state.status,
        // coleta os registros do store de calendários
        calendarios: state => state.calendarios
    }
}
