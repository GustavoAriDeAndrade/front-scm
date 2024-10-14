import Vue from 'vue'
import Vuex from 'vuex'

import config from "@/store/config.js"
import login from "@/store/login.js"
import usuarios from "@/store/usuarios.js"
import application from "@/store/application.js"
import produtos from "@/store/produtos.js"
import relatorios from '@/store/relatorios'
import clientes from '@/store/clientes'
import vendas from '@/store/vendas'
import pagamentos from '@/store/pagamentos'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		config,
		login,
		usuarios,
		application,
		produtos,
		relatorios,
		clientes,
		vendas,
		pagamentos,
	},
})