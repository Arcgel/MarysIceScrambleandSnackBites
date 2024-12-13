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
    <div v-if="selectedOrder" class="order-details">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Config</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in selectedOrder" :key="item.title">
            <td>{{ item.title }}</td>
            <td>{{ item.config }}</td>
            <td>{{ item.size }}</td>
            <td>{{ item.quantity }}</td>
            <td>₱ {{ item.price }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="button-history" v-if="selectedOrder">
      <button class="reorder" @click="reorderSelected">Order Again</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const previousOrders = ref([]);
const selectedOrderIndex = ref(null);
const selectedOrder = ref(null);

const loadPreviousOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/previous-orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    previousOrders.value = groupOrdersByOrderId(response.data);
  } catch (error) {
    console.error('Error fetching previous orders:', error);
  }
};

const groupOrdersByOrderId = (orders) => {
  const groupedOrders = {};
  orders.forEach(order => {
    if (!groupedOrders[order.id]) {
      groupedOrders[order.id] = [];
    }
    groupedOrders[order.id].push(order);
  });
  return Object.values(groupedOrders);
};

const updateSelectedOrder = () => {
  selectedOrder.value = previousOrders.value[selectedOrderIndex.value];
};

const reorderSelected = async () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const orderItems = selectedOrder.value;

  if (orderItems && orderItems.length) {
    orderItems.forEach(orderItem => {
      const existingProduct = cart.find(cartItem =>
        cartItem.product_id === orderItem.product_id &&
        cartItem.config === orderItem.config &&
        cartItem.size === orderItem.size
      );

      if (existingProduct) {
        existingProduct.quantity += orderItem.quantity;
      } else {
        cart.push({
          product_id: orderItem.product_id,
          title: orderItem.title,
          config: orderItem.config,
          size: orderItem.size,
          quantity: orderItem.quantity,
          price: orderItem.price,
        });
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
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 5vh 2vw;
}

.orderchoice {
  padding: 2vh 8vw;
  border-radius: 3vh;
  border: none;
  background-color: #fcc38e;
}

.order-selection {
  margin-bottom: 20px;
}

.order-details {
  width: 100%;
  overflow-x: auto;
}

.order-details table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.order-details th, .order-details td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.order-details th {
  background-color: #fcc38e;
}

.order-details td {
  background-color: #fff;
}

.reorder {
  background-color: #fcc38e;
  padding: 0.4vw 1.6vw;
  border-radius: 0.4vw;
  border: none;
  cursor: pointer;
}

.button-history {
  margin-top: 10px;
}
</style>
