<template>
	<v-dialog v-model="dialog_loading" max-width="300px" persistent>
		<v-card>
			<v-card class="loader">
				<v-card-text class="loader">
					Processando
					<v-progress-linear indeterminate color="white" class="mb-0"/>
				</v-card-text>
			</v-card>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		name: 'Loader',
		data: () => ({
			dialog_loading: true
		})
	}
</script>