// importa os plugins de Request para fazer as requisições para o back
import API from '../plugins/api'

// exporta o store de relatórios
export default {
    // estado do store de relatórios
    state: {
        // status do store de relatórios
        status: null
    },
    // funções para modificar o estado do store de relatórios
    mutations: {
        // função para setar o status do store de relatórios
        SET_STATUS(state, status){
            // seta o status do store de relatórios
            state.status = status
        },
    },
    // funções para as ações do store de relatórios
    actions: {

        /**
         * Função para buscar os dados para o relatório
         * @param {*} param0 
         * @param {*} dados 
         * @returns 
         */
        async relatorio({ commit }, dados){
            // seta o status do store para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na varáivel resp
            const resp = await API.get('/report', dados)
            // seta o status do store para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        }
    },
    // funções para coletar o estado do store de relatórios
    getters: {
        // coleta o estado do store de relatórios
        status_relatorios: state => state.status,
    }
}