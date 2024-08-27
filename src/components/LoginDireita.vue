<!--
<template>
	<figure id="background">
		<img class="img-responsive" alt="Imagem" :src="imagem">
	</figure>
</template>

<script>
	import Imagem from "@/assets/images/backD.jpg"
	export default {
		name: 'LoginDireita',
		data() {
			return {
				imagem: Imagem,
			}
		},
	}
</script>
<style lang="scss">
	#background{
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
		display: flex;
		flex-wrap: wrap;
        img{
            height: 100%;
            margin-left: 0;
        }
	}
</style>