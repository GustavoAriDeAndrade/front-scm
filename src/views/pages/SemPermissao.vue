<template>
	<div class="sem-permissao">
		<h2>
			Você não tem permissão para acessar esta página!
		</h2>
	</div>
</template>

<script>
	export default {
		name: 'SemPermissao',
	}
</script>

<style lang="scss" scoped>
	.sem-permissao{
		display: flex;
		height: 100%;
		padding: 24px;
		h2{
			border-radius: 5px;
			background-color: #fff;
			font-style: normal;
			font-weight: 700;
			font-size: 18px;
			line-height: 22px;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			flex: 1;
			color: #373737;
			margin-bottom: 5px;
		}
	}
</style>