<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  computed: {
    showNav() {
      return this.$route.path !== '/login';
    }
  }
}
</script>

<style>
/* CSS Global */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #D1B3FF; /* Fundo lilás com tom mais vivo */
  overflow: hidden; /* Remove a barra de rolagem */
}

#app {
  width: 100%;
}

/* Estilos da página de login */
.login-container {
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 12px; /* Borda suavizada */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  max-width: 350px; /* Largura máxima para ficar delicado */
  width: 100%;
  text-align: center;
}

.login-container input[type="text"],
.login-container input[type="password"] {
  width: calc(100% - 20px); /* Ajuste para manter os campos dentro do container */
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px; /* Borda suavizada */
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.login-container button {
  width: 100%;
  padding: 10px;
  border-radius: 8px; /* Borda suavizada */
  border: none;
  background-color: #7D5BA6;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.login-container button:hover {
  background-color: #6A4898; /* Um tom mais escuro ao passar o mouse */
}
</style>
