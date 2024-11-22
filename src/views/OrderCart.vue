// Cart.vue
<script setup>
import { ref, onMounted } from 'vue';

const cart = ref([]);

const loadCart = () => {
  const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.value = storedCart;
};

const removeFromCart = (title) => {
  const item = cart.value.find(cartItem => cartItem.title === title)
  if (item) { if (item.quantity > 1)
    { item.quantity--;
    } else {
    cart.value = cart.value.filter(cartItem => cartItem.title !== title);
  } localStorage.setItem('cart', JSON.stringify(cart.value)); } };

onMounted(() => {
  loadCart();
});
</script>

<template>
  <div>
    <div v-if="cart.length">
      <div v-for="item in cart" :key="item.title" class="productplacement">
        <h2>{{ item.title }}</h2>
        <p>Configuration: {{ item.config }}</p>
        <p>Size: {{ item.size }}</p>
        <p>Quantity: {{ item.quantity }}</p>
        <button @click="removeFromCart(item.title)" class="remove"><img src="../images/trash.png" alt="Remove"></button>
      </div>
    </div>
    <div v-else>
      <p>Your cart is empty.</p>
    </div>
  </div>
</template>

<style>
.productplacement {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 80%;
  border-radius: 2vw;
  margin: 0 auto;
  padding: 1vw;
  background-color: chocolate;
  color: antiquewhite;
}
.remove img{
  width: 2vw;
  height: 2vw;
  background: none  ;
  color: none;
}
</style>
