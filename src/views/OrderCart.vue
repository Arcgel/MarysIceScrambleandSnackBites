<template>
  <div class="cart-container">
    <div class="shopping-cart">
      <h2>Shopping Cart</h2>
      <h3>{{ cart.length }} Items</h3>
      <div class="cart-item" v-for="item in cart" :key="item.product_id">
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
        <button @click="removeFromCart(item)" class="remove">
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
      <p>Total Cost: ₱ {{ calculateTotalCartPrice() }}</p>
      <button class="Checkout" @click="confirmPurchase">Checkout</button>
      <p v-if="showPrompt" class="prompt">Please double-click to confirm your purchase</p>
      <OutsideInvoice v-if="showInvoice" :userId="userId" @close="closeInvoice" @print="handlePrintInvoice" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import OutsideInvoice from '../components/OutsideInvoice.vue';

const cart = ref([]);
const initialCartState = ref([]);
const isLoggedIn = ref(false);
const userId = ref(null);
const products = ref({});
const showInvoice = ref(false);
const showPrompt = ref(false);
let clickTimeout = null;

const fetchProductDetails = async () => {
  try {
    const response = await axios.get('http://localhost:3000/products');
    products.value = response.data.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});
    console.log("Fetched product details:", products.value); // Log fetched product details for debugging
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
};

const syncCartWithBackend = async () => {
  if (isLoggedIn.value && userId.value) {
    console.log("Syncing local storage cart with backend...");
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const token = localStorage.getItem('token');
    for (const item of storedCart) {
      try {
        const response = await axios.post('http://localhost:3000/add-to-cart', {
          userId: userId.value,
          productId: item.product_id,
          config: item.config,
          size: item.size,
          quantity: item.quantity,
          price: calculateTotalPrice(item)
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Item synced:", response.data); // Log response for debugging
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
    localStorage.removeItem('cart'); // Clear local storage after syncing
  }
};

const loadCart = async () => {
  if (isLoggedIn.value && userId.value) {
    const token = localStorage.getItem('token');
    try {
      // Load cart from backend
      const response = await axios.get(`http://localhost:3000/cart/${userId.value}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      cart.value = response.data.map(item => {
        const product = products.value[item.product_id];
        return {
          ...item,
          title: product ? product.title : 'Unknown Product',
        };
      });
      initialCartState.value = JSON.parse(JSON.stringify(cart.value)); // Store initial cart state
      console.log("Loaded cart from backend:", cart.value); // Log the loaded cart for debugging
    } catch (error) {
      console.error('Error loading cart from backend:', error); // Log error for debugging
    }
  } else {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.value = storedCart.map(item => {
      const product = products.value[item.product_id];
      return {
        ...item,
        title: product ? product.title : 'Unknown Product',
        price: calculateTotalPrice(item) // Ensure price is calculated and stored
      };
    });
    initialCartState.value = JSON.parse(JSON.stringify(cart.value)); // Store initial cart state
    console.log("Loaded cart from local storage:", cart.value); // Log the loaded cart for debugging
  }
};

const removeFromCart = async (item) => {
  const index = cart.value.findIndex(cartItem =>
    cartItem.product_id === item.product_id &&
    cartItem.config === item.config &&
    cartItem.size === item.size
  );

  if (index !== -1) {
    if (cart.value[index].quantity > 1) {
      cart.value[index].quantity--;
    } else {
      cart.value.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart.value));
  }

  if (isLoggedIn.value && userId.value) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3000/remove-from-cart', {
        userId: userId.value,
        productId: item.product_id,
        config: item.config,
        size: item.size,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Item removed:", response.data); // Log response for debugging
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  }
};

const calculateTotalPrice = (item) => {
  const product = products.value[item.product_id];
  if (!product) return 0;

  const configPrice = product.setting.find(config => config.setting === item.config)?.price || 0;
  const sizePrice = product.sizes.find(size => size.size === item.size)?.price || 0;
  return (configPrice + sizePrice) * item.quantity;
};

const calculateTotalCartPrice = () => {
  return cart.value.reduce((total, item) => total + (item.price || calculateTotalPrice(item)), 0);
};

const confirmPurchase = () => {
  if (clickTimeout) {
    clearTimeout(clickTimeout);
    showInvoice.value = true;
    showPrompt.value = false;
  } else {
    showPrompt.value = true;
    clickTimeout = setTimeout(() => {
      showPrompt.value = false;
      clickTimeout = null;
    }, 2000);
  }
};

const handlePrintInvoice = () => {
  cart.value = [];
  localStorage.removeItem('cart');
  showInvoice.value = false;
};

const closeInvoice = () => {
  cart.value = JSON.parse(JSON.stringify(initialCartState.value)); // Revert cart to initial state
  showInvoice.value = false;
};

const checkLoginStatus = async () => {
  const token = localStorage.getItem('token');
  console.log("Checking login status...");
  if (token) {
    try {
      const response = await axios.get('http://localhost:3000/verify-token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Login status response:", response.data); // Log response data for debugging
      if (response.status === 200) {
        isLoggedIn.value = true;
        userId.value = response.data.userId;
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      isLoggedIn.value = false;
    }
  }
};

onMounted(() => {
  checkLoginStatus().then(() => {
    syncCartWithBackend().then(() => {
      fetchProductDetails().then(() => {
        loadCart(); // Load cart after fetching product details
      });
    });
  });
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

.order-summary button {
  width: 100%;
  padding: 2vh;
  margin: 0 auto;
  background-color: antiquewhite;
  color: black;
  border: none;
  cursor: pointer;
}

.prompt {
  color: red;
  font-weight: bold;
  margin-top: 2vh;
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
