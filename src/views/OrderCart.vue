// Cart.vue
<script setup>
import { ref, onMounted } from 'vue';

const cart = ref([]);

const loadCart = () => {
  const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.value = storedCart;
};

const removeFromCart = (title) => {
  cart.value = cart.value.filter(item => item.title !== title);
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

onMounted(() => {
  loadCart();
});
</script>

<template>
  <div>
    <div v-if="cart.length">
      <div v-for="item in cart" :key="item.title"  class="productplacement">
        <h2>{{ item.title }}</h2>
        <p>Configuration: {{ item.config }}</p>
        <p>Size: {{ item.size }}</p>
        <p>Quantity: {{ item.quantity }}</p>
        <button @click="removeFromCart(item.title)">Remove</button>
      </div>
    </div>
    <div v-else>
      <p>Your cart is empty.</p>
    </div>
  </div>
</template>

<style>
.productplacement{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
}
</style>
