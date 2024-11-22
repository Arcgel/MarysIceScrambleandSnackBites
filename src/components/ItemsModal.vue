<template>
  <div class="floatingvalues" @click.self="closeModal">
    <form @submit.prevent="CartSubmit">
      <div class="contentvalues">
        <h1>{{ props.data.title }}</h1>
        <div class="ModalStyling">
          <select v-model="SelectedConfig" name="Config" id="Configuration">
            <option v-for="config in props.data.Setting" :key="config" :value="config">{{ config }}</option>
          </select>
          <select v-model="SelectedSize" name="Sizes" id="NormalLarge">
            <option v-for="size in props.data.Sizez" :key="size" :value="size">{{ size }}</option>
          </select>
          <input class="orderquantity" type="number" v-model="quantity" min="1" placeholder="quantity" required>
        </div>
        <div class="productdesc">
            <h4>{{ props.data.Description }}</h4>
          </div>
        <button type="submit" class="movingcart">Add to Cart</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import { ref } from 'vue';

const emit = defineEmits(['close', 'add-to-cart'])

const SelectedConfig = ref('Overload')
const SelectedSize = ref('12oz')
const quantity = ref(1)

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const closeModal = () => {
  emit('close')
}

const CartSubmit = () => {
  const orderedproduct = {
    title: props.data.title,
    config: SelectedConfig.value,
    size: SelectedSize.value,
    quantity: quantity.value
  }
let cart = JSON.parse(localStorage.getItem('cart')) || []
const existingproduct = cart.find(cartItem =>
  cartItem.title === orderedproduct.title &&
  cartItem.config === orderedproduct.config &&
  cartItem.size === orderedproduct.size
)
if (existingproduct){
  existingproduct.quantity += orderedproduct.quantity
}else{
  cart.push(orderedproduct)
}
localStorage.setItem('cart',JSON.stringify(cart))

emit('add-to-cart', orderedproduct)
closeModal()
}

</script>

<style>
.floatingvalues {
  background: rgba(252, 237, 240, 0.3);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
}

.contentvalues {
  height: 80vh;
  width: 30vw;
  border-radius: 3vw;
  background-color: rgb(283, 147, 83);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ModalStyling {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1vw
}

.ModalStyling #Configuration,
#NormalLarge {
  padding: 0.8vw;
  font-weight: bolder;
  color: chocolate;
  background-color: #fcc38e;
  border-radius: 0.5vw;
}
.movingcart{
  width: 12vw;
  text-align: center;
  margin: 1vh;
  padding: 1.4vh;
  border-radius: 1.6vh;
  background: #fcc38e;
}
.orderquantity {
  width: 3vw;
  padding: 0.8vw;
  text-align: center;
  border-radius: 0.5vw;
  background: #fcc38e;
  color: chocolate;
}
.productdesc{
  padding: 2vw 5vw;
  text-align: center;
}
</style>
