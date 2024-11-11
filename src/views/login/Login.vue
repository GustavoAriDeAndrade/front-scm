login 
<template>
	<div id="login">
		<div class="login-meio">
			<v-form ref="form_usuario" v-model="formValid">
				<div class="row">
					<div class="col-12">
						<h2>
							<span>ENTRAR</span>
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
		background: #fffbd4;
		background-size: cover;
		position: relative;
	}

	.login-meio {
		background: #ffffff;
		border-radius: 16px;
		padding: 25px;
		width: 100%;
		max-width: 400px;
		min-height: 400px;
		display: flex;
		flex-direction: column;
		align-items: center; 
		justify-content: center;
		box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1); 
		margin-left: -20px;
	}

	h2 {
		font-weight: 350;
		font-size: 24px;
		line-height: 36px;
		color: #000000;
		text-align: center;
		margin-bottom: 20px;
	}

	.input-group {
		width: 125%;
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-bottom: 15px;
		align-items: center;
		margin-left: -20px !important; 
	}

	.v-text-field {
		background: #FFFFFF;
		border-radius: 12px;
		width: 100%;
		max-width: 350px; 
		padding: 10px 15px; 

	}

	.v-input--hide-spin-buttons input[type=number] {
		-moz-appearance: textfield; 
		appearance: textfield; 
	}

	.btn-entrar {
		display: flex;
		justify-content: center;
		width: 100%;
		margin-bottom: 15px;
		
	}

	.custom-btn {
		background-color: #352116 !important;
		color: #fff !important;
		box-shadow: -4px -4px 12px rgba(255, 255, 255, 0.3), 4px 4px 12px rgba(0, 0, 0, 0.1);
		border-radius: 12px;
		font-size: 16px;
		width: 80%;
		max-width: 250px;
		
	}

	.fa-rotate-90 {
		filter: rotate(90deg); 
	}

	html {
		-webkit-text-size-adjust: 100%; 
		text-size-adjust: 100%; 
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
	.col-12{
		max-width: 110%;
	}
</style>