
<template>
	<div id="usuarios">
		<div class="tabela-usuario">
			<div class="col-12">
				<v-row align="center" justify="space-between">
					<!-- Coluna do título -->
					<v-col cols="auto">
					<div class="titulo">
						<p>
						Usuários
						<v-icon class="fas fa-users" style="font-size: 20px;"></v-icon>
						</p>
					</div>
					</v-col>
					
					<!-- Coluna do botão de ajuda -->
					<v-col cols="auto">
					<v-btn class="primary-button" @click="dialog_ajuda = true">Ajuda</v-btn>
					</v-col>
				</v-row>
			</div>
			<div class="col-12 novo-usuario">
				<!-- botão para ativação da modal -->
				<v-btn class="primary-button" raised @click="createUser">
					<i class="fas fa-user-plus"></i> 
					Novo Usuário
				</v-btn>
			</div>
			<!-- tabela que ira conter as informações de cada usuário -->
			<CustomTable 
				v-if="headers != ''"
				:action="'getUsuarios'"
				:getter="$store.getters.usuarios"
				:headers="headers"
				:search="true"
				:title="'Usuários'"
				:icone="'fas fa-users'"
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
						<span v-if="item.ativo">Usuário ativo</span>
						<span v-else>Usuário inativo</span>
					</v-tooltip>
				</template>

				<!-- botões para ativação das modais presentes na tabela -->
				<template v-slot:acoes="{ item }">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
						<v-btn 
							class="primary-button" 
							raised 
							small 
							@click="editarUsuario(item.id)" 
							v-on="on"
						>
							<i class="fas fa-cog"></i>
						</v-btn>
						</template>
						<span>Editar usuário</span>
					</v-tooltip>
				</template>

			</CustomTable>
			<!-- modal para cadastro/edição de um usuário -->
			<v-dialog v-model="dialog_usuario" persistent max-width="600px">
				<v-card>
					<v-card-title>
						<span v-if="usuario.usuario_id" class="headline">Editar Usuário</span>
						<span v-else class="headline">Novo Usuário</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-form ref="form_usuario">
								<div class="row">
									<div class="col-12 div-input">
										<v-text-field 
											:rules="[v => !!v || 'Campo Nome obrigatório']" 
											v-model="usuario.nome" 
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
											type="email"
											:rules="[v => !!v || 'Campo E-mail obrigatório']" 
											v-model="usuario.email" 
											label="E-mail" 
											placeholder="E-mail" 
											background-color="white"
											hide-details
											outlined
											prepend-inner-icon="mdi-email-outline"
										/>
									</div>
									<div class="col-12 div-input">
										<v-text-field 
											type="password" 
											:rules="[v => (usuario.usuario_id ? true : (v && v.length >= 8)) || 'Campo Senha obrigatório (mínimo de 8 caracteres)']" 
											v-model="usuario.senha" 
											label="Senha" 
											placeholder="Senha" 
											background-color="white"
											hide-details
											outlined
											prepend-inner-icon="mdi-lock-outline"
										/>
									</div>
									<div class="col-12 div-input">
										<v-text-field 
											type="password" 
											:rules="[v => (v == usuario.senha) || 'As senhas não conferem']" 
											v-model="usuario.repete_senha" 
											label="Repetir senha" 
											placeholder="Repetir senha" 
											background-color="white"
											hide-details
											outlined
											prepend-inner-icon="mdi-lock-outline"
										/>
									</div>
									<div class="col-12 div-input col-md-6">
										<v-select 
											:rules="[v => !!v || 'Campo Grupo obrigatório']" 
											:items="grupos"
											item-text="nome" 
											item-value="id"
											v-model="usuario.grupo" 
											label="Grupo"
											placeholder="Grupo" 
											background-color="white"
											hide-details
											outlined
										/>
									</div>
									<div v-if="usuario.usuario_id"  class="col-6 div-input">
										<v-select 
											:rules="[v => !!v || 'Campo Status obrigatório']" 
											:items="['Ativo', 'Inativo']" 
											v-model="usuario.ativo" 
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
						<v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeUsuario">
							Cancelar
						</v-btn>
						<v-btn class="primary-button" small @click="enviarUsuario">
							Salvar
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<!-- Modal de ajuda sobre a tela-->
			<v-dialog v-model="dialog_ajuda" max-width="500">
				<v-card>
				  <v-card-title class="headline">Ajuda: Tela de Usuários</v-card-title>
				  <v-card-text>
					<p><strong>1. Para cadastrar um novo usuário:</strong></p>
					<ul>
					  <li>Clique no botão "+ Novo Usuário".</li>
					  <li>Preencha o nome, e-mail (não pode repetir), senha e grupo da pessoa.</li>
					  <li>Clique em Salvar.</li>
					</ul>
					<p><strong>2. Para editar um usuário:</strong></p>
					<ul>
					  <li>Clique no ícone de engrenagem ao lado do nome.</li>
					  <li>Atualize as informações e clique em Salvar.</li>
					</ul>
					<p><strong>3. Dicas:</strong></p>
					<ul>
					  <li>O e-mail de cada pessoa deve ser único.</li>
					  <li>O círculo verde indica que o usuário está ativo.</li>
					</ul>
				  </v-card-text>
				  <v-card-actions>
					<v-spacer></v-spacer>
					<!-- Botão para fechar o modal -->
					<v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="dialog_ajuda = false">
						Fechar
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
		name: 'Usuarios',
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
			// variável para mostrar a modal para editar/criar um usuário
			dialog_usuario: false,
			// variável para mostrar a modal de informação
			dialog_resposta: false,
			// variável para mostrar a modal de ajuda
			dialog_ajuda: false,
			// variável para a mensagem de resposta
			resposta: {},
			// variável para o loading
			loading: false,
			// variável para os grupos
			grupos: [],
			// variável para criar/editar usuário
			usuario: {
				usuario_id: '',
				nome: '',
				email: '',
				senha: '',
				repete_senha: '',
				grupo: '',
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
					value: 'email',
					text: 'E-mail',
					sortable: true,
				},
				{
					value: 'group.nome',
					text: 'Grupo',
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
			// função para abrir a modal do usuário 
			async createUser(){
				// abre a modal de cadastro/edição de usuário
				this.dialog_usuario = await true
				// chama os grupos disponíveis
				this.getGrupos()
			},
			// função para pegar os grupos
			async getGrupos(){
				// faz um dispatch para uma action no vuex para pegar os grupos
				var resp = await store.dispatch('getGroups')
				// caso o status seja 200 (deu certo)
				if(resp.status == 200){
					// atribui os dados à variável local
					this.grupos = await resp.data.grupos
				}
			},	
			// função para enviar um usuário
			async enviarUsuario(){
				let resp = {}
				// caso os campos do formulário estejam válidos
				if (this.$refs.form_usuario.validate()){
					// coloca o componente como loading
					this.loading = true
					// coleta os dados do usuário
					let dados = {
						// coleta o nome do usuário
						nome: this.usuario.nome,
						// coleta o email do usuário
						email: this.usuario.email,
						// coleta a senha do usuário
						password: this.usuario.senha,
						// coleta a senha do usuário
						password_confirmation: this.usuario.repete_senha,
						// coleta o grupo do usuário
						grupo: this.usuario.grupo.toString(),			
					}
					// caso exista um usuario_id 
					if(this.usuario.usuario_id){
						// coleta o status do usuário
						dados.ativo = this.usuario.ativo == 'Ativo' ? true : false
						// armazena os dados para realizar a atualização
						let date_update = {
							dados_usuario: dados,
							id: this.usuario.usuario_id
						}
						// rota para a atualização dos dados do usuário
						resp = await store.dispatch('putUser', date_update)
					}else{
						// coleta o status do usuário
						dados.ativo = true
						// rota para a criação dos dados dados do usuário
						resp = await store.dispatch('postUsuarios', dados)
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
						// fecha a modal de create/edit usuário
						this.closeUsuario()
					}
					// retira o loading do componente
					this.loading = false
					// atualiza a tabela
					this.$refs.tabela.init()
				}
			},
			// função para coletar um usuário para editar
			async editarUsuario(usuario_id){
				// coloca o componente como loading
				this.loading = true
				// faz um dispatch para uma action no vuex store para pegar um usuário passando o id 
				var resp = await store.dispatch('getUsuario', usuario_id)
				// caso o status da resposta seja 200 (deu certo) 
				if(resp.status == 200){
					// atribui os dados do usuário vindos do back à váriável local
					this.usuario.usuario_id = await resp.data.user.id || ''
					this.usuario.nome = await resp.data.user.nome || ''
					this.usuario.email = await resp.data.user.email || ''
					this.usuario.grupo = await resp.data.user.group.id || ''
					this.usuario.ativo = await resp.data.user.ativo ? 'Ativo' : 'Inativo'
					// mostra a modal de creat/edit usuário
					this.createUser()
				}else{
					// atribui o título da mensagem 
					this.resposta.titulo = 'Algo deu errado!'
					// atribui o corpo da mensagem 
					this.resposta.mensagem = await  resp.data.message || resp.data.error
					// mostra a mensagem
					this.dialog_resposta = true
				}
				// retira o loading do componente
				this.loading = false
				// atualiza a tabela
				this.$refs.tabela.init()
			},
			// função que roda quando é fechada a modal de create/edit usuário
			closeUsuario(){
				// fecha a modal
				this.dialog_usuario = false
				// limpa os dados locais do usuário
				this.usuario =  {
					usuario_id: '',
					nome: '',
					email: '',
					senha: '',
					repete_senha: '',
					grupo: '',
					status: '',
				}
				// reinicia a validação para remover os erros visuais
				this.$refs.form_usuario.reset()
			},
		},
		// variaveis computadas em tempo real
		computed: {}
	}
</script>
<!-- scss do front -->
<style lang="scss">
	#usuarios{
		display: flex;
		max-height: 100%;
		padding: 24px;
		flex-wrap: wrap;
		background-color: #FFFFFF;
		background-size: cover;
		min-height: 100vh;
		
		.tabela-usuario{
            width: 100%;
			background-color: #fff;
    		border-radius: 10px;
			.novo-usuario{
				justify-content: flex-end;
				padding-bottom: 0;
				button{
					i, svg{
						margin-right: 10px;
					}
					text-transform: capitalize;
				}
			}
		}
	}
	.v-dialog{
		.headline{
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			font-weight: 600;
			color: #11263C;
		}
		.v-card{
			background-color: #f9f9f9;
		}
		.v-card__title{
			span{
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				font-weight: 600;
				color: rgba(17, 38, 60, 1);
			}
			svg{
				margin-left: 15px;
				path{
					fill: rgba(17, 38, 60, 1);
				}
			}
		}
		.v-text-field__details{
			display: none;
		}
		.div-input{
			padding: 5px;
		}
	}
</style>
