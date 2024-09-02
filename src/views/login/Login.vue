<template>
	<div id="login">
		<div class="login-meio">
			<v-form ref="form_usuario" v-model="formValid">
				<div class="row">
					<div class="col-12">
						<h2>
							<span>Entrar</span>
						</h2>
					</div>
				</div>
				<div class="row input-group">
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
							:rules="[v => !!v || 'Campo obrigatório']" 
							v-model="inputs.senha" 
							label="Senha" 
							placeholder="Senha" 
							outlined
						/>
					</div>
				</div>
				<div class="row">
					<div class="col-12 btn-entrar">
						<v-btn @click="handleSubmit" class="custom-btn" :loading="loading">
							Entrar
						</v-btn>
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

<script>
  import store from '@/store'
  import Loader from '@/components/Loader.vue'

  export default {
    name: 'Login',
    components: {
      Loader,
    },
    data() {
      return {
        loading: false,
        inputs: {
          usuario: localStorage.getItem('usuario') || '',
          senha: localStorage.getItem('senha') || '',
          lembrar_usuario: localStorage.getItem('lembrar_usuario') || '',
        },
      }
    },
    methods: {
      async init() {},
      async handleSubmit() {
        if (this.$refs.form_usuario.validate()) {
          this.loading = true
          const resp = await store.dispatch('login', this.inputs)
          if (!resp) {
            alert('Usuário ou senha inválidos.')
          } else if (resp === 204) {
            alert('Usuário não pertence a esse Workspace!')
          } else {
            this.loading = false
            this.$router.push('/inicial')
          }
          this.loading = false
        }
      },
    },
    mounted() {
      this.init()
    }
  }
</script>
<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');

	#login {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background: url('~@/assets/images/BackgroundEntrar.png') no-repeat center center fixed;
		background-size: cover;
		position: relative;
	}

	.login-meio {
		background: #FFFFFF;
		box-shadow: -6px -6px 20px rgba(255, 255, 255, 0.3), 6px 6px 20px rgba(0, 0, 0, 0.1);
		border-radius: 16px;
		padding: 25px;
		width: 100%;
		max-width: 400px;
		min-height: 350px;
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	h2 {
		font-weight: 300;
		font-size: 24px;
		line-height: 36px;
		color: rgba(48, 48, 48, 0.8);
		text-align: center;
		margin-bottom: 20px;
	}

	.input-group {
		margin-bottom: 15px;
	}

	.v-text-field {
		background: #FFFFFF;
		border-radius: 12px;
	}

	.v-input--hide-spin-buttons input[type=number] {
		-moz-appearance: textfield; /* Para Firefox */
		appearance: textfield; /* Para outros navegadores */
	}

	.btn-entrar {
		display: flex;
		justify-content: center;
		margin-bottom: 15px;
	}

	.custom-btn {
		background-color: #C9A8C1 !important;
		color: #fff !important;
		box-shadow: -4px -4px 12px rgba(255, 255, 255, 0.3), 4px 4px 12px rgba(0, 0, 0, 0.1);
		border-radius: 12px;
		font-size: 16px;
		width: 100%;
		max-width: 200px;
	}

	.fa-rotate-90 {
		filter: rotate(90deg); /* Compatível com navegadores modernos */
	}

	html {
		-webkit-text-size-adjust: 100%; /* Para navegadores baseados no WebKit */
		text-size-adjust: 100%; /* Para outros navegadores modernos */
	}

	.links {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		a {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.6);
		}
	}
</style>