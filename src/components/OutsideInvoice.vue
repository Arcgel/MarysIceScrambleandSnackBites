<script setup>
import { ref, onMounted } from 'vue';
import html2pdf from 'html2pdf.js';
import axios from 'axios';

const props = defineProps({
  userId: {
    type: Number,
    required: true
  }
});

const now = new Date();
const date = now.toLocaleString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric"
});
const time = now.toLocaleString("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
});

const emit = defineEmits(['close', 'print']);

const cart = ref([]);
const products = ref({});
const totalPrice = ref(0);

const closeModal = () => {
  emit('close');
};

const loadCart = async () => {
  try {
    const token = localStorage.getItem('token');

    // Fetch cart items
    const cartResponse = await axios.get(`http://localhost:3000/cart/${props.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    cart.value = cartResponse.data;

    // Fetch product details
    const productResponse = await axios.get('http://localhost:3000/products', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    products.value = productResponse.data.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});

    // Calculate total price and update cart with product details
    totalPrice.value = cart.value.reduce((acc, item) => {
      const product = products.value[item.product_id];
      const configPrice = product?.setting.find(config => config.setting === item.config)?.price || 0;
      const sizePrice = product?.sizes.find(size => size.size === item.size)?.price || 0;
      const itemPrice = (configPrice + sizePrice) * item.quantity;
      item.price = itemPrice;
      item.title = product?.title || 'Unknown Product';
      return acc + itemPrice;
    }, 0);

  } catch (error) {
    console.error('Error loading cart:', error);
  }
};

const commitOrder = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:3000/checkout', {
      userId: props.userId,
      cartItems: cart.value,
      total: totalPrice.value
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data.orderId;
  } catch (error) {
    console.error('Error committing order:', error);
    return null;
  }
};

const printpdf = async () => {
  const orderId = await commitOrder();
  if (!orderId) {
    console.error('Error: Order could not be committed.');
    return;
  }

  const element = document.getElementById('invoice');
  const opt = {
    margin: 1,
    filename: 'invoice.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().from(element).set(opt).save().then(() => {
    emit('print');
  });
};

onMounted(() => {
  loadCart();
});
</script>

<template>
  <div class="recieptbackground" @click.self="closeModal">
    <div class="recieptinvoice">
      <div class="invoice" id="invoice">
        <div class="invoice-header">
          <h1>Mary's Ice Scramble and Sweets</h1>
          <p>{{ date }}</p>
          <p>{{ time }}</p>
        </div>
        <div class="invoice-body">
          <div v-for="item in cart" :key="item.product_id" class="invoice-item">
            <h2>{{ item.title }}</h2>
            <p>Type: {{ item.config }}</p>
            <p>Size: {{ item.size }}</p>
            <p>Quantity: {{ item.quantity }}</p>
            <p>Price: ₱ {{ item.price }}</p>
          </div>
        </div>
        <div class="total-price">
          <h3>Total Price: ₱ {{ totalPrice }}</h3>
        </div>
        <button @click="printpdf" class="save">Save as PDF</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recieptbackground {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  color: black;
  overflow-y: scroll;
  z-index: 22;
}

.recieptinvoice {
  width: 90vw;
  max-width: 500px;
  background-color: antiquewhite;
  padding: 2vw;
  margin: 2vh;
  border-radius: 1vh;
  align-self: self-start;
}

.invoice-header {
  text-align: center;
  margin-bottom: 2vh;
}

.invoice-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.invoice-body {
  width: 100%;
}

.invoice-item {
  border-bottom: 0.1vh solid #ccc;
  padding: 1vh 0;
}

.invoice-item h2 {
  margin: 0 0 0.5vh;
}

.invoice-item p {
  margin: 0.5vh 0;
}

.total-price {
  margin-top: 2vh;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
}

.save {
  margin-top: 2vh;
  padding: 1vh 2vh;
  background-color: #fcc38e;
  color: white;
  border: none;
  border-radius: 1vh;
  cursor: pointer;
}

@media print {
  .recieptbackground {
    background-color: transparent;
    position: static;
    box-shadow: none;
  }

  .recieptinvoice {
    width: 100vw;
    max-width: none;
    background-color: white;
    padding: 0;
    border-radius: 0;
    box-shadow: none;
    page-break-after: always;
  }

  .invoice-header,
  .invoice-body {
    width: 100%;
    padding: 0 2vw;
  }

  .invoice-item {
    border: none;
    padding: 0;
    page-break-inside: avoid;
  }
}
</style>
