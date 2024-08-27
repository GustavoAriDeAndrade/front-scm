export default {
	state: {
		open_menu: true,
		screen_size: {
			width: 0,
			height: 0
		}
	},
	mutations: {
		SET_MENU(state, value) {
			state.open_menu = value
		},
		TOGGLE_MENU(state) {
			state.open_menu = !state.open_menu
		},
		SET_SCREEN_SIZE(state, size) {
			state.screen_size = size
		},
	},
	actions: {
		toggleMenu({ commit }) {
			commit('TOGGLE_MENU')
		},
		setScreenSize({ commit }) {
			let size = { 
				width: window.innerWidth, 
				height: window.innerHeight 
			}
			commit('SET_SCREEN_SIZE', size)
			if (size.width < 1200 && size.width >= 768) {
				commit('SET_MENU', false)
			} else if (size.width < 768) {
				commit('SET_MENU', false)
			} else {
				commit('SET_MENU', true)
			}
		}
	},
	getters: {
		open_menu: state => state.open_menu,
		screen_size: state => state.screen_size,
	}
}