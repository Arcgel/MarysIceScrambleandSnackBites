<template>
  <div class="cart-container">
    <div class="shopping-cart">
      <h2>Shopping Cart</h2>
      <h3>{{ cart.length }} Items</h3>
      <div class="cart-item" v-for="item in cart" :key="item.title">
        <div class="item-details">
          <p>{{ item.title }}</p>
          <p>Configuration: {{ item.config }}</p>
          <p>Size: {{ item.size }}</p>
        </div>
        <div class="item-quantity">
          <p>{{ item.quantity }}</p>
        </div>
        <div class="item-price">
          <p>₱ {{ calculateTotalPrice(item) }}</p>
        </div>
        <button @click="removeFromCart(item.title, item.config, item.size)" class="remove">
          <img src="../images/trash.png" alt="Remove">
        </button>
      </div>
      <router-link to="/Menu" class="continue-shopping">Continue Shopping</router-link>
    </div>
    <div class="order-summary">
      <h2>Order Summary</h2>
      <p>Items: {{ cart.length }}</p>
      <p>Total Items Cost: ₱ {{ calculateTotalCartPrice() }}</p>
      <p>Shipping: Pickup</p>
      <p>Total Cost: ₱ {{ calculateTotalCartPrice() + 50 }}</p>
      <button class="Checkout" @click="openModal">Checkout</button>
    </div>
    <OutsideInvoice v-if="showModal" :cart="cart" @close="closeModal" @checkout="handleCheckout"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import OutsideInvoice from '../components/OutsideInvoice.vue';

const cart = ref([]);
const showModal = ref(false);
const previousOrders = ref([]);

const openModal = () => {
  showModal.value = true;
}

const closeModal = () => {
  showModal.value = false;
}

const loadCart = () => {
  const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.value = storedCart;
};

const removeFromCart = (title, config, size) => {
  const item = cart.value.find(cartItem =>
    cartItem.title === title &&
    cartItem.config === config &&
    cartItem.size === size
  );

  if (item) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      cart.value = cart.value.filter(cartItem =>
        !(cartItem.title === title && cartItem.config === config && cartItem.size === size)
      );
    }
    localStorage.setItem('cart', JSON.stringify(cart.value));
  }
};

const calculateTotalPrice = (item) => {
  const totalPrice = (Number(item.configprice) + Number(item.configsize)) * item.quantity;
  item.price = totalPrice;
  localStorage.setItem('cart', JSON.stringify(cart.value));
  return totalPrice;
};

const calculateTotalCartPrice = () => {
  return cart.value.reduce((total, item) => total + calculateTotalPrice(item), 0);
}

const handleCheckout = () => {
  const order = [...cart.value];
  const oldorder = JSON.parse(localStorage.getItem('previousOrders')) || []
  previousOrders.value = oldorder
  oldorder.push(order)
  localStorage.setItem('previousOrders', JSON.stringify(previousOrders.value));
  cart.value = [];
  localStorage.setItem('cart', JSON.stringify(cart.value));
  closeModal();
}

onMounted(() => {
  loadCart();
});
</script>

<style>
.cart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2vw;
  color: white;
  font-weight: 600;
  letter-spacing: 0.1vw;
  text-shadow: 5vw;
}

.shopping-cart, .order-summary {
  width: 70vw;
  padding: 5vh;
  background-color: rgb(283, 147, 83);
  border-radius: 2vh;
  box-shadow: 0 0 1vw rgba(0, 0, 0, 0.1);
}

.shopping-cart h2, .order-summary h2 {
  margin-bottom: 2vh;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
}

.item-details {
  width: 40vw;
}

.item-quantity, .item-price, .item-total {
  width: 10vw;
  text-align: center;
}

.remove {
  background: none;
  border: none;
  cursor: pointer;
}

.remove img {
  width: 3vh;
  height: 3vh;
}

.continue-shopping {
  display: block;
  margin-top: 2vh;

  text-decoration: none;
}

.order-summary p {
  margin: 1vh 0;
}

.promo-code {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2vh 0;
}

.promo-code input {
  flex: 1;
  padding: 1vh;
  margin-right: 1vh;
}

.promo-code button {
  padding: 1vh 2vh;
}

.order-summary button{
  width: 100%;
  padding: 2vh;
  margin: 0 auto;
  background-color: antiquewhite;
  color: black;
  border: none;
  cursor: pointer;
}

@media (max-width: 768px) {
  .cart-container {
    flex-direction: column;
  }

  .shopping-cart, .order-summary {
    width: 100%;
    margin-bottom: 2vh;
  }

  .item-details, .item-quantity, .item-price, .item-total {
    width: auto;
    text-align: left;
  }

  .remove img {
    width: 4vh;
    height: 4vh;
  }
}
</style>
