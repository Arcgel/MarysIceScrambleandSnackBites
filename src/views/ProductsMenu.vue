<template>
  <div class="containerProducts">
    <h1>PRODUCTS</h1>
    <div class="Error" v-if="error">{{ error }}</div>
    <div class="ProductHeader">
      <h2>Available Now:</h2>
    </div>
    <div class="Products" v-if="products.length">
      <div v-for="product in products" :key="product.id" class="Reactive" @click="productdescription(product)">
        <div class="productShowcase">
          <div class="productimage">
            <img :src="product.image" alt="Products">
          </div>
          <div class="prodshowtext">
            <div class="text-design">
              <div class="heart-icon" @click.passive="toggleFavorite(product)">
                  <i :class="['fa-heart', isFavorite(product) ? 'fas' : 'far']"></i>
              <div class="title-row">
                <h3>{{ product.title }}</h3>
              </div>
            </div>
            <span v-for="sizes in product.sizes" :key="sizes" class="prodsizes">
              <h5>{{ sizes.size }}</h5>
            </span>
            <span v-for="config in product.setting" :key="config" class="prodsetting">
              <h5>{{ config.setting }}</h5>
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
    let data = await fetch('http://localhost:3000/products')
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

const toggleFavorite = (product) => {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const index = favorites.findIndex(fav => fav.id === product.id);

  if (index === -1) {
    favorites.push(product);
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
}

const isFavorite = (product) => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  return favorites.some(fav => fav.id === product.id);
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
  justify-content: center;
  gap: 12px;
}

.containerProducts .ProductHeader {
  padding: 19px;
}

.productShowcase {
  width: 246px;
  height: 353px;
  min-width: 224px;
  max-width: 400px;
  min-height: 272px;
  max-height: 288px;
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
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.prodshowtext{
  background-color: rgb(283, 118, 35);
  width: 100%;
  height: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
}

.prodshowtext .heart-icon {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 14px;
}

.producttitle h2 {
  padding: 8px;
}

.productShowcase img {
  width: 135px;
  height: 170px;
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
  font-size: 27px;
}

h2 {
  font-size: 24px;
}

h3 {
  font-size: 20px;
}

h4 {
  font-size: 17px;
}

h5 {
  font-size: 14px;
}

h6 {
  font-size: 12px;
}

@media (max-width: 768px){

  .productShowcase {
  width: 20vw;
  height: 48vh;
  min-width: 19rem;
  max-width: 25rem;
  min-height: 22rem;
  max-height: 20rem;
  }

  .productShowcase img {
    width: 30vw;
    height: 48vh;
    object-fit: contain;
  }

  h1 { font-size: 6vw; }
  h2 { font-size: 5vw; }
  h3 { font-size: 6vw; }
  h4 { font-size: 3.5vw; }
  h5 { font-size: 3vw; }
  h6 { font-size: 2.5vw; }

  .prodshowtext {
    border-radius: 0 0 2vw 2vw;

    .heart-icon {
    font-size: 5vw;
  }
  }
}



/* Add this to your existing media query */
@media (max-width: 768px) {

}

</style>
