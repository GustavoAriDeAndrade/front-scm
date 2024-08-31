<template>
	<figure id="background-esquerda">
		<img class="img-login" alt="Imagem" :src="'./img/login.jpg'">
	</figure>
</template>

<script>
	export default {
		name: 'LoginEsquerda'
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