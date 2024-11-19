<template>
  <main>
    <div>
      <NavBar/>
    </div>
    <div>
      <ProductsMenuModal/>
    </div>
  </main>

</template>

<script setup>
import NavBar from '../components/NavbarModal.vue'
import ProductsMenuModal from '../components/ProductsMenuModal.vue';

</script>

<style>
  main {
    display: flex;
    flex-direction: column;
  }
</style>
