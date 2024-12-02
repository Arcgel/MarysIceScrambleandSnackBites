<template>
  <div class="summary">
    <h2>Previous Orders</h2>
    <div class="order-selection">
      <select v-model="selectedOrderIndex" @change="updateSelectedOrder" class="orderchoice">
        <option v-for="(order, index) in previousOrders" :key="index" :value="index">
          Order {{ index + 1 }}
        </option>
      </select>
    </div>
    <details v-if="selectedOrder">
      <summary>Order Details</summary>
      <div v-for="item in selectedOrder" :key="item.title" class="order-item">
        <h4>{{ item.title }}</h4>
        <p>Config: {{ item.config }}</p>
        <p>Size: {{ item.size }}</p>
        <p>Quantity: {{ item.quantity }}</p>
        <p>Price: ₱ {{ item.price }}</p>
      </div>
    </details>
    <div class="button-history" v-if="selectedOrder">
      <button class="reorder" @click="reorderSelected">Order Again</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const previousOrders = ref([]);
const selectedOrderIndex = ref(null);
const selectedOrder = ref(null);

const loadPreviousOrders = () => {
  const storedOrders = JSON.parse(localStorage.getItem('previousOrders')) || [];
  previousOrders.value = storedOrders;
};

const updateSelectedOrder = () => {
  selectedOrder.value = previousOrders.value[selectedOrderIndex.value];
};

const reorderSelected = () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const orderItems = selectedOrder.value;

  if (orderItems && orderItems.length) {
    orderItems.forEach(orderItem => {
      const existingProduct = cart.find(cartItem =>
        cartItem.title === orderItem.title &&
        cartItem.config === orderItem.config &&
        cartItem.size === orderItem.size
      );

      if (existingProduct) {
        existingProduct.quantity += orderItem.quantity;
      } else {
        cart.push({ ...orderItem });
      }
    });

    localStorage.setItem('cart', JSON.stringify(cart));
  }
};



onMounted(() => {
  loadPreviousOrders();
});
</script>

<style>
.summary {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;
  background-color: rgb(283, 147, 83);
  width: 70%;
  margin: 0 auto;
  padding: 5vw 2vh;
}

.orderchoice{
  padding: 2vh 8vw;
  border-radius: 3vh;
  border: none;
  background-color: #fcc38e;
}

.order-selection {
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.3vw;
  gap: 2vw;
}

.reorder{
  background-color: #fcc38e;
  padding: 0.4vw;
  border-radius: 0.4vw;

}

.button-history {
  margin-top: 10px;
  padding: 10px;
  color: #fcc38e;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
