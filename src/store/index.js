import Vue from 'vue'
import Vuex from 'vuex'

import config from "@/store/config.js"
import login from "@/store/login.js"
import usuarios from "@/store/usuarios.js"
import application from "@/store/application.js"
import procedimentos from "@/store/procedimentos.js"
import relatorios from '@/store/relatorios'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		config,
		login,
		usuarios,
		application,
		procedimentos,
		relatorios,
	},
})