<template>
	<figure id="logo">
		<img class="img-responsive" alt="Logo" :src="$store.getters.theme.logo">
	</figure>
</template>

<script>
	import store from '@/store'
	export default {
		name: 'Logo',
		data() {
			return {
				theme:store.theme
			}
		},
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