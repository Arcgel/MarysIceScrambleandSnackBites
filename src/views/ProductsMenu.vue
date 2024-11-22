<template>
  <div class="containerProducts">

    <h1>PRODUCTS</h1>
    <div class="Error" v-if="error">{{ error }}</div>
    <div class="ProductHeader">
      <h2>Available Now:</h2>
    </div>
    <div class="Products" v-if="products.length">
      <div v-for="product in products" :key="product.id" @click="productdescription(product)">
        <div class="productShowcase">
          <div class="productimage">
            <img :src="product.image" alt="Products">
          </div>
          <div class="prodshowtext">
            <div class="text-design">
              <h3>{{ product.title }}</h3>
            <span v-for="sizes in product.Sizez" :key="sizes" class="prodsizes">
              <h5>{{ sizes }}</h5>
            </span>
            <span v-for="config in product.Setting" :key="config" class="prodsetting">
              <h5>{{ config }}</h5>
            </span>
          </div>
          </div>
        </div>
      </div>
    </div>
    <div class="else" v-else>Loading...</div>
    <ItemsModal v-if="selectedproduct" :data="selectedproduct" @close="closeModal"/>
  </div>


</template>

<script setup>
import ItemsModal from '../components/ItemsModal.vue';
import { ref } from 'vue'
const products = ref([])
const error = ref(null)


const scramble = async () => {
  try {
    let data = await fetch('http://localhost:3000/Product')
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

const selectedproduct = ref(null)
const showModal = ref(false)

const productdescription = (product) => {
  selectedproduct.value = product;
  showModal.value = true;
}

const closeModal = () => {
  showModal.value = false
  selectedproduct.value = null
}

</script>

<style>
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
  width: 18vw;
  height: 46vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* box-shadow: 0 0.4vh 0.6vh rgba(0, 0, 0, 0.8); */
}
.productimage{
  background-color: rgb(283, 147, 83);
  width: 100%;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 1.5vw;
  border-top-right-radius: 1.5vw;
}

.prodshowtext{
  background-color: rgb(283, 118, 35);
  width: 100%;
  height: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 1vw;
  border-bottom-right-radius: 1vw;
}

.producttitle h2 {
  padding: 0.6vw;
}

.productShowcase img {
  width: 10vw;
  height: 28vh;
}

.productShowcase:hover {
  text-align: center;
}

.productShowcase:hover .text-design .prodsizes{
  display: inline-block;
  margin-right: 0.5vw;
}
.productShowcase:hover .text-design .prodsetting{
  display: inline-block;
  margin-right: 0.5vw;
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

<style scoped>
h1 {
  font-size: 2vw;
}

h2 {
  font-size: 1.75vw;
}

h3 {
  font-size: 1.5vw;
}

h4 {
  font-size: 1.25vw;
}

h5 {
  font-size: 1vw;
}

h6 {
  font-size: 0.875vw;
}
</style>
