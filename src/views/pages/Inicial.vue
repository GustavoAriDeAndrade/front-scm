
<template>
  <div id="inicio">
    <div class="button-row">
      <button @click="goToPage('Clientes')" class="custom-button">
        <span class="icone">
          <i class="fas fa-user-friends"></i>
        </span>
        <span class="texto">
          Clientes
        </span>
      </button>
      <button @click="goToPage('Produtos')" class="custom-button">
        <span class="icone">
          <i class="fas fa-tshirt"></i>
        </span>
        <span class="texto">
          Produtos
        </span>
      </button>
    </div>
    <div class="button-row">
      <button @click="goToPage('Vendas')" class="custom-button">
        <span class="icone">
          <i class="fas fa-store"></i>
        </span>
        <span class="texto">
          Vendas
        </span>
      </button>
      <button @click="goToPage('Pagamentos')" class="custom-button">
        <span class="icone">
          <i class="fas fa-money-bill-wave-alt"></i>
        </span>
        <span class="texto">
          Pagamentos
        </span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Inicio',
  methods: {
    goToPage(page) {
      this.$router.push({ name: page });
    }
  }
}
</script>

<style lang="scss">
#inicio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: url('~@/assets/images/BackgroundEntrar.png') no-repeat center center fixed;
  background-size: cover;

  .button-row {
    display: flex;
    gap: 40px; /* Aumenta o espaço horizontal entre os botões */
    justify-content: center;
    margin-bottom: 40px; /* Aumenta o espaço entre as linhas */
  }

  .custom-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border: none;
    border-radius: 12px;
    padding: 16px 32px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    font-size: 18px;
    font-weight: 500;
    color: #271e26;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 180px;
    height: 80px;
    text-align: center;

    .icone {
      margin-right: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    &:hover {
      background-color: rgba(235, 212, 232, 0.973);
      transform: translateY(-5px);
    }
  }
}
</style>
