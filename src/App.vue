<template>
	<v-app id="app" :style="userStyle">
		<router-view/>
	</v-app>
</template>
<script>
	import store from '@/store'
	export default {
		data() {
			return {
				theme:store.getters.theme,
				primary: store.getters.theme.light.primary,
                secondary: store.getters.theme.light.secondary,
                accent: store.getters.theme.light.accent,
                error: store.getters.theme.light.error,
                info: store.getters.theme.light.info,
                success: store.getters.theme.light.success,
                warning: store.getters.theme.light.warning,
				terciary: store.getters.theme.light.terciary,
				primarytabsbackgroud: store.getters.theme.light.primarytabsbackgroud,
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
			await store.dispatch('getUserTheme')

				this.theme=store.getters.theme
				document.title = this.theme.name
				document.querySelector("head > link:nth-child(5)").href =this.theme.logo
				this.primary= store.getters.theme.light.primary
				this.secondary= store.getters.theme.light.secondary
				this.accent= store.getters.theme.light.accent
				this.error= store.getters.theme.light.error
				this.info= store.getters.theme.light.info
				this.success= store.getters.theme.light.success
				this.warning= store.getters.theme.light.warning
				this.terciary= store.getters.theme.light.terciary
				this.primarytabsbackgroud= store.getters.theme.light.primarytabsbackgroud
		
		},
		computed: {
			userStyle () {
				return {
					'--primary-color': this.primary,
					'--secondary-color': this.secondary,
					'--accent-color': this.accent,
					'--error-color': this.error,
					'--info-color': this.info,
					'--success-color': this.success,
					'--warning-color': this.warning,
					'--terciary-color': this.terciary,
					'--backTabs-color': this.primarytabsbackgroud
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