
<template>
	<div id="clientes">
		<div class="tabela-cliente">
			<div class="col-12 novo-cliente">
				<!-- botão para ativação da modal -->
				<v-btn class="primary-button" raised @click="createCliente">
					<i class="fas fa-user-plus"></i> 
					Cadastrar Cliente
				</v-btn>
			</div>
			<!-- tabela que ira conter as informações de cada cliente -->
			<CustomTable 
				v-if="headers != ''"
				:action="'getClientes'"
				:getter="$store.getters.clientes"
				:headers="headers"
				:search="true"
				:title="'Clientes'"
				:icone="'fas fa-user-friends'"
				:pagination="true"
				:filters="filtros"
				ref="tabela"
			>
				<template v-slot:ativo="{ item }">
					<span v-if="item.ativo">
						Ativo
						<img src="./../../assets/images/icon-ativo.png">
					</span>
					<span v-else>
						Inativo
						<img src="./../../assets/images/icon-inativo.png">
					</span>
				</template>
				<!-- botões para ativação das modais presentes na tabela -->
				<template v-slot:acoes="{ item }">
					<v-btn class="primary-button" raised small @click="editarCliente(item.id)">
						<i class="fas fa-cog"></i>
						Editar
					</v-btn>
				</template>
			</CustomTable>
			<!-- modal para cadastro/edição de um cliente -->
			<v-dialog v-model="dialog_cliente" persistent max-width="600px">
				<v-card>
					<v-card-title>
						<span v-if="cliente.cliente_id" class="headline">Editar Cliente</span>
						<span v-else class="headline">Novo Cliente</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-form ref="form_cliente">
								<div class="row">
									<div class="col-12 div-input">
										<v-text-field 
											:rules="[v => !!v || 'Campo Nome obrigatório']" 
											v-model="cliente.nome" 
											label="Nome" 
											placeholder="Nome" 
											background-color="white"
											hide-details
											outlined
											prepend-inner-icon="mdi-account"
										/>
									</div>
									<div class="col-12 div-input">
										<v-text-field 
											:rules="[v => !!v || 'Campo Telefone obrigatório']" 
											v-model="cliente.telefone" 
											label="Telefone" 
											placeholder="Telefone" 
											background-color="white"
                      						v-mask="'(##) # ####-####'"
											hide-details
											outlined
										/>
									</div>
									<div class="col-12 div-input">
										<v-text-field 
											type="email"
											v-model="cliente.email" 
											label="E-mail" 
											placeholder="E-mail" 
											background-color="white"
											hide-details
											outlined
											prepend-inner-icon="mdi-email-outline"
										/>
									</div>
									<div class="col-10 div-input">
										<v-text-field 
											:rules="[v => !!v || 'Campo Rua obrigatório']" 
											v-model="cliente.rua" 
											label="Rua" 
											placeholder="Rua" 
											background-color="white"
											hide-details
											outlined
										/>
									</div>
									<div class="col-2 div-input">
										<v-text-field 
											:rules="[v => !!v || 'Campo Número obrigatório']" 
											type="email"
											v-model="cliente.numero" 
											label="Nº" 
											placeholder="Nº" 
											background-color="white"
											hide-details
											outlined
										/>
									</div>
									<div class="col-12 div-input">
										<v-textarea
											v-model="cliente.observacao"
											label="Observação"
											placeholder="Observação"
											background-color="white"
											hide-details
											outlined
										/>
									</div>
									<div v-if="cliente.cliente_id"  class="col-6 div-input">
										<v-select 
											:rules="[v => !!v || 'Campo Status obrigatório']" 
											:items="['Ativo', 'Inativo']" 
											v-model="cliente.ativo" 
											label="Status" 
											placeholder="Status" 
											background-color="white"
											hide-details
											outlined
										/>
									</div>
								</div>
							</v-form>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeCliente">
							Cancelar
						</v-btn>
						<v-btn class="primary-button" small @click="enviarCliente">
							Salvar
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<DialogMensagem :visible="dialog_resposta" :mensagem="resposta" @close="dialog_resposta=false"/>
			<Loader v-if="loading"/>
		</div>
	</div>
