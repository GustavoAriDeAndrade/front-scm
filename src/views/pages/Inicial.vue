<template>
  <div id="inicio">
    <!-- Os botões foram removidos daqui -->
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
  background-color: #FFFFFF;
  background-size: cover;
}
</style>
