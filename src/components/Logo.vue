<template>
  <figure id="logo">
    
  </figure>
</template>

<script>
import logoSrc from '@/assets/images/shopping-bag.png';

export default {
  name: 'Logo',
  data() {
    return {
      logoSrc
    };
  }
}
</script>

<style lang="scss">
#logo {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  margin: auto;
  max-width: 150px; /* Ajuste o tamanho máximo aqui se necessário */
  margin-bottom: 30px;
  margin-top: 30px;

  img {
    width: 80%; /* Ajuste a largura da imagem para ser um tamanho médio */
    height: auto; /* Mantém a proporção da imagem */
  }
}
</style>