</template>
<!--funções para trazer e encaminhar os dados das modais e da tabela-->
<script>
	// importa o store
	import store from '@/store'
	// importa o componente de DialogMensagem 
	import DialogMensagem from '@/components/DialogMensagem.vue'
	// importa o componente de Loader 
	import Loader from '@/components/Loader.vue'
	// importa o componente de CustomTable 
	import CustomTable from '@/components/CustomTable.vue'

	// exporta o componente
	export default {
		// nome do componente
		name: 'Clientes',
		// componentes filhos
		components: {
			// componente de DialogMensagem
			DialogMensagem,
			// componente de CustomTable
			CustomTable,
			// componente de Loader
			Loader,
		},
		// dados do componente
		data: () => ({
			// variável para mostrar a modal para editar/criar um cliente
			dialog_cliente: false,
			// variável para mostrar a modal de informação
			dialog_resposta: false,
			// variável para a mensagem de resposta
			resposta: {},
			// variável para o loading
			loading: false,
			// variável para criar/editar cliente
			cliente: {
				cliente_id: '',
				nome: '',
				telefone: '',
				email: '',
				observacao: '',
				rua: '',
				numero: '',
				ativo: '',
			},
			// variável para o cabeçalho da tabela
			headers: [
				{
					value: 'nome',
					text: 'Nome',
					sortable: true,
				},
				{
					value: 'telefone',
					text: 'Telefone',
					sortable: true,
				},
				{
					value: 'email',
					text: 'Email',
					sortable: true,
				},
				{
					value: 'ativo',
					text: 'Status',
					sortable: true,
				},
				{
					value: 'acoes',
					sortable: false,
					text: 'Ações',
				},
			],
			// variável para os filtros da tabela
			filtros: {
				perPage: 20,
			},
		}),
		// funções deste componente
		methods: {
			// função para abrir a modal do cliente 
			async createCliente(){
				// abre a modal de cadastro/edição de cliente
				this.dialog_cliente = true
			},	
			// função para enviar um cliente
			async enviarCliente(){
				let resp = {}
				// caso os campos do formulário estejam válidos
				if (this.$refs.form_cliente.validate()){
					// coloca o componente como loading
					this.loading = true
					// coleta os dados do cliente
					let dados = {
						// coleta o nome do cliente
						nome: this.cliente.nome,
						// coleta o telefone do cliente
						telefone: this.cliente.telefone,
						// coleta o email do cliente
						email: this.cliente.email,
						// coleta a observação do cliente
						observacao: this.cliente.observacao,
						// coleta a rua do cliente
						rua: this.cliente.rua,
						// coleta o numero da rua do cliente
						numero: this.cliente.numero,			
					}
					// caso exista um cliente_id 
					if(this.cliente.cliente_id){
						// coleta o status do cliente
						dados.ativo = this.cliente.ativo == 'Ativo' ? true : false
						// armazena os dados para realizar a atualização
						let date_update = {
							dados_cliente: dados,
							id: this.cliente.cliente_id
						}
						// rota para a atualização dos dados do cliente
						resp = await store.dispatch('putCliente', date_update)
					}else{
						// coleta o status do cliente
						dados.ativo = true
						// rota para a criação dos dados dados do cliente
						resp = await store.dispatch('postClientes', dados)
					}
					// caso algo tenha dado errado
					if(resp.status != 200 && resp.status != 201){
						// atribui o título da mensagem 
						this.resposta.titulo = 'Algo deu errado!'
						// atribui o corpo da mensagem 
						this.resposta.mensagem = await resp.data.message || resp.data.error
						// mostra a mensagem
						this.dialog_resposta = true
					// caso tenha dado tudo certo
					}else{
						// atribui o título da mensagem 
						this.resposta.titulo = 'Cliente ' +  (this.cliente.cliente_id ? 'editado!' : 'cadastrado!')
						// atribui o corpo da mensagem 
						this.resposta.mensagem = 'Cliente ' + (this.cliente.cliente_id ? 'editado' : 'cadastrado') + ' com sucesso!'
						// fecha a modal de create/edit cliente
						this.closeCliente()
						// mostra a mensagem
						this.dialog_resposta = true
					}
					// retira o loading do componente
					this.loading = false
					// atualiza a tabela
					this.$refs.tabela.init()
				}
			},
			// função para coletar um cliente para editar
			async editarCliente(cliente_id){
				// coloca o componente como loading
				this.loading = true
				// faz um dispatch para uma action no vuex store para pegar um cliente passando o id 
				var resp = await store.dispatch('getCliente', cliente_id)
				// caso o status da resposta seja 200 (deu certo) 
				if(resp.status == 200){
					// atribui os dados do cliente vindos do back à váriável local
					this.cliente.cliente_id = await resp.data.client.id || ''
					this.cliente.nome = await resp.data.client.nome || ''
					this.cliente.telefone = await resp.data.client.telefone || ''
					this.cliente.email = await resp.data.client.email || ''
					this.cliente.observacao = await resp.data.client.observacao || ''
					this.cliente.rua = await resp.data.client.rua || ''
					this.cliente.numero = await resp.data.client.numero || ''
					this.cliente.ativo = await resp.data.client.ativo ? 'Ativo' : 'Inativo'
					// mostra a modal de creat/edit cliente
					this.createCliente()
				}else{
					// atribui o título da mensagem 
					this.resposta.titulo = 'Algo deu errado!'
					// atribui o corpo da mensagem 
					this.resposta.mensagem = await resp.data.message || resp.data.error
					// mostra a mensagem
					this.dialog_resposta = true
				}
				// retira o loading do componente
				this.loading = false
				// atualiza a tabela
				this.$refs.tabela.init()
			},
			// função que roda quando é fechada a modal de create/edit cliente
			closeCliente(){
				// fecha a modal
				this.dialog_cliente = false
				// limpa os dados locais do cliente
				this.cliente =  {
					cliente_id: '',
					nome: '',
					telefone: '',
					email: '',
					observacao: '',
					rua: '',
					numero: '',
				}
			},
		},
		// variaveis computadas em tempo real
		computed: {}
	}
</script>
<!-- scss do front -->
<style lang="scss">
	#clientes { /* Ajuste para a classe correta */
		display: flex;
		max-height: 100%;
		padding: 24px;
		flex-wrap: wrap;
		background: url('~@/assets/images/BackgroundEntrar.png') no-repeat center center fixed;
		background-size: cover;
		min-height: 100vh;
	}
	
	.tabela-cliente {
		width: 100%;
		background-color: #fff;
		border-radius: 10px;
		.novo-cliente {
			display: flex;
			justify-content: flex-end;
			padding-bottom: 0;
			button {
				i, svg {
					margin-right: 10px;
				}
				text-transform: capitalize;
			}
		}
	}
	
	.v-dialog {
		.headline {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			font-weight: 600;
			color: #11263C;
		}
		.v-card {
			background-color: #f9f9f9;
		}
		.v-card__title {
			span {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				font-weight: 600;
				color: rgba(17, 38, 60, 1);
			}
			svg {
				margin-left: 15px;
				path {
					fill: rgba(17, 38, 60, 1);
				}
			}
		}
		.v-text-field__details {
			display: none;
		}
		.div-input {
			padding: 5px;
		}
	}
</style>
