// importa os plugins de Request para fazer as requisições para o back
import API from '../plugins/api'

// exporta o store de caixa
export default {
    // estado do store de caixa
    state: {
        // status do store de caixa
        status: null
    },
    // funções para modificar o estado do store de caixa
    mutations: {
        // função para setar o status do store de caixa
        SET_STATUS(state, status){
            // seta o status do store de caixa
            state.status = status
        },
    },
    // funções para as ações do store de caixa
    actions: {
		/**
		 * função para cadastrar uma nova compra
		 * @param {*} param0 
		 * @param {*} dados_compra 
		 */
		async postCompra({ commit }, dados_compra) {
			// seta o status do store de caixa para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			const resp = await API.post('/sale', dados_compra)
			// seta o status do store de caixa para vazio 
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},
		/**
		 * função para listar as formas de pagamento cadastradas
		 * @param {*} param0 
		 * @returns 
		 */
		async getFormasPagamento({ commit }) {
			// seta o status do store de caixa para loading
			await commit('SET_STATUS', 'loading')
			// faz uma requisição para o back e coleta o resultado na variavel resp
			const resp = await API.get('/selectFormaPagamento')
			// seta o status do store de cliente para vazio 
			await commit('SET_STATUS', '')
			// retorna a resposta da requisição
			return resp
		},
    },
    // funções para coletar o estado do store de caixa
    getters: {
        // coleta o estado do store de caixa
        status_caixa: state => state.status,
    }
}