// importa os plugins de Request para fazer as requisições para o back
import API from '../plugins/api'

// exporta o store do produto
export default {
    // estado do store do produto
    state: {
        // status do store de produtos
        status: null,
        // registro dos produtos
        produtos: null,
    },
    // funções para modificar o estado do store do store de produtos
    mutations: {
        // função para setar o status do store de produto
        SET_STATUS(state, status) {
            // seta o status do store de produtos
            state.status = status
        },
        // função para os registros de produtos
        SET_PRODUTOS(state, produtos) {
            // seta os registros de produtos
            state.produtos = {
                // seta os registros de produtos
                dados: produtos.products,
                // seta o total de registros de produtos
                total: produtos.total ? produtos.total : (produtos.products ? produtos.products.length : 0)
            }
        },
    },
    // funções para as ações do store de produtos
    actions: {
        /**
         * função para coletar os registros dos produtos do back
         * @param {*} param0
         * @param {*} filters
         */
        async getProdutos({ commit }, filters) {
            // seta o status do store para loading
            await commit('SET_STATUS', 'loading')
                // faz a requisição para o back
                const { data, status } = await API.get(
                    // url da rota do back para fazer a requisição
                    '/product' +
                    // por qual coluna devem ser organizados os registros
                    (filters.order_column ? ('?orderBy=' + filters.order_column) : '?orderBy=nome') +
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
                await commit('SET_PRODUTOS', filters.page ? { products: data.data, total: data.meta.total } : data)
            }
            // retorna a resposta da requisição
            return data
        },
        
        /**
         * função para coletar apenas um produto do back
         * @param {*} param0
         * @param {*} produto_id
         */
        async getProduto({ commit }, produto_id) {
            // seta o status do store de produto para loading
            await commit ('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variavel resp
            const resp = await API.get('/product/' + produto_id)
            // seta o status do store de produto para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },

        /**
         * função para criar ou editar 1 produto
         * @param {*} param0
         * @param {*} dados_produto
         */
        async postProduto({ commit }, dados_produto) {
            // seta o status do store para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variavel resp
            const resp = await API.post('/product', dados_produto)
            // seta o status do store para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
        /**
         * Função para editar um produto
         * @param {*} param0 
         * @param {*} date_update 
         */
        async putProduto({ commit }, date_update) {
            // seta o status do store para loading
            await commit('SET_STATUS', 'loading')
            // faz uma requisição para o back e coleta o resultado na variavel resp
            const resp = await API.put('/product/' + date_update.id, date_update.dados_produto)
            // seta o status do store de produto para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
    },
    // funções para coletar o estado do store de produtos
    getters: {
        // coleta o estado do store de produtos
        status_produtos: state => state.status,
        // coleta os registros do store de produtos
        produtos: state => state.produtos,
    }
}