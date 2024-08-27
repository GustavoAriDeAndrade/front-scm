<template>
	<div id="senha">
		<!--imagem para a parte esquerda da pagina-->
		<div class="col-8 esquerda">
			<LoginEsquerda/>
		</div>
		<!--div para o usuário inserir o email-->
		<div class="col-12 col-md-4 senha-esquerda" elevation="2">
			<v-form ref="form_senha">
				<div class="row">
					<div class="col-12">
						<h2>
							Olá! Seja bem-vindo(a), digite seu email!
						</h2>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<v-text-field 
							:rules="[v => !!v || 'Campo obrigatório']"
							v-model="inputs.email"
							label="Email"
							placeholder="Email"
							outlined
							@keyup.enter="handleSubmit"
						/>
					</div>
				</div>
				<!--botoes presentes na div-->
				<div class="row">
					<div class="col-4 offset-4 btn-enviar">
						<v-btn @click="handleSubmit" block elevation="2" large color="primary" :loading="loading" >
							Enviar
						</v-btn>
					</div>
				</div>
				<div class="row row-opcoes">
					<div class="col-12 voltar">
						<router-link to="/login">Voltar</router-link>
					</div>
				</div>
			</v-form>
		</div>
		<Loader v-if="loading"/>
	</div>
</template>
<!--funções para encaminhar e verificar o email-->
<script>
	// importa a imagem para renderizar
	import LoginEsquerda from "@/components/LoginEsquerda.vue"
	// importa o componente de Loader
	import Loader from "@/components/Loader.vue"
	// importa o store
	import store from '@/store'
	
	// exporta o componente
	export default {
		// nome do componente
		name: 'RecuperarSenha',
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
				// variável para os dados
                inputs: {
					// puxa o email digitado pelo usuario
                    email: localStorage.getItem('email') || '',
                },
				// variável para a validacao
                validacao: {
					// inicia como falsa
                    email: false,
                }
            }
        },
		// funções deste componente
        methods: {
			// função para enviar o código de verificação para o usuário
			async handleSubmit() {
				let resp = {}
				// caso o campo do formulário esteja válido
				if(this.$refs.form_senha.validate()){
					// coloca o componente como loading
					this.loading = await true
					// rota para o envio do código caso o email esteja válido
					resp = await store.dispatch('verificaEmail', this.inputs)
					// caso algo tenha dado errado
					if(!resp){
						// atribui a mensagem
						alert('Email inválido.')
					// caso tenha dado tudo certo
					}else{
						// atribui a mensagem 
						alert('Email de verificação enviado, favor verificar seu E-mail')
						// redireciona o usuário de volta ao login
						this.$router.push('/login')
					}
					// retira o loading do componente
					this.loading = false
				}
            },
        },
	}
</script>
<!-- scss do front -->
<style lang="scss">
	#senha{
		flex: 1;
		display: flex;
		max-height: 100vh;
		background-color: #E6EEF8;
		.esquerda{
			padding: 0;
		}
		.senha-esquerda{
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
		}
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
				.btn-enviar{
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
					.voltar{
						padding: 20px 15px 20px 15px;
						display: flex;
						align-items: center;
						justify-content: center;
						a{
							text-align: right;
							font-style: normal;
							font-weight: normal;
							font-size: 18px;
							line-height: 20px;
							color: rgba(0,0,0,.6);
						}
					}
				}
				@media (max-width: 1400px){
					padding: 0 15px;
				}
			}
	}
</style>