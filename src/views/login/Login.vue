<template>
	<div id="login">
		<div class="col-8 esquerda">
			<LoginEsquerda/>
		</div>
		<div class="col-12 col-md-4 login-meio" elevation="2">
			<v-form ref="form_usuario">
				<div class="row">
					<div class="col-12">
						<h2>
							<span>Olá! Seja bem-vindo a {{$store.getters.theme.name}}</span>
						</h2>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<v-text-field 
							:rules="[v => !!v || 'Campo obrigatório']" 
							v-model="inputs.usuario" 
							label="Usuário" 
							placeholder="Usuário" 
							outlined
						/>
					</div>
					<div class="col-12">
						<v-text-field 
							type="password" 
							@keyup.enter="handleSubmit" 
							:rules="[v => !!v || 'Campo obrigatório']" 
							v-model="inputs.senha" 
							label="Senha" 
							placeholder="Senha" 
							outlined
						/>
					</div>
				</div>
				<div class="row">
					<div class="col-4 offset-4 btn-entrar">
						<v-btn @click="handleSubmit" block elevation="2" large color="primary" :loading="loading" >
							Entrar
						</v-btn>
					</div>
				</div>
				<div class="row row-opcoes">
					<div class="col-12 lembrar-usuario">
						<v-checkbox v-model="inputs.lembrar_usuario" label="Lembrar Usuário"/>
					</div>
					<div class="col-12 criar-conta">
						Novo por aqui? <router-link to="/recuperar-senha">Crie uma conta!</router-link>
					</div>
					<div class="col-12 recuperar-senha">
						<router-link to="/recuperar-senha">Esqueceu a senha?</router-link>
					</div>
				</div>
			</v-form>
				<div class="col-12 links">
					<router-link to="/politica-de-privacidade">Política de Privacidade</router-link>
					<router-link to="/recuperar-senha">Termos</router-link>
				</div>
			</div>
		<Loader v-if="loading"/>
	</div>
</template>
<!--funções para logar e deslogar-->
<script>
	// importa a imagem para renderizar
	import LoginEsquerda from "@/components/LoginEsquerda.vue"
	// importa o store
	import store from '@/store'
	// importa o store
	import Loader from '@/components/Loader.vue'

	// exporta o componente
	export default {
		// nome do componente
		name: 'Login',
		// componentes filhos
		components: {
			// componente de Loader
			Loader,
			// componente de imagem
			LoginEsquerda,
		},
		// dados do componente
		data() {
			return {
				// variável para o loading
				loading: false,
				// variáveis para logar
				inputs: {
					usuario: localStorage.getItem('usuario') || '',
					senha: localStorage.getItem('senha') || '',
					lembrar_usuario: localStorage.getItem('lembrar_usuario') || '',
				},
			}
		},
		// funções deste componente
		methods: {
			// função de início deste componente
			async init(){

			},
			// função para logar o usuário
			async handleSubmit(){
				if (this.$refs.form_usuario.validate()){
					
					this.loading = true
					
					const resp = await store.dispatch('login', this.inputs)
					
					if(!resp){

						alert('Usuário ou senha inválidos.')

					}else if(resp == 204){

						alert('Usuário não pertence a esse Workspace!')

					} else {
					
						this.loading = false

						this.$router.push('/')
					}
					
					this.loading = false
				}
			},
		},
		mounted(){
			this.init()
		}
	}
