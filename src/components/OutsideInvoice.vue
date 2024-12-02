<script setup>
import html2pdf from 'html2pdf.js';

defineProps({
  cart: {
    type: Array,
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

const emit = defineEmits(['close', 'checkout']);

const closeModal = () => {
  emit('close');
}

const handleCheckout = () => {
  emit('checkout');
  closeModal();
}

const printpdf = () => {
  const element = document.getElementById('invoice');
  const opt = {
    margin: 1,
    filename: 'invoice.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().from(element).set(opt).save().then(() => {
    handleCheckout();
  });
}
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
          <div v-for="item in cart" :key="item.title" class="invoice-item">
            <h2>{{ item.title }}</h2>
            <p>Type: {{ item.config }}</p>
            <p>Size: {{ item.size }}</p>
            <p>Quantity: {{ item.quantity }}</p>
            <p>Price: ₱ {{ item.price }}</p>
          </div>
        </div>
      </div>
      <button @click="printpdf" class="save">Save as PDF</button>
    </div>
  </div>
</template>

<style>
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
}

.recieptinvoice {
  width: 90vw;
  max-width: 500px;
  max-height: 700px;
  background-color: antiquewhite;
  padding: 2vw;
  border-radius: 1vh;
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
