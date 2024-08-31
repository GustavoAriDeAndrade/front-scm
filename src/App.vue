<template>
	<v-app id="app" :style="userStyle">
		<router-view/>
	</v-app>
</template>
<script>
	export default {
		data(){
			return {
				primary: '#888a8c',
				secondary: '#a5a4a4',
				accent: '#ff8304',
				error: '#ff4545',
				info: '#ff8304',
				success: '#44ad48',
				warning: '#ff8304',
				terciary: '#ff8304',
				primarytabsbackgroud: '#fc8116',
			}
		},
		methods: {
			handleResize() {
				this.$store.dispatch('setScreenSize')
			}
		},
		created() {
			window.addEventListener('resize', this.handleResize)
			this.handleResize()
		},
		destroyed() {
			window.removeEventListener('resize', this.handleResize)
		},
		async mounted(){

			document.title = 'SCM'
			//document.querySelector("head > link:nth-child(5)").href = ''
			this.primary = '#888a8c'
			this.secondary = '#a5a4a4'
			this.accent = '#ff8304'
			this.error = '#ff4545'
			this.info = '#ff8304'
			this.success = '#44ad48'
			this.warning = '#ff8304'
			this.terciary = '#ff8304'
			this.primarytabsbackgroud = '#fc8116'

		},
		computed: {
			userStyle () {
				return {
					'--primary-color': '#888a8c',
					'--secondary-color': '#a5a4a4',
					'--accent-color': '#ff8304',
					'--error-color': '#ff4545',
					'--info-color': '#ff8304',
					'--success-color': '#44ad48',
					'--warning-color': '#ff8304',
					'--terciary-color': '#ff8304',
					'--backTabs-color': '#fc8116'
				}
			}
		}
	}
</script>
<style lang="scss">
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: $primaryfontcolor;
		min-height: 100vh;
		display: flex;
		max-width: 100vw
	}
</style>