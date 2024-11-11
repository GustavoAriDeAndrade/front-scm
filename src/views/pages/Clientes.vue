
<template>
	<div id="clientes">
		<div class="tabela-cliente">
			<div class="col-12">
				<v-row align="center" justify="space-between">
					<!-- Coluna do título -->
					<v-col cols="auto">
					<div class="titulo">
						<p>
						Clientes
						<v-icon class="fas fa-user-friends" style="font-size: 20px;"></v-icon>
						</p>
					</div>
					</v-col>
					
					<!-- Coluna do botão de ajuda -->
					<v-col cols="auto">
					<v-btn class="primary-button" @click="dialog_ajuda = true">Ajuda</v-btn>
					</v-col>
				</v-row>
			</div>
			<div class="col-12 novo-cliente">
				<v-btn class="primary-button" raised @click="createCliente">
					<i class="fas fa-user-plus"></i> 
					Novo Cliente
				</v-btn>
			</div>
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
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
						<span v-on="on">
							<span v-if="item.ativo">
							<img src="./../../assets/images/icon-ativo.png">
							</span>
							<span v-else>
							<img src="./../../assets/images/icon-inativo.png">
							</span>
						</span>
						</template>
						<span v-if="item.ativo">Cliente ativo</span>
						<span v-else>Cliente inativo</span>
					</v-tooltip>
				</template>

				<!-- botões para ativação das modais presentes na tabela -->
				<template v-slot:acoes="{ item }">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
						<v-btn 
							color="success" 
							class="primary-button" 
							raised 
							small 
							@click="visualizarPagamentos(item.id)" 
							v-on="on"
						>
							<i class="fas fa-money-bill-wave-alt"></i>
						</v-btn>
						</template>
						<span>Visualizar pagamentos</span>
					</v-tooltip>

					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
						<v-btn 
							class="primary-button" 
							raised 
							small 
							@click="editarCliente(item.id)" 
							style="margin-left: 5px;" 
							v-on="on"
						>
							<i class="fas fa-cog"></i>
						</v-btn>
						</template>
						<span>Editar cliente</span>
					</v-tooltip>
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
											:rules="[v => !!v || 'Campo Logradouro obrigatório']" 
											v-model="cliente.rua" 
											label="Logradouro" 
											placeholder="Logradouro" 
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
            <!-- modal para quitar uma venda -->
            <v-dialog v-model="dialog_pagamentos" persistent max-width="850px">
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ pagamentos.cliente }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form_venda">
                                <div class="row">
                                    <div class="col-12">
                                        <h2>Compras pendentes</h2>
                                        <!-- tabela dos produtos da compra -->
                                        <v-data-table
                                            :headers="header_compras"
                                            :items="pagamentos.compras"
                                            style="margin-top: 10px;"
                                        >
                                            <template v-slot:[`item.valor_total`]="{ item }">
                                                <span>
                                                    R$ {{ item.valor_total }}
                                                </span>
                                            </template>
                                            <template v-slot:[`item.valor_restante`]="{ item }">
                                                <span>
                                                    R$ {{ item.valor_restante }}
                                                </span>
                                            </template>
                                            <template v-slot:[`item.actions`]="{ item }">
                                                <v-btn class="primary-button" raised small @click="quitarCompra(item.venda_id)">
                                                	<i class="fas fa-check"></i>
                                                </v-btn>
                                            </template>
                                        </v-data-table>
                                    </div>
                                </div>
                            </v-form>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closePagamento">
                            Fechar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- modal para conclusão da quitação -->
            <v-dialog v-model="dialog_prosseguir" persistent max-width="350px">
                <v-card>
                    <v-card-title class="headline">
                        Atenção
                    </v-card-title>
                    <v-card-text>
                        <v-container style="text-align: center;">
                            Deseja quitar essa compra?<br>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closePagamento">
                            Não
                        </v-btn>
                        <v-btn class="primary-button" small @click="quitar">
                            Pagar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
			<!-- Modal de ajuda sobre a tela-->
			<v-dialog v-model="dialog_ajuda" max-width="500">
				<v-card>
				  <v-card-title class="headline">Ajuda: Tela de Clientes</v-card-title>
				  <v-card-text>
					<p><strong>1. Para cadastrar um novo cliente:</strong></p>
					<ul>
					  <li>Clique em "+ Novo Cliente".</li>
					  <li>Preencha nome (deve ser único), telefone, e-mail e logradouro.</li>
					  <li>Clique em Salvar.</li>
					</ul>
					<p><strong>2. Para visualizar pagamentos:</strong></p>
					<ul>
					  <li>Clique no ícone verde (dinheiro) ao lado do cliente.</li>
					</ul>
					<p><strong>3. Para editar ou desativar um cliente:</strong></p>
					<ul>
					  <li>Clique no ícone de engrenagem para editar as informações.</li>
					  <li>Você pode desativar o cliente na página de edição.</li>
					</ul>
				  </v-card-text>
				  <v-card-actions>
					<v-spacer></v-spacer>
					<!-- Botão para fechar o modal -->
					<v-btn color="primary" text @click="dialog_ajuda = false">Fechar</v-btn>
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
			// variável para mostrar a modal para vizualizar compras do cliente
			dialog_pagamentos: false,
			// variável para mostrar a modadl de confirmação da quitação
			dialog_prosseguir: false,
			// variável para mostrar a modal de informação
			dialog_resposta: false,
			// variável para mostrar a modal de ajuda
			dialog_ajuda: false,
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
			// variável para quitar uma venda
			pagamentos:{
				cliente: '',
				venda_id: '',
				compras: []
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
            // variável para tabela das compras
            header_compras: [
                {
                    text: 'Valor Total',
                    value: 'valor_total',
                    align: 'end',
                },
                { 
                    text: 'Total Parcelas', 
                    value: 'total_parcelas', 
                    align: 'end',
                },
                {
                    text: 'Valor Restante',
                    value: 'valor_restante',
                    align: 'end',
                },
                { 
                    text: 'Parcelas Restantes', 
                    value: 'parcelas_restante', 
                    align: 'end',
                },
                { 
                    text: 'Quitar', 
                    value: 'actions',
                    align: 'end', 
                    sortable: false 
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
						this.resposta.mensagem = await resp.data.message || resp.data.errors[0].message
						// mostra a mensagem
						this.dialog_resposta = true
					// caso tenha dado tudo certo
					}else{
						// fecha a modal de create/edit cliente
						this.closeCliente()
					}
					// retira o loading do componente
					this.loading = false
					// atualiza a tabela
					this.$refs.tabela.init()
				}
			},
			// função para quitar a compra
			async quitar(){
				let resp = {}
				// caso os campos do formulário estejam válidos
				if(this.pagamentos.venda_id != ''){
					// coloca o componente como loading
					this.loading = true
					// armazena os dados para realizar a atualização
					let date_update = {
						id: this.pagamentos.venda_id
					}
					// rota para a atualização dos dados do cliente
					resp = await store.dispatch('quitarCompra', date_update)
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
						// fecha a modal de quitação
						this.closePagamento()
					}
					// retira o loading do componente
					this.loading = false
				}
			},
			// função para coletar as compras pendentes de pagamento do cliente 
			async visualizarPagamentos(cliente_id){
				// coloca o componente como loading
				this.loading = true
				// requisita as compras pendentes de pagamento do cliente 
				var resp = await store.dispatch('getPagamentos', cliente_id)
				// caso o status da resposta seja 200 (deu certo)
				if(resp.status == 200){
					// caso o cliente possua compras pendentes
					if(resp.data.sales.length > 0){
						// atribui os dados das compras
						this.pagamentos.cliente = await resp.data.sales[0].cliente || ''
						this.pagamentos.compras = await resp.data.sales || []
						// abre a modal de compras
						this.dialog_pagamentos = true
					// caso todas as suas compras já estejam quitadas
					}else{
						// atribui o título da mensagem
						this.resposta.titulo = 'Atenção!'
						// atribui o corpo da mensagem
						this.resposta.mensagem = 'Esse cliente não possui compras com pagamento em aberto'
						// mostra a mensagem
						this.dialog_resposta = true 
					}
				// caso algo tenha dado errado
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
			// função para abrir a modal de confirmação da quitação
			quitarCompra(venda_id){
				// atribui a venda a variável
				this.pagamentos.venda_id = venda_id
				// mostra a modal
				this.dialog_prosseguir = true
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
				// reinicia a validação para remover os erros visuais
				this.$refs.form_cliente.reset()
			},
			// função para fechar a modal com as compras do cliente
			closePagamento(){
				// fecha a modal
				this.dialog_pagamentos = false
				// fecha a modal 
				this.dialog_prosseguir = false
				// limpa os dados locais
				this.pagamentos = {
					cliente: '',
					venda_id: '',
					compras: []
				}
			},
		},
		// variaveis computadas em tempo real
		computed: {}
	}
</script>
<!-- scss do front -->
<style lang="scss">
	#clientes { 
		display: flex;
		max-height: 100%;
		padding: 24px;
		flex-wrap: wrap;
		background-color: #FFFFFF;
		background-size: cover;
		min-height: 100vh;
	}
	
	.tabela-cliente {
		width: 100%;
		background-color: #fff;
		border-radius: 10px;
		.novo-cliente {
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
