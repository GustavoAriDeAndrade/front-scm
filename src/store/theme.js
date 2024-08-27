// importa os plugins para fazer as requisições para o back
import API from '../plugins/api'

// exporta o store do usuário
export default {
    // estado do store de usuário
    state: {
        // status do store de usuários
        status: null,
        usuarios: null,
        theme:{
            logo:'https://media-exp2.licdn.com/dms/image/C4D0BAQEmk62FcHe-4w/company-logo_200_200/0/1657480784166?e=2147483647&v=beta&t=ScLtqxZak-KAq5QRBOVi5rmcsSEyShLG-_eT2i33bBE',
            name:'Ok Agenda',
            light: {
                primary: '#888a8c',
                secondary: '#a5a4a4',
                terciary: '#ff8304',
                info: '#ff8304',
                error: '#ff4545',
                accent: '#ff8304',
                success: '#44ad48',
                warning: '#ff8304',
                primarytabsbackgroud: '#fc8116',
            }
        }
    },
    // funções para modificar o estado de store do usuário
    mutations: {
        // função para pegar o status do store de usuários
        SET_STATUS(state, status) {
            // seta o status do store de usuários
            state.status = status 
        },
        // função para pegar o status do store de usuários
        SET_THEME(state, theme) {
            // seta o theme do store de usuários
            state.theme = theme 
        },
    },
    // função para as ações do store de usuários
    actions:{
        /**
         * @param {*} param0
         */
        async getUserTheme({ commit }){
            // seta o status do store para loading
            await commit('SET_STATUS', 'loading')
            // faz a requisição e armazena na resp
            const resp = await API.get('/theme')
            if(resp.data != undefined){
                await commit('SET_THEME',resp.data)
            }
            // seta o status do store para vazio
            await commit('SET_STATUS', '')
            // retorna a resposta da requisição
            return resp
        },
    },
    // função para coletar o estado do store
    getters: {
        status_usarios: state => state.status,
        theme: state=> state.theme
    }
}