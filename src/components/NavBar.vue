<template>
	<div id="nav-bar">
		<div class="nav-bar-row">
			<!--botão para minimizar o menu lateral-->
			<div class="btn-mobile">
				<button @click="minimize">
					<span></span>
				</button>
			</div>
			<!--select que contém as empresas disponíveis para o usuário-->
			<div class="busca row justify-end">
				<div v-if="((company_group).find(element => element == $store.getters.user.group.key)) != undefined" class="col-12 div-input col-md-3">
					<v-select
						menu-props="offsetY"
						:items="companies"
						item-text="name" 
						item-value="uuid"
						v-model="company" 
						label="Empresa(s)"
						placeholder="Empresa(s)" 
						background-color="white"
						hide-details
						solo
						dense
						clearable
						@change="setCompanyHeader()"
					/>
				</div>
			</div>
			<!--conteúdos do menu da navBar-->
			<div class="menu">
				<ul>
					<!--horário e data presentes na navBar-->
					<li class="horario">
						{{hora}}
					</li>
					<!--menu para interação do usuário-->
					<li v-if="$store.getters.screen_size.width >= 768" class="usuario">
						<v-menu
							v-model="menu"
							:close-on-content-click="false"
							:nudge-width="200"
							offset-y
							left
							bottom
						>
							<template v-slot:activator="{ on, attrs }">
								<button 
									@click="activeMenu" 
									color="#f4f6fa"
									v-bind="attrs"
									v-on="on"
								>
									<i class="fas fa-user"></i>
									<i class="fas fa-chevron-down"></i>
								</button>
							</template>
							
							<v-card>
								<v-list>
									<v-list-item>						
									<v-list-item-content>
										<v-list-item-title>{{$store.getters.user.name}}</v-list-item-title>
										<v-list-item-subtitle>{{$store.getters.user.email}}</v-list-item-subtitle>
									</v-list-item-content>
						
									<v-list-item-action>
										<v-tooltip bottom>
											<template v-slot:activator="{ on: tooltip }">
												<v-btn
													icon
													@click="editarPerfil"
													color="#727375"	
													v-on="tooltip"
												>
													<i class="fas fa-user-edit"></i>
												</v-btn>
											</template>
											<span>Editar Perfil</span>
										</v-tooltip>
									</v-list-item-action>
									</v-list-item>
								</v-list>
						
								<v-divider></v-divider>
						
								<v-card-actions>
									<v-btn
										text
										@click="menu = false"
									>
										Cancelar
									</v-btn>
									<v-spacer></v-spacer>
									<v-btn
										color="primary"
										text
									>									
										<a href="/logout">Sair</a>
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-menu>
					</li>
				</ul>
			</div>
		</div>
		<!--modal para que o usuário possa editar seus dados pessoais-->
		<v-dialog v-model="dialog_perfil" persistent max-width="550px">
			<v-card>
				<v-card-title>
					<span class="headline"><v-icon>fa-user-edit</v-icon> Editar Perfil </span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-form ref="form_profile">
							<div class="row">
								<div class="col-12">
									<div class="row">
										<div class="col-12 div-input">
											<v-text-field 
												:rules="[v => !!v || 'Campo Nome obrigatório']" 
												v-model="perfil.nome" 
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
												v-model="perfil.email" 
												label="E-mail" 
												placeholder="E-mail" 
												background-color="white"
												hide-details
												outlined
												prepend-inner-icon="mdi-email-outline"
											/>
										</div>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-6 div-input">
									<v-text-field 
										type="password" 
										:rules="[v => (perfil.uuid ? true : (v && v.length >= 8)) || 'Campo Nova Senha obrigatório (mínimo de 8 caracteres)']" 
										v-model="perfil.senha" 
										label="Nova Senha" 
										placeholder="Nova Senha" 
										background-color="white"
										hide-details
										outlined
										prepend-inner-icon="mdi-lock-outline"
									/>
								</div>
								<div class="col-6 div-input">
									<v-text-field 
										type="password" 
										:rules="[v => (v == perfil.senha) || 'As senhas não conferem']" 
										v-model="perfil.repete_senha" 
										label="Repetir Nova Senha" 
										placeholder="Repetir Nova Senha" 
										background-color="white"
										hide-details
										outlined
										prepend-inner-icon="mdi-lock-outline"
									/>
								</div>
							</div>
						</v-form>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closePerfil">
						Cancelar
					</v-btn>
					<v-btn color="primary-button" small @click="enviarPerfil">
						Salvar
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<DialogMensagem :visible="dialog_resposta" :mensagem="resposta" @close="dialog_resposta=false"/>
		<Loader v-if="loading"/>
	</div>
