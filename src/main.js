import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
import vuetify from '@/plugins/vuetify'
import VueTheMask from 'vue-the-mask'
import DatetimePicker from 'vuetify-datetime-picker'
import money from 'v-money'
// import HeadLoader from "vue-ext-files-head-loader";

Vue.use(VueTheMask)
Vue.use(DatetimePicker)
Vue.use(money, { precision: 2 })
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

// Vue.use(HeadLoader);

Vue.config.productionTip = false

Vue.prototype.moment = moment

moment.locale('pt-br')

new Vue({
	router,
	vuetify,
	store,
	render: h => h(App)
}).$mount('#app')
