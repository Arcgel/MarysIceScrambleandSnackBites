<template>
  <div class="containerProducts">
    <h1>PRODUCTS</h1>
    <div class="Error" v-if="error">{{ error }}</div>
    <div class="ProductHeader">
        <h2>Scramble:</h2>
      </div>
    <div class="Products" v-if="products.length">
      <div v-for="product in products" :key="product.id">
        <div class="productShowcase">
          <h2>{{ product.title }}</h2>
          <div class="text-design">
            <span v-for="sizes in product.Sizez" :key="sizes">
            <h5>{{ sizes }}</h5>
          </span>
          <span v-for="config in product.Setting" :key="config">
            <h5>{{ config }}</h5>
          </span>
          </div>
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


const scramble = async () => {
  try {
    let data = await fetch('http://localhost:3000/Scramble')
    console.log(data)
    if (!data.ok) {
      throw error('no data available')
    }
    products.value = await data.json()
  }
  catch (err) {
    error.value = err.message
    console.log(error.value)
  }
}

scramble()

</script>

<style >
.containerProducts {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(252, 237, 240, 1);
}

.Products {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 1.6vh;
}

.containerProducts .ProductHeader {
  padding: 1.4vw;
}

.productShowcase {
  width: 17vw;
  height: 37vh;
  padding: 2vh;
  border-radius: 1vw;
  background-color: chocolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.4vh 0.6vh rgba(0, 0, 0, 0.8);
}

.producttitle h2{
  padding: 0.6vw;
}

.productShowcase img {
  width: 10vw;
  height: 28vh;
}

.productShowcase:hover {
  background-color: coral;
}

.productShowcase:hover .text-design span{
  display: inline-block;
  margin-right:0.2vw;
}

.productShowcase span {
  display: none;
}

.productShowcase span {
  display: none;
}

.productShowcase h1,
h2,
h3,
h4,
h5,
h6 {
  padding: 0;
  margin: 0;
}

.ScrambleTitle {
  display: flex;
  align-items: start
}


</style>
