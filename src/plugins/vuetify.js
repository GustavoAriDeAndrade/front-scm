import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const opts = {
    theme: {
        themes: {
            light: {
                primary: '#888a8c',
                secondary: '#a5a4a4',
                accent: '#ff8304',
                error: '#ff4545',
                info: '#ff8304',
                success: '#44ad48',
                warning: '#ff8304',
            },
        },
    },
    icons: {
        iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
}

export default new Vuetify(opts)