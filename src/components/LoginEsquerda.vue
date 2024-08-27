<template>
	<figure id="background-esquerda">
		<img class="img-login" alt="Imagem" :src="$store.getters.theme.logo_esquerda">
	</figure>
</template>

<script>
	import store from '@/store'
	export default {
		name: 'LoginEsquerda',
		data() {
			return {
				theme:store.theme
			}
		},
	}
</script>

<style lang="scss">
	#background-esquerda{
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		padding-right: 12px;
	}
</style>