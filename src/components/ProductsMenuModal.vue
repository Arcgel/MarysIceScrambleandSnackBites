<template>
  <div class="containerProducts">
    <h1>Products</h1>
  <div class="Error" v-if="error">{{ error }}</div>
  <div class="Products" v-if="products.length">
    <div v-for="product in products" :key="product.id">
      <div class="productShowcase">
        {{ product.title }}
        {{ product.Sizez }}
      </div>
    </div>
  </div>
  <div class="else" v-else>Loading...</div>
  </div>


</template>

<script setup>
import { ref } from 'vue';
const products = ref([])
const error = ref(null)

 const load = async () => {
  try{
    let data = await fetch('http://localhost:3000/Products')
    console.log(data)
    if(!data.ok){
      throw error('no data available')
    }
    products.value = await data.json()
  }
  catch(err) {
    error.value = err.message
    console.log(error.value)
  }
}

load();

</script>

<style >
  .containerProducts{
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 100px;
  }
  .Products{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1.6vh;
  }
  .productShowcase{
    width: 17vw;
    height: 30vh;
    padding: 2vh;
    border-radius: 1vw;
    background-color: chocolate;
  }

</style>