</script>
<!-- scss do front -->
<style lang="scss">
	#login{
		flex: 1;
		display: flex;
		max-height: 100vh;
		background-color: #E6EEF8;
		.esquerda{
			padding: 0;
		}
		.login-meio{
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			form{
				background: linear-gradient(0deg, #E6EEF8, #E6EEF8), #CFD8DC;
				box-shadow: -16px -16px 40px rgba(253, 255, 255, 0.8), 16px 16px 40px rgba(187, 195, 206, 0.6), inset 1px 1px 0px rgba(255, 255, 255, 0.56);
				border-radius: 16px;
				padding: 50px;
				position: relative;
				.login-redes{
					display: flex;
					flex-wrap: wrap;
					justify-content: space-evenly;
					position: absolute;
					left: 0;
					top: -30px;
					button{
						display: flex;
						flex-wrap: wrap;
						justify-content: center;
						align-items: center;
						background: linear-gradient(0deg, #E6EEF8, #E6EEF8), #CFD8DC;
						border: 2px solid transparent;
						box-shadow: -4px -4px 12px rgba(253, 255, 255, 0.8), 4px 4px 12px rgba(187, 195, 206, 0.6);
						border-radius: 16px;
						height: 60px;
						width: 60px;
						transition: all ease .3s;
						img{
							width: 40px;
							height: 40px;
							transition: all ease .3s;
						}
						&:hover{
							border: 2px solid #fff;
							box-shadow: inset 3px 3px 4px rgba(187, 195, 206, 0.6), inset -3px -3px 4px rgba(253, 255, 255, 0.6);
							img{
								transform: scale(0.9);
							}
						}
						@media (max-width: 1500px){
							height: 50px;
							width: 50px;
							img{
								height: 30px;
								width: 30px;
							}
						}
					}
					@media (max-width: 1500px){
						margin-top: 10px;
					}
				}
				h2{					
					font-style: normal;
					font-weight: 300;
					font-size: 18px;
					line-height: 36px;
					color: var(--secondary-color);
					text-align: center;
					span{
						font-weight: 600;
					}
					@media (max-width: 1400px){
						padding-top: 40px;
					}
				}
				fieldset{
					background: #E6EEF8;
					box-shadow: inset -4px -4px 12px rgba(253, 255, 255, 0.8), inset 4px 4px 12px rgba(187, 195, 206, 0.6);
					border: none;
					border-radius: 12px;
				}				
				input{
					color: var(--secondary-color);
				}
				.btn-entrar{
					padding: 0;
					button{
						background: radial-gradient(50% 50% at 50% 50%, var(--primary-color) 45%, var(--accent-color) 100%);
						color: #fff;
						box-shadow: -4px -4px 12px rgba(253, 255, 255, 0.8), 4px 4px 12px rgba(187, 195, 206, 0.6);
						width: 100%;
						border-radius: 12px;
						transition: all ease .3s;
						span{
							text-transform: capitalize;
							font-size: 18px;
							font-weight: 600;
						}
					}
				}
				.row-opcoes{
					display: flex;
					flex-wrap: wrap;
					justify-content: center;
					align-items: center;
					text-align: center;
					.lembrar-usuario{
						display: flex;
						justify-content: center;
						align-items: center;
						padding: 0 15px;
						label{
							display: flex;
							align-items: center;
							margin-bottom: 0;
							font-size: 14px;
							p{
								padding: 0px;
								font-style: normal;
								font-weight: normal;
								font-size: 14px;
								line-height: 17px;
								color: #373737;
							}
							input{
								width: auto;
								margin-right: 10px;
							}
						}
					}
					.criar-conta{
						padding: 0 15px;
						color: rgba(0,0,0,.6);
						font-size: 14px;
						a{
							color: rgba(0, 0, 0, 0.6);
							font-weight: 600;
						}
					}
					.recuperar-senha{
						padding: 5px 15px 20px 15px;
						display: flex;
						align-items: center;
						justify-content: center;
						a{
							text-align: right;
							font-style: normal;
							font-weight: normal;
							font-size: 14px;
							line-height: 20px;
							color: rgba(0,0,0,.6);
						}
					}
				}
				@media (max-width: 1400px){
					padding: 0 15px;
				}
			}
			.links{
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				padding: 0 15px;
				a{
					font-size: 14px;
					color: rgba(0,0,0,.6);
					text-align: center;
					width: max-content;
				}
			}
		}
		.imagem{
			flex: 1;
		}
	}
</style>