</template>
<!--funções para trazer os dados da navBar-->
<script>
	// importa o store
	import store from '@/store'
	// importa o moment
	import moment from 'moment'
	// importa o ícone de menu
	import Imagem from "@/assets/images/iconMenuL.jpg"
	// importa o componente de DialogMensagem
	import DialogMensagem from '@/components/DialogMensagem.vue'
	// importa o componente de Loader
	import Loader from '@/components/Loader.vue'

	// exporta o componente
	export default {
		// nome do componente
		name: 'NavBar',
		// componentes filhos
		components: {
			// componente de DialogMensagem
			DialogMensagem,
			// componente de Loader
			Loader,
		},
		// dados do componente
		data() {
			return {
				// variável para os workspaces disponíveis
				workspace_group: ['super'],
				// variável para os grupos disponíveis
				company_group: ['super', 'workspace-admin', 'company-admin', 'company-attendant', 'company-receptionist'],
				// variável para as empresas
				companies: [],
				// variável para os workspaces
				workspaces: [],
				// seta o workspace com base no store
				workspace: store.getters.workspace_uuid,
				// seta a empresa com base no store
				company: store.getters.company_uuid,
				// variável para armazenar a hora
				hora: "",
				// variável para o menu
				menu: false,
				// variável para setar a imagem da logo
				imagem_logo: Imagem,
				// variável para editar o perfil do usuário
				perfil: {
					uuid: '',
					nome: '',
					email: '',
					senha: '',
					repete_senha: ''
				},
				// variável para mostrar a modal de edição do perfil
				dialog_perfil: false,
				// variável para mostrar a model de informação
				dialog_resposta: false,
				dialog: false,
				// variável para a mensagem de resposta
				resposta: {},	
				// variável para o loading
				loading: false,
			}
		},
		// funções deste componente
		methods: {
			// função de início do componente
			async init(){
				if(((this.workspace_group).find(element => element == this.$store.getters.user.group.key)) != undefined){
					let dados = await store.dispatch('getWorkspacesSelect')
					this.workspaces = await dados.workspaces
				}
				this.setCompanyUUID()
			},
			// função para setar a(s) empresa(s) do usuário
			async setCompanyUUID(){
				// faz um dispatch para uma action no vuex para pegar as empresas do usuário
				let dados = await store.dispatch('getCompaniesSelect')
				// atribui os dados á variável local
				this.companies = await dados.companies
			},
			// função para enviar um perfil
			async enviarPerfil(){
				let resp = {}
				// caso os campos do formulário estejam válidos
				if (this.$refs.form_profile.validate()){
					// coloca o componente como loading
					this.loading = true
					// coleta os dados do usuário
					let dados = await {
						// coleta o nome do usuário
						name: this.perfil.nome,
						// coleta o email do usuário
						email: this.perfil.email,
						// coleta a senha do usuário
						password: this.perfil.senha,
						// coleta a senha do usuário
						password_confirmation: this.perfil.repete_senha,
						// coleta o grupo do usuário
						group: this.$store.getters.user.group_uuid,
						// coleta o status do usuário
						status: true,
					}
					// armazena os dados para realizar a atualização
					let date_update = await {
						dados_usuario: dados,
						uuid: this.perfil.uuid,
					}
					// rota para a atualização do perfil
					resp = await store.dispatch('putProfile', date_update)
					// caso algo tenha dado errado
					if(resp.status != 200 && resp.status != 201){
						// atribui o título da mensagem 
						this.resposta.titulo = await 'Algo deu errado!'
						// atribui o corpo da mensagem 
						this.resposta.mensagem = await  resp.data.message || resp.data.error
						// mostra a mensagem
						this.dialog_resposta = true
					}else{
						// atribui o título da mensagem 
						this.resposta.titulo = await  'Perfil editado!'
						// atribui o corpo da mensagem 
						this.resposta.mensagem = await 'Perfil editado com sucesso!'
						// fecha a modal de edição do perfil
						this.closePerfil()
						// mostra a mensagem
						this.dialog_resposta = true
					}
					// seta as novas informações do usuário
					await store.dispatch('setUserUUID')
					// retira o loading do componente
					this.loading = false
				}
			},
			// função para abrir a modal de edição de perfil
			async editarPerfil(){
				// abre a modal de edição do usuário
				this.dialog_perfil= await true
				// coloca o componente como loading
				this.loading = await true
				// atribui o uuid do usuário a partir do store
				this.perfil.uuid = this.$store.getters.user.uuid,
				// atribui o nome do usuário a partir do store
				this.perfil.nome = this.$store.getters.user.name,
				// atribui o email do usuário a partir do store
				this.perfil.email = this.$store.getters.user.email,
				// retira o loading do componente
				this.loading = await false
			},
			// função que roda quando é fechada a modal de edição de perfil
			async closePerfil(){
				// fecha a modal
				this.dialog_perfil = false
				// limpa os dados locais do usuário
				this.perfil = {
					uuid: '',
					nome: '',
					email: '',
					senha: '',
					repete_senha: ''
				}
			},
			// função para encontrar as empresas com base no workspace
			async changeCompanyByWorkspace(){
				// faz um dispacth parauma action no vuex store para pegar uma empresa passando o workspace
				await store.dispatch('setWorkspaceUuid', this.workspace)
				// seta as empresas
				this.setCompanyUUID()
			},	
			// seta as empresas da navBar
			async setCompanyHeader(){
				// faz um dispacth para uma action no vuex store para pegar as empresas
				await store.dispatch('setCompanyUuid', this.company)
			},
			// função para ativação do menu	
			activeMenu() {
				// menu recebe ele mesmo negado
				this.menu = !this.menu
			},
			// função para minimizar o menu lateral
			minimize() {
				// faz um dispatch para uma action no vuex
				store.dispatch('toggleMenu')
			},
			// função para pegar o horário atual para a navBar
			getNow: function() {
				// atribui a hora atual através do moment para a variável
				this.hora = moment().format('H:mm:ss - DD/MM/YYYY')
			},
		},
		mounted() {
			this.init()
			setInterval(this.getNow, 1000)
		},
	}
