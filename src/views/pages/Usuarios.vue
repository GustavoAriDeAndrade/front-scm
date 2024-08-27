<template>
	<div id="usuarios">
		<div class="tabela-usuario">
			<div class="col-12 novo-usuario">
				<!-- botão para ativação da modal -->
				<v-btn class="primary-button" raised @click="createUser" :disabled="$store.getters.user.group.hierarchy_order >= 3 ? true : false">
					<i class="fas fa-user-plus"></i> 
					Cadastrar Usuário
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
				<template v-slot:companies="{ item }" >
					<div v-if="item.companies">
						<span v-for="(company, i) in item.companies" :key="i">
							{{company.name}}
							{{((item.companies.length - 1) > i) ? ', ' : ''}}
						</span>
					</div>
				</template>
				<template v-slot:status="{ item }">
					<span v-if="item.status">
						Ativo
						<img src="./../../assets/images/icon-ativo.png">
					</span>
					<span v-else>
						Inativo
						<img src="./../../assets/images/icon-inativo.png">
					</span>
				</template>
				<!-- botões para ativação das modais presentes na tabela -->
				<template v-slot:procedures="{ item }">
					<v-btn class="primary-button" raised small @click="editarFuncionario(item.uuid)" :disabled="$store.getters.user.group.hierarchy_order != 3  ? true : false">
						<i class="far fa-address-card"></i>
					</v-btn>
				</template>
				<template v-slot:acoes="{ item }">
					<v-btn class="primary-button" raised small @click="editarUsuario(item.uuid)" :disabled="$store.getters.user.group.hierarchy_order >= 3 || ($store.getters.user.group.key != 'super' ? ($store.getters.user_uuid !=  item.uuid ? true : false) : false) ? true : false">
						<i class="fas fa-cog"></i>
						Editar
					</v-btn>
				</template>
			</CustomTable>
			<!-- modal para cadastro/edição de um usuário -->
			<v-dialog v-model="dialog_usuario" persistent max-width="600px">
				<v-card>
					<v-card-title>
						<span v-if="usuario.usuario_uuid" class="headline">Editar Usuário <v-icon>fa-user-edit</v-icon> </span>
						<span v-else class="headline"><v-icon style="margin-right: 10px;">fa-user-plus</v-icon> Novo Usuário</span>
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
									<div v-if="!usuario.usuario_uuid" class="col-12 div-input">
										<v-text-field 
											type="email"
											:rules="[v => (v == usuario.email) || 'Os E-mails não conferem']" 
											v-model="usuario.repete_email" 
											label="Repetir E-mail" 
											placeholder="Repetir E-mail" 
											background-color="white"
											hide-details
											outlined
											prepend-inner-icon="mdi-email-outline"
										/>
									</div>
									<div class="col-12 div-input">
										<v-text-field 
											type="password" 
											:rules="[v => (usuario.usuario_uuid ? true : (v && v.length >= 8)) || 'Campo Senha obrigatório (mínimo de 8 caracteres)']" 
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
											item-text="name" 
											item-value="uuid"
											v-model="usuario.grupo" 
											label="Grupo"
											placeholder="Grupo" 
											background-color="white"
											hide-details
											outlined
										/>
									</div>
									<div class="col-12 div-input col-md-6">
										<v-select
											:rules="[v => !!v || 'Campo Empresa obrigatório']"
											:items="$store.getters.companies"
											item-text="name" 
											item-value="uuid"
											v-model="usuario.empresa" 
											label="Empresa(s)"
											placeholder="Empresa(s)" 
											background-color="white"
											hide-details
											outlined
											multiple
										/>
									</div>
									<div v-if="usuario.usuario_uuid"  class="col-12 div-input">
										<v-select 
											:rules="[v => !!v || 'Campo Status obrigatório']" 
											:items="['Ativo', 'Inativo']" 
											v-model="usuario.status" 
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
			<!-- modal para cadastro/edição dos procedimentos de cada funcionário -->
			<v-dialog v-model="dialog_procedimentos" persistent max-width="550px">
				<v-card>
					<v-card-title>
						<span class="headline">Especialidades <v-icon>far fa-address-card</v-icon></span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-form ref="form_especialidade">
								<div class="row">
									<div class="col-12">
										<v-text-field 
											:rules="[v => !!v || 'Campo Nome obrigatório']" 
											v-model="usuario.nome" 
											label="Nome" 
											placeholder="Nome" 
											background-color="white"
											hide-details
											outlined
											disabled
											prepend-inner-icon="mdi-account"
										/>
									</div>
									<div class="col-12">
										<v-autocomplete
											:rules="[v => !!v || 'Campo Procedimento(s) obrigatório']"
											:items="procedimentos"
											item-text="name"
											item-value="uuid"
											v-model="usuario.procedimento"
											label="Procedimento(s)"
											placeholder="Procedimento(s)"
											background-color="white"
											chips
											deletable-chips
											small-chips
											hide-details
											outlined
											multiple
										/>
									</div>
								</div>
							</v-form>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="darken-1" text style="text-transform: capitalize; font-size:16px;" @click="closeProcedimentos">
							Cancelar
						</v-btn>
						<v-btn class="primary-button" small @click="enviarFuncionario">
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
			// variável para mostrar a modal das especialidades
			dialog_procedimentos: false,
			// variável para a mensagem de resposta
			resposta: {},
			// variável para o loading
			loading: false,
			// variável para os grupos
			grupos: [],
			// variável para os procedimentos
			procedimentos: [],
			// variável para criar/editar usuário
			usuario: {
				usuario_uuid: '',
				nome: '',
				email: '',
				repete_email: '',
				senha: '',
				repete_senha: '',
				grupo: '',
				empresa: [],
				status: '',
				procedimento: [],
			},
			// variável para o cabeçalho da tabela
			headers: [
				{
					value: 'name',
					text: 'Nome',
					sortable: true,
				},
				{
					value: 'email',
					text: 'E-mail',
					sortable: true,
				},
				{
					value: 'group.name',
					text: 'Grupo',
					sortable: true,
				},
				{
					value: 'status',
					text: 'Status',
					sortable: true,
				},
				{
					value: 'companies',
					text: 'Empresa(s)',
					sortable: true,
				},
				{
					value: 'procedures',
					text: 'Especialidades',
					sortable: false
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
            // função para puxar os procedimentos para a modal de especialidades
            async getProcedimentos(){
                // faz um dispatch para uma action no vuex para pegar os procedimentos
				var resp = await store.dispatch('getProcedures')
				// caso o status seja 200 (deu certo)
				if(resp.status == 200){
					// atribui os dados à variável local
					this.procedimentos = await resp.data.procedure
				}
            },
			// função para enviar um usuário
			async enviarUsuario(){
				let resp = {}
				// caso os campos do formulário estejam válidos
				if (this.$refs.form_usuario.validate()){
					// coloca o componente como loading
					this.loading = await true
					// coleta os dados do usuário
					let dados = await {
						// coleta o nome do usuário
						name: this.usuario.nome,
						// coleta o email do usuário
						email: this.usuario.email,
						// coleta o email do usuário
						email_confirmation: this.usuario.repete_email,
						// coleta a senha do usuário
						password: this.usuario.senha,
						// coleta a senha do usuário
						password_confirmation: this.usuario.repete_senha,
						// coleta o grupo do usuário
						group: this.usuario.grupo,	
						// coleta as empresas do usuário
						companies: this.usuario.empresa,			
					}
					// caso exista um usuario_id 
					if(this.usuario.usuario_uuid){
						// coleta o status do usuário
						dados.status = await this.usuario.status == 'Ativo' ? true : false
						// armazena os dados para realizar a atualização
						let date_update = await {
							dados_usuario: dados,
							uuid: this.usuario.usuario_uuid
						}
						// rota para a atualização dos dados do usuário
						resp = await store.dispatch('putUser', date_update)
					}else{
						// rota para a criação dos dados dados do usuário
						resp = await store.dispatch('postUsuarios', dados)
					}
					// caso algo tenha dado errado
					if(resp.status != 200 && resp.status != 201){
						// atribui o título da mensagem 
						this.resposta.titulo = await 'Algo deu errado!'
						// atribui o corpo da mensagem 
						this.resposta.mensagem = await  resp.data.message || resp.data.error
						// mostra a mensagem
						this.dialog_resposta = true
					// caso tenha dado tudo certo
					}else{
						// atribui o título da mensagem 
						this.resposta.titulo = await  'Usuário ' +  (this.usuario.usuario_uuid ? 'editado!' : 'cadastrado!')
						// atribui o corpo da mensagem 
						this.resposta.mensagem = await 'Usuário ' + (this.usuario.usuario_uuid ? 'editado' : 'cadastrado') + ' com sucesso!'
						// fecha a modal de create/edit usuário
						this.closeUsuario()
						// mostra a mensagem
						this.dialog_resposta = true
					}
					// retira o loading do componente
					this.loading = false
					// atualiza a tabela
					this.$refs.tabela.init()
				}
			},
			// função para coletar um usuário para editar
			async editarUsuario(usuario_uuid){
				// coloca o componente como loading
				this.loading = true
				// faz um dispatch para uma action no vuex store para pegar um usuário passando o id 
				var resp = await store.dispatch('getUsuario', usuario_uuid)
				// caso o status da resposta seja 200 (deu certo) 
				if(resp.status == 200){
					// atribui os dados do usuário vindos do back à váriável local
					this.usuario.usuario_uuid = await resp.data.user.uuid || ''
					this.usuario.nome = await resp.data.user.name || ''
					this.usuario.email = await resp.data.user.email || ''
					this.usuario.grupo = await resp.data.user.group.uuid || ''
					this.usuario.empresa = (resp.data.user.companies || []).map(company => company.uuid)
					this.usuario.status = await resp.data.user.status ? 'Ativo' : 'Inativo'
					// mostra a modal de creat/edit usuário
					this.createUser()
				}else{
					// atribui o título da mensagem 
					this.resposta.titulo = await 'Algo deu errado!'
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
					usuario_uuid: '',
					nome: '',
					email: '',
					repete_email: '',
					senha: '',
					repete_senha: '',
					grupo: '',
					empresa: [],
					status: '',
				}
			},
			// função para enviar um procedimento
			async enviarFuncionario(){
				let resp = {}
				// caso os campos do formulário estejam válidos
				if (this.$refs.form_especialidade.validate()){
					// coloca o componente como loading
					this.loading = await true
					// coleta os dados do funcionário
					let dados = await {
						// coleta o nome do funcionário
						user_uuid: this.usuario.usuario_uuid,
						// coleta os procedimentos do funcionário
						procedures: this.usuario.procedimento,
					}
					// caso ja exista um procedimento_uuid
					if(this.usuario.usuario_uuid){
						// armazena os dados para realizar a atualização
						let date_update = await {
							dados_especialidades: dados,
							uuid: this.usuario.usuario_uuid
						}
						// rota para a atualização da especialidade
						resp = await store.dispatch('putEspecialidade', date_update)
					}else{
						// rota para a criação da especialidade
						resp = await store.dispacth('postEspecialidade', dados)
					}
					// caso algo tenha dado errado
					if(resp.status != 200 && resp.status != 201){
						// atribui o título da mensagem
						this.resposta.titulo = await 'Algo deu errado!'
						// atribui o corpo da mensagem
						this.resposta.mensagem = await resp.data.message || resp.data.error
						// mostra a mensagem
						this.dialog_resposta = true
					}else{
						// atribui o título da mensagem
						this.resposta.titulo = await 'Dados ' + (this.usuario.usuario_uuid ? 'editado!' : 'cadastrado!')
						// atribui o corpo da mensagem
						this.resposta.mensagem = await 'Dados ' + (this.usuario.usuario_uuid ? 'editado' : 'cadastrado') + ' com sucesso!'
						// fecha a modal de create/edit especialidades
						this.closeProcedimentos()
						// mostra a mensagem
						this.dialog_resposta = true
					}
					// retira o loading do componente
					this.loading = false
				}
			},
			// função para coletar um funcionário para editar
			async editarFuncionario(usuario_uuid){
				// coloca o componente com loading
				this.loading = true
				// faz um dispatch para uma action no vuex para pegar os dados do funcionário
				var resp = await store.dispatch('getEspecialidade', usuario_uuid)
				// caso o status da resposta seja 200 (deu certo)
				if(resp.status == 200){
					// atribui os dados vindos do back á variável local
					this.usuario.usuario_uuid = await resp.data.uuid || ''
					this.usuario.nome = await resp.data.name || ''
					this.usuario.procedimento = (resp.data.procedures || []).map(procedure => procedure.uuid)
					// aciona a função para puxar os procedimentos
					this.getProcedimentos()
					// mostra a modal de criação/edição do usuário
					this.dialog_procedimentos = true
				}else{
					// atribui o título da mensagem
					this.resposta.titulo = await 'Algo deu errado!'
					// atribui o corpo da mensagem
					this.resposta.mensagem = await resp.data.message || resp.data.error
					// mostra a mensagem
					this.dialog_resposta = true
				}
				// retira o loading do componente
				this.loading = false
			},
			// função que roda quando é fechada a modal de adição de especialidades
			closeProcedimentos(){
				// fecha a modal
				this.dialog_procedimentos = false
				// limpa os dados locais do funcionário
				this.usuario = {
					usuario_uuid: '',
					nome: '',
					procedimento: ''
				}
			}
		},
		// variaveis computadas em tempo real
		computed: {
			// função para a regra de validação do campo de empresas
			conputed_rule_empresas(){
				// coleta o grupo que está selecionado
				var grupo_selecionado = this.grupos.find(grupo => this.usuario.grupo == grupo._uuid)
				// caso exista um grupo selecionado
				if(grupo_selecionado){
					// caso o grupo selecionado seja superadmin 
					if(grupo_selecionado.tipo == 'superadmin'){
						// retorna true (válido)
						return true
					// caso o grupo selecionado não seja superadmin
					}else {
						// caso empresa não for null 
						if(this.usuario.empresa.length > 0){
							// retorna true (válido)
							return true
						// caso empresa for null 
						}else{
							// retorna false (inválido)
							return false
						}
					}
				// caso não exista um grupo selecionado
				}else{
					// retorna false (inválido)
					return false
				}
			}
		}
	}
</script>
<!-- scss do front -->
<style lang="scss">
	#usuarios{
		display: flex;
		max-height: 100%;
		padding: 24px;
		flex-wrap: wrap;
		.tabela-usuario{
            width: 100%;
			background-color: #fff;
    		border-radius: 10px;
			.novo-usuario{
				display: flex;
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