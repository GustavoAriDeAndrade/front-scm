import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import store from '@/store'

Vue.use(Vuetify)

const opts = {
    theme: {
        themes: {
            light: {
                primary: store.getters.theme.light.primary,
                secondary: store.getters.theme.light.secondary,
                accent: store.getters.theme.light.accent,
                error: store.getters.theme.light.error,
                info: store.getters.theme.light.info,
                success: store.getters.theme.light.success,
                warning: store.getters.theme.light.warning,
            },
        },
    },
    icons: {
        iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
}

export default new Vuetify(opts)