</script>

<style lang="scss">
	#nav-bar{
		color: #f4f6fa ;
		background-color: var(--primary-color);
		.nav-bar-row{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.btn-mobile{
				display: flex;
				padding: 8px 20px;
				button{
					color: #f4f6fa;
					font-size: 20px;
					display: flex;
					height: 100%;
					height: 30px;
					width: 30px;
					span{
						display: block;
						top: 50%;
						width: 30px;
						height: 3px;
						transform: translateY(-50%);
						background-color: #f4f6fa;
						border-radius: 4px;
						position: relative;
						transition: all ease .3s; 
						&:before,
						&:after{
							content: "";
							display: block;
							width: 100%;
							height: 100%;
							background-color: #f4f6fa;
							border-radius: 4px;
							position: absolute;
							transition: all ease .3s;
						}
						&:before {
							top: 7px;
							transition: all ease .3s; 
						}
						&:after {
							bottom: 7px;
						}
					}
				}
				&.open{
					button{
						span{
							transform: translate3d(0, 0px, 0) rotate(45deg);
							background-color: #f4f6fa;
							&:before{
								transform: rotate(-45deg) translate3d(-5.71429px, -6px, 0);
								opacity: 0;
								background-color: #f4f6fa;
							}
							&:after{
								transform: translate3d(0, 7px, 0) rotate(-90deg);
								background-color: #f4f6fa;
							}
						}
					}
				}
			}
			.menu{
				display: flex;
				flex: none;
				ul{
					padding: 0;
					display: flex;
					align-items: center;
					margin-bottom: 0;
					li{
						display: inline-flex;
						padding: 10px 20px;
						button{
							background-color: transparent;
							border: none;
							color: #f5f5f5;
							display: flex;
						}
						&.horario{
							font-style: normal;
							font-weight: 600;
							font-size: 15px;
							line-height: 20px;
							align-items: center;
							color: #f5f5f5;
						}
						&.usuario{
							justify-content: center;
							align-items: center;
							position: relative;
							button{
								justify-content: center;
								align-items: center;
								figure{
									margin-bottom: 0;
									margin-right: 15px;
									height: 35px;
									width: 35px;
									background-color: #fff;
									border-radius: 100%;
									font-size: 18px;
									display: flex;
									align-items: center;
									justify-content: center;
									color: $primaryfontcolor;
									border: 2px solid $primaryfontcolor;
									text-transform: uppercase;
								}
							}
							.sub-menu{
								position: absolute;
								z-index: 1;
								left: 25%;
								top: 100%;
								padding-top: 15px;
								transform: translateX(-50%);
								&:after,
								&:before{
									content: '';
									box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
									position: absolute;
								}
								&:before{
									top: 15px;
									right: 0;
									bottom: 0;
									left: 0;
									border-radius: 10px;
									// border: 1px solid red;
								}
								&:after{
									transform: rotate(45deg) translateX(-50%);
									width: 20px;
									height: 20px;
									top: 13px;
									box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
									left: 50%;
									border-radius: 5px 0;
								}
								ul{
									background-color: #fff;
									z-index: 2;
									border-radius: 10px;
									position: relative;
									&:before{
										content: '';
										background-color:  #fff;
										position: absolute;
										transform: rotate(45deg) translateX(-50%);
										width: 20px;
										height: 20px;
										top: -2px;
										left: 50%;
										border-radius: 5px 0;
									}
									a{
										color:  var(--primary-color);
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>