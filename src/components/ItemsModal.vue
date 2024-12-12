<template>
  <div class="floatingvalues" @click.self="closeModal">
    <form @submit.prevent="CartSubmit">
      <div class="contentvalues">
        <div class="productdesc">
          <img :src="props.data.image" :alt="props.data.title" />
          <h1>{{ props.data.title }}</h1>
          <h4>{{ props.data.description }}</h4>
        </div>
        <div class="modal-styling">
          <div class="ItemConfig">
            <h3>Setting: </h3>
            <select v-model="SelectedConfig" name="Config" id="Configuration" required>
              <option v-for="config in props.data.setting" :key="config.setting" :value="config">
                {{ config.setting }}
              </option>
            </select>
          </div>
          <div class="ItemSize">
            <h3>Size: </h3>
            <select v-model="SelectedSize" name="Sizes" id="NormalLarge" required>
              <option v-for="size in props.data.sizes" :key="size.size" :value="size">
                {{ size.size }}
              </option>
            </select>
          </div>
          <div class="ItemQuantity">
            <div class="quantitytext">
              <h3>Quantity: </h3>
            </div>
            <div class="quantity-controls">
              <button type="button" @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
              <input type="number" class="quantityinput" v-model="quantity" min="1" max="10" readonly />
              <button type="button" @click="increaseQuantity" :disabled="quantity >= 10">+</button>
            </div>
          </div>
          <div class="ItemPrice">
            <h3>Total Price:</h3>
            <h3> ₱ {{ totalPrice }}</h3>
          </div>
          <button type="submit" class="movingcart">Add to Cart</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { defineEmits, ref, computed, defineProps, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['close', 'add-to-cart']);
const SelectedConfig = ref({});
const SelectedSize = ref({});
const quantity = ref(1);
const isLoggedIn = ref(false);
const userId = ref(null);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const closeModal = () => {
  emit('close');
};

const CartSubmit = async () => {
  const orderedProduct = {
    product_id: props.data.id,
    title: props.data.title,
    config: SelectedConfig.value.setting,
    configprice: SelectedConfig.value.price,
    size: SelectedSize.value.size,
    sizeprice: SelectedSize.value.price,
    quantity: quantity.value,
  };

  console.log("Submitting to cart:", orderedProduct); // Log the product details for debugging

  if (isLoggedIn.value && userId.value) {
    const token = localStorage.getItem('token');
    console.log("User is logged in, adding to backend cart...");
    try {
      const response = await axios.post('http://localhost:3000/add-to-cart', {
        userId: userId.value,
        productId: orderedProduct.product_id,
        config: orderedProduct.config,
        size: orderedProduct.size,
        quantity: orderedProduct.quantity,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Backend response:", response.data); // Log the backend response for debugging
    } catch (error) {
      console.error('Error adding to backend cart:', error); // Log error for debugging
    }
  } else {
    console.log("User is not logged in, adding to local storage cart...");
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(
      (cartItem) =>
        cartItem.product_id === orderedProduct.product_id &&
        cartItem.config === orderedProduct.config &&
        cartItem.size === orderedProduct.size
    );

    if (existingProduct) {
      existingProduct.quantity += orderedProduct.quantity;
    } else {
      cart.push(orderedProduct);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    console.log("Local storage cart updated:", cart); // Log the updated cart for debugging
  }

  emit('add-to-cart', orderedProduct);
  closeModal();
};

const increaseQuantity = () => {
  if (quantity.value < 10) {
    quantity.value += 1;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value -= 1;
  }
};

const totalPrice = computed(() => {
  return (
    (Number(SelectedSize.value.price || 0) +
      Number(SelectedConfig.value.price || 0)) *
    quantity.value
  );
});

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
  checkLoginStatus();
});
</script>


<style>
.floatingvalues {
  background: rgba(252, 237, 240, 0.3);
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 21;
}

.contentvalues {
  height: 90vh;
  width: 70vw;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  top: 0;
}

.productdesc {
  width: 40%;
  height: 100%;
  padding: 2vw 5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: rgb(283, 147, 83);
  box-sizing: border-box;
  border-top-left-radius: 2vh;
  border-bottom-left-radius: 2vh;
}

.modal-styling {
  width: 60%;
  height: 100%;
  padding: 2vh 5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1vw;
  background-color: rgb(283, 118, 50);
  box-sizing: border-box;
  border-top-right-radius: 2vh;
  border-bottom-right-radius: 2vh;
}

.modal-styling select {
  width: 100%;
  padding: 0.8vw;
  font-weight: bolder;
  text-align: center;
  color: brown;
  font-size: 1vw;
  background-color: #fcc38e;
  border-radius: 0.5vw;
  border: none;
}

.ItemConfig, .ItemSize, .ItemQuantity, .ItemPrice{
  width: 100%;
  box-sizing: border-box;
}

.ItemPrice{
  background-color: #fcc38e;
  border-radius: 0.5vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2vw;
}

.ItemQuantity{
background-color: #fcc38e;
border-radius: 0.5vw;
}

.quantitytext{
  padding: 1vw 2vw;
}

.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1vh;
  padding-bottom: 1vw;
}

.quantityinput{
  padding: 0.5vw 1vw;
  font-size: 1.5vw;
  text-align: center;
  color: brown;
  background-color: #fcc38e;
  border: none;
}

.quantityinput::-webkit-outer-spin-button,
.quantityinput::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-controls button {
  padding: 0.5vw 1vw;
  font-size: 1.5vw;
  border: none;
  color: brown;
  background-color: #fcc38e;
  cursor: pointer;
}

.quantity-controls button:disabled {
  background: #c29b78;
  cursor: not-allowed;
}

.movingcart {
  width: 100%;
  text-align: center;
  margin: 1vh 0;
  padding: 1.4vh;
  border-radius: 1.6vh;
  background: #fcc38e;
  border: none;
  cursor: pointer;
}

.productdesc img {
  width: 10vw;
  height: 26vh;
}

@media (max-width: 768px) {
  .contentvalues {
    width: 90vw;
    height: 70vh;
    border-radius: 5vw;
    flex-direction: column;
  }

  .modal-styling {
    align-items: center;
    flex-wrap: wrap;
    padding: 0 4vw;
  }

  .modal-styling select, .quantity-controls button, .quantity-controls input {
    padding: 2vh;
    font-size: 4vw;
    border-radius: 2vw;
  }

  .movingcart {
    width: 50vw;
    padding: 2vh;
    margin: 2vh;
    font-size: 4vw;
    border-radius: 2vw;
  }

  .productdesc {
    padding: 4vh 6vw;
  }

  .productdesc h4 {
    font-size: 5vw;
  }

  .contentvalues h1 {
    font-size: 6vw;
    margin-bottom: 3vh;
  }

  .contentvalues h3 {
    font-size: 5vw;
    margin: 2vh 0;
  }
}
</style>
