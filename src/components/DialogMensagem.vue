<template>
	<v-dialog v-model="show_dialog" max-width="350px">
		<v-card>
			<v-card-title class="headline">
				{{mensagem.titulo}}
			</v-card-title>
			<v-card-text>
				{{mensagem.mensagem}}
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="secondary" dark  @click="show_dialog=false">
					Ok
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		props: ["mensagem", "visible"],
		name: 'DialogMensagem',
		computed: {
			show_dialog: {
				get () {
					return this.visible
				},
				set (value) {
					if (!value) {
						this.$emit('close')
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	
</style>