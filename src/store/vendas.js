// importa os plugins de Request para fazer as requisições para o back
import API from '../plugins/api'

// exporta o store do venda
export default {
    // estado do store do venda
    state: {
        // status do store de vendas
        status: null,
        // registro dos vendas
        vendas: null,
    },
    // funções para modificar o estado do store do store de vendas
    mutations: {
        // função para setar o status do store de venda
        SET_STATUS(state, status) {
            // seta o status do store de vendas
            state.status = status
        },
        // função para os registros de vendas
        SET_VENDAS(state, vendas) {
            // seta os registros de vendas
            state.vendas = {
                // seta os registros de vendas
                dados: vendas.sales,
                // seta o total de registros de vendas
                total: vendas.total ? vendas.total : (vendas.sales ? vendas.sales.length : 0)
            }
        },
    },
    // funções para as ações do store de vendas
    actions: {
        /**
         * função para coletar os registros das vendas do back
         * @param {*} param0
         * @param {*} filters
         */
        async getVendas({ commit }, filters) {
            // seta o status do store para loading
            await commit('SET_STATUS', 'loading')
            // faz a requisição para o back
            const { data, status } = await API.get(
                // url da rota do back para fazer a requisição
                '/sale' +
                // por qual coluna devem ser organizados os registros
                (filters.order_column ? ('?orderBy=' + filters.order_column) : '?orderBy=id') +
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
                await commit('SET_VENDAS', filters.page ? { sales: data.data, total: data.meta.total } : data)
            }
            // retorna a resposta da requisição
            return data
        },
        
        /**
         * função para coletar apenas uma venda do back
         * @param {*} param0
         * @param {*} venda_id
         */
        async getVenda({ commit }, venda_id) {
            // seta o status do store de venda para loading
            await commit ('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variavel resp
            const resp = await API.get('/sale/' + venda_id)
            // seta o status do store de venda para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },

        /**
         * Função para editar uma venda
         * @param {*} param0 
         * @param {*} date_update 
         */
        async putVenda({ commit }, date_update) {
            // seta o status do store para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variavel resp
            const resp = await API.put('/sale/' + date_update.id, date_update.dados_venda)
            // seta o status do store de venda para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
    },
    // funções para coletar o estado do store de vendas
    getters: {
        // coleta o estado do store de vendas
        status_vendas: state => state.status,
        // coleta os registros do store de vendas
        vendas: state => state.vendas,
    }
}