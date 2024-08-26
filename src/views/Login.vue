<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="background">
    <div class="login-container">
      <h1 class="title">Entrar</h1>
      
      <div class="input-group">
        <label class="subtitle">Usuário:</label>
        <input type="text" class="input-field" v-model="username" placeholder="Digite seu nome de usuário" required />
      </div>
      
      <div class="input-group">
        <label class="subtitle">Senha:</label>
        <input type="password" class="input-field" v-model="password" placeholder="Digite sua senha" required />
      </div>
      
      <button class="submit-button" @click="handleLogin">Entrar</button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  setup() {
    const router = useRouter();

    const handleLogin = async () => {
      console.log('Nome de usuário:', this.username);
      console.log('Senha:', this.password);
      // Simulação de autenticação. Substitua com a lógica real
      const isAuthenticated = await authenticateUser();

      if (isAuthenticated) {
        router.push('/tela-inicial'); // Redireciona para TelaInicial após o login
      } else {
        // Lidar com falha na autenticação, exibir mensagem de erro
        console.error('Falha na autenticação');
      }
    };

    const authenticateUser = async () => {
      // Simulação de autenticação. Substitua pela lógica real.
      return new Promise(resolve => setTimeout(() => resolve(true), 1000));
    };

    return {
      handleLogin,
    };
  },
};
</script>

<style scoped>
/* Fundo com gradiente e textura granulada */
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #d1c7b8, #93bcc7);
  background-size: cover;
  position: relative; /* Adiciona contexto para a posição absoluta */
}

.background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/granulated-texture.jpg'); /* Substitua pelo caminho correto da sua imagem JPEG */
  background-size: cover;
  opacity: 0.3; /* Ajuste a opacidade conforme necessário */
  z-index: 0; /* Garante que a textura fique atrás do conteúdo */
}

/* Container do formulário com tamanho padrão e bordas suaves */
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  width: 90%;
  max-width: 360px; /* Ajuste do tamanho padrão */
  padding: 20px;
  position: relative; /* Garante que o conteúdo do formulário fique acima da textura */
  z-index: 1;
}

/* Estilo do título do formulário */
.title {
  color: #333;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 20px;
}

/* Grupo de entrada com alinhamento suave */
.input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
  width: 100%;
}

/* Estilo dos subtítulos dos campos de entrada */
.subtitle {
  color: #555;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 300;
  margin-bottom: 5px;
}

/* Estilo dos campos de entrada */
.input-field {
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid rgba(102, 102, 102, 0.35);
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #93bcc7;
  outline: none;
}

/* Estilo do botão de login */
.submit-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 220px;
  height: 50px;
  padding: 12px;
  border-radius: 24px;
  border: none;
  background: #6ea3b1; /* Cor do botão combinando mais com o fundo */
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 300;
  color: #FFF;
  cursor: pointer;
  transition: background 0.3s, box-shadow 0.3s;
}

.submit-button:hover {
  background: #5b8a97; /* Alteração de cor no hover para combinar */
}
</style>
