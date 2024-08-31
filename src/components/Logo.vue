<template>
	<figure id="logo">
		<img class="img-responsive" alt="Logo" :src="'./images/login.jpeg'">
	</figure>
</template>

<script>
	export default {
		name: 'Logo',
	}
</script>

<style lang="scss">
	#logo{
		justify-content: center;
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		margin: auto;
		max-width: 150px;
		margin-bottom: 30px;
		margin-top: 30px;
		img{
			width: 100%;
		}
	}
</style>