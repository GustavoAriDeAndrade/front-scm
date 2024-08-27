import Vue from 'vue'
import Vuex from 'vuex'

import config from "@/store/config.js"
import login from "@/store/login.js"
import usuarios from "@/store/usuarios.js"
import empresas from "@/store/empresas.js"
import application from "@/store/application.js"
import theme from "@/store/theme.js"
import procedimentos from "@/store/procedimentos.js"
import funcionarios from "@/store/funcionarios.js"
import agenda from "@/store/agendas.js"
import calendarios from "@/store/calendarios.js"
import relatorios from '@/store/relatorios'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		config,
		login,
		usuarios,
		empresas,
		application,
		theme,
		procedimentos,
		funcionarios,
		agenda,
		calendarios,
		relatorios,
	},
})