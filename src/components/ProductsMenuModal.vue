<template>
  <div class="containerProducts">
    <h1>PRODUCTS</h1>
  <div class="Error" v-if="error">{{ error }}</div>
  <div class="Products" v-if="products.length">
    <div v-for="product in products" :key="product.id">
      <div class="productShowcase">
        <h2>{{ product.title }}</h2>
        <span v-for="sizes in product.Sizez" :key="sizes">
          <h5>{{ sizes }}</h5>
        </span>
        <span v-for="config in product.Setting" :key="config">
          <h5>{{ config }}</h5>
        </span>
      </div>
    </div>
  </div>
  <div class="else" v-else>Loading...</div>
  </div>


</template>

<script setup>
import { ref } from 'vue'
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

load()

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
    height: 40vh;
    padding: 2vh;
    border-radius: 1vw;
    background-color: chocolate;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0.4vh 0.6vh rgba(0, 0, 0, 0.8);
  }
  .productShowcase h1,h2,h3,h4,h5,h6 {
    padding: 0;
    margin: 0;
  }

</style>
