// Cart.vue
<script setup>
import { ref, onMounted } from 'vue';

const cart = ref([]);

const loadCart = () => {
  const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.value = storedCart;
};

const removeFromCart = (title, config, size) => {
  const item = cart.value.find(cartItem =>
  cartItem.title === title &&
  cartItem.config === config &&
  cartItem.size === size)

  if (item) { if (item.quantity > 1)
    { item.quantity--;
    } else {
    cart.value = cart.value.filter(cartItem =>
    !(cartItem.title === title && cartItem.config === config && cartItem.size === size));
  }
  localStorage.setItem('cart', JSON.stringify(cart.value)); } };

onMounted(() => {
  loadCart();
});
</script>

<template>
  <div>
    <div v-if="cart.length">
      <div v-for="item in cart" :key="item.title" class="productplacement">
        <h2>{{ item.title }}</h2>
        <h4>Configuration: {{ item.config }}</h4>
        <h4>Size: {{ item.size }}</h4>
        <h4>Quantity: {{ item.quantity }}</h4>
        <button @click="removeFromCart(item.title, item.config, item.size)" class="remove"><img src="../images/trash.png" alt="Remove"></button>
      </div>
    </div>
    <div class="CartLoading" v-else>
      <h1>Your cart is empty.</h1>
    </div>
  </div>
</template>

<style>
.productplacement {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  border-radius: 2vw;
  margin:  3vh auto;
  padding: 3vh 7vw;
  background-color: chocolate;
  color: antiquewhite;
}
.remove img{
  width: 2vw;
  height: 2vw;
  background: none  ;
  color: none;
}
.CartLoading{
  height: 70vